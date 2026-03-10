import { CSSProperties, ReactNode, useMemo, useState } from "react";

import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./getElement.module.css";
import {
    type DisplacementOptions,
    getDisplacementFilter,
} from "./getGlassElementFilter";

/** Detect if the browser supports SVG filters in backdrop-filter (Chrome/Chromium). */
function supportsSvgBackdropFilter(): boolean {
    if (typeof document === "undefined" || !document.createElement) return false;
    const el = document.createElement("div");
    el.style.cssText = "backdrop-filter: url(#test);";
    document.body.appendChild(el);
    const style = getComputedStyle(el);
    const hasUrl = style.backdropFilter?.includes("url") ?? false;
    document.body.removeChild(el);
    return hasUrl;
}

const svgBackdropSupported = supportsSvgBackdropFilter();

type GlassElementProps = DisplacementOptions & {
    className?: string;
    children?: ReactNode | undefined;
    blur?: number;
    debug?: boolean;
    /** Content layer background over the refracted backdrop. Default: transparent for true glass; set e.g. rgba(255,255,255,0.1) for readability. */
    contentBg?: string;
};

export const GlassElement = ({
    className,
    height,
    width,
    depth: baseDepth,
    radius,
    children,
    strength,
    chromaticAberration,
    specularStrength,
    blur = 2,
    debug = false,
    contentBg = "transparent",
}: GlassElementProps) => {
    const [clicked, setClicked] = useState(false);
    const depth = baseDepth / (clicked ? 0.7 : 1);

    const filterUrl = useMemo(
        () =>
            getDisplacementFilter({
                height,
                width,
                radius,
                depth,
                strength,
                chromaticAberration,
                specularStrength,
            }),
        [
            height,
            width,
            radius,
            depth,
            strength,
            chromaticAberration,
            specularStrength,
        ],
    );

    const debugMapUrl = useMemo(
        () =>
            debug
                ? getDisplacementMap({ height, width, radius, depth })
                : null,
        [debug, height, width, radius, depth],
    );

    const fallbackBackdrop =
        `blur(${blur}px) brightness(1.1) saturate(1.5)` as const;
    const fullBackdrop = svgBackdropSupported
        ? `blur(${blur / 2}px) url('${filterUrl}') blur(${blur}px) brightness(1.1) saturate(1.5)`
        : fallbackBackdrop;

    const containerStyle: CSSProperties = {
        position: "relative",
        height: `${height}px`,
        width: `${width}px`,
        borderRadius: `${radius}px`,
    };

    const filterLayerStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        borderRadius: `${radius}px`,
        backdropFilter: fullBackdrop,
        pointerEvents: "none",
    };

    if (debug && debugMapUrl) {
        filterLayerStyle.background = `url("${debugMapUrl}")`;
        filterLayerStyle.boxShadow = "none";
    }

    const contentLayerStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        borderRadius: `${radius}px`,
        ...(contentBg !== "transparent" && { background: contentBg }),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div
            className={styles.box + " " + (className ?? "")}
            style={containerStyle}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
        >
            <div style={filterLayerStyle} aria-hidden />
            <div style={contentLayerStyle}>{children}</div>
        </div>
    );
};
