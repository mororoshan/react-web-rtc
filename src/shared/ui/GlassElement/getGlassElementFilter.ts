import { getDisplacementMap } from "./getDisplacementMap";
import { getSpecularMap } from "./getSpecularMap";

export type DisplacementOptions = {
    height: number;
    width: number;
    radius: number;
    depth: number;
    strength?: number;
    chromaticAberration?: number;
    /** 0 = off; 1 = full specular rim (default 0.4) */
    specularStrength?: number;
};

export const getDisplacementFilter = ({
    height,
    width,
    radius,
    depth,
    strength = 100,
    chromaticAberration = 0,
    specularStrength = 0.4,
}: DisplacementOptions) => {
    const displacementMapHref = getDisplacementMap({
        height,
        width,
        radius,
        depth,
    });
    const useSpecular = specularStrength > 0;
    const specularMapHref = useSpecular
        ? getSpecularMap(width, height, radius)
        : "";

    const specularPart = useSpecular
        ? `
            <feImage x="0" y="0" width="${width}" height="${height}" href="${specularMapHref}" result="specularImg" />
            <feGaussianBlur in="specularImg" stdDeviation="1" result="specularBlur" />
            <feColorMatrix in="specularBlur" type="saturate" values="${Math.max(0.0001, specularStrength)}" result="specularSat" />
            <feBlend in="displaced" in2="specularSat" mode="screen" result="withSpecular" />`
        : "";

    const svg = `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="displace" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" height="${height}" width="${width}" href="${displacementMapHref}" result="displacementMap" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration * 2}" xChannelSelector="R" yChannelSelector="G" result="dR" />
            <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedR" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration}" xChannelSelector="R" yChannelSelector="G" result="dG" />
            <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedG" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength}" xChannelSelector="R" yChannelSelector="G" result="dB" />
            <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="displacedB" />
            <feBlend in="displacedR" in2="displacedG" mode="screen" result="displacedRG" />
            <feBlend in="displacedRG" in2="displacedB" mode="screen" result="displaced" />${specularPart}
        </filter>
    </defs>
</svg>`;

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg) + "#displace";
};
