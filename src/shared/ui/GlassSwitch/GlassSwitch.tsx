import { GlassElement } from "../GlassElement";

type GlassSwitchProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: number;
};

const GlassSwitch = ({ checked, onChange, size = 32 }: GlassSwitchProps) => {
    const trackWidth = size * 2;
    const knobSize = size - 6;
    const knobRadius = knobSize / 2;
    const knobPadding = 3;
    const knobLeft = checked
        ? trackWidth - knobSize - knobPadding
        : knobPadding;

    return (
        <div
            style={{
                width: trackWidth,
                height: size,
                borderRadius: size / 2,
                background: checked
                    ? "rgba(100,210,130,0.25)"
                    : "rgba(255,255,255,0.12)",
                boxShadow:
                    "inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s",
                userSelect: "none",
                flexShrink: 0,
            }}
            onClick={() => onChange(!checked)}
        >
            {/* Glass knob */}
            <div
                style={{
                    position: "absolute",
                    top: (size - knobSize) / 2,
                    left: knobLeft,
                    transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    pointerEvents: "none",
                }}
            >
                <GlassElement
                    width={knobSize}
                    height={knobSize}
                    radius={knobRadius}
                    depth={6}
                    strength={70}
                    chromaticAberration={1.5}
                    blur={2}
                    className="bg-white/25"
                />
            </div>
        </div>
    );
};

export default GlassSwitch;
