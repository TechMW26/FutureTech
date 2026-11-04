import React from "react";
import "./WorkHero.css";

import logo1 from "../assets/work-hero/image 4.png";
import logo2 from "../assets/work-hero/image 5.png";
import logo3 from "../assets/work-hero/image 6.png";
import logo4 from "../assets/work-hero/image 7.png";

/*
|--------------------------------------------------------------------------
| Honeycomb cell artwork
|--------------------------------------------------------------------------
|
| The hexagon tiles ship as pre-rendered PNGs, so they are used directly
| and never rebuilt with clip-path, borders or gradients.
|
|   Polygon 11.png  the resting hexagon — used by ALL twelve cells
|   Polygon 12.png  the same resting hexagon, slightly tighter crop
|
| Every cell paints the same neutral artwork. No cell is pre-lit, and
| carrying a logo does not change how a cell looks: the glow and the
| enlargement are hover-only state and apply to all cells equally.
|
| Polygon 9.png is deliberately not used here. It is the lit variant —
| its shadow filter includes the blue #5BA9E9 glow — so painting it by
| default would leave the four logo cells permanently lit.
|
*/

import shapePlain from "../assets/work-hero/Polygon 11.png";
import shapeTight from "../assets/work-hero/Polygon 12.png";

/*
|--------------------------------------------------------------------------
| Four actual project logos
|--------------------------------------------------------------------------
|
| These are deliberately kept separate because the source PNGs have
| different dimensions and different amounts of transparent padding.
|
*/

const logoCells = [
  {
    id: 3,
    position: "top-center",
    image: logo1,
    className: "logo-one",
  },
  {
    id: 5,
    position: "middle-left",
    image: logo2,
    className: "logo-two",
  },
  {
    id: 8,
    position: "middle-right",
    image: logo3,
    className: "logo-three",
  },
  {
    id: 11,
    position: "bottom-center",
    image: logo4,
    className: "logo-four",
  },
];

/*
|--------------------------------------------------------------------------
| Exactly 12 honeycombs
|--------------------------------------------------------------------------
|
| 4 logo cells
| 8 empty cells
|
| Every cell uses the same resting PNG, whether or not it holds a logo.
|
*/

const cells = [
  {
    id: 1,
    position: "cell-1",
    shape: shapePlain,
  },

  {
    id: 2,
    position: "cell-2",
    shape: shapeTight,
  },

  {
    id: 3,
    position: "cell-3",
    shape: shapePlain,
    logo: logoCells[0],
  },

  {
    id: 4,
    position: "cell-4",
    shape: shapeTight,
  },

  {
    id: 5,
    position: "cell-5",
    shape: shapePlain,
    logo: logoCells[1],
  },

  {
    id: 6,
    position: "cell-6",
    shape: shapePlain,
  },

  {
    id: 7,
    position: "cell-7",
    shape: shapePlain,
  },

  {
    id: 8,
    position: "cell-8",
    shape: shapeTight,
    logo: logoCells[2],
  },

  {
    id: 9,
    position: "cell-9",
    shape: shapePlain,
  },

  {
    id: 10,
    position: "cell-10",
    shape: shapeTight,
  },

  {
    id: 11,
    position: "cell-11",
    shape: shapePlain,
    logo: logoCells[3],
  },

  {
    id: 12,
    position: "cell-12",
    shape: shapeTight,
  },

  /*
    15 is an added cell. It is appended here rather than inserted
    anywhere in the middle so cells 1–12 keep their existing order,
    coordinates and sizes exactly as they were.
  */
  {
    id: 15,
    position: "cell-15",
    shape: shapePlain,
  },
];

function WorkHero() {
  return (
    <section className="work-hero">

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="work-hero-content">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="work-copy">

          <h1>
            Our
            <br />
            Works
          </h1>

          <p>
            A growing ecosystem of companies, products and initiatives
            <br className="desktop-break" />

            focused on healthier people, cleaner environments and a
            <br className="desktop-break" />

            better tomorrow.
          </p>

          <a
            href="#work"
            className="explore-button"
          >

            <span>
              Explore our work
            </span>

            <span className="explore-button-arrow">

              <svg
                viewBox="0 0 40 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >

                <path
                  d="M2 12H35"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M26 3L35 12L26 21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </span>

          </a>

        </div>

        {/* ===================================================
            HONEYCOMB SYSTEM
        =================================================== */}

        <div className="work-honeycomb-area">

          <div className="work-honeycomb">

            {cells.map((cell) => (

              <div
                key={cell.id}
                className={`
                  work-honeycomb-cell
                  ${cell.position}
                  ${cell.logo ? "logo-cell" : ""}
                `}
              >

                <div className="work-honeycomb-shape">

                  <img
                    src={cell.shape}
                    alt=""
                    className="work-honeycomb-artwork"
                    draggable="false"
                  />

                  {cell.logo && (

                    <img
                      src={cell.logo.image}
                      alt=""
                      className={`
                        work-project-logo
                        ${cell.logo.className}
                      `}
                      draggable="false"
                    />

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default WorkHero;
