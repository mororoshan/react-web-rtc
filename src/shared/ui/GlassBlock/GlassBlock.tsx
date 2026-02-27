import { ReactNode } from "react";

import { GlassElement } from "../GlassElement";
import type { DisplacementOptions } from "../GlassElement";

type GlassBlockProps = Omit<DisplacementOptions, "depth"> & {
    children?: ReactNode;
    depth?: number;
    className?: string;
    blur?: number;
};

const GlassBlock = ({
    children,
    width,
    height,
    radius = 16,
    depth = 20,
    strength = 80,
    chromaticAberration = 2,
    blur = 4,
    className,
}: GlassBlockProps) => {
    return (
        <GlassElement
            width={width}
            height={height}
            radius={radius}
            depth={depth}
            strength={strength}
            chromaticAberration={chromaticAberration}
            blur={blur}
            className={`bg-white/10 ${className ?? ""}`}
        >
            {children}
        </GlassElement>
    );
};

export default GlassBlock;
