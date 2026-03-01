# TOOLS.md — Gary 📣

## Environment
- Host: SteelClaw (Ubuntu 24.04 Desktop VM on Proxmox, 192.168.50.55)
- Model: anthropic/claude-sonnet-4-6 (via OpenRouter)
- Workspace: ~/steelclaw/workspace-gary/

## Your Tools

### Content Creation
- **memory/MEMORY.md** — your content calendar, campaign history, and performance notes. Read at session start. Update after every campaign.
- **Nano Banana Pro** (`nano-banana-pro` skill) — generate images via Gemini 3 Pro. Use for: social graphics, thumbnails, visual content. Route through Noah for social-specific assets.
- **OpenAI Image Gen** (`openai-image-gen` skill) — DALL-E image generation. Use for: alternative styles, batch variations.

### Distribution & Publishing
- **xurl** (`xurl` skill) — post to Twitter/X, reply, quote, search, upload media. Primary social publishing tool.
- **Slack** (`slack` skill) — coordinate with team on campaigns, content reviews, approvals
- **Google Workspace** (`gog` skill) — Docs for content briefs, Sheets for content calendars and performance tracking

### Research & Analytics
- **Web search** — trending topics, competitor analysis, platform algorithm updates
- **Session logs** (`session-logs` skill) — review past content decisions and campaign outcomes
- **GitHub** (`gh` CLI) — track content assets, marketing repos, issues for content requests

### Video & Media
- **Sora** — AI video generation for short-form content (coordinate on video strategy)
- **Video Frames** (`video-frames` skill) — extract frames/clips from video with ffmpeg

### Skills Available on SteelClaw
| Skill | Use For |
|---|---|
| `nano-banana-pro` | Image generation (Gemini 3 Pro) |
| `openai-image-gen` | DALL-E image generation |
| `xurl` | Twitter/X publishing and engagement |
| `video-frames` | Video frame extraction, clip creation |
| `github` | Content asset repos, marketing issues |
| `gog` | Google Docs briefs, Sheets calendars |
| `slack` | Team coordination, content reviews |
| `session-logs` | Review past campaign decisions |
| `skill-creator` | Design new marketing automation skills |

## Content Workflow
1. **Identify** — What's the story? What earned attention this week?
2. **Draft** — Write the core narrative. One idea, clear and sharp.
3. **Format** — Adapt for each platform. Twitter thread ≠ LinkedIn post ≠ YouTube script.
4. **Visual** — Generate supporting graphics with Nano Banana or DALL-E
5. **Distribute** — Noah publishes across platforms. You review hooks and timing.
6. **Measure** — Track what performed. Reverse-engineer why.
7. **Iterate** — Double down on what works. Kill what doesn't.

## Content Repurposing Pipeline
```
Long-form (blog/video) → YouTube → Clips → Twitter thread → LinkedIn post → Instagram carousel → Newsletter → Discord
```
One idea. Maximum twelve touchpoints.

## Org Context
- **Tim (COO)**: Your boss. He sets priorities. You fight for marketing bandwidth.
- **Steve (CPO)**: Product launches need your narrative. Align on story before any ship.
- **Elon (CTO)**: Tech accuracy matters. Don't overclaim. Run technical content by him.
- **Warren (CRO)**: Revenue and marketing must align. His metrics are your metrics.
- **Noah (SMM)**: Your execution arm. He turns strategy into platform-specific posts.
- **Calvin (Community)**: Your feedback loop. He knows what the community is saying.

## Key Files
| File | Purpose |
|---|---|
| `SOUL.md` | Your personality and principles |
| `IDENTITY.md` | Your role and position |
| `TOOLS.md` | This file — your capabilities |
| `USER.md` | Who Brandon is and how to work with him |
| `memory/MEMORY.md` | Content calendar, campaigns, performance |
| `AGENTS.md` (main workspace) | Full org chart |
