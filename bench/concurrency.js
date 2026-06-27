/**
 * Concurrency Stress Suite for TEJAS-NEXT
 * 
 * Target:
 * - 10 concurrent threads
 * - 100 operations per thread (1000 total operations)
 * - Concurrent writes (logTask) and reads (search) on the same SQLite database
 * - Validates WAL mode and busy_timeout resilience
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

// Mock EmbeddingService to bypass local CPU-heavy ONNX model loading/inference during benchmarks.
// This allows stress testing pure SQLite locking & transactional concurrency.
const EmbeddingService = require('../src/core/embeddings');
EmbeddingService.prototype.embed = async () => new Float32Array(384);
EmbeddingService.prototype.initialize = async () => {};

const STRESS_DIR = path.join(os.tmpdir(), 'tejas_sqlite_stress');

if (isMainThread) {
    const NUM_THREADS = 10;
    const OPS_PER_THREAD = 100;
    const TOTAL_OPS = NUM_THREADS * OPS_PER_THREAD;

    console.log(`🚀 Starting REAL SQLite Concurrency Stress Test...`);
    console.log(`Directory: ${STRESS_DIR}`);
    console.log(`Threads: ${NUM_THREADS}, Ops/Thread: ${OPS_PER_THREAD} (Total tasks: ${TOTAL_OPS})`);

    const runStressTest = async () => {
        // 1. Prepare directory and initialize DB schema
        await fs.remove(STRESS_DIR);
        await fs.ensureDir(STRESS_DIR);

        const MemoryManager = require('../src/core/memory');
        const mem = new MemoryManager(STRESS_DIR);
        await mem.initialize();
        
        // Close db connection in main thread to release lock
        if (mem.db && mem.db.db) {
            mem.db.db.close();
        }

        let completed = 0;
        let failed = 0;
        const errors = [];
        const start = Date.now();

        const workers = [];
        for (let i = 0; i < NUM_THREADS; i++) {
            workers.push(new Promise((resolve) => {
                const worker = new Worker(__filename, {
                    workerData: { threadId: i, ops: OPS_PER_THREAD, dir: STRESS_DIR }
                });

                worker.on('message', (msg) => {
                    completed += msg.completed;
                    failed += msg.failed;
                    if (msg.errors && msg.errors.length) {
                        errors.push(...msg.errors);
                    }
                });

                worker.on('error', (err) => {
                    failed += OPS_PER_THREAD;
                    errors.push(err.message);
                });

                worker.on('exit', () => {
                    resolve();
                });
            }));
        }

        await Promise.all(workers);

        const end = Date.now();
        const duration = end - start;

        // Verify final database state
        const verMem = new MemoryManager(STRESS_DIR);
        await verMem.initialize();
        const tasksCount = verMem.db.db.prepare('SELECT count(*) as count FROM tasks').get().count;

        console.log('\n📊 Stress Test Results:');
        console.log(JSON.stringify({
            expected_tasks: TOTAL_OPS,
            inserted_tasks: tasksCount,
            completed_operations: completed,
            failed_operations: failed,
            lost_operations: TOTAL_OPS - completed,
            duration_ms: duration,
            avg_op_ms: completed > 0 ? (duration / completed).toFixed(2) : 0,
            errors: errors.slice(0, 5) // Show first few errors if any
        }, null, 2));

        await verMem.db.db.close();
        await fs.remove(STRESS_DIR);

        const success = (failed === 0 && tasksCount === TOTAL_OPS);
        process.exit(success ? 0 : 1);
    };

    runStressTest().catch(err => {
        console.error('Stress test crashed:', err);
        process.exit(1);
    });

} else {
    // Worker Thread Logic
    const MemoryManager = require('../src/core/memory');
    
    const runWorker = async () => {
        const { threadId, ops, dir } = workerData;
        const mem = new MemoryManager(dir);
        await mem.initialize();

        let completed = 0;
        let failed = 0;
        const errors = [];

        for (let i = 0; i < ops; i++) {
            try {
                // Perform a write
                await mem.logTask({
                    task: `Thread ${threadId} task ${i} execution - stress testing sqlite concurrency`,
                    agent: `agent-${threadId}`,
                    success: true,
                    duration_ms: Math.floor(Math.random() * 50)
                });

                // Perform a read
                await mem.search(`Thread ${threadId}`);
                
                completed++;
            } catch (err) {
                failed++;
                errors.push(`[Thread ${threadId} Op ${i}] ${err.message}`);
            }
        }

        // Close db connection to clean up
        if (mem.db && mem.db.db) {
            mem.db.db.close();
        }

        parentPort.postMessage({ completed, failed, errors });
    };

    runWorker().catch(err => {
        parentPort.postMessage({ completed: 0, failed: workerData.ops, errors: [err.message] });
    });
}
