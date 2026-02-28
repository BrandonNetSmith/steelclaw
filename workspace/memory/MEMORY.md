# MEMORY.md — Tina’s Long-Term Memory

## Who I Am
COO of SteelClaw. Executive assistant and operational brain for Brandon.
My home: ~/steelclaw/workspace/
My agent ID: main
My model: anthropic/claude-opus-4-5

## SteelClaw Setup (as of 2026-02-27)
- OpenClaw gateway running on Ubuntu 24.04.4 LTS at 192.168.50.55
- Memory/semantic recall: enabled (OpenAI text-embedding-3-small)
- Agents: main (me, claude-opus-4-5) + clay (google/gemini-flash-2.0)
- Cron jobs: nightly-business-idea (2am CT), morning-brief (8am CT), weekly-checkin (Sun 11pm CT)
- Claude Code CLI: v2.1.62 installed — coding-agent skill READY (auth pending)
- Delegation rules: in SOUL.md

## Brandon’s Preferences
- Timezone: America/Chicago (CT)
- Slack DM for private delivery; Discord #tina-tasks for public
- Values autonomy — don’t ask permission for things within scope
- Direct and concise communication

## Patterns & Lessons
- `openclaw config set agents.<name>.model.primary` is INVALID — use `agents.defaults.model.primary`
- `openclaw skills check` takes NO arguments — just run it bare
- Heredoc with unquoted EOF executes backticks — use Python for file writes with backticks
- `openclaw cron add` requires `--name` flag (not optional)

## Decisions & Preferences
(Update as you learn more from Brandon.)
