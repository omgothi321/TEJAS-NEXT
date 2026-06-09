'use strict';

const { buildDecomposePrompt, CONSTITUTION } = require('./constitution');
const SmartModelRouter = require('./model-router');
const WorkflowCache    = require('./cache');
const SelfCorrector    = require('./corrector');
const AgentRegistry    = require('../skills/registry');
const path             = require('path');
const fs               = require('fs-extra');

// ─── TEJAS BRAIN ──────────────────────────────────────────────────────────────
// Master orchestrator.
// Injects memory, routes models, caches workflows, corrects failures.
// Fixed by multi-AI council: Claude + Grok + ChatGPT + Gemini

class TejasB {
  constructor(aiEngine, memory, config = {}) {
    this.ai     = aiEngine;
    this.memory = memory;
    this.config = config;

    const keys = config.api_keys || {};
    this.modelRouter = new SmartModelRouter({
      groq:     !!keys.groq,
      gemini:   !!keys.gemini,
      xai:      !!keys.xai,
      deepseek: !!keys.deepseek,
      claude:   !!keys.claude,
      openai:   !!keys.openai,
      ollama:   true
    });

    this.cache     = new WorkflowCache(
      (memory && memory.tejasDir) || process.cwd() + '/.tejas',
      memory.db,
      memory.embeddings
    );
    this.corrector = new SelfCorrector(aiEngine);
    this.registry = new AgentRegistry(
      path.join(__dirname, '../skills/agents')
    );
    this.registry.discover().catch(() => {});
    
    this._stats    = {
      cache_hits:  0,
      api_calls:   0,
      corrections: 0,
      total_tasks: 0
    };
  }

  // ── THINK ─────────────────────────────────────────────────────────────────
  async think(task, options) {
    options = options || {};
    this._stats.total_tasks++;

    // 1. Cache check — instant, free
    if (!options.skipCache) {
      const cached = await this.cache.get(task);
      if (cached && cached.hit && cached.confidence >= 0.9) {
        this._stats.cache_hits++;
        return Object.assign({}, cached.plan, {
          _source:     'cache',
          _confidence: cached.confidence,
          _cache_type: cached.source
        });
      }
    }

    // 2. Memory context
    let memCtx = {};
    try {
      memCtx = await this._getMemoryContext(task) || {};
    } catch (err) {
      if (this.config.verbose) console.warn('[Brain] Memory context retrieval failed:', err.message);
    }

    // Expert Persona
    const skillPersona = await this._getSkillPersona(task);
    if (skillPersona) console.log(`[Tejas] 🧠 ${skillPersona.name}`);

    // 3. Multi-Model Fallback Logic (Issue #100 - Resilience)
    const preferredModels = this.modelRouter.selectModel(task, options).prefer || [];
    const modelsToTry    = [...new Set([this.modelRouter.selectModel(task, options).model, ...preferredModels, 'groq', 'gemini', 'ollama'])];
    
    let lastError = null;

    for (const modelName of modelsToTry) {
      if (!this.modelRouter.available[modelName] && modelName !== 'ollama') continue;

      const originalModel = this.ai.model;
      this.ai.model = modelName;
      
      const prompt = buildDecomposePrompt(task, memCtx, skillPersona?.content || null);
      this._stats.api_calls++;
      const start = Date.now();

      try {
        if (this.config.verbose && modelName !== modelsToTry[0]) {
          console.log(chalk.yellow(`  [Brain] Primary model failed, trying fallback: ${modelName}`));
        }

        const raw = await this.ai.call(prompt);
        const plan = this.ai._parseJSON(raw);

        if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
          throw new Error('AI returned invalid plan structure');
        }

        plan._source = 'ai';
        plan._model = modelName;
        this.modelRouter.trackResult(modelName, task, true, Date.now() - start);
        this.ai.model = originalModel;
        return plan;

      } catch (err) {
        lastError = err;
        this.modelRouter.trackResult(modelName, task, false, Date.now() - start);
        this.ai.model = originalModel;
        // Continue to next model
      }
    }

    throw lastError || new Error('All AI models failed to process task');
  }

  async _getSkillPersona(task) {
    const t = task.toLowerCase();
    const map = [
      [/review.*code|code.*review|audit.*code|find.*bug/,     'engineering-code-reviewer'],
      [/security|vulnerabilit|exploit|penetrat|harden/,       'engineering-security-engineer'],
      [/deploy|docker|devops|ci.?cd|pipeline|nginx/,          'engineering-devops-automator'],
      [/stock|invest|portfolio|zerodha|market|equity|nifty/,  'finance-investment-researcher'],
      [/game|unity|godot|unreal|roblox|level.*design/,        'game-designer'],
      [/implement|refactor|write.*code|build.*function/,      'engineering-senior-developer'],
      [/architect|system.*design|microservice|api.*design/,   'engineering-backend-architect'],
      [/technical.*writ|readme|documentation|docs/,           'engineering-technical-writer'],
    ];
    for (const [pattern, skill] of map) {
      if (pattern.test(t)) {
        return this._loadAgentPersona(skill);
      }
    }
    return null;
  }

  async _loadAgentPersona(skillName) {
    try {
      const agentPath = path.join(
        __dirname, '../skills/agents', `${skillName}.md`
      );
      if (!await fs.pathExists(agentPath)) return null;
      const content = (await fs.readFile(agentPath, 'utf8')).slice(0, 1500);
      return { name: skillName, content };
    } catch { return null; }
  }


  // ── CALL WITH CONTEXT ─────────────────────────────────────────────────────
  async call(prompt, options) {
    options = options || {};
    this._stats.api_calls++;
    const sel           = this.modelRouter.selectModel(
      prompt.slice(0, 100), options
    );
    const originalModel = this.ai.model;

    if (sel.model !== originalModel && !options.keepModel) {
      this.ai.model = sel.model;
    }

    try {
      const enriched = options.injectConstitution
        ? CONSTITUTION + '\n\n' + prompt
        : prompt;
      return await this.ai.call(enriched);
    } finally {
      this.ai.model = originalModel;
    }
  }

  // ── CORRECT ───────────────────────────────────────────────────────────────
  async correct(step, error, originalTask) {
    this._stats.corrections++;
    return this.corrector.correctStep(step, error, originalTask);
  }

  // ── SAVE TO CACHE ─────────────────────────────────────────────────────────
  async saveToCache(task, plan, success) {
    if (success && plan && plan._source !== 'cache') {
      await this.cache.set(task, plan, success);
    }
  }

  // ── GET STATS ─────────────────────────────────────────────────────────────
  async getStats() {
    const cacheStats = await this.cache.getStats();
    const modelStats = this.modelRouter.getStats();
    return {
      session:    this._stats,
      cache:      cacheStats,
      models:     modelStats,
      efficiency: this._stats.total_tasks > 0
        ? Math.round(
            this._stats.cache_hits / this._stats.total_tasks * 100
          ) + '%'
        : '0%'
    };
  }

  // ── AUTOGPT: SELF REFLECTION ──────────────────────────────────────────────
  async reflect(task, output) {
    if (!output || String(output).trim().length < 5) {
      return { solved: false, confidence: 0, next_step: 'retry' };
    }
    const t = String(task).replace(/"/g, "'");
    const o = String(output).slice(0, 300).replace(/"/g, "'");
    const prompt = 'Task: ' + t +
      '\nOutput: ' + o +
      '\nDid this fully solve the task? ' +
      'JSON only: {"solved":true,"confidence":100,"next_step":null}';
    try {
      const raw    = await this.ai.call(prompt);
      const result = this.ai._parseJSON(raw);
      return result || { solved: false, confidence: 0, next_step: 'retry' };
    } catch (err) {
      if (this.config.verbose) console.warn('[Brain] Reflection failed:', err.message);
      return { solved: false, confidence: 0, next_step: 'retry' };
    }
  }

  // ── MEMGPT: COMPRESS OLD MEMORIES ─────────────────────────────────────────
  async compressMemory() {
    try {
      if (this.memory && this.memory.compress) {
        return await this.memory.compress();
      }
    } catch (err) { 
      if (this.config.verbose) console.warn('[Brain] Memory compression failed:', err.message);
    }
  }

  // ── PRIVATE ───────────────────────────────────────────────────────────────
  async _getMemoryContext(task) {
    try {
      return await this.memory.getContextSummary(task);
    } catch (err) {
      if (this.config.verbose) console.warn('[Brain] _getMemoryContext failed:', err.message);
      return {};
    }
  }
}

module.exports = TejasB;
