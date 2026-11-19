import {useState} from 'react';
import {useStore} from '../store';
import {fmt} from '../lib/mcdm';
export default function Group(){
 const {s,set,d,session}=useStore();const admin=session.role==='admin';
 const [nt,setNt]=useState('');const who=admin?'Administrator':s.dms[session.dm].n;
 const post=()=>{set({notes:[{t:new Date().toLocaleString(),who,text:nt.trim()},...s.notes]});setNt('');};
 const save=()=>set({hist:[{t:new Date().toLocaleString(),top:s.alts[d.order[0]],f:d.calc.R.rows[d.order[0]].f,rk:d.order.map(i=>s.alts[i]).join(' > ')},...s.hist]});
 return <div>
  <h2>Discussion</h2>
  <div className="box"><div className="row"><input style={{textAlign:'left',flex:'3 1 280px'}} value={nt} placeholder={'Write a note as '+who} onChange={e=>setNt(e.target.value)}/>
   <button className="ghost" disabled={!nt.trim()} onClick={post}>Post note</button></div>
   {s.notes.length===0?<p className="note">No notes yet.</p>:s.notes.map((n,i)=><p key={i}><b>{n.who}</b> <span className="note">{n.t}</span><br/>{n.text}</p>)}</div>
  {admin&&<><h2>Decision history</h2>
  <div className="box"><button className="ghost" disabled={!d.calc} onClick={save}>Save current decision</button>{!d.calc&&<span className="note"> Fix the input first.</span>}
   {s.hist.length===0?<p className="note">No saved decisions yet.</p>:s.hist.map((h,i)=><p key={i}><b>{h.top}</b> ({fmt(h.f)}) <span className="note">{h.t}</span><br/><span className="note">{h.rk}</span></p>)}</div></>}
 </div>;
}
