import type { ForgeWizardData } from "./ForgeView";

interface ChannelsStepProps {
  data: ForgeWizardData;
  onUpdate: (partial: Partial<ForgeWizardData>) => void;
}

const CHANNEL_INFO: Array<{
  key: keyof ForgeWizardData["channels"];
  name: string;
  icon: string;
}> = [
  { key: "discord", name: "Discord", icon: "\uD83C\uDFAE" },
  { key: "slack", name: "Slack", icon: "\uD83D\uDCAC" },
  { key: "signal", name: "Signal", icon: "\uD83D\uDD12" },
  { key: "telegram", name: "Telegram", icon: "\u2708\uFE0F" },
];

export function ChannelsStep({ data, onUpdate }: ChannelsStepProps) {
  const toggleChannel = (key: keyof ForgeWizardData["channels"]) => {
    onUpdate({
      channels: { ...data.channels, [key]: !data.channels[key] },
    });
  };

  return (
    <div className="forge-step channels-step">
      <h1 className="forge-step-title">Connect Your Channels</h1>
      <p className="forge-step-subtitle">
        Enable communication channels for your AI executive team.
      </p>

      <div className="channels-grid">
        {CHANNEL_INFO.map(({ key, name, icon }) => {
          const enabled = data.channels[key];
          return (
            <div key={key} className={`channel-card ${enabled ? "enabled" : ""}`}>
              <div className="channel-card-header">
                <span className="channel-icon">{icon}</span>
                <span className="channel-name">{name}</span>
                <button
                  className={`channel-toggle ${enabled ? "on" : "off"}`}
                  onClick={() => toggleChannel(key)}
                  aria-label={`Toggle ${name}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              {enabled && (
                <div className="channel-card-body">
                  <p className="channel-placeholder">
                    Configuration coming soon
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="channels-skip"
        onClick={() =>
          onUpdate({
            channels: { discord: false, slack: false, signal: false, telegram: false },
          })
        }
      >
        Skip for now
      </button>
    </div>
  );
}
