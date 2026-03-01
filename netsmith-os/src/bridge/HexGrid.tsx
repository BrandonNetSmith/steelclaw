import type { Agent } from "../api/types";
import { HexNode } from "./HexNode";

interface HexGridProps {
  agents: Agent[];
  onDrill: (agentId: string) => void;
}

/**
 * Honeycomb layout for up to 8 nodes.
 * Pattern (row, col offsets):
 *
 *        [0]          row 0, center
 *     [1]   [2]       row 1, left/right
 *        [3]          row 2, center
 *     [4]   [5]       row 3, left/right
 *        [6]          row 4, center
 *        [7]          row 5, center (CEO node)
 */
function getHexPositions(
  count: number,
  hexR: number,
  viewWidth: number,
  viewHeight: number
): Array<{ cx: number; cy: number }> {
  const centerX = viewWidth / 2;
  const spacingX = hexR * 1.85;
  const spacingY = hexR * 1.65;
  const startY = viewHeight * 0.12;

  const layout: Array<{ cx: number; cy: number }> = [
    // Row 0: single center
    { cx: centerX, cy: startY },
    // Row 1: two side-by-side
    { cx: centerX - spacingX, cy: startY + spacingY },
    { cx: centerX + spacingX, cy: startY + spacingY },
    // Row 2: single center
    { cx: centerX, cy: startY + spacingY * 2 },
    // Row 3: two side-by-side
    { cx: centerX - spacingX, cy: startY + spacingY * 3 },
    { cx: centerX + spacingX, cy: startY + spacingY * 3 },
    // Row 4: single center
    { cx: centerX, cy: startY + spacingY * 4 },
    // Row 5: CEO node at bottom
    { cx: centerX, cy: startY + spacingY * 5.2 },
  ];

  return layout.slice(0, count);
}

// Connection lines between hexes
function getConnections(count: number): Array<[number, number]> {
  const connections: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [6, 7],
  ];
  return connections.filter(([a, b]) => a < count && b < count);
}

export function HexGrid({ agents, onDrill }: HexGridProps) {
  const viewWidth = 700;
  const viewHeight = 750;
  const hexR = 58;

  const positions = getHexPositions(agents.length, hexR, viewWidth, viewHeight);
  const connections = getConnections(agents.length);

  return (
    <div className="hex-grid-container">
      <svg
        className="hex-grid-svg"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-active" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="#10b981" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-idle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#d4a574" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-error" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#ef4444" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map(([a, b]) => {
          const pa = positions[a];
          const pb = positions[b];
          if (!pa || !pb) return null;
          return (
            <line
              key={`conn-${a}-${b}`}
              x1={pa.cx}
              y1={pa.cy}
              x2={pb.cx}
              y2={pb.cy}
              className="hex-connection"
            />
          );
        })}

        {/* Hex nodes */}
        {agents.map((agent, i) => {
          const pos = positions[i];
          if (!pos) return null;
          return (
            <HexNode
              key={agent.id}
              agent={agent}
              cx={pos.cx}
              cy={pos.cy}
              r={hexR}
              onClick={() => onDrill(agent.id)}
            />
          );
        })}
      </svg>
    </div>
  );
}
