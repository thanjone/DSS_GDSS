export const fmt=(x,d=4)=>Number(x).toFixed(d);
export const rank=a=>a.map(x=>1+a.filter(y=>y>x).length);

export function fucom(vp){const inv=vp.map(v=>1/v),s=inv.reduce((a,b)=>a+b,0);const w=inv.map(x=>x/s);
 const o=vp.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
 let dfc=0;for(let a=0;a<o.length-1;a++){const phi=vp[o[a+1]]/vp[o[a]];dfc=Math.max(dfc,Math.abs(w[o[a]]/w[o[a+1]]-phi));}
 for(let a=0;a<o.length-2;a++){const phi=(vp[o[a+1]]/vp[o[a]])*(vp[o[a+2]]/vp[o[a+1]]);dfc=Math.max(dfc,Math.abs(w[o[a]]/w[o[a+2]]-phi));}
 return{w,dfc,order:o,minOk:Math.min(...vp)===1};}
export function aggregate(M,dw){const s=dw.reduce((a,b)=>a+b,0);return M[0].map((r,i)=>r.map((_,j)=>M.reduce((a,m,d)=>a+dw[d]*m[i][j],0)/s));}
export function marcos(X,w,t){const n=X[0].length;
 const col=j=>X.map(r=>r[j]);
 const ai=[...Array(n)].map((_,j)=>t[j]==='benefit'?Math.max(...col(j)):Math.min(...col(j)));
 const aai=[...Array(n)].map((_,j)=>t[j]==='benefit'?Math.min(...col(j)):Math.max(...col(j)));
 const nm=(x,j)=>t[j]==='benefit'?x/ai[j]:ai[j]/x;
 const S=X.map(r=>r.reduce((a,x,j)=>a+nm(x,j)*w[j],0));
 const Saai=aai.reduce((a,x,j)=>a+nm(x,j)*w[j],0),Sai=w.reduce((a,b)=>a+b,0);
 const rows=S.map(s=>{const km=s/Saai,kp=s/Sai,fm=kp/(kp+km),fp=km/(kp+km);return{S:s,km,kp,f:(kp+km)/(1+(1-fp)/fp+(1-fm)/fm)};});
 return{rows,rk:rank(rows.map(r=>r.f)),N:X.map(r=>r.map((x,j)=>nm(x,j)))};}
export function topsis(X,w,t){const n=X[0].length;
 const nrm=[...Array(n)].map((_,j)=>Math.sqrt(X.reduce((a,r)=>a+r[j]**2,0)));
 const V=X.map(r=>r.map((x,j)=>x/nrm[j]*w[j]));
 const vc=j=>V.map(r=>r[j]);
 const pos=[...Array(n)].map((_,j)=>t[j]==='benefit'?Math.max(...vc(j)):Math.min(...vc(j)));
 const neg=[...Array(n)].map((_,j)=>t[j]==='benefit'?Math.min(...vc(j)):Math.max(...vc(j)));
 const d=(r,p)=>Math.sqrt(r.reduce((a,x,j)=>a+(x-p[j])**2,0));
 const cc=V.map(r=>d(r,neg)/(d(r,pos)+d(r,neg)));return{cc,rk:rank(cc)};}
export function spearman(a,b){const n=a.length;return 1-6*a.reduce((s,x,i)=>s+(x-b[i])**2,0)/(n*(n*n-1));}


export function saw(X,w,t){const n=X[0].length;const sc=X.map(()=>0);
 for(let j=0;j<n;j++){const c=X.map(r=>r[j]),mx=Math.max(...c),mn=Math.min(...c),R=mx-mn||1;
  X.forEach((r,i)=>{sc[i]+=w[j]*(t[j]==='benefit'?(r[j]-mn)/R:(mx-r[j])/R);});}
 return{sc,rk:rank(sc)};}

export function kendallW(R){const m=R.length,n=R[0].length,rs=R[0].map((_,i)=>R.reduce((a,r)=>a+r[i],0)),mu=rs.reduce((a,b)=>a+b,0)/n,S=rs.reduce((a,x)=>a+(x-mu)**2,0);return m>1?12*S/(m*m*(n**3-n)):1;}
