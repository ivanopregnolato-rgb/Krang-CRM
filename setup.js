/* KRANG CRM - Configurazione guidata (1.63.0): installazione, cifratura, azienda, privacy, biometria, notifiche push.
   Carica su richiesta da app.js (openCfg). Ogni passo agisce direttamente sui dati e sulle funzioni dell'app: niente doppia configurazione. */
(()=>{
const CFG={};window.CFG=CFG;
const E=(t,c,x)=>h(t,c,x);
let root=null,idx=0,steps=[],tick=null,dirty=false;

const mailOk=v=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const flag=k=>!!WF[k];
const setFlag=(k,v)=>{WF[k]=v;try{saveS()}catch(e){}};
const col=()=>{try{return isCol()}catch(e){return false}};
const cloud=()=>{try{return !!(SB.has&&SB.has())}catch(e){return false}};
const e2eReady=()=>{try{return SB.e2e.state()==='ready'}catch(e){return false}};
const bioOk=()=>!!(navigator.credentials&&window.PublicKeyCredential);
const lockOnNow=()=>{try{return !!(LOCK&&LOCK.on)}catch(e){return false}};
const pushOnNow=()=>{try{return pushFlag()&&pushOk()&&Notification.permission==='granted'}catch(e){return false}};

/* ---------- definizione dei passi ----------
   ok(): il passo è completato (abilita «Avanti»); skip: true se si può saltare; app(): il passo vale per questo utente */
const defs=()=>[
 {k:'in',ic:'download',t:'Installa l’app',sub:'Sulla schermata Home, a schermo intero',skip:true,
  ok:()=>isStandalone(),render:rIn},
 {k:'cr',ic:'shield',t:'Cifratura dei dati',sub:'I tuoi dati restano tuoi',skip:true,
  ok:()=>e2eReady(),render:rCr},
 {k:'az',ic:'building',t:'La tua azienda',sub:'Titolare dell’informativa e delle email',app:()=>!col(),
  ok:()=>!!(S.azienda&&S.azienda.trim()&&S.replyTo),render:rAz,need:true},
 {k:'pv',ic:'doc',t:'La privacy della tua azienda',sub:'L’informativa che riceveranno i tuoi clienti',app:()=>!col(),
  ok:()=>flag('cfgPv'),render:rPv,need:true},
 {k:'sc',ic:'user',t:'Accesso con biometria',sub:'Face ID, impronta o volto',skip:true,
  ok:()=>lockOnNow(),render:rSc},
 {k:'no',ic:'clock',t:'Notifiche push',sub:'Un avviso quando un task scade',skip:true,
  ok:()=>pushOnNow(),render:rNo}];
const list=()=>defs().filter(d=>!d.app||d.app());

/* ---------- utilità di interfaccia ---------- */
const P=(html,cls)=>{const d=E('p',cls||'cfg-p');d.innerHTML=html;return d};
const note=(html)=>{const d=E('div','cfg-note');d.innerHTML=html;return d};
const okBox=t=>{const d=E('div','cfg-ok');d.innerHTML=ICONS.check+'<span></span>';d.lastChild.textContent=t;return d};
const warn=t=>{const d=E('div','cfg-warn');d.textContent=t;return d};
const btn=(ic,t,cls,fn)=>{const b=E('button','btn lbl '+(cls||''));b.type='button';b.innerHTML=(ic?ICONS[ic]:'')+'<span></span>';b.lastChild.textContent=t;if(fn)b.onclick=fn;return b};
const field=(id,label,val,o)=>{o=o||{};const f=E('div','f'),l=E('label','',label);l.htmlFor=id;const i=E(o.area?'textarea':'input');i.id=id;i.value=val||'';if(o.area)i.rows=o.rows||3;if(o.type)i.type=o.type;if(o.im)i.inputMode=o.im;i.autocomplete=o.ac||'off';if(o.ph)i.placeholder=o.ph;i.setAttribute('data-ns','');
  const er=E('div','err');er.id='cfgerr-'+id;er.hidden=true;f.append(l,i);if(o.hint)f.append(E('div','hint',o.hint));f.append(er);return f};
const fErr=(id,m)=>{const e=document.getElementById('cfgerr-'+id),i=document.getElementById(id);if(e){e.textContent=m||'';e.hidden=!m}if(i)i.classList.toggle('bad',!!m)};

/* ---------- 1 · installazione ---------- */
function rIn(B){
  const u=instUA();
  B.append(P('Aggiungere KRANG alla schermata Home lo fa aprire a schermo intero, come una vera app, ed è <b>necessario per ricevere le notifiche push su iPhone</b>.'));
  if(isStandalone()){B.append(okBox('Stai già usando KRANG dalla schermata Home.'));return}
  if(window.__bip){
    B.append(btn('download','Installa l’app','p cfg-main',async()=>{const e=window.__bip;if(!e)return;try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==='accepted')toast('Installazione avviata. Apri KRANG dalla schermata Home: la configurazione riprende da qui.');}catch(x){}window.__bip=null;paint()}));
    B.append(P('Dopo l’installazione apri KRANG dalla schermata Home: la configurazione riparte da dove l’hai lasciata.','cfg-sm'));return}
  if(u.ios){
    if(u.other)B.append(warn('Stai usando un browser diverso da Safari: se non trovi «Aggiungi a Home», apri questa pagina in Safari.'));
    B.append(P('<b>1.</b> Tocca <b>Condividi</b> (il quadrato con la freccia verso l’alto) '+(u.ipad?'in alto nella barra di Safari.':'in basso nella barra di Safari.')));
    B.append(P('<b>2.</b> Scegli <b>«Aggiungi a Home»</b>. Se non lo vedi, tocca «Altro» o «Modifica azioni».'));
    B.append(P('<b>3.</b> Tocca <b>«Aggiungi»</b> in alto a destra.'));
    B.append(P('<b>4.</b> Apri <b>KRANG</b> dall’icona nella schermata Home: <b>la configurazione riprende da qui</b>.'));
    B.append(note('Sull’app installata dovrai accedere di nuovo con la tua email e password.'));return}
  if(u.android){
    B.append(P('<b>1.</b> Tocca il menu del browser (i tre puntini in alto a destra).'));
    B.append(P('<b>2.</b> Scegli <b>«Installa app»</b> o <b>«Aggiungi a schermata Home»</b> e conferma.'));
    B.append(P('Se non vedi nessuna delle due voci, apri la pagina con Chrome.','cfg-sm'));return}
  B.append(P('<b>1.</b> Cerca nella barra degli indirizzi l’icona di installazione (un monitor con una freccia), oppure apri il menu del browser.'));
  B.append(P('<b>2.</b> Scegli <b>«Installa KRANG CRM»</b> e conferma.'));
  B.append(P('Funziona con Chrome ed Edge. Safari sul Mac: menu File → «Aggiungi al Dock».','cfg-sm'))}

/* ---------- 2 · cifratura ---------- */
function rCr(B){
  B.append(P('I clienti, i lead e i preventivi vengono <b>cifrati sul tuo dispositivo</b> con la tua password prima di essere salvati nel cloud: nemmeno noi possiamo leggerli.'));
  if(col()){B.append(P('Per te non c’è nulla da fare: la cifratura usa la password del tuo account e funziona da sola.'));if(e2eReady())B.append(okBox('La cifratura è attiva su questo dispositivo.'));return}
  if(e2eReady()){
    B.append(okBox('La cifratura è attiva su questo dispositivo.'));
    B.append(note('<b>La chiave di recupero.</b> Te l’abbiamo mostrata all’attivazione: conservala fuori dal telefono, in un gestore di password o su carta. Se reimposti la password senza chiave di recupero, i dati nel cloud non si possono recuperare da nessuno.'));
    return}
  if(!cloud()){B.append(warn('Per attivare la cifratura serve un account KRANG: accedi con email e password, poi riapri la configurazione da Aiuto.'));return}
  B.append(P('Tra poco ti chiederò di confermare la password e ti mostrerò una <b>chiave di recupero</b> da salvare.'));
  B.append(btn('shield','Attiva la cifratura ora','p cfg-main',()=>{
    hide();CLOUD.started=false;try{cloudGate()}catch(e){}
    let seen=false,n=0;clearInterval(tick);tick=setInterval(()=>{n++;const m=document.getElementById('mE2E');if(m&&!m.hidden)seen=true;if((seen&&m&&m.hidden)||n>600){clearInterval(tick);show()}},700)}));
  B.append(note('Puoi anche saltare e attivarla più tardi: finché non è attiva, i dati restano solo su questo dispositivo.'))}

/* ---------- 3 · azienda ---------- */
function rAz(B,ctx){
  B.append(P('Questi dati compaiono nell’informativa privacy, nelle email e nei preventivi. <b>Nome dell’azienda</b> ed <b>email di contatto</b> sono obbligatori, il resto si può completare dopo.'));
  const fn=field('cf_az','Nome azienda (o tuo nome e cognome)',S.azienda,{ac:'organization'});
  const two=E('div','two');two.append(field('cf_piva','Partita IVA',S.piva,{im:'numeric'}),field('cf_tel','Telefono',S.telefono,{type:'tel',im:'tel',ac:'tel'}));
  const on=field('cf_on','Il tuo nome',S.ownerName||opName,{ac:'name',hint:'Ti saluto con questo nome in Home e i collaboratori ti vedono così.'});
  B.append(fn,two,field('cf_ind','Indirizzo della sede',S.indirizzo,{ac:'street-address'}),field('cf_rt','Email di contatto *',S.replyTo,{type:'email',ac:'email',hint:'Obbligatoria: compare nell’informativa e nelle risposte dei clienti.'}),on);
  const read=()=>({azienda:$('cf_az').value.trim(),piva:$('cf_piva').value.trim(),telefono:$('cf_tel').value.trim(),indirizzo:$('cf_ind').value.trim(),rt:$('cf_rt').value.trim().toLowerCase(),nome:$('cf_on').value.trim().slice(0,60)});
  const chk=()=>{const v=read();let bad=false;const em=!v.rt||!mailOk(v.rt);fErr('cf_rt',v.rt&&!mailOk(v.rt)?'Indirizzo email non valido.':'');if(em)bad=true;ctx.setNext(!!v.azienda&&!bad);return v};
  B.querySelectorAll('input').forEach(i=>i.addEventListener('input',chk));chk();
  ctx.beforeNext=()=>{const v=chk();if(!v.azienda||!v.rt||!mailOk(v.rt))return false;
    S.azienda=v.azienda;S.piva=v.piva;S.telefono=v.telefono;S.indirizzo=v.indirizzo;S.replyTo=v.rt;S.ownerName=v.nome;if(v.nome&&!opName){try{saveOp(v.nome)}catch(e){}}try{saveS()}catch(e){}try{renderH()}catch(e){}try{infSync();pubRefresh()}catch(e){}return true}}

/* ---------- 4 · privacy ---------- */
function rPv(B,ctx){
  B.append(P('Qui configuri la <b>privacy della tua azienda</b>, non quella di KRANG. KRANG prepara l’<b>informativa</b> con i tuoi dati: sarà <b>il testo che i tuoi clienti ricevono</b> via email o WhatsApp e leggono nella pagina in cui scelgono i consensi.'));
  B.append(E('div','cfg-lbl','Anteprima: quello che vedranno i tuoi clienti'));
  let t='';try{t=infoTxt()}catch(e){}
  const box=E('div','cfg-doc');String(t||'Imposta prima il nome dell’azienda.').split(/\n\n+/).forEach(x=>{if(!x.trim())return;const p=E('p'),s=x.trim(),i=s.indexOf(': ');if(i>0&&i<60){p.append(E('b','',s.slice(0,i+2)));p.append(document.createTextNode(s.slice(i+2)))}else p.textContent=s;box.append(p)});
  B.append(box);
  B.append(note('<b>Consenso al marketing.</b> È uno solo, valido per email, telefono, SMS e WhatsApp: se il cliente lo rifiuta, non gli scrivi su nessun canale. Lo registri nella scheda del cliente, sezione Privacy.'));

  B.append(E('div','cfg-lbl','Contatto per i tuoi clienti'));
  B.append(field('cf_pm','Email per le richieste privacy',S.privEmail,{type:'email',ac:'email',ph:S.replyTo||'',hint:'I tuoi clienti scrivono qui per accedere ai dati, correggerli, cancellarli o revocare i consensi. Se la lasci vuota, uso l’email di contatto dell’azienda'+(S.replyTo?' ('+S.replyTo+')':'')+'.'}));
  const l=E('label','cfg-note cfg-ack'),c=E('input');c.type='checkbox';c.checked=flag('cfgPv');const tx=E('span');tx.innerHTML='<b>Ho letto l’informativa che i miei clienti riceveranno e ho capito che è una proposta.</b> Puoi modificarla in Impostazioni → Privacy. Prima di usarla con i clienti ti consigliamo di <b>farla rivedere da un legale</b>.';l.append(c,tx);B.append(l);
  const pmOk=()=>{const v=$('cf_pm').value.trim().toLowerCase();fErr('cf_pm',mailOk(v)?'':'Indirizzo email non valido.');return mailOk(v)};
  const upd=()=>ctx.setNext(c.checked&&pmOk());c.onchange=upd;$('cf_pm').addEventListener('input',upd);upd();
  ctx.beforeNext=()=>{if(!c.checked||!pmOk())return false;S.privEmail=$('cf_pm').value.trim().toLowerCase();setFlag('cfgPv',true);try{infSync();pubRefresh()}catch(e){}return true}}

/* ---------- 5 · biometria ---------- */
function rSc(B,ctx){
  B.append(P('Con il blocco biometrico l’app chiede <b>Face ID, impronta o riconoscimento del volto</b> ogni volta che la apri: chi prende il tuo telefono non vede i dati dei clienti.'));
  if(lockOnNow()){B.append(okBox('Il blocco è attivo. Puoi cambiare PIN e tempi in Impostazioni → Accesso.'));return}
  if(!bioOk()){B.append(warn('La biometria non è disponibile in questo browser o in questa pagina. Puoi attivarla dall’app installata.'));return}
  B.append(field('cf_pin','PIN di emergenza (4–8 cifre)','',{type:'password',im:'numeric',ac:'new-password',hint:'Serve se la biometria non ti riconosce. Non si può recuperare: se lo dimentichi dovrai cancellare i dati dell’app.'}));
  $('cf_pin').maxLength=8;
  const b=btn('user','Attiva con biometria','p cfg-main',async()=>{const v=$('cf_pin').value.trim();fErr('cf_pin','');b.disabled=true;
    try{const m=await lockOn(v);if(m){fErr('cf_pin',m);return}toast('Blocco biometrico attivato.');paint()}finally{b.disabled=false}});
  B.append(b)}

/* ---------- 6 · notifiche push ---------- */
function rNo(B,ctx){
  B.append(P('Ricevi un avviso quando un task sta per scadere, <b>anche con l’app chiusa</b>. Titolo e cliente viaggiano cifrati: il server non li legge.'));
  if(!pushOk()){B.append(warn('Questo browser non supporta le notifiche. Su iPhone servono iOS 16.4 o successivo e l’app aggiunta alla schermata Home.'));return}
  if(isIOSd()&&!isStandalone()){B.append(warn('Su iPhone le notifiche funzionano solo dall’app aggiunta alla schermata Home: torna al primo passo, installala e riaprila da lì.'));B.append(btn('back','Vai all’installazione','',()=>go(0)));return}
  if(!cloud()){B.append(warn('Per le notifiche serve un account KRANG: accedi con email e password.'));return}
  if(pushOnNow()){
    B.append(okBox('Notifiche push attive su questo dispositivo.'));
    B.append(btn('clock','Invia una notifica di prova','',async()=>{try{const {reg}=await pushGet();if(!reg)throw 0;await reg.showNotification('KRANG CRM',{body:'Prova riuscita: le notifiche push arriveranno così.',icon:'kcrm-192.png',tag:'krang-prova',data:{go:'tk'}})}catch(e){toast('Impossibile mostrare la notifica di prova.')}}));
    const f=E('div','f'),l=E('label','','Ora predefinita dell’avviso');l.htmlFor='cf_hr';const s=E('select');s.id='cf_hr';s.setAttribute('data-ns','');[7,8,9,10,12,14,18].forEach(x=>{const o=E('option','',x+':00');o.value=x;s.append(o)});s.value=String(remHour());
    s.onchange=()=>{S.remH=parseInt(s.value,10)||9;try{saveS()}catch(e){}try{remSync(true)}catch(e){}};f.append(l,s,E('div','hint','Per i task senza un’ora propria: l’avviso arriva il giorno della scadenza a quest’ora.'));B.append(f);return}
  B.append(P('Tocca il pulsante e consenti le notifiche quando il telefono lo chiede.'));
  const b=btn('clock','Attiva le notifiche push','p cfg-main',async()=>{b.disabled=true;try{if(await pushOn())toast('Notifiche push attivate.')}finally{paint()}});B.append(b)}

/* ---------- riepilogo ---------- */
function rEnd(B){
  B.append(P('Ecco a che punto sei. Puoi rivedere qualsiasi passo e tornare qui da <b>Menu → Aiuto</b>.'));
  const l=E('div','cfg-sum');
  steps.forEach((d,i)=>{const ok=d.ok(),r=E('button','cfg-r');r.type='button';const ic=E('span','cfg-i '+(ok?'ok':'no'));ic.innerHTML=ok?ICONS.check:'–';const tx=E('div','tx');tx.append(E('b','',d.t),E('span','',ok?'Fatto':'Da fare più tardi'));const c=E('span','ch');c.innerHTML=ICONS.chevR;r.append(ic,tx,c);r.onclick=()=>go(i);l.append(r)});
  B.append(l);
  const lg=E('div','cfg-note');lg.innerHTML='Hai accettato i <b>Termini d’uso</b> e l’<b>Informativa privacy</b> di KRANG CRM registrandoti. Puoi rileggerli quando vuoi: ';const a=E('a','','Termini d’uso'),b=E('a','','Informativa privacy');[[a,'termini.html','Termini d’uso'],[b,'privacy.html','Informativa privacy dell’app']].forEach(([x,u,t])=>{x.href='#';x.onclick=e=>{e.preventDefault();termsDoc(u,t)}});lg.append(a,document.createTextNode(' · '),b,document.createTextNode('. Sono sempre in Impostazioni → App.'));B.append(lg)}

/* ---------- struttura ---------- */
const css=`
#mCfg{position:fixed;inset:0;z-index:27;background:var(--bg);display:flex;flex-direction:column;color:var(--ink)}
#mCfg[hidden]{display:none}
#mCfg .cfg-top{padding:calc(14px + env(safe-area-inset-top,0px)) 20px 10px;display:flex;align-items:center;gap:12px}
#mCfg .cfg-top .bar{flex:1;height:8px;border-radius:99px;background:var(--line);overflow:hidden}
#mCfg .cfg-top .bar i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .3s}
#mCfg .cfg-top small{color:var(--muted);font-size:13px;white-space:nowrap}
#mCfg .cfg-x{border:0;background:transparent;color:var(--muted);font:inherit;font-size:14px;cursor:pointer;padding:8px}
#mCfg .cfg-main{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:8px 20px 20px}
#mCfg .cfg-in{max-width:520px;margin:0 auto;padding-top:14px}
#mCfg h2{margin:14px 0 4px;font-size:26px;line-height:1.15}
#mCfg .cfg-sub{margin:0 0 16px;color:var(--muted)}
#mCfg .cfg-ic{width:56px;height:56px;flex:none;border-radius:18px;background:var(--lilac);color:#2d2b55;display:grid;place-items:center}
#mCfg .cfg-ic svg{width:28px;height:28px}
#mCfg .cfg-p{margin:0 0 12px;line-height:1.5}#mCfg .cfg-sm{font-size:13px;color:var(--muted)}
#mCfg .cfg-note,#mCfg .cfg-warn,#mCfg .cfg-ok{border-radius:14px;padding:12px 14px;margin:12px 0;font-size:14px;line-height:1.45}
#mCfg .cfg-note{background:var(--surface);border:1px solid var(--line)}
#mCfg .cfg-warn{background:var(--warm);color:#4a3418}
#mCfg .cfg-ok{background:var(--accent);color:#1d3b30;display:flex;gap:10px;align-items:center;font-weight:600}
#mCfg .cfg-ok svg{width:20px;height:20px;flex:none}
#mCfg .cfg-doc{max-height:34vh;overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:4px 14px;margin:8px 0;font-size:13.5px;line-height:1.5}
#mCfg .cfg-lbl{margin:14px 0 4px;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}#mCfg .cfg-ack{display:flex;gap:12px;align-items:flex-start;cursor:pointer;margin:14px 0}#mCfg .cfg-ack input{width:24px;height:24px;flex:none;margin:1px 0 0;accent-color:var(--accent)}#mCfg .cfg-ack:has(input:checked){border-color:var(--accent)}
#mCfg .btn.lbl{display:flex;gap:8px;align-items:center;justify-content:center;width:100%;margin:10px 0}
#mCfg .btn.lbl svg{width:18px;height:18px}
#mCfg .btn:disabled{opacity:.45}
#mCfg .cfg-foot{padding:12px 20px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);background:var(--bg)}
#mCfg .cfg-fi{max-width:520px;margin:0 auto;display:grid;grid-template-columns:1fr 1.4fr;gap:10px}
#mCfg .cfg-fi .btn.lbl{margin:0}
#mCfg .cfg-skip{display:block;margin:10px auto 0;border:0;background:none;color:var(--muted);font:inherit;font-size:14px;text-decoration:underline;cursor:pointer;padding:6px}
#mCfg .cfg-sum{display:grid;gap:8px;margin:10px 0}
#mCfg .cfg-r{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px;color:inherit;font:inherit;cursor:pointer}
#mCfg .cfg-r .tx{flex:1;display:flex;flex-direction:column}#mCfg .cfg-r .tx span{font-size:13px;color:var(--muted)}
#mCfg .cfg-i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;flex:none;background:var(--line);color:var(--muted)}
#mCfg .cfg-i.ok{background:var(--accent);color:#1d3b30}#mCfg .cfg-i svg{width:16px;height:16px}
#mCfg .cfg-r .ch svg{width:16px;height:16px;opacity:.6}
@media (min-width:1024px){#mCfg{background:rgba(15,20,35,.55);align-items:center;justify-content:center}#mCfg .cfg-box{width:600px;max-height:88vh;background:var(--bg);border-radius:24px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.4)}#mCfg .cfg-top{padding-top:18px}}
@media (max-width:1023px){#mCfg .cfg-box{display:contents}}
`;

let nextOk=false,ctx=null;
function paint(){
  if(!root)return;steps=list();if(idx>steps.length)idx=steps.length;
  const B=root.querySelector('.cfg-in'),end=idx===steps.length,d=steps[idx];
  B.textContent='';ctx={beforeNext:null,setNext(v){nextOk=!!v;sync()}};nextOk=true;
  const total=steps.length+1;
  root.querySelector('.bar i').style.width=Math.round((idx+1)/total*100)+'%';
  root.querySelector('small').textContent=end?'Riepilogo':'Passo '+(idx+1)+' di '+steps.length;
  if(end){const ic=E('div','cfg-ic');ic.innerHTML=ICONS.check;B.append(ic,E('h2','','Configurazione completata'),E('p','cfg-sub','Ecco il riepilogo.'));rEnd(B);nextOk=true}
  else{const ic=E('div','cfg-ic');ic.innerHTML=ICONS[d.ic]||'';B.append(ic,E('h2','',d.t),E('p','cfg-sub',d.sub));
    const body=E('div');B.append(body);nextOk=d.ok();d.render(body,ctx);if(ctx.beforeNext==null)nextOk=d.ok()}
  sync();root.querySelector('.cfg-main').scrollTop=0}
function sync(){
  if(!root)return;const end=idx===steps.length,d=steps[idx],bk=root.querySelector('#cfgBack'),nx=root.querySelector('#cfgNext'),sk=root.querySelector('.cfg-skip');
  bk.disabled=idx===0;bk.hidden=idx===0;root.querySelector('.cfg-fi').style.gridTemplateColumns=idx===0?'1fr':'1fr 1.4fr';
  nx.querySelector('span').textContent=end?'Inizia':idx===steps.length-1?'Vai al riepilogo':'Avanti';
  const ok=end||nextOk||(d&&d.ok&&d.ok()&&!d.need);
  nx.disabled=!ok;
  sk.hidden=end||!d||!d.skip||ok;}
function go(i){idx=Math.max(0,Math.min(steps.length,i));paint()}
function next(){
  if(idx===steps.length){finish();return}
  if(ctx&&ctx.beforeNext&&ctx.beforeNext()===false)return;
  go(idx+1)}
function finish(){setFlag('cfgDone',true);setFlag('welcomeSeen',true);close();try{paintWel()}catch(e){}toast('Configurazione salvata.')}
function hide(){if(root)root.hidden=true}
function show(){if(root){root.hidden=false;paint()}}
function close(){clearInterval(tick);if(root){root.remove();root=null}}
function build(){
  const st=document.getElementById('cfgCss')||E('style');st.id='cfgCss';st.textContent=css;document.head.append(st);
  root=E('div');root.id='mCfg';root.setAttribute('role','dialog');root.setAttribute('aria-label','Configurazione guidata');
  root.innerHTML='<div class="cfg-box"><div class="cfg-top"><small></small><div class="bar"><i></i></div><button class="cfg-x" type="button">Esci</button></div><div class="cfg-main"><div class="cfg-in"></div></div><div class="cfg-foot"><div class="cfg-fi"><button class="btn lbl" id="cfgBack" type="button"></button><button class="btn p lbl" id="cfgNext" type="button"></button></div><button class="cfg-skip" type="button">Salta questo passo</button></div></div>';
  root.querySelector('#cfgBack').innerHTML=ICONS.back+'<span>Indietro</span>';
  root.querySelector('#cfgNext').innerHTML='<span>Avanti</span>'+ICONS.chevR;
  root.querySelector('#cfgBack').onclick=()=>go(idx-1);
  root.querySelector('#cfgNext').onclick=next;
  root.querySelector('.cfg-skip').onclick=()=>go(idx+1);
  root.querySelector('.cfg-x').onclick=()=>{clearInterval(tick);setFlag('welcomeSeen',true);close()};
  document.body.append(root)}
/* primo passo da fare: il primo non completato */
CFG.open=function(at){
  steps=list();setFlag('welcomeSeen',true);if(root)close();build();
  let i=typeof at==='number'?at:steps.findIndex(d=>!d.ok());if(i<0)i=steps.length;idx=i;paint();
  /* i passi si aggiornano da soli quando cambia lo stato (permessi, installazione) */
  window.addEventListener('focus',CFG.refresh)};
CFG.refresh=()=>{if(!root||root.hidden||idx>=steps.length)return;if(!['in','cr','sc','no'].includes(steps[idx].k))return;const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;paint()};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)CFG.refresh()});
})();
