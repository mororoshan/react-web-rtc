import type { ReactNode } from "react";
import { GlassElement } from "../GlassElement";

interface GlassPanelProps {
    width: number;
    height: number;
    radius?: number;
    depth?: number;
    children?: ReactNode;
    className?: string;
    contentBg?: string;
}

/**
 * A rectangular glass panel using liquid-glass effect. Good for cards and overlays.
 */
export const GlassPanel = ({
    width,
    height,
    radius = 12,
    depth = 24,
    children,
    className = "",
    contentBg = "rgba(255,255,255,0.06)",
}: GlassPanelProps) => (
    <GlassElement
        width={width}
        height={height}
        radius={radius}
        depth={depth}
        strength={20}
        chromaticAberration={2}
        specularStrength={0.35}
        blur={0.5}
        contentBg={contentBg}
        className={className}
    >
        {children}
    </GlassElement>
);
