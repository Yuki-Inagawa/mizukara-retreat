// Campfire particle system - vanilla canvas
// Renders flames + glowing embers + smoke + drifting sparks
(function () {
  function init(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d');
    let DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let running = true;

    const palette = opts.palette || {
      core: 'rgba(255, 230, 160, 1)',
      mid: 'rgba(255, 140, 40, 1)',
      outer: 'rgba(200, 60, 20, 1)',
      ember: 'rgba(255, 180, 90, 1)',
      smoke: 'rgba(40, 30, 24, 1)',
    };

    const flames = [];
    const embers = [];
    const sparks = [];
    const smokes = [];

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // origin: bottom center, slightly above bottom
    function origin() {
      return { x: W * 0.5, y: H * 0.78 };
    }

    function spawnFlame() {
      const o = origin();
      const spread = W * 0.08;
      flames.push({
        x: o.x + (Math.random() - 0.5) * spread,
        y: o.y + (Math.random() - 0.2) * 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.8 - Math.random() * 1.2,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        r: 30 + Math.random() * 50,
        hueShift: Math.random(),
      });
    }

    function spawnEmber() {
      const o = origin();
      embers.push({
        x: o.x + (Math.random() - 0.5) * W * 0.05,
        y: o.y + 4 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.6,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        r: 1 + Math.random() * 2.5,
      });
    }

    function spawnSpark() {
      const o = origin();
      sparks.push({
        x: o.x + (Math.random() - 0.5) * W * 0.1,
        y: o.y - 30 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -1.4 - Math.random() * 1.4,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        r: 0.6 + Math.random() * 1.0,
        flicker: Math.random() * Math.PI * 2,
      });
    }

    function spawnSmoke() {
      const o = origin();
      smokes.push({
        x: o.x + (Math.random() - 0.5) * W * 0.08,
        y: o.y - 60 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.25 - Math.random() * 0.25,
        life: 0,
        maxLife: 220 + Math.random() * 160,
        r: 30 + Math.random() * 40,
      });
    }

    let frame = 0;
    function step() {
      if (!running) return;
      frame++;

      // Spawn rates
      for (let i = 0; i < 3; i++) spawnFlame();
      if (frame % 2 === 0) spawnEmber();
      if (frame % 4 === 0) spawnSpark();
      if (frame % 3 === 0) spawnSmoke();

      // Draw background fade with warm vignette - already on transparent canvas.
      ctx.clearRect(0, 0, W, H);

      // Glow base under fire
      const o = origin();
      const glow = ctx.createRadialGradient(o.x, o.y - 10, 0, o.x, o.y - 10, W * 0.45);
      glow.addColorStop(0, 'rgba(255, 130, 50, 0.55)');
      glow.addColorStop(0.3, 'rgba(220, 80, 30, 0.25)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Smokes (drawn under flames in normal mode)
      ctx.globalCompositeOperation = 'source-over';
      for (let i = smokes.length - 1; i >= 0; i--) {
        const s = smokes[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vx += (Math.random() - 0.5) * 0.02;
        const t = s.life / s.maxLife;
        const a = (1 - t) * 0.18 * Math.min(1, t * 4);
        const r = s.r * (1 + t * 1.6);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        g.addColorStop(0, `rgba(60, 50, 42, ${a})`);
        g.addColorStop(1, 'rgba(40, 30, 24, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (s.life > s.maxLife) smokes.splice(i, 1);
      }

      // Flames
      ctx.globalCompositeOperation = 'lighter';
      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.life++;
        f.x += f.vx;
        f.y += f.vy;
        f.vy *= 0.992;
        f.vx += (Math.random() - 0.5) * 0.06;
        const t = f.life / f.maxLife;
        const a = (1 - t) * 0.5;
        const r = f.r * (1 - t * 0.5);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        if (t < 0.3) {
          g.addColorStop(0, `rgba(255, 240, 200, ${a})`);
          g.addColorStop(0.4, `rgba(255, 170, 60, ${a * 0.8})`);
        } else {
          g.addColorStop(0, `rgba(255, 180, 80, ${a * 0.7})`);
          g.addColorStop(0.4, `rgba(220, 80, 30, ${a * 0.6})`);
        }
        g.addColorStop(1, 'rgba(120, 30, 10, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (f.life > f.maxLife) flames.splice(i, 1);
      }

      // Embers (bright cores)
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        const t = e.life / e.maxLife;
        const a = (1 - t);
        ctx.fillStyle = `rgba(255, 220, 140, ${a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        if (e.life > e.maxLife) embers.splice(i, 1);
      }

      // Sparks - bright dots that drift up high
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx + Math.sin(s.life * 0.05 + s.flicker) * 0.3;
        s.y += s.vy;
        s.vy *= 0.995;
        const t = s.life / s.maxLife;
        const a = Math.max(0, (1 - t)) * (0.6 + Math.sin(s.life * 0.3 + s.flicker) * 0.4);
        ctx.fillStyle = `rgba(255, 200, 110, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.life > s.maxLife || s.y < -10) sparks.splice(i, 1);
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    return {
      stop() { running = false; },
      setPalette(p) { Object.assign(palette, p); },
    };
  }

  window.Campfire = { init };
})();
