'use strict';

// ─── SMART MODEL ROUTER ───────────────────────────────────────────────────────
// Tejas uses multiple AI models. Each one is best at different things.
// This router picks the right brain for each task automatically.
//
// Model strengths:
//   Groq (Llama 3.3 70B) → best speed, great reasoning, free
//   Gemini 3 Pro        → best for web/search tasks, massive context, free
//   xAI Grok 3           → top-tier analysis and current events
//   DeepSeek V3          → best at code generation, very cheap
//   Ollama               → fully offline, no cost, slower

const ROUTING_RULES = [
  // Code tasks → DeepSeek (specialized for code) or Groq
  {
    name:     'code',
    triggers: ['write code', 'function', 'script', 'debug', 'fix bug',
                'review code', 'refactor', 'implement', 'algorithm'],
    prefer:   ['deepseek', 'groq', 'gemini'],
    options:  { gemini_version: '3.0' },
    reason:   'Code specialized models produce better code'
  },
  // Web/search tasks → Gemini (huge context, web-aware)
  {
    name:     'web',
    triggers: ['search', 'find online', 'latest', 'current', 'news',
                'fetch', 'url', 'website', 'today', 'price', 'weather'],
    prefer:   ['gemini', 'groq', 'xai'],
    options:  { gemini_version: '1.5-flash' }, // Flash is fine for web
    reason:   'Gemini Flash has best web awareness and large context'
  },
  // Analysis/reasoning → xAI or Groq
  {
    name:     'analysis',
    triggers: ['analyze', 'explain', 'understand', 'why', 'compare',
                'review', 'evaluate', 'assess', 'research', 'complex'],
    prefer:   ['xai', 'gemini', 'groq'],
    options:  { gemini_version: '3.0', xai_model: 'grok-3' },
    reason:   'xAI Grok 3 and Gemini 3 Pro excel at deep reasoning'
  },
  // Quick/simple tasks → Groq (fastest free)
  {
    name:     'quick',
    triggers: ['create file', 'make directory', 'git', 'npm install',
                'run', 'execute', 'list', 'show', 'print'],
    prefer:   ['groq', 'gemini', 'ollama'],
    options:  { gemini_version: '1.5-flash' },
    reason:   'Fast models for simple operations'
  },
  // Offline/private tasks → Ollama
  {
    name:     'private',
    triggers: ['private', 'offline', 'local', 'no internet', 'secret'],
    prefer:   ['ollama', 'groq'],
    reason:   'Local models for privacy-sensitive tasks'
  }
];

// ─── CIRCUIT BREAKER ──────────────────────────────────────────────────────────
// If a model fails 3 times consecutively, skip it for 5 minutes.
class CircuitBreaker {
  constructor() {
    this.failures = {};
    this.openUntil = {};
  }

  isOpen(model) {
    return this.openUntil[model] && Date.now() < this.openUntil[model];
  }

  recordFailure(model) {
    this.failures[model] = (this.failures[model] || 0) + 1;
    if (this.failures[model] >= 3) {
      this.openUntil[model] = Date.now() + 5 * 60 * 1000;
      console.log(`[Router] ⚡ ${model} circuit open — switching to fallback`);
    }
  }

  recordSuccess(model) {
    this.failures[model] = 0;
    delete this.openUntil[model];
  }

  getStatus() {
    const status = {};
    for (const [model, until] of Object.entries(this.openUntil)) {
      status[model] = {
        open: Date.now() < until,
        failures: this.failures[model] || 0,
        reopens_in_ms: Math.max(0, until - Date.now())
      };
    }
    return status;
  }
}

class SmartModelRouter {
  constructor(availableModels = {}) {
    // availableModels = { groq: true, gemini: true, xai: false, deepseek: false, ollama: false }
    this.available = availableModels;
    this._history  = []; // track which models worked
    this.breaker   = new CircuitBreaker();
  }

  // ── SELECT MODEL FOR TASK ─────────────────────────────────────────────────
  selectModel(task, options = {}) {
    // 1. Explicit override
    if (options.model && this.available[options.model]) {
      return { model: options.model, reason: 'explicit override' };
    }

    // 2. Match routing rules
    const lower = task.toLowerCase();
    for (const rule of ROUTING_RULES) {
      const matched = rule.triggers.some(t => lower.includes(t));
      if (matched) {
        // Find first available preferred model
        for (const preferred of rule.prefer) {
          if (this.available[preferred]) {
            return {
              model:   preferred,
              rule:    rule.name,
              reason:  rule.reason,
              options: rule.options || {}
            };
          }
        }
      }
    }

    // 3. Default: first available model
    const defaultModel = this._getDefaultModel();
    return { model: defaultModel, reason: 'default model' };
  }

  // ── GET DEFAULT MODEL ─────────────────────────────────────────────────────
  _getDefaultModel() {
    // Priority order for default
    const priority = ['groq', 'gemini', 'xai', 'deepseek', 'claude', 'openai', 'ollama'];
    for (const m of priority) {
      if (this.available[m]) return m;
    }
    return 'ollama'; // last resort
  }

  // ── TRACK RESULT ──────────────────────────────────────────────────────────
  trackResult(model, task, success, latencyMs) {
    this._history.push({
      model, task: task.slice(0, 50), success, latencyMs,
      ts: new Date().toISOString()
    });
    // Keep last 100
    if (this._history.length > 100) this._history.shift();
  }

  // ── GET STATS ─────────────────────────────────────────────────────────────
  getStats() {
    const byModel = {};
    for (const entry of this._history) {
      if (!byModel[entry.model]) {
        byModel[entry.model] = { calls: 0, success: 0, totalMs: 0 };
      }
      byModel[entry.model].calls++;
      if (entry.success) byModel[entry.model].success++;
      byModel[entry.model].totalMs += entry.latencyMs;
    }

    return Object.entries(byModel).map(([model, stats]) => ({
      model,
      calls:       stats.calls,
      success_rate: Math.round((stats.success / stats.calls) * 100) + '%',
      avg_ms:       Math.round(stats.totalMs / stats.calls)
    }));
  }

  // ── ROUTE WITH RESILIENCE ─────────────────────────────────────────────────
  async routeWithFallback(task, callFn) {
    const sel = this.selectModel(task);
    const chain = [sel.model, ...((sel.prefer || []).filter(m => m !== sel.model)), 'ollama'];
    const unique = [...new Set(chain)].filter(m => this.available[m]);

    for (const model of unique) {
      if (this.breaker.isOpen(model)) continue;
      const start = Date.now();
      try {
        const result = await callFn(model);
        this.breaker.recordSuccess(model);
        this.trackResult(model, task, true, Date.now() - start);
        return result;
      } catch (err) {
        this.breaker.recordFailure(model);
        this.trackResult(model, task, false, Date.now() - start);
      }
    }
    throw new Error('All AI models failed — all circuits open or exhausted');
  }
}

module.exports = SmartModelRouter;
