import { useState, useEffect, useCallback } from "react";
import type { ForgeWizardData } from "./ForgeView";

interface Archetype {
  id: string;
  name: string;
  label: string;
  description: string;
  traits: { communication: number; riskTolerance: number; decisionStyle: number };
  soulPrompt: string;
}

interface TraitDescriptor {
  label: string;
  low: { value: number; label: string; description: string };
  high: { value: number; label: string; description: string };
  soulDescriptors: Record<string, string>;
}

interface PersonalityStepProps {
  data: ForgeWizardData;
  onUpdate: (partial: Partial<ForgeWizardData>) => void;
}

export function PersonalityStep({ data, onUpdate }: PersonalityStepProps) {
  const [archetypes, setArchetypes] = useState<Record<string, Archetype[]>>({});
  const [traitDefs, setTraitDefs] = useState<Record<string, TraitDescriptor>>({});
  const [activeRole, setActiveRole] = useState(data.selectedRoles[0] || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/forge/archetypes").then((r) => r.json()),
      fetch("/api/forge/traits").then((r) => r.json()),
    ])
      .then(([arch, traits]: [Record<string, Archetype[]>, Record<string, TraitDescriptor>]) => {
        setArchetypes(arch);
        setTraitDefs(traits);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getConfig = useCallback(
    (roleId: string) => {
      return (
        data.agentConfigs[roleId] || {
          archetypeId: "",
          traits: { communication: 0.5, riskTolerance: 0.5, decisionStyle: 0.5 },
          name: "",
        }
      );
    },
    [data.agentConfigs]
  );

  const updateConfig = useCallback(
    (
      roleId: string,
      patch: Partial<{
        archetypeId: string;
        traits: { communication: number; riskTolerance: number; decisionStyle: number };
        name: string;
      }>
    ) => {
      const current = getConfig(roleId);
      const updated = { ...current, ...patch };
      onUpdate({
        agentConfigs: { ...data.agentConfigs, [roleId]: updated },
      });
    },
    [data.agentConfigs, getConfig, onUpdate]
  );

  const selectArchetype = useCallback(
    (roleId: string, arch: Archetype) => {
      updateConfig(roleId, {
        archetypeId: arch.id,
        traits: { ...arch.traits },
        name: arch.name,
      });
    },
    [updateConfig]
  );

  const getDescriptor = (traitKey: string, value: number): string => {
    const trait = traitDefs[traitKey];
    if (!trait) return "";
    for (const [range, desc] of Object.entries(trait.soulDescriptors)) {
      const [lo, hi] = range.split("-").map(Number);
      if (value >= lo && value <= hi) return desc;
    }
    return "";
  };

  if (loading) {
    return (
      <div className="forge-step personality-step">
        <h1 className="forge-step-title">Shape Their Character</h1>
        <div className="forge-loading-spinner">Loading archetypes...</div>
      </div>
    );
  }

  const config = getConfig(activeRole);
  const roleArchetypes = archetypes[activeRole] || [];

  const TRAIT_KEYS: Array<{
    key: "communication" | "riskTolerance" | "decisionStyle";
    lowLabel: string;
    highLabel: string;
  }> = [
    { key: "communication", lowLabel: "Terse", highLabel: "Verbose" },
    { key: "riskTolerance", lowLabel: "Conservative", highLabel: "Bold" },
    { key: "decisionStyle", lowLabel: "Intuitive", highLabel: "Data-Driven" },
  ];

  return (
    <div className="forge-step personality-step">
      <h1 className="forge-step-title">Shape Their Character</h1>
      <p className="forge-step-subtitle">
        Choose an archetype and fine-tune personality traits for each role.
      </p>

      {/* Role Sub-tabs */}
      <div className="personality-role-tabs">
        {data.selectedRoles.map((roleId) => {
          const configured = !!data.agentConfigs[roleId]?.archetypeId;
          return (
            <button
              key={roleId}
              className={`role-tab ${activeRole === roleId ? "active" : ""} ${
                configured ? "configured" : ""
              }`}
              onClick={() => setActiveRole(roleId)}
            >
              {roleId.toUpperCase()}
              {configured && <span className="role-tab-check">{"\u2713"}</span>}
            </button>
          );
        })}
      </div>

      {/* Archetype Chips */}
      <div className="archetype-section">
        <h3 className="section-heading">Leader Archetype</h3>
        <div className="archetype-chips">
          {roleArchetypes.map((arch) => (
            <button
              key={arch.id}
              className={`archetype-chip ${
                config.archetypeId === arch.id ? "selected" : ""
              }`}
              onClick={() => selectArchetype(activeRole, arch)}
              title={arch.description}
            >
              <span className="chip-name">{arch.name}</span>
              <span className="chip-label">{arch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trait Sliders */}
      <div className="traits-section">
        <h3 className="section-heading">Personality Traits</h3>
        {TRAIT_KEYS.map(({ key, lowLabel, highLabel }) => (
          <div key={key} className="trait-slider-row">
            <div className="trait-slider-header">
              <span className="trait-label-left">{lowLabel}</span>
              <span className="trait-name">
                {traitDefs[key]?.label || key}
              </span>
              <span className="trait-label-right">{highLabel}</span>
            </div>
            <input
              type="range"
              className="trait-slider"
              min={0}
              max={1}
              step={0.05}
              value={config.traits[key]}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                updateConfig(activeRole, {
                  traits: { ...config.traits, [key]: val },
                });
              }}
            />
            <p className="trait-descriptor">{getDescriptor(key, config.traits[key])}</p>
          </div>
        ))}
      </div>

      {/* Agent Name */}
      <div className="agent-name-section">
        <h3 className="section-heading">Agent Name</h3>
        <input
          type="text"
          className="agent-name-input"
          placeholder="Agent name..."
          value={config.name}
          onChange={(e) => updateConfig(activeRole, { name: e.target.value })}
        />
      </div>
    </div>
  );
}
