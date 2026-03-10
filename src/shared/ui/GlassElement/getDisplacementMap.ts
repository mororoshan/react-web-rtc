import type { DisplacementOptions } from "./getGlassElementFilter";

/**
 * Builds a displacement map as SVG data URI.
 * feDisplacementMap uses R/G channels; 128 = neutral (no displacement), 0–127 and 129–255 shift pixels.
 * Center (flat glass) is #808080; edge gradients encode displacement magnitude.
 */
export const getDisplacementMap = ({
    height,
    width,
    radius,
    depth,
}: Omit<DisplacementOptions, "chromaticAberration" | "strength">) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
        .mix { mix-blend-mode: screen; }
    </style>
    <defs>
        <linearGradient id="X" x1="0%" x2="100%" y1="0" y2="0">
            <stop offset="0%" stop-color="#000" />
            <stop offset="50%" stop-color="#800000" />
            <stop offset="100%" stop-color="#F00" />
        </linearGradient>
        <linearGradient id="Y" x1="0" x2="0" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#000" />
            <stop offset="50%" stop-color="#008000" />
            <stop offset="100%" stop-color="#0F0" />
        </linearGradient>
    </defs>
    <rect x="0" y="0" height="${height}" width="${width}" fill="#808080" />
    <g filter="blur(2px)">
      <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
      <rect x="0" y="0" height="${height}" width="${width}" fill="url(#Y)" class="mix" />
      <rect x="0" y="0" height="${height}" width="${width}" fill="url(#X)" class="mix" />
      <rect
          x="${depth}"
          y="${depth}"
          height="${height - 2 * depth}"
          width="${width - 2 * depth}"
          fill="#808080"
          rx="${radius}"
          ry="${radius}"
          filter="blur(${depth}px)"
      />
    </g>
</svg>`);
