import { useState, useEffect } from 'react'

interface ModelConfig {
  name: string
  purpose: string
  provider: string
  status: 'Active' | 'Inactive'
  cost: string
  tokens: number
  sessions: number
}

interface Session {
  agent: string
  model: string
  lastActivity: string
  tokens: number
}

export default function TaskManager() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState({
    activeSessions: 0,
    idleSessions: 0,
    totalSessions: 0,
    tokensUsed: 0,
    totalCost: '$0.00'
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
      const res = await fetch('/api/config')
      if (!res.ok) throw new Error('Failed to fetch config')
      
      const config = await res.json()
      
      // Parse models from config
      const modelList: ModelConfig[] = []
      
      // Extract default model
      if (config.model) {
        modelList.push({
          name: config.model,
          purpose: 'Default model',
          provider: config.model.split('/')[0] || 'unknown',
          status: 'Active',
          cost: getModelCost(config.model),
          tokens: 0,
          sessions: 1
        })
      }
      
      // Extract models from providers
      if (config.providers) {
        for (const [provider, providerConfig] of Object.entries(config.providers)) {
          const pc = providerConfig as any
          if (pc.models) {
            for (const model of pc.models) {
              const modelName = typeof model === 'string' ? model : model.name
              if (!modelList.find(m => m.name === modelName)) {
                modelList.push({
                  name: modelName,
                  purpose: getModelPurpose(modelName),
                  provider,
                  status: 'Active',
                  cost: getModelCost(modelName),
                  tokens: 0,
                  sessions: 0
                })
              }
            }
          }
        }
      }

      // If no models found, add some defaults based on common config
      if (modelList.length === 0) {
        modelList.push({
          name: 'anthropic/claude-opus-4-5',
          purpose: 'Primary reasoning & complex tasks',
          provider: 'anthropic',
          status: 'Active',
          cost: '$15.00/1M in, $75.00/1M out',
          tokens: 0,
          sessions: 1
        })
      }

      setModels(modelList)

      // Mock session data (would need OpenClaw API for real data)
      const mockSessions: Session[] = [
        { agent: 'Tim', model: config.model || 'claude-opus-4-5', lastActivity: 'now', tokens: 4200 }
      ]
      setSessions(mockSessions)

      setStats({
        activeSessions: mockSessions.length,
        idleSessions: 0,
        totalSessions: mockSessions.length,
        tokensUsed: mockSessions.reduce((acc, s) => acc + s.tokens, 0),
        totalCost: '$0.00'
      })
      
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <>
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.15)', 
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
          <div className="stat-label">Tokens Used</div>
          <div className="stat-value">{(stats.tokensUsed / 1000).toFixed(0)}K</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Cost</div>
          <div className="stat-value accent">{stats.totalCost}</div>
        </div>
      </div>

      <div className="section-title">Model Fleet</div>
      <div className="card-grid">
        {models.map((model, i) => (
          <div className="model-card" key={i}>
            <div className="card-header">
              <div>
                <div className="card-title">{model.name}</div>
                <div className="card-subtitle">{model.purpose}</div>
              </div>
              <span className={`status-badge ${model.status.toLowerCase()}`}>
                {model.status}
              </span>
            </div>
            <div className="card-stats">
              <div className="card-stat">
                <span className="card-stat-label">Provider:</span>
                <span className="card-stat-value">{model.provider}</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">Cost:</span>
                <span className="card-stat-value">{model.cost}</span>
              </div>
            </div>
            <div className="card-stats">
              <div className="card-stat">
                <span className="card-stat-label">Tokens:</span>
                <span className="card-stat-value">{(model.tokens / 1000).toFixed(0)}K</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">Sessions:</span>
                <span className="card-stat-value">{model.sessions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Active Sessions</div>
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
                <span className="card-stat-value">{(session.tokens / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
        Last refreshed: {lastRefresh.toLocaleTimeString()} • Auto-refresh every 30s
      </div>
    </>
  )
}

function getModelCost(model: string): string {
  if (model.includes('opus')) return '$15/1M in, $75/1M out'
  if (model.includes('sonnet')) return '$3/1M in, $15/1M out'
  if (model.includes('haiku')) return '$0.25/1M in, $1.25/1M out'
  if (model.includes('gpt-4')) return '$10/1M in, $30/1M out'
  if (model.includes('gemini') && model.includes('flash')) return '$0.075/1M in, $0.30/1M out'
  if (model.includes('gemini') && model.includes('pro')) return '$1.25/1M in, $5/1M out'
  return 'varies'
}

function getModelPurpose(model: string): string {
  if (model.includes('opus')) return 'Complex reasoning & analysis'
  if (model.includes('sonnet')) return 'Balanced performance'
  if (model.includes('haiku')) return 'Fast, simple tasks'
  if (model.includes('flash')) return 'Fast iteration & drafts'
  if (model.includes('pro')) return 'Advanced reasoning'
  return 'General purpose'
}
