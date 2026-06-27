# Contributing to TEJAS

Thank you for wanting to make TEJAS better. This guide gets you from zero to opening a pull request in under 10 minutes.

---

## What we need most right now

| Priority | Area | What to do |
|---|---|---|
| 🔴 HIGH | **Test coverage** | Write tests for agents, memory, routing, voice, CLI |
| 🔴 HIGH | **Windows testing** | Run every command on Windows CMD, report failures |
| 🟡 MEDIUM | **Skill files** | Write new `.md` skill files for `src/skills/agents/` |
| 🟡 MEDIUM | **Docs** | Improve guides, examples, screenshots |
| 🟢 LOW | **Translations** | README in other languages |

---

## Getting started

```bash
git clone https://github.com/omgothi321/tejas-next
cd tejas-next
bash install.sh        # or install.bat on Windows
node bin/tejas.js setup
```

---

## Project structure

```
tejas-next/
├── bin/tejas.js           ← CLI entry point
├── src/
│   ├── core/              ← Memory, AI engine, router, executor
│   ├── agents/            ← Built-in agents (file, code, web, shell)
│   ├── skills/agents/     ← 344 domain skill files (.md)
│   ├── integrations/      ← Telegram
│   ├── voice/             ← STT engine
│   └── tts/               ← TTS engine
├── tests/                 ← Automated tests
├── docs/                  ← Documentation
└── README.md
```

---

## Running tests

```bash
npm test                          # all tests
node tests/security.test.js       # security tests only
```

**Current coverage**: 61 security tests, ~40 general tests  
**Goal**: 300+ tests covering all subsystems

---

## How to write a test

Add your test to `tests/test.js` or create a new file like `tests/memory.test.js`.

Pattern:

```js
const assert = require('assert');

async function testMemoryStore() {
  const { MemoryEngine } = require('../src/core/memory');
  const mem = new MemoryEngine({ db_path: ':memory:' });
  await mem.init();
  await mem.store({ content: 'test fact', tags: ['test'] });
  const results = await mem.search('test');
  assert(results.length > 0, 'Memory should return results');
  console.log('✅ memory.store + search');
}

testMemoryStore().catch(e => { console.error('❌', e.message); process.exit(1); });
```

---

## How to write a skill file

Skill files live in `src/skills/agents/`. Each is a Markdown file with a specific structure. See existing files like `src/skills/agents/code-reviewer.md` for examples.

A minimal skill:

```markdown
# Skill Name

## Role
What this agent does in one sentence.

## Capabilities
- Capability 1
- Capability 2

## When to use
Describe what triggers this skill.

## Instructions
Step-by-step instructions the agent follows.
```

---

## Pull request checklist

- [ ] Tests pass (`npm test`)
- [ ] No new security vulnerabilities introduced
- [ ] Code follows existing patterns (no unnecessary abstractions)
- [ ] PR description explains *why*, not just *what*
- [ ] If adding a feature, update README capability table

---

## Reporting bugs

Open an issue with:

1. What you ran (exact command)
2. What you expected
3. What actually happened
4. OS + Node.js version (`node --version`)

---

## Code of conduct

Be respectful. Be specific. No spam. Help others who ask questions.

---

## Questions?

Open a [GitHub Discussion](https://github.com/omgothi321/tejas-next/discussions) — not an issue.
