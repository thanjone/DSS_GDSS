export function Num({v,on,step,disabled}){return <input type="number" step={step||'any'} disabled={disabled} value={v} onChange={e=>on(e.target.value===''?0:parseFloat(e.target.value))} aria-label="value"/>;}
export function Cell({v,on,bad,disabled}){return <input type="number" step="any" disabled={disabled} value={v} className={bad?'err':''} aria-invalid={bad} onChange={e=>on(e.target.value)}/>;}
export function Bar({p,c}){return <div className="bar"><i style={{width:Math.max(0,p*100)+'%',background:c||'var(--ac)'}}/></div>;}

export function Kpi({l,v,s}){return <div className="kpi"><span>{l}</span><b>{v}</b>{s&&<small>{s}</small>}</div>;}
