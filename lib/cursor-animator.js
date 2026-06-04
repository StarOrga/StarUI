/**
 * SCC Cursor Animator — Extracted from cursor-exploration.html
 *
 * Provides animated cursor transitions for the Star Citizen Companion:
 *   - Two-layer animation: body color sweep (dark <-> bright) + gold dot overlay
 *   - Wait cursor: 8-frame quantum ring animation at 120ms intervals
 *   - Click feedback: quick flash or hold-to-gold-sweep
 *
 * Dependencies: cursor-tokens.css (provides static cursor values via CSS custom properties)
 *
 * Color constants:
 *   DK = [30, 106, 130]   — Dark RSI blue
 *   BR = [82, 193, 230]   — Bright cyan
 *   GH = [240, 208, 96]   — Gold hot
 *   GL = [184, 149, 46]   — Gold standard
 */

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function hex(n) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

// ---------------------------------------------------------------------------
// Frame generators
// ---------------------------------------------------------------------------

/**
 * Generate a sentinel arrow cursor CSS value with gradient body and optional gold dot.
 *
 * @param {number} topR,topG,topB  — Top-of-gradient color (tip of arrow)
 * @param {number} botR,botG,botB  — Bottom-of-gradient color (base of arrow)
 * @param {number} splitPct        — Gradient split point (0-100). 0 = all bottom color, 100 = all top color.
 * @param {number} glowR,glowG,glowB — Unused in static output but kept for API compat
 * @param {number} dotRadius       — Gold dot radius at arrow tip (0 = no dot)
 * @param {number} dotR,dotG,dotB  — Dot color
 * @param {number} dotGlowR        — If > 0, draw glow halo behind arrow body
 * @returns {string} CSS cursor value
 */
function makeArrow(
  topR, topG, topB,
  botR, botG, botB,
  splitPct,
  glowR, glowG, glowB,
  dotRadius = 0, dotR = 0, dotG = 0, dotB = 0, dotGlowR = 0,
  scale = 1,
) {
  const s = Math.max(0, Math.min(100, splitPct));
  const t = `%23${hex(topR)}${hex(topG)}${hex(topB)}`;
  const tM = `%23${hex(lerp(topR, botR, .5))}${hex(lerp(topG, botG, .5))}${hex(lerp(topB, botB, .5))}`;
  const b = `%23${hex(botR)}${hex(botG)}${hex(botB)}`;
  const bD = `%23${hex(Math.floor(botR * .6))}${hex(Math.floor(botG * .6))}${hex(Math.floor(botB * .6))}`;

  let dotBehind = '';
  let dotFront = '';
  if (dotRadius > 0) {
    const dc = `%23${hex(dotR)}${hex(dotG)}${hex(dotB)}`;
    const dcB = `%23${hex(Math.min(255, dotR + 40))}${hex(Math.min(255, dotG + 40))}${hex(Math.min(255, dotB + 40))}`;
    // Glow halo behind body — layered rings fading outward
    if (dotGlowR > 0) {
      dotBehind += `%3Ccircle cx='4.5' cy='3' r='${Math.min(dotRadius * 2.2, 4.5)}' fill='${dc}' opacity='.12'/%3E`;
      dotBehind += `%3Ccircle cx='4.5' cy='3' r='${Math.min(dotRadius * 1.5, 3.5)}' fill='${dc}' opacity='.25'/%3E`;
    }
    // Soft center on top
    dotFront += `%3Ccircle cx='4.5' cy='3' r='${dotRadius}' fill='${dc}' opacity='.5'/%3E`;
    dotFront += `%3Ccircle cx='4.5' cy='3' r='${dotRadius * .6}' fill='${dc}' opacity='.7'/%3E`;
    if (dotRadius > .5) {
      dotFront += `%3Ccircle cx='4.5' cy='3' r='${dotRadius * .25}' fill='${dcB}' opacity='.9'/%3E`;
    }
  }

  const P = 'M4 2 L4 26 L10 20 L15 28 L19 26 L14 18 L22 18 Z';

  // Scale the arrow body around its tip (4,2) for press-down effect; dot stays full size
  const sc = Math.abs(scale - 1) < 0.001;
  const pathOpen = sc ? '' : `%3Cg transform='translate(4,2) scale(${scale.toFixed(3)}) translate(-4,-2)'%3E`;
  const pathClose = sc ? '' : `%3C/g%3E`;

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='.15' y1='0' x2='.5' y2='1'%3E%3Cstop offset='0%25' stop-color='${t}'/%3E%3Cstop offset='${s}%25' stop-color='${s > 5 ? tM : t}'/%3E%3Cstop offset='${Math.min(100, s + 15)}%25' stop-color='${b}'/%3E%3Cstop offset='100%25' stop-color='${bD}'/%3E%3C/linearGradient%3E%3C/defs%3E${dotBehind}${pathOpen}%3Cpath d='${P}' fill='url(%23g)'/%3E${pathClose}${dotFront}%3C/svg%3E") 4 2, default`;
}

/**
 * Generate a static (non-arrow) cursor CSS value from raw SVG content.
 *
 * @param {string} svgContent — URL-encoded SVG inner content (no <svg> wrapper)
 * @param {number} hx         — Hotspot X
 * @param {number} hy         — Hotspot Y
 * @param {string} fb         — CSS fallback cursor keyword
 * @returns {string} CSS cursor value
 */
function makeStatic(svgContent, hx = 16, hy = 16, fb = 'default') {
  const cleaned = svgContent.replace(/filter='url\(%23f\)'/g, '');
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E${cleaned}%3C/svg%3E") ${hx} ${hy}, ${fb}`;
}

// ---------------------------------------------------------------------------
// Color constants
// ---------------------------------------------------------------------------

const DK = [30, 106, 130];
const BR = [82, 193, 230];
const GH = [240, 208, 96];
const GL = [184, 149, 46];

const rc = '%231e6a82';
const bc = '%2352c1e6';
const gc = '%23b8952e';

// ---------------------------------------------------------------------------
// Wait animation frames — quantum ring with orbiting particle
// ---------------------------------------------------------------------------

const WAIT_FRAME_COUNT = 8;
const WAIT_FRAME_INTERVAL_MS = 120;

/**
 * Generate all 8 wait cursor frames.
 * Each frame has a particle at a different orbital position.
 * @returns {string[]} Array of 8 CSS cursor values
 */
function generateWaitFrames() {
  const frames = [];
  for (let i = 0; i < WAIT_FRAME_COUNT; i++) {
    const angle = (i / WAIT_FRAME_COUNT) * Math.PI * 2;
    const px = 16 + Math.cos(angle) * 10;
    const py = 16 + Math.sin(angle) * 10;
    const px2 = 16 + Math.cos(angle + Math.PI) * 8;
    const py2 = 16 + Math.sin(angle + Math.PI) * 8;
    // Trail: fading dots behind main particle
    const t1a = angle - 0.4, t2a = angle - 0.8;
    const t1x = 16 + Math.cos(t1a) * 10, t1y = 16 + Math.sin(t1a) * 10;
    const t2x = 16 + Math.cos(t2a) * 10, t2y = 16 + Math.sin(t2a) * 10;

    frames.push(makeStatic(
      `%3Ccircle cx='16' cy='16' r='13' fill='%230d2635'/%3E` +
      `%3Ccircle cx='16' cy='16' r='13' fill='none' stroke='${rc}' stroke-width='.6' opacity='.4'/%3E` +
      `%3Ccircle cx='16' cy='16' r='10' fill='none' stroke='${rc}' stroke-width='.5' opacity='.3'/%3E` +
      `%3Ccircle cx='16' cy='16' r='7' fill='none' stroke='${rc}' stroke-width='.4' opacity='.2'/%3E` +
      // Trail
      `%3Ccircle cx='${t2x.toFixed(1)}' cy='${t2y.toFixed(1)}' r='.8' fill='${bc}' opacity='.2'/%3E` +
      `%3Ccircle cx='${t1x.toFixed(1)}' cy='${t1y.toFixed(1)}' r='1.2' fill='${bc}' opacity='.4'/%3E` +
      // Main particle
      `%3Ccircle cx='${px.toFixed(1)}' cy='${py.toFixed(1)}' r='2.2' fill='${bc}'/%3E` +
      `%3Ccircle cx='${px.toFixed(1)}' cy='${py.toFixed(1)}' r='1' fill='%23a0ecff'/%3E` +
      // Opposite particle
      `%3Ccircle cx='${px2.toFixed(1)}' cy='${py2.toFixed(1)}' r='1.2' fill='${rc}' opacity='.6'/%3E` +
      // Core
      `%3Ccircle cx='16' cy='16' r='3' fill='${rc}' opacity='.5'/%3E` +
      `%3Ccircle cx='16' cy='16' r='1.5' fill='${bc}' opacity='.6'/%3E` +
      `%3Ccircle cx='16' cy='16' r='.5' fill='%23a0ecff'/%3E`,
      16, 16, 'wait'
    ));
  }
  return frames;
}

const WAIT_FRAMES = generateWaitFrames();

// ---------------------------------------------------------------------------
// Wait animation controller
// ---------------------------------------------------------------------------

/** @type {Map<HTMLElement, number>} Active wait animation timer IDs */
const waitTimers = new Map();

/**
 * Start the animated wait cursor on an element.
 * Cycles through 8 quantum ring frames at 120ms intervals.
 * @param {HTMLElement} el
 */
function startWaitAnim(el) {
  if (waitTimers.has(el)) return;
  let frame = 0;
  el.style.cursor = WAIT_FRAMES[0];
  const t = setInterval(() => {
    frame = (frame + 1) % WAIT_FRAME_COUNT;
    el.style.cursor = WAIT_FRAMES[frame];
  }, WAIT_FRAME_INTERVAL_MS);
  waitTimers.set(el, t);
}

/**
 * Stop the animated wait cursor on an element.
 * @param {HTMLElement} el
 */
function stopWaitAnim(el) {
  const t = waitTimers.get(el);
  if (t) {
    clearInterval(t);
    waitTimers.delete(el);
  }
}

// ---------------------------------------------------------------------------
// Two-layer cursor animator (body sweep + gold dot)
// ---------------------------------------------------------------------------

/** Timing constants (in frames, ~35ms each) */
const FRAME_MS = 35;
const HOVER_FRAMES = 16;
const DOT_FLASH_FRAMES = 12;
const HOLD_DOT_FRAMES = 10;
const HOLD_SWEEP_FRAMES = 24;

/**
 * CursorAnimator — two-layer animation system for interactive cursors.
 *
 * Layer 1 (body): Sweeps arrow color from dark RSI blue to bright cyan on hover.
 * Layer 2 (dot): Gold dot flash on click, grow-to-sweep on hold.
 *
 * Both layers combine into a single cursor value via makeArrow() each frame.
 */
class CursorAnimator {
  constructor() {
    /** @type {HTMLElement|null} Current target element */
    this._el = null;
    /** @type {number|null} Animation interval ID */
    this._tick = null;
    // Layer 1: body
    this._bodyPct = 0;       // 0 = dark, 100 = bright
    this._bodyTarget = 0;    // Where body is animating toward
    this._bodyDone = true;
    // Layer 2: dot
    this._dotR = 0;
    this._dotGlow = 0;
    this._dotPhase = 'none'; // none | flash-in | flash-pulse | flash-out | hold-in | hold-pulse | sweep | sweep-full | release
    this._dotFrame = 0;
    this._holdPhase = 0;
    this._mdt = 0;            // mouseDown timestamp
    /** @type {boolean} Whether currently in a drag operation */
    this._isDragging = false;
    // Layer 3: press scale (arrow shrinks on mousedown, springs back on release)
    this._pressScale = 1;
    this._pressTarget = 1;
    this._pressDone = true;
  }

  /** @private Set cursor on the current element */
  _set(c) {
    if (this._el) this._el.style.cursor = c;
  }

  /** @private Set cursor on element and drag overlay if active */
  _applyToAll(c) {
    if (this._el) this._el.style.cursor = c;
    if (this._isDragging) {
      const ov = document.getElementById('drag-overlay');
      if (ov) ov.style.cursor = c;
    }
  }

  /** @private Render the current frame based on layer states */
  _render() {
    const p = this._bodyPct;
    const sc = this._pressScale;

    // During gold sweep: gold replaces body from tip
    if (this._dotPhase === 'sweep') {
      const sp = this._dotFrame / HOLD_SWEEP_FRAMES * 100;
      this._applyToAll(makeArrow(...GH, ...BR, sp, ...GL, 2.2, ...GH, 3.5, sc));
      return;
    }
    if (this._dotPhase === 'sweep-full') {
      this._applyToAll(makeArrow(...GH, ...GL, 100, ...GL, 2.2, ...GH, 5, sc));
      return;
    }
    if (this._dotPhase === 'release') {
      const rp = this._dotFrame / 20 * 100;
      if (rp < 55) {
        const sp = 100 - (rp * (100 / 55));
        this._applyToAll(makeArrow(...GH, ...BR, sp, ...GL, 2.2, ...GH, 3.5, sc));
      } else {
        const t = (rp - 55) / 45;
        this._applyToAll(makeArrow(...BR, ...DK, p, ...BR, 2.2 * (1 - t), ...GH, 3.5 * (1 - t), sc));
      }
      return;
    }

    // Normal: body sweep + optional dot overlay
    if (this._dotR > 0) {
      this._applyToAll(makeArrow(...BR, ...DK, p, ...BR, this._dotR, ...GH, this._dotGlow, sc));
    } else {
      this._applyToAll(makeArrow(...BR, ...DK, p, ...BR, 0, 0, 0, 0, 0, sc));
    }
  }

  /** @private Start the animation tick if not already running */
  _startTick() {
    if (this._tick) return;
    this._tick = setInterval(() => this._update(), FRAME_MS);
  }

  /** @private Stop the tick if both layers are idle */
  _stopIfIdle() {
    if (this._bodyDone && this._dotPhase === 'none' && this._pressDone) {
      clearInterval(this._tick);
      this._tick = null;
    }
  }

  /** @private Main update loop — advances both layers one frame */
  _update() {
    // Update body layer
    if (!this._bodyDone) {
      const speed = 100 / HOVER_FRAMES;
      if (this._bodyPct < this._bodyTarget) {
        this._bodyPct = Math.min(this._bodyTarget, this._bodyPct + speed);
      } else {
        this._bodyPct = Math.max(this._bodyTarget, this._bodyPct - speed);
      }
      if (Math.abs(this._bodyPct - this._bodyTarget) < 1) {
        this._bodyPct = this._bodyTarget;
        this._bodyDone = true;
      }
    }

    // Update press scale layer (arrow shrinks on press, springs back on release)
    if (!this._pressDone) {
      const pressSpeed = 0.04;
      if (this._pressScale < this._pressTarget) {
        this._pressScale = Math.min(this._pressTarget, this._pressScale + pressSpeed);
      } else {
        this._pressScale = Math.max(this._pressTarget, this._pressScale - pressSpeed);
      }
      if (Math.abs(this._pressScale - this._pressTarget) < 0.005) {
        this._pressScale = this._pressTarget;
        this._pressDone = true;
      }
    }

    // Update dot layer
    if (this._dotPhase === 'flash-in') {
      this._dotFrame++;
      const p = this._dotFrame / 5;
      this._dotR = Math.min(3.2, 3.2 * p);
      this._dotGlow = Math.min(3.5, 3.5 * p);
      if (this._dotFrame >= 5) { this._dotPhase = 'flash-pulse'; this._dotFrame = 0; }
    } else if (this._dotPhase === 'flash-pulse') {
      this._dotFrame++;
      const t = this._dotFrame / 5;
      this._dotR = 3.2 + .4 * Math.sin(t * Math.PI * 2);
      if (this._dotFrame >= 5) { this._dotPhase = 'flash-out'; this._dotFrame = 0; }
    } else if (this._dotPhase === 'flash-out') {
      this._dotFrame++;
      const p = 1 - this._dotFrame / 5;
      this._dotR = 3.2 * Math.max(0, p);
      this._dotGlow = 3.5 * Math.max(0, p);
      if (this._dotFrame >= 5) { this._dotR = 0; this._dotGlow = 0; this._dotPhase = 'none'; }
    } else if (this._dotPhase === 'hold-in') {
      this._dotFrame++;
      const p = this._dotFrame / HOLD_DOT_FRAMES;
      this._dotR = Math.min(2.2, 2.2 * p);
      this._dotGlow = Math.min(3.5, 3.5 * p);
      if (this._dotFrame >= HOLD_DOT_FRAMES) {
        if (this._isDragging) {
          this._dotPhase = 'sweep'; this._dotFrame = 0;
          if (this._el) this._el.classList.add('scc-active');
        } else {
          this._dotPhase = 'hold-pulse'; this._dotFrame = 0;
        }
      }
    } else if (this._dotPhase === 'hold-pulse') {
      this._dotFrame++;
      const t = this._dotFrame / 8;
      this._dotR = 2.2 + .2 * Math.sin(t * Math.PI);
      this._dotGlow = 3.5;
      if (this._dotFrame >= 8) this._dotFrame = 0; // loop pulse
    } else if (this._dotPhase === 'sweep') {
      this._dotFrame++;
      if (this._dotFrame >= HOLD_SWEEP_FRAMES) { this._dotPhase = 'sweep-full'; }
    } else if (this._dotPhase === 'release') {
      this._dotFrame++;
      if (this._dotFrame >= 20) {
        this._dotR = 0; this._dotGlow = 0; this._dotPhase = 'none';
      }
    }

    this._render();
    this._stopIfIdle();
  }

  /**
   * Trigger hover-in animation: sweep body from dark to bright.
   * @param {HTMLElement} el
   */
  hoverIn(el) {
    this._el = el;
    this._bodyTarget = 100;
    this._bodyDone = false;
    this._startTick();
  }

  /**
   * Trigger hover-out animation: sweep body from bright to dark, cancel dot.
   * @param {HTMLElement} el
   */
  hoverOut(el) {
    this._el = el;
    this._bodyTarget = 0;
    this._bodyDone = false;
    this._dotR = 0; this._dotGlow = 0; this._dotPhase = 'none'; this._dotFrame = 0;
    // Reset press scale immediately on hover-out
    this._pressScale = 1; this._pressTarget = 1; this._pressDone = true;
    this._startTick();
  }

  /**
   * Trigger mousedown: snap body to bright, begin gold dot grow.
   * @param {HTMLElement} el
   * @param {boolean} isDrag — If true, will sweep to full gold on hold
   */
  mouseDown(el, isDrag = false) {
    this._el = el;
    this._mdt = Date.now();
    this._holdPhase = 0;
    this._isDragging = isDrag;
    // Snap body to bright immediately
    this._bodyPct = 100; this._bodyTarget = 100; this._bodyDone = true;
    this._dotPhase = 'hold-in'; this._dotFrame = 0;
    // Press-down: shrink the arrow body (gold dot stays full size)
    this._pressTarget = 0.82; this._pressDone = false;
    this._startTick();
  }

  /**
   * Trigger mouseup: flash or reverse sweep depending on hold duration.
   * @param {HTMLElement} el
   */
  mouseUp(el) {
    const d = Date.now() - this._mdt;
    this._el = el;
    // Release: spring arrow back to full size
    this._pressTarget = 1; this._pressDone = false;
    if (this._isDragging) {
      const ov = document.getElementById('drag-overlay');
      if (ov) { ov.style.display = 'none'; ov.style.cursor = ''; }
    }
    this._isDragging = false;
    if (this._el) this._el.classList.remove('scc-active');

    if (this._dotPhase === 'hold-pulse') {
      // Was holding non-drag: fade dot out
      this._dotPhase = 'flash-out'; this._dotFrame = 0;
    } else if (this._dotPhase === 'hold-in' || d < 350) {
      // Quick click — flash
      this._dotPhase = 'flash-in'; this._dotFrame = 0;
    } else if (this._dotPhase === 'sweep' || this._dotPhase === 'sweep-full') {
      // Was held — reverse
      this._dotPhase = 'release'; this._dotFrame = 0;
    } else {
      this._dotR = 0; this._dotGlow = 0; this._dotPhase = 'none';
    }
    this._startTick();
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  // Frame generators
  makeArrow,
  makeStatic,
  generateWaitFrames,
  // Wait animation
  WAIT_FRAMES,
  WAIT_FRAME_COUNT,
  WAIT_FRAME_INTERVAL_MS,
  startWaitAnim,
  stopWaitAnim,
  // Interactive animator
  CursorAnimator,
  // Timing constants
  FRAME_MS,
  HOVER_FRAMES,
  DOT_FLASH_FRAMES,
  HOLD_DOT_FRAMES,
  HOLD_SWEEP_FRAMES,
  // Color constants
  DK, BR, GH, GL,
};
