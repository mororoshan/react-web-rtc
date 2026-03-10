# GlassElement (Liquid Glass)

Liquid Glass–style component using SVG displacement and optional specular rim.

## Browser support

- **Full effect (refraction + specular):** Chrome/Chromium only. These browsers support `backdrop-filter: url(#svgFilter)`.
- **Fallback:** In other browsers (Safari, Firefox), only `blur()` + `brightness()` + `saturate()` are applied so the panel still looks like frosted glass.

## Usage

Use `GlassElement` for a generic glass panel, or `ButtonGlass` for a button with the same effect. Pass `specularStrength` (0–1) to control the rim highlight; default is `0.4`.

## References

- [Liquid Glass in the Browser (kube.io)](https://kube.io/blog/liquid-glass-css-svg/)
- [Liquid Glass effects with CSS and SVG (LogRocket)](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/)
