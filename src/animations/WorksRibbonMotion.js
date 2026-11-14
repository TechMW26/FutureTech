export const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const interval = (value, start, end) => clamp01((value - start) / (end - start));
export const smooth = (value) => value * value * value * (value * (value * 6 - 15) + 10);
const mix = (a, b, t) => a + (b - a) * t;
const radians = (degrees) => degrees * Math.PI / 180;
const TAU = Math.PI * 2;
const RIBBON_TURNS = .45;

export function projectFocus(progress, count = 8) {
  const focus = smooth(interval(progress, .36, .48));
  const position = interval(progress, .50, .985) * Math.max(0, count - 1);
  const whole = Math.floor(position), fraction = position - whole;
  const step = whole + smooth(interval(fraction, .08, .96));
  const index = Math.min(count - 1, Math.round(step));
  const distance = Math.abs(step - index);
  return { focus, step, index, reveal: smooth(interval(progress, .415, .49)), textOpacity: 1 - smooth(interval(distance, .08, .44)) };
}


export function ribbonScene(progress, width, height, count = 8, miniSpin = 0, focusFrame = null) {
  const p = clamp01(progress);
  const compact = width <= 1024;
  const shortLandscape = compact && width > height && height <= 620;
  // Preserve the entrance's scroll distance while reserving room to read each project.
  const intro = Math.min(.54, p / .36 * .54);
  const enter = smooth(interval(intro, .035, .29));
  const travel = smooth(interval(intro, .1, .54));
  const settle = smooth(interval(intro, .42, .54));
  const radius = Math.min(width * (width <= 768 ? .61 : .37), height * .74);
  const spacing = TAU / count, arc = spacing * .965;
  const grow = smooth(interval(p, 0, .16));
  const miniRadius = compact
    ? Math.min(width * .55, height * (shortLandscape ? .46 : .29), 345)
    : Math.min(178, width * .152, height * .27) * 1.4;
  const openingX = shortLandscape ? width * .22 : 0;
  const openingCenterY = compact ? height * .075 : height * -.03;
  const originalY = mix(height * 1.12, height * .04, enter);
  const launchY = mix(height * 1.12, height * .04, smooth(interval(.16 / .36 * .54, .035, .29)));
  const excessY = Math.max(0, originalY - launchY);
  const openingY = launchY + excessY / (1 + excessY / (height * .06));
  const focused = projectFocus(p, count);
  const focusArc = spacing * .91;
  // The compact layout measures the artwork slot beside or above the copy.
  const focusWidth = focusFrame?.width ?? Math.min(width * .64, height * .40 / .68);
  const focusHeight = focusFrame?.height ?? focusWidth * .68;
  const focusRadius = focusWidth / (2 * Math.sin(focusArc / 2));
  const focusX = focusFrame ? focusFrame.x - width / 2 : -width * .23;
  const focusY = focusFrame ? focusFrame.y - height / 2 : height * .04;
  const endBase = .7 - TAU * RIBBON_TURNS - (count - 1) / 2 * spacing;
  const alignedBase = Math.round(endBase / TAU) * TAU;
  return {
    progress: p, width, height, count, radius, arc, spacing,
    phase: .7 - travel * TAU * RIBBON_TURNS + miniSpin * (1 - grow),
    pitch: mix(radians(-14), radians(-12 + Math.sin(travel * Math.PI * 2) * 5), grow),
    roll: mix(radians(-4), radians(-24 + Math.sin(travel * Math.PI) * 43), grow),
    centerX: mix(openingX, mix(-width * .16, 0, enter), grow),
    centerY: p < .16 ? mix(openingCenterY, openingY, grow) : originalY,
    opacity: 1,
    wave: Math.min(width * .012, height * .022), perspective: Math.max(700, width * 1.15),
    scale: mix(miniRadius / radius, mix(.38, 1.12, enter) * mix(1, .64, settle), grow), depth: mix(1, 1.1, grow), mini: 1 - grow,
    focus: focused.focus, activeIndex: focused.index,
    focusRadius, focusArc, focusWidth, focusHeight,
    focusX, focusY,
    focusBase: alignedBase - focused.step * spacing, focusDepth: .65,
  };
}

function rotate(x, y, z, pitch, roll) {
  const py = y * Math.cos(pitch) - z * Math.sin(pitch);
  const pz = y * Math.sin(pitch) + z * Math.cos(pitch);
  return { x: x * Math.cos(roll) - py * Math.sin(roll), y: x * Math.sin(roll) + py * Math.cos(roll), z: pz };
}

export function cardAngle(scene, index) {
  const original = (index - (scene.count - 1) / 2) * scene.spacing + scene.phase;
  return mix(original, index * scene.spacing + scene.focusBase, scene.focus);
}

// The same circular surface stays intact through the whole experience. It moves
// into the left viewport, then rotates one project at a time rather than unbending.
export function ribbonPoint(scene, index, u, v) {
  const f = scene.focus, theta = cardAngle(scene, index);
  const radius = mix(scene.radius * scene.scale, scene.focusRadius, f);
  const arc = mix(scene.arc, scene.focusArc, f), angle = theta + (u - .5) * arc;
  const depth = mix(scene.depth, scene.focusDepth, f);
  const point = rotate(radius * Math.sin(angle),
    (v - .5) * mix(scene.radius * scene.arc * scene.scale * .68, scene.focusHeight, f) + Math.sin(angle * 2 + scene.phase * .2) * scene.wave * scene.scale * (1 - f) * (1 - scene.mini),
    radius * Math.cos(angle) * depth, scene.pitch * (1 - f), scene.roll * (1 - f));
  // Account for perspective so the front-most project's center stays on its mark.
  const centerX = mix(scene.centerX, scene.focusX, f);
  const centerY = mix(scene.centerY, scene.focusY, f);
  const shiftZ = -radius * depth * f;
  const projectionAnchor = 1 - (point.z + shiftZ) / scene.perspective;
  return {
    x: point.x + centerX * mix(1, projectionAnchor, f),
    y: point.y + centerY * mix(1, projectionAnchor, f),
    z: point.z + shiftZ,
    shade: .94 + .06 * Math.abs(Math.cos(angle)),
  };
}

export function ribbonCardOpacity(scene, index) {
  const angle = Math.abs(Math.atan2(Math.sin(cardAngle(scene, index)), Math.cos(cardAngle(scene, index))));
  const focusedOpacity = 1 - smooth(interval(angle, scene.spacing * .30, scene.spacing * .61));
  return scene.opacity * mix(1, focusedOpacity, scene.focus);
}

export function ribbonClip(scene) {
  const centerX = scene.width / 2 + scene.focusX, centerY = scene.height / 2 + scene.focusY;
  const compact = scene.width <= 1024;
  const halfWidth = scene.focusWidth * .62;
  const halfHeight = scene.focusHeight * (compact ? .56 : .76);
  return {
    left: mix(0, Math.max(0, centerX - halfWidth), scene.focus),
    right: mix(scene.width, Math.min(scene.width, centerX + halfWidth), scene.focus),
    top: mix(0, Math.max(compact ? 0 : 85, centerY - halfHeight), scene.focus),
    bottom: mix(scene.height, Math.min(scene.height, centerY + halfHeight), scene.focus),
  };
}

export function projectRibbonPoint(point, scene) {
  const scale = 1 / (1 - point.z / scene.perspective);
  return { x: scene.width / 2 + point.x * scale, y: scene.height / 2 + point.y * scale, z: point.z };
}






