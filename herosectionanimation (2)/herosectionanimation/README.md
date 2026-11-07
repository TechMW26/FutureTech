# Futuretech React page

The existing page converted to React and Vite, preserving its styling, content, assets, and scroll animation.

## Run

```sh
npm install
npm run dev
```

On PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

## Production

```sh
npm run build
npm run preview
```

- `src/Journey.jsx`: original 200-frame canvas sequence.
- `src/Connections.jsx`: inward beams, logo illumination, and paragraph reveal.
- `src/IntegrationIcon.jsx`: existing six SVG icons.
- `src/styles.css` and `src/beam-section.css`: preserved styles.
- `public/`: sequence images and Futuretech logo.

The original root assets and beam scripts are retained as source references; the React app uses `src/` and `public/`. Open the Vite URL instead of opening index.html directly or using Live Server. Rollup uses its WebAssembly distribution for compatibility with Windows application-control policies.
