import type { Agent, CostSummary, AgentCost, Session, CronJob, Alert } from "./types";

const BASE = "/api";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getHealth: () => fetchJSON<{ gateway: string; uptime: number; version: string; agentCount: number }>("/health"),
  getAgents: () => fetchJSON<Agent[]>("/agents"),
  getAgentSessions: (id: string) => fetchJSON<{ sessions: Session[] }>(`/agents/${id}/sessions`),
  getCostSummary: () => fetchJSON<CostSummary>("/costs/summary"),
  getCostsByAgent: () => fetchJSON<AgentCost[]>("/costs/by-agent"),
  getCronJobs: () => fetchJSON<CronJob[]>("/cron/jobs"),
  getAlerts: () => fetchJSON<Alert[]>("/alerts"),
  getWorkspaceFiles: (agent: string) => fetchJSON<{ agent: string; path: string; files: any[] }>(`/workspace/${agent}/files`),
  getWorkspaceFile: (agent: string, path: string) => fetchJSON<{ content: string; path: string }>(`/workspace/${agent}/file?path=${encodeURIComponent(path)}`),

  // Drill Mode API methods
  getAgentMemory: (id: string) => fetchJSON<{ filename: string; date: string; preview: string }[]>(`/agents/${id}/memory`),
  getAgentMemoryFile: (id: string, filename: string) => fetchJSON<{ filename: string; content: string }>(`/agents/${id}/memory/${encodeURIComponent(filename)}`),
  getAgentCosts: (id: string) => fetchJSON<{ today: number; thisWeek: number; thisMonth: number; total: number; byModel: Record<string, number>; runs: any[] }>(`/agents/${id}/costs`),
  getAgentCron: (id: string) => fetchJSON<CronJob[]>(`/agents/${id}/cron`),
  getAgentWorkspace: (id: string) => fetchJSON<{ agent: string; tree: any }>(`/agents/${id}/workspace`),
};
