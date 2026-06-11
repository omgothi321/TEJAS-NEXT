'use strict';
const fs = require('fs-extra');
const path = require('path');

class AgentSkillRegistry {
  constructor(skillDir) {
    this.skillDir = skillDir || path.join(__dirname);
    this.skills = new Map();
  }

  /**
   * Auto-discover skills in the skills directory
   */
  async discover() {
    try {
      const files = await fs.readdir(this.skillDir);
      for (const file of files) {
        if (file.endsWith('.js') && file !== 'registry.js' && file !== 'agent-registry.js') {
          try {
            const SkillClass = require(path.join(this.skillDir, file));
            const skill = new SkillClass();
            if (skill.name) {
              this.skills.set(skill.name, skill);
            }
          } catch (e) {
            // console.error(`Failed to load skill ${file}: ${e.message}`);
          }
        }
      }
    } catch (err) {
      // console.error('Skill discovery failed:', err.message);
    }
  }

  async runAgent(agentName, task, ai, memory) {
    const agentDir = path.join(this.skillDir, 'agents');
    const files = await fs.readdir(agentDir);
    const match = files.find(f => f.toLowerCase().includes(agentName.toLowerCase()) && f.endsWith('.md'));
    
    if (!match) return "Agent not found.";

    const character = await fs.readFile(path.join(agentDir, match), 'utf8');
    
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
    const context = await memory.getContextSummary(task);
    const finalPrompt = `Context: ${JSON.stringify(context)}\n\nTask: ${task}`;
    
    return await ai.call(finalPrompt, systemPrompt);
  }
}
module.exports = AgentSkillRegistry;
