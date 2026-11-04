# Styling & Theming

The site uses a centralized theming system plus a single shared **Liquid Glass** design system for all UI surfaces, with a strict multi-tier responsiveness mandate.

---

## 1. Theme Tokens (`src/index.css`)

All color/theme values are **CSS custom properties** defined in `src/index.css`. **Never hardcode color values outside these variables** in components.

- **Default theme is light.**
- **Dark theme** is toggled by setting `data-theme="dark"` on `<html>`.

Key tokens:

| Token           | Light value (default)   | Dark value               |
| --------------- | ----------------------- | ------------------------ |
| Page background | `#fdfcf7` (pearl white) | `#050505` (near-black)   |
| `--lg-tint`     | Liquid-glass tint       | Auto-switches with theme |
| `--lg-border`   | Liquid-glass border     | Auto-switches with theme |
| `--lg-text`     | Liquid-glass text color | Auto-switches with theme |

The theme toggle is a **floating sun↔moon FAB at the bottom-left** (`<ThemeToggle />`). Do **not** put a theme switch anywhere else.

---

## 2. Responsiveness — MANDATORY FOR EVERY COMPONENT

Every element, section, and component **must** be fully responsive across all tiers. Never ship CSS without rules for all breakpoints.

### Breakpoint tiers

| Name        | Max-width | Targets                            |
| ----------- | --------- | ---------------------------------- |
| Desktop     | (default) | 1025px+                            |
| Tablet      | 1024px    | iPad, landscape tablets            |
| Mobile      | 768px     | Phones, portrait tablets           |
| Small phone | 480px     | Compact phones (SE, small Android) |

### Rules

1. **Always use `clamp()` for font sizes** — never hard-code scales:
   ```css
   font-size: clamp(1rem, 2.5vw, 2rem);
   ```
2. **Use fluid spacing** — prefer `clamp()` or `min()` for `padding`, `gap`, `margin` where appropriate.
3. **Write CSS mobile-first or include all breakpoints** — default styles serve desktop, then add `@media (max-width: ...)` blocks for tablet, mobile, and small phone **in that order**.
4. **Every `@media` block must cascade correctly:**

   ```css
   .element { ... }                                  /* desktop */

   @media (max-width: 1024px) { .element { ... } }   /* tablet */

   @media (max-width: 768px)  { .element { ... } }   /* mobile */

   @media (max-width: 480px)  { .element { ... } }   /* small phone */
   ```

5. **Touch targets** — all interactive elements must be at least **44×44px** on mobile.
6. **No fixed `px` widths for layout containers** — use `%`, `vw`, `max-width`, or CSS Grid/Flex.
7. **3D canvas** — always `width: 100vw; height: 100vh`; adjust `topOffsetRatio` for mobile aspect ratios.
8. **Overlay text over 3D** — grow the gradient fade height on mobile so text never overlaps the model focal point.
9. **Test mentality** — before completing any UI task, mentally verify at **375px, 768px, 1280px, and 1920px**.

---

## 3. The Liquid Glass Design System

All buttons, pills, headers, cards, modals, FABs, and floating panels **must** use the shared system in `src/styles/liquid-glass.css`. Do **not** invent new glass styles or one-off `backdrop-filter` rules per element.

### Required setup

- `<LiquidGlassDefs />` is mounted once near the root of `App.jsx` (provides the SVG displacement filter `#liquid-glass-distortion`). Never remove it.
- `liquid-glass.css` is imported once globally in `App.jsx`.

### How to apply

```jsx
<button className="liquid-glass liquid-glass-button">Click me</button>
<div className="liquid-glass liquid-glass--card">Card</div>
<div className="liquid-glass liquid-glass--strong">Floating panel</div>
<div className="liquid-glass liquid-glass--circle liquid-glass-button">FAB</div>
```

### Class reference

| Class                     | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `.liquid-glass`           | Base glass surface (pill shape default) |
| `.liquid-glass--card`     | 18px radius card                        |
| `.liquid-glass--circle`   | Perfect circle (FABs / icon buttons)    |
| `.liquid-glass--strong`   | Heavier blur for floating panels        |
| `.liquid-glass--animated` | Liquid shimmer animation                |
| `.liquid-glass-button`    | Button cursor + hover/active states     |

### Rules

1. **Never** use raw `backdrop-filter` on UI surfaces — always go through the shared classes.
2. All interactive surfaces must include `.liquid-glass-button` for touch + focus styling.
3. **Refraction is automatic** via the `::before` displacement layer — do not duplicate it.
4. **Top light highlight is automatic** via `::after` — do not duplicate it.
5. **Color tokens** (`--lg-tint`, `--lg-border`, `--lg-text`) auto-switch with theme — never hardcode.
6. **Floating header** uses `.liquid-glass--strong .liquid-glass--animated`.
7. **Bottom-left theme FAB** uses `.liquid-glass--circle .liquid-glass-button`.
8. Always test glass surfaces against **both** light and dark backdrops.

---

## 4. Styling Approach Summary

- **CSS custom properties** in `src/index.css` = theme tokens.
- **Co-located component CSS** — `Header.jsx` + `Header.css`, `Footer.jsx` + `Footer.css`, etc.
- **Tailwind + PostCSS** available for utility classes when convenient.
- **Liquid Glass** for all interactive/UI surfaces.

---

## Next Steps

- [Assets & Images](./assets-and-images.md) — background-image URLs and WebP conventions
- [Routing & Pages](./routing-and-pages.md) — build new pages fully responsive
