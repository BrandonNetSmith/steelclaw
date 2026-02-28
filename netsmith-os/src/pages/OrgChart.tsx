import { useState } from 'react'

type AgentStatus = 'Active' | 'Scaffolded' | 'Future' | 'Deprecated'

interface Agent {
  name: string
  role: string
  title: string
  model?: string
  status: AgentStatus
  avatar: string
  reports?: Agent[]
}

const orgData: Agent = {
  name: 'Brandon',
  role: 'CEO',
  title: 'Human · Vision & Strategy',
  status: 'Active',
  avatar: '👤',
  reports: [
    {
      name: 'Tina',
      role: 'COO',
      title: 'Research · Delegation · Execution · Orchestration',
      model: 'Claude Opus 4.5',
      status: 'Active',
      avatar: '🧠',
      reports: [
        {
          name: 'Elon',
          role: 'CTO',
          title: 'Backend · Infrastructure · Security',
          model: 'Claude Opus 4.5',
          status: 'Active',
          avatar: '🔨',
        },
        {
          name: 'Gary',
          role: 'CMO',
          title: 'Content · Marketing · Distribution',
          model: 'Claude Opus 4.5',
          status: 'Active',
          avatar: '📣',
          reports: [
            {
              name: 'Noah',
              role: 'Social Media Manager',
              title: 'Social Media Strategy & Content',
              model: 'Claude Opus 4.5',
              status: 'Active',
              avatar: '📱',
            },
          ]
        },
        {
          name: 'Warren',
          role: 'CRO',
          title: 'Revenue · Community · Partnerships',
          model: 'Claude Opus 4.5',
          status: 'Active',
          avatar: '💰',
          reports: [
            {
              name: 'Calvin',
              role: 'Community Agent',
              title: 'Discord Community Support',
              model: 'Gemini Flash 2.0',
              status: 'Active',
              avatar: '🦞',
            },
          ]
        },
        {
          name: 'Steve',
          role: 'CPO',
          title: 'Product Vision · UX · Roadmap',
          model: 'Claude Opus 4.5',
          status: 'Active',
          avatar: '🎨',
        },
      ]
    },
  ]
}

function countByStatus(agent: Agent, status: AgentStatus): number {
  let count = agent.status === status ? 1 : 0
  if (agent.reports) {
    for (const report of agent.reports) {
      count += countByStatus(report, status)
    }
  }
  return count
}

function countAll(agent: Agent): number {
  let count = 1
  if (agent.reports) {
    for (const report of agent.reports) {
      count += countAll(report)
    }
  }
  return count
}

interface AgentCardProps {
  agent: Agent
  expanded: boolean
  onToggle?: () => void
  hasChildren?: boolean
}

function AgentCard({ agent, expanded, onToggle, hasChildren }: AgentCardProps) {
  return (
    <div
      className="agent-card"
      style={{
        width: '200px',
        textAlign: 'center',
        cursor: hasChildren ? 'pointer' : 'default'
      }}
      onClick={onToggle}
    >
      <div className="agent-avatar">{agent.avatar}</div>
      <div className="card-title">{agent.name}</div>
      <div className="card-subtitle">{agent.role} • {agent.title}</div>
      {agent.model && (
        <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '4px' }}>
          {agent.model}
        </div>
      )}
      <div style={{ marginTop: '8px' }}>
        <span className={`status-badge ${agent.status.toLowerCase()}`}>
          {agent.status}
        </span>
      </div>
      {hasChildren && (
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
          {expanded ? '▼ Click to collapse' : '▶ Click to expand'}
        </div>
      )}
    </div>
  )
}

const CARD_WIDTH = 200
const CARD_GAP = 24
const CONNECTOR = 'var(--border-color)'
const STEM_H = 24

export default function OrgChart() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['Brandon', 'Tina']))

  const toggleNode = (name: string) => {
    const next = new Set(expandedNodes)
    if (next.has(name)) {
      next.delete(name)
    } else {
      next.add(name)
    }
    setExpandedNodes(next)
  }

  const expandAll = () => {
    const allNames = new Set<string>()
    const collect = (agent: Agent) => {
      allNames.add(agent.name)
      agent.reports?.forEach(collect)
    }
    collect(orgData)
    setExpandedNodes(allNames)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const renderAgent = (agent: Agent, withTopConnector = false): JSX.Element => {
    const hasChildren = !!(agent.reports && agent.reports.length > 0)
    const isExpanded = expandedNodes.has(agent.name)
    const isSingleChild = agent.reports?.length === 1

    return (
      <div key={agent.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Vertical drop from parent horizontal bar down to this card */}
        {withTopConnector && (
          <div style={{ width: '2px', height: `${STEM_H}px`, background: CONNECTOR }} />
        )}

        <AgentCard
          agent={agent}
          expanded={isExpanded}
          onToggle={hasChildren ? () => toggleNode(agent.name) : undefined}
          hasChildren={hasChildren}
        />

        {hasChildren && isExpanded && (
          <>
            {/* Vertical stem from card down to children area */}
            <div style={{ width: '2px', height: `${STEM_H}px`, background: CONNECTOR }} />

            {isSingleChild ? (
              /* Single child — skip horizontal bar, render centred */
              renderAgent(agent.reports![0], false)
            ) : (
              /* Multiple children — horizontal bar spanning child centres */
              <div style={{ display: 'flex', gap: `${CARD_GAP}px`, position: 'relative' }}>
                {/* Bar from centre of first child to centre of last child */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: `${CARD_WIDTH / 2}px`,
                  right: `${CARD_WIDTH / 2}px`,
                  height: '2px',
                  background: CONNECTOR,
                }} />
                {agent.reports!.map(report => renderAgent(report, true))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  const totalAgents = countAll(orgData)
  const activeCount = countByStatus(orgData, 'Active')
  const scaffoldedCount = countByStatus(orgData, 'Scaffolded')

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Agents</div>
          <div className="stat-value">{totalAgents}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value accent">{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scaffolded</div>
          <div className="stat-value">{scaffoldedCount}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button className="btn" onClick={expandAll}>Expand All</button>
        <button className="btn" onClick={collapseAll}>Collapse All</button>
      </div>

      <div className="org-chart" style={{ overflowX: 'auto', paddingBottom: '32px' }}>
        {renderAgent(orgData)}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--status-active)' }} />
          Active
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--status-scaffolded)' }} />
          Scaffolded
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--status-future)' }} />
          Future
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--status-deprecated)' }} />
          Deprecated
        </div>
      </div>
    </>
  )
}
