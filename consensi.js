/* KRANG CRM - Pagina pubblica dei consensi. Il codice del link sta dopo il # e non viene mai inviato al sito che ospita la pagina. */
(()=>{
const API='https://oebneptbsfxbfwafjhjw.supabase.co/functions/v1/consent',$=i=>document.getElementById(i);
const k=decodeURIComponent((location.hash||'').slice(1)).trim();
const st=$('st');
const say=(t,bad)=>{st.hidden=false;st.className='box'+(bad?' err':'');st.textContent=t};
const add=(p,t,c)=>{const e=document.createElement(p);if(c)e.className=c;e.textContent=t;return e};
const fd=d=>{const m=/^(\d{4})-(\d\d)-(\d\d)/.exec(d||'');return m?m[3]+'/'+m[2]+'/'+m[1]:''};
let S={},RQ={};
function paintCons(j){
  const cs=$('cs');cs.textContent='';const C=(S.c)||{};
  (j.cons||[]).forEach(c=>{const l=document.createElement('label');l.className='chk';const i=document.createElement('input');i.type='checkbox';i.dataset.k=c.k;const x=C[c.k];i.checked=!!(x&&x.v);
    const s=document.createElement('span');s.append(add('b',c.label));s.append(add('small',x&&x.d?(x.v?'Consenso prestato il ':'Consenso non prestato (aggiornato il ')+fd(x.d)+(x.v?'':')'):'Nessuna scelta espressa finora'));l.append(i,s);cs.append(l)})}
function paintRq(){
  const w=$('rq');w.textContent='';
  const R=[['portabilita','Chiedo una copia dei miei dati (portabilità)','Il titolare ti invierà i dati che ti riguardano in un formato leggibile.','Invia la richiesta'],
           ['anonimizzazione','Chiedo la cancellazione e l’anonimizzazione dei miei dati','Dopo l’anonimizzazione il titolare non potrà più riconoscerti né scriverti. Potrà conservare solo i dati che la legge gli impone di trattenere (ad esempio quelli fiscali e contabili), per il tempo previsto. La richiesta non è immediata: la esamina il titolare.','Sì, chiedo l’anonimizzazione']];
  R.forEach(([key,label,desc,okl])=>{
    const cur=(RQ[key]||(S.rq&&S.rq[key])||'');
    if(cur==='aperta'){w.append(add('div','Richiesta di '+(key==='portabilita'?'copia dei dati (portabilità)':'anonimizzazione')+' inviata: il titolare la sta esaminando.','box'));return}
    const b=add('button',label,'rqb');b.type='button';
    b.onclick=()=>{const c=document.createElement('div');c.className='rqc';c.append(add('p',desc));const two=document.createElement('div');two.className='two';
      const y=add('button',okl,'p');y.type='button';const n=add('button','Annulla');n.type='button';n.onclick=()=>{c.replaceWith(b)};
      y.onclick=async()=>{y.disabled=true;try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({k,r:key})});if(r.status===429){say('Troppi tentativi ravvicinati. Riprova più tardi.',1);y.disabled=false;return}if(!r.ok)throw 0;RQ[key]='aperta';st.hidden=true;paintRq()}catch(e){say('Non siamo riusciti a inviare la richiesta. Riprova.',1);y.disabled=false}};
      two.append(n,y);c.append(two);b.replaceWith(c)};
    w.append(b)})}
async function init(){
  if(!/^[A-Za-z0-9_-]{20,64}$/.test(k)){say('Questo link non è valido. Apri il link completo che hai ricevuto per email.',1);return}
  let j;
  try{const r=await fetch(API+'?k='+encodeURIComponent(k));if(r.status===404){say('Questo link non è valido o non è più attivo.',1);return}if(!r.ok)throw 0;j=await r.json()}
  catch(e){say('Il servizio non risponde. Riprova tra qualche minuto.',1);return}
  S=j.state||{};
  document.title='I tuoi consensi · '+(j.az||'');
  $('t').textContent=j.az?'I tuoi consensi · '+j.az:'I tuoi consensi';
  $('az').textContent=j.az?j.az+' ti chiede di scegliere i trattamenti facoltativi dei tuoi dati.':'';
  paintCons(j);paintRq();
  $('iv').textContent=j.ver?'Versione '+j.ver+(j.vfrom?' in vigore dal '+fd(j.vfrom):''):'';
  const inf=$('inf');String(j.info||'').split(/\n\n+/).forEach(x=>{if(x.trim()){const p=document.createElement('p'),t=x.trim(),i=t.indexOf(': ');if(i>0&&i<60){p.append(add('b',t.slice(0,i+2)));p.append(document.createTextNode(t.slice(i+2)))}else p.textContent=t;inf.append(p)}});
  st.hidden=true;$('app').hidden=false;
}
$('f').addEventListener('submit',async e=>{e.preventDefault();
  const c={};document.querySelectorAll('#cs input').forEach(i=>{c[i.dataset.k]=i.checked});
  const b=$('go');b.disabled=true;
  try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({k,c})});
    if(r.status===429){say('Troppi tentativi ravvicinati. Riprova più tardi.',1);b.disabled=false;return}
    if(!r.ok)throw 0;
    const d=new Date().toISOString().slice(0,10);S.c=S.c||{};Object.keys(c).forEach(x=>{S.c[x]={v:c[x],d}});
    paintCons({cons:[...document.querySelectorAll('#cs input')].map(i=>({k:i.dataset.k,label:i.parentElement.querySelector('b').textContent}))});
    st.hidden=true;const o=$('ok');o.hidden=false;const n=new Date();o.textContent='Grazie, abbiamo registrato le tue scelte ('+n.toLocaleDateString('it-IT')+' '+n.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'). Puoi cambiarle riaprendo questo link.';b.disabled=false}
  catch(x){say('Non siamo riusciti a registrare la scelta. Riprova.',1);b.disabled=false}
});
init()})();
