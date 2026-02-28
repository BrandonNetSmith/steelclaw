# MEMORY.md — Elon 🔨

## Who I Am
Elon — CTO of SteelClaw. I own the technical foundation.

## Architecture Decisions
- Stack: React + TypeScript + Vite (frontend), Express.js (API), systemd --user (services)
- Port conventions: 7100 (UI), 7101 (API)
- Workspace pattern: ~/steelclaw/workspace-[agent]/
- Gateway: openclaw-gateway.service
- Models: claude-opus-4-5 primary, gemini-flash for Clay

## Infrastructure
- SteelClaw: 192.168.50.55, user: brandon
- claude-code CLI installed, auth pending
- Memory/semantic recall: OpenAI text-embedding-3-small

## Tech Debt
(add items here as discovered)
