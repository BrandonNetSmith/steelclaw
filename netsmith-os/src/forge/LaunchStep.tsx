import { useState, useCallback } from "react";
import type { ForgeWizardData } from "./ForgeView";

interface LaunchStepProps {
  data: ForgeWizardData;
  onComplete: () => void;
}

interface SoulPreview {
  roleId: string;
  agentName: string;
  preview: string;
  role: string;
  archetype: string;
}

const TIER_LABELS: Record<string, string> = {
  performance: "Opus",
  balanced: "Sonnet",
  economy: "Flash",
};

export function LaunchStep({ data, onComplete }: LaunchStepProps) {
  const [previews, setPreviews] = useState<SoulPreview[]>([]);
  const [launching, setLaunching] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = useCallback(async () => {
    setLaunching(true);
    setError(null);

    try {
      const results: SoulPreview[] = [];

      for (const roleId of data.selectedRoles) {
        const config = data.agentConfigs[roleId];
        if (!config) continue;

        const res = await fetch("/api/forge/preview-soul", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentName: config.name,
            roleId,
            archetypeId: config.archetypeId,
            traits: config.traits,
            companyName: data.companyName,
          }),
        });

        if (!res.ok) throw new Error(`Failed for ${roleId}`);
        const result = await res.json();
        results.push({
          roleId,
          agentName: config.name,
          preview: result.preview,
          role: result.role,
          archetype: result.archetype,
        });
      }

      setPreviews(results);
      setActivated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Launch failed");
    } finally {
      setLaunching(false);
    }
  }, [data]);

  if (activated) {
    return (
      <div className="forge-step launch-step">
        <div className="launch-success">
          <div className="launch-check-anim">
            <svg viewBox="0 0 52 52" className="launch-check-svg">
              <circle className="launch-check-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="launch-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h1 className="forge-step-title launch-active-title">Operation Active</h1>
          <p className="forge-step-subtitle">
            {data.companyName} is now online with {data.selectedRoles.length} AI executives.
          </p>

          {/* SOUL.md Previews */}
          {previews.length > 0 && (
            <div className="soul-previews">
              <h3 className="section-heading">Generated SOUL.md Previews</h3>
              {previews.map((p) => (
                <details key={p.roleId} className="soul-preview-card">
                  <summary>
                    {p.agentName} — {p.role}
                  </summary>
                  <pre className="soul-preview-content">{p.preview}</pre>
                </details>
              ))}
            </div>
          )}

          <button className="forge-nav-btn primary launch-continue" onClick={onComplete}>
            Enter the War Room &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forge-step launch-step">
      <h1 className="forge-step-title">Launch</h1>
      <p className="forge-step-subtitle">
        Review your AI executive team and activate the operation.
      </p>

      <div className="launch-company-name">{data.companyName}</div>

      {/* Mini Hex Grid */}
      <div className="launch-hex-grid">
        {data.selectedRoles.map((roleId, i) => {
          const config = data.agentConfigs[roleId];
          const tier = data.budget.modelTiers[roleId] || "balanced";
          const angle = (i / data.selectedRoles.length) * 2 * Math.PI - Math.PI / 2;
          const radius = data.selectedRoles.length <= 3 ? 90 : 110;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={roleId}
              className="launch-hex-node"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <div className="hex-node-role">{roleId.toUpperCase()}</div>
              <div className="hex-node-name">{config?.name || roleId}</div>
              <div className="hex-node-meta">
                {config?.archetypeId ? config.archetypeId.split("-").slice(0, 2).join(" ") : "—"}
              </div>
              <div className="hex-node-tier">{TIER_LABELS[tier] || tier}</div>
            </div>
          );
        })}
      </div>

      {error && <div className="forge-error-msg">{error}</div>}

      <button
        className="activate-btn"
        onClick={handleActivate}
        disabled={launching}
      >
        {launching ? "ACTIVATING..." : "ACTIVATE OPERATION"}
      </button>
    </div>
  );
}
