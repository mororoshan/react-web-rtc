import React, { ReactNode } from "react";

import { GlassElement } from "../GlassElement";
import type { DisplacementOptions } from "../GlassElement";

type BlockGlassProps = DisplacementOptions & {
    children: ReactNode;
    className?: string;
    blur?: number;
};

const BlockGlass = ({
    children,
    className,
    width,
    height,
    radius = 16,
    depth = 20,
    strength = 10,
    chromaticAberration = 2,
    blur = 2,
}: BlockGlassProps) => {
    return (
        <GlassElement
            width={width}
            height={height}
            radius={radius}
            depth={depth}
            strength={strength}
            chromaticAberration={chromaticAberration}
            blur={blur}
            className={`flex flex-col bg-slate-200/30 p-4 ${
                className ? className : ""
            }`}
        >
            {children}
        </GlassElement>
    );
};

export default BlockGlass;
