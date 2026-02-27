import { useCallback, useRef } from "react";

import { GlassElement } from "../GlassElement";

type GlassSliderProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    width?: number;
    handleSize?: number;
};

const GlassSlider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    width = 300,
    handleSize = 36,
}: GlassSliderProps) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const getValueFromX = useCallback(
        (clientX: number) => {
            if (!trackRef.current) return value;
            const rect = trackRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            return min + (x / rect.width) * (max - min);
        },
        [min, max, value],
    );

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        onChange(getValueFromX(e.clientX));

        const onMove = (e: MouseEvent) => onChange(getValueFromX(e.clientX));
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const percent = ((value - min) / (max - min)) * 100;
    const half = handleSize / 2;
    const handleLeft = (percent / 100) * (width - handleSize);

    return (
        <div
            style={{
                width,
                height: handleSize,
                position: "relative",
                userSelect: "none",
                cursor: "pointer",
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Track */}
            <div
                ref={trackRef}
                style={{
                    position: "absolute",
                    left: half,
                    right: half,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    boxShadow:
                        "inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)",
                }}
            >
                {/* Fill */}
                <div
                    style={{
                        width: `${percent}%`,
                        height: "100%",
                        borderRadius: "inherit",
                        background: "rgba(255,255,255,0.5)",
                        boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                        transition: "width 0.05s",
                    }}
                />
            </div>

            {/* Glass handle */}
            <div
                style={{
                    position: "absolute",
                    left: handleLeft,
                    top: 0,
                    pointerEvents: "none",
                    transition: "left 0.05s",
                }}
            >
                <GlassElement
                    width={handleSize}
                    height={handleSize}
                    radius={half}
                    depth={8}
                    strength={80}
                    chromaticAberration={2}
                    blur={2}
                    className="bg-white/20"
                />
            </div>
        </div>
    );
};

export default GlassSlider;
