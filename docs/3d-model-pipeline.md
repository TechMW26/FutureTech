# 3D Model Pipeline

Every 3D model on the site follows a **mandatory, shared pipeline**. Do **not** introduce one-off `useGLTF('/path.glb')` calls outside this flow. This prevents blank canvases, duplicate model downloads, and performance regressions.

---

## 1. The Shared Model Cache (`src/lib/modelCache.js`)

All models load through `registerModel()`, which provides three guarantees:

1. **Cache Storage warm-up** — the GLB is cached in the browser's Cache Storage (`mwft-model-cache-v3`) on import, so it isn't re-downloaded on later navigations/reloads.
2. **Blob-URL hand-off** — consumers get a stable blob URL; drei's `useGLTF` caches by URL, so the model is parsed exactly once even across multiple consumers.
3. **Sync readiness** — a synchronous `isReady()` + `getUrl()` pair lets components seed initial state without an async round-trip (avoids the "blank canvas after route switch" race).

```js
const COIN = registerModel("/models/about-coin-optimized.glb");
COIN.url; // raw URL (for useGLTF.preload)
COIN.promise; // Promise<blobUrl>
COIN.isReady(); // boolean
COIN.getUrl(); // current best URL (blob if ready, else raw)
```

---

## 2. Adding a New Model — Step by Step

### Step 1 — Add & compress the GLB

Drop the source GLB in `public/models/` and compress it with `gltfpack` (meshopt):

```bash
npx gltfpack -i public/models/raw.glb -o public/models/<name>-optimized.glb -cc
```

Delete the uncompressed source. **All shipped models must be meshopt-compressed** and suffixed `-optimized.glb`.

### Step 2 — Register a cache module

Create `src/lib/<name>Model.js`:

```js
import { registerModel } from "./modelCache";

export const FOO_MODEL_URL = "/models/foo-optimized.glb";
const entry = registerModel(FOO_MODEL_URL);
export const fooModelPromise = entry.promise;
export const getFooModelReady = entry.isReady;
export const getFooModelUrl = entry.getUrl;
```

### Step 3 — Add the URL to the prefetch list

In `App.jsx`, append to `PREFETCH_ASSETS` so it's prefetched after the homepage is idle (via `<link rel="prefetch">`, non-render-blocking).

### Step 4 — Build the scene component

Follow these **mandatory** rules:

- **Clone the scene per instance** — `const cloned = useMemo(() => scene.clone(true), [scene])`. Drei's `useGLTF` shares one `Object3D` across consumers; without cloning, the page-exit overlay's duplicate canvas steals the parent and the live page goes blank.
- **Seed `modelUrl` synchronously** — `useState(getFooModelReady() ? getFooModelUrl() : null)` to avoid the blank-canvas-after-route-switch race.
- **Delay the IntersectionObserver** by ~2s before pinning `frameloop="never"`, so the canvas paints its first frames after navigation.
- **Per-instance overlay rest pose** — if the component has a mount animation, check `document.documentElement.hasAttribute('data-transitioning')` on mount; when true, render the model in its **final rest pose** so the exit overlay shows the model, not an empty canvas.
- **`useGLTF.preload(cachedUrl)`** the moment the blob URL resolves, to warm drei's GLTF cache for the overlay clone.

### Step 5 — Mount-time animation timing

Do **not** arm a "drop/reveal/fade-in" timer on `useEffect` mount. The route-switch overlay covers the page for ~1.2s, so the user would never see it. Instead:

- Arm the timer when `<html data-transitioning>` is removed (use a `MutationObserver` on that attribute).
- Add a `setTimeout(arm, 1800)` safety net.

### Step 6 — Page-level animation orchestration

- Page-level welcome animations play **every** time a user visits a route with a model.
- `App.jsx` owns the route-level `introStartRef`: it resets on each model-route visit and arms it after the loader/page-transition delay.
- Use **one stable intro ref per model route** so arming the incoming page doesn't reset the outgoing model during transitions.
- **Do not** start per-page intro timers inside page components.

---

## 3. The Shared Silver Lighting Profile

Every page-level `<HeroScene />` that renders a GLB should spread `SILVER_MODEL_LIGHTING_PROPS` (imported from `src/components/HeroScene.jsx`):

```jsx
<HeroScene
  modelUrl={modelUrl}
  title="..."
  tagline="..."
  introStartRef={introStartRef}
  {...SILVER_MODEL_LIGHTING_PROPS}
/>
```

This profile sets front/rim/fill lighting, a light silvery material tint, reflective env-map intensity, subtle emissive fill, and tone-mapping exposure so metallic GLBs **don't read black** on desktop or mobile.

> **Do not** duplicate these numeric values in page files. If the global model look needs to change, update the constant once.

---

## 4. Existing Models

| Model          | File in `public/models/`                | Used on       |
| -------------- | --------------------------------------- | ------------- |
| Hero           | `mwft-hero-optimized.glb`               | Home          |
| Coin           | `about-coin-optimized.glb`              | About         |
| Tesseract core | `services-tesseract-core-optimized.glb` | News & Events |
| Cobalt cortex  | `work-cobalt-cortex-optimized.glb`      | Work          |

---

## 5. Performance Rules for 3D

- **Avoid `antialias: true`** and high DPR on mobile / low-end devices.
- **Never** load HDR `<Environment>` on mobile / low-power devices.
- **Always disable** `castShadow` and `receiveShadow` on every hero/model mesh.
- **Canvas sizing:** the 3D canvas must always be `width: 100vw; height: 100vh`.
- **Responsive framing:** adjust the model's `topOffsetRatio` for narrower mobile aspect ratios so the model focal point stays visible.
- **Overlay gradient:** grow the gradient fade height on mobile so text never overlaps the model focal point.

---

## Next Steps

- [Assets & Images](./assets-and-images.md) — other (non-3D) asset locations
- [Styling & Theming](./styling-and-theming.md) — responsive + theme rules
