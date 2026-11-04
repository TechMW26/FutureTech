# Assets & Images

This is the definitive guide to **where images and other static assets live** in this project, how they're referenced, and how to add new ones correctly.

---

## 1. The Short Answer — Where are the PNGs / images saved?

**All public images are stored under the project's `public/` folder**, organized into page/feature subfolders. Because everything in `public/` is served at the **site root (`/`)**, a file at `public/footer/mwfuturetech-logo.png` is referenced in code as `/footer/mwfuturetech-logo.png`.

The app also keeps **optimized `.webp`** siblings for most heavy PNGs — code points at the `.webp` version, not the `.png`. The original PNGs are kept on disk for designers to re-export.

---

## 2. Complete Image / Asset Map

| Category                      | Folder in `public/`               | Files (examples)                                                                                                                                                                                                   |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero backgrounds**          | `public/images/hero-backgrounds/` | `hero-bg-home.png/.webp`, `hero-bg-about`, `hero-bg-services`, `hero-bg-work`                                                                                                                                      |
| **Work hero images**          | `public/images/work-hero/`        | `keyboard.png`, `image-17.png`                                                                                                                                                                                     |
| **Illustrations / media**     | `public/images/` (root)           | `graffiti-hero.png/.webp`, `satellite-bead.png/.webp`, `earth-blue-marble-2048.webp`, `earth-blue-marble-8192.png/.webp`, `faq-bg.webp`, `Contact.png`, `contact.gif`, `futuretech news and events page image.png` |
| **Team member photos**        | `public/team/`                    | `Kushagra.png/.webp`, `Aadil.png/.webp`, `Ashish`, `Devraj`, `Lokesh`, `Sahil`                                                                                                                                     |
| **Director photos & cards**   | `public/directors/`               | `aviraj-sharma-profile.png/.webp`, `Aviraj director card mw futuretech.png`                                                                                                                                        |
| **Footer icons / logo**       | `public/footer/`                  | `mwfuturetech-logo.png`, `linkedin-circled.png`, `instagram-circle.png`, `whatsapp.png`                                                                                                                            |
| **Contact page media**        | `public/contact/`                 | `contact-figma-media.png/.webp`                                                                                                                                                                                    |
| **Work / mockup screenshots** | `public/mockup/`                  | `Mokker.png`, `Mokker-1.png`, `Mokker-2.png`, `image 4.png`, `image 6.png`, `image 8.png`, `Canact app screenshot 1.png`, `4c30308b-...png`                                                                        |
| **3D models**                 | `public/models/`                  | `mwft-hero-optimized.glb`, `about-coin-optimized.glb`, `services-tesseract-core-optimized.glb`, `work-cobalt-cortex-optimized.glb`                                                                                 |
| **Sound effects**             | `public/sounds/`                  | `scroll-click.mp3`                                                                                                                                                                                                 |
| **Site icons / favicon**      | `public/` (root)                  | `favicon.png`, `favicon.svg`, `icons.svg`                                                                                                                                                                          |
| **Bundled assets**            | `src/assets/`                     | `hero.png` (imported in JS, processed by Vite)                                                                                                                                                                     |

---

## 3. Two Kinds of Assets — `public/` vs `src/assets/`

### `public/` (static, served at `/`)

- Files are **copied verbatim** to `dist/` on build.
- Referenced by **absolute path string**, e.g. `src="/images/hero-backgrounds/hero-bg-home.webp"`.
- Best for: images loaded from `<img>`, CSS `background-image`, and assets with stable URLs (team photos, icons, GLB models, sounds).
- ⚠️ Files in `public/` are **not** hashed/optimized by Vite — that's why we generate manual `.webp` siblings.

### `src/assets/` (bundled)

- File is **imported** into JS: `import hero from '../assets/hero.png'`.
- Vite processes, hashes, and optimizes the asset; the URL is injected at build time.
- Best for: assets referenced from component code that you want hashed/versioned.

---

## 4. Naming & Format Conventions

1. **Always ship a `.webp` sibling** for heavy PNGs. The app points at the `.webp`. Run:

   ```bash
   npm run optimize:images
   ```

   (Adds WebP siblings under `public/` using Sharp. Idempotent — skips if the WebP is newer than the source.)

2. **Reference the optimized format** in code. Example — the header/global react logo:
   - `Globe.jsx`: `/images/earth-blue-marble-2048.webp` (the 2048px WebP, not the 8192px PNG).
   - `DirectorsSection.jsx`: `/directors/Aviraj director card mw futuretech.png`
   - `Footer.jsx`: `/footer/linkedin-circled.png`, `/footer/mwfuturetech-logo.png`

3. **Guard against URLs with spaces** — React Router / HTML needs percent-encoding for spaces. The mockup files use e.g. `/mockup/image%206.png` (space → `%20`). Prefer file names **without spaces** where possible.

4. Use `loading="lazy"` + `decoding="async"` on below-the-fold `<img>` tags (the Footer already does this).

---

## 5. How Images Are Preloaded for Performance

`App.jsx` maintains a `HERO_IMAGE_PRELOADS` array and fires `<link rel="preload">` + `new Image()` + `decode()` for each hero background on mount. This warms the browser cache so route changes don't cause decode/layout-shift delays.

```js
const HERO_IMAGE_PRELOADS = [
  "/images/hero-backgrounds/hero-bg-home.webp",
  "/images/hero-backgrounds/hero-bg-services.webp",
  "/images/hero-backgrounds/hero-bg-about.webp",
  "/images/graffiti-hero.webp",
];
```

When you add a new _hero_ background, add it here so it's decoded ahead of time.

---

## 6. How to Add a New Image

1. **Drop the source image** in the correct `public/` subfolder (see the map in §2).
2. **If it's a heavy PNG**, generate a WebP sibling:
   ```bash
   npm run optimize:images
   ```
3. **Reference it** by absolute path in code:
   ```jsx
   <img
     src="/images/work-hero/keyboard.png"
     alt="Keyboard"
     loading="lazy"
     decoding="async"
   />
   ```
   or as a CSS background:
   ```css
   .hero {
     background-image: url("/images/hero-backgrounds/hero-bg-home.webp");
   }
   ```
4. **If it's a hero background**, add it to `HERO_IMAGE_PRELOADS` in `App.jsx`.
5. **Mentally verify** the element is responsive at 375 / 768 / 1280 / 1920 px (see [Styling & Theming](./styling-and-theming.md)).

> **Rule of thumb:** if you only ever use the asset from JSX/CSS with a fixed path, put it in `public/`. If you want Vite to hash/optimize it, import it from `src/assets/`.

---

## Next Steps

- [3D Model Pipeline](./3d-model-pipeline.md) — models are also assets, but with a dedicated pipeline
- [Styling & Theming](./styling-and-theming.md) — responsive + theme rules for every surface
