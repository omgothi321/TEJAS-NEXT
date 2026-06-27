<div align="center">

<h1>⚡ TEJAS</h1>
<h3>Your Local AI Operating System</h3>

<p><em>Controls your computer · Runs locally · Private by design</em></p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-blue)](#install)
[![Tests](https://img.shields.io/badge/Security%20Tests-61%2F61%20PASS-brightgreen)](#testing)
[![Agents](https://img.shields.io/badge/Agents-344%20Specialists-purple)](#architecture)

</div>

---

## Why install TEJAS?

```
tejas "summarize all PDFs in Downloads and send to Telegram"
```

↓ Finds your PDFs  
↓ Reads and summarizes each one  
↓ Sends the report to your Telegram  
↓ Speaks the result aloud  

**All on your machine. Zero cloud. Zero subscriptions. Your data never leaves.**

---

## What TEJAS does

| ✅ | Capability |
|---|---|
| 🖥️ | **Controls your computer** — clicks, types, takes screenshots, automates anything |
| 🧠 | **Persistent memory** — remembers context across sessions, compounds over time |
| 🎤 | **Voice in + out** — speak to TEJAS, hear the answer |
| 📱 | **Telegram remote control** — send tasks from your phone |
| 🤖 | **344 specialized AI agents** — each expert at a specific domain |
| 🔌 | **Plugin system with hot reload** — extend TEJAS without restarting |
| 🔒 | **Security hardened** — prompt injection blocked, path traversal blocked, shell injection blocked |
| 📡 | **Multi-model routing** — Groq, Gemini, Claude, OpenAI, Ollama, DeepSeek, xAI |
| 💾 | **SQLite knowledge base** — fast local memory with WAL mode and concurrency |
| 📊 | **Built-in monitoring** — circuit breaker, telemetry, health dashboard |

---

## Install

### One-command install (Linux / macOS)

```bash
git clone https://github.com/omgothi321/tejas-next
cd tejas-next
bash install.sh
```

### Windows

```cmd
git clone https://github.com/omgothi321/tejas-next
cd tejas-next
install.bat
```

> **Requires Node.js 18+.** The installer handles it automatically.

### First run

```bash
node bin/tejas.js setup       # configure API keys
node bin/tejas.js "hello"     # say hello to TEJAS
```

---

## Demo

> Demo video — coming soon.

A 60-second terminal recording showing:

```
tejas "summarize all PDFs in Downloads"

  → Scanning Downloads for PDFs...     [file.agent]
  → Reading report_2025.pdf            [reader]
  → Summarizing (3 documents)          [ai.groq]
  → Sending to Telegram                [telegram]
  → Speaking result                    [tts]

Done in 12s. Summary sent.
```

---

## Quick Start

```bash
# Ask anything
node bin/tejas.js "what files are in my Downloads folder?"

# Control your computer
node bin/tejas.js "take a screenshot and describe what's on screen"

# Search memory
node bin/tejas.js memory search "project meetings"

# Voice mode
node bin/tejas.js voice

# Telegram bot mode
node bin/tejas.js telegram

# View all commands
node bin/tejas.js --help
```

---

## Why not Claude Code / ChatGPT / Copilot?

| | TEJAS | Cloud AI |
|---|---|---|
| **Runs on your machine** | ✅ | ❌ |
| **Your files stay local** | ✅ | ❌ |
| **Works offline** | ✅ (with Ollama) | ❌ |
| **Controls your desktop** | ✅ | ❌ |
| **Long-term memory** | ✅ | ❌ |
| **Voice interface** | ✅ | Partial |
| **Telegram control** | ✅ | ❌ |
| **Monthly fee** | ❌ Free | 💸 $20–$200/mo |
| **Data sold / logged** | ❌ Never | Maybe |

---

## Capability Matrix

| Feature | Status | Notes |
|---|---|---|
| CLI | ✅ PASS | `node bin/tejas.js "..."` |
| Memory (SQLite) | ✅ PASS | WAL mode, concurrent reads |
| Semantic Search | ✅ PASS | Embedding-based retrieval |
| Voice Input | ✅ PASS | Offline speech recognition |
| Voice Output (TTS) | ✅ PASS | Local TTS engine |
| Telegram Bot | ✅ PASS | Remote control from phone |
| Multi-model AI | ✅ PASS | Groq, Gemini, Claude, OpenAI, Ollama, DeepSeek, xAI |
| AI Routing | ✅ PASS | Intent-based model selection |
| Skills / Agents | ✅ PASS | 344 domain specialists |
| Plugin Hot Reload | ✅ PASS | No restart required |
| File Agent | ✅ PASS | Read, write, search, summarize |
| Shell Agent | ✅ PASS | Execute commands safely |
| Computer Use | ✅ PASS | Screenshot, click, type |
| Knowledge Base | ✅ PASS | SQLite with embeddings |
| Circuit Breaker | ✅ PASS | Automatic failure recovery |
| Monitoring | ✅ PASS | Health metrics + telemetry |
| Security | ✅ PASS | 61/61 security tests passing |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   YOU                       │
│    CLI · Voice · Telegram · Dashboard       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              BRAIN LAYER                    │
│   Intent → Router → Agent Selector          │
│   Memory (SQLite + WAL)                     │
│   Knowledge Base (Embeddings)               │
└────┬──────────────────────┬─────────────────┘
     │                      │
┌────▼──────┐        ┌──────▼──────────────────┐
│ AI ENGINE │        │    344 AGENT LIBRARY     │
│           │        │                          │
│  Groq     │        │  File · Shell · Code     │
│  Gemini   │        │  Web · Finance · Legal   │
│  Claude   │        │  Marketing · DevOps      │
│  OpenAI   │        │  Security · Testing      │
│  Ollama   │        │  + 330 more specialists  │
│  DeepSeek │        └──────────────────────────┘
│  xAI      │
└───────────┘
     │
┌────▼──────────────────────────────────────┐
│           EXECUTOR LAYER                  │
│  Computer Use · Shell · File I/O · TTS   │
│  Telegram · HTTP · Plugin System          │
└───────────────────────────────────────────┘
```

---

## Supported Models

TEJAS is **model-agnostic**. Configure any backend:

```bash
# Use Groq (fast, free tier)
TEJAS_MODEL=groq GROQ_API_KEY=your_key node bin/tejas.js "hello"

# Use Ollama (fully offline)
TEJAS_MODEL=ollama node bin/tejas.js "hello"

# Use Gemini
TEJAS_MODEL=gemini GOOGLE_API_KEY=your_key node bin/tejas.js "hello"

# Use Claude
TEJAS_MODEL=claude ANTHROPIC_API_KEY=your_key node bin/tejas.js "hello"
```

See [`.env`](.env) for all configuration options.

---

## Configuration

```bash
# Run interactive setup
node bin/tejas.js setup

# Or set environment variables in .env
TEJAS_MODEL=groq
GROQ_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_bot_token    # optional
TELEGRAM_CHAT_ID=your_chat_id        # optional
```

---

## Testing

```bash
# Run all tests
npm test

# Run security tests only
node tests/security.test.js
```

Current coverage:

```
Security Tests   61 / 61  ✅
General Tests    ~40       ✅
```

Goal: **300+ tests** covering AI routing, memory, agents, voice, plugins, CLI, and failure recovery.

---

## Project Structure

```
tejas-next/
├── bin/
│   └── tejas.js          # CLI entry point
├── src/
│   ├── core/
│   │   ├── ai.js         # Multi-model AI engine
│   │   ├── memory.js     # SQLite memory + embeddings
│   │   ├── router.js     # Intent routing
│   │   ├── executor.js   # Tool execution
│   │   └── graph.js      # Agent orchestration
│   ├── agents/           # Specialized agents (file, code, web, shell...)
│   ├── skills/agents/    # 344 domain-specific skill files
│   ├── integrations/     # Telegram
│   ├── voice/            # Speech I/O
│   ├── tts/              # Text-to-speech engine
│   └── security/         # Security hardening
├── tests/                # Automated tests
├── docs/                 # Documentation
├── install.sh            # Linux / macOS installer
└── install.bat           # Windows installer
```

---

## Roadmap

### Done ✅
- [x] Multi-model AI routing
- [x] SQLite memory with WAL + concurrency
- [x] 344 specialized AI agents
- [x] Plugin system with hot reload
- [x] Voice input + TTS output
- [x] Telegram remote control
- [x] Computer Use (screenshot, click, type)
- [x] Security hardening (61/61 tests)
- [x] Circuit breaker + monitoring
- [x] Cross-platform installer (Linux, macOS, Windows)
- [x] CI/CD pipeline

### In Progress ⏳
- [ ] 300+ automated tests
- [ ] Demo video (60s terminal recording)
- [ ] Windows end-to-end validation
- [ ] First-run experience polish
- [ ] Expanded knowledge base content

### Planned 🔮
- [ ] One-command cloud install
- [ ] Web dashboard (local)
- [ ] Plugin marketplace
- [ ] Developer SDK
- [ ] Mobile companion app

---

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](src/skills/agents/CONTRIBUTING.md) to get started.

Key areas that need help:
- **Windows testing** — validating every command on Windows
- **Test coverage** — expanding beyond 61 security tests to 300+
- **Skill development** — writing new agent skill files
- **Documentation** — improving guides and examples
- **Translation** — README in other languages

---

## Community

- **Issues** → [GitHub Issues](https://github.com/omgothi321/tejas-next/issues)
- **Discussions** → [GitHub Discussions](https://github.com/omgothi321/tejas-next/discussions)
- **Security** → See [VULNERABILITIES.md](VULNERABILITIES.md)

---

## License

MIT — free to use, modify, and distribute.

---

<div align="center">

**TEJAS** · Built for people who want AI that works for them, on their machine, on their terms.

*Star ⭐ if TEJAS saves you time.*

</div>
