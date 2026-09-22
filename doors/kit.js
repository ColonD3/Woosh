// woosh model kit — hand-built, bevelled, vertex-painted models for everything placeable.
// Every model is merged per material (a handful of draw calls each). Tints, worn edges and
// ground-contact AO live in vertex colours, so ONE wood / stone / iron material serves all of them.
export function makeKit(THREE, BGU, tex){
const V3=THREE.Vector3,C=THREE.Color;
let seed=1;const R=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};const rr=(a,b)=>a+(b-a)*R();const reseed=s=>{seed=(Math.abs(s|0)%2147483646)+1};
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_s=new V3(),_p=new V3(),_c=new C();

// ---------- materials ----------
const T=(n,srgb)=>{const t=tex('stylized/kit/'+n+'.webp',srgb);return t};
const mk=(o)=>new THREE.MeshStandardMaterial({vertexColors:true,...o});
const M={
 wood:mk({map:T('wood_c',1),normalMap:T('wood_n'),normalScale:new THREE.Vector2(.7,.7),roughness:.82}),
 stone:mk({map:T('stone_c',1),normalMap:T('stone_n'),normalScale:new THREE.Vector2(.9,.9),roughness:.93}),
 iron:mk({map:T('metal_c',1),normalMap:T('metal_n'),normalScale:new THREE.Vector2(.5,.5),roughness:.42,metalness:.35}),
 cloth:mk({map:T('cloth_c',1),normalMap:T('cloth_n'),normalScale:new THREE.Vector2(.8,.8),roughness:.95}),
 paint:mk({roughness:.55}),
 dark:new THREE.MeshBasicMaterial({color:'#120c09'}),
};
M.woodDS=M.wood.clone();M.woodDS.side=THREE.DoubleSide;

// ---------- geometry helpers ----------
function xf(g,p,r,s){_e.set(r?r[0]:0,r?r[1]:0,r?r[2]:0);_q.setFromEuler(_e);_p.set(p?p[0]:0,p?p[1]:0,p?p[2]:0);if(s==null)_s.set(1,1,1);else if(typeof s==='number')_s.set(s,s,s);else _s.set(s[0],s[1],s[2]);_m.compose(_p,_q,_s);g.applyMatrix4(_m);return g}
function tintOf(t,vary){_c.set(t==null?'#ffffff':t);if(vary){const k=1+rr(-vary,vary);_c.multiplyScalar(k)}return[_c.r,_c.g,_c.b]}
// colour attr for plain geometries
function prep(g,t,vary,wear){if(!g.index){const idx=[];for(let i=0;i<g.attributes.position.count;i++)idx.push(i);g.setIndex(idx)}
 if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
 for(const k of Object.keys(g.attributes))if(!['position','normal','uv','color'].includes(k))g.deleteAttribute(k);
 const n=g.attributes.position.count,[r,gg,b]=tintOf(t,vary);const c=new Float32Array(n*3);for(let i=0;i<n;i++){c[i*3]=r;c[i*3+1]=gg;c[i*3+2]=b}g.setAttribute('color',new THREE.BufferAttribute(c,3));g.clearGroups();return g}
// rounded / bevelled box.  grain: axis (0,1,2) the texture's v runs along. ts: metres per texture tile
function rbox(w,h,d,o={}){const m=o.m??2,n=2*m+1;const hw=[w/2,h/2,d/2];let r=Math.max(.002,Math.min(o.r??.03,hw[0]*.95,hw[1]*.95,hw[2]*.95));
 const g=new THREE.BoxGeometry(1,1,1,n,n,n);const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;const cnt=P.count;
 const col=new Float32Array(cnt*3);const [tr,tg,tb]=tintOf(o.tint,o.vary);const wear=o.wear??.55,ts=o.ts??1,grain=o.grain??1;const uo=o.uo??[R()*3,R()*3];
 const p=[0,0,0],inner=[0,0,0],dv=[0,0,0];
 for(let i=0;i<cnt;i++){p[0]=P.getX(i);p[1]=P.getY(i);p[2]=P.getZ(i);
  for(let a=0;a<3;a++){const idx=Math.round((p[a]+.5)*n);let q=idx<=m?-hw[a]+r*idx/m:hw[a]-r*(n-idx)/m;inner[a]=Math.max(-(hw[a]-r),Math.min(hw[a]-r,q));dv[a]=q-inner[a]}
  const L=Math.hypot(dv[0],dv[1],dv[2])||1;const nx=dv[0]/L,ny=dv[1]/L,nz=dv[2]/L;
  const x=inner[0]+nx*r,y=inner[1]+ny*r,z=inner[2]+nz*r;P.setXYZ(i,x,y,z);N.setXYZ(i,nx,ny,nz);
  const fx=Math.abs(N.getX(i)),fy=Math.abs(N.getY(i));
  // face axis from the ORIGINAL box normal is lost now — use dominant of the analytic normal
  const ax=Math.abs(nx),ay=Math.abs(ny),az=Math.abs(nz);const f=ax>=ay&&ax>=az?0:ay>=az?1:2;const pp=[x,y,z];const oth=[0,1,2].filter(k=>k!==f);
  let u,v;if(oth.includes(grain)){v=pp[grain];u=pp[oth[0]===grain?oth[1]:oth[0]]}else{u=pp[oth[0]];v=pp[oth[1]]}
  U.setXY(i,u/ts+uo[0],v/ts+uo[1]);
  const e=1-Math.max(ax,ay,az);const k=1+wear*e*1.4;col[i*3]=tr*k;col[i*3+1]=tg*k;col[i*3+2]=tb*k}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.clearGroups();return g}
// lathe with bevelled rims.  prof: [[radius,y],...] bottom→top
function lathe(prof,o={}){const seg=o.seg??16;const pts=prof.map(q=>new THREE.Vector2(Math.max(q[0],0),q[1]));const g=new THREE.LatheGeometry(pts,seg,o.phi0??0,o.phiL??Math.PI*2);
 const P=g.attributes.position,U=g.attributes.uv;const ts=o.ts??1;const rmax=Math.max(...prof.map(q=>q[0]));const circ=2*Math.PI*rmax*((o.phiL??Math.PI*2)/(Math.PI*2));
 for(let i=0;i<P.count;i++)U.setXY(i,U.getX(i)*circ/ts,P.getY(i)/ts);
 prep(g,o.tint,o.vary);if(o.wearY){const c=g.attributes.color;for(let i=0;i<P.count;i++){const k=o.wearY(P.getY(i),Math.hypot(P.getX(i),P.getZ(i)));c.setXYZ(i,c.getX(i)*k,c.getY(i)*k,c.getZ(i)*k)}}return g}
function rcyl(r0,r1,h,o={}){const b=Math.min(o.b??.02,h/3,Math.min(r0,r1)*.5);const y=-h/2;
 const prof=o.open?[[r0,y],[r1,-y]]:[[0,y],[r0-b,y],[r0,y+b],[r1,-y-b],[r1-b,-y],[0,-y]];
 return lathe(prof,{...o,wearY:(yy,rad)=>1+(o.wear??.5)*.35*((Math.abs(yy)>h/2-b*1.2&&rad>Math.min(r0,r1)-b*1.5)?1:0)})}
function sph(r,o={}){const g=new THREE.SphereGeometry(r,o.ws??14,o.hs??10);if(o.s)g.scale(...o.s);return prep(g,o.tint,o.vary)}
function tor(R0,r,o={}){const g=new THREE.TorusGeometry(R0,r,o.rs??6,o.ts??24,o.arc??Math.PI*2);return prep(g,o.tint,o.vary)}
function cone(r,h,o={}){const g=new THREE.ConeGeometry(r,h,o.seg??8,1);return prep(g,o.tint,o.vary)}
function densify(pts,closed){const o=[];const n=pts.length;for(let i=0;i<(closed?n:n-1);i++){const a=pts[i],b=pts[(i+1)%n];for(const t of[0,.12,.5,.88])o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t])}if(!closed)o.push(pts[n-1]);return o}
function tube(pts,r,o={}){const cu=new THREE.CatmullRomCurve3(pts.map(p=>new V3(...p)),!!o.closed);const g=new THREE.TubeGeometry(cu,o.seg??Math.max(8,pts.length*6),r,o.rs??6,!!o.closed);return prep(g,o.tint,o.vary)}
// multiply colours by a ground-contact gradient (in the model's space)
function ao(g,y0,h,min=.5){const P=g.attributes.position,c=g.attributes.color;for(let i=0;i<P.count;i++){let t=(P.getY(i)-y0)/h;t=Math.max(0,Math.min(1,t));t=t*t*(3-2*t);const k=min+(1-min)*t;c.setXYZ(i,c.getX(i)*k,c.getY(i)*k,c.getZ(i)*k)}return g}
function merge(list){list=list.filter(Boolean);if(!list.length)return null;return BGU.mergeGeometries(list,false)}
// {mat:[geos]} -> Group of meshes
function assemble(parts,opt={}){const grp=new THREE.Group();for(const k in parts){const g=merge(parts[k]);if(!g)continue;if(opt.ao)ao(g,opt.ao[0],opt.ao[1],opt.ao[2]);const mesh=new THREE.Mesh(g,M[k]||k);mesh.castShadow=opt.cast!==false;mesh.receiveShadow=true;grp.add(mesh)}return grp}
function meshOf(geos,mat,opt={}){const g=merge(geos);if(opt.ao)ao(g,...opt.ao);const m=new THREE.Mesh(g,mat);m.castShadow=opt.cast!==false;m.receiveShadow=true;return m}
const rivet=(p,rad=.022,t='#5a5550')=>xf(sph(rad,{ws:6,hs:4,tint:t,s:[1,.6,1]}),p,[Math.PI/2,0,0]);

// palette
const P={oak:'#c49464',oakD:'#8e6038',oakDD:'#5e3d24',pine:'#d8b07a',iron:'#6c6f73',ironD:'#56595f',stone:'#8f877b',stoneD:'#766f65',rope:'#cdb27c',clay:'#a88f7c',ash:'#3a302a'};

// =====================================================================
// FENCE (one segment, x in [-.5,.5]) + team cap geometry
function fence(){reseed(11);const w=[],cap=[];
 for(const sx of[-.5,.5]){w.push(xf(rbox(.15,.98,.15,{r:.035,tint:P.oakD,grain:1,uo:[0,0]}),[sx,.47,0]));
  cap.push(xf(rbox(.19,.08,.19,{r:.02,tint:'#ffffff',wear:.3}),[sx,.8,0]));cap.push(xf(sph(.06,{ws:10,hs:8,tint:'#ffffff'}),[sx,1.0,0]))}
 for(const [y,dz] of[[.36,.085],[.68,.085]]){w.push(xf(rbox(1.0,.1,.075,{r:.028,tint:P.oak,vary:.1,grain:0,ts:1.2}),[0,y+rr(-.015,.015),dz],[rr(-.05,.05),0,rr(-.02,.02)]))}
 const rope=[];for(const sx of[-.5,.5])for(const y of[.36,.68])rope.push(xf(tor(.095,.016,{tint:P.rope,ts:12,rs:5}),[sx,y,.03],[Math.PI/2,0,0]));
 const fg=merge([...w]);const rg=merge(rope);return{geo:fg,rope:rg,cap:merge(cap)}}

// =====================================================================
// DOOR — returns {g, hinge}. local: door plane z=0, ground y=0, width W
function door(iron,W){reseed(iron?21:22);const g=new THREE.Group(),woodP=[],stoneP=[],ironP=[];
 const LW=W-.24;
 stoneP.push(xf(rbox(W+.7,.2,.78,{r:.05,tint:P.stoneD,vary:.05,m:2}),[0,.02,0]));
 for(const sx of[-1,1]){
  if(iron){stoneP.push(xf(rbox(.3,2.72,.56,{r:.04,tint:'#d8d3c9',vary:.03}),[sx*(W/2+.02),1.36,0]))}
  else{woodP.push(xf(rbox(.26,2.74,.48,{r:.05,tint:P.oakD,vary:.06,grain:1}),[sx*(W/2),1.37,0],[0,0,sx*.006]))
   woodP.push(xf(rbox(.2,.34,.52,{r:.04,tint:P.oakDD}),[sx*(W/2-.02),2.42,0],[0,0,sx*.72]))}}
 if(iron){stoneP.push(xf(rbox(W+.8,.34,.64,{r:.05,tint:'#e6e1d6'}),[0,2.82,0]));ironP.push(xf(rbox(W+.3,.08,.66,{r:.02,tint:P.ironD}),[0,2.62,0]))}
 else{woodP.push(xf(rbox(W+.8,.3,.6,{r:.06,tint:P.oakDD,vary:.05,grain:0,ts:1.4}),[0,2.78,0],[0,0,.012]));
  woodP.push(xf(rbox(W+.5,.12,.56,{r:.03,tint:P.oakD,grain:0}),[0,2.6,0]))}
 const base=assemble({wood:woodP,stone:stoneP,iron:ironP},{ao:[0,.9,.55]});g.add(base);
 const hinge=new THREE.Group();hinge.position.set(-W/2+.12,0,0);g.add(hinge);
 const lw=[],li=[];const cx=LW/2,y0=.08,H=2.36;
 if(!iron){const n=5,pw=LW/n;for(let i=0;i<n;i++){const hh=H-rr(0,.05);lw.push(xf(rbox(pw-.014,hh,.08,{r:.02,tint:i%2?P.oak:P.pine,vary:.1,grain:1,ts:1.3}),[pw*(i+.5),y0+hh/2,0],[0,0,rr(-.004,.004)]))}
  for(const y of[.5,1.95])lw.push(xf(rbox(LW-.08,.15,.055,{r:.02,tint:P.oakD,grain:0}),[cx,y,-.066]));
  const dl=Math.hypot(LW-.2,1.45),da=Math.atan2(1.45,LW-.2);lw.push(xf(rbox(dl,.13,.05,{r:.02,tint:P.oakD,grain:0}),[cx,1.225,-.066],[0,0,da]));
  for(const y of[.5,1.95]){li.push(xf(rbox(LW*.72,.075,.02,{r:.01,tint:P.ironD,wear:.9}),[LW*.36,y,.052]));li.push(xf(rcyl(.04,.04,.18,{tint:P.ironD,seg:10}),[-.02,y,0]));for(let k=0;k<4;k++)li.push(rivet([.1+k*LW*.19,y,.064]))}
  li.push(xf(rbox(.1,.22,.02,{r:.01,tint:P.ironD}),[LW-.2,1.15,.052]));li.push(xf(tor(.07,.013,{tint:P.iron,rs:6,ts:16}),[LW-.2,1.06,.075]))}
 else{li.push(xf(rbox(LW-.02,H,.1,{r:.03,tint:'#8b9197',vary:.03,wear:.9,ts:1.5}),[cx,y0+H/2,0]));
  for(const s of[-1,1]){li.push(xf(rbox(LW-.02,.1,.03,{r:.012,tint:P.ironD,wear:1}),[cx,y0+H/2+s*(H/2-.06),s*0+.055]));li.push(xf(rbox(.1,H-.1,.03,{r:.012,tint:P.ironD,wear:1}),[cx+s*(LW/2-.06),y0+H/2,.055]))}
  for(const y of[.7,1.2,1.7])li.push(xf(rbox(LW-.2,.07,.025,{r:.01,tint:'#7b8187',wear:1}),[cx,y,.06]));
  for(const y of[.18,y0+H-.1])for(let k=0;k<6;k++)li.push(rivet([.1+k*(LW-.2)/5,y,.074],.02,'#9aa0a6'));
  li.push(xf(rbox(.07,.5,.07,{r:.02,tint:'#b0b5ba'}),[LW-.2,1.15,.12]));for(const y of[.95,1.35])li.push(xf(rbox(.05,.05,.1,{r:.01,tint:P.ironD}),[LW-.2,y,.08]))}
 const leaf=assemble({wood:lw,iron:li});hinge.add(leaf);return{g,hinge}}

// =====================================================================
// WALL — local x along length L, height H (centred), thickness T
function wall(L,H,T,concrete,sd){reseed(sd||1);const woodP=[],stoneP=[],ironP=[];const y0=-H/2;
 if(concrete){stoneP.push(rbox(L+T*.6,H,T,{r:.035,tint:'#ddd7cc',vary:.02,ts:2.2,m:1,wear:.3}));
  const nP=Math.max(1,Math.round(L/1.6));for(let i=1;i<nP;i++){const x=-L/2+i*L/nP;for(const s of[-1,1])stoneP.push(xf(rbox(.05,H-.1,.03,{r:.01,tint:'#8e877c',m:1}),[x,0,s*T/2]))}
  for(let i=0;i<nP;i++)for(let j=0;j<Math.floor((H-.6)/.7);j++)for(const s of[-1,1])for(const q of[-.3,.3])stoneP.push(xf(rcyl(.025,.025,.02,{tint:'#77706a',seg:8}),[-L/2+(i+.5)*L/nP+q*L/nP,y0+.75+j*.7,s*(T/2+.004)],[Math.PI/2,0,0]));
  stoneP.push(xf(rbox(L+T*.9,.18,T*1.35,{r:.04,tint:'#eeeae1',m:2}),[0,H/2+.05,0]));
  stoneP.push(xf(rbox(L+T*.8,.32,T*1.28,{r:.05,tint:'#a9a296',m:2}),[0,y0+.52,0]));
  return assemble({stone:stoneP},{ao:[y0+.3,1.2,.6]})}
 // mortar core
 stoneP.push(rbox(L+T*.3,H-.1,T*.78,{r:.03,tint:'#6d665c',m:1,wear:0}));
 const top=H/2-.22,x0=-L/2+.05,x1=L/2-.05;let y=y0+.15,row=0;
 while(y<top-.12){const ch=Math.min(rr(.32,.42),top-y);let x=x0+(row%2?-rr(.1,.25):0);
  while(x<x1-.05){let w=rr(.42,.78);const xa=Math.max(x,x0),xb=Math.min(x+w,x1);if(xb-xa>.12){const tint=[P.stone,'#81796e','#9a9183','#7a7369'][Math.floor(R()*4)];
    stoneP.push(xf(rbox(xb-xa-.035,ch-.035,T*rr(.95,1.08),{r:.055,m:1,tint,vary:.07,ts:.9,wear:.6}),[(xa+xb)/2,y+ch/2,rr(-.018,.018)],[rr(-.02,.02),rr(-.02,.02),rr(-.015,.015)]))}x+=w}
  y+=ch;row++}
 for(const sx of[-1,1])woodP.push(xf(rbox(.3,H+.15,T*1.12,{r:.05,tint:P.oakD,vary:.06,grain:1}),[sx*(L/2+T*.15),.07,0]));
 woodP.push(xf(rbox(L+T*.9,.22,T*1.2,{r:.05,tint:P.oakDD,vary:.05,grain:0,ts:1.6}),[0,H/2-.02,0],[0,0,rr(-.006,.006)]));
 for(const sx of[-1,1])for(const yy of[H/2-.02]){ironP.push(xf(rbox(.34,.08,T*1.24,{r:.015,tint:P.ironD}),[sx*(L/2+T*.15),yy,0]))}
 return assemble({stone:stoneP,wood:woodP,iron:ironP},{ao:[y0+.3,1.3,.55]})}

// =====================================================================
// ROOF extras — thatch lip along the eave loop + finial. E: [[x,y,z]...] eave points, apex [cx,ay,cz]
function roofTrim(E,apex,metal,thatchMat,metalMat){const g=new THREE.Group();reseed(E.length*7);
 const lip=densify(E.map(p=>[p[0],p[1]-.02,p[2]]),true);
 if(!metal){const tg=tube(lip,.16,{closed:true,seg:E.length*24,rs:8});const m=new THREE.Mesh(tg,thatchMat);m.castShadow=true;m.receiveShadow=true;g.add(m);
  // second tier of thatch halfway up
  const t2=densify(E.map(p=>[apex[0]+(p[0]-apex[0])*.5,apex[1]+(p[1]-apex[1])*.5+.06,apex[2]+(p[2]-apex[2])*.5]),true);const m2=new THREE.Mesh(tube(t2,.1,{closed:true,seg:E.length*24,rs:7}),thatchMat);m2.castShadow=true;g.add(m2);
  const fp=[xf(rcyl(.09,.12,.7,{tint:P.oakDD,seg:10}),[apex[0],apex[1]+.2,apex[2]]),xf(sph(.14,{tint:P.oakD,ws:12,hs:8}),[apex[0],apex[1]+.6,apex[2]]),xf(tor(.13,.04,{tint:P.rope}),[apex[0],apex[1]+.02,apex[2]],[Math.PI/2,0,0])];
  g.add(meshOf(fp,M.wood))}
 else{const parts=[tube(lip,.07,{closed:true,seg:E.length*20,tint:'#8d959b'})];for(const p of E)parts.push(tube([[p[0],p[1],p[2]],[apex[0],apex[1],apex[2]]],.035,{seg:4,tint:'#9aa2a8'}));
  parts.push(xf(cone(.3,.35,{seg:10,tint:'#7c848a'}),[apex[0],apex[1]+.12,apex[2]]));parts.push(xf(rcyl(.1,.1,.5,{tint:'#6b7278',seg:10}),[apex[0],apex[1]+.4,apex[2]]));parts.push(xf(cone(.18,.12,{seg:10,tint:'#7c848a'}),[apex[0],apex[1]+.7,apex[2]]));
  g.add(meshOf(parts,M.iron))}
 return g}

// =====================================================================
// CHEST — ground at y=0, 1 x .7 footprint. ioMat = the in/out colour material
function chest(ioMat){reseed(31);const w=[],ir=[],io=[];
 w.push(rbox(.94,.46,.64,{r:.02,tint:P.oakDD,wear:0}));xf(w[0],[0,.27,0]);
 for(const[z,ry]of[[.33,0],[-.33,Math.PI]])for(let i=0;i<2;i++)w.push(xf(rbox(.96,.22,.04,{r:.015,tint:i?P.oak:P.pine,vary:.08,grain:0,ts:1.1}),[0,.16+i*.23,z]));
 for(const x of[-.48,.48])for(let i=0;i<2;i++)w.push(xf(rbox(.04,.22,.64,{r:.015,tint:P.oak,vary:.08,grain:2}),[x,.16+i*.23,0]));
 // curved lid out of slats
 const n=6,Rl=.35;for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI;w.push(xf(rbox(1.0,.05,Rl*Math.PI/n+.004,{r:.018,tint:i%2?P.oak:P.pine,vary:.08,grain:0,ts:1.1}),[0,.5+Math.sin(a)*Rl,Math.cos(a)*Rl],[Math.PI/2-a,0,0]))}
 for(const x of[-.49,.49])w.push(xf(lathe([[0,-.02],[Rl+.005,-.02],[Rl+.005,.02],[0,.02]],{seg:14,phiL:Math.PI,phi0:-Math.PI/2,tint:P.oakD}),[x,.5,0],[0,0,Math.PI/2]));
 for(const x of[-.3,.3]){ir.push(xf(tor(Rl+.03,.022,{arc:Math.PI,ts:18,rs:5,tint:P.ironD}),[x,.5,0],[0,Math.PI/2,0]));for(const z of[-.35,.35])ir.push(xf(rbox(.08,.4,.022,{r:.008,tint:P.ironD,wear:1}),[x,.3,z]))}
 for(const x of[-.48,.48])for(const z of[-.33,.33])ir.push(xf(rbox(.07,.46,.07,{r:.015,tint:P.ironD,wear:1}),[x,.26,z]));
 io.push(xf(rbox(.2,.24,.04,{r:.015,tint:'#ffffff'}),[0,.5,.37]));io.push(xf(rbox(1.0,.07,.02,{r:.01,tint:'#ffffff'}),[0,.08,.36]));
 const g=assemble({wood:w,iron:ir},{ao:[0,.45,.55]});const ioM=meshOf(io,ioMat);g.add(ioM);g.add(xf(new THREE.Mesh(new THREE.CircleGeometry(.03,10),M.dark),[0,.47,.393]));return g}

// =====================================================================
// COOKER — clay/stone kiln. returns {g, fire}
function cooker(fireMat){reseed(41);const st=[],cl=[],w=[];
 // stone plinth ring
 const ring=(r,y,n,h)=>{for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rr(-.05,.05);const sw=2*Math.PI*r/n;st.push(xf(rbox(sw*.92,h,.32,{r:.06,m:1,tint:[P.stone,'#a79f92','#c3baab'][i%3],vary:.08,ts:.8}),[Math.sin(a)*r,y,Math.cos(a)*r],[rr(-.05,.05),a,rr(-.04,.04)]))}};
 ring(.66,.16,11,.34);ring(.64,.46,11,.28);
 cl.push(xf(lathe([[.62,.58],[.7,.66],[.66,.95],[.52,1.22],[.3,1.42],[.12,1.5],[0,1.52]],{seg:20,tint:P.clay,vary:.03,ts:1.2}),[0,0,0]));
 // brick arch round the mouth
 const na=7;for(let i=0;i<na;i++){const a=(i+.5)/na*Math.PI;st.push(xf(rbox(.13,.2,.2,{r:.03,m:1,tint:'#b86b4b',vary:.1}),[Math.cos(a)*.36,.62+Math.sin(a)*.36,.62],[0,0,a-Math.PI/2]))}
 const g=assemble({stone:st,cloth:[],wood:w},{ao:[0,.6,.5]});const clayM=meshOf(cl,M.stone,{ao:[.55,.5,.7]});g.add(clayM);
 const mouth=new THREE.Mesh(new THREE.CircleGeometry(.31,18,0,Math.PI),M.dark);mouth.position.set(0,.62,.66);g.add(mouth);
 // chimney
 const ch=[xf(rcyl(.16,.2,.62,{tint:'#9f978b',seg:12,ts:.8}),[.3,1.55,-.18]),xf(rcyl(.22,.22,.1,{tint:'#8a8276',seg:12}),[.3,1.9,-.18])];g.add(meshOf(ch,M.stone));
 // log pile
 const logs=[];for(const[x,y,z]of[[-.62,.12,.55],[-.44,.12,.62],[-.53,.3,.58]])logs.push(xf(rcyl(.1,.1,.6,{tint:P.oakD,vary:.12,seg:10,ts:.7}),[x,y,z],[Math.PI/2,rr(-.3,.3)+.9,0]));
 g.add(meshOf(logs,M.wood));
 const fire=new THREE.Mesh(new THREE.IcosahedronGeometry(.2,2),fireMat);fire.position.set(0,.62,.5);fire.scale.set(1,.6,.5);g.add(fire);
 return{g,fire}}

// =====================================================================
// GEAR — extruded, bevelled, with spokes
function gear(r,teeth,th=.14){const s=new THREE.Shape();const ro=r,ri=r*.82;const N=teeth*4;for(let i=0;i<N;i++){const a=i/N*Math.PI*2,k=i%4;const rad=(k===1||k===2)?ro:ri;const x=Math.cos(a)*rad,y=Math.sin(a)*rad;i?s.lineTo(x,y):s.moveTo(x,y)}s.closePath();
 const nh=5;for(let i=0;i<nh;i++){const a0=i/nh*Math.PI*2+.18,a1=(i+1)/nh*Math.PI*2-.18;const h=new THREE.Path();const r0=r*.3,r1=r*.66;h.moveTo(Math.cos(a0)*r0,Math.sin(a0)*r0);h.absarc(0,0,r1,a0,a1,false);h.lineTo(Math.cos(a1)*r0,Math.sin(a1)*r0);h.absarc(0,0,r0,a1,a0,true);s.holes.push(h)}
 const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:true,bevelThickness:.02,bevelSize:.015,bevelSegments:2,curveSegments:10});g.translate(0,0,-th/2);g.scale(1,1,1);
 const P2=g.attributes.position,U=g.attributes.uv;for(let i=0;i<U.count;i++)U.setXY(i,P2.getX(i)*1.5,P2.getY(i)*1.5);
 prep(g,'#aeb4ba');const hub=xf(rcyl(r*.26,r*.26,th+.1,{tint:'#8b9197',seg:14}),null,[Math.PI/2,0,0]);return merge([g,hub])}

// =====================================================================
// DRILL — returns {g, gear, crank, shaft} at the same pivots the game animates
function drill(vineMat){reseed(51);const w=[],ir=[];
 for(let i=0;i<4;i++)w.push(xf(rbox(1.5,.1,.26,{r:.02,tint:i%2?P.oak:P.pine,vary:.08,grain:0,ts:1.3}),[0,.1,-.4+i*.27]));
 for(const x of[-.6,.6])w.push(xf(rbox(.12,.12,1.14,{r:.025,tint:P.oakDD}),[x,.04,0]));
 for(const x of[-.55,.55]){w.push(xf(rbox(.13,1.55,.13,{r:.03,tint:P.oakD,vary:.06,grain:1}),[x,.88,-.2]));w.push(xf(rbox(.1,.7,.1,{r:.025,tint:P.oakD,grain:1}),[x,.5,.05],[.65,0,0]))}
 w.push(xf(rbox(1.3,.12,.14,{r:.03,tint:P.oakDD,grain:0}),[0,1.62,-.2]));
 ir.push(xf(rbox(.46,.16,.46,{r:.03,tint:P.ironD,wear:1}),[.4,.38,.25]));ir.push(xf(rbox(.4,.06,.08,{r:.015,tint:P.ironD}),[.4,.46,-.02]));
 for(const x of[-.55,.55])for(const y of[.5,1.62])ir.push(rivet([x,y,-.13],.025));
 const g=assemble({wood:w,iron:ir},{ao:[0,.5,.55]});
 const gr=new THREE.Mesh(gear(.45,12),M.iron);gr.position.set(-.25,1.25,-.2);gr.castShadow=true;g.add(gr);
 const crank=new THREE.Group();crank.position.set(.4,.95,-.2);crank.add(meshOf([xf(rbox(.07,.36,.07,{r:.02,tint:P.ironD}),[0,.17,0]),xf(rcyl(.1,.1,.14,{tint:'#8b9197',seg:12}),null,[Math.PI/2,0,0]),xf(rcyl(.035,.035,.2,{tint:P.oakD,seg:8}),[0,.34,.1],[Math.PI/2,0,0])],M.iron));g.add(crank);
 const belt=new THREE.Mesh(tor(.45,.035,{rs:6,ts:28,tint:'#ffffff'}),vineMat);belt.position.set(.08,1.1,-.2);belt.scale.set(1.5,.55,1);belt.rotation.z=-.35;g.add(belt);
 // auger shaft
 const sp=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*6;sp.push([Math.cos(a)*.09,-.62+t*.6,Math.sin(a)*.09])}
 const shaftGeo=[rcyl(.06,.06,1.1,{tint:'#9aa1a7',seg:10}),tube(sp,.025,{seg:120,rs:5,tint:'#b7bdc2'}),xf(cone(.08,.2,{seg:10,tint:'#7b8288'}),[0,-.68,0],[Math.PI,0,0])];
 const shaft=meshOf(shaftGeo,M.iron);shaft.position.set(.4,.55,.25);g.add(shaft);
 return{g,gear:gr,crank,shaft}}

// =====================================================================
// MIXER — stave barrel. returns {g, paddle, mix}
function mixer(mixMat){reseed(61);const w=[],ir=[];const prof=y=>.43+.07*Math.sin(Math.PI*y/.95);
 const ns=16;for(let i=0;i<ns;i++){const pr=[];for(let k=0;k<=6;k++){const y=.05+k/6*.92;pr.push([prof(y-.05),y])}
  w.push(lathe(pr,{seg:2,phi0:i/ns*Math.PI*2+.01,phiL:Math.PI*2/ns-.02,tint:i%2?P.oak:P.pine,vary:.1,ts:1}))}
 const inner=[];{const pr=[];for(let k=6;k>=0;k--){const y=.05+k/6*.92;pr.push([prof(y-.05)-.035,y])}inner.push(lathe(pr,{seg:24,tint:P.oakDD}))}
 const rim=[xf(tor(prof(.92)-.02,.028,{ts:32,rs:5,tint:P.oakD}),[0,.97,0],[Math.PI/2,0,0])];
 for(const y of[.18,.5,.84])ir.push(xf(tor(prof(y-.05)+.012,.022,{ts:36,rs:5,tint:P.ironD}),[0,y,0],[Math.PI/2,0,0]));
 const g=new THREE.Group();g.add(meshOf(w,M.wood,{ao:[0,.6,.55]}),meshOf([...inner,...rim],M.woodDS),meshOf(ir,M.iron));
 const bottom=new THREE.Mesh(new THREE.CircleGeometry(.43,18).rotateX(-Math.PI/2),M.dark);bottom.position.y=.06;g.add(bottom);
 const mix=new THREE.Mesh(new THREE.CircleGeometry(.47,24).rotateX(-Math.PI/2),mixMat);mix.position.y=.82;g.add(mix);
 const paddle=new THREE.Group();paddle.position.y=.6;
 paddle.add(meshOf([xf(rcyl(.035,.035,1.2,{tint:'#8b9197',seg:8}),[0,.3,0]),xf(rbox(.5,.05,.05,{r:.015,tint:P.ironD}),[.25,.88,0]),xf(rcyl(.04,.04,.18,{tint:P.oakD,seg:8}),[.5,.97,0])],M.iron));
 paddle.add(meshOf([xf(rbox(.62,.26,.05,{r:.02,tint:P.pine,grain:0}),[0,-.05,0]),xf(rbox(.05,.26,.62,{r:.02,tint:P.pine}),[0,-.05,0])],M.wood));
 g.add(paddle);return{g,paddle,mix}}

// =====================================================================
// TORCH (instanced): stick geometry + flame geometry
function torch(){reseed(71);const stick=merge([xf(rcyl(.035,.05,.8,{tint:P.oakD,seg:7,ts:.5}),[0,.4,0]),xf(rcyl(.075,.06,.2,{tint:'#5a4436',seg:9,ts:.3,b:.03}),[0,.86,0]),xf(tor(.065,.012,{tint:P.ironD,ts:12,rs:4}),[0,.78,0],[Math.PI/2,0,0])]);
 const fl=new THREE.IcosahedronGeometry(.13,2);{const p=fl.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);const k=1-Math.max(0,y)/.13*.55;p.setXYZ(i,p.getX(i)*k,y*1.7+.02,p.getZ(i)*k)}fl.computeVertexNormals()}
 return{stick,flame:fl}}

// =====================================================================
// ITEMS
function rockItem(){const g=new THREE.IcosahedronGeometry(.22,1);const p=g.attributes.position;reseed(81);const v=new V3();
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const k=1+.18*Math.sin(v.x*17+1)*Math.sin(v.y*13+2)*Math.sin(v.z*11+3);v.multiplyScalar(k);v.y*=.8;p.setXYZ(i,v.x,v.y,v.z)}
 const q=BGU.mergeVertices(g.deleteAttribute('normal').deleteAttribute('uv'));q.computeVertexNormals();const U=[];for(let i=0;i<q.attributes.position.count;i++)U.push(q.attributes.position.getX(i)*3,q.attributes.position.getY(i)*3);q.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));return prep(q,'#a8a39b')}
function sack(t){reseed(82);const prof=[[0,-.16],[.12,-.155],[.19,-.1],[.2,0],[.16,.08],[.07,.13],[.05,.16],[.08,.2],[.06,.23],[0,.23]];const g=lathe(prof,{seg:14,tint:t,ts:.4});
 const P2=g.attributes.position;for(let i=0;i<P2.count;i++){const a=Math.atan2(P2.getZ(i),P2.getX(i));const k=1+.06*Math.sin(a*5);P2.setX(i,P2.getX(i)*k);P2.setZ(i,P2.getZ(i)*k)}g.computeVertexNormals();
 const tie=xf(tor(.055,.018,{tint:P.rope,ts:12,rs:5}),[0,.15,0],[Math.PI/2,0,0]);return merge([g,tie])}
function bomb(){reseed(83);return merge([sph(.22,{ws:18,hs:14,tint:'#34333c'}),xf(rcyl(.075,.08,.08,{tint:'#6a6c72',seg:10}),[0,.22,0]),xf(tor(.08,.014,{tint:'#8a8c92',ts:14,rs:4}),[0,.26,0],[Math.PI/2,0,0]),tube([[0,.26,0],[.02,.32,0],[.06,.36,.01],[.1,.37,.02]],.014,{tint:P.rope,seg:10,rs:4})])}

return{M,P,xf,rbox,rcyl,lathe,sph,tor,cone,tube,merge,assemble,meshOf,prep,ao,reseed,
 fence,door,wall,roofTrim,chest,cooker,gear,drill,mixer,torch,rockItem,sack,bomb}}
