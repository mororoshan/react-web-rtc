import type { CSSProperties, ReactNode } from "react";
import { GlassElement } from "../GlassElement";

type MagnifyingGlassProps = {
    /** Lens diameter in pixels. */
    size?: number;
    /** Depth of the lens curve (affects refraction). */
    depth?: number;
    /** Strength of displacement. */
    strength?: number;
    /** Chromatic aberration amount. */
    chromaticAberration?: number;
    /** Optional content inside the lens (e.g. icon). */
    children?: ReactNode;
    /** Optional className for the wrapper. */
    className?: string;
    /** Inline style for the wrapper (e.g. position for overlay). */
    style?: CSSProperties;
};

/**
 * A magnifying glass built with the liquid-glass GlassElement.
 * Renders a circular lens (refracting content behind it) and a handle.
 */
export const MagnifyingGlass = ({
    size = 140,
    depth = 10,
    strength = 20,
    chromaticAberration = 4,
    children,
    className,
    style,
}: MagnifyingGlassProps) => {
    const radius = Math.floor(size / 2);
    const handleWidth = 8;
    const handleHeight = 48;

    return (
        <div
            className={className}
            style={{
                position: "relative",
                width: size,
                height: size + handleHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                ...style,
            }}
        >
            <GlassElement
                width={size}
                height={size}
                radius={radius}
                depth={depth}
                strength={strength}
                chromaticAberration={chromaticAberration}
                specularStrength={0.1}
                blur={0.1}
                contentBg="transparent"
            >
                {children}
            </GlassElement>
            {/* Handle */}
            <div
                style={{
                    width: handleWidth,
                    height: handleHeight,
                    background: "linear-gradient(180deg, #4a5568 0%, #2d3748 100%)",
                    borderRadius: 4,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
                    marginTop: -2,
                }}
                aria-hidden
            />
        </div>
    );
};
