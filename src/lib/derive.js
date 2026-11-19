import {fucom,aggregate,marcos,topsis,saw,spearman} from './mcdm';
import {K} from '../data';
export function aggW(dmW,dw,kind){
 const t=dw.reduce((a,b)=>a+b,0),a=dw.map(x=>x/t),n=dmW[0].length;
 const w=[...Array(n)].map((_,j)=>kind==='wgm'?dmW.reduce((p,m,d)=>p*Math.pow(m[j],a[d]),1):dmW.reduce((s,m,d)=>s+a[d]*m[j],0));
 const s=w.reduce((x,y)=>x+y,0);return w.map(x=>x/s);
}
export function derive(s){
 const {alts,cr,dms,M}=s;const nA=alts.length,nC=cr.length,types=cr.map(c=>c.t),dws=dms.map(x=>x.w);
 const mode=s.weightMode||'perDM',kind=s.weightAgg||'wam';
 const okc=(d,i,j)=>{const v=M[d]&&M[d][i]?M[d][i][j]:'';const x=parseFloat(v),c=cr[j];return v!==''&&v!==undefined&&isFinite(x)&&x>=c.lo&&x<=c.hi;};
 const stat=dms.map((_,d)=>{let n=0;alts.forEach((_,i)=>cr.forEach((_,j)=>{if(okc(d,i,j))n++;}));return n;});
 const total=nA*nC,Fc=fucom(cr.map(c=>c.v));
 const dmF=dms.map(x=>fucom(x.vp));
 const wOk=dms.map((x,k)=>x.vp.length===nC&&x.vp.every(v=>v>=1)&&dmF[k].minOk);
 const done=dms.map((_,k)=>stat[k]===total&&(mode==='consensus'||wOk[k]));
 const gw=dw=>mode==='perDM'?aggW(dmF.map(f=>f.w),dw,kind):Fc.w;
 const issues=[];
 if(nA<2)issues.push('Add at least 2 alternatives.');
 if(nC<2)issues.push('Add at least 2 criteria.');
 if(mode==='consensus'&&!Fc.minOk)issues.push('Consensus FUCOM: one criterion must have ϖ = 1.');
 if(dws.reduce((a,b)=>a+b,0)<=0)issues.push('DM weights must sum to more than 0.');
 dms.forEach((x,k)=>{
  if(stat[k]<total)issues.push(x.n+': '+(total-stat[k])+' cells are empty or outside the allowed scale.');
  if(mode==='perDM'&&!wOk[k])issues.push(x.n+': criteria importance ϖ is invalid (every ϖ ≥ 1 and one must equal 1).');});
 const ready=issues.length===0;let calc=null,order=[],F={w:[],dfc:Fc.dfc,minOk:Fc.minOk};
 if(ready){const w=gw(dws);F={w,dfc:Fc.dfc,minOk:Fc.minOk};
  const X=M.map(m=>m.map(r=>r.map(parseFloat)));const G=aggregate(X,dws);
  calc={X,G,R:marcos(G,w,types),T:topsis(G,w,types),S:saw(G,w,types),per:X.map((x,k)=>marcos(x,mode==='perDM'?dmF[k].w:w,types))};
  order=alts.map((_,i)=>i).sort((a,b)=>calc.R.rows[b].f-calc.R.rows[a].f);}
 return{nA,nC,types,dws,okc,stat,total,F,Fc,dmF,wOk,done,mode,kind,gw,issues,ready,calc,order};
}
export function sensitivity(s,d){
 const {alts,cr,dms}=s,{calc,F,dws,types,nC,gw,dmF,mode}=d;if(!calc)return[];
 const sc=[{n:'S0 Base',w:F.w,dw:dws},{n:'S1 Equal criteria weights',w:cr.map(()=>1/nC),dw:dws}];
 cr.forEach((c,k)=>{const w=F.w.map((x,j)=>j===k?x*1.5:x),t=w.reduce((a,b)=>a+b,0);sc.push({n:'S'+(k+2)+' '+K(k)+' weight +50%',w:w.map(x=>x/t),dw:dws});});
 if(nC===5)sc.push({n:'S7 Academic priority (C1>C4>C2>C3>C5)',w:fucom([1,2,3,1.5,4]).w,dw:dws});
 sc.push({n:'B0 Base DM weights',dw:dws},{n:'B1 Equal DM weights',dw:dms.map(()=>1)});
 if(dms.length>1)dms.forEach((x,k)=>sc.push({n:'B'+(k+2)+' '+x.n.split(' ·')[0]+' dominant 60%',dw:dms.map((_,y)=>y===k?0.6:0.4/(dms.length-1))}));
 return sc.map(x=>{const w=x.w||gw(x.dw),r=marcos(aggregate(calc.X,x.dw),w,types);return{n:x.n,rk:r.rk,top:alts[r.rk.indexOf(1)],rho:spearman(calc.R.rk,r.rk)};});
}
