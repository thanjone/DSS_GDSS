import {useState} from 'react';
import {useStore} from '../store';
import {Bar,Kpi} from '../components/Ui';
import MatrixForm from '../components/MatrixForm';
import WeightForm from '../components/WeightForm';
import {Donut} from '../components/Charts';
import {COL} from '../data';
export default function Overview(){
 const {s,set,d}=useStore();const [sel,setSel]=useState(0);const k=Math.min(sel,s.dms.length-1);
 const toggle=i=>set({dms:s.dms.map((x,y)=>y===i?{...x,sub:!x.sub}:x)});
 const nSub=s.dms.filter(x=>x.sub).length,per=d.mode==='perDM';
 return <div>
  <div className="kpis"><Kpi l="Alternatives" v={d.nA}/><Kpi l="Criteria" v={d.nC}/><Kpi l="DMs submitted" v={nSub+' / '+s.dms.length}/><Kpi l="Status" v={d.ready?'Ready':'Blocked'} s={d.ready?'Results available':d.issues.length+' issue(s)'}/></div>
  <div className="grid2" style={{marginBottom:16}}><div className="box"><h3>Input completeness</h3><Donut data={[{name:'Valid cells',v:d.stat.reduce((a,b)=>a+b,0),c:'#1f3a5f'},{name:'Missing / invalid',v:d.total*s.dms.length-d.stat.reduce((a,b)=>a+b,0),c:'#b8923a'}]}/></div>
   <div className="box"><h3>Submission status</h3><Donut data={[{name:'Submitted',v:nSub,c:'#2a7f7f'},{name:'Pending',v:s.dms.length-nSub,c:'#c9d1de'}]}/></div></div>
  <h2>Input status of all DMs</h2>
  <div className="box sc"><table><thead><tr><th>DM</th><th>Cells valid</th><th></th><th>Criteria importance</th><th>Submitted</th><th></th></tr></thead><tbody>
   {s.dms.map((x,i)=><tr key={i}><td>{x.n}</td><td>{d.stat[i]}/{d.total}</td><td style={{width:'25%'}}><Bar p={d.stat[i]/d.total} c={COL[i%5]}/></td>
    <td className={!per?'':d.wOk[i]?'ok':'bad'}>{per?(d.wOk[i]?'Valid':'Invalid'):'Consensus'}</td>
    <td className={x.sub?'ok':'bad'}>{x.sub?'Yes':'No'}</td><td><button className="ghost" onClick={()=>toggle(i)}>{x.sub?'Unlock':'Mark submitted'}</button></td></tr>)}</tbody></table>
   <p className="note">{nSub} of {s.dms.length} DMs submitted. {d.ready?'All input is valid, so results are available.':'Results are blocked: '+d.issues.length+' input issue(s).'}</p></div>
  <h2>Review or edit one DM’s input</h2>
  <div className="box"><label>DM<select style={{textAlign:'left'}} value={k} onChange={e=>setSel(+e.target.value)}>{s.dms.map((x,i)=><option key={i} value={i}>{x.n}</option>)}</select></label></div>
  {per&&<WeightForm dm={k} locked={false}/>}
  <MatrixForm dm={k} locked={false}/>
 </div>;
}
