'use strict';

const KiteConnector = require('./financial/kite');

/**
 * Financial Agent
 * Handles market data, trading, and financial analysis.
 * Primary connector: Zerodha Kite (Hybrid Telemetry + Playwright)
 */
class FinancialAgent {
  constructor(aiEngine, memory) {
    this.ai = aiEngine;
    this.memory = memory;
    this.name = 'financial';
    this.connector = null;
  }

  async run(task, context = {}) {
    const result = {
      agent: this.name,
      task,
      success: false,
      output: null,
      error: null
    };

    try {
      // 1. Initialize connector if needed
      if (!this.connector) {
        const config = await this.memory.readConfig();
        if (config.financial && config.financial.kite) {
          this.connector = new KiteConnector(config.financial.kite);
          await this.connector.initialize();
        }
      }

      // 2. Plan the financial task
      const plan = await this._planFinancialTask(task, context);

      // 3. Execute
      if (plan.type === 'market_data' && this.connector) {
        const data = await this.connector.getSnapshot(plan.symbol);
        result.output = `Market Data for ${plan.symbol}: Price: ${data.price} (Latency: ${data.latency}ms)`;
        result.success = true;
      } else if (plan.type === 'analysis') {
        // Use AI for general financial analysis/advice
        result.output = await this.ai.call(`As a financial expert, analyze: ${task}`);
        result.success = true;
      } else {
        result.error = "Financial connector not configured or unsupported task type.";
      }

    } catch (err) {
      result.error = err.message;
    }

    return result;
  }

  async _planFinancialTask(task, context) {
    const prompt = `
Task: "${task}"
Analyze if this is a market data request (specify symbol) or general financial analysis.
Return ONLY valid JSON:
{
  "type": "market_data|analysis|unknown",
  "symbol": "TICKER_SYMBOL|null",
  "reasoning": "..."
}`;
    const raw = await this.ai.call(prompt);
    return this.ai._parseJSON(raw);
  }

  getScore(task) {
    const lt = task.toLowerCase();
    if (/\b(stock|price|market|trading|kite|zerodha|nifty|banknifty|share|dividend|portfolio)\b/i.test(lt)) {
      return 85;
    }
    return 0;
  }
}

module.exports = FinancialAgent;
