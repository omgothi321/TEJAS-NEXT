'use strict';
const { monitorEventLoopDelay } = require('perf_hooks');

class ReliabilityMonitor {
  constructor() {
    this.h = monitorEventLoopDelay({ resolution: 10 });
    this.h.enable();
  }

  getMetrics() {
    return {
      p95: this.h.percentile(95),
      p99: this.h.percentile(99),
      mem: process.memoryUsage()
    };
  }

  checkGates() {
    const m = this.getMetrics();
    const status = m.p99 > 250000000 ? 'FAIL' : (m.p99 > 100000000 ? 'WARN' : 'PASS');
    
    const output = {
      gate: 'event_loop',
      p95_ms: m.p95 / 1e6,
      p99_ms: m.p99 / 1e6,
      status: status
    };
    
    console.log(JSON.stringify(output));
    if (status === 'FAIL') {
      console.error(`[Reliability Gate Failed] ${JSON.stringify(output)}`);
    }
    return output;
  }
}
module.exports = new ReliabilityMonitor();
