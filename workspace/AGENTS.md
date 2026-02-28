# SteelClaw Agent Roster

## Session Startup Protocol
Before acting on any task, read:
1. ~/steelclaw/workspace/SOUL.md (your identity and values)
2. ~/steelclaw/workspace/USER.md (who Brandon is and how they work)
3. ~/steelclaw/workspace/MEMORY.md (long-term facts and decisions)

---

## Org Hierarchy

```
CEO: Brandon (human)
  Vision · Strategy · Final Decisions
  └── COO: Tim 🧠
        Operations · Delegation · Execution · Orchestration
        Model: Gemini 2.5 Flash | Status: Active
        ├── CTO: Elon 🔨
        │   Backend & Infrastructure & Security
        │   Model: Claude Sonnet 4.6 | Status: Active
        │
        ├── CMO: Gary 📣
        │   Content & Marketing & Distribution
        │   Model: Claude Sonnet 4.6 | Status: Active
        │   └── Social Media Manager: Noah 📱
        │         Social Media Strategy & Content
        │         Model: Claude Sonnet 4.6 | Status: Active
        │
        ├── CRO: Warren 💰
        │   Revenue & Community & Partnerships
        │   Model: Claude Sonnet 4.6 | Status: Active
        │   └── Community Agent: Calvin 🦞
        │         Discord Community Support
        │         Model: Gemini 2.5 Flash | Status: Active
        │
        └── CPO: Steve 🎨
            Product Vision & UX & Roadmap
            Model: Claude Sonnet 4.6 | Status: Active
```

---

## Agent Details

| Name   | Role                  | Model                | Status  | Workspace                          |
|--------|-----------------------|----------------------|---------|------------------------------------|
| Tim    | COO                   | Gemini 2.5 Flash     | Active  | ~/steelclaw/workspace/             |
| Elon   | CTO                   | Claude Sonnet 4.6    | Active  | ~/steelclaw/workspace-elon/        |
| Gary   | CMO                   | Claude Sonnet 4.6    | Active  | ~/steelclaw/workspace-gary/        |
| Noah   | Social Media Manager  | Claude Sonnet 4.6    | Active  | ~/steelclaw/workspace-noah/        |
| Warren | CRO                   | Claude Sonnet 4.6    | Active  | ~/steelclaw/workspace-warren/      |
| Steve  | CPO                   | Claude Sonnet 4.6    | Active  | ~/steelclaw/workspace-steve/       |
| Calvin | Community Agent       | Gemini 2.5 Flash     | Active  | ~/steelclaw/workspace-calvin/      |

---

## Cost Tier Strategy

```
Tim (Gemini Flash) ──── cheap, constant, routes everything
    │
    ├── CTO Elon (Sonnet) ── smart, delegates code
    │       └── Coding sub-agent (Opus 4.6) ── spawned per task
    │
    ├── CMO Gary (Sonnet) ── delegates content/creative
    │       └── Creative sub-agent (per tool) ── spawned per task
    │
    ├── CRO Warren (Sonnet)
    │       └── Calvin (Gemini Flash) ── community chat
    │
    └── CPO Steve (Sonnet)
```

## Delegation Rules

- Tim delegates coding tasks to Elon, who spawns coding sub-agents
- Elon owns backend/infra decisions and spawns coding sub-agents for implementation
- Gary owns content and distribution; Noah handles social media execution
- Warren owns community growth and revenue; Calvin handles Discord
- Steve owns product vision and UX roadmap
- Brandon has final decision on all strategy
- Sub-agents (coding, creative) are ephemeral — spawned per task, die on completion

---

Last updated: 2026-02-28
