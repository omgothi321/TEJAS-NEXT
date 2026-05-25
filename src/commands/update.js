'use strict';

const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);
const display = require('../utils/display');

module.exports = async function update(options) {
  const cwd = process.cwd();
  const spin = display.spinner('Updating Tejas...').start();
  try {
    await execFileAsync('git', ['pull'], { cwd });
    await execFileAsync('npm', ['install'], { cwd });
    spin.succeed('Tejas updated successfully.');
  } catch (err) {
    spin.fail('Update failed: ' + err.message);
  }
};
