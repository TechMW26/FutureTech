# Debugging & Troubleshooting

Common issues on this project and how to fix them, based on the design rules and conventions in [`copilot-instructions.md`](../.github/copilot-instructions.md).

---

## 1. Blank / Black 3D Canvas

**Symptom:** The hero's 3D model renders as a black or empty canvas.

**Likely causes & fixes:**

- **Metallic model reads black** → The page-level `<HeroScene />` is missing `SILVER_MODEL_LIGHTING_PROPS`. Spread it from `src/components/HeroScene.jsx` (see [3D Model Pipeline](./3d-model-pipeline.md#3-the-shared-silver-lighting-profile)).
- **Scene got stolen by the overlay** → The scene wasn't cloned. Always `useMemo(() => scene.clone(true), [scene])` per instance so the route-switch overlay's duplicate canvas can't steal the parent.
- **Blank after route switch** → The model URL wasn't seeded synchronously. Seed initial state with `useState(getFooModelReady() ? getFooModelUrl() : null)` so the first paint happens before the async cache resolves.
- **Animation runs before the overlay lifts** → Welcome animations were armed on mount instead of waiting for `data-transitioning` to be removed. Arm via a `MutationObserver` on that attribute, with a `setTimeout(arm, 1800)` safety net.

---

## 2. Model Downloaded Multiple Times / Slow Load

- **Use the shared pipeline** — one-off `useGLTF('/path.glb')` calls bypass the cache. Route all models through `registerModel()` in `src/lib/*.js` (blob-URL hand-off + Cache Storage).
- **Uncompressed GLB** → Every shipped model must be meshopt-compressed (`npx gltfpack -i in.glb -o out-optimized.glb -cc`) and suffixed `-optimized.glb`.
- **HDR `<Environment>` on mobile** → Don't load HDR environments on mobile/low-power devices; it's a heavy cost with little visual gain and can black out metals.

---

## 3. Images Not Showing / Blank Placeholder

- **Wrong path** — `public/` files are served at `/`. A file at `public/team/Kushagra.png` is `/team/Kushagra.png`, **not** `/public/team/...png`.
- **Spaces in filenames** — URLs with spaces must be percent-encoded (`image 6.png` → `/mockup/image%206.png`). Prefer no-space filenames.
- **Referencing the `.png` instead of `.webp`** — the app uses WebP siblings. If the WebP is missing, run `npm run optimize:images`.
- **Verifying output** — check `dist/` after `npm run build` to confirm the file was copied.

---

## 4. AI Search Returns 401 / Error

- **`GROQ_API_KEY` missing** — `/api/ai-search` returns 401. Add it to local `.env` and to Vercel's environment variables (see [API & Deployment](./api-and-deployment.md)).
- **Local dev proxy not active** — the dev middleware is registered in `vite.config.js`; restart `npm run dev` after adding `.env`.
- **Off-topic refusal** — remember the AI intentionally refuses off-topic questions by design; that's not a bug.

---

## 5. Component Is Not Responsive

**Symptom:** Layout breaks on mobile/tablet.

- Use `clamp()` for font sizes — never fixed `px` font values.
- Include all four tiers in order: desktop (default) → `@media (max-width: 1024px)` → `@media (max-width: 768px)` → `@media (max-width: 480px)`.
- No fixed `px` widths for layout containers — use `%`, `vw`, `max-width`, or Grid/Flex.
- Touch targets ≥ 44×44px on mobile.
- Mentally verify at 375, 768, 1280, and 1920px before finishing.

---

## 6. Theme / Glass Looks Wrong

- **Hardcoded colors** → Only use the CSS custom properties in `src/index.css`. Never hardcode color values.
- **Raw `backdrop-filter`** → Use the shared Liquid Glass classes in `src/styles/liquid-glass.css`, not one-off rules.
- **Missing LiqudGlassDefs** → `<LiquidGlassDefs />` must stay mounted near the root of `App.jsx`; removing it breaks refraction.
- **Dark mode not switching** → Make sure `data-theme="dark"` is actually applied to `<html>`; the tokens in liquid-glass styles switch on it.

---

## 7. Build / Lint Failures

- **Lint** → run `npm run lint` and fix hooks/refresh rules per `eslint.config.js`.
- **Build** → run `npm run build`; heavy vendors are split automatically by `manualChunks` in `vite.config.js`. If you add a heavy dep, consider adding a matching chunk so the initial payload stays small.
- **`lottie-react` ESM interop** → `vite.config.js` already force-bundles `lottie-react` + `lottie-web` via `optimizeDeps.include`. If you touch that, keep both entries.

---

## 8. Route / Navigation Issues

- **Deep link 404** → `vercel.json` rewrites all paths to `index.html`; confirm it's deployed (see [API & Deployment](./api-and-deployment.md#3-deploying-to-vercel)).
- **Adding a page** → follow [Routing & Pages](./routing-and-pages.md) (lazy import, `<Route>`, nav links, intro ref wiring if it has a model).
- **Smooth scroll not applied** → `/spade` deliberately disables Lenis/`useLenisScroll` for its standalone layout.

---

## Quick Diagnostic Commands

```bash
npm run lint             # check lint errors
npm run build            # confirm production build succeeds
npm run dev              # run locally with API proxy
npm run optimize:images  # regenerate WebP siblings
npx vite preview         # preview the built output
```

---

## Next Steps

- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
