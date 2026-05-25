'use strict';

const Executor = require('./executor');
const SystemStatusAgent = require('../agents/system.agent');

/**
 * Autonomous Agentic Loop
 * Maintains state, observes feedback, and corrects until goal achieved.
 */
class AgenticLoop {
  constructor(executor, reasoner, aiEngine, memory) {
    this.executor = executor;
    this.reasoner = reasoner;
    this.ai       = aiEngine;
    this.memory   = memory;
    this.system   = new SystemStatusAgent(memory);
    this.maxLoops = 5;
  }

  async run(goal, options = {}) {
    let loopCount = 0;
    let state = { goal, status: 'PLANNING', history: [] };

    // Train on real-time data immediately
    await this.system.getRealTimeContext();

    console.log(`\n  [Loop] Starting goal: ${goal}`);
    while (state.status !== 'COMPLETE' && loopCount < this.maxLoops) {
      console.log(`\n  [Loop] Iteration ${loopCount + 1}/${this.maxLoops}`);
      
      // 1. System 2 Reasoning: Generate & Select best strategy
      const strategyObj = await this.reasoner.solve(state.goal, state.history);
      const strategyText = strategyObj.strategy;
      
      // 2. Decompose strategy into executable steps
      console.log(`  [Loop] Decomposing strategy: ${strategyText.slice(0, 100)}...`);
      const context = await this.memory.getContextSummary(state.goal);
      const plan = await this.ai.decomposeTask(strategyText, context);
      
      // 3. Dry Run check
      if (options.dryRun) {
        console.log(`  [Loop] Dry Run: Strategy would be: ${strategyText}`);
        state.status = 'DRY_RUN';
        break;
      }

      // 4. Execute plan
      console.log(`  [Loop] Executing ${plan.steps.length} steps...`);
      const results = await this.executor.runSteps(plan.steps);
      
      // 5. Update state
      const success = results.every(r => r.success);
      state.history.push({ strategy: strategyText, steps: plan.steps, results });
      
      if (success) {
        state.status = 'COMPLETE';
        console.log(`  [Loop] Goal achieved!`);
      } else {
        console.log(`  [Loop] Step failed, re-evaluating...`);
      }
      
      loopCount++;
    }
    
    if (state.status !== 'COMPLETE' && state.status !== 'DRY_RUN') {
      state.status = 'FAILED';
      console.log(`  [Loop] Failed to achieve goal after ${this.maxLoops} iterations.`);
    }
    
    return state;
  }
}

module.exports = AgenticLoop;
