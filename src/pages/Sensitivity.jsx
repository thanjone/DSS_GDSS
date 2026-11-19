import {useStore} from '../store';
import {RankLines} from '../components/Charts';
import {fmt} from '../lib/mcdm';
import {sensitivity} from '../lib/derive';
export default function Sensitivity(){
 const {s,d}=useStore();
 if(!d.calc)return <div className="box"><b className="bad">Results are blocked until the input is valid:</b><ul>{d.issues.map((x,i)=><li key={i}>{x}</li>)}</ul></div>;
 const sens=sensitivity(s,d),top=s.alts[d.order[0]],stable=sens.filter(x=>x.top===top).length;
 return <div><h2>Does the winner survive changes?</h2>
  <p className="note">Rank 1 matches the base case in {stable} of {sens.length} scenarios.</p>
  <div className="box"><h3>Rank of each alternative per scenario</h3><RankLines data={sens.map(x=>({name:x.n,...Object.fromEntries(s.alts.map((a,i)=>[a.split(' (')[0],x.rk[i]]))}))} keys={s.alts.map(a=>a.split(' (')[0])}/></div>
  <div className="box sc"><table><thead><tr><th>Scenario</th>{s.alts.map((a,i)=><th key={i}>A{i+1}</th>)}<th>Top</th><th>ρ vs base</th></tr></thead><tbody>
   {sens.map(x=><tr key={x.n}><td>{x.n}</td>{x.rk.map((r,i)=><td key={i}>{r}</td>)}<td className={x.top===top?'ok':'bad'}>{x.top}</td><td>{fmt(x.rho,2)}</td></tr>)}</tbody></table></div></div>;
}
