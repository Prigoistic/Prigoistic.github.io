(() => {
  const themeButton = document.querySelector('[data-theme-toggle]');
  function themeLabel() {
    if (!themeButton) return;
    const label = document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeButton.setAttribute('aria-label', label);
    themeButton.setAttribute('title', label);
  }
  themeButton?.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try {localStorage.setItem('theme', dark ? 'dark' : 'light');} catch {} themeLabel(); });
  themeLabel();
  const content = document.querySelector('.article-content'), panel = document.querySelector('.agent-panel');
  let markdown = '', loading;
  const status = document.querySelector('[data-agent-status]');
  async function loadMarkdown() { if (markdown) return markdown; if (!loading) loading = fetch(panel.dataset.markdown).then(r => {if (!r.ok) throw new Error('Markdown unavailable'); return r.text();}).then(t => {markdown=t;panel.querySelector('pre').textContent=t;return t;}).catch(() => {status.textContent='Could not load Markdown. Use the download link or try again.'; loading=null;}); return loading; }
  document.querySelectorAll('[data-reading-mode]').forEach(button => button.addEventListener('click', async () => {
    const agent = button.dataset.readingMode === 'agent';
    document.querySelector('.reading-layout').classList.toggle('agent-mode', agent);
    content.hidden = agent; panel.hidden = !agent;
    document.querySelector('.reading-toc').hidden = agent;
    document.querySelectorAll('[data-reading-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    if (agent) {status.textContent='Loading Markdown…'; if(await loadMarkdown()) status.textContent='';}
  }));
  document.querySelector('[data-copy-markdown]')?.addEventListener('click', async () => { const text = await loadMarkdown(); if (!text) return; try {await navigator.clipboard.writeText(text);status.textContent='Copied.';} catch {status.textContent='Copy unavailable. Select the Markdown text or download the file.';} });
  if (!content) return;
  window.addEventListener('load', () => {if (!content.querySelector('#main-page') && location.hash) {const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));target?.scrollIntoView({behavior:'auto'});}});
  const toc = document.querySelector('[data-toc-links]');
  const headingLabels = new Map([...content.querySelectorAll('h2')].map(h => {const label=h.cloneNode(true);label.querySelectorAll('.num').forEach(n=>n.remove());return [h.id,label.textContent.trim()];}));
  function refreshToc() {
    const headings = [...content.querySelectorAll('h2')].filter(h => h.getClientRects().length);
    toc.replaceChildren(...headings.map(h => {const a=document.createElement('a');a.href='#'+h.id;a.textContent=headingLabels.get(h.id);return a;}));
    observer?.disconnect(); headings.forEach(h => observer?.observe(h));
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {entries.forEach(e => {if(e.isIntersecting) toc.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === '#'+e.target.id));});}, {rootMargin:'0px 0px -65% 0px'}) : null;
  new MutationObserver(refreshToc).observe(content, {attributes:true,attributeFilter:['style'],subtree:true});
  refreshToc();
  if (matchMedia('(max-width:700px)').matches) document.querySelector('.reading-toc details').removeAttribute('open');
  if(content.querySelector('#main-page')) {
    document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', e => {if(a.hash && typeof window.navigate === 'function'){e.preventDefault();window.navigate(a.hash.slice(1));refreshToc();}}));
    toc.addEventListener('click', e => {const a=e.target.closest('a');if(!a)return;const target=document.getElementById(a.hash.slice(1));if(target?.closest('#breakdowns-page')){e.preventDefault();history.pushState({},'',a.hash);target.scrollIntoView();}});
  }
})();
