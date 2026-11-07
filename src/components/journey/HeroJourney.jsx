import Journey from './Journey';
import Connections from './Connections';
import './styles.css';
import './beam-section.css';

/**
 * Scroll experience shown directly below the home hero: a cloud fly-through
 * into the studio, then the connected-intelligence beam and data rain.
 * Ported from the standalone herosectionanimation build.
 */
export default function HeroJourney() {
  return (
    <div className="hero-journey">
      <Journey />
      <Connections />
    </div>
  );
}
