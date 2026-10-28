// A silent, original 12-second explanation of participants, events and nested scope.
const {createCanvas}=require('@napi-rs/canvas');
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const W=960,H=720,fps=20,duration=12,c=createCanvas(W,H),g=c.getContext('2d');
const out=path.join(__dirname,'../assets/essays/intelligence-between-things');
const temp=fs.mkdtempSync('/tmp/essay-nesting-');
const P={paper:'#f3eddf',ink:'#29332f',muted:'#65655d',sage:'#7d8877',rust:'#aa5038',cream:'#f8f4eb',sand:'#e9e0cd'};
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function text(t,x,y,size=35,col=P.ink,align='left'){g.fillStyle=col;g.font=`${size}px Arial`;g.textAlign=align;g.fillText(t,x,y);}
function box(x,y,w,h,fill,stroke){g.fillStyle=fill;g.fillRect(x,y,w,h);g.strokeStyle=stroke;g.lineWidth=2;g.strokeRect(x,y,w,h);}
function frame(t){
 g.globalAlpha=1;g.fillStyle=P.paper;g.fillRect(0,0,W,H);
 const stage=t<4?0:t<8?1:2;
 text(['1. An event has participants and roles','2. The event becomes the content of a memory','3. A belief can refer to that memory'][stage],40,48,32,P.muted);
 if(t>=7.7){g.globalAlpha=ease((t-7.7)/.6);box(25,80,910,540,P.sand,'#b4ad9d');text('Dave believes…',56,132,38);}
 g.globalAlpha=1;
 if(t>=3.7){g.globalAlpha=ease((t-3.7)/.6);box(66,162,828,422,'#e0e4d8',P.sage);text('Carol remembers…',99,212,38);}
 g.globalAlpha=1;box(108,244,744,301,P.cream,P.rust);text('Alice gave Bob a book',146,297,39);
 for(const [x,name,role] of [[235,'Alice','giver'],[480,'Bob','recipient'],[725,'Book','object']]){
  g.fillStyle=P.sand;g.beginPath();g.arc(x,390,51,0,Math.PI*2);g.fill();text(name,x,402,35,P.ink,'center');text(role,x,491,30,P.muted,'center');
 }
 text(['One giving event, not an unlabelled Alice–Bob link.','The giving event now has an identity another relation can reference.','What Dave believes is not automatically an established fact.'][stage],480,663,27,P.muted,'center');
 g.fillStyle='#d8d0bf';g.fillRect(40,697,880,3);g.fillStyle=P.rust;g.fillRect(40,697,880*Math.min(t/duration,1),3);
}
for(let i=0;i<fps*duration;i++){frame(i/fps);fs.writeFileSync(path.join(temp,`${String(i).padStart(4,'0')}.jpg`),c.toBuffer('image/jpeg',92));}
frame(10);fs.writeFileSync(path.join(out,'nested-events-video-poster.jpg'),c.toBuffer('image/jpeg',92));
const result=spawnSync('ffmpeg',['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(temp,'%04d.jpg'),'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'nested-events.mp4')],{stdio:'inherit'});
if(result.status!==0)throw Error('Video encoding failed');
fs.rmSync(temp,{recursive:true});
console.log('Created a 12-second MP4 and poster.');
