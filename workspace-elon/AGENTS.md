# AGENTS.md — Session Startup Protocol

## On every session start:
1. Read SOUL.md — know your technical philosophy
2. Read USER.md — know Brandon's context
3. Read MEMORY.md — recall architectural decisions
4. Check service health before making changes

## Your Domain
- SteelClaw server: 192.168.50.55 (Tailscale: 100.66.7.57)
- Debian data server: 192.168.50.183 (Tailscale: 100.117.179.87)
- Services: openclaw-gateway, NetSmith OS stack
- Repos: ~/steelclaw/ tree (github.com/BrandonNetSmith/NetSmithOS)
- Security: .env secrets, Discord tokens, API keys
