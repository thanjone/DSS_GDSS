import {useStore} from '../store';
import {Num} from './Ui';
import {K} from '../data';
import {fmt} from '../lib/mcdm';
export default function WeightForm({dm,locked}){
 const {s,set,d}=useStore();const {cr}=s,me=s.dms[dm],f=d.dmF[dm],ok=d.wOk[dm];
 const setV=(j,v)=>set({dms:s.dms.map((x,i)=>i===dm?{...x,vp:x.vp.map((y,z)=>z===j?v:y)}:x)});
 return <div className="box sc">
  <p className="note">How important is each criterion to you? Give your most important criterion 1. Give any other criterion a larger number: 2 means half as important, 3 means a third as important, and so on.</p>
  <table><thead><tr><th>Criterion</th><th>Type</th><th>Your ϖ</th><th>Your weight</th></tr></thead><tbody>
   {cr.map((c,j)=><tr key={j}><td>{K(j)} · {c.n}</td><td>{c.t}</td><td><Num disabled={locked} v={me.vp[j]} step="0.5" on={v=>setV(j,v)}/></td><td>{ok?fmt(f.w[j]):'-'}</td></tr>)}</tbody></table>
  <p className={ok?'ok':'bad'}>{ok?'Valid. Consistency gap (DFC) = '+fmt(f.dfc,4):'Invalid: every ϖ must be at least 1, and one criterion must equal 1.'}</p>
 </div>;
}
