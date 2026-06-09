'use strict';
const { v4: uuidv4 } = require('uuid');

class Telemetry {
  static createEntry(taskId, agent) {
    return {
      traceId: uuidv4(),
      taskId: taskId || uuidv4(),
      agent,
      startTime: Date.now(),
      success: false
    };
  }

  static finalize(entry, success, contextTokens = 0) {
    entry.endTime = Date.now();
    entry.durationMs = entry.endTime - entry.startTime;
    entry.success = success;
    entry.contextTokens = contextTokens;
    console.log(JSON.stringify(entry));
    return entry;
  }
}
module.exports = Telemetry;
