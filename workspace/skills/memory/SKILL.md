# Memory Skill

A persistent memory system for Muddy. Stores and retrieves facts, decisions,
preferences, and context across conversations.

## How It Works
Memory is stored as markdown files in . Each file is a
named memory category. Muddy reads and writes these files to maintain context
between sessions.

## Usage

### Save a memory
```
memory save <category> <content>
```
Examples:
- `memory save preferences Boss prefers concise updates, no fluff`
- `memory save decisions 2026-02-26: chose Clay as community agent model`
- `memory save projects steelclaw: OpenClaw setup on Ubuntu 24.04 VM`

### Recall a memory
```
memory recall <category>
```

### List all memories
```
memory list
```

## Memory Categories
- **preferences**: Boss's preferences and working style
- **decisions**: Key decisions made, with dates
- **projects**: Active projects and their status
- **people**: Key people, roles, contacts
- **briefing**: Morning brief — current tasks and open items

## Notes
- Memory persists between Docker container restarts via mounted volume
- Always check memory at the start of a new conversation for context
- Update the briefing category daily with current status
