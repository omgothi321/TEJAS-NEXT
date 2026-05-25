#!/usr/bin/env node
'use strict';

process.env.TZ = 'Asia/Kolkata';
require('dotenv').config();

const { program } = require('commander');
const chalk       = require('chalk');
const figlet      = require('figlet');
const gradient    = require('gradient-string');
const fs          = require('fs-extra');
const os          = require('os');
const path        = require('path');

// ─── COMMANDS ─────────────────────────────────────────────────────────────────
const setupCommand     = require('../src/commands/setup');
const initCommand      = require('../src/commands/init');
const runCommand       = require('../src/commands/run');
const learnCommand     = require('../src/commands/learn');
const statusCommand    = require('../src/commands/status');
const memoryCommand    = require('../src/commands/memory');
const agentCommand     = require('../src/commands/agent');
const configCommand    = require('../src/commands/config');
const graphCommand     = require('../src/commands/graph');
const dashboardCommand = require('../src/commands/dashboard');
const voiceCommand     = require('../src/commands/voice');
const brainCommand     = require('../src/commands/brain');
const updateCommand    = require('../src/commands/update');
const { exec } = require('child_process');

const VERSION = '2.1.0';

// ─── FIRST RUN CHECK ──────────────────────────────────────────────────────────
async function checkFirstRun() {
  const envPath = path.join(os.homedir(), '.tejas', 'keys.env');
  const exists  = await fs.pathExists(envPath);

  if (!exists && !process.argv.includes('setup') && !process.argv.includes('init') && !process.argv.includes('--help')) {
    console.log(chalk.yellow('\n  Tejas is not set up yet.\n'));
    console.log(chalk.cyan('  Run: tejas setup\n'));
    process.exit(0);
  }
}

// ─── UPDATE CHECK ─────────────────────────────────────────────────────────────
async function checkForUpdates() {
  exec('git fetch origin main && git rev-parse HEAD && git rev-parse origin/main', (err, stdout) => {
    if (err) return;
    const [local, remote] = stdout.trim().split('\n');
    if (local && remote && local !== remote) {
      console.log(chalk.yellow(`\n  [UPDATE] A newer version of Tejas is available.`));
      console.log(chalk.gray(`  Run `) + chalk.cyan('tejas update') + chalk.gray(' to upgrade to the latest God Level features.\n'));
    }
  });
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
function showBanner() {
  const banner = figlet.textSync('TEJAS', { font: 'Block' });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.gray('  Tejas — AI + Robotics Operating System  ') + chalk.bold.magenta(`v${VERSION}`));
  console.log();
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
program
  .name('tejas')
  .description('Tejas — AI + Robotics Operating System')
  .version(VERSION)
  .hook('preAction', async (thisCommand, actionCommand) => {
    await checkFirstRun();
    if (!['init', 'config', 'setup'].includes(actionCommand.name())) {
      showBanner();
      checkForUpdates();
    }
  });

// tejas setup
program
  .command('setup')
  .description('Set up Tejas for the first time')
  .action(setupCommand);

// tejas update
program
  .command('update')
  .description('Update Tejas to the latest version from GitHub')
  .action(updateCommand);

// tejas init
program
  .command('init')
  .description('Initialize Tejas in current project')
  .option('-f, --force', 'Reinitialize existing project')
  .action(initCommand);

// tejas run
program
  .command('run <task>')
  .description('Execute a task using AI agents')
  .option('-a, --agent <agent>',   'Force specific agent: web|file|code|workflow|financial')
  .option('-m, --model <model>',   'Force specific AI model: groq|gemini|xai|deepseek|claude|ollama')
  .option('-v, --verbose',         'Show brain stats and model details')
  .option('-d, --deep',            'Enable System 2 Deep Reasoning Loop')
  .option('-y, --yes',             'Auto-confirm all steps (default)')
  .option('--skip-cache',          'Skip workflow cache and always call AI')
  .option('--dry-run',             'Show plan without executing')
  .action(runCommand);

// tejas brain
program
  .command('brain')
  .description('Inspect the Tejas Brain Layer — cache, models, constitution')
  .option('--stats',   'Show brain performance stats (default)')
  .option('--cache',   'List cached workflows')
  .option('--flush',   'Clear workflow cache')
  .option('--models',  'Show model routing stats')
  .option('--test',    'Test all connected AI models')
  .action(brainCommand);

// tejas voice
program
  .command('voice')
  .description('Activate Tejas voice interface')
  .option('-j, --jarvis',          'Continuous wake word mode')
  .option('-l, --listen',          'Listen once and execute')
  .option('-s, --speak <text>',    'Speak a message using TTS')
  .option('-w, --wake-word <word>','Set wake word (default: tejas)')
  .option('--tts <engine>',        'TTS engine: piper|espeak|festival')
  .option('--stt <engine>',        'STT engine: whisper|vosk')
  .action(voiceCommand);

// tejas dashboard
program
  .command('dashboard')
  .description('Launch the Tejas web dashboard')
  .option('-p, --port <port>',   'Port (default: 4000)')
  .option('--token',             'Show or generate access token')
  .option('--reset-token',       'Generate a new access token')
  .action(dashboardCommand);

// tejas status
program
  .command('status')
  .description('Show Tejas system status')
  .action(statusCommand);

// tejas graph
program
  .command('graph')
  .description('Inspect the knowledge graph')
  .option('--stats',           'Show graph statistics')
  .option('--visualize',       'Display node tree')
  .option('--patterns',        'Show detected patterns')
  .option('--recall <query>',  'Query relevant memory')
  .action(graphCommand);

// tejas agent
program
  .command('agent')
  .description('Manage and inspect agents')
  .option('--list',    'List all agents')
  .option('--test',    'Test agent routing')
  .action(agentCommand);

// tejas memory
program
  .command('memory')
  .description('Inspect and manage memory')
  .option('--show',    'Show current memory')
  .option('--clear',   'Clear all memory')
  .option('--search <query>', 'Search memory')
  .action(memoryCommand);

// tejas learn
program
  .command('learn <fact>')
  .description('Teach Tejas a fact or preference')
  .option('-i, --interactive', 'Use interactive prompts (default is auto)')
  .option('-s, --silent',      'Save without interactive prompts (deprecated: default is auto)')
  .option('-t, --type <type>', 'Type: workflow|preference|command|shortcut')
  .option('-n, --name <name>', 'Name for the workflow or preference')
  .action(learnCommand);

// tejas config
program
  .command('config')
  .description('Manage Tejas configuration')
  .option('--list',           'Show all config values')
  .option('--set <key=value>','Set a config value')
  .option('--get <key>',      'Get a config value')
  .action(configCommand);

// ── DEFAULT: tejas "task" works without 'run' keyword ─────────────────────
program
  .argument('[task...]', 'Run a task directly')
  .action(async (taskParts) => {
    if (taskParts && taskParts.length > 0) {
      const task = taskParts.join(' ');
      await runCommand(task, {});
    } else {
      program.help();
    }
  });

program.parse(process.argv);
