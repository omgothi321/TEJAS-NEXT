/**
 * System 2 Deep Reasoning Engine
 * Implements multi-hypothesis generation and critique.
 */
class System2Reasoner {
  constructor(aiEngine) {
    this.ai = aiEngine;
  }

  async solve(task, context) {
    console.log(`\n  [System2] Reasoning: ${task}`);
    
    // 1. Generate 3 diverse hypotheses
    const hypotheses = await this.generateHypotheses(task, context);
    
    // 2. Evaluate/Critique each
    const critique = await this.critique(hypotheses, task);
    
    // 3. Synthesize final plan
    return this.synthesize(hypotheses, critique);
  }

  async generateHypotheses(task, context) {
    const prompt = `
Task: "${task}"
Context: ${JSON.stringify(context)}

Generate 3 diverse, high-level strategies to solve this task.
Return ONLY valid JSON:
{
  "hypotheses": [
    { "id": 1, "strategy": "...", "pros": "...", "cons": "..." },
    { "id": 2, "strategy": "...", "pros": "...", "cons": "..." },
    { "id": 3, "strategy": "...", "pros": "...", "cons": "..." }
  ]
}`;
    const raw = await this.ai.call(prompt);
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '')).hypotheses;
  }

  async critique(hypotheses, task) {
    const prompt = `
Task: "${task}"
Hypotheses: ${JSON.stringify(hypotheses)}

Critique these hypotheses. Which is most robust, secure, and efficient? 
Score them from 0 to 1.
Return ONLY valid JSON:
{
  "scores": [
    { "id": 1, "score": 0.0 },
    { "id": 2, "score": 0.0 },
    { "id": 3, "score": 0.0 }
  ],
  "best_id": 1
}`;
    const raw = await this.ai.call(prompt);
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, ''));
  }

  synthesize(hypotheses, critique) {
    const best = hypotheses.find(h => h.id === critique.best_id);
    return best || hypotheses[0];
  }
}

module.exports = System2Reasoner;
