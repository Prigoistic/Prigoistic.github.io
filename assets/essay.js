import {initHStorePlayground} from './hstore-playground.js?v=3';
import {energy, descend} from './essay-models.js?v=2';
import {initLifePlayground} from './life-playground.js?v=1';

document.querySelectorAll('video[autoplay]').forEach(video => {
  video.muted = true;
  let visible = false;
  const updatePlayback = () => {
    if (visible && !document.hidden && !video.closest('.memory-motion-paused')) video.play().catch(() => {});
    else video.pause();
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
      updatePlayback();
    }, {threshold:[0,.15]}).observe(video);
    document.addEventListener('visibilitychange', updatePlayback);
  }
});

const memoryScene = document.querySelector('.workspace-animation');
if (memoryScene) {
  const toggle = memoryScene.querySelector('[data-memory-motion-toggle]');
  if (toggle) {
    const videos = [...memoryScene.querySelectorAll('video')];
    // Native controls remain the fallback when this enhancement does not run.
    videos.forEach(video => { video.controls = false; });
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const paused = memoryScene.classList.toggle('memory-motion-paused');
      videos.forEach(video => {
        if (paused || !video.getClientRects().length) video.pause();
        else video.play().catch(() => {});
      });
      toggle.textContent = paused ? 'Play animation' : 'Pause animation';
      toggle.setAttribute('aria-pressed', String(!paused));
    });
  }
}

initLifePlayground(document.querySelector('[data-life]'));

initHStorePlayground(document.querySelector('[data-hstore-playground]'));

const attractor = document.querySelector('[data-attractor]');
if (attractor) {
  const ball = attractor.querySelector('[data-attractor-ball]');
  const slider = attractor.querySelector('[data-attractor-cue]');
  const play = attractor.querySelector('[data-attractor-play]');
  const reading = attractor.querySelector('[data-attractor-reading]');
  let x = Number(slider.value)/100, timer;
  const draw = () => {
    ball.setAttribute('cx',String(60 + (x+1.5)/3*600));
    ball.setAttribute('cy',String(275 - energy(x)*115 - 7));
    attractor.querySelector('svg').setAttribute('aria-label',`State x equals ${x.toFixed(2)}, with energy ${energy(x).toFixed(3)}, in the double-well potential.`);
  };
  const pause = () => { clearInterval(timer); timer = undefined; play.textContent = 'Release cue'; play.setAttribute('aria-pressed','false'); };
  const reset = () => { pause(); x = Number(slider.value)/100; draw(); reading.textContent = 'Choose an initial position, then release the cue.'; };
  slider.addEventListener('input',reset);
  play.addEventListener('click', () => {
    if (timer) { pause(); return; }
    if (Math.abs(x) < 1e-9) { reading.textContent = 'At x = 0 the gradient is exactly zero. Choose a cue to either side.'; return; }
    play.textContent = 'Pause'; play.setAttribute('aria-pressed','true');
    timer = setInterval(() => {
      x = descend(x); draw();
      reading.textContent = `State ${x.toFixed(2)} · energy ${energy(x).toFixed(3)}`;
      if (Math.abs(Math.abs(x)-1) < .0005) { pause(); reading.textContent = `Settled near the minimum at ${x > 0 ? '+1' : '−1'}.`; }
    },40);
  });
  attractor.querySelector('[data-attractor-reset]').addEventListener('click',reset);
  attractor.querySelector('[data-interactive-controls]').hidden = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(attractor);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  draw();
}
