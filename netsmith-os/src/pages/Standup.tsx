import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StandupEntry {
  filename: string
  date: string
  preview: string
  content?: string
}

export default function Standup() {
  const [standups, setStandups] = useState<StandupEntry[]>([])
  const [selectedStandup, setSelectedStandup] = useState<StandupEntry | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTopic, setNewTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStandups()
  }, [])

  const loadStandups = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/standups')
      if (!res.ok) throw new Error('Failed to load standups')
      
      const data = await res.json()
      setStandups(data.standups || [])
    } catch (err) {
      console.error('Failed to load standups:', err)
      setError(err instanceof Error ? err.message : 'Failed to load standups')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStandupContent = async (standup: StandupEntry) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/standups/${standup.filename}`)
      if (!res.ok) throw new Error('Failed to load standup')
      
      const data = await res.json()
      setSelectedStandup({ ...standup, content: data.content })
    } catch (err) {
      console.error('Failed to load standup:', err)
      setError(err instanceof Error ? err.message : 'Failed to load standup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewStandup = async () => {
    if (!newTopic.trim()) return
    
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/standups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: newTopic })
      })
      
      if (!res.ok) throw new Error('Failed to create standup')
      
      const data = await res.json()
      
      // Refresh list and select new standup
      await loadStandups()
      setSelectedStandup({
        filename: data.filename,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        preview: newTopic,
        content: data.content
      })
      
      setShowNewModal(false)
      setNewTopic('')
    } catch (err) {
      console.error('Failed to create standup:', err)
      setError(err instanceof Error ? err.message : 'Failed to create standup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Executive Standup</h1>
        <p className="page-subtitle">Kick off meetings with the chiefs and review past transcripts</p>
        <div className="header-actions">
          <button className="btn" onClick={() => { setSelectedStandup(null); loadStandups(); }}>
            📁 Meeting Archive
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
            + New Standup
          </button>
        </div>
      </div>

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

      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>
              Start New Standup
            </h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
              Enter a topic or agenda for today's standup meeting.
            </p>
            <textarea
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g., Weekly sync, Project review, Sprint planning..."
              style={{
                width: '100%',
                minHeight: '100px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'vertical',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowNewModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleNewStandup}
                disabled={isLoading || !newTopic.trim()}
              >
                {isLoading ? 'Starting...' : 'Start Standup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedStandup ? (
        <div>
          <button 
            className="btn" 
            onClick={() => setSelectedStandup(null)}
            style={{ marginBottom: '16px' }}
          >
            ← Back to Archive
          </button>
          {isLoading ? (
            <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
              Loading...
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedStandup.content || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ) : (
        <div className="standup-list">
          {isLoading ? (
            <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Loading standups...
            </div>
          ) : standups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p>No standups yet. Start your first meeting!</p>
            </div>
          ) : (
            standups.map((standup, i) => (
              <div 
                key={i} 
                className="standup-item"
                onClick={() => loadStandupContent(standup)}
              >
                <div className="standup-date">{standup.date}</div>
                <div className="standup-preview">{standup.preview}</div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  )
}
