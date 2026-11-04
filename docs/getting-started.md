# Getting Started

This guide walks through prerequisites, installation, environment setup, and the common developer workflows for the MW Futuretech website.

---

## 1. Prerequisites

- **Node.js** ≥ 20.x (Vite 8 requires a modern Node runtime)
- **npm** (comes with Node)
- A **Vercel account** if you plan to deploy (optional for local dev)
- A **Groq API key** (optional for local AI search, required in production)

---

## 2. Install Dependencies

```bash
npm install
```

This installs the runtime deps (React, Three.js, Three Fiber, GSAP, Lenis, Motion, etc.) and dev deps (Vite, ESLint, Sharp, etc.).

---

## 3. Environment Variables

Create a `.env` file in the project root (Vite loads it automatically):

```bash
# Used by the local dev API proxy for AI search.
# Required only if you want /api/ai-search to work locally.
GROQ_API_KEY=your_groq_key_here

# Optional: override the Groq endpoint (defaults to the standard chat completions URL).
# GROQ_ENDPOINT=https://api.groq.com/openai/v1/chat/completions
```

> **Security:** Never commit `.env`. In production the variables are provided by Vercel's environment settings (see [API & Deployment](./api-and-deployment.md)). `vite.config.js` deliberately _excludes_ `VITE_`-prefixed variables from leaking into the client bundle — the API key stays server-side.

---

## 4. Run the Dev Server

```bash
npm run dev
```

- Dev server boots with a **local API middleware** that proxies `/api/ai-search` (and the site-context endpoint) so the search works locally.
- Hot Module Replacement (HMR) is enabled — edits to `.jsx` / `.css` reflect instantly.
- Without `GROQ_API_KEY`, the site runs but the AI search endpoint will return an error until you add the key.

---

## 5. Production Build

```bash
npm run build
```

- Outputs to `dist/`.
- Vite **code-splits** heavy vendors into separate chunks (`vendor-three`, `vendor-lottie`, `vendor-motion`, `vendor-gsap`, `vendor-router`, `vendor-icons`) so the initial payload stays small.
- All `public/` assets are copied to `dist/` verbatim.

Preview the production build locally:

```bash
npm run preview
```

---

## 6. Linting

```bash
npm run lint
```

Runs ESLint across the project. The config lives in `eslint.config.js` and includes `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.

---

## 7. Image Optimization

```bash
npm run optimize:images
```

Generates **WebP** siblings for the heaviest PNGs under `public/` using Sharp (see `scripts/optimize-images.mjs`). The app references the `.webp` variant in production. Re-runs are idempotent (skips if the WebP is newer than the source).

---

## 8. Common Workflows At a Glance

| Task                     | Command                                         |
| ------------------------ | ----------------------------------------------- |
| Install deps             | `npm install`                                   |
| Start dev server         | `npm run dev`                                   |
| Build for production     | `npm run build`                                 |
| Preview production build | `npm run preview`                               |
| Lint                     | `npm run lint`                                  |
| Optimize images → WebP   | `npm run optimize:images`                       |
| Add a new 3D model       | See [3D Model Pipeline](./3d-model-pipeline.md) |
| Add a new page / route   | See [Routing & Pages](./routing-and-pages.md)   |
| Add a new image / asset  | See [Assets & Images](./assets-and-images.md)   |

---

## Next Steps

- Understand the folder layout → [Architecture](./architecture.md)
- Find where images live → [Assets & Images](./assets-and-images.md)
