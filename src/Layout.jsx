import {NavLink,Navigate,Outlet,useNavigate,useLocation} from 'react-router-dom';
import {useStore} from './store';
const NAV={admin:[['/admin/setup','Setup'],['/admin/overview','Overview'],['/admin/results','Results'],['/admin/sensitivity','Sensitivity'],['/admin/group','Group']],dm:[['/dm/input','My input'],['/dm/group','Discussion']]};
export default function Layout({role}){
 const {s,session,logout}=useStore();const go=useNavigate();
 if(!session||session.role!==role)return <Navigate to="/login" replace/>;
 const name=role==='admin'?'Administrator':(s.dms[session.dm]?.n||'DM');
 const title={'/admin/setup':'Setup','/admin/overview':'Overview','/admin/results':'Results','/admin/sensitivity':'Sensitivity','/admin/group':'Group','/dm/input':'My input','/dm/group':'Discussion'};
 const loc=useLocation().pathname;
 return <div className="app"><aside className="side"><div className="brand"><b>G</b>GenBI GDSS</div>
  {NAV[role].map(([to,l])=><NavLink key={to} to={to} className={({isActive})=>isActive?'on':''}>{l}</NavLink>)}
  <div className="sp"/><div className="usr">Signed in as<br/><b style={{color:'#fff'}}>{name}</b><button onClick={()=>{logout();go('/login');}}>Log out</button></div></aside>
  <div className="content"><div className="top"><h1>{title[loc]||'Dashboard'}</h1><p>GenBI scholarship decision support · FUCOM weights, group matrix, MARCOS ranking</p></div>
  <main><Outlet/></main></div></div>;
}
