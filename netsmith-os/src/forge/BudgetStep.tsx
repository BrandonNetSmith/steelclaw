import { useMemo } from "react";
import type { ForgeWizardData } from "./ForgeView";

interface BudgetStepProps {
  data: ForgeWizardData;
  onUpdate: (partial: Partial<ForgeWizardData>) => void;
}

/** Model tier labels and associated pricing (per 1M tokens) */
const MODEL_TIERS: Record<string, { label: string; model: string; inputCost: number; outputCost: number }> = {
  performance: { label: "Performance (Opus)", model: "claude-opus-4", inputCost: 15.0, outputCost: 75.0 },
  balanced: { label: "Balanced (Sonnet)", model: "claude-sonnet-4", inputCost: 3.0, outputCost: 15.0 },
  economy: { label: "Economy (Flash)", model: "gemini-2.5-flash", inputCost: 0.15, outputCost: 0.6 },
};

const TIER_OPTIONS = Object.keys(MODEL_TIERS);

/** Convert a slider 0..1 to a log-scale token count between 10K and 1M */
function sliderToTokens(value: number): number {
  const minLog = Math.log(10000);
  const maxLog = Math.log(1000000);
  return Math.round(Math.exp(minLog + value * (maxLog - minLog)));
}

/** Convert token count to slider 0..1 */
function tokensToSlider(tokens: number): number {
  const minLog = Math.log(10000);
  const maxLog = Math.log(1000000);
  return (Math.log(tokens) - minLog) / (maxLog - minLog);
}

function formatTokens(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return Math.round(n / 1000) + "K";
  return String(n);
}

export function BudgetStep({ data, onUpdate }: BudgetStepProps) {
  const updateBudget = (patch: Partial<ForgeWizardData["budget"]>) => {
    onUpdate({ budget: { ...data.budget, ...patch } });
  };

  const setModelTier = (roleId: string, tier: string) => {
    updateBudget({
      modelTiers: { ...data.budget.modelTiers, [roleId]: tier },
    });
  };

  /** Estimated monthly cost calculation */
  const estimate = useMemo(() => {
    const dailyTokens = data.budget.dailyTokenLimit;
    let totalMonthly = 0;

    for (const roleId of data.selectedRoles) {
      const tier = data.budget.modelTiers[roleId] || "balanced";
      const pricing = MODEL_TIERS[tier];
      if (!pricing) continue;

      // Assume ~40% input, ~60% output token split
      const dailyInput = dailyTokens * 0.4;
      const dailyOutput = dailyTokens * 0.6;
      const monthlyInput = dailyInput * 30;
      const monthlyOutput = dailyOutput * 30;

      const cost =
        (monthlyInput / 1_000_000) * pricing.inputCost +
        (monthlyOutput / 1_000_000) * pricing.outputCost;
      totalMonthly += cost;
    }

    return totalMonthly;
  }, [data.selectedRoles, data.budget.modelTiers, data.budget.dailyTokenLimit]);

  const tokenSliderValue = tokensToSlider(data.budget.dailyTokenLimit);

  return (
    <div className="forge-step budget-step">
      <h1 className="forge-step-title">Set Your Budget</h1>
      <p className="forge-step-subtitle">
        Control your AI spend with monthly limits and model selection per agent.
      </p>

      {/* Monthly Budget */}
      <div className="budget-field">
        <label className="field-label">Monthly Budget (USD)</label>
        <div className="budget-input-wrap">
          <span className="budget-dollar">$</span>
          <input
            type="number"
            className="budget-input"
            min={0}
            step={50}
            value={data.budget.monthly}
            onChange={(e) =>
              updateBudget({ monthly: Math.max(0, Number(e.target.value)) })
            }
          />
        </div>
      </div>

      {/* Daily Token Limit */}
      <div className="budget-field">
        <label className="field-label">
          Per-Agent Daily Token Limit:{" "}
          <strong>{formatTokens(data.budget.dailyTokenLimit)}</strong>
        </label>
        <input
          type="range"
          className="trait-slider budget-slider"
          min={0}
          max={1}
          step={0.01}
          value={tokenSliderValue}
          onChange={(e) => {
            const tokens = sliderToTokens(parseFloat(e.target.value));
            updateBudget({ dailyTokenLimit: tokens });
          }}
        />
        <div className="slider-range-labels">
          <span>10K</span>
          <span>1M</span>
        </div>
      </div>

      {/* Model Tiers per Role */}
      <div className="budget-field">
        <label className="field-label">Model Tier per Role</label>
        <div className="model-tier-list">
          {data.selectedRoles.map((roleId) => {
            const currentTier = data.budget.modelTiers[roleId] || "balanced";
            return (
              <div key={roleId} className="model-tier-row">
                <span className="model-tier-role">{roleId.toUpperCase()}</span>
                <select
                  className="model-tier-select"
                  value={currentTier}
                  onChange={(e) => setModelTier(roleId, e.target.value)}
                >
                  {TIER_OPTIONS.map((tier) => (
                    <option key={tier} value={tier}>
                      {MODEL_TIERS[tier].label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Cost Estimate */}
      <div className="budget-estimate">
        <div className="estimate-label">Estimated Monthly Cost</div>
        <div className="estimate-value">
          ${estimate.toFixed(2)}
        </div>
        {estimate > data.budget.monthly && data.budget.monthly > 0 && (
          <div className="estimate-warning">
            Estimated cost exceeds your monthly budget
          </div>
        )}
      </div>
    </div>
  );
}
