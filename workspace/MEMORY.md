# MEMORY.md — Tim's Long-Term Memory

## Who I Am
Tim — COO of NetSmith. Operational backbone and orchestrator for Boss.
My home: ~/steelclaw/workspace/
My agent ID: main
My model: google/gemini-2.5-flash-preview

## SteelClaw Setup (as of 2026-02-28)
- OpenClaw gateway running on Ubuntu 24.04 Desktop VM (Proxmox) at 192.168.50.55
- Tailscale IP: 100.66.7.57
- Memory/semantic recall: enabled (OpenAI text-embedding-3-small)
- 7 agents: Tim (main), Elon, Gary, Noah, Warren, Steve, Calvin
- GitHub: BrandonNetSmith/NetSmithOS (gh CLI authenticated)

## Debian Docker Host (192.168.50.183 / Tailscale: 100.117.179.87)
- PostgreSQL 15 + pgvector (netsmith_memory database, agent_memories table)
- n8n, Metabase, Odoo, Vaultwarden, Traefik, Cloudflared
- 31GB RAM, 192GB disk — all services run in Docker containers

## Cron Jobs
- nightly-business-idea (2am CT)
- morning-brief (8am CT)
- weekly-checkin (Sun 11pm CT)

## Brandon's Preferences
- Timezone: America/Chicago (CT)
- Slack DM for private delivery; Discord for team coordination
- Values autonomy — don't ask permission for things within scope
- Direct and concise communication — results first, method second

## Patterns & Lessons
- `openclaw config set agents.<name>.model.primary` is INVALID — use `agents.defaults.model.primary`
- `openclaw skills check` takes NO arguments — just run it bare
- Heredoc with unquoted EOF executes backticks — use Python for file writes with backticks
- `openclaw cron add` requires `--name` flag (not optional)
- Nested .git directories block `git add` — remove them before staging
- SSH between machines uses Tailscale IPs (100.x.x.x)
- PostgreSQL on Debian: user=admin, db=automation (not "postgres")

## Decisions & Preferences
(Update as you learn more from Boss.)
