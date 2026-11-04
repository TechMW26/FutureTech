# MW Futuretech Website

A high-performance, immersive single-page application (SPA) for **MW Futuretech**, built with **React 19 + Vite**, and hosted on **Vercel**.

The site combines a liquid-glass design system, full 3D hero sections rendered with **React Three Fiber (Three.js)**, smooth Lenis scroll, serverless AI search, and a strict multi-tier responsive layout — all optimized for fast initial paint and low mobile power draw.

> **Full developer documentation lives in [`/docs`](./docs).** Start with [Architecture](./docs/architecture.md) and [Getting Started](./docs/getting-started.md).

---

## ✨ Highlights

- **3D hero scenes** — GLB models rendered via React Three Fiber with a shared _Silver_ lighting profile, meshopt-compressed, and served through a Cache Storage + blob-URL pipeline.
- **Liquid Glass design system** — a single shared glass/refraction surface used for all buttons, cards, headers, FABs and floating panels.
- **Light / dark themes** — toggled via a floating sun↔moon FAB (bottom-left), driven by `data-theme` on `<html>`.
- **Route-scoped page transitions** — cross-fade between routes with a dedicated route-switch overlay.
- **Serverless AI search** — `/api/ai-search` (Vercel serverless function) with a site context endpoint.
- **Strict responsiveness** — every component is responsive across desktop, tablet, mobile and small-phone breakpoints.
- **Performance-first** — code-split vendor chunks, image preloading + decoding, model caching, and disabled shadows on all 3D meshes.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (with local API proxy for AI search)
npm run dev

# 3. Production build
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Lint
npm run lint

# 6. Regenerate optimized WebP images for new PNGs in /public
npm run optimize:images
```

> **Note:** `npm run dev` requires a local `.env` with `GROQ_API_KEY` (and optionally `GROQ_ENDPOINT`) if you want the AI search endpoint to work locally. See [API & Deployment](./docs/api-and-deployment.md).

---

## 🗂 Where are the images & assets?

All static assets live in the **`/public`** directory and are referenced by absolute URLs (e.g. `/images/...`, `/footer/...`).

| Asset type                    | Location                                                                  |
| ----------------------------- | ------------------------------------------------------------------------- |
| Hero background images        | [`public/images/hero-backgrounds/`](./public/images/hero-backgrounds)     |
| Work hero images              | [`public/images/work-hero/`](./public/images/work-hero)                   |
| General illustrations / media | [`public/images/`](./public/images) (graffiti, satellite-bead, earth, FAQ) |
| Team member photos            | [`public/team/`](./public/team) (`.png` + `.webp` per member)             |
| Director photos & cards       | [`public/directors/`](./public/directors)                                 |
| Footer social / logo icons    | [`public/footer/`](./public/footer)                                       |
| Contact page media            | [`public/contact/`](./public/contact)                                     |
| Work/mockup screenshots       | [`public/mockup/`](./public/mockup)                                       |
| 3D models (meshopt `.glb`)    | [`public/models/`](./public/models)                                       |
| Sound effects                 | [`public/sounds/`](./public/sounds)                                       |
| Site icons / favicon          | `public/favicon.svg`, `public/favicon.png`, `public/icons.svg`            |

> **TL;DR — where are the PNGs?** They live under **`public/`** in the page-specific folders above. For most, an optimized **`.webp`** sibling also exists (the app points at the `.webp`). Regenerate WebP siblings with `npm run optimize:images`.
>
> 💡 In production, `public/` maps to the site **root** — so `public/images/hero-bg-home.webp` is referenced in code as `/images/hero-bg-home.webp`.

For the full asset map, conventions, and how to add a new image, see **[Assets & Images](./docs/assets-and-images.md)**.

---

## 🏗 Routes

| Route                      | Page                                     | 3D model / note                         |
| -------------------------- | ---------------------------------------- | --------------------------------------- |
| `/`                        | `HomePage`                               | Hero GLB model                          |
| `/work`                    | `WorkPage`                               | Scroll hero, mockup gallery (no footer) |
| `/news-events`             | `NewsEventsPage`                         | Tesseract model                         |
| `/about`                   | `AboutPage`                              | Coin model                              |
| `/contact`                 | `ContactPage`                            | —                                       |
| `/director/:directorname`  | `DirectorPage`                           | Director profile                        |
| `/spade`                   | `SpadeClonePage`                         | Standalone clone (no header/loader)     |
| `/services`                | ⇢ redirects to `/news-events`            | —                                       |

See **[Routing & Pages](./docs/routing-and-pages.md)** for details.

---

## 🧱 Tech Stack

- **React 19** + **React Router v7** (`react-router-dom`)
- **Vite 8** (build, dev middleware, API proxy)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** (3D)
- **GSAP** & **Motion** (animations)
- **Lenis** (smooth scrolling)
- **cobe** (globe), **lottie-react** (animations), **lucide-react** (icons)
- **Tailwind CSS** + **PostCSS** (utility styling)
- **Sharp** (image optimization script)
- **Vercel** serverless functions for AI search (`/api`)

---

## 📚 Documentation Index

| Doc                                                      | Covers                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| [Getting Started](./docs/getting-started.md)             | Prereqs, install, env vars, running, building                 |
| [Architecture](./docs/architecture.md)                   | High-level structure, data flow, key files                    |
| [Assets & Images](./docs/assets-and-images.md)           | **Where images live**, formats, adding new assets, optimization |
| [3D Model Pipeline](./docs/3d-model-pipeline.md)         | Adding a model end-to-end, lighting profile, caching          |
| [Routing & Pages](./docs/routing-and-pages.md)           | Routes, page shells, transitions, adding a page               |
| [Styling & Theming](./docs/styling-and-theming.md)       | CSS variables, themes, liquid-glass system, responsiveness    |
| [API & Deployment](./docs/api-and-deployment.md)         | AI search API, env, Vercel deploy, rewrites                   |
| [Debugging & Troubleshooting](./docs/debugging.md)       | Common issues and fixes                                       |

---

## 📄 License

Private project. © MW Futuretech.