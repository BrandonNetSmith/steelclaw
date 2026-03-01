import { useState } from "react";
import { BridgeView } from "../bridge/BridgeView";
import type { AppMode } from "../api/types";

export function ModeRouter() {
  const [mode, setMode] = useState<AppMode>("bridge");
  const [drillAgent, setDrillAgent] = useState<string | null>(null);

  const handleDrill = (agentId: string) => {
    setDrillAgent(agentId);
    setMode("drill");
  };

  const handleBack = () => {
    setMode("bridge");
    setDrillAgent(null);
  };

  switch (mode) {
    case "bridge":
      return (
        <BridgeView
          onDrill={handleDrill}
          onForge={() => setMode("forge")}
        />
      );
    case "drill":
      return (
        <div className="drill-placeholder">
          <button className="back-btn" onClick={handleBack}>
            &larr; Back to Bridge
          </button>
          <h2>Drill Mode: {drillAgent}</h2>
          <p>Coming in Phase 3</p>
        </div>
      );
    case "forge":
      return (
        <div className="forge-placeholder">
          <button className="back-btn" onClick={() => setMode("bridge")}>
            &larr; Back to Bridge
          </button>
          <h2>The Forge</h2>
          <p>Coming in Phase 4</p>
        </div>
      );
  }
}
