'use strict';

const os = require('os');
const { execSync } = require('child_process');

// ─── SYSTEM STATUS AGENT ──────────────────────────────────────────────────────
// Trains Tejas on real-time awareness by injecting environment state.

class SystemStatusAgent {
  constructor(memory) {
    this.memory = memory;
  }

  async getRealTimeContext() {
    const status = {
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
      uptime: Math.round(os.uptime() / 60) + ' minutes',
      cpu_load: os.loadavg()[0],
      free_mem: Math.round(os.freemem() / 1024 / 1024) + 'MB',
      os: `${os.type()} ${os.release()}`
    };

    // Train the Memory Graph with current facts
    await this.memory.graph.addNode('SystemStatus', { 
        type: 'RealTime', 
        data: JSON.stringify(status) 
    });
    
    return status;
  }
}

module.exports = SystemStatusAgent;
