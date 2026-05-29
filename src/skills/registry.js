'use strict';
const fs = require('fs-extra');
const path = require('path');

class AgentSkillRegistry {
  constructor(ai, memory) {
    this.ai = ai;
    this.memory = memory;
    this.agentDir = path.join(__dirname, 'agents');
  }

  async runAgent(agentName, task) {
    const files = await fs.readdir(this.agentDir);
    const match = files.find(f => f.toLowerCase().includes(agentName.toLowerCase()) && f.endsWith('.md'));
    
    if (!match) return "Agent not found.";

    const character = await fs.readFile(path.join(this.agentDir, match), 'utf8');
    
    // Strict Constitutional grounding
    const systemPrompt = `
${character}

--- CONSTITUTIONAL GROUNDING ---
1. You are a strictly factual, professional agent.
2. NO HALLUCINATIONS. If you do not have the answer in the provided knowledge base, you MUST reply with: "I do not have enough factual information to answer this reliably."
3. Do not invent data, statistics, or sources.
4. Base your logic on provided context and factual knowledge.
`;

    // Fetch memory/knowledge context to ground the response
    const context = await this.memory.getContextSummary(task);
    const finalPrompt = `Context: ${JSON.stringify(context)}\n\nTask: ${task}`;
    
    return await this.ai.call(finalPrompt, systemPrompt);
  }
}
module.exports = AgentSkillRegistry;
