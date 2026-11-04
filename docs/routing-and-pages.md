# Routing & Pages

How routing works, where pages live, how transitions behave, and how to add a new page.

---

## 1. Route Table

Routing is defined in `src/App.jsx` inside a `<Routes>` block. Pages are **lazy-loaded** with `React.lazy` and wrapped in `<Suspense>`.

| Route                     | Component                                | Notes                                                               |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `/`                       | `src/pages/HomePage.jsx`                 | Hero GLB model, intro ref for `/`                                   |
| `/work`                   | `src/pages/WorkPage.jsx`                 | Scroll hero + mockup gallery; **no Footer**                         |
| `/news-events`            | `src/pages/NewsEventsPage.jsx`           | Tesseract model, intro ref                                          |
| `/services`               | `<Navigate to="/news-events" replace />` | Redirect                                                            |
| `/about`                  | `src/pages/AboutPage.jsx`                | Coin model, intro ref                                               |
| `/contact`                | `src/pages/ContactPage.jsx`              | —                                                                   |
| `/director/:directorname` | `src/pages/DirectorPage.jsx`             | Dynamic director profile from params                                |
| `/spade`                  | `src/pages/SpadeClonePage.jsx`           | Standalone clone — **no Header, Loader, LiquidGlassDefs or Footer** |
| `*` (fallback)            | `HomePage`                               | Unknown paths render the homepage                                   |

### Route notes

- `/services` redirects to `/news-events` (`<Navigate replace />`).
- **Model-intro routes** are tracked by `MODEL_INTRO_PATHS` in `App.jsx` (`/`, `/news-events`, `/about`). They get an `introStartRef` prop that `App.jsx` arms after the loader + transition delay.
- `/work` hides the Footer (`!isWorkPage && <Footer />`).
- `/spade` is a special standalone build that disables the Loader, Header, LiquidGlassDefs, and smooth scroll.

---

## 2. Page Shell (`src/pages/PageShell.jsx`)

Most pages share a common shell (`PageShell`) that provides the page-level layout, overlay text, and intro wiring. On top of that, model pages render a `<HeroScene>` with the shared `SILVER_MODEL_LIGHTING_PROPS` (see [3D Model Pipeline](./3d-model-pipeline.md)).

---

## 3. Page Transitions

- Routes are wrapped in `<AnimatePresence mode="wait">` so the outgoing page fades out before the new one fades in (no visual overlap).
- `PAGE_FADE_DURATION = 0.42s` controls the cross-fade.
- A **route-switch overlay** covers the screen during transitions (around 1.2s) and sets `data-transitioning` on `<html>`.
- On every route change, `App.jsx` scrolls to top (via Lenis if present, else `window.scrollTo`).

---

## 4. Adding a New Page

1. **Create the component** in `src/pages/`, e.g. `src/pages/FooPage.jsx` (plus a co-located `FooPage.css` if it has styles).
2. **Register the route** in `src/App.jsx`:
   ```jsx
   const FooPage = lazy(() => import('./pages/FooPage'))
   // ...
   <Route path="/foo" element={<FooPage />} />
   ```
3. **Add a nav link** in `src/components/Header.jsx` and, if applicable, a link/page in the Footer.
4. **If the page has a 3D model**, follow the full [3D Model Pipeline](./3d-model-pipeline.md) (cache module, prefetch list, intro ref wiring, silver lighting).
5. **Verify responsiveness** at 375 / 768 / 1280 / 1920 px (see [Styling & Theming](./styling-and-theming.md)).

---

## 5. Deep Links & SPA Hosting

`vercel.json` rewrites every path to `index.html` so deep links (e.g. `/director/aviraj-sharma`) resolve correctly on Vercel:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Next Steps

- [Architecture](./architecture.md) — high-level data flow
- [Styling & Theming](./styling-and-theming.md) — build every new page fully responsive
