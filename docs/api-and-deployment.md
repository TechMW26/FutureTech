# API & Deployment

How the serverless API works, environment configuration, and deploying to Vercel.

---

## 1. The Serverless API (`/api`)

The `api/` folder contains **Vercel serverless functions** (Node.js):

### `POST /api/ai-search`

- **Body:** `{ "query": string }`
- **Response:** `{ "answer": string }` or `{ "error": string }`
- **Purpose:** Powers the "Magic AI Search" on the site. It:
  - Holds `GROQ_API_KEY` server-side so it never reaches the browser bundle.
  - Builds a ground-truth system prompt from site context.
  - Enforces strict safety rules (refuses off-topic questions, never invents facts, strips prompt-injection attempts, keeps answers under ~130 words, links only to on-site paths).
  - Sends the query to Groq (default model `llama-3.3-70b-versatile`).
- **Limits:** `MAX_QUERY_LENGTH = 600`; only `POST` is allowed (405 otherwise).
- Returns **401** if `GROQ_API_KEY` is missing, and a 4xx/5xx error on failure.

### `GET /api/site-context` (module: `site-context.js`)

- Builds the site context (pages, team, directors, expertise) fed to the LLM.
- **Important:** It imports live from the same data modules the website uses — `src/data/directors.js`, `src/data/team.js`, `src/data/expertise.js`. **Any content edit there flows into the AI automatically** — no duplicate copy to maintain.

---

## 2. Environment Variables

| Variable        | Where                                             | Purpose                                              |
| --------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `GROQ_API_KEY`  | Local `.env` + Vercel environment                 | Required for AI search. Signature for Groq API calls |
| `GROQ_ENDPOINT` | Optional (defaults to the standard Groq endpoint) | Override the chat-completions URL                    |

### Local dev

`vite.config.js` loads `.env` (excluding `VITE_`-prefixed keys from the client) and registers a **dev API middleware** that proxies `/api/ai-search` so the search works during `npm run dev`.

### Production

Provide the variables in **Vercel's project environment settings** (Settings → Environment Variables). Without `GROQ_API_KEY`, `/api/ai-search` returns a 401.

> ⚠️ **Never** commit secrets. `.env` should be git-ignored.

---

## 3. Deploying to Vercel

### Project config (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- The catch-all rewrite sends every path to `index.html` so the SPA handles deep links and client-side routing.
- The `api/` folder is automatically deployed as serverless functions by Vercel.

### Deploy options

1. **CLI:**
   ```bash
   npx vercel          # preview deploy
   npx vercel --prod   # production deploy
   ```
2. **Git integration:** Connect the repo to Vercel for auto-deploys on push to the production branch.

### Build settings (Project Settings)

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

---

## 4. Deployment Checklist

- [ ] `GROQ_API_KEY` is set in Vercel environment variables.
- [ ] `vercel.json` rewrite is present (SPA routing works).
- [ ] `npm run build` passes locally before pushing.
- [ ] New heavy images have `.webp` siblings (`npm run optimize:images`).
- [ ] Any new 3D models are meshopt-compressed and cached (see [3D Model Pipeline](./3d-model-pipeline.md)).

---

## Next Steps

- [Getting Started](./getting-started.md) — local env setup
- [Debugging](./debugging.md) — common issues & fixes
