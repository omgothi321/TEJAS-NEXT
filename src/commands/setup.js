'use strict';

const inquirer = require('inquirer');
const chalk    = require('chalk');
const fs       = require('fs-extra');
const path     = require('path');
const os       = require('os');

module.exports = async function setup() {
  console.clear();

  // ── Welcome ──────────────────────────────────────────────────────────────
  console.log(chalk.cyan.bold('\n  Welcome to Tejas Setup\n'));
  console.log(chalk.gray('  This will get you running in under 2 minutes.\n'));

  // ── Step 1: Name ──────────────────────────────────────────────────────────
  const { name } = await inquirer.prompt([{
    type:    'input',
    name:    'name',
    message: 'What should Tejas call you?',
    default: os.userInfo().username
  }]);

  // ── Step 2: Pick ONE AI model ─────────────────────────────────────────────
  console.log(chalk.gray('\n  Pick one AI model. You can add more later.\n'));
  const { provider } = await inquirer.prompt([{
    type:    'list',
    name:    'provider',
    message: 'Which AI do you want to use?',
    choices: [
      { name: 'Groq     (Free, fast — recommended)', value: 'groq' },
      { name: 'Gemini   (Free tier available)',      value: 'gemini' },
      { name: 'Ollama   (100% offline, no API key needed)',  value: 'ollama' },
      { name: 'Claude   (Best quality)',             value: 'claude' },
      { name: 'DeepSeek (Cheap, powerful)',          value: 'deepseek' },
    ]
  }]);

  let apiKey = '';
  if (provider !== 'ollama') {
    const urls = {
      groq:     'https://console.groq.com/keys',
      gemini:   'https://aistudio.google.com/app/apikey',
      claude:   'https://console.anthropic.com/keys',
      deepseek: 'https://platform.deepseek.com/api_keys',
    };
    console.log(chalk.gray(`\n  Get your free API key at: `) + chalk.cyan(urls[provider]));
    const ans = await inquirer.prompt([{
      type:    'password',
      name:    'key',
      message: `Paste your ${provider} API key:`,
      mask:    '•'
    }]);
    apiKey = ans.key.trim();
  }

  // ── Step 3: Optional Telegram ─────────────────────────────────────────────
  const { wantTelegram } = await inquirer.prompt([{
    type:    'confirm',
    name:    'wantTelegram',
    message: 'Set up Telegram control? (control Tejas from your phone)',
    default: false
  }]);

  let telegramToken = '';
  if (wantTelegram) {
    console.log(chalk.gray('\n  Message @BotFather on Telegram → /newbot → copy the token\n'));
    const ans = await inquirer.prompt([{
      type: 'password', name: 'token',
      message: 'Paste your Telegram bot token:', mask: '•'
    }]);
    telegramToken = ans.token.trim();
  }

  // ── Write .env ────────────────────────────────────────────────────────────
  const tejasDir = path.join(os.homedir(), '.tejas');
  const envPath = path.join(tejasDir, 'keys.env');
  await fs.ensureDir(tejasDir);

  const keyNames = {
    groq: 'grok', gemini: 'gemini',
    claude: 'claude', deepseek: 'deepseek'
  };

  // Keep format consistent with existing keys.env (space separated)
  let envContent = '';
  if (apiKey) envContent += `${keyNames[provider] || provider} ${apiKey}\n`;
  if (telegramToken) envContent += `telegram ${telegramToken}\n`;

  await fs.writeFile(envPath, envContent, 'utf8');

  // Also write basic config so the app knows the default model
  await fs.writeJson(path.join(tejasDir, 'config.json'), {
      model: provider,
      user: { name }
  }, { spaces: 2 });

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log(chalk.green.bold('\n  ✓ Setup complete!\n'));
  console.log(chalk.gray('  Try your first command:\n'));
  console.log(chalk.cyan('  tejas "what can you do?"\n'));
};
