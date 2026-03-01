import { useState } from "react";
import { BridgeView } from "../bridge/BridgeView";
import { DrillView } from "../drill/DrillView";
import { ForgeView } from "../forge/ForgeView";
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
      return <DrillView agentId={drillAgent!} onBack={handleBack} />;
    case "forge":
      return (
        <ForgeView
          onBack={() => setMode("bridge")}
          onComplete={() => setMode("bridge")}
        />
      );
  }
}
