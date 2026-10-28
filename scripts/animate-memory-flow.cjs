// Editorial animation: a durable relational world, a sparse workspace, and gated write-back.
// Original art. Canvas + FFmpeg; the motion is a schematic, not a system benchmark.
const {createCanvas}=require('@napi-rs/canvas');
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const out=path.join(__dirname,'../assets/essays/intelligence-between-things');
const P={paper:'#f3eddf',cream:'#fbf8ef',ink:'#29332f',muted:'#71776a',sage:'#7d8b79',faint:'#d4d4c4',rust:'#ad533b',sand:'#dfd3b9'};
const duration=16,fps=20;
let seed=87;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const clamp=t=>Math.max(0,Math.min(1,t));const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const selected=[{x:-.38,y:-.56,label:'Alice entered',dx:-8,dy:-27},{x:.55,y:.02,label:'Dog barked',dx:18,dy:39},{x:-.10,y:.66,label:'Same room',dx:-10,dy:39}];
const cloud=[];
for(let i=0;i<85;i++){
 const a=i*2.39996,r=Math.sqrt((i+.5)/85),x=Math.cos(a)*r,y=Math.sin(a)*r;
 if(!selected.some(p=>Math.hypot(x-p.x,y-p.y)<.25))cloud.push({x,y});
}
const nodes=[...selected,...cloud];
const edges=[];
nodes.forEach((a,i)=>nodes.map((b,j)=>({j,d:Math.hypot(a.x-b.x,a.y-b.y)})).filter(v=>v.j!==i).sort((a,b)=>a.d-b.d).slice(0,3).forEach(({j})=>{if(j>i)edges.push([i,j]);}));
function bezier(a,b,c,d,t){const u=1-t;return{x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};}
function make(mobile){
 const W=mobile?720:1280,H=mobile?1200:780,c=createCanvas(W,H),g=c.getContext('2d');
 const store=mobile?{x:360,y:325,rx:248,ry:157}:{x:280,y:397,rx:208,ry:178};
 const work=mobile?{x:360,y:930,rx:191,ry:137}:{x:1000,y:397,rx:155,ry:145};
 const pos=(p,region)=>({x:region.x+p.x*region.rx,y:region.y+p.y*region.ry});
 const workNodes=[{x:-.56,y:-.60},{x:.73,y:.04},{x:-.42,y:.72}].map(p=>pos(p,work));
 const forward=mobile?[{x:330,y:495},{x:262,y:530},{x:262,y:564},{x:330,y:600}]:[{x:524,y:340},{x:609,y:285},{x:710,y:285},{x:795,y:340}];
 const backward=mobile?[{x:402,y:600},{x:467,y:563},{x:467,y:530},{x:402,y:495}]:[{x:795,y:466},{x:710,y:525},{x:609,y:525},{x:524,y:466}];
 function text(s,x,y,size=26,col=P.ink,align='left',weight=400){g.fillStyle=col;g.textAlign=align;g.font=`${weight} ${size}px Arial`;g.fillText(s,x,y);}
 function line(points,col,width=1,alpha=1){g.save();g.globalAlpha=alpha;g.strokeStyle=col;g.lineWidth=width;g.beginPath();points.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();g.restore();}
 function dot(p,r,col,alpha=1){g.save();g.globalAlpha=alpha;g.fillStyle=col;g.beginPath();g.arc(p.x,p.y,r,0,Math.PI*2);g.fill();g.restore();}
 function ring(p,r,col,alpha=1,width=1){g.save();g.globalAlpha=alpha;g.strokeStyle=col;g.lineWidth=width;g.beginPath();g.arc(p.x,p.y,r,0,Math.PI*2);g.stroke();g.restore();}
 function route(points,col,alpha=1){g.save();g.globalAlpha=alpha;g.strokeStyle=col;g.lineWidth=1.8;g.beginPath();g.moveTo(points[0].x,points[0].y);g.bezierCurveTo(points[1].x,points[1].y,points[2].x,points[2].y,points[3].x,points[3].y);g.stroke();g.restore();}
 function arrow(points,col){const p=bezier(...points,.97),q=points[3],angle=Math.atan2(q.y-p.y,q.x-p.x);g.save();g.translate(q.x,q.y);g.rotate(angle);g.strokeStyle=col;g.lineWidth=1.8;g.beginPath();g.moveTo(-10,-5);g.lineTo(0,0);g.lineTo(-10,5);g.stroke();g.restore();}
 function packet(points,t,col){if(t<0||t>1)return;const p=bezier(...points,ease(t));dot(p,5,col);ring(p,11,col,.18,3);}
 function label(s,p,dy=0){g.font='26px Arial';const width=g.measureText(s).width;g.fillStyle=P.paper;g.fillRect(p.x-width/2-6,p.y+dy-23,width+12,32);text(s,p.x,p.y+dy,26,P.ink,'center');}
 function draw(t){
  g.globalAlpha=1;g.fillStyle=P.paper;g.fillRect(0,0,W,H);g.lineCap='round';g.lineJoin='round';
  const stage=t<5?0:t<10.4?1:2;
  const activate=ease((t-.8)/3.2),fade=1-ease((t-12.8)/2.8);
  const strength=activate*fade;
  // Quiet chapter line; the diagrams carry the explanation.
  text('MEMORY, AT TWO TIMESCALES',mobile?40:52,mobile?40:48,mobile?20:21,P.muted);
  const chapter=['01  RETRIEVE RELEVANT EVIDENCE','02  TRY AN EXPLANATION','03  KEEP ONLY CHECKED CHANGES'][stage];
  if(mobile)text(chapter,40,73,20,P.rust);else text(chapter,1228,48,21,P.rust,'right');
  text('Persistent store',mobile?40:52,mobile?120:126,mobile?34:38,P.ink,'left',500);
  text('HStore · a world that stays',mobile?40:52,mobile?153:160,mobile?23:24,P.muted);
  text('Active workspace',mobile?40:840,mobile?660:126,mobile?34:38,P.ink,'left',500);
  text('RAM · one passing thought',mobile?40:840,mobile?693:160,mobile?23:24,P.muted);
  // Stable network: many relations remain in the background.
  edges.forEach(([i,j])=>line([pos(nodes[i],store),pos(nodes[j],store)],P.sage,1.2,.3));
  nodes.slice(3).forEach((p,i)=>dot(pos(p,store),i%8===0?3.6:2.4,P.sage,i%8===0?.65:.4));
  selected.forEach((p,i)=>{
   const pt=pos(p,store);ring(pt,17,P.rust,.15+.25*strength,1.2);dot(pt,7,P.rust);
   if(stage===0){const r=20+((t*.25+i*.17)%1)*28;ring(pt,r,P.rust,.15*(1-((t*.25+i*.17)%1)),1.5);}
   label(p.label,{x:pt.x+p.dx,y:pt.y},p.dy);
  });
  // The workspace is small and transient; its boundary breathes rather than spinning.
  const halo=g.createRadialGradient(work.x,work.y,8,work.x,work.y,work.rx*1.22);
  halo.addColorStop(0,`rgba(125,139,121,${.11*strength})`);halo.addColorStop(1,'rgba(125,139,121,0)');
  g.fillStyle=halo;g.beginPath();g.ellipse(work.x,work.y,work.rx*1.3,work.ry*1.25,0,0,Math.PI*2);g.fill();
  g.save();g.setLineDash([2,8]);g.strokeStyle=P.sage;g.globalAlpha=.3+.3*strength;g.lineWidth=1.2;g.beginPath();g.ellipse(work.x,work.y,work.rx*1.14,work.ry*1.05,0,0,Math.PI*2);g.stroke();g.restore();
  const labels=['Entry','Barking','Context'];
  workNodes.forEach((p,i)=>{
   const active=clamp((t-1.7-i*.55)/1.2)*fade;
   line([p,{x:work.x,y:work.y}],P.rust,1.6,active*.65);
   dot(p,8,P.rust,.14+.86*active);ring(p,18,P.rust,.14+.24*active,1.5);
   label(labels[i],p,i===0?-29:i===1?65:42);
  });
  const question=mobile?'Why did the dog bark?':'Why did the dog bark?';
  text(question,work.x,work.y-work.ry-38,mobile?25:26,P.ink,'center');
  g.save();g.fillStyle=P.paper;g.beginPath();g.ellipse(work.x,work.y+10,101,44,0,0,Math.PI*2);g.fill();g.restore();
  g.save();g.globalAlpha=.25+.75*strength;
  text('Possible link?',work.x,work.y+3,mobile?27:27,P.rust,'center',500);
  text('still a hypothesis',work.x,work.y+32,mobile?20:20,P.muted,'center');g.restore();
  if(stage===1){const cycle=(t-5)/5.4;for(let k=0;k<3;k++){const a=workNodes[k],b=workNodes[(k+1)%3];const f=(cycle*1.6+k*.33)%1;const point={x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f};if(((point.x-work.x)/118)**2+((point.y-work.y-10)/49)**2>1)dot(point,3.4,P.rust,.9);}}
  route(forward,P.rust,.45);arrow(forward,P.rust);route(backward,P.sage,.5);arrow(backward,P.sage);
  if(stage===0)for(let i=0;i<3;i++)packet(forward,(t-.5-i*.7)/2.4,P.rust);
  if(stage===2)for(let i=0;i<2;i++)packet(backward,(t-10.6-i*.85)/2.6,P.sage);
  if(mobile){
   text('Retrieve',210,551,23,P.rust,'right');text('Checked',500,540,21,P.muted);text('updates',500,567,21,P.muted);
   text('Working activation fades.',360,1130,24,P.muted,'center');
  }else{
   text('Retrieve',660,267,25,P.rust,'center');text('Checked updates',660,553,24,P.muted,'center');
   text('Durable events, relations and their evidence',280,647,24,P.muted,'center');
   text('Candidates and alternatives',1000,629,24,P.muted,'center');
   text('Questions still to resolve',1000,660,23,P.muted,'center');
   line([{x:52,y:690},{x:1228,y:690}],P.sage,1,.25);
   text('Most of the stored world stays quiet. Only relevant evidence enters this thought.',52,732,25,P.ink);
  }
  // An accepted evidence link is retained while the workspace fades at the end.
  if(t>12){const a=pos(selected[0],store),b=pos(selected[2],store);line([a,b],P.sage,2.3,ease((t-12)/1.3)*.65);}
 }
 return{c,draw,W,H};
}
for(const mobile of [false,true]){
 const {c,draw}=make(mobile),stem=mobile?'memory-flow-mobile':'memory-flow';
 const temp=fs.mkdtempSync('/tmp/essay-memory-');
 for(let i=0;i<fps*duration;i++){draw(i/fps);fs.writeFileSync(path.join(temp,`${String(i).padStart(4,'0')}.jpg`),c.toBuffer('image/jpeg',91));}
 draw(7.5);fs.writeFileSync(path.join(out,stem+'-poster.jpg'),c.toBuffer('image/jpeg',94));
 const result=spawnSync('ffmpeg',['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(temp,'%04d.jpg'),'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,stem+'.mp4')],{stdio:'inherit'});
 if(result.status!==0)throw Error('Memory animation encoding failed');
 fs.rmSync(temp,{recursive:true});console.log(stem+' rendered.');
}
