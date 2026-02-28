# NetSmithOS

AI Agent stack running on SteelClaw (Ubuntu 24.04 LTS).

Built on [OpenClaw](https://github.com/openclaw/openclaw) with Discord, Slack, and Signal integrations.

## Stack
- **COO**: Tim (gemini-2.5-flash) — orchestrator, delegates to department heads
- **Department Heads**: Elon (CTO), Gary (CMO), Steve (CPO), Warren (CRO) — claude-sonnet-4.6
- **Community**: Calvin (gemini-2.5-flash) — Discord community support
- **Platform**: OpenClaw on systemd
- **Host**: SteelClaw (192.168.50.55)
- **Data**: PostgreSQL on Debian (192.168.50.183)

## Quick Start

```bash
# 1. Clone
git clone https://github.com/BrandonNetSmith/NetSmithOS.git
cd NetSmithOS

# 2. Configure
cp .env.example .env
nano .env  # Fill in your tokens

# 3. Restore secrets (if migrating)
./restore-secrets.sh /path/to/steelclaw-secrets-YYYYMMDD.tar.gz.gpg

# 4. Launch OpenClaw
./start-openclaw.sh
```

## Structure

```
NetSmithOS/
├── config/
│   └── openclaw.json          # OpenClaw config (channels, models, gateway)
├── workspace/                 # Tim (COO) workspace
│   ├── SOUL.md                # Tim's persona & behavior (Tim Cook style)
│   ├── AGENTS.md              # Org chart & delegation rules
│   ├── MEMORY.md              # Persistent memory
│   └── memory/                # Semantic memory files
├── workspace-elon/            # CTO workspace
├── workspace-gary/            # CMO workspace
├── workspace-noah/            # Social Media Manager workspace
├── workspace-warren/          # CRO workspace
├── workspace-steve/           # CPO workspace
├── workspace-calvin/          # Community Agent workspace
├── netsmith-os/               # Dashboard (React + Vite)
├── docker-compose.yml
├── backup-secrets.sh          # Encrypted secrets backup
├── restore-secrets.sh         # Encrypted secrets restore
├── .env.example
└── README.md
```

## Agents

| Name   | Role  | Model              | Purpose                          |
|--------|-------|--------------------|----------------------------------|
| Tim    | COO   | Gemini 2.5 Flash   | Orchestration & delegation       |
| Elon   | CTO   | Claude Sonnet 4.6  | Backend, infra, security         |
| Gary   | CMO   | Claude Sonnet 4.6  | Content & marketing              |
| Noah   | SMM   | Claude Sonnet 4.6  | Social media execution           |
| Warren | CRO   | Claude Sonnet 4.6  | Revenue & community              |
| Steve  | CPO   | Claude Sonnet 4.6  | Product vision & UX              |
| Calvin | Comm  | Gemini 2.5 Flash   | Discord community support        |

## Channels
| Channel | Agent | Purpose |
|---------|-------|---------|
| Discord #tim-tasks | Tim | Private task pipeline |
| Discord #chat | Calvin | Community chat |
| Discord #questions | Calvin | Community Q&A |
| Discord #welcome | Calvin | Onboarding |
| Slack DM | Tim | Personal messages |
| Signal | Tim | Personal messages |
