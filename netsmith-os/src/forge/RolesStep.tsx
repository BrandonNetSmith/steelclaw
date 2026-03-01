import { useState, useEffect } from "react";
import type { ForgeWizardData } from "./ForgeView";

interface Role {
  id: string;
  title: string;
  shortTitle: string;
  emoji: string;
  description: string;
}

interface RolesStepProps {
  data: ForgeWizardData;
  onUpdate: (partial: Partial<ForgeWizardData>) => void;
}

export function RolesStep({ data, onUpdate }: RolesStepProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/forge/roles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch roles");
        return res.json();
      })
      .then((data: Role[]) => {
        setRoles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleRole = (roleId: string) => {
    const current = data.selectedRoles;
    if (current.includes(roleId)) {
      onUpdate({ selectedRoles: current.filter((r) => r !== roleId) });
    } else {
      onUpdate({ selectedRoles: [...current, roleId] });
    }
  };

  if (loading) {
    return (
      <div className="forge-step roles-step">
        <h1 className="forge-step-title">Assemble Your Command</h1>
        <div className="forge-loading-spinner">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forge-step roles-step">
        <h1 className="forge-step-title">Assemble Your Command</h1>
        <div className="forge-error-msg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="forge-step roles-step">
      <h1 className="forge-step-title">Assemble Your Command</h1>
      <p className="forge-step-subtitle">
        Select the roles for your AI executive team. Minimum 3 required.
      </p>

      <div className="roles-counter">
        <span className={data.selectedRoles.length >= 3 ? "counter-ok" : "counter-warn"}>
          {data.selectedRoles.length} selected
        </span>
        {data.selectedRoles.length < 3 && (
          <span className="counter-hint">&nbsp;(minimum 3)</span>
        )}
      </div>

      <div className="roles-carousel">
        {roles.map((role) => {
          const selected = data.selectedRoles.includes(role.id);
          return (
            <button
              key={role.id}
              className={`role-card ${selected ? "selected" : ""}`}
              onClick={() => toggleRole(role.id)}
            >
              <div className="role-card-emoji">{role.emoji}</div>
              <div className="role-card-title">{role.shortTitle}</div>
              <div className="role-card-name">{role.title}</div>
              <div className="role-card-desc">{role.description}</div>
              <div className="role-card-toggle">
                {selected ? "ACTIVE" : "INACTIVE"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
