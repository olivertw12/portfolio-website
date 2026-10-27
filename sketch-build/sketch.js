/* Sketch: the little script every page shares. */

/* email buttons copy the address, and say so for a moment */
document.querySelectorAll('[data-copy]').forEach(btn => {
  const label = btn.querySelector('.mail'), text = label ? label.textContent : '';
  let t;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (e) { location.href = 'mailto:' + btn.dataset.copy; return; }
    if (label) { label.textContent = 'Email copied'; clearTimeout(t); t = setTimeout(() => { label.textContent = text; }, 1800); }
  });
});

/* resume: the focus switch swaps the sheet's content; Save PDF prints the chosen format */
document.querySelectorAll('[name="resume-focus"]').forEach(input => input.addEventListener('change', () => window.setMode?.(input.value)));
document.querySelector('[data-resume-save]')?.addEventListener('click', () => {
  const format = document.querySelector('[name="resume-format"]:checked')?.value || 'styled';
  if (window.downloadResume) window.downloadResume(format); else { document.documentElement.dataset.format = format; window.print(); }
});

/* Pause motion: stops the drawings' boil, and remembers the choice on this device */
{ const btn = document.querySelector('[data-pause]'), root = document.documentElement;
  const set = on => { root.classList.toggle('still', on); if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.textContent = on ? 'Play motion' : 'Pause motion'; } };
  let saved = false; try { saved = localStorage.getItem('still') === '1'; } catch (e) {}
  set(saved);
  btn?.addEventListener('click', () => { const on = !root.classList.contains('still'); set(on); try { localStorage.setItem('still', on ? '1' : '0'); } catch (e) {} });
}

/* practice cards: on touch screens there is no hover, so the drawing scrubs away once the card is well in view */
if (matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }), { threshold: 0.75 });
  document.querySelectorAll('.pcard').forEach(c => io.observe(c));
}

/* recent projects carousel: Previous / Next move one card; they switch off at either end */
document.querySelectorAll('.carousel').forEach(car => {
  const track = car.querySelector('.track'), btns = car.querySelectorAll('[data-car]');
  const step = () => { const li = track.querySelector('li'); return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth; };
  const update = () => { const max = track.scrollWidth - track.clientWidth - 2;
    btns.forEach(b => { b.disabled = b.dataset.car < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max; }); };
  btns.forEach(b => b.addEventListener('click', () => track.scrollBy({ left: step() * Number(b.dataset.car), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update); update();
});
