/* The "closer to real life" look, tried on the homepage only. drift.js stays the single source: the builder applies these
   swaps to a copy and writes drift-real.js, used by index-real.html. Delete this file's two outputs to drop the experiment. */
exports.swaps = [
  /* water: a little less pure blue, the way real sea water leans green near the surface */
  ['vec3 top=mix(vec3(.10,.50,.86),', 'vec3 top=mix(vec3(.085,.47,.78),'],
  ['vec3 bot=mix(vec3(.012,.14,.40),', 'vec3 bot=mix(vec3(.012,.13,.355),'],
  /* sun shafts: softer shoulders, fine streaks inside each one, broken along their length, greener near the surface, with lit dust */
  ['r=smoothstep(.42,.86,r);float fall=exp(-length(dir)*1.25)*2.4;',
   'float len=length(dir);r=smoothstep(.36,.9,r);r*=.8+.2*noise(vec2(a*90.+t*.22,5.));r*=.7+.3*noise(vec2(a*5.,len*2.2-t*.05));float fall=exp(-len*1.25)*2.5;float dust=noise(p*vec2(38.,26.)+vec2(t*.05,-t*.03));vec3 rayC=mix(vec3(.34,.74,.93),vec3(.2,.52,1.),smoothstep(.2,1.4,len));float ab=atan(bp.x-src.x,-(bp.y-src.y));r*=1.-.75*smoothstep(.3,.1,abs(a-ab))*smoothstep(0.,.06,bp.y-p.y)*exp(-max(bp.y-p.y,0.)*.9);'],
  ['col+=vec3(.25,.62,1.)*r*fall*mix(.9,.34,smoothstep(0.,.6,d))', 'col+=rayC*r*fall*(.88+.24*dust)*mix(.9,.34,smoothstep(0.,.6,d))'],
  /* sand: soft grain laid on the ground (so it shrinks with distance), warmer patches, uneven ripples; nothing square */
  ['vec3 s=vec3(.2,.255,.33)*(.76+.34*m+.12*m2);',
   'float near=exp(-z*.9);float gr=noise(g*vec2(60.,90.))*.5+noise(g*vec2(140.,210.)+3.)*.5;vec3 s=mix(vec3(.2,.255,.33),vec3(.255,.262,.295),.4+.45*m2)*(.74+.32*m+.1*m2)*(1.+(gr-.5)*.42*near);'],
  ['float ph=z*22.+sin(g.x*1.5+m*2.)*1.5+m*3.;', 'float ph=z*22.+sin(g.x*1.5+m*2.)*1.5+m*3.+noise(g*vec2(3.,1.2)+4.)*2.4;'],
  ['s+=(hash(floor(uv*uRes/1.5))-.5)*.04*fog;', ''],
  /* glass: clean and clear through the middle so the water shows through undistorted, bending light only toward the edges, thin bright rims, a tight highlight, and a mirror of the bright surface at glancing angles */
  ['*(.05+.05*f)*uBend;', '*(.06+.075*f)*uBend;'],
  ['c=mix(c,vec3(.62,.84,1.)*(.86+.14*smoothstep(-1.,1.,n.y)),uBody*(.62+.38*smoothstep(0.,.3,f)));', 'c=mix(c,vec3(.6,.86,.97)*(.86+.14*smoothstep(-1.,1.,n.y)),uBody*(.16+.4*smoothstep(.3,.8,f)));'],
  ['c=mix(c,vec3(.84,.96,1.),smoothstep(.05,.45,f)*.86);', 'c=mix(c,vec3(.86,.985,.98),smoothstep(.42,.86,f)*.74);'],
  ['c+=pow(max(dot(R,L),0.),34.)*.95+', 'c+=vec3(.5,.84,1.)*pow(f,3.5)*smoothstep(-.2,.8,R.y)*.6*(.4+.6*uSun);c+=pow(max(dot(R,L),0.),140.)*.9;c+=pow(max(dot(R,L),0.),34.)*.7+'],
  /* the boat the chain comes down from: the underside of a hull resting on the surface, seen from below, dim against the bright water and cutting the sun shafts beneath it */
  ['uniform float uDark,uBed,uTime;', 'uniform float uDark,uBed,uTime,uSand;uniform vec2 uBoat;'],
  ['uShadow: { value: new THREE.Vector3(.5, 0, 0) },', 'uShadow: { value: new THREE.Vector3(.5, 0, 0) }, uBoat: { value: new THREE.Vector2(.9, 0) }, uSand: SAND,'],
  ['function makeWater(DPR){', 'const SAND = { value: .2 };   /* how high the seabed stands in the last screen, as a share of its height */\nfunction makeWater(DPR){'],
  ['vec2 src=vec2(-.25+uPtr.x*.12,1.25);', 'vec2 bp=vec2((uBoat.x-.5)*asp+.02,.5+uBoat.y);vec2 hq=(p-bp)/vec2(.44,.12);float hull=smoothstep(0.,.22,1.-hq.x*hq.x-abs(hq.y)-.1*hq.x)*step(abs(hq.x),1.);float keel=smoothstep(.0,.9,-hq.y);col=mix(col,mix(vec3(.015,.07,.17),vec3(.03,.15,.3),keel),hull*.8*(1.-smoothstep(.02,.16,d)));col*=1.-.22*smoothstep(1.7,.3,length((p-bp)/vec2(.5,.17)))*(1.-smoothstep(0.,.14,d));vec2 src=vec2(-.25+uPtr.x*.12,1.25);'],
  ['water.mat.uniforms.uCrater.value.copy(G.uCrater.value);', 'water.mat.uniforms.uCrater.value.copy(G.uCrater.value); water.mat.uniforms.uBoat.value.set((railX - heroShift) / vw, cur / vh);   /* it stays on the surface, so it leaves the frame with the page */'],
  /* the seabed rises to meet the closing heading: the heading stands on the sand beside the anchor, and everything under it, footer included, sits in the sand */
  ['float bed=uBed;float dune=(.2+', 'float bed=uBed;float dune=(uSand+'],
  ['uniform float uTime,uSun,uBody,uBend,uClip,uBed;uniform vec3 uCrater;${NOISE}\n      vec3 S(', 'uniform float uTime,uSun,uBody,uBend,uClip,uBed,uSand;uniform vec3 uCrater;${NOISE}\n      vec3 S('],
  ['float dune=(.2+.035*sin(gx*2.3+1.2)', 'float dune=(uSand+.035*sin(gx*2.3+1.2)'],
  ['uCrater: { value: new THREE.Vector3(.5, .1, 0) } };\n  const blit', 'uCrater: { value: new THREE.Vector3(.5, .1, 0) }, uSand: SAND };\n  const blit'],
  ['return V.vh * (1 - ((.2 + .035 * Math.sin(q * 2.3 + 1.2)', 'return V.vh * (1 - ((SAND.value + .035 * Math.sin(q * 2.3 + 1.2)'],
  ["measureFns.push(() => { const r = document.getElementById('rail').getBoundingClientRect(); railX = r.left + r.width / 2; });",
   "measureFns.push(() => { const r = document.getElementById('rail').getBoundingClientRect(); railX = r.left + r.width / 2; const h = document.querySelector('.floor:not(.sub) h2'); if (h) { const b = boxOf(h), q = (b.x / V.vw - .5) * V.vw / V.vh, fs = parseFloat(getComputedStyle(h).fontSize); SAND.value = Math.max(.2, Math.min(.6, (V.docH - (b.y + b.h / 2) + fs * .1) / V.vh - .035 * Math.sin(q * 2.3 + 1.2) - .012 * Math.sin(q * 7.1))); } });"],
  /* the anchor opens in a fixed proportion to the name (1.4 times the height of the two lines) on any screen. Where there is room beside the name its middle sits on the middle of the name; on a narrow screen it hangs just above it */
  ['size = full / 21.6 * (1 - mid * (wide ? .4 : .2))', 'top = 1 - ss(.02, .14, p), size = lerp(full / 21.6 * (1 - mid * (wide ? .4 : .2)), hero.h ? hero.h * 1.4 / 24 : full / 21.6 * .72, top), beside = vw - hero.ink - 24 >= size * 19.5'],
  ['const ringY = lerp(Math.max(vh * (wide ? .3 : .24) - cur,', 'const ringY = lerp(Math.max((!hero.h ? vh * .24 : beside ? hero.mid - size * 8.2 : hero.top - 14 - size * 20.2) - cur,'],
  ['sim.step(Math.max(dt, .001), { tx: railX - end * size * 4,', 'sim.step(Math.max(dt, .001), { tx: railX - end * size * 4 - (heroShift = top * Math.max(0, size * 10.8 + (wide ? railGap : 10) - (vw - railX))),'],
  ["railX = r.left + r.width / 2; const h = document.querySelector('.floor:not(.sub) h2');", "railX = r.left + r.width / 2; railGap = V.vw - r.right; const h1 = document.querySelector('.hero h1'); if (h1) { const b = boxOf(h1); hero.h = b.h; hero.mid = b.y; hero.top = b.y - b.h / 2; hero.ink = 0; h1.querySelectorAll('.ln').forEach(l => { const g = document.createRange(); g.selectNodeContents(l); hero.ink = Math.max(hero.ink, g.getBoundingClientRect().right); }); } const h = document.querySelector('.floor:not(.sub) h2');"],
  ['let railX = 0, shade = 0,', 'const hero = { h: 0, mid: 0, top: 0, ink: 0 }; let heroShift = 0, railGap = 30, railX = 0, shade = 0,'],
  /* the anchor can be picked up: press on it and it follows the pointer by its ring, the chain paying out or going slack as needed; let go and it swings back and is hauled in */
  ['px[i] = x[i]; py[i] = y[i]; x[i] += vx + ax * h * h; y[i] += vy + ay * h * h;', 'px[i] = x[i]; py[i] = y[i]; x[i] += vx + ax * h * h; y[i] += vy + ay * h * h; if (o.grab && i === N) { x[i] = px[i] + (o.grab.x - px[i]) * Math.min(1, h * 40); y[i] = py[i] + (o.grab.y - py[i]) * Math.min(1, h * 40); }'],
  ['const df = (d - rest) / d, ws = w[i] + w[b]; if (!ws) continue; const a = df * w[i] / ws, c = df * w[b] / ws;', 'const wi = o.grab && i === N ? 0 : w[i], wb = o.grab && b === N ? 0 : w[b], df = (d - rest) / d, ws = wi + wb; if (!ws) continue; const a = df * wi / ws, c = df * wb / ws;'],
  ['if (!sim.ready || !Lnow) Lnow = want; else Lnow += Math.max(-1500 * dt, Math.min(1500 * dt, want - Lnow)); const L = Lnow;',
   'if (hold.on) want = Math.max(want, Math.hypot(hold.x - sim.x[0], hold.y - sim.y[0]) * 1.03 + 4); const reel = hold.on ? 9000 : 1500; if (!sim.ready || !Lnow) Lnow = want; else Lnow += Math.max(-(V.time < hold.until ? 380 : 1500) * dt, Math.min(reel * dt, want - Lnow)); const L = Lnow;'],
  ['push: ptr.seen ? { x: ptr.x, y: ptr.y, vx: ptr.vx, vy: ptr.vy, r: 150 } : null });', 'grab: hold.on ? hold : null, push: ptr.seen && !hold.on ? { x: ptr.x, y: ptr.y, vx: ptr.vx, vy: ptr.vy, r: 150 } : null });'],
  ['  function updateAnchor(){', `  const hold = { on: false, x: 0, y: 0, dx: 0, dy: 0, moved: 0, until: 0 };
  { const near = (px, py) => { if (!sim.ready) return false; const N = sim.N, ax = sim.x[N], ay = sim.y[N], bx = sim.x[N + 1] - ax, by = sim.y[N + 1] - ay, l = bx * bx + by * by || 1, t = Math.max(-.2, Math.min(1.05, ((px - ax) * bx + (py - ay) * by) / l)); return Math.hypot(px - ax - bx * t, py - ay - by * t) < Math.sqrt(l) * .58; };
    addEventListener('pointerdown', e => { if (e.button || !near(e.clientX, e.clientY)) return; hold.on = true; hold.moved = 0; hold.dx = sim.x[sim.N] - e.clientX; hold.dy = sim.y[sim.N] - e.clientY; hold.x = sim.x[sim.N]; hold.y = sim.y[sim.N]; root.style.cursor = 'grabbing'; root.style.userSelect = 'none'; e.preventDefault(); }, { capture: true });
    addEventListener('pointermove', e => { if (hold.on) { hold.moved += Math.abs(e.movementX) + Math.abs(e.movementY); hold.x = e.clientX + hold.dx; hold.y = Math.min(e.clientY + hold.dy, V.vh + 40); } else root.style.cursor = near(e.clientX, e.clientY) ? 'grab' : ''; });
    const drop = () => { if (!hold.on) return; hold.on = false; hold.until = V.time + 4;   /* hauled back in gently, so it swings home instead of being snatched */ root.style.cursor = ''; root.style.userSelect = ''; }; addEventListener('pointerup', drop); addEventListener('pointercancel', drop); addEventListener('blur', drop);
    addEventListener('touchmove', e => { if (hold.on) e.preventDefault(); }, { passive: false });                          /* a finger holding the anchor moves the anchor, not the page */
    addEventListener('click', e => { if (hold.moved > 6) { e.preventDefault(); e.stopPropagation(); } hold.moved = 0; }, { capture: true }); }
  function updateAnchor(){`],
  /* on a narrow screen the anchor hangs above the name, so it may sit higher than usual */
  ['size * 20.2) - cur, vh * (.2 + .3 * p))', 'size * 20.2) - cur, vh * ((hero.h && !beside ? .06 : .2) + .3 * p))'],
];
/* page-level touches for this look: a lighter shadow under the top links, and the closing section laid out so its heading meets the sand */
exports.append = `
{ const st = document.createElement('style'); st.textContent = '.bar nav a{text-shadow:0 1px 5px rgba(4,32,74,.4)}.floor:not(.sub){padding-bottom:var(--s3)}.floor:not(.sub) p{margin-top:var(--s3);text-shadow:0 1px 8px rgba(2,10,26,.8)}.foot{text-shadow:0 1px 8px rgba(2,10,26,.8)}'; document.head.append(st); dispatchEvent(new Event('resize')); }
`;
