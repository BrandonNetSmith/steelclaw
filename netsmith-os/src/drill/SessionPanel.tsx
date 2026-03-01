import type { Session } from "../api/types";

interface SessionPanelProps {
  sessions: Session[];
  agentId: string;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString();
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

export function SessionPanel({ sessions, agentId: _agentId }: SessionPanelProps) {
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  if (sorted.length === 0) {
    return (
      <div className="drill-panel">
        <div className="drill-panel-header">
          <span className="drill-panel-title">Active Sessions</span>
        </div>
        <div className="drill-panel-body">
          <div className="no-data-message">No active sessions</div>
        </div>
      </div>
    );
  }

  return (
    <div className="drill-panel">
      <div className="drill-panel-header">
        <span className="drill-panel-title">Active Sessions</span>
        <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
          {sorted.length} session{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="drill-panel-body">
        <table className="session-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Model</th>
              <th>In / Out</th>
              <th>Context</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const pct = s.contextTokens > 0
                ? Math.round((s.totalTokens / s.contextTokens) * 100)
                : 0;
              const barClass = pct >= 90 ? "critical" : pct >= 70 ? "high" : "";

              return (
                <tr key={s.key}>
                  <td>
                    <span className="session-key" title={s.key}>
                      {s.key.length > 12 ? s.key.slice(0, 12) + "\u2026" : s.key}
                    </span>
                  </td>
                  <td>
                    <span className="session-model">{s.model}</span>
                  </td>
                  <td className="session-tokens">
                    {formatTokens(s.inputTokens)} / {formatTokens(s.outputTokens)}
                  </td>
                  <td>
                    <span className="context-bar-container">
                      <span
                        className={`context-bar-fill ${barClass}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </span>
                    <span className="context-pct">{pct}%</span>
                  </td>
                  <td className="session-time">{formatTime(s.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
