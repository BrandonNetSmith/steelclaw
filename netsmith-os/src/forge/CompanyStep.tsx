import type { ForgeWizardData } from "./ForgeView";

interface CompanyStepProps {
  data: ForgeWizardData;
  onUpdate: (partial: Partial<ForgeWizardData>) => void;
}

const INDUSTRIES = [
  "Technology",
  "E-commerce",
  "SaaS",
  "Finance",
  "Healthcare",
  "Media",
  "Education",
  "Other",
];

export function CompanyStep({ data, onUpdate }: CompanyStepProps) {
  return (
    <div className="forge-step company-step">
      <h1 className="forge-step-title">Name Your Operation</h1>
      <p className="forge-step-subtitle">
        Every empire begins with a name.
      </p>

      <div className="company-fields">
        <div className="company-name-field">
          <input
            type="text"
            className="company-name-input"
            placeholder="Enter company name..."
            value={data.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            autoFocus
          />
          <div className="company-name-underline" />
        </div>

        <div className="company-industry-field">
          <label className="field-label">Industry</label>
          <select
            className="industry-select"
            value={data.industry}
            onChange={(e) => onUpdate({ industry: e.target.value })}
          >
            <option value="">Select your industry...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind.toLowerCase()}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
