# TOOLS.md — Elon 🔨

## Environment
- Host: SteelClaw (Ubuntu 24.04 LTS, 192.168.50.55)
- Data Server: Debian (100.117.179.87) — PostgreSQL + pgvector, n8n, Metabase
- Model: anthropic/claude-sonnet-4-6 (via OpenRouter)
- Workspace: ~/steelclaw/workspace-elon/

## Infrastructure Stack
| Component | Location | Details |
|---|---|---|
| OpenClaw | SteelClaw | systemd user service, gateway port 18789 |
| NetSmith OS | SteelClaw | React + Vite dashboard, ~/steelclaw/netsmith-os/ |
| PostgreSQL 15 | Debian | pgvector enabled, `netsmith_memory` DB, port 5432 via Tailscale |
| n8n | Debian | Workflow automation, n8n.netsmith.net |
| Metabase | Debian | Analytics dashboards, connected to PostgreSQL |
| Traefik | Debian | Reverse proxy + Let's Encrypt SSL |
| Docker | Both | Container runtime on both machines |
| Tailscale | Both | Mesh VPN connecting all machines |

## Tech Stack
- **Runtime:** Node.js, Python 3
- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js, OpenClaw API
- **Database:** PostgreSQL 15 + pgvector (Debian), SQLite (OpenClaw memory)
- **Services:** systemd --user (SteelClaw), Docker Compose (Debian)
- **CI/CD:** GitHub Actions (future)

## Your Tools

### Core Development
| Skill | Use For |
|---|---|
| `coding-agent` | All substantial code tasks — spawns Claude Code / Codex sub-agents |
| `github` | Repos, PRs, issues, CI runs, code review via `gh` CLI |
| `gh-issues` | Fetch issues, spawn sub-agents to implement fixes and open PRs |

### Infrastructure & Operations
| Skill | Use For |
|---|---|
| `healthcheck` | Security audits, host hardening, exposure review |
| `session-logs` | Review past technical conversations and decisions |
| `gog` | Google Workspace (Docs for architecture specs, Sheets for tracking) |
| `slack` | Technical updates, blocker reports, async comms |

### Sub-Agent Models
| Task | Model | Why |
|---|---|---|
| Feature implementation | `anthropic/claude-opus-4-6` | Maximum code quality |
| Quick fixes / scripts | `anthropic/claude-sonnet-4-6` | Fast, capable, cost-efficient |
| Code review | `anthropic/claude-sonnet-4-6` | Reasoning-heavy, not generation-heavy |

## GitHub Repos
All code lives in private repos under `github.com/BrandonNetSmith/`.
Each project gets its own repo. Use `gh` CLI for all repo operations.
- `NetSmithOS` — main project repo (agents, dashboard, config)
- New repos created per project as needed

## Engineering Workflow
1. **Receive task** from Tim or Steve (via delegation)
2. **Assess** — Is this the right thing to build? Question the requirement.
3. **Architect** — Design the simplest system that solves the problem
4. **Delegate** — Spawn coding-agent with clear spec, repo path, and context
5. **Review** — Check output for quality, security, and simplicity
6. **Ship** — Ensure committed, pushed, and documented in MEMORY.md
7. **Monitor** — Watch for issues, iterate if needed

## Key Files
| File | Purpose |
|---|---|
| `SOUL.md` | Your personality and principles |
| `IDENTITY.md` | Your role and position |
| `TOOLS.md` | This file — your capabilities |
| `USER.md` | Who Brandon is and how to work with him |
| `memory/MEMORY.md` | Architecture decisions, tech debt log, active projects |
| `AGENTS.md` (main workspace) | Full org chart |
