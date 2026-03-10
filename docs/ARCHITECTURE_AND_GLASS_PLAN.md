# Architecture Optimization & Liquid Glass Implementation Plan

This document outlines a plan to (1) optimize the app architecture and (2) make glass components work properly using patterns from [Liquid Glass with CSS and SVG (kube.io)](https://kube.io/blog/liquid-glass-css-svg/) and [Liquid Glass effects (LogRocket)](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/).

---

## Part 1: Architecture Optimization

### 1.1 Single source of truth for routes

**Problem:** Route paths and labels are duplicated in `routes.enum.ts` and `navRoutes.ts`.

**Change:**

- Introduce a single config array (e.g. `src/routes/config/navRoutes.ts`) that exports `{ path, name, component }` or `{ path, name }` and an enum/constants derived from it so path strings exist in one place.
- Use this config in both `routes.tsx` (for `<Route>`) and the navbar (for links and labels).
- Keep the enum for type-safe path references if desired, but derive it from the config or keep in sync via a single export.

**Files:** `src/routes/models/enums/routes.enum.ts`, `src/routes/routes.tsx`, `src/widgets/navbar/models/consts/navRoutes.ts`, new `src/routes/config/` (or similar).

---

### 1.2 WebRTC store provider

**Problem:** `WebRTCStoreContext` has no provider; all consumers use the default context value (singleton). This blocks testing with a scoped store and makes dependency injection impossible.

**Change:**

- Add `WebRTCStoreProvider` in `src/components/Connect/stores/webrtc.store.ts` (or a dedicated `providers` module) that wraps children with `WebRTCStoreContext.Provider` and passes the store (default or injected).
- Wrap the app (or the subtree that needs WebRTC) in `App.tsx` or `router.tsx` with this provider.
- Optionally use the shared `createContext` helper from `shared/lib/hooks/context.ts` for a “required context” pattern so missing provider fails fast.

**Files:** `src/components/Connect/stores/webrtc.store.ts`, `src/app/providers/router.tsx` or `src/App.tsx`.

---

### 1.3 Shared ConnectionState type

**Problem:** `ConnectionState` is defined in both `ServerlessWebRTC.ts` and `ConnectionWidget/models/types/ConnectionState.tsx`, risking drift.

**Change:**

- Define `ConnectionState` once (e.g. in `utils/hooks/ServerlessWebRTC.ts` or a shared `contexts/` type file) and export it.
- Remove the duplicate and import the single definition everywhere it’s used.

**Files:** `src/utils/hooks/ServerlessWebRTC.ts`, `src/components/Connect/ConnectionWidget/models/types/ConnectionState.tsx`, and any imports of `ConnectionState`.

---

### 1.4 Copy-to-clipboard abstraction

**Problem:** Copy logic (including secure context and `document.execCommand` fallback) is duplicated in `copy-button.tsx` and `CopyLocalDescription.tsx`.

**Change:**

- Extract a small helper (e.g. `copyToClipboard(text: string): Promise<boolean>`) in `shared/lib/` or `shared/utils/`.
- Use it in both `CopyButton` and `CopyLocalDescription`; keep UI and labels in each component.

**Files:** New `src/shared/lib/copyToClipboard.ts` (or similar), `src/shared/ui/copy-button/copy-button.tsx`, `src/components/Connect/ConnectionWidget/components/CopyLocalDescription.tsx`.

---

### 1.5 Naming and small fixes

- **Massage → Message:** Rename `setSendMassage`, `sendMassageToAll`, and any “Massage” in message-related types to “Message” for clarity and searchability.
- **Button `className` bug:** In `Button.tsx`, fix the template so the prop `className` is applied correctly (avoid literal string `"className"` in the class list). Use e.g. `className={\`... ${className ?? ""}\`}`.
- **Orphan `.glass-panel`:** Either remove `.glass-panel` from `index.css` or add an inline SVG filter with `id="liquidGlassFilterId"` and use the class where needed. Recommendation: remove the orphan class until a shared panel component uses it with a real filter (see Part 2).

**Files:** `webrtc.store.ts`, message types, `Button.tsx`, `index.css`.

---

### 1.6 Optional / follow-up

- **Error boundary:** Add a React error boundary around the main content (e.g. in `MainLayout` or router) to avoid full-app white screen on runtime errors.
- **i18n initialization:** Ensure i18n is initialized before first use (e.g. import `shared/config/i18n/i18n.config.ts` in `index.tsx` or `App.tsx`) so all routes have translations ready.
- **Feature structure:** If the codebase grows, consider grouping by feature (e.g. `features/connect/`, `features/chat/`, `features/glass/`) and keeping `shared/` for truly global UI and libs.

---

## Part 2: Liquid Glass components that work properly

Goals: (1) Refraction that matches the intended “liquid glass” look, (2) optional specular rim, (3) stable performance, (4) clear fallback for unsupported browsers.

References:

- [kube.io – Liquid Glass](https://kube.io/blog/liquid-glass-css-svg/): refraction math, surface functions, displacement vector field, SVG `feDisplacementMap`, specular highlight, `backdrop-filter: url(#filter)`.
- [LogRocket – Liquid Glass](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/): React + Tailwind, filter layer vs content layer, displacement + specular pipeline, fallback, accessibility.

### 2.1 Use backdrop correctly and memoize filter URL

**Current:** `GlassElement` builds a new SVG data URI and sets `backdropFilter` to `url('...')` on every render. The filter uses `in="SourceGraphic"`; when used with `backdrop-filter`, the “source” is the backdrop, which is correct.

**Changes:**

- **Memoize the filter URL:** Compute `getDisplacementFilter({ ... })` (and optionally `getDisplacementMap(...)` for debug) inside `useMemo` depending on `height`, `width`, `radius`, `depth`, `strength`, `chromaticAberration`. Avoid rebuilding the data URI on every render and on every mouse move (e.g. from `clicked` state) if only `depth` changes slightly; consider debouncing or stabilizing `depth` for the memo key.
- **Stable keys:** Ensure the memo dependency array includes all values that affect the SVG output so the filter updates when size or options change, but not on unrelated re-renders.

**Files:** `src/shared/ui/GlassElement/GlassElement.tsx`.

---

### 2.2 Displacement map: neutral 128 and scale

**Reference (kube.io):** Displacement in SVG is encoded so that R/G = 128 means no displacement; values 0–255 map to a normalized range that is then multiplied by `scale`.

**Current:** `getDisplacementMap.ts` uses gradients and a central rect; the map is used in `feDisplacementMap` with `scale="${strength + ...}"`. Ensure:

- Areas where no displacement is desired (e.g. flat center) use RGB values near **128** for the channels used by `xChannelSelector` / `yChannelSelector` (e.g. R and G).
- The current gradient from `#F00`/`#0F0` to `#000` and the gray rect produce values that may not center at 128. Adjust so that “no displacement” = 128 (e.g. `#808080` for both channels in flat regions), and edge displacement is encoded as offsets from 128.

**Files:** `src/shared/ui/GlassElement/getDisplacementMap.ts`, and optionally `getGlassElementFilter.ts` (scale and channel usage).

---

### 2.3 Optional: physics-based surface profile (kube.io)

**Reference:** The article uses surface functions (convex circle, convex squircle, concave, lip) to compute displacement magnitude from “distance from border,” then builds a displacement vector field (direction orthogonal to border, magnitude from the profile).

**Current:** The map is gradient + rect based, not derived from a surface profile.

**Enhancement (optional):**

- Introduce a small module that, for a given shape (e.g. rounded rect), computes displacement magnitude per distance-from-edge (e.g. 127 samples for SVG resolution), then normalizes and encodes as R/G in the map. This aligns with the article’s “pre-calculated displacement magnitude” and “normalized vectors.”
- Surface type could be a prop (e.g. `convex | squircle | lip`) for different glass “feels.” Start with one profile (e.g. convex squircle) and expand later.

**Files:** New helper (e.g. `getDisplacementMapFromProfile.ts` or extend `getDisplacementMap.ts`), `getGlassElementFilter.ts`, `GlassElement` props.

---

### 2.4 Specular highlight (rim light)

**Reference (both articles):** A specular/rim highlight on the edges improves the “liquid glass” look. kube.io and LogRocket use an extra image (e.g. rim stroke or gradient) and blend it over the refracted result.

**Change:**

- Add an optional **specular map**: a small asset or procedural SVG (e.g. rounded rect stroke or edge gradient) that defines where the highlight appears.
- In the SVG filter pipeline:
  1. Produce the refracted backdrop (current displacement step).
  2. Add `feImage` for the specular map (or generate it as data URI).
  3. Optionally blur it with `feGaussianBlur` for a soft rim.
  4. Use `feColorMatrix` (e.g. saturate) if desired.
  5. Composite/blend the specular layer on top of the refracted result (`feBlend` or `feComposite`).
- Expose a prop (e.g. `specularStrength` or `showSpecular`) and optional `specularMapUrl` so the effect can be tuned or disabled.

**Files:** `getGlassElementFilter.ts` (add specular branch in the filter graph), optional new `getSpecularMap.ts` or static asset, `GlassElement.tsx` (props and passing through to filter).

---

### 2.5 Fix orphan `.glass-panel` and optional shared panel

- **Remove or implement:** In `index.css`, either remove the `.glass-panel` rule that references `#liquidGlassFilterId`, or add a shared panel component that renders an inline `<svg><defs><filter id="liquidGlassFilterId">...</filter></defs></svg>` and applies `backdrop-filter: url(#liquidGlassFilterId)` via that component. Prefer one approach so the class is not orphaned.
- **Reuse:** Once a canonical Liquid Glass filter exists (e.g. from `GlassElement` or a shared filter component), panels and buttons can share the same filter id or the same filter definition to keep visuals consistent.

**Files:** `src/index.css`, and either a new `GlassPanel` component or `GlassElement` used as the base for panels.

---

### 2.6 Browser support and fallback

**Reference (LogRocket):** Using SVG filters as `backdrop-filter` is Chrome/Chromium-only. Safari and Firefox do not support it; they support `backdrop-filter` with CSS functions like `blur()`.

**Changes:**

- **Fallback:** When the full SVG filter is not applied (e.g. feature-detect or assume non-Chrome), apply a simple `backdrop-filter: blur(...) brightness(...) saturate(...)` (no `url()`) so glass still looks acceptable.
- **Feature detection:** Optionally detect support (e.g. create an off-screen element with `backdrop-filter: url(#test)` and check computed style or use a known Chrome-only behavior) and set a context or CSS class (e.g. `data-liquid-glass="true"`) to switch between full effect and fallback.
- **Document:** In the component README or Storybook, note that the full Liquid Glass effect is Chrome-only and that fallback is blur + brightness/saturate.

**Files:** `GlassElement.tsx` (conditional style or two variants), optional `useLiquidGlassSupport.ts` hook, docs.

---

### 2.7 Layered structure (filter layer + content layer)

**Reference (LogRocket):** Button has a “filter layer” (backdrop only) and a “content layer” (text/children with readable contrast).

**Current:** `GlassElement` wraps children in a single div that has both `backdropFilter` and the same box; `ButtonGlass` puts the button inside.

**Enhancement:** Explicitly separate:

- **Filter layer:** `position: absolute; inset: 0; backdrop-filter: ...` (no pointer events if needed).
- **Content layer:** Same inset, with background `bg-[--btn-content-bg]` or similar and the children, so text always has a consistent, readable background. This matches the article’s structure and improves legibility on busy backgrounds.

**Files:** `GlassElement.tsx`, optionally `ButtonGlass.tsx` and shared theme tokens (e.g. `--glass-content-bg`) in Tailwind/CSS.

---

### 2.8 Summary of Liquid Glass implementation order

| Priority | Task |
|----------|------|
| 1 | Memoize displacement filter (and map) URL in `GlassElement` to avoid per-render SVG build. |
| 2 | Ensure displacement map uses 128 as neutral for R/G and document scale. |
| 3 | Add specular rim (specular map + blur + blend) to the SVG filter pipeline. |
| 4 | Add fallback (blur + brightness/saturate only) for non-Chrome and document Chrome-only. |
| 5 | Fix or remove orphan `.glass-panel` and align with real filter id if kept. |
| 6 | Optional: Separate filter layer and content layer; introduce theme tokens. |
| 7 | Optional: Physics-based surface profile (squircle/convex) for displacement magnitude. |

---

## Part 3: Implementation order (combined)

Suggested order so that architecture fixes don’t block glass work, and glass doesn’t depend on every arch change:

1. **Quick wins:** Button `className` fix, Massage → Message rename, remove or fix `.glass-panel`, shared `ConnectionState` type.
2. **Glass:** Memoize filter URL, 128-neutral displacement map, specular rim, fallback + docs.
3. **Architecture:** Single route config, WebRTC provider, copy-to-clipboard helper.
4. **Polish:** Optional surface profile, filter/content layer split, error boundary, i18n init.

This plan keeps the codebase consistent, testable, and maintainable while making Liquid Glass components correct, performant, and robust across browsers.
