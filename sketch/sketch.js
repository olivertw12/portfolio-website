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
