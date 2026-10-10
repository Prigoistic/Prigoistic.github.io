(() => {
  const dialog = document.querySelector('.paper-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const viewport = dialog.querySelector('.paper-dialog-viewport');
  const image = dialog.querySelector('.paper-full-image');
  const title = dialog.querySelector('#paper-dialog-title');
  const level = dialog.querySelector('.paper-zoom-level');
  const error = dialog.querySelector('.paper-image-error');
  const zoomIn = dialog.querySelector('[data-paper-zoom="in"]');
  const zoomOut = dialog.querySelector('[data-paper-zoom="out"]');
  let zoom = 1, baseWidth = 0, trigger, previousOverflow;
  const renderZoom = () => {
    image.style.width = `${Math.round(baseWidth * zoom)}px`;
    level.textContent = `${Math.round(zoom * 100)}%`;
    zoomIn.disabled = zoom >= 3;
    zoomOut.disabled = zoom <= .5;
  };
  const fit = () => {
    const padding = matchMedia('(max-width:560px)').matches ? 24 : 40;
    baseWidth = Math.min(image.naturalWidth || 800, viewport.clientWidth - padding);
    zoom = 1;
    renderZoom();
    viewport.scrollTo(0, 0);
  };
  document.querySelectorAll('[data-paper-preview]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      title.textContent = link.dataset.paperTitle;
      image.alt = `First page of ${link.dataset.paperTitle}`;
      image.hidden = false;
      error.hidden = true;
      error.querySelector('a').href = link.href;
      image.onload = fit;
      image.onerror = () => { image.hidden = true; error.hidden = false; };
      image.src = link.href;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      fit();
    });
  });
  zoomIn.addEventListener('click', () => { zoom = Math.min(3, zoom + .25); renderZoom(); });
  zoomOut.addEventListener('click', () => { zoom = Math.max(.5, zoom - .25); renderZoom(); });
  dialog.querySelector('[data-paper-fit]').addEventListener('click', fit);
  dialog.querySelector('[data-paper-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    trigger?.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  window.addEventListener('resize', () => { if (dialog.open) fit(); });
})();
