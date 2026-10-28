// Editorial cover collage for Intelligence between things. Audubon/Havell engraving: NGA 1945.8.385, CC0.
// Reference directions: vintage natural-history collage and negative-space editorial art.
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('node:fs');
const path = require('node:path');
const W=1600,H=900,P={paper:'#eee6d6',ink:'#26332f',sage:'#7b8470',rust:'#af5036'};
let seed=2579;
const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const normal=()=>Math.sqrt(-2*Math.log(Math.max(rand(),1e-9)))*Math.cos(2*Math.PI*rand());
function bird(g,x,y,s,a,flap,col){
 g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);g.fillStyle=col;
 g.beginPath();g.moveTo(-.16,0);
 g.bezierCurveTo(-.36,-.22,-.75,-.38,-1,-.84*flap);
 g.bezierCurveTo(-.68,-.67*flap,-.17,-.5,.1,-.15);
 g.bezierCurveTo(.42,-.45,.8,-.57*flap,1.05,-.78*flap);
 g.bezierCurveTo(.76,-.18,.48,.07,.16,.1);
 g.lineTo(.06,.52);g.lineTo(-.06,.32);g.lineTo(-.18,.52);g.lineTo(-.14,.12);
 g.quadraticCurveTo(-.3,.06,-.16,0);g.fill();g.restore();
}
function paper(g){
 g.fillStyle=P.paper;g.fillRect(0,0,W,H);
 for(let i=0;i<12000;i++){
  const x=rand()*W,y=rand()*H;
  g.strokeStyle=`rgba(81,72,55,${.012+rand()*.025})`;g.lineWidth=.4+rand()*.6;
  g.beginPath();g.moveTo(x,y);g.lineTo(x+rand()*3,y+rand()*1.2);g.stroke();
 }
}
function grain(g){
 const d=g.getImageData(0,0,W,H);for(let i=0;i<d.data.length;i+=4){
  const n=(rand()-.5)*8;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n;
 }g.putImageData(d,0,0);
}
function disc(g,x,y,r){
 g.fillStyle=P.rust;g.beginPath();
 for(let i=0;i<=900;i++){const a=i/900*Math.PI*2,rr=r+Math.sin(a*33)*.45+rand()*.7;
 const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.closePath();g.fill();
 // Dry, uneven printing within the flat spot colour.
 g.save();g.clip();for(let i=0;i<5000;i++){
  g.globalAlpha=.035+rand()*.04;g.strokeStyle=P.paper;g.lineWidth=.35;
  const xx=x-r+rand()*2*r,yy=y-r+rand()*2*r;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+5+rand()*15,yy-rand()*2);g.stroke();
 }g.restore();
}
async function cutout(src){
 const c=createCanvas(610,580),g=c.getContext('2d');g.drawImage(src,760,240,610,580,0,0,610,580);
 // Colour key only the pale warm paper. Fine feather edges and the pale belly are retained.
 const d=g.getImageData(0,0,610,580);
 for(let i=0;i<d.data.length;i+=4){const r=d.data[i],gg=d.data[i+1],b=d.data[i+2];
  const warm=r>155&&gg>143&&b>100&&r>gg+5;
  if(warm){const q=Math.min(1,Math.max(0,(Math.min(r,gg)-142)/55));d.data[i+3]=Math.round(255*(1-q));}
  // Exclude the neighbouring bird's wing from the plate, then remove isolated specks.
  const px=(i/4)%610,py=Math.floor(i/4/610);
  if(px+py*.42<212)d.data[i+3]=0;
 }
 const seen=new Uint8Array(610*580),components=[];
 for(let q=0;q<seen.length;q++)if(!seen[q]&&d.data[q*4+3]>65){
  const group=[],queue=[q];seen[q]=1;
  for(let k=0;k<queue.length;k++){
   const v=queue[k];group.push(v);
   for(const n of [v-1,v+1,v-610,v+610])if(n>=0&&n<seen.length&&!seen[n]&&d.data[n*4+3]>65){seen[n]=1;queue.push(n);}
  }components.push(group);
 }
 components.sort((a,b)=>b.length-a.length);const keep=new Uint8Array(seen.length);
 for(const v of components[0])keep[v]=1;
 for(let q=0;q<keep.length;q++)if(!keep[q])d.data[q*4+3]=0;
 g.putImageData(d,0,0);
 return c;
}
async function main(){
 const src=await loadImage(path.join(__dirname,'../assets/essays/intelligence-between-things/audubon-swallow-source.jpg'));
 const c=createCanvas(W,H),g=c.getContext('2d');paper(g);disc(g,1055,373,244);
 // The flock is a broad curling ribbon; orientation follows the local current.
 const flock=[];
 for(let i=0;i<1260;i++){
  const t=rand()*Math.PI*1.77-.69,spread=normal()*46;
  const r=276+spread+Math.sin(t*3.2)*20;
  let x=925+Math.cos(t)*r*1.63,y=416+Math.sin(t)*r*.92;
  x+=Math.sin(t*2)*47;y+=Math.cos(t*2.4)*20;
  if(x<130||x>1480||y<110||y>790)continue;
  const s=2.2+rand()*2.5+(y/H)*1.9;
  flock.push({x,y,s,a:t+Math.PI/2+normal()*.21,flap:.35+rand()*.95});
 }
 flock.sort((a,b)=>a.s-b.s);
 for(const b of flock){g.globalAlpha=.56+rand()*.37;bird(g,b.x,b.y,b.s,b.a,b.flap,P.ink);}g.globalAlpha=1;
 // Small loose groups keep the collective boundary porous.
 for(let i=0;i<33;i++){
  const t=rand();bird(g,180+1040*t,690-285*t+Math.sin(t*7)*60,4+rand()*4,-1.25+rand()*.35,.5+rand()*.7,P.ink);
 }
 const single=await cutout(src);
 g.save();g.translate(283,222);g.rotate(-.19);g.drawImage(single,0,0,664,631);g.restore();
 grain(g);fs.writeFileSync(path.join(__dirname,'../assets/covers/intelligence-between-things.jpg'),c.toBuffer('image/jpeg',90));
 console.log('Painted intelligence-between-things.jpg');
}
main().catch(e=>{console.error(e);process.exit(1);});
