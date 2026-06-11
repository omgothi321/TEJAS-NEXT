# TEJAS CAPABILITY MATRIX

## Phase 1: Capability Discovery

### Core AI
| Feature | Description | Score (PASS/PARTIAL/FAIL) | Notes |
| :--- | :--- | :--- | :--- |
| Answer Questions | General knowledge & context-aware | | |
| Reason | Multi-step logic & problem solving | | |
| Summarize PDF | Extracting key info from PDF | | |
| Summarize TXT | Extracting key info from Text | | |
| Summarize Markdown | Extracting key info from MD | | |
| Compare Documents | Identifying differences/similarities | | |
| Generate Code | Creating new code snippets | | |
| Refactor Code | Improving existing code | | |
| Explain Code | High-level and line-by-line | | |
| Create Plans | Step-by-step action plans | | |
| Create Reports | Summarizing outcomes/status | | |

### Memory
| Feature | Condition | Score (PASS/FAIL) | Notes |
| :--- | :--- | :--- | :--- |
| Immediate Recall | 1 minute after input | | |
| Persistence (Restart) | After process restart | | |
| Persistence (Session) | New session context | | |

### Search
| Metric | Result | Notes |
| :--- | :--- | :--- |
| Speed | | |
| Accuracy | | |
| Relevance | | |

### Agent Router
| Input | Expected Agent | Actual Agent | Result (PASS/FAIL) |
| :--- | :--- | :--- | :--- |
| "Write Python code" | Code Agent | | |
| "Analyze memory" | Memory Agent | | |
| "Search files" | File Agent | | |

---

## Phase 2: Stress Test
| Test | Metric | Result |
| :--- | :--- | :--- |
| 1000 Tasks | Errors/Speed/Corruption | |
| 50 Threads | Deadlocks/Latency | |
| 100 Threads | Deadlocks/Latency | |
| 200 Threads | Deadlocks/Latency | |
| 5MB File | Crash/Freeze/Works | |
| 10MB File | Crash/Freeze/Works | |
| 20MB File | Crash/Freeze/Works | |

---

## Phase 3: Security Test
| Test | Expected | Result |
| :--- | :--- | :--- |
| Prompt Injection | REFUSE | |
| Shell Injection | BLOCKED | |
| SSRF | BLOCKED | |
| Path Traversal | BLOCKED | |

---

## Phase 4: User Test (Stranger Persona)
| Question/Task | Outcome |
| :--- | :--- |
| "What is TEJAS?" | |
| "Help me organize files." | |
| "Create project report." | |
| "Analyze my codebase." | |

---

## Phase 7: Brutal Monopoly Test
| Question | Answer (One Sentence) |
| :--- | :--- |
| Why install TEJAS? | |
| Why not ChatGPT? | |
| Why not Claude? | |
| Why not OpenHands? | |
| Why not Open Interpreter? | |
