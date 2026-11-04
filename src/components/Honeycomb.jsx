import { useCallback, useState } from 'react'
import Hex from './Hex'
import './Honeycomb.css'

/* ==========================================================
   LOGO SOURCES
   One shared 43 × 43 artwork sheet, imported through Vite so the
   bundler resolves and hashes it. Because every tile shares the
   same box size, the crop can be a simple scale of that one tile
   instead of per-image percentages — no icon fonts, SVG
   recreations, placeholder services or generated substitutes.
========================================================== */

import tileSprite from '../assets/work-hero/image 4.png'

/* ==========================================================
   HONEYCOMB — geometry from the Figma Make export
   ----------------------------------------------------------
   Design frame: 527 × 319. Every left/top/width/height below is
   copied verbatim from `Our-Works-section/src/App.tsx`, so the
   composition is reproduced rather than interpreted.

   There are 13 hexagons in THREE body sizes — the export nests
   smaller cells around the four major ones:

     tier A  78 × 72   h1 h2 h3 h4        (the four major cells)
     tier B  63 × 57   h5 h6 h7 h8        (mid, flanking)
     tier C  51 × 47   h9 … h12           (small, outer corners)

   The `inset` values are the export's negative insets on the inner
   wrapper, which extend each pattern beyond its element box. That
   extra box is there for the drop shadow — the hexagon BODY is
   always square, so `.hex` is sized to the body and the shadow
   spills out of it.

   ONE ARTWORK, SIX APPEARANCES
   ----------------------------
   The export paints every cell with a class, not a file: Polygon 9
   appears twice and Polygon 10 three times, each at its own
   opacity. Rather than shipping near-identical duplicates, all six
   shapes come from one inline SVG (see Hex.jsx) and the export's
   own opacities are applied on top:

     Polygon 9   opacity 1     h1          (the branded, lit cell)
     Polygon 10  opacity 0.74  h2 h3 h4
     Polygon 16  opacity 0.74  h13
     Polygon 12  opacity 0.37  h5 h6
     Polygon 13  opacity 0.37  h7 h8
     Polygon 17  opacity 0.37  h9 … h12

   `cx` / `cy` are the hexagon CENTRE. The body is square, so a
   single number describes both axes and the cells stay aligned to
   each other without fractional pixel drift.
========================================================== */

/* Locator for the four distinct logo crops inside the shared sheet.
   The crop is expressed as a class (see Hex.css) rather than an
   inline style, so it survives any style-merging step and keeps the
   artwork's percentage geometry in the stylesheet with the rest of
   the layout. */
const sprite = (crop) => ({ crop: `crop-${crop}` })

/* Decorative shape hexagons — every cell except the branded one.
   `opacity` reproduces the export's per-appearance value. */
const SHAPES = [
  { id: 'h2', cx: 344, cy: 107, body: 78, inset: '-11.25% -7.79% -19.59% -7.79%', opacity: 0.74 },
  { id: 'h3', cx: 344, cy: 165, body: 78, inset: '-8.47% -7.79% -19.59% -7.79%', opacity: 0.74 },
  { id: 'h4', cx: 421.5, cy: 165, body: 78, inset: '-8.47% -7.79% -19.59% -7.79%', opacity: 0.74 },

  { id: 'h5', cx: 453.5, cy: 107, body: 63, inset: '-10.53% -11.24% -24.32% -11.24%', opacity: 0.37 },
  { id: 'h6', cx: 312.5, cy: 107, body: 63, inset: '-10.53% -11.24% -24.32% -11.24%', opacity: 0.37 },
  { id: 'h7', cx: 453.5, cy: 230.5, body: 63, inset: '-10.78% -11.24% -24.82% -11.24%', opacity: 0.37 },
  { id: 'h8', cx: 312.5, cy: 230.5, body: 63, inset: '-10.78% -11.24% -24.82% -11.24%', opacity: 0.37 },

  { id: 'h9', cx: 421.5, cy: 54.5, body: 51, inset: '-12.99% -15.46% -30.01% -15.46%', opacity: 0.37 },
  { id: 'h10', cx: 486.5, cy: 165.5, body: 51, inset: '-12.99% -15.46% -30.01% -15.46%', opacity: 0.37 },
  { id: 'h11', cx: 343.5, cy: 276.5, body: 51, inset: '-12.99% -15.46% -30.01% -15.46%', opacity: 0.37 },
  { id: 'h12', cx: 279.5, cy: 168.5, body: 51, inset: '-12.99% -15.46% -30.01% -15.46%', opacity: 0.37 },

  { id: 'h13', cx: 383, cy: 223.5, body: 78, inset: '-8.64% -7.79% -19.91% -7.79%', opacity: 0.74 },
]

/* The four brand tiles — exact export coordinates and opacities.
   `tint` is the export's #5BA9E9 / 32% blue veil, which on this
   artwork tints the fox only: the other three icons are already
   blue, so the veil reads as the design's opacity step. */
const LOGOS = [
  {
    id: 'fox',
    alt: 'MW Futuretech flagship product',
    cx: 382.5, cy: 107.5, body: 43,
    crop: '0-0',
    opacity: 1,
    tint: 'rgba(91, 169, 233, 0.32)',
  },
  {
    id: 'infinity',
    alt: 'Infinity',
    cx: 422, cy: 164.5, body: 43,
    crop: 'infinity',
    opacity: 0.74,
    tint: 'rgba(91, 169, 233, 0.32)',
  },
  {
    id: 'c-company',
    alt: 'C Company',
    cx: 344, cy: 164.5, body: 43,
    crop: 'c-company',
    opacity: 0.74,
    tint: 'rgba(91, 169, 233, 0.32)',
  },
  {
    id: 'dtps',
    alt: 'DTPS',
    cx: 382, cy: 223, body: 42,
    crop: 'dtps',
    opacity: 0.74,
    tint: 'rgba(91, 169, 233, 0.32)',
  },
]

const px = (n) => `calc(${n} * var(--f))`

/* `.hex` is centred on its own box (see Hex.css), so one number per
   axis — the cell's CENTRE — fully places it inside the frame. */
const at = (x, y, body, opacity) => ({
  left: px(x),
  top: px(y),
  width: px(body),
  height: px(body),
  opacity,
})

export default function Honeycomb() {
  /* ----------------------------------------------------------
     SINGLE SOURCE OF TRUTH for selection.

     One state variable → at most one lit tile.
     `selectedId === logo.id` drives every tile's selected state, so
     clicking a new logo immediately unlights the previous one.
     There are deliberately no per-logo booleans.
  ---------------------------------------------------------- */
  const [selectedId, setSelectedId] = useState(null)

  const handleSelect = useCallback((id) => {
    setSelectedId(id)
  }, [])

  return (
    <div
      className="honeycomb"
      role="group"
      aria-label="Our ecosystem of products and initiatives"
    >
      {/* Decorative shape hexagons — painted first, lowest layer. */}
      {SHAPES.map((s) => (
        <Hex
          key={s.id}
          id={s.id}
          variant="shape"
          className={s.id}
          style={at(s.cx, s.cy, s.body, s.opacity)}
          innerStyle={{ inset: s.inset }}
        />
      ))}

      {/* Brand tiles, at their exact export coordinates. */}
      {LOGOS.map((l) => (
        <Hex
          key={l.id}
          id={l.id}
          variant="logo"
          alt={l.alt}
          selected={selectedId === l.id}
          /* The design lights the fox's cell by default; once the
             user selects anything, that selection takes over. */
          accent={selectedId === null && l.id === 'fox'}
          onSelect={handleSelect}
          className={l.id}
          style={at(l.cx, l.cy, l.body, l.opacity)}
          sprite={tileSprite}
          tint={l.tint}
          {...sprite(l.crop)}
        />
      ))}
    </div>
  )
}
