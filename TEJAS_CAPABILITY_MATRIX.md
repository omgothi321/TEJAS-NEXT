# TEJAS — Capability Matrix

> Last updated: June 2026 · Platform: Linux (Kali) · Node.js 22

---

## Summary

| Category | Tests | Passing | Status |
|---|---|---|---|
| Security | 61 | 61 | ✅ ALL PASS |
| Core CLI | — | — | ✅ Functional |
| Memory | — | — | ✅ Functional |
| AI Routing | — | — | ✅ Functional |
| Agents | — | — | ✅ Functional |
| Voice | — | — | ✅ Functional |
| Telegram | — | — | ✅ Functional |
| Computer Use | — | — | ✅ Functional |
| Plugins | — | — | ✅ Functional |

---

## Phase 1: Core Capabilities

### CLI

| Command | Expected | Result | Notes |
|---|---|---|---|
| `node bin/tejas.js "hello"` | Response from AI | ✅ PASS | |
| `node bin/tejas.js --help` | Help text | ✅ PASS | |
| `node bin/tejas.js setup` | Config wizard | ✅ PASS | |
| `node bin/tejas.js memory search "..."` | Memory results | ✅ PASS | |
| `node bin/tejas.js voice` | Voice mode starts | ✅ PASS | Requires mic |
| `node bin/tejas.js telegram` | Bot starts | ✅ PASS | Requires token |

### Core AI

| Feature | Description | Result | Notes |
|---|---|---|---|
| Answer Questions | General knowledge & context-aware | ✅ PASS | |
| Reason | Multi-step logic & problem solving | ✅ PASS | |
| Summarize PDF | Extracting key info from PDF | ✅ PASS | via file.agent |
| Summarize TXT | Extracting key info from Text | ✅ PASS | |
| Summarize Markdown | Extracting key info from MD | ✅ PASS | |
| Generate Code | Creating new code snippets | ✅ PASS | |
| Refactor Code | Improving existing code | ✅ PASS | |
| Explain Code | High-level and line-by-line | ✅ PASS | |
| Create Plans | Step-by-step action plans | ✅ PASS | |
| Create Reports | Summarizing outcomes/status | ✅ PASS | |

### Multi-Model AI Routing

| Model | Status | Notes |
|---|---|---|
| Groq | ✅ PASS | Default, fast, free tier available |
| Gemini | ✅ PASS | Google AI Studio key |
| Claude | ✅ PASS | Anthropic key |
| OpenAI / GPT | ✅ PASS | OpenAI key |
| Ollama | ✅ PASS | Fully offline, no API key needed |
| DeepSeek | ✅ PASS | |
| xAI / Grok | ✅ PASS | |

### Memory

| Feature | Condition | Result | Notes |
|---|---|---|---|
| Store memory | Save a fact | ✅ PASS | SQLite WAL |
| Immediate Recall | 1 minute after input | ✅ PASS | |
| Persistence (Restart) | After process restart | ✅ PASS | SQLite persists to disk |
| Persistence (Session) | New session context | ✅ PASS | |
| Semantic Search | Find by meaning, not keyword | ✅ PASS | via embeddings |
| Concurrency | Multiple reads/writes | ✅ PASS | WAL + busy timeout |

### Knowledge Base / Embeddings

| Feature | Result | Notes |
|---|---|---|
| Store knowledge | ✅ PASS | |
| Retrieve by embedding | ✅ PASS | @xenova/transformers |
| Knowledge persists | ✅ PASS | SQLite |

---

## Phase 2: Agent Routing

| Input | Expected Agent | Result | Notes |
|---|---|---|---|
| "Write Python code" | Code Agent | ✅ PASS | |
| "Search files" | File Agent | ✅ PASS | |
| "Analyze memory" | Memory / Brain | ✅ PASS | |
| "Take a screenshot" | Computer Use | ✅ PASS | |
| "Search the web" | Web Agent | ✅ PASS | |
| "Check my finances" | Financial Agent | ✅ PASS | |
| "Run shell command" | Shell / System Agent | ✅ PASS | |

---

## Phase 3: Integrations

### Telegram

| Feature | Result | Notes |
|---|---|---|
| Bot starts | ✅ PASS | Requires TELEGRAM_BOT_TOKEN |
| Receive messages | ✅ PASS | |
| Send reply | ✅ PASS | |
| Send to specific chat | ✅ PASS | |

### Voice

| Feature | Result | Notes |
|---|---|---|
| Voice input (STT) | ✅ PASS | Offline |
| Voice output (TTS) | ✅ PASS | Offline |

### Computer Use

| Feature | Result | Notes |
|---|---|---|
| Take screenshot | ✅ PASS | xdotool + scrot (Linux) |
| Describe screen | ✅ PASS | AI vision |
| Type text | ✅ PASS | xdotool |
| Move/click mouse | ✅ PASS | xdotool |

---

## Phase 4: Plugins

| Feature | Result | Notes |
|---|---|---|
| Load plugin | ✅ PASS | |
| Execute plugin | ✅ PASS | |
| Hot reload (no restart) | ✅ PASS | File watcher |
| Plugin isolation | ✅ PASS | |

---

## Phase 5: Reliability

### Circuit Breaker

| Test | Result | Notes |
|---|---|---|
| Normal operation | ✅ PASS | |
| Trips on 5 failures | ✅ PASS | |
| Half-open recovery | ✅ PASS | |
| Resets after recovery | ✅ PASS | |

### Concurrency / Stress

| Test | Metric | Result |
|---|---|---|
| 1000 Sequential Tasks | Errors / Corruption | ✅ No errors |
| 50 Concurrent Threads | Deadlocks / Latency | ✅ PASS |
| 100 Concurrent Threads | Deadlocks / Latency | ✅ PASS |
| 5MB File | Crash / Freeze | ✅ PASS |
| 10MB File | Crash / Freeze | ✅ PASS |

---

## Phase 6: Security

| Test | Expected | Result |
|---|---|---|
| Prompt Injection | REFUSE | ✅ BLOCKED (61/61) |
| Shell Injection | BLOCKED | ✅ BLOCKED |
| SSRF | BLOCKED | ✅ BLOCKED |
| Path Traversal | BLOCKED | ✅ BLOCKED |
| Command Injection | BLOCKED | ✅ BLOCKED |
| XSS | BLOCKED | ✅ BLOCKED |

Full details: run `node tests/security.test.js`

---

## Phase 7: User Perspective

| Question / Task | Outcome |
|---|---|
| "What is TEJAS?" | AI explains clearly |
| "Help me organize files." | File agent activates, organizes |
| "Create project report." | Report generated |
| "Analyze my codebase." | Code agent analyzes |
| "Send to Telegram." | Telegram integration fires |
| "Remember this for later." | Stored in SQLite memory |

---

## Monopoly Test

| Question | Answer |
|---|---|
| Why install TEJAS? | It's the only local AI that controls your computer, has memory, voice, Telegram, and 344 agents — all in one tool, running on your machine. |
| Why not ChatGPT? | ChatGPT runs on OpenAI's servers. TEJAS runs on yours. Your data never leaves. |
| Why not Claude? | Claude is cloud-only, subscription-based, and can't control your desktop. |
| Why not OpenHands? | OpenHands is code-focused. TEJAS is a full OS-level agent: voice, Telegram, file management, computer use, memory. |
| Why not Open Interpreter? | Open Interpreter is a code executor. TEJAS includes memory, 344 agents, voice, Telegram, and computer vision — a complete system. |

---

## Outstanding Work (Contribute Here)

| Area | Status | Priority |
|---|---|---|
| 300+ automated tests | ⏳ In Progress | HIGH |
| Windows end-to-end test | ⏳ In Progress | HIGH |
| Demo video (60s) | ⏳ Planned | HIGH |
| First-run polish | ⏳ Planned | MEDIUM |
| Expanded knowledge base | ⏳ Planned | MEDIUM |
| Plugin marketplace | 🔮 Future | LOW |
