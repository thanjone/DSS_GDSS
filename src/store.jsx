import {createContext,useContext,useEffect,useState} from 'react';
import {ALT,C0,DM0,MS0,VP0} from './data';
import {derive} from './lib/derive';
const KEY='genbi-gdss-v5';
const init={alts:ALT,cr:C0,dms:DM0.map((x,i)=>({...x,pin:String(i+1).repeat(4),vp:VP0[i]||C0.map(c=>c.v),sub:false})),M:MS0,notes:[],hist:[],adminPin:'admin',weightMode:'perDM',weightAgg:'wam'};
const load=()=>{try{const x=localStorage.getItem(KEY);return x?{...init,...JSON.parse(x)}:init;}catch{return init;}};
const Ctx=createContext(null);
export function StoreProvider({children}){
 const [s,setS]=useState(load);
 const [session,setSession]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('gs'));}catch{return null;}});
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}},[s]);
 useEffect(()=>{const f=e=>{if(e.key===KEY)setS(load());};window.addEventListener('storage',f);return()=>window.removeEventListener('storage',f);},[]);
 const set=p=>setS(prev=>({...prev,...(typeof p==='function'?p(prev):p)}));
 const login=(who,pin)=>{
  const ok=who==='admin'?pin===s.adminPin:s.dms[+who]&&pin===s.dms[+who].pin;
  if(!ok)return false;const v=who==='admin'?{role:'admin'}:{role:'dm',dm:+who};
  sessionStorage.setItem('gs',JSON.stringify(v));setSession(v);return true;};
 const logout=()=>{sessionStorage.removeItem('gs');setSession(null);};
 const reset=()=>setS(init);
 return <Ctx.Provider value={{s,set,d:derive(s),session,login,logout,reset}}>{children}</Ctx.Provider>;
}
export const useStore=()=>useContext(Ctx);
