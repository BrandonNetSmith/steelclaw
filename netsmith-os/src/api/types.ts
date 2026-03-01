export interface Agent {
  id: string;
  agentId: string;
  name: string;
  role: string;
  emoji: string;
  enabled: boolean;
  model: string | null;
  workspace: string | null;
  status: "active" | "idle" | "busy" | "error";
  lastActivity: number | null;
  totalTokens: number;
  sessionCount: number;
}

export interface CostSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  burnRate: number;
  byAgent: Record<string, number>;
  byModel: Record<string, number>;
}

export interface AgentCost {
  agentId: string;
  totalCost: number;
  todayCost: number;
  monthCost: number;
  runCount: number;
  lastRun: number | null;
  byModel: Record<string, number>;
}

export interface Session {
  key: string;
  agentId: string;
  model: string;
  modelProvider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  contextTokens: number;
  updatedAt: number;
  kind: string;
}

export interface CronJob {
  id: string;
  agentId: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: string;
  delivery: any;
  state: any;
  lastRun: {
    ts: number;
    status: string;
    model: string;
    usage: { input_tokens: number; output_tokens: number; total_tokens: number };
    durationMs: number;
  } | null;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  ts: number;
  jobId?: string;
}

export type AppMode = "bridge" | "drill" | "forge";
