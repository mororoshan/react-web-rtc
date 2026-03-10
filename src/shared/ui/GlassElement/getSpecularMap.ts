/**
 * Generates a specular (rim) map as SVG data URI for Liquid Glass highlight.
 * Stroke/edge gradient defines where the specular highlight appears; used in feBlend over refracted result.
 */
export function getSpecularMap(width: number, height: number, radius: number): string {
    const strokeWidth = Math.max(1, Math.min(width, height) * 0.03);
    return (
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="white" stop-opacity="0.6" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
    </defs>
    <rect
        x="${strokeWidth / 2}"
        y="${strokeWidth / 2}"
        width="${width - strokeWidth}"
        height="${height - strokeWidth}"
        rx="${radius}"
        ry="${radius}"
        fill="none"
        stroke="url(#rim)"
        stroke-width="${strokeWidth}"
    />
</svg>`)
    );
}
