const {createCanvas}=require('@napi-rs/canvas');
const fs=require('fs'),path=require('path');
const W=1280,H=720,dir=path.join(__dirname,'../assets/covers');
fs.mkdirSync(dir,{recursive:true});
const P={paper:'#e9e0cd',ink:'#272b28',rust:'#a74e35',sage:'#7b887a',sand:'#baab8c',cream:'#f5eedc',dark:'#343b34'};
let seed=41;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}function between(a,b){return a+(b-a)*rnd();}
let c,g;function begin(bg){c=createCanvas(W,H);g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,W,H);g.lineCap='round';g.lineJoin='round';}
function line(points,col,width=1,alpha=1){g.save();g.globalAlpha=alpha;g.strokeStyle=col;g.lineWidth=width;g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.stroke();g.restore();}
function dot(x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
function ellipse(x,y,rx,ry,col,rotation=0){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);g.fill();}
function grain(dark=false){let img=g.getImageData(0,0,W,H),a=img.data;for(let i=0;i<a.length;i+=4){let v=(rnd()-.5)*(dark?14:11);a[i]+=v;a[i+1]+=v;a[i+2]+=v;}g.putImageData(img,0,0);for(let i=0;i<2500;i++){g.fillStyle=dark?'rgba(233,224,205,.045)':'rgba(39,43,40,.055)';let x=rnd()*W,y=rnd()*H;g.fillRect(x,y,between(.3,1.3),between(.3,1.3));}}
function finish(name,dark=false){grain(dark);fs.writeFileSync(path.join(dir,name+'.jpg'),c.toBuffer('image/jpeg',88));console.log(name);}
function branch(x,y,angle,len,width,depth,col){if(depth<0||len<5)return;const endx=x+Math.cos(angle)*len,endy=y+Math.sin(angle)*len;g.strokeStyle=col;g.lineWidth=width;g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+Math.cos(angle+.22)*len*.35,y+Math.sin(angle+.22)*len*.35,x+Math.cos(angle-.13)*len*.73,y+Math.sin(angle-.13)*len*.73,endx,endy);g.stroke();if(depth>0){for(let i=0;i<2;i++){let f=i===0?.6:1;branch(x+(endx-x)*f,y+(endy-y)*f,angle+(i===0?-1:1)*between(.3,.75),len*between(.5,.74),Math.max(.5,width*.59),depth-1,col);}}}
// Astrocyte processes envelop a junction between two neuronal terminals.
begin(P.ink);
for(let i=0;i<35;i++){let y=between(-80,780);branch(-100,y,between(-.1,.3),between(300,630),between(1,3),3,'#586050');}
g.strokeStyle=P.sand;g.lineWidth=70;g.beginPath();g.moveTo(920,-50);g.bezierCurveTo(960,155,770,168,789,324);g.stroke();ellipse(788,343,83,55,P.sand,-.22);
g.strokeStyle=P.cream;g.lineWidth=53;g.beginPath();g.moveTo(840,790);g.bezierCurveTo(940,609,696,507,764,438);g.stroke();ellipse(763,428,83,42,P.cream,-.2);
for(let i=0;i<24;i++)dot(between(735,830),between(331,363),between(2,5),P.ink);
for(let i=0;i<8;i++)dot(between(759,825),between(385,402),2.6,P.paper);
for(let i=0;i<10;i++){let a=i*Math.PI*2/10;branch(462,399,a,between(94,160),between(7,12),5,P.rust);}
g.fillStyle=P.rust;g.beginPath();for(let i=0;i<34;i++){let a=i*Math.PI*2/34,r=i%2?43:68;let x=462+Math.cos(a)*r,y=399+Math.sin(a)*r;i?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();ellipse(462,399,20,25,'#723d30',-.3);
g.strokeStyle=P.rust;g.lineWidth=12;g.beginPath();g.moveTo(501,413);g.bezierCurveTo(625,452,626,290,714,306);g.bezierCurveTo(704,354,693,446,724,483);g.stroke();finish('astrocytes',true);
// Printed contour landscape: local basins and barriers.
begin(P.paper);
for(let j=0;j<53;j++){const pts=[];for(let x=-40;x<W+40;x+=5){let y=60+j*13-100*Math.exp(-(((x-350)/180)**2))*Math.sin(j*.055+1.2)+77*Math.exp(-(((x-890)/210)**2))*Math.cos(j*.045+.5)+19*Math.sin(x*.008+j*.16);pts.push([x,y]);}line(pts,j%8===0?P.ink:P.sage,j%8===0?1.7:.8,.75);}
for(let j=0;j<16;j++){let r=16+j*15;g.strokeStyle=j===0?P.rust:P.ink;g.lineWidth=j===0?2:1;g.beginPath();g.ellipse(425,375,r,r*.55,-.26,0,Math.PI*2);g.stroke();}
ellipse(417,371,12,7,'#b7aa91',-.26);dot(418,364,7,P.rust);finish('energy');
// Segmented botanical field: object boundaries determine the regions.
begin(P.ink);
function leaf(x,y,w,h,a,col){g.save();g.translate(x,y);g.rotate(a);g.fillStyle=col;g.beginPath();g.moveTo(0,-h/2);g.bezierCurveTo(w*.67,-h*.24,w*.43,h*.32,0,h/2);g.bezierCurveTo(-w*.5,h*.2,-w*.61,-h*.27,0,-h/2);g.fill();line([[0,-h*.46],[0,h*.48]],P.ink,2,.7);for(let i=0;i<15;i++){let yy=-h*.33+i*h*.046;let ww=Math.sin((i+1)*Math.PI/17)*w*.36;line([[0,yy],[ww,yy-h*.12]],P.ink,.9,.48);line([[0,yy],[-ww,yy-h*.1]],P.ink,.9,.48);}g.restore();}
const leaves=[[155,247,190,540,-.48,P.sage],[410,435,180,520,.48,P.sand],[640,221,220,550,-.35,P.rust],[945,397,300,640,.54,P.paper],[1210,174,190,550,-.5,P.sage]];
leaves.forEach(a=>leaf(...a));
for(let i=0;i<leaves.length;i++){let [x,y]=leaves[i];dot(x,y,4,P.cream);if(i)line([[leaves[i-1][0],leaves[i-1][1]],[x,y]],P.cream,.7,.55);}
finish('cheeger',true);
// HNSW-like proximity graph: local communities plus sparse upper navigation.
begin(P.ink);const communities=[];for(let k=0;k<4;k++){let pts=[];for(let i=0;i<23;i++){let a=rnd()*Math.PI*2,r=Math.sqrt(rnd());pts.push([165+k*312+Math.cos(a)*130*r,470+Math.sin(a)*146*r]);}communities.push(pts);}
communities.forEach((pts,k)=>{pts.forEach((p,i)=>{let near=pts.map((q,j)=>({q,j,d:Math.hypot(q[0]-p[0],q[1]-p[1])})).filter(x=>x.j!==i).sort((a,b)=>a.d-b.d).slice(0,3);near.forEach(({q})=>line([p,q],P.sand,.85,.55));});pts.forEach((p,i)=>{dot(...p,4,i%7===0?P.rust:P.paper);dot(p[0]-.8,p[1]-1,1.1,P.cream);});});
const upper=[[165,203],[480,150],[780,211],[1120,160]];line(upper,P.paper,1.6,.85);line([upper[0],upper[2]],P.sage,.8,.6);line([upper[1],upper[3]],P.sage,.8,.6);upper.forEach((p,k)=>{line([p,communities[k][8]],P.sand,1,.5);dot(...p,8,k===0?P.rust:P.paper);});finish('engram',true);
// OOP: a common card template, specialised pieces, and composed abilities.
begin(P.paper);
function card(x,y,a,type){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='rgba(39,43,40,.13)';g.fillRect(-103,-162,222,330);g.fillStyle=P.cream;g.fillRect(-111,-173,222,330);g.strokeStyle=P.sand;g.lineWidth=1;g.strokeRect(-93,-155,186,294);g.fillStyle=type===1?P.rust:P.ink;
if(type===0){g.beginPath();g.moveTo(-48,69);g.lineTo(-33,-40);g.lineTo(-57,-40);g.lineTo(-57,-76);g.lineTo(-30,-76);g.lineTo(-30,-56);g.lineTo(-13,-56);g.lineTo(-13,-76);g.lineTo(13,-76);g.lineTo(13,-56);g.lineTo(30,-56);g.lineTo(30,-76);g.lineTo(57,-76);g.lineTo(57,-40);g.lineTo(33,-40);g.lineTo(48,69);g.closePath();g.fill();}
if(type===1){g.beginPath();g.moveTo(-48,69);g.lineTo(-32,29);g.bezierCurveTo(-48,-27,-2,-33,15,-61);g.lineTo(2,-83);g.lineTo(33,-69);g.lineTo(54,-23);g.lineTo(32,-12);g.lineTo(10,-30);g.bezierCurveTo(32,5,51,29,49,69);g.closePath();g.fill();dot(27,-45,3,P.cream);}
if(type===2){g.strokeStyle=P.ink;g.lineWidth=9;g.beginPath();g.arc(-12,-9,68,-1.2,1.2);g.stroke();line([[12,-71],[12,54]],P.ink,2);line([[-58,-9],[61,-9]],P.rust,7);g.fillStyle=P.rust;g.beginPath();g.moveTo(61,-9);g.lineTo(40,-20);g.lineTo(40,2);g.closePath();g.fill();}
for(let i=0;i<3;i++){dot(-22+i*22,112,4,i===type?P.rust:P.sand);}g.restore();}
card(435,348,-.17,0);card(651,341,.02,1);card(868,353,.17,2);finish('oop');
// Spectral graph: a brain-like organic topology and diffusion through connections.
begin(P.paper);const pts=[];
for(let i=0;i<220;i++){let x=between(320,1010),y=between(105,614);let nx=(x-660)/350,ny=(y-359)/246;if(nx*nx+ny*ny<1&&!(x>870&&y>455))pts.push([x,y]);}
pts.forEach((p,i)=>{let nearby=pts.map((q,j)=>({q,j,d:Math.hypot(q[0]-p[0],q[1]-p[1])})).filter(x=>x.j!==i).sort((a,b)=>a.d-b.d).slice(0,3);nearby.forEach(({q})=>{let dist=Math.hypot(p[0]-510,p[1]-365);line([p,q],dist<110?P.rust:P.sage,dist<110?1.7:.75,dist<110?.95:.65);});dot(...p,between(1.5,3.5),Math.hypot(p[0]-510,p[1]-365)<110?P.rust:P.ink);});
for(let i=0;i<12;i++){let a=i*Math.PI*2/12;branch(656+Math.cos(a)*270,358+Math.sin(a)*180,a+1,between(35,70),1.1,3,P.sage);}
g.strokeStyle=P.ink;g.lineWidth=9;g.beginPath();g.moveTo(869,500);g.bezierCurveTo(868,560,887,593,937,628);g.stroke();finish('spectral');
// MAPA: the same observed world at three moments, preserving stable structure.
begin(P.paper);
function scene(x,y,a,step){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='rgba(39,43,40,.12)';g.fillRect(-145,-223,310,467);g.fillStyle=P.cream;g.fillRect(-155,-235,310,467);g.fillStyle=P.ink;g.fillRect(-136,-216,272,428);
g.fillStyle=P.sage;g.beginPath();g.moveTo(-136,42);g.lineTo(136,42);g.lineTo(136,212);g.lineTo(-136,212);g.closePath();g.fill();
g.fillStyle=P.paper;g.beginPath();g.moveTo(-69,44);g.lineTo(-69,-106);g.bezierCurveTo(-69,-179,62,-179,62,-106);g.lineTo(62,44);g.closePath();g.fill();
g.fillStyle=P.sand;g.fillRect(-136,41,272,3);line([[0,44],[0,212]],P.ink,.8,.25);line([[-136,130],[136,130]],P.ink,.8,.25);
let positions=[-48,30,-48],px=positions[step];ellipse(px,114,24,10,'rgba(39,43,40,.18)');g.fillStyle=P.rust;g.fillRect(px-17,66,34,47);ellipse(px,67,17,5,'#c57b54');
if(step>0){g.strokeStyle=P.paper;g.lineWidth=1;g.setLineDash([2,5]);g.strokeRect(-66,65,36,50);g.setLineDash([]);}
g.restore();}
scene(359,377,-.14,0);scene(638,360,0,1);scene(915,376,.14,2);finish('mapa');
