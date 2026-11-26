# MW Futuretech

React and Vite implementation based on the supplied recording and visual reference.

## Run

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The opening section is pinned during scrolling: scattered hover-reactive blue squares gather into a rotating wave, then converge toward the supercomputer. Scrolling backward reverses the transition. Reduced-motion preferences disable ambient rotation and hover displacement.

All page copy comes from the supplied reference material and the requested heading. Project thumbnails are cropped from the supplied video. The logo and supercomputer are SVG approximations. News&Events and Let's Talk are display labels because no destinations were supplied. Work and About navigate to their page sections.

Main implementation: `src/main.jsx`. Responsive styles: `src/style.css`. Production output: `dist/`.

Verification: production build succeeds. Live browser visual QA was unavailable in the implementation session.
