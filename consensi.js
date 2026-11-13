/* KRANG CRM - Pagina pubblica dei consensi. Il codice del link sta dopo il # e non viene mai inviato al sito che ospita la pagina. */
(()=>{
const API='https://oebneptbsfxbfwafjhjw.supabase.co/functions/v1/consent',$=i=>document.getElementById(i);
const k=decodeURIComponent((location.hash||'').slice(1)).trim();
const st=$('st');
const say=(t,bad)=>{st.hidden=false;st.className='box'+(bad?' err':'');st.textContent=t};
const add=(p,t,c)=>{const e=document.createElement(p);if(c)e.className=c;e.textContent=t;return e};
async function init(){
  if(!/^[A-Za-z0-9_-]{20,64}$/.test(k)){say('Questo link non è valido. Apri il link completo che hai ricevuto per email.',1);return}
  let j;
  try{const r=await fetch(API+'?k='+encodeURIComponent(k));if(r.status===404){say('Questo link non è valido o non è più attivo.',1);return}if(!r.ok)throw 0;j=await r.json()}
  catch(e){say('Il servizio non risponde. Riprova tra qualche minuto.',1);return}
  document.title='I tuoi consensi · '+(j.az||'');
  $('az').textContent=j.az?'Richiesta di '+j.az:'';
  const cs=$('cs');(j.cons||[]).forEach(c=>{const l=document.createElement('label');l.className='chk';const i=document.createElement('input');i.type='checkbox';i.dataset.k=c.k;const s=document.createElement('span');s.textContent=c.label;l.append(i,s);cs.append(l)});
  const inf=$('inf');String(j.info||'').split(/\n\n+/).forEach(x=>{if(x.trim())inf.append(add('p',x.trim()))});
  st.hidden=true;$('f').hidden=false;
}
$('f').addEventListener('submit',async e=>{e.preventDefault();
  const c={};document.querySelectorAll('#cs input').forEach(i=>{c[i.dataset.k]=i.checked});
  const b=$('go');b.disabled=true;
  try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({k,c})});
    if(r.status===429){say('Troppi tentativi ravvicinati. Riprova più tardi.',1);b.disabled=false;return}
    if(!r.ok)throw 0;
    $('f').hidden=true;st.hidden=true;const o=$('ok');o.hidden=false;o.className='box done';
    const n=new Date();o.textContent='Grazie, abbiamo registrato le tue scelte ('+n.toLocaleDateString('it-IT')+' '+n.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'). Puoi cambiarle riaprendo questo link.'}
  catch(x){say('Non siamo riusciti a registrare la scelta. Riprova.',1);b.disabled=false}
});
init()})();
