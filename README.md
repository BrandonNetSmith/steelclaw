# SteelClaw

Muddy — Personal AI Agent stack running on SteelClaw (Ubuntu 24.04 LTS).

Built on [OpenClaw](https://github.com/openclaw/openclaw) with Discord, Slack, and Signal integrations.

## Stack
- **Agent**: Muddy (claude-opus-4-6) — personal orchestrator
- **Community**: Clay (gemini-flash) — community support  
- **Platform**: OpenClaw on Docker
- **Host**: SteelClaw (192.168.50.55)

## Quick Start

```bash
# 1. Clone
git clone https://github.com/BrandonNetSmith/steelclaw.git
cd steelclaw

# 2. Configure
cp .env.example .env
nano .env  # Fill in your tokens

# 3. Launch
docker compose up -d

# 4. View logs
docker compose logs -f
```

## Structure

```
steelclaw/
├── config/
│   └── openclaw.json      # OpenClaw config (channels, model, gateway)
├── workspace/
│   ├── SOUL.md             # Muddy's persona & behavior
│   ├── AGENTS.md           # Multi-agent routing (Muddy + Clay)
│   └── skills/
│       └── memory/         # Persistent memory skill
│           └── SKILL.md
├── docker-compose.yml
├── .env.example
└── README.md
```

## Channels
| Channel | Agent | Purpose |
|---------|-------|---------|
| Discord #muddy-tasks | Muddy | Private task pipeline |
| Discord #chat | Clay | Community chat |
| Discord #questions | Clay | Community Q&A |
| Discord #welcome | Clay | Onboarding |
| Slack DM | Muddy | Personal messages |

## Skills
- **memory** — Persistent memory across sessions
- **sora_longform_generator** — 30-60s AI video generation (coming soon)
