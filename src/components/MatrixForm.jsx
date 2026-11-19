import {useStore} from '../store';
import {Cell,Bar} from './Ui';
import {K} from '../data';
export default function MatrixForm({dm,locked}){
 const {s,set,d}=useStore();const {alts,cr,M}=s;
 const setCell=(i,j,v)=>set({M:M.map((m,x)=>x!==dm?m:m.map((r,y)=>y!==i?r:r.map((c,z)=>z===j?v:c)))});
 return <div>
  <div className="box"><div>{d.stat[dm]} of {d.total} cells valid</div><Bar p={d.stat[dm]/d.total}/></div>
  <div className="box sc"><table><thead><tr><th>Alternative</th>{cr.map((c,j)=><th key={j}>{K(j)} · {c.n}<div className="note">{c.t} · {c.lo}–{c.hi}</div></th>)}</tr></thead><tbody>
   {alts.map((a,i)=><tr key={i}><td>{a}</td>{cr.map((c,j)=><td key={j}><Cell disabled={locked} v={M[dm][i][j]} bad={!d.okc(dm,i,j)} on={v=>setCell(i,j,v)}/></td>)}</tr>)}</tbody></table></div>
 </div>;
}
