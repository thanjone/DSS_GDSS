import {useStore} from '../store';
import MatrixForm from '../components/MatrixForm';
import WeightForm from '../components/WeightForm';
export default function DmInput(){
 const {s,set,d,session}=useStore();const k=session.dm,me=s.dms[k],per=d.mode==='perDM';
 const setSub=v=>set({dms:s.dms.map((x,i)=>i===k?{...x,sub:v}:x)});
 return <div>
  <h2>Your assessment · {me.n}</h2>
  {per&&<><h2>Step 1 · How important is each criterion?</h2><WeightForm dm={k} locked={me.sub}/></>}
  <h2>{per?'Step 2 · ':''}Score every alternative</h2>
  <p className="note">Enter your own value for every alternative and criterion. Cells outside the scale are highlighted.</p>
  <MatrixForm dm={k} locked={me.sub}/>
  {me.sub?<p className="ok"><b>Submitted.</b> Ask the administrator to unlock it if you need to change a value.</p>
   :<p><button className="ghost" disabled={!d.done[k]} onClick={()=>setSub(true)}>Submit my assessment</button> {!d.done[k]&&<span className="note">Complete all steps first.</span>}</p>}
 </div>;
}
