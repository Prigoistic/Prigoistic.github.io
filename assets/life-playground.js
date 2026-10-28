import {lifeWidth as width, lifeHeight as height, lifePresets, seedLife, stepLife} from './essay-models.js?v=2';

export function initLifePlayground(root) {
  if (!root) return;
  const canvas = root.querySelector('[data-life-canvas]'), context = canvas.getContext('2d');
  if (!context) return;
  const ui = root.querySelector('[data-life-ui]');
  const play = root.querySelector('[data-life-play]');
  const status = root.querySelector('[data-life-status]');
  const select = root.querySelector('[data-life-preset]');
  const speed = root.querySelector('[data-life-speed]');
  const reading = root.querySelector('[data-life-reading]');
  const cursorReading = root.querySelector('[data-life-cursor]');
  let cells = seedLife(), initial = cells.slice(), previous = cells.slice();
  let generation = 0, timer, births = 0, deaths = 0, period = 0;
  let cursor = {x: Math.floor(width/2), y: Math.floor(height/2)}, focused = false, stroke;
  let history = new Map([[cells.join(''),0]]);
  const size = canvas.width / width;
  const population = () => cells.reduce((sum,value) => sum+value,0);
  const pause = () => {
    clearInterval(timer); timer = undefined;
    play.textContent = 'Play'; play.setAttribute('aria-pressed','false');
  };
  const draw = () => {
    context.fillStyle = '#f3eddf'; context.fillRect(0,0,canvas.width,canvas.height);
    for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
      const i=y*width+x;
      context.fillStyle = cells[i] ? (generation && !previous[i] ? '#aa5038' : '#29332f') : (generation && previous[i] ? '#c6b29f' : '#e5dfd1');
      context.fillRect(x*size+1.2,y*size+1.2,size-2.4,size-2.4);
    }
    if (focused) {
      context.strokeStyle = '#aa5038'; context.lineWidth=2;
      context.strokeRect(cursor.x*size+1,cursor.y*size+1,size-2,size-2);
    }
    const count=population();
    const state = !count ? 'Empty grid' : period === 1 ? 'Settled' : period > 1 ? `Repeats every ${period} steps` : timer ? 'Running' : 'Paused';
    status.textContent = `Generation ${generation} · ${state}`;
    root.querySelector('[data-life-alive]').textContent = count;
    root.querySelector('[data-life-born]').textContent = births;
    root.querySelector('[data-life-died]').textContent = deaths;
    canvas.setAttribute('aria-label',`Game of Life: generation ${generation}, ${count} live cells. ${state}.`);
    cursorReading.textContent = `Column ${cursor.x+1}, row ${cursor.y+1}: ${cells[cursor.y*width+cursor.x] ? 'alive' : 'empty'}.`;
  };
  const resetHistory = () => { history = new Map([[cells.join(''),generation]]); period=0; };
  const advance = () => {
    previous=cells; cells=stepLife(cells); generation++; births=0; deaths=0;
    cells.forEach((value,i) => { if(value&&!previous[i]) births++; if(!value&&previous[i]) deaths++; });
    const key=cells.join('');
    period=history.has(key) ? generation-history.get(key) : 0;
    history.set(key,generation);
    if(history.size>64) history.delete(history.keys().next().value);
    if(!population() || period===1) pause();
    draw();
  };
  const start = () => {
    if(!population()) { reading.textContent='The grid is empty. Draw a few cells or choose a starting pattern.'; return; }
    if(period===1) { reading.textContent='This pattern has settled. Change a cell or choose another starting pattern.'; return; }
    play.textContent='Pause'; play.setAttribute('aria-pressed','true');
    timer=setInterval(advance,1000/Number(speed.value)); draw();
  };
  const load = (next,description) => {
    pause(); cells=next.slice(); initial=next.slice(); previous=next.slice();
    generation=0; births=0; deaths=0; resetHistory(); reading.textContent=description; draw();
  };
  select.addEventListener('change',()=>load(seedLife(select.value),lifePresets[select.value].description));
  play.addEventListener('click',()=>timer ? (pause(),draw()) : start());
  root.querySelector('[data-life-step]').addEventListener('click',()=>{pause();advance();});
  root.querySelector('[data-life-reset]').addEventListener('click',()=>load(initial,select.value==='custom' ? 'Your starting pattern, restored. Press Play or change a cell.' : lifePresets[select.value].description));
  root.querySelector('[data-life-random]').addEventListener('click',()=>{select.value='field';load(seedLife('field',Math.random),lifePresets.field.description);});
  root.querySelector('[data-life-clear]').addEventListener('click',()=>{select.value='custom';load(new Uint8Array(width*height),'An empty grid. Draw a pattern, then press Play.');});
  speed.addEventListener('input',()=>{
    root.querySelector('[data-life-speed-label]').textContent=`${speed.value} steps/s`;
    if(timer){pause();start();}
  });
  const edit = (x,y,value) => {
    cells[y*width+x]=value; previous=cells.slice(); initial=cells.slice();
    generation=0; births=0; deaths=0; select.value='custom';resetHistory();
    reading.textContent='Your pattern. Try adding a cell beside a repeating shape, then watch how its future changes.';
  };
  const position = event => {
    const bounds=canvas.getBoundingClientRect();
    return {x:Math.min(width-1,Math.max(0,Math.floor((event.clientX-bounds.left)/bounds.width*width))),y:Math.min(height-1,Math.max(0,Math.floor((event.clientY-bounds.top)/bounds.height*height)))};
  };
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    event.preventDefault();pause();canvas.focus({preventScroll:true});
    cursor=position(event);const value=1-cells[cursor.y*width+cursor.x];
    stroke={...cursor,value,id:event.pointerId};canvas.setPointerCapture(event.pointerId);
    edit(cursor.x,cursor.y,value);draw();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!stroke||stroke.id!==event.pointerId)return;
    cursor=position(event);
    const distance=Math.max(Math.abs(cursor.x-stroke.x),Math.abs(cursor.y-stroke.y));
    for(let i=0;i<=distance;i++) {
      const fraction=distance ? i/distance : 0;
      edit(Math.round(stroke.x+(cursor.x-stroke.x)*fraction),Math.round(stroke.y+(cursor.y-stroke.y)*fraction),stroke.value);
    }
    stroke={...cursor,value:stroke.value,id:stroke.id};draw();
  });
  const finishStroke = event => {if(stroke?.id===event.pointerId)stroke=undefined;};
  canvas.addEventListener('pointerup',finishStroke);canvas.addEventListener('pointercancel',finishStroke);canvas.addEventListener('lostpointercapture',()=>{stroke=undefined;});
  canvas.addEventListener('focus',()=>{focused=true;draw();});
  canvas.addEventListener('blur',()=>{focused=false;draw();});
  canvas.addEventListener('keydown',event=>{
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(directions[event.key]) {
      event.preventDefault();const [dx,dy]=directions[event.key];
      cursor={x:Math.min(width-1,Math.max(0,cursor.x+dx)),y:Math.min(height-1,Math.max(0,cursor.y+dy))};draw();
    } else if(event.key===' '||event.key==='Enter') {
      event.preventDefault();pause();edit(cursor.x,cursor.y,1-cells[cursor.y*width+cursor.x]);draw();
    }
  });
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){pause();draw();}}).observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();draw();}});
  root.querySelector('[data-life-fallback]').hidden=true;canvas.hidden=false;ui.hidden=false;
  draw();
}
