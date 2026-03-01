import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { CronJob } from "../api/types";

interface CronPanelProps {
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

export function CronPanel({ agentId }: CronPanelProps) {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.getAgentCron(agentId);
        if (!cancelled) {
          setJobs(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [agentId]);

  return (
    <div className="drill-panel">
      <div className="drill-panel-header">
        <span className="drill-panel-title">Cron Jobs</span>
        <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
          {jobs.length} job{jobs.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="drill-panel-body">
        {loading ? (
          <div className="panel-loading">Loading cron jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-data-message">No cron jobs configured</div>
        ) : (
          <div className="cron-list">
            {jobs.map((job) => (
              <div key={job.id} className="cron-job">
                <div className="cron-job-header">
                  <span className="cron-job-name">{job.name}</span>
                  <div className="cron-job-badges">
                    <span
                      className={`cron-badge ${job.enabled ? "enabled" : "disabled"}`}
                    >
                      {job.enabled ? "Enabled" : "Disabled"}
                    </span>
                    {job.lastRun && (
                      <span
                        className={`cron-badge ${
                          job.lastRun.status === "ok"
                            ? "status-ok"
                            : "status-error"
                        }`}
                      >
                        {job.lastRun.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cron-job-meta">
                  <span className="cron-schedule">{job.schedule}</span>
                  {job.lastRun && (
                    <span className="cron-last-run">
                      Last: {formatTime(job.lastRun.ts)}
                    </span>
                  )}
                  <button
                    className="cron-run-btn"
                    onClick={() => {
                      /* placeholder — non-functional */
                    }}
                  >
                    Run Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
