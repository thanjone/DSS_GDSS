import {useStore} from '../store';
import {Bar} from '../components/Ui';
import {K,COL} from '../data';
import {Kpi} from '../components/Ui';
import {RankChart,GroupBars,WeightPie,DmRadar} from '../components/Charts';
import {kendallW,fmt,spearman} from '../lib/mcdm';
export default function Results(){
 const {s,d}=useStore();const {alts,cr,dms}=s,{calc,order,F}=d;
 if(!calc)return <div className="box"><b className="bad">Results are blocked until the input is valid:</b><ul>{d.issues.map((x,i)=><li key={i}>{x}</li>)}</ul></div>;
 const R=calc.R,T=calc.T,S=calc.S;
 return <div>
  <div className="kpis"><Kpi l="Top alternative" v={alts[order[0]]} s={'f(K) = '+fmt(R.rows[order[0]].f)}/><Kpi l="Lead over rank 2" v={fmt(R.rows[order[0]].f-R.rows[order[1]].f)} s={R.rows[order[0]].f-R.rows[order[1]].f<0.01?'Close call':'Clear margin'}/><Kpi l="ρ vs TOPSIS" v={fmt(spearman(R.rk,T.rk),2)} s="rank agreement"/><Kpi l="Top criterion" v={'C'+(F.w.indexOf(Math.max(...F.w))+1)} s={fmt(Math.max(...F.w))}/></div>
  <div className="grid2"><div className="box"><h3>Final ranking · f(K)</h3><RankChart data={order.map(i=>({name:alts[i],f:+R.rows[i].f.toFixed(4)}))}/></div>
   <div className="box"><h3>Group criteria weights</h3><WeightPie data={cr.map((c,j)=>({name:K(j)+' '+c.n,w:F.w[j]}))}/></div>
   <div className="box"><h3>Weights by DM</h3><GroupBars data={cr.map((c,j)=>({name:K(j),...Object.fromEntries(dms.map((x,k)=>[x.n.split(' ·')[0],d.dmF[k].w[j]])),Group:F.w[j]}))} keys={[...dms.map(x=>x.n.split(' ·')[0]),'Group']}/></div>
   <div className="box"><h3>Preference comparison between DMs</h3><DmRadar data={alts.map((a,i)=>({name:a.split(' (')[0],...Object.fromEntries(dms.map((x,k)=>[x.n.split(' ·')[0],calc.per[k].rows[i].f]))}))} keys={dms.map(x=>x.n.split(' ·')[0])}/></div></div>
  <h2>Final ranking (MARCOS)</h2>
  <div className="box sc"><table><thead><tr><th>Rank</th><th>Alternative</th><th>f(K)</th><th></th><th>TOPSIS rank</th><th>SAW (min–max) rank</th></tr></thead><tbody>
   {order.map((i,p)=><tr key={i} className={p===0?'top':''}><td>{R.rk[i]}</td><td>{alts[i]}</td><td>{fmt(R.rows[i].f)}</td><td style={{width:'30%'}}><Bar p={R.rows[i].f}/></td><td>{T.rk[i]}</td><td>{S.rk[i]}</td></tr>)}</tbody></table></div>
  <p className="note">Spearman ρ MARCOS vs TOPSIS: {fmt(spearman(R.rk,T.rk),2)} · vs SAW min–max: {fmt(spearman(R.rk,S.rk),2)}.{R.rows[order[0]].f-R.rows[order[1]].f<0.01&&<b className="bad"> Lead of rank 1 over rank 2 is under 0.01: a close call.</b>}</p>
  <h2>Agreement between DMs</h2>
  <div className="box sc"><table><thead><tr><th>Pair</th><th>Spearman ρ</th></tr></thead><tbody>{dms.flatMap((x,a)=>dms.slice(a+1).map((y,b)=><tr key={a+'-'+b}><td>{x.n.split(' ·')[0]} vs {y.n.split(' ·')[0]}</td><td>{fmt(spearman(calc.per[a].rk,calc.per[a+b+1].rk),2)}</td></tr>))}</tbody></table>
   <p className="note">Kendall’s W (all DMs) = {fmt(kendallW(calc.per.map(p=>p.rk)),4)}. Each DM is ranked with their own matrix and own FUCOM weights, as in the Excel sheet Kesepakatan_DM.</p></div>
  <h2>Criteria weights: each DM and the group</h2>
  <div className="box sc"><table><thead><tr><th>Criterion</th>{d.mode==='perDM'&&dms.map((x,k)=><th key={k}>{x.n.split(' ·')[0]}</th>)}<th>Group w</th>{d.mode==='perDM'&&<th>Spread</th>}<th></th></tr></thead><tbody>
   {cr.map((c,j)=>{const col=d.dmF.map(f=>f.w[j]);return <tr key={j}><td>{K(j)} · {c.n}</td>{d.mode==='perDM'&&col.map((x,k)=><td key={k}>{fmt(x)}</td>)}<td>{fmt(F.w[j])}</td>{d.mode==='perDM'&&<td>{fmt(Math.max(...col)-Math.min(...col))}</td>}<td style={{width:'25%'}}><Bar p={F.w[j]/Math.max(...F.w)}/></td></tr>;})}
   {d.mode==='perDM'&&<tr><td>DFC (consistency gap)</td>{d.dmF.map((f,k)=><td key={k}>{fmt(f.dfc,4)}</td>)}<td></td><td></td><td></td></tr>}</tbody></table>
   <p className="note">{d.mode==='perDM'?'Each DM’s weights come from their own FUCOM input. The group weight is the weighted '+(d.kind==='wgm'?'geometric':'arithmetic')+' mean using DM authority weights. Each DM’s score below uses that DM’s own weights. Spread is the largest minus the smallest DM weight: a high spread marks a criterion the DMs disagree on.':'Consensus mode: one ϖ set from Setup is used for everyone.'}</p></div>
  <h2>Group matrix (weighted mean of DMs)</h2>
  <div className="box sc"><table><thead><tr><th>Alternative</th>{cr.map((c,j)=><th key={j}>{K(j)}</th>)}</tr></thead><tbody>{alts.map((a,i)=><tr key={i}><td>{a}</td>{calc.G[i].map((x,j)=><td key={j}>{x>=1000?Math.round(x).toLocaleString('en-US'):fmt(x,3)}</td>)}</tr>)}</tbody></table></div>
  <h2>Normalized matrix and utility degrees</h2>
  <div className="box sc"><table><thead><tr><th>Alternative</th>{cr.map((c,j)=><th key={j}>n {K(j)}</th>)}<th>Si</th><th>K−</th><th>K+</th></tr></thead><tbody>{alts.map((a,i)=><tr key={i}><td>{a}</td>{R.N[i].map((x,j)=><td key={j}>{fmt(x)}</td>)}<td>{fmt(R.rows[i].S)}</td><td>{fmt(R.rows[i].km)}</td><td>{fmt(R.rows[i].kp)}</td></tr>)}</tbody></table></div>
  <h2>Score per DM and preference comparison</h2>
  <div className="box sc"><table><thead><tr><th>Alternative</th>{dms.map((x,k)=><th key={k}>{x.n.split(' ·')[0]} f(K) · rank</th>)}<th>Preference comparison</th></tr></thead><tbody>
   {alts.map((a,i)=><tr key={i}><td>{a}</td>{dms.map((x,k)=><td key={k}>{fmt(calc.per[k].rows[i].f)} · {calc.per[k].rk[i]}</td>)}<td style={{minWidth:180}}>{dms.map((x,k)=><Bar key={k} p={calc.per[k].rows[i].f} c={COL[k%5]}/>)}</td></tr>)}</tbody></table>
   <div className="note" style={{display:'flex',gap:12,flexWrap:'wrap'}}>{dms.map((x,k)=><span key={k}><b style={{color:COL[k%5]}}>■</b> {x.n}</span>)}</div></div>
 </div>;
}
