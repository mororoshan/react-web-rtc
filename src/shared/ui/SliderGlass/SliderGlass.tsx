import React, { useCallback, useRef, useState } from "react";

import { GlassElement } from "../GlassElement";
import type { DisplacementOptions } from "../GlassElement";

type SliderGlassProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    trackWidth?: number;
    trackHeight?: number;
    handleSize?: number;
} & Partial<DisplacementOptions>;

const SliderGlass = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    trackWidth = 200,
    trackHeight = 12,
    handleSize = 32,
}: SliderGlassProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const percentage = Math.min(1, Math.max(0, (value - min) / (max - min)));

    const updateValue = useCallback(
        (clientX: number) => {
            const track = trackRef.current;
            if (!track) return;

            const rect = track.getBoundingClientRect();
            const x = clientX - rect.left;
            const pct = Math.min(1, Math.max(0, x / rect.width));
            const stepped =
                Math.round((min + pct * (max - min)) / step) * step;
            onChange(Math.min(max, Math.max(min, stepped)));
        },
        [min, max, step, onChange]
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);
            updateValue(e.clientX);
        },
        [updateValue]
    );

    React.useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => updateValue(e.clientX);
        const onMouseUp = () => setIsDragging(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, updateValue]);

    const glassProps: DisplacementOptions = {
        height: handleSize,
        width: handleSize,
        radius: handleSize / 2,
        depth: 12,
        strength: 8,
        chromaticAberration: 1,
    };

    return (
        <div
            ref={trackRef}
            className="relative flex items-center cursor-pointer"
            style={{ width: trackWidth, height: Math.max(trackHeight, handleSize) }}
        >
            {/* Track - clickable */}
            <div
                className="absolute h-full rounded-full bg-slate-300/40 w-full"
                style={{
                    width: trackWidth,
                    height: trackHeight,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) updateValue(e.clientX);
                }}
            />
            {/* Glass handle */}
            <div
                className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-10"
                style={{
                    left: `calc(${percentage * 100}% - ${handleSize / 2}px)`,
                    top: `50%`,
                    transform: "translateY(-50%)",
                }}
                onMouseDown={handleMouseDown}
            >
                <GlassElement
                    {...glassProps}
                    className="flex items-center justify-center bg-slate-200/30 border-none shadow-md"
                />
            </div>
        </div>
    );
};

export default SliderGlass;
