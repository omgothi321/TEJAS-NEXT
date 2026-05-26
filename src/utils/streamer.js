'use strict';
const chalk = require('chalk');

class Streamer {
  static async text(text, delay = 20) {
    for (const char of text) {
      process.stdout.write(chalk.white(char));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    process.stdout.write('\n');
  }
}
module.exports = Streamer;
