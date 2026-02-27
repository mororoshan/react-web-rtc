import React from "react";

import { GlassElement } from "../GlassElement";
import type { DisplacementOptions } from "../GlassElement";

type SwitchGlassProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    width?: number;
    height?: number;
    handleSize?: number;
} & Partial<DisplacementOptions>;

const SwitchGlass = ({
    checked,
    onChange,
    width = 52,
    height = 28,
    handleSize = 22,
}: SwitchGlassProps) => {
    const trackPadding = (height - handleSize) / 2;
    const travel = width - handleSize - 2 * trackPadding;

    const glassProps: DisplacementOptions = {
        height: handleSize,
        width: handleSize,
        radius: handleSize / 2,
        depth: 10,
        strength: 8,
        chromaticAberration: 1,
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            className="relative rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            style={{
                width,
                height,
                backgroundColor: "rgba(148, 163, 184, 0.3)",
            }}
            onClick={() => onChange(!checked)}
        >
            {/* Glass handle */}
            <div
                className="absolute top-1/2 -translate-y-1/2 transition-transform duration-200 ease-out z-10"
                style={{
                    left: trackPadding,
                    transform: `translateY(-50%) translateX(${checked ? travel : 0}px)`,
                }}
            >
                <GlassElement
                    {...glassProps}
                    className="flex items-center justify-center bg-slate-200/30 border-none shadow-md cursor-pointer"
                />
            </div>
        </button>
    );
};

export default SwitchGlass;
