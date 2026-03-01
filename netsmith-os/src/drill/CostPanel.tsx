import { useState, useEffect } from "react";
import { api } from "../api/client";

interface CostData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  byModel: Record<string, number>;
}

interface CostPanelProps {
  agentId: string;
}

function fmtCost(n: number): string {
  if (n >= 1) return "$" + n.toFixed(2);
  if (n >= 0.01) return "$" + n.toFixed(3);
  if (n > 0) return "$" + n.toFixed(4);
  return "$0.00";
}

export function CostPanel({ agentId }: CostPanelProps) {
  const [costs, setCosts] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.getAgentCosts(agentId);
        if (!cancelled) {
          setCosts(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [agentId]);

  if (loading) {
    return (
      <div className="drill-panel">
        <div className="drill-panel-header">
          <span className="drill-panel-title">Costs</span>
        </div>
        <div className="drill-panel-body">
          <div className="panel-loading">Loading costs...</div>
        </div>
      </div>
    );
  }

  if (!costs) {
    return (
      <div className="drill-panel">
        <div className="drill-panel-header">
          <span className="drill-panel-title">Costs</span>
        </div>
        <div className="drill-panel-body">
          <div className="no-data-message">No cost data available</div>
        </div>
      </div>
    );
  }

  const modelEntries = Object.entries(costs.byModel || {}).sort(
    ([, a], [, b]) => b - a
  );
  const maxCost = modelEntries.length > 0
    ? Math.max(...modelEntries.map(([, v]) => v))
    : 1;

  return (
    <div className="drill-panel">
      <div className="drill-panel-header">
        <span className="drill-panel-title">Costs</span>
      </div>
      <div className="drill-panel-body">
        <div className="cost-summary-row">
          <div className="cost-summary-card">
            <div className="cost-summary-label">Today</div>
            <div className="cost-summary-value">{fmtCost(costs.today)}</div>
          </div>
          <div className="cost-summary-card">
            <div className="cost-summary-label">Week</div>
            <div className="cost-summary-value">{fmtCost(costs.thisWeek)}</div>
          </div>
          <div className="cost-summary-card">
            <div className="cost-summary-label">Month</div>
            <div className="cost-summary-value">{fmtCost(costs.thisMonth)}</div>
          </div>
        </div>

        {modelEntries.length > 0 && (
          <div className="cost-model-breakdown">
            <div className="cost-model-title">By Model</div>
            {modelEntries.map(([model, cost], i) => (
              <div key={model} className="cost-model-row">
                <span className="cost-model-name" title={model}>
                  {model}
                </span>
                <div className="cost-bar-container">
                  <div
                    className={`cost-bar-fill model-${i % 6}`}
                    style={{ width: `${(cost / maxCost) * 100}%` }}
                  />
                </div>
                <span className="cost-model-amount">{fmtCost(cost)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
