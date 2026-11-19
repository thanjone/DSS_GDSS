import {useState} from 'react';
import {Navigate,useNavigate} from 'react-router-dom';
import {useStore} from '../store';
export default function Login(){
 const {s,session,login}=useStore();const go=useNavigate();
 const [who,setWho]=useState('admin'),[pin,setPin]=useState(''),[err,setErr]=useState('');
 if(session)return <Navigate to={session.role==='admin'?'/admin/overview':'/dm/input'} replace/>;
 const submit=e=>{e.preventDefault();if(login(who,pin))go(who==='admin'?'/admin/overview':'/dm/input');else setErr('Wrong PIN for this account.');};
 return <div className="login"><div className="box">
  <h1>GenBI scholarship decision support</h1><p className="sub">Log in to enter your assessment.</p>
  <form onSubmit={submit}>
   <label>Account<select style={{textAlign:'left'}} value={who} onChange={e=>setWho(e.target.value)}><option value="admin">Administrator</option>{s.dms.map((x,k)=><option key={k} value={k}>{x.n}</option>)}</select></label>
   <label>PIN<input type="password" style={{textAlign:'left'}} value={pin} onChange={e=>setPin(e.target.value)}/></label>
   {err&&<p className="bad">{err}</p>}
   <p><button className="ghost" style={{background:"var(--ac)",color:"#fff",width:"100%"}} type="submit">Log in</button></p>
   <p className="note">Demo PINs: admin = admin, DM1 = 1111, DM2 = 2222, DM3 = 3333. Admin can change them in Setup.</p>
  </form></div></div>;
}
