'use strict';

const fs = require('fs-extra');
const path = require('path');

class KnowledgeIngestor {
  constructor(memory) {
    this.memory = memory;
  }

  async ingestSector(sectorName, data) {
    console.log(`[Ingestor] Seeding ${sectorName} into Knowledge Graph...`);
    for (const item of data) {
      await this.memory.graph.addNode(item.concept, {
        sector: sectorName,
        metadata: item.metadata
      });
    }
  }
}

module.exports = KnowledgeIngestor;
