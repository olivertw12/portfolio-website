/* Sketch: the little script every page shares. */

/* Case-study gallery: original-size images, scoped to this project's artwork.
   The links still open the image directly when JavaScript is unavailable. */
(() => {
  const links = [...document.querySelectorAll('[data-gallery-image]')];
  if (!links.length) return;
  const dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-labelledby', 'image-viewer-title');
  dialog.setAttribute('aria-describedby', 'image-viewer-help');
  dialog.innerHTML = `
    <h2 class="sr" id="image-viewer-title">Project image viewer</h2>
    <p class="sr" id="image-viewer-help">Use the left and right arrow keys to browse images. Press Escape to close.</p>
    <div class="viewer-toolbar">
      <span class="viewer-count" aria-live="polite" aria-atomic="true"></span>
      <a class="viewer-original" target="_blank" rel="noopener">Open image <span aria-hidden="true">↗</span></a>
      <button type="button" class="viewer-control viewer-close" aria-label="Close image viewer" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    </div>
    <div class="viewer-stage">
      <button type="button" class="viewer-control viewer-prev" aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
      <div class="viewer-canvas"><img class="viewer-image" alt=""><p class="viewer-message" role="status"></p></div>
      <button type="button" class="viewer-control viewer-next" aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
    </div>
    <p class="viewer-caption"></p>`;
  document.body.append(dialog);
  const image = dialog.querySelector('.viewer-image'), count = dialog.querySelector('.viewer-count');
  const caption = dialog.querySelector('.viewer-caption'), original = dialog.querySelector('.viewer-original');
  const stage = dialog.querySelector('.viewer-stage'), message = dialog.querySelector('.viewer-message');
  const prev = dialog.querySelector('.viewer-prev'), next = dialog.querySelector('.viewer-next');
  const close = dialog.querySelector('.viewer-close');
  let current = 0, opener, touchStart;
  prev.hidden = next.hidden = links.length < 2;

  const render = index => {
    current = (index + links.length) % links.length;
    const item = links[current], description = item.dataset.caption || 'Project image';
    image.hidden = true;
    message.hidden = false;
    message.textContent = 'Loading image…';
    stage.setAttribute('aria-busy', 'true');
    count.textContent = `${current + 1} / ${links.length}`;
    caption.textContent = description;
    image.alt = description;
    original.href = item.href;
    image.src = item.href;
  };
  image.addEventListener('load', () => {
    image.hidden = false;
    message.hidden = true;
    stage.setAttribute('aria-busy', 'false');
  });
  image.addEventListener('error', () => {
    message.textContent = 'This image could not be loaded. Try the Open image link above.';
    stage.setAttribute('aria-busy', 'false');
  });
  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      render(index);
      dialog.showModal();
      document.documentElement.classList.add('image-viewer-open');
    });
  });
  prev.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-viewer-open');
    touchStart = null;
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not([hidden]), a[href]')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      render(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  stage.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x, dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (links.length > 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      event.preventDefault();
      render(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: false });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
})();

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
