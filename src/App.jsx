import {HashRouter,Routes,Route,Navigate} from 'react-router-dom';
import {StoreProvider} from './store';
import Layout from './Layout';
import Login from './pages/Login';
import DmInput from './pages/DmInput';
import Setup from './pages/Setup';
import Overview from './pages/Overview';
import Results from './pages/Results';
import Sensitivity from './pages/Sensitivity';
import Group from './pages/Group';
export default function App(){
 return <StoreProvider><HashRouter><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<Layout role="dm"/>}><Route path="/dm/input" element={<DmInput/>}/><Route path="/dm/group" element={<Group/>}/></Route>
  <Route element={<Layout role="admin"/>}>
   <Route path="/admin/setup" element={<Setup/>}/><Route path="/admin/overview" element={<Overview/>}/><Route path="/admin/results" element={<Results/>}/>
   <Route path="/admin/sensitivity" element={<Sensitivity/>}/><Route path="/admin/group" element={<Group/>}/></Route>
  <Route path="*" element={<Navigate to="/login" replace/>}/>
 </Routes></HashRouter></StoreProvider>;
}
