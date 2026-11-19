export const CR=[{k:'C1',n:'GPA (IPK)',t:'benefit',v:1.5},{k:'C2',n:'Parent income',t:'cost',v:2},{k:'C3',n:'Organization activity',t:'benefit',v:3},{k:'C4',n:'Insight & leadership',t:'benefit',v:1},{k:'C5',n:'Avg. number of parents’ dependents',t:'benefit',v:4}];
export const ALT=['Andi (FILKOM)','Budi (FEB)','Citra (FKep)','Dewi (FKIP)','Eka (Faperta)'];
export const DMN=['DM1 · KPwBI Sulut','DM2 · WR III UNKLAB','DM3 · Dean / Kaprodi'];
// C1, C2 and C5 are candidate profile data: identical for all three DMs (as in Excel sheet Evaluasi_Kandidat).
// C3 and C4 are scored individually by each DM.
export const M0=[
[[3.85,3500000,5,5,3.1],[3.6,2000000,4,4,3.9],[3.92,5500000,3,4,1.85],[3.75,2500000,4,3,4.9],[3.5,3000000,3,4,2.1]],
[[3.85,3500000,4,4,3.1],[3.6,2000000,4,3,3.9],[3.92,5500000,3,3,1.85],[3.75,2500000,4,4,4.9],[3.5,3000000,4,3,2.1]],
[[3.85,3500000,5,4,3.1],[3.6,2000000,5,4,3.9],[3.92,5500000,4,4,1.85],[3.75,2500000,5,3,4.9],[3.5,3000000,3,3,2.1]]];
export const K=j=>'C'+(j+1);
export const LO=[0.01,1,1,1,1],HI=[4,1e9,5,5,20];
export const C0=CR.map((c,j)=>({n:c.n,t:c.t,v:c.v,lo:LO[j],hi:HI[j]}));
export const DM0=[{n:'DM1 · KPwBI Sulut',w:0.4},{n:'DM2 · WR III UNKLAB',w:0.35},{n:'DM3 · Dean / Kaprodi',w:0.25}];
export const MS0=M0.map(m=>m.map(r=>r.map(String)));
export const COL=['var(--ac)','var(--ac2)','#2a7f7f','#7a8aa3','#a4504a'];

// Illustrative per-DM FUCOM inputs (replace with each DM's real answers)
export const VP0=[[2,1,3,1.5,4],[1,2,4,1.5,3],[2,1.5,3,1,4]]; // same as Excel FUCOM_DM1..3 (by C1..C5)
