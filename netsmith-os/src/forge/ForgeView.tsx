import { useState } from "react";
import { CompanyStep } from "./CompanyStep";
import { RolesStep } from "./RolesStep";
import { PersonalityStep } from "./PersonalityStep";
import { ChannelsStep } from "./ChannelsStep";
import { BudgetStep } from "./BudgetStep";
import { LaunchStep } from "./LaunchStep";
import "../styles/forge.css";

export interface ForgeWizardData {
  companyName: string;
  industry: string;
  selectedRoles: string[];
  agentConfigs: Record<
    string,
    {
      archetypeId: string;
      traits: {
        communication: number;
        riskTolerance: number;
        decisionStyle: number;
      };
      name: string;
    }
  >;
  channels: {
    discord: boolean;
    slack: boolean;
    signal: boolean;
    telegram: boolean;
  };
  budget: {
    monthly: number;
    dailyTokenLimit: number;
    modelTiers: Record<string, string>;
  };
}

interface ForgeViewProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEP_LABELS = [
  "Company",
  "Roles",
  "Personality",
  "Channels",
  "Budget",
  "Launch",
];

const DEFAULT_WIZARD_DATA: ForgeWizardData = {
  companyName: "",
  industry: "",
  selectedRoles: ["coo", "cto", "cmo"],
  agentConfigs: {},
  channels: { discord: false, slack: false, signal: false, telegram: false },
  budget: { monthly: 500, dailyTokenLimit: 100000, modelTiers: {} },
};

export function ForgeView({ onBack, onComplete }: ForgeViewProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ForgeWizardData>({ ...DEFAULT_WIZARD_DATA });

  const updateData = (partial: Partial<ForgeWizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.companyName.trim().length > 0 && data.industry.length > 0;
      case 2:
        return data.selectedRoles.length >= 3;
      case 3: {
        const configured = data.selectedRoles.every(
          (r) => data.agentConfigs[r]?.archetypeId
        );
        return configured;
      }
      case 4:
        return true;
      case 5:
        return data.budget.monthly > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CompanyStep data={data} onUpdate={updateData} />;
      case 2:
        return <RolesStep data={data} onUpdate={updateData} />;
      case 3:
        return <PersonalityStep data={data} onUpdate={updateData} />;
      case 4:
        return <ChannelsStep data={data} onUpdate={updateData} />;
      case 5:
        return <BudgetStep data={data} onUpdate={updateData} />;
      case 6:
        return <LaunchStep data={data} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="forge-view">
      {/* Progress Bar */}
      <div className="forge-progress">
        <button className="forge-back-link" onClick={onBack}>
          &larr; War Room
        </button>
        <div className="forge-progress-bar">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            let cls = "forge-step-dot";
            if (stepNum < step) cls += " completed";
            else if (stepNum === step) cls += " active";
            return (
              <div key={label} className="forge-step-item">
                <div className={cls}>
                  {stepNum < step ? "\u2713" : stepNum}
                </div>
                <span className="forge-step-label">{label}</span>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`forge-step-line ${
                      stepNum < step ? "completed" : ""
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="forge-content">{renderStep()}</div>

      {/* Navigation */}
      {step < 6 && (
        <div className="forge-nav">
          <button className="forge-nav-btn secondary" onClick={handlePrev}>
            {step === 1 ? "\u2190 Exit" : "\u2190 Back"}
          </button>
          <span className="forge-nav-step">
            Step {step} of 6
          </span>
          <button
            className="forge-nav-btn primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next \u2192
          </button>
        </div>
      )}
    </div>
  );
}
