'use strict';
const { execFile } = require('child_process');
const { promisify } = require('util');
const exec = promisify(execFile);
const os = require('os');

module.exports = {
  IS_WIN:   process.platform === 'win32',
  IS_MAC:   process.platform === 'darwin',
  IS_LINUX: process.platform === 'linux',
  IS_ARM:   process.arch.startsWith('arm'),

  async speak(text) {
    if (this.IS_WIN) {
      return exec('powershell', ['-Command',
        `Add-Type -AssemblyName System.Speech;$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;$s.Speak('${text.replace(/'/g,"''")}')` ]);
    }
    if (this.IS_MAC) return exec('say', [text]);
    // Linux — handled by Piper in tts/speak.js
    return null;
  },

  async screenshot(outFile) {
    if (this.IS_WIN)   return exec('nircmd.exe', ['savescreenshotfull', outFile]);
    if (this.IS_MAC)   return exec('screencapture', ['-x', outFile]);
    return exec('scrot', [outFile]);
  },

  async click(x, y) {
    if (this.IS_WIN)  return exec('nircmd.exe', ['sendmouse', String(x), String(y), 'click']);
    if (this.IS_MAC)  return exec('cliclick', [`c:${x},${y}`]);
    await exec('xdotool', ['mousemove', String(x), String(y)]);
    return exec('xdotool', ['click', '1']);
  },

  async typeText(text) {
    if (this.IS_WIN)  return exec('nircmd.exe', ['sendkeypress', text]);
    if (this.IS_MAC)  return exec('cliclick', [`t:${text}`]);
    return exec('xdotool', ['type', '--clearmodifiers', text]);
  },

  getInstallCmd() {
    if (this.IS_WIN)  return 'winget install OpenJS.NodeJS';
    if (this.IS_MAC)  return 'brew install node';
    return 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -';
  }
};
