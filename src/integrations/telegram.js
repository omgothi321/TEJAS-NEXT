const path = require("path");
const fs = require('fs');
const { Telegraf } = require('telegraf');
const { execFile } = require('child_process');

// 🔐 Load keys from keys.env (Custom Format)
const keysPath = path.join(require("os").homedir(), ".tejas", "keys.env");
let token = null;
let authorizedIds = [];

if (fs.existsSync(keysPath)) {
  const content = fs.readFileSync(keysPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach(line => {
    const [key, value] = line.trim().split(' ');
    if (key === 'telegram') token = value;
    if (key === 'telegram_owner') authorizedIds.push(parseInt(value));
  });
}

if (!token) {
  console.error("❌ ERROR: telegram token not found in keys.env");
  process.exit(1);
}

const AUTHORIZED_IDS = authorizedIds;
const projectRoot = path.join(__dirname, '../..');

console.log("🚀 Tejas Telegram Control: HARDENED VERSION STARTING...");
console.log(`🔑 Loaded Token: ${token ? (token.slice(0, 5) + '...') : 'NULL'}`);
console.log(`👥 Authorized IDs: ${AUTHORIZED_IDS.join(', ')}`);

const bot = new Telegraf(token);

const tejasBin = path.join(projectRoot, 'bin/tejas.js');

// Security Check
bot.use(async (ctx, next) => {
  const chatId = ctx.chat.id;
  if (!AUTHORIZED_IDS.includes(chatId)) {
    console.warn(`🛑 Unauthorized access attempt from ID: ${chatId}`);
    return ctx.reply(`❌ Unauthorized. Your ID: ${chatId}`);
  }
  await next();
});

/**
 * Hardened execution: No shell interpolation.
 * Uses execFile with argument arrays.
 */
function runHardened(args, ctx) {
  const cmdDisplay = args.join(' ');
  console.log(`🛠️ Executing (Safe): ${cmdDisplay}`);
  ctx.sendChatAction('typing');

  const options = {
    cwd: projectRoot,
    timeout: 60000
  };

  execFile('node', [tejasBin, ...args], options, (error, stdout, stderr) => {
    let output = (stdout || "").trim();
    let errorOutput = (stderr || "").trim();

    if (output) {
      ctx.reply("✅\n" + output.slice(0, 4000));
    } else if (errorOutput) {
      ctx.reply("❌ " + errorOutput.slice(0, 4000));
    } else if (error) {
      ctx.reply("❌ Error: " + error.message);
    } else {
      ctx.reply("⚡ Done (No output)");
    }
  });
}

// 1. Handle /start
bot.command('start', (ctx) => {
  ctx.reply("👋 Tejas Hardened Online.\n\n/status - System status\n/files - List files\n/memory - Memory graph\n/speak [text] - Voice output\n/run [task] - Execute task");
});

// 2. Fixed Commands
bot.command('status', (ctx) => runHardened(['status'], ctx));
bot.command('files', (ctx) => runHardened(['run', 'list all files in the current directory'], ctx));
bot.command('memory', (ctx) => runHardened(['memory', '--show'], ctx));

// 3. Handle /speak
bot.command('speak', (ctx) => {
  const speech = ctx.message.text.slice(6).trim();
  if (speech) {
    runHardened(['voice', '--speak', speech], ctx);
  } else {
    ctx.reply("❌ Please provide text to speak.");
  }
});

// 4. Handle /run and Natural Language
bot.command('run', (ctx) => {
  const task = ctx.message.text.slice(4).trim();
  if (!task) {
    ctx.reply("❌ Please provide a task.");
    return;
  }
  runHardened(['run', task], ctx);
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
