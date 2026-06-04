/**
 * StarField — shared twinkling-stars canvas renderer.
 *
 * Works in any context: Angular, plain HTML, Electron, WebView2.
 * No framework dependencies — pure vanilla JS + Canvas 2D.
 *
 * Usage:
 *   const sf = new StarField(containerEl, { count: 200 });
 *   sf.start();
 *   // later: sf.destroy();
 *
 * Effects:
 *   sf.suckTo(x, y)     — pull stars toward a focal point
 *   sf.scatter(targets)  — move stars to specific positions (array of {x,y})
 *   sf.release()         — return to normal drift
 *   sf.zoom(scale, ms)   — smooth zoom (for cloud-open transitions)
 */

// eslint-disable-next-line no-unused-vars
class StarField {
  /**
   * @param {HTMLElement} container — element to fill with stars
   * @param {object}      [opts]
   * @param {number}      [opts.count=120]         — number of stars
   * @param {number[]}    [opts.color=[180,220,240]] — base RGB
   * @param {number[]}    [opts.bloomColor=[82,193,230]] — bloom highlight RGB
   * @param {number}      [opts.canvasScale=1]     — canvas size multiplier vs container (4.5 for spatial-nav)
   * @param {number[]}    [opts.canvasOffset=[0,0]] — [left, top] fraction of canvas size to offset (0.3 = 30% of canvas width/height)
   * @param {boolean}     [opts.drift=true]        — subtle position drift
   * @param {boolean}     [opts.bloom=true]         — bloom halo on bright peaks
   * @param {boolean}     [opts.reducedMotion=false] — skip animation, render static
   */
  constructor(container, opts = {}) {
    this._container = container;
    this._count = opts.count ?? 120;
    this._color = opts.color ?? [180, 220, 240];
    this._bloomColor = opts.bloomColor ?? [82, 193, 230];
    this._canvasScale = opts.canvasScale ?? 1;
    this._canvasOffset = opts.canvasOffset ?? [0, 0];
    this._drift = opts.drift !== false;
    this._bloom = opts.bloom !== false;
    this._reducedMotion = opts.reducedMotion ?? false;

    this._canvas = null;
    this._ctx = null;
    this._stars = [];
    this._rafId = 0;
    this._W = 0;
    this._H = 0;
    this._resizeObserver = null;
    this._started = false;

    // Effect state
    this._suck = null;        // {x, y} focal point or null
    this._scatterTargets = null; // [{x,y}, ...] or null
    this._zoomScale = 1;
    this._zoomTarget = 1;
    this._zoomSpeed = 0;      // units per ms
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */

  /** Create the canvas, generate stars, and start the animation loop. */
  start() {
    if (this._started) return;
    this._started = true;

    this._canvas = document.createElement('canvas');
    this._canvas.style.cssText =
      'position:absolute;top:0;left:0;pointer-events:none;z-index:0;';
    this._container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');

    this._resize();
    this._generateStars();

    if (this._reducedMotion) {
      this._drawStatic();
    } else {
      this._rafId = requestAnimationFrame((t) => this._draw(t));
    }

    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(this._container);
  }

  /** Full cleanup — remove canvas, stop animation, disconnect observer. */
  destroy() {
    if (!this._started) return;
    this._started = false;
    cancelAnimationFrame(this._rafId);
    this._rafId = 0;
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._canvas?.remove();
    this._canvas = null;
    this._ctx = null;
    this._stars = [];
    this._suck = null;
    this._scatterTargets = null;
    this._zoomScale = 1;
    this._zoomTarget = 1;
  }

  /** Re-generate stars and resize canvas (call after container size changes externally). */
  resize() {
    this._onResize();
  }

  /* ---------- Effects ---------- */

  /** Pull all stars toward a focal point (container-relative px). */
  suckTo(x, y) {
    this._suck = { x, y };
    this._scatterTargets = null;
  }

  /** Move each star toward a target position. targets: [{x,y}, ...] */
  scatter(targets) {
    this._scatterTargets = targets;
    this._suck = null;
  }

  /** Scatter all stars to random positions within the canvas. */
  scatterRandom() {
    const targets = [];
    for (let i = 0; i < this._count; i++) {
      targets.push({ x: Math.random() * this._W, y: Math.random() * this._H });
    }
    this.scatter(targets);
  }

  /** Return to normal drift from any suck/scatter state. */
  release() {
    this._suck = null;
    this._scatterTargets = null;
  }

  /** Number of stars in this field. */
  get count() { return this._count; }

  /** Current canvas dimensions [width, height]. */
  get dimensions() { return [this._W, this._H]; }

  /** Smooth zoom (for cloud-open transitions). scale=1 is normal. */
  zoom(targetScale, durationMs = 600) {
    this._zoomTarget = targetScale;
    this._zoomSpeed = Math.abs(targetScale - this._zoomScale) / Math.max(durationMs, 1);
  }

  /* ============================================================
     PRIVATE — Canvas setup
     ============================================================ */

  _resize() {
    const cw = this._container.clientWidth || window.innerWidth;
    const ch = this._container.clientHeight || window.innerHeight;
    const s = this._canvasScale;
    this._W = Math.round(cw * s);
    this._H = Math.round(ch * s);
    this._canvas.width = this._W;
    this._canvas.height = this._H;
    this._canvas.style.width = this._W + 'px';
    this._canvas.style.height = this._H + 'px';

    // Offset positioning: canvasOffset is fraction of canvas size
    const ofsL = this._canvasOffset[0];
    const ofsT = this._canvasOffset[1];
    this._canvas.style.left = (-this._W * ofsL) + 'px';
    this._canvas.style.top = (-this._H * ofsT) + 'px';
  }

  _onResize() {
    if (!this._started) return;
    const oldW = this._W;
    const oldH = this._H;
    this._resize();
    // Rescale star positions proportionally
    if (oldW > 0 && oldH > 0) {
      const sx = this._W / oldW;
      const sy = this._H / oldH;
      for (const star of this._stars) {
        star.x *= sx;
        star.y *= sy;
      }
    }
  }

  /* ============================================================
     PRIVATE — Star generation
     ============================================================ */

  _generateStars() {
    this._stars = [];
    for (let i = 0; i < this._count; i++) {
      this._stars.push({
        x: Math.random() * this._W,
        y: Math.random() * this._H,
        size: 0.4 + Math.random() * 1.2,
        baseAlpha: 0.04 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        cycleOffset: (i / this._count) * Math.PI * 2,
        cyclePeriod: 6000 + Math.random() * 9000,
        driftPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  /* ============================================================
     PRIVATE — Animation loop
     ============================================================ */

  _draw(t) {
    if (!this._started) return;
    this._rafId = requestAnimationFrame((t2) => this._draw(t2));

    const ctx = this._ctx;
    const W = this._W;
    const H = this._H;

    // Zoom interpolation
    if (this._zoomScale !== this._zoomTarget) {
      const delta = this._zoomTarget - this._zoomScale;
      const step = this._zoomSpeed * 16; // ~16ms per frame
      if (Math.abs(delta) < step) {
        this._zoomScale = this._zoomTarget;
      } else {
        this._zoomScale += Math.sign(delta) * step;
      }
    }

    ctx.save();
    ctx.clearRect(0, 0, W, H);

    // Apply zoom around center
    if (this._zoomScale !== 1) {
      const cx = W / 2;
      const cy = H / 2;
      ctx.translate(cx, cy);
      ctx.scale(this._zoomScale, this._zoomScale);
      ctx.translate(-cx, -cy);
    }

    const [r, g, b] = this._color;
    const [br, bg, bb] = this._bloomColor;

    for (let i = 0; i < this._stars.length; i++) {
      const s = this._stars[i];

      // Position update: effect or drift
      if (this._suck) {
        s.x += (this._suck.x - s.x) * 0.08;
        s.y += (this._suck.y - s.y) * 0.08;
      } else if (this._scatterTargets && this._scatterTargets[i]) {
        s.x += (this._scatterTargets[i].x - s.x) * 0.045;
        s.y += (this._scatterTargets[i].y - s.y) * 0.045;
      } else if (this._drift) {
        s.x += Math.sin(t * 0.0001 + s.driftPhase) * 0.02;
        s.y += Math.cos(t * 0.00012 + s.driftPhase) * 0.015;
      }

      // Wrap around edges
      if (s.x < -5) s.x = W + 5;
      if (s.x > W + 5) s.x = -5;
      if (s.y < -5) s.y = H + 5;
      if (s.y > H + 5) s.y = -5;

      // Twinkle cycle: smooth sine with bright peak zone
      const cycle = Math.sin(t / s.cyclePeriod * Math.PI * 2 + s.cycleOffset);
      let alpha = s.baseAlpha;
      let size = s.size;

      // Bright phase — star flares up
      if (cycle > 0.8) {
        const intensity = (cycle - 0.8) / 0.2;
        alpha += 0.08 * intensity;
        size += 0.5 * intensity;
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      // Bloom halo on peak brightness
      if (this._bloom && cycle > 0.92) {
        const bloom = (cycle - 0.92) / 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${br},${bg},${bb},${bloom * 0.06})`;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /** Render a single static frame (for prefers-reduced-motion). */
  _drawStatic() {
    const ctx = this._ctx;
    const [r, g, b] = this._color;
    ctx.clearRect(0, 0, this._W, this._H);
    for (const s of this._stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${s.baseAlpha + 0.03})`;
      ctx.fill();
    }
  }
}

// Export for ES module consumers (Angular, bundlers)
// Falls back to global for plain <script> inclusion (installer)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StarField };
}
