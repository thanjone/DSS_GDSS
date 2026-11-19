import {useStore} from '../store';
import {Num} from '../components/Ui';
import {K} from '../data';
import {fmt} from '../lib/mcdm';
export default function Setup(){
 const {s,set,d,reset}=useStore();const {alts,cr,dms,M}=s,{nA,nC}=d,F=d.Fc;
 const addAlt=()=>set({alts:[...alts,'Alternative '+(nA+1)],M:M.map(m=>[...m,cr.map(()=>'')])});
 const delAlt=i=>{if(nA<=2)return;set({alts:alts.filter((_,x)=>x!==i),M:M.map(m=>m.filter((_,x)=>x!==i))});};
 const addCrit=()=>set({cr:[...cr,{n:'New criterion',t:'benefit',v:Math.max(...cr.map(c=>c.v))+1,lo:1,hi:5}],M:M.map(m=>m.map(r=>[...r,''])),dms:dms.map(x=>({...x,vp:[...x.vp,Math.max(...x.vp)+1]}))});
 const delCrit=j=>{if(nC<=2)return;set({cr:cr.filter((_,x)=>x!==j),M:M.map(m=>m.map(r=>r.filter((_,x)=>x!==j))),dms:dms.map(x=>({...x,vp:x.vp.filter((_,y)=>y!==j)}))});};
 const addDM=()=>set({dms:[...dms,{n:'DM'+(dms.length+1),w:0,vp:cr.map(c=>c.v),pin:String(1000+Math.floor(Math.random()*9000)),sub:false}],M:[...M,alts.map(()=>cr.map(()=>''))]});
 const delDM=k=>{if(dms.length<=1)return;set({dms:dms.filter((_,x)=>x!==k),M:M.filter((_,x)=>x!==k)});};
 const upC=(j,p)=>set({cr:cr.map((c,x)=>x===j?{...c,...p}:c)});
 const upD=(k,p)=>set({dms:dms.map((x,y)=>y===k?{...x,...p}:x)});
 return <div>
  <h2>Alternatives</h2>
  <div className="box sc"><table><tbody>{alts.map((a,i)=><tr key={i}><td>A{i+1}</td><td><input style={{textAlign:'left'}} value={a} onChange={e=>set({alts:alts.map((x,y)=>y===i?e.target.value:x)})} aria-label="alternative name"/></td><td><button className="ghost" disabled={nA<=2} onClick={()=>delAlt(i)}>Delete</button></td></tr>)}</tbody></table>
   <p><button className="ghost" onClick={addAlt}>Add alternative</button></p></div>
  <h2>Criteria importance mode</h2>
  <div className="box row"><label>Weights come from<select style={{textAlign:'left'}} value={s.weightMode} onChange={e=>set({weightMode:e.target.value})}><option value="perDM">Each DM’s own FUCOM, then aggregated</option><option value="consensus">One consensus ϖ set (below)</option></select></label>
   <label>Aggregating DM weights<select style={{textAlign:'left'}} disabled={s.weightMode!=='perDM'} value={s.weightAgg} onChange={e=>set({weightAgg:e.target.value})}><option value="wam">Weighted arithmetic mean</option><option value="wgm">Weighted geometric mean</option></select></label></div>
  <h2>Criteria and consensus FUCOM weights</h2>
  <div className="box sc"><table><thead><tr><th>Criterion</th><th>Type</th><th>Consensus ϖ</th><th>Min</th><th>Max</th><th>Weight w</th><th></th></tr></thead><tbody>
   {cr.map((c,j)=><tr key={j}><td style={{display:'flex',gap:6,alignItems:'center'}}>{K(j)}<input style={{textAlign:'left',minWidth:150}} value={c.n} onChange={e=>upC(j,{n:e.target.value})} aria-label="criterion name"/></td>
    <td><select value={c.t} onChange={e=>upC(j,{t:e.target.value})}><option>benefit</option><option>cost</option></select></td>
    <td><Num v={c.v} step="0.5" on={v=>upC(j,{v:v>0?v:1})}/></td><td><Num v={c.lo} on={v=>upC(j,{lo:v})}/></td><td><Num v={c.hi} on={v=>upC(j,{hi:v})}/></td>
    <td>{fmt(F.w[j])}</td><td><button className="ghost" disabled={nC<=2} onClick={()=>delCrit(j)}>Delete</button></td></tr>)}</tbody></table>
   <p><button className="ghost" onClick={addCrit}>Add criterion</button></p>
   <div>One criterion needs ϖ = 1: <b className={F.minOk?'ok':'bad'}>{F.minOk?'OK':'Missing'}</b> · DFC = {fmt(F.dfc,6)}</div>
   <p className="note">Smaller ϖ means more important. Min and Max define the scale accepted in DM input. The consensus ϖ is used in consensus mode, and as the starting value for new DMs.</p></div>
  <h2>Decision makers, weights and PINs</h2>
  <div className="box sc"><table><thead><tr><th>Name</th><th>Authority weight</th><th>PIN</th><th></th></tr></thead><tbody>{dms.map((x,k)=><tr key={k}>
   <td><input style={{textAlign:'left'}} value={x.n} onChange={e=>upD(k,{n:e.target.value})} aria-label="DM name"/></td>
   <td><Num v={x.w} step="0.05" on={v=>upD(k,{w:Math.max(0,v)})}/></td>
   <td><input value={x.pin} onChange={e=>upD(k,{pin:e.target.value})} aria-label="DM PIN"/></td>
   <td><button className="ghost" disabled={dms.length<=1} onClick={()=>delDM(k)}>Delete</button></td></tr>)}</tbody></table>
   <p><button className="ghost" onClick={addDM}>Add DM</button></p>
   <label>Admin PIN<input value={s.adminPin} onChange={e=>set({adminPin:e.target.value})}/></label>
   <p className="note">Weights are normalized to sum 1 (current sum {fmt(d.dws.reduce((a,b)=>a+b,0),2)}).</p></div>
  <button className="ghost" onClick={reset}>Reset everything to report data</button>
 </div>;
}
