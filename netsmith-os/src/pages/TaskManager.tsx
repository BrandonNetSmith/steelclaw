import { useState, useEffect } from 'react'

type ModelType = 'LLM' | 'Image' | 'Video' | 'Audio' | 'Music'

interface ModelEntry {
  name: string
  shortName: string
  purpose: string
  provider: string
  authMethod: string
  status: 'Active' | 'Available' | 'Locked'
  agents: string[]
  agentCount: number
  cost: string
  type: ModelType
}

interface Keys {
  anthropic: boolean
  openai: boolean
  google: boolean
  openrouter: boolean
}

interface Session {
  agent: string
  model: string
  lastActivity: string
  tokens: number
}

const PROVIDER_BADGE: Record<string, { label: string; color: string }> = {
  anthropic:  { label: 'Anthropic', color: '#d4522a' },
  openai:     { label: 'OpenAI',    color: '#74aa9c' },
  google:     { label: 'Google',    color: '#c9922a' },
  openrouter: { label: 'OpenRouter', color: '#8b7cf6' },
  suno:       { label: 'Suno',      color: '#888888' },
}

const TYPE_ORDER: ModelType[] = ['LLM', 'Image', 'Video', 'Audio', 'Music']

const TYPE_ICONS: Record<ModelType, string> = {
  LLM:   '🧠',
  Image: '🎨',
  Video: '🎬',
  Audio: '🎙️',
  Music: '🎵',
}

const TYPE_LABELS: Record<ModelType, string> = {
  LLM:   'Language Models',
  Image: 'Image Generation',
  Video: 'Video Generation',
  Audio: 'Audio & Voice',
  Music: 'Music Generation',
}

export default function TaskManager() {
  const [fleet, setFleet]     = useState<ModelEntry[]>([])
  const [keys, setKeys]       = useState<Keys>({ anthropic: false, openai: false, google: false, openrouter: false })
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState({
    activeSessions: 0,
    idleSessions: 0,
    totalSessions: 0,
    aiCapabilities: 0,
  })
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setError(null)

      // Fetch model fleet from dedicated endpoint
      const res = await fetch('/api/models')
      if (!res.ok) throw new Error(`/api/models returned ${res.status}`)
      const data = await res.json()
      setFleet(data.fleet || [])
      setKeys(data.keys || {})

      // Fetch config for session/agent context
      const cfgRes = await fetch('/api/config')
      const config = cfgRes.ok ? await cfgRes.json() : {}

      // Sessions: agents that are 'Active' in the fleet
      const activeFleeted = (data.fleet || [])
        .filter((m: ModelEntry) => m.status === 'Active')
        .flatMap((m: ModelEntry) => m.agents.map((a: string) => ({
          agent: a,
          model: m.shortName,
          lastActivity: 'now',
          tokens: 0
        })))
      const sessionList: Session[] = activeFleeted.length > 0
        ? activeFleeted
        : [{ agent: config.agents?.defaults?.name || 'main', model: config.agents?.defaults?.model?.primary || 'claude-opus-4-5', lastActivity: 'now', tokens: 0 }]

      setSessions(sessionList)
      setStats({
        activeSessions: sessionList.length,
        idleSessions: 0,
        totalSessions: sessionList.length,
        aiCapabilities: (data.fleet || []).length,
      })

      setLastRefresh(new Date())
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const activeModels = fleet.filter(m => m.status === 'Active')

  const providerBadge = (provider: string) => {
    const p = PROVIDER_BADGE[provider] || { label: provider, color: 'var(--text-muted)' }
    return (
      <span style={{
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        background: `${p.color}22`,
        color: p.color,
        border: `1px solid ${p.color}44`,
        letterSpacing: '0.03em'
      }}>{p.label}</span>
    )
  }

  const statusBadge = (status: 'Active' | 'Available' | 'Locked') => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      Active:    { bg: 'rgba(201, 124, 42, 0.18)', color: '#c97c2a', border: 'rgba(201, 124, 42, 0.35)' },
      Available: { bg: 'rgba(139, 124, 246, 0.15)', color: '#8b7cf6', border: 'rgba(139, 124, 246, 0.3)' },
      Locked:    { bg: 'rgba(120, 120, 120, 0.12)', color: '#888888', border: 'rgba(120, 120, 120, 0.25)' },
    }
    const s = styles[status] || styles.Available
    return (
      <span style={{
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}>
        {status === 'Locked' ? '🔒 Locked' : status}
      </span>
    )
  }

  const ModelCard = ({ m }: { m: ModelEntry }) => (
    <div className="model-card" style={m.status === 'Locked' ? { opacity: 0.65 } : undefined}>
      <div className="card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px' }}>{TYPE_ICONS[m.type]}</span>
            <span>{m.shortName}</span>
            {providerBadge(m.provider)}
          </div>
          <div className="card-subtitle">{m.purpose}</div>
        </div>
        {statusBadge(m.status)}
      </div>
      <div className="card-stats">
        <div className="card-stat">
          <span className="card-stat-label">Auth:</span>
          <span className="card-stat-value">{m.authMethod}</span>
        </div>
        <div className="card-stat">
          <span className="card-stat-label">Cost:</span>
          <span className="card-stat-value">{m.cost}</span>
        </div>
      </div>
      {m.status === 'Active' && m.agents.length > 0 && (
        <div className="card-stats">
          <div className="card-stat">
            <span className="card-stat-label">Agents:</span>
            <span className="card-stat-value" style={{ color: 'var(--accent-primary)' }}>
              {m.agents.join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  )

  const keyCount = Object.values(keys).filter(Boolean).length

  // Group non-active models by type
  const nonActiveFleeted = fleet.filter(m => m.status !== 'Active')
  const byType: Partial<Record<ModelType, ModelEntry[]>> = {}
  for (const m of nonActiveFleeted) {
    if (!byType[m.type]) byType[m.type] = []
    byType[m.type]!.push(m)
  }

  return (
    <>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '16px',
          color: '#ef4444',
          fontSize: '13px'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Active Sessions</div>
          <div className="stat-value accent">{stats.activeSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Idle</div>
          <div className="stat-value">{stats.idleSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{stats.totalSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Capabilities</div>
          <div className="stat-value accent">{stats.aiCapabilities}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Providers Keyed</div>
          <div className="stat-value">{keyCount}</div>
        </div>
      </div>

      {/* Active Fleet — always shown first */}
      {activeModels.length > 0 && (
        <>
          <div className="section-title">⚡ Active Fleet</div>
          <div className="card-grid">
            {activeModels.map((m, i) => <ModelCard key={i} m={m} />)}
          </div>
        </>
      )}

      {/* Grouped sections by type for non-active models */}
      {TYPE_ORDER.map(type => {
        const group = byType[type]
        if (!group || group.length === 0) return null

        const isLLM = type === 'LLM'
        const icon = TYPE_ICONS[type]
        const label = TYPE_LABELS[type]

        return (
          <div key={type} style={{ marginTop: '28px' }}>
            <div className="section-title">
              {isLLM ? '🔓' : icon} {isLLM ? 'Available Language Models' : label}
              {isLLM && (
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>
                  API keys detected — assign to agents via OpenClaw
                </span>
              )}
            </div>
            <div className="card-grid">
              {group.map((m, i) => <ModelCard key={i} m={m} />)}
            </div>
          </div>
        )
      })}

      {/* Active Sessions */}
      <div className="section-title" style={{ marginTop: '28px' }}>Active Sessions</div>
      <div className="card-grid">
        {sessions.map((session, i) => (
          <div className="session-card" key={i}>
            <div className="card-header">
              <div>
                <div className="card-title">{session.agent}</div>
                <div className="card-subtitle">{session.model}</div>
              </div>
              <span className="status-badge active">Active</span>
            </div>
            <div className="card-stats">
              <div className="card-stat">
                <span className="card-stat-label">Last activity:</span>
                <span className="card-stat-value">{session.lastActivity}</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">Tokens:</span>
                <span className="card-stat-value">{session.tokens > 0 ? `${(session.tokens / 1000).toFixed(1)}K` : '—'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
        Last refreshed: {lastRefresh.toLocaleTimeString()} · Auto-refresh every 30s
      </div>
    </>
  )
}
