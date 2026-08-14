/* ============================================================
   lightbox.js — full-screen image viewer for case studies.
   Loaded by project.html and by every generated page under /projects/.
   Call initLightbox(images) with [{src, caption}, ...] in gallery order;
   the figures call openLightbox(index) from their onclick.
   ============================================================ */

var lbImages = [];
var lbIndex = 0;

function initLightbox(images) {
    lbImages = images || [];
}

function lbEl(id) { return document.getElementById(id); }

function openLightbox(index) {
    if (!lbImages.length) return;
    lbIndex = index;
    updateLightbox();
    const lb = lbEl('lightbox');
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    requestAnimationFrame(() => lb.classList.remove('opacity-0'));
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = lbEl('lightbox');
    lb.classList.add('opacity-0');
    setTimeout(() => { lb.classList.add('hidden'); lb.classList.remove('flex'); }, 300);
    document.body.style.overflow = 'auto';
}

function closeLightboxOnBg(e) {
    if (e.target.id === 'lb-image' || e.target.closest('button')) return;
    closeLightbox();
}

function changeLbImage(event, direction) {
    if (event) event.stopPropagation();
    lbIndex = (lbIndex + direction + lbImages.length) % lbImages.length;
    updateLightbox();
}

function updateLightbox() {
    const d = lbImages[lbIndex];
    const img = lbEl('lb-image');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = d.src;
        lbEl('lb-caption').textContent = d.caption || '';
        lbEl('lb-counter').textContent = (lbIndex + 1) + ' / ' + lbImages.length;
        img.style.opacity = '1';
    }, 150);
}

document.addEventListener('keydown', e => {
    const lb = lbEl('lightbox');
    if (!lb || lb.classList.contains('hidden')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  changeLbImage(e, -1);
    if (e.key === 'ArrowRight') changeLbImage(e, 1);
});
