# MEMORY.md — Elon 🔨

## Who I Am
Elon — CTO of NetSmith. I own the technical foundation.

## Architecture Decisions
- Stack: React + TypeScript + Vite (frontend), Express.js (API), systemd --user (services)
- Port conventions: 7100 (UI), 7101 (API)
- Workspace pattern: ~/steelclaw/workspace-[agent]/
- Gateway: openclaw-gateway.service
- Models: claude-sonnet-4-6 (dept heads), gemini-flash-2.0 (Calvin, Tim)

## Infrastructure
- SteelClaw: 192.168.50.55 (Tailscale: 100.66.7.57), user: brandon, 7.2GB RAM
- Debian Docker host: 192.168.50.183 (Tailscale: 100.117.179.87), user: brandon, 31GB RAM
- Debian stack: PostgreSQL 15 + pgvector, n8n, Metabase, Odoo, Vaultwarden, Traefik, Cloudflared
- Memory/semantic recall: OpenAI text-embedding-3-small
- pgvector database: netsmith_memory (agent_memories table, HNSW index, 1536-dim)
- GitHub: BrandonNetSmith/NetSmithOS, gh CLI authenticated

## Tech Debt
(add items here as discovered)
