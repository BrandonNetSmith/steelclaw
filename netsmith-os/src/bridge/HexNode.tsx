import type { Agent } from "../api/types";

interface HexNodeProps {
  agent: Agent;
  cx: number;
  cy: number;
  r: number;
  onClick: () => void;
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function timeSince(ts: number | null): string {
  if (!ts) return "—";
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return sec + "s ago";
  if (sec < 3600) return Math.floor(sec / 60) + "m ago";
  if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
  return Math.floor(sec / 86400) + "d ago";
}

export function HexNode({ agent, cx, cy, r, onClick }: HexNodeProps) {
  const points = hexPoints(cx, cy, r);
  const innerPoints = hexPoints(cx, cy, r - 3);
  const statusClass = `hex-node ${agent.status}`;

  const badgeX = cx + r * 0.7;
  const badgeY = cy - r * 0.65;

  return (
    <g className={statusClass} onClick={onClick} style={{ cursor: "pointer" }}>
      <polygon className="hex-glow" points={points} fill="none" strokeWidth="2" />
      <polygon className="hex-fill" points={innerPoints} strokeWidth="1.5" />

      <text x={cx} y={cy - 18} textAnchor="middle" dominantBaseline="central"
            className="hex-emoji" fontSize="22">
        {agent.emoji}
      </text>

      <text x={cx} y={cy + 4} textAnchor="middle" dominantBaseline="central"
            className="hex-name">
        {agent.name}
      </text>

      <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="central"
            className="hex-role">
        {agent.role}
      </text>

      <text x={cx} y={cy + 34} textAnchor="middle" dominantBaseline="central"
            className="hex-activity">
        {timeSince(agent.lastActivity)}
      </text>

      {agent.totalTokens > 0 && (
        <g className="token-badge">
          <circle cx={badgeX} cy={badgeY} r="14" className="badge-circle" />
          <text x={badgeX} y={badgeY} textAnchor="middle" dominantBaseline="central"
                className="badge-text">
            {formatTokens(agent.totalTokens)}
          </text>
        </g>
      )}
    </g>
  );
}
