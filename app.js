try{guideify(document)}catch(e){}
const KEY='crm-clienti-v1';
const FIELDS=['nome','cognome','azienda','ruolo','nascita','piva','pec','paese','telefono','email','sito','indirizzo','note'];
let clients=[],editing=null,curFav=false;function paintFav(){const b=$('favBtn');b.classList.toggle('on',curFav);b.setAttribute('aria-pressed',curFav);b.title=curFav?'Togli dai preferiti':'Aggiungi ai preferiti';b.setAttribute('aria-label',b.title)}
const $=id=>document.getElementById(id);
const COUNTRIES='IT,Italia,+39;SM,San Marino,+378;CH,Svizzera,+41;FR,Francia,+33;DE,Germania,+49;AT,Austria,+43;ES,Spagna,+34;PT,Portogallo,+351;GB,Regno Unito,+44;IE,Irlanda,+353;NL,Paesi Bassi,+31;BE,Belgio,+32;LU,Lussemburgo,+352;DK,Danimarca,+45;SE,Svezia,+46;NO,Norvegia,+47;FI,Finlandia,+358;PL,Polonia,+48;CZ,Cechia,+420;SK,Slovacchia,+421;HU,Ungheria,+36;RO,Romania,+40;BG,Bulgaria,+359;GR,Grecia,+30;HR,Croazia,+385;SI,Slovenia,+386;RS,Serbia,+381;TR,Turchia,+90;RU,Russia,+7;UA,Ucraina,+380;US,Stati Uniti,+1;CA,Canada,+1;MX,Messico,+52;BR,Brasile,+55;AR,Argentina,+54;CL,Cile,+56;CO,Colombia,+57;CN,Cina,+86;JP,Giappone,+81;KR,Corea del Sud,+82;IN,India,+91;AE,Emirati Arabi,+971;SA,Arabia Saudita,+966;IL,Israele,+972;EG,Egitto,+20;ZA,Sudafrica,+27;MA,Marocco,+212;TN,Tunisia,+216;AU,Australia,+61;NZ,Nuova Zelanda,+64;SG,Singapore,+65;HK,Hong Kong,+852'.split(';').map(s=>s.split(','));
const flag=iso=>String.fromCodePoint(...[...iso].map(ch=>127397+ch.charCodeAt(0)));
const dial=iso=>(COUNTRIES.find(c=>c[0]===(iso||'IT'))||COUNTRIES[0])[2];
const BY_PFX=[...COUNTRIES].sort((a,b)=>b[2].length-a[2].length);
const splitPfx=n=>{const c=BY_PFX.find(c=>n.startsWith(c[2]));return c?{iso:c[0],pfx:c[2],rest:n.slice(c[2].length)}:null};
function telHref(c){const n=c.telefono.replace(/[^\d+]/g,'');return n.startsWith('+')?n:dial(c.paese||(S.wa&&S.wa.paese))+n}
[...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).forEach(c=>{const o=document.createElement('option');o.value=c[0];o.textContent=flag(c[0])+' '+c[1]+' '+c[2];$('paese').append(o)});
/* ===== bandiere "cartoon" in SVG + selettore paese ===== */
const FL=(()=>{
 const st=(dir,cols,w)=>{const n=cols.length;w=w||cols.map(()=>1);const t=w.reduce((a,b)=>a+b,0);let o=0;return cols.map((c,i)=>{const f=w[i]/t*(dir==='v'?30:22),r=dir==='v'?`<rect x="${o}" y="0" width="${f+.3}" height="22" fill="${c}"/>`:`<rect x="0" y="${o}" width="30" height="${f+.3}" fill="${c}"/>`;o+=f;return r}).join('')};
 const R=(c)=>`<rect width="30" height="22" fill="${c}"/>`;
 const cross=(bg,fg,x,in_)=>R(bg)+`<rect x="${x-2.5}" y="0" width="5" height="22" fill="${fg}"/><rect x="0" y="8.5" width="30" height="5" fill="${fg}"/>`+(in_?`<rect x="${x-1.2}" y="0" width="2.4" height="22" fill="${in_}"/><rect x="0" y="9.8" width="30" height="2.4" fill="${in_}"/>`:'');
 const star=(cx,cy,r,c)=>{let p='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.4:r;p+=(cx+rr*Math.cos(a)).toFixed(2)+','+(cy+rr*Math.sin(a)).toFixed(2)+' '}return `<polygon points="${p}" fill="${c}"/>`};
 const dot=(cx,cy,r,c)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`;
 const F={
 IT:()=>st('v',['#009246','#fff','#ce2b37']),SM:()=>st('h',['#fff','#5eb6e4']),CH:()=>R('#da291c')+'<rect x="12.5" y="4" width="5" height="14" fill="#fff"/><rect x="8" y="8.5" width="14" height="5" fill="#fff"/>',
 FR:()=>st('v',['#0055a4','#fff','#ef4135']),DE:()=>st('h',['#111','#dd0000','#ffce00']),AT:()=>st('h',['#ed2939','#fff','#ed2939']),ES:()=>st('h',['#aa151b','#f1bf00','#aa151b'],[1,2,1]),
 PT:()=>st('v',['#006600','#ff0000'],[2,3])+dot(12,11,4,'#ffe000')+dot(12,11,2.2,'#d00'),
 GB:()=>R('#012169')+'<path d="M0 0L30 22M30 0L0 22" stroke="#fff" stroke-width="4.4"/><path d="M0 0L30 22M30 0L0 22" stroke="#c8102e" stroke-width="1.8"/><rect x="12" width="6" height="22" fill="#fff"/><rect y="8" width="30" height="6" fill="#fff"/><rect x="13" width="4" height="22" fill="#c8102e"/><rect y="9" width="30" height="4" fill="#c8102e"/>',
 IE:()=>st('v',['#169b62','#fff','#ff883e']),NL:()=>st('h',['#ae1c28','#fff','#21468b']),BE:()=>st('v',['#111','#fae042','#ed2939']),LU:()=>st('h',['#ed2939','#fff','#00a1de']),
 DK:()=>cross('#c8102e','#fff',11),SE:()=>cross('#006aa7','#fecc02',11),NO:()=>cross('#ba0c2f','#fff',11,'#00205b'),FI:()=>cross('#fff','#003580',11),
 PL:()=>st('h',['#fff','#dc143c']),CZ:()=>st('h',['#fff','#d7141a'])+'<path d="M0 0L15 11L0 22Z" fill="#11457e"/>',SK:()=>st('h',['#fff','#0b4ea2','#ee1c25']),HU:()=>st('h',['#cd2a3e','#fff','#436f4d']),
 RO:()=>st('v',['#002b7f','#fcd116','#ce1126']),BG:()=>st('h',['#fff','#00966e','#d62612']),GR:()=>st('h',['#0d5eaf','#fff','#0d5eaf','#fff','#0d5eaf','#fff','#0d5eaf','#fff','#0d5eaf'])+'<rect width="12" height="12" fill="#0d5eaf"/><rect x="5" width="2.4" height="12" fill="#fff"/><rect y="4.8" width="12" height="2.4" fill="#fff"/>',
 HR:()=>st('h',['#f00','#fff','#171796'])+'<rect x="12" y="7" width="6" height="8" rx="1.4" fill="#e32" stroke="#fff" stroke-width="1"/>',SI:()=>st('h',['#fff','#005da4','#ed1c24']),RS:()=>st('h',['#c6363c','#0c4076','#fff']),
 TR:()=>R('#e30a17')+dot(12,11,6,'#fff')+dot(13.6,11,4.8,'#e30a17')+star(18,11,3,'#fff'),RU:()=>st('h',['#fff','#0039a6','#d52b1e']),UA:()=>st('h',['#0057b7','#ffd700']),
 US:()=>st('h',['#b22234','#fff','#b22234','#fff','#b22234','#fff','#b22234','#fff','#b22234','#fff','#b22234','#fff','#b22234'])+'<rect width="13" height="11.8" fill="#3c3b6e"/>'+dot(3.5,3.5,.9,'#fff')+dot(6.5,3.5,.9,'#fff')+dot(9.5,3.5,.9,'#fff')+dot(5,7,.9,'#fff')+dot(8,7,.9,'#fff'),
 CA:()=>st('v',['#d52b1e','#fff','#d52b1e'],[1,2,1])+star(15,11,4.6,'#d52b1e'),MX:()=>st('v',['#006847','#fff','#ce1126'])+dot(15,11,2.6,'#8a6a2a'),
 BR:()=>R('#009b3a')+'<path d="M15 2.5L27 11L15 19.5L3 11Z" fill="#fedf00"/>'+dot(15,11,4.6,'#002776'),AR:()=>st('h',['#74acdf','#fff','#74acdf'])+dot(15,11,2.4,'#f6b40e'),
 CL:()=>st('h',['#fff','#d52b1e'])+'<rect width="11" height="11" fill="#0039a6"/>'+star(5.5,5.5,3.2,'#fff'),CO:()=>st('h',['#fcd116','#003893','#ce1126'],[2,1,1]),
 CN:()=>R('#de2910')+star(6,6,3.6,'#ffde00')+dot(12,3,.9,'#ffde00')+dot(14,6,.9,'#ffde00')+dot(14,9.5,.9,'#ffde00')+dot(12,12.5,.9,'#ffde00'),JP:()=>R('#fff')+dot(15,11,6.2,'#bc002d'),
 KR:()=>R('#fff')+'<path d="M9 11a6 6 0 0 1 12 0Z" fill="#cd2e3a"/><path d="M9 11a6 6 0 0 0 12 0Z" fill="#0047a0"/>',IN:()=>st('h',['#ff9933','#fff','#138808'])+dot(15,11,3,'#000080')+dot(15,11,1.9,'#fff'),
 AE:()=>st('h',['#00732f','#fff','#111'])+'<rect width="8" height="22" fill="#ff0000"/>',SA:()=>R('#006c35')+'<rect x="7" y="13.5" width="16" height="1.8" rx=".9" fill="#fff"/><rect x="8" y="7" width="14" height="2.4" rx="1.2" fill="#fff" opacity=".9"/>',
 IL:()=>R('#fff')+'<rect y="2.5" width="30" height="3.2" fill="#0038b8"/><rect y="16.3" width="30" height="3.2" fill="#0038b8"/>'+star(15,11,4.2,'#0038b8'),EG:()=>st('h',['#ce1126','#fff','#111'])+dot(15,11,2.4,'#c09300'),
 ZA:()=>R('#fff')+'<rect width="30" height="8" fill="#e03c31"/><rect y="14" width="30" height="8" fill="#001489"/><path d="M0 0L13 11L0 22Z" fill="#007749"/><path d="M0 2.5L10.5 11L0 19.5M10 11H30" stroke="#ffb81c" stroke-width="2.6" fill="none"/>'+'<path d="M0 0L13 11L0 22" stroke="#fff" stroke-width="1.2" fill="none"/>',
 MA:()=>R('#c1272d')+star(15,11.4,5,'none').replace('fill="none"','fill="none" stroke="#006233" stroke-width="1.1"'),TN:()=>R('#e70013')+dot(15,11,6,'#fff')+dot(15,11,3.8,'#e70013')+star(15.3,11,2.4,'#fff'),
 AU:()=>R('#012169')+'<rect width="15" height="11" fill="#012169"/><path d="M0 0L15 11M15 0L0 11" stroke="#fff" stroke-width="2"/><path d="M7.5 0V11M0 5.5H15" stroke="#fff" stroke-width="3.4"/><path d="M7.5 0V11M0 5.5H15" stroke="#c8102e" stroke-width="1.8"/>'+star(7.5,16.5,2.4,'#fff')+star(22,6,1.6,'#fff')+star(25,13,1.6,'#fff')+star(20,17,1.6,'#fff'),
 NZ:()=>R('#012169')+'<rect width="14" height="10.5" fill="#012169"/><path d="M0 0L14 10.5M14 0L0 10.5" stroke="#fff" stroke-width="2"/><path d="M7 0V10.5M0 5.25H14" stroke="#c8102e" stroke-width="2.4"/>'+star(22,6,1.8,'#c8102e')+star(25,11,1.8,'#c8102e')+star(21,15,1.8,'#c8102e'),
 SG:()=>st('h',['#ef3340','#fff'])+dot(7,5.5,3.4,'#fff')+dot(8.4,5.5,3,'#ef3340'),HK:()=>R('#de2910')+dot(15,11,4.6,'#fff')+dot(15,11,1.6,'#de2910')};
 return iso=>{const f=F[iso];const body=f?f():R('#cdd5e4')+`<text x="15" y="15" font-size="9" font-weight="700" text-anchor="middle" fill="#6b7488" font-family="sans-serif">${iso}</text>`;return `<svg viewBox="0 0 30 22" preserveAspectRatio="none" aria-hidden="true">${body}</svg>`}})();
const flagEl=iso=>{const e=document.createElement('span');e.className='flag';e.innerHTML=FL(iso);return e};
(function(){
 const sel=$('paese'),btn=$('paeseBtn'),dsc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
 const paint=()=>{const c=COUNTRIES.find(x=>x[0]===sel.value)||COUNTRIES[0];btn.textContent='';btn.append(flagEl(c[0]));const n=document.createElement('span');n.className='nm';n.textContent=c[1]+' '+c[2];const ch=document.createElement('span');ch.className='ch';ch.textContent='▾';btn.append(n,ch)};
 Object.defineProperty(sel,'value',{get(){return dsc.get.call(sel)},set(v){dsc.set.call(sel,v);paint()}});
 const list=()=>{const q=nrm($('pa_q').value||'').replace(/^\+/,''),w=$('pa_list');w.textContent='';
  [...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).filter(c=>!q||nrm(c[1]).includes(q)||c[2].replace('+','').startsWith(q)).forEach(c=>{const b=document.createElement('button');b.type='button';b.className='pa'+(c[0]===sel.value?' on':'');const n=document.createElement('span');n.className='nm';n.textContent=c[1];const x=document.createElement('span');x.className='px';x.textContent=c[2];b.append(flagEl(c[0]),n,x);b.onclick=()=>{sel.value=c[0];sel.dispatchEvent(new Event('change'));$('mPaese').hidden=true};w.append(b)})};
 btn.onclick=()=>{$('pa_q').value='';list();$('mPaese').hidden=false};
 $('pa_q').oninput=list;$('pa_x').onclick=()=>{$('mPaese').hidden=true};paint();window.paintPaese=paint})();

try{clients=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){clients=[]}
const DEMO=[
{id:'demo1',nome:'Giulia',cognome:'Bianchi',azienda:'Studio Bianchi & Associati',ruolo:'Avvocato',nascita:'1978-03-14',paese:'IT',telefono:'3331234567',email:'giulia.bianchi@studiobianchi.it',sito:'www.studiobianchi.it',indirizzo:'Via Roma 12, 20121 Milano',note:'Cliente dal 2023. Preferisce essere contattata al mattino.',foto:''},
{id:'demo2',nome:'Marco',cognome:'Rossi',azienda:'Rossi Costruzioni Srl',ruolo:'Titolare',nascita:'1971-11-22',tipo:'azienda',piva:'12345678903',paese:'IT',telefono:'3479876543',email:'marco.rossi@rossicostruzioni.it',sito:'www.rossicostruzioni.it',indirizzo:'Corso Francia 45, 10138 Torino',note:'Preventivo ristrutturazione da inviare entro fine mese.',foto:''},
{id:'demo3',nome:'Sophie',cognome:'Martin',azienda:'Atelier Lumière',ruolo:'Direttrice',nascita:'1985-06-02',paese:'FR',telefono:'612345678',email:'sophie.martin@atelier-lumiere.fr',sito:'www.atelier-lumiere.fr',indirizzo:'12 Rue de la République, 69002 Lyon',note:'Conosciuta in fiera a Lione.',foto:''},
{id:'demo4',nome:'Luca',cognome:'Meier',azienda:'Meier Tech AG',ruolo:'CTO',nascita:'1982-12-09',tipo:'azienda',piva:'CHE123456789',paese:'CH',telefono:'791234567',email:'luca.meier@meiertech.ch',sito:'www.meiertech.ch',indirizzo:'Bahnhofstrasse 20, 8001 Zürich',note:'Interessato alla demo del prodotto.',foto:''}];
function mkPriv(o){return Object.assign({base:'contratto',fonteDati:'interessato',informativa:false,infData:'',infModo:'Di persona',infVer:'1.0',cons:{mkEmail:{v:false,d:''},mkTel:{v:false,d:''},profilazione:{v:false,d:''},terzi:{v:false,d:''}},conserva:'',log:[],richieste:[]},o)}
DEMO[0].privacy=mkPriv({informativa:true,infData:'2023-03-10',infModo:'Firmata',cons:{mkEmail:{v:true,d:'2023-03-10'},mkTel:{v:false,d:''},profilazione:{v:false,d:''},terzi:{v:false,d:''}},log:[{d:'2023-03-10T10:00',t:'Informativa fornita (Firmata, v1.0)'},{d:'2023-03-10T10:00',t:'Marketing via email: prestato'}]});
DEMO[1].privacy=mkPriv({informativa:true,infData:'2026-02-02',infModo:'Email',log:[{d:'2026-02-02T09:30',t:'Informativa fornita (Email, v1.0)'}]});
DEMO[0].wa=[{id:'wa1',dir:'out',data:'2026-11-03T09:12:00.000Z',testo:'Buongiorno Giulia, le confermo l’appuntamento di giovedì alle 15 per la degustazione.',fonte:'manuale'},{id:'wa2',dir:'in',data:'2026-11-03T09:40:00.000Z',testo:'Perfetto, grazie! Porto anche il mio socio.',fonte:'manuale'},{id:'wa3',dir:'out',data:'2026-11-06T16:05:00.000Z',testo:'Ciao Giulia, le ho mandato il preventivo per i regali di Natale. Mi dica se va bene.',fonte:'manuale'},{id:'wa4',dir:'in',data:'2026-11-07T18:20:00.000Z',testo:'Grazie, lo guardo domani. Possiamo fare 30 confezioni invece di 24?',fonte:'manuale'}];
DEMO[2].privacy=mkPriv({fonteDati:'fiera',base:'legittimo',richieste:[{id:'rdemo',token:'K7M2QX',creata:'2026-11-05T09:00',scade:'2026-11-19T09:00',email:'sophie.martin@atelier-lumiere.fr',stato:'inviata'}],log:[{d:'2026-09-18T15:00',t:'Anagrafica creata (fonte: Fiera o evento)'},{d:'2026-11-05T09:00',t:'Informativa inviata via email a sophie.martin@atelier-lumiere.fr (codice K7M2QX, valido fino al 19 nov 2026)',op:'Demo',ev:'invio'}]});
DEMO[3].privacy=mkPriv({base:'consenso',informativa:true,infData:'2026-05-18',infModo:'Email',cons:{mkEmail:{v:true,d:'2026-05-18'},mkTel:{v:true,d:'2026-05-18'},profilazione:{v:false,d:''},terzi:{v:false,d:''}}});
function persist(){try{stampMods(clients,'c')}catch(e){}try{localStorage.setItem(KEY,JSON.stringify(clients))}catch(e){toast('Spazio pieno: impossibile salvare sul dispositivo.')}}
const contactName=c=>c.tipo==='azienda'?([c.nome,c.cognome].filter(Boolean).join(' ')||c.azienda):fullName(c);
const inits=nm=>{const w=String(nm||'').trim().split(/\s+/).filter(Boolean);return ((w[0]||'?')[0]+(w.length>1?w[w.length-1][0]:'')).toUpperCase()};
function fullName(c){const p=[c.nome,c.cognome].filter(Boolean).join(' ');return c.tipo==='azienda'?(c.azienda||p||'Senza nome'):(p||c.azienda||'Senza nome')}
let OBC=null;const oppsOf=id=>{if(!OBC){OBC=new Map;for(const o of opps){let a=OBC.get(o.clienteId);if(!a)OBC.set(o.clienteId,a=[]);a.push(o)}setTimeout(()=>{OBC=null},0)}return OBC.get(id)||[]};
let WONS=null;const wonSet=()=>{if(!WONS){WONS=new Set;for(const o of opps)if(o.fase==='vinta')WONS.add(o.clienteId);setTimeout(()=>{WONS=null},0)}return WONS};
const cstat=c=>wonSet().has(c.id)?['cliente','Cliente','#b9e6d3','Cliente: ha almeno un’opportunità vinta.']:['prospect','Prospect','#ffd9b0','Prospect: nessuna opportunità vinta finora.'];
let cFilter='';
function stChip(c){const st=cstat(c),i=document.createElement('i');i.className='cst';i.textContent=st[1];i.style.background=st[2];i.title=st[3];return i}
function paintFilt(){const w=$('cFilt');w.textContent='';const n={prospect:0,cliente:0};clients.forEach(c=>n[cstat(c)[0]]++);const nf=clients.filter(c=>c.fav).length;
  [['','Tutti',clients.length],['fav','★',nf],['prospect','Prospect',n.prospect],['cliente','Clienti',n.cliente]].forEach(([k,l,x])=>{const b=document.createElement('button');b.type='button';b.textContent=l+' '+x;if(k==='fav'){b.setAttribute('aria-label','Preferiti '+x);b.title='Preferiti'}b.classList.toggle('on',cFilter===k);b.onclick=()=>{cFilter=k;cLim=60;render()};w.append(b)})}
let cLim=60;
function render(){WONS=null;OBC=null;if(tab==='home')renderH();
  const q=$('q').value.trim().toLowerCase();const RM=new Map(),rsOf=c=>{let v=RM.get(c);if(!v){v=cReasons(c);RM.set(c,v)}return v};
  const rows=clients.filter(c=>(!cFilter||(cFilter==='fav'?!!c.fav:cstat(c)[0]===cFilter))&&(!q||FIELDS.some(f=>f!=='paese'&&(c[f]||'').toLowerCase().includes(q))))
    .map(c=>[c,fullName(c)]).sort((a,b)=>(b[0].fav?1:0)-(a[0].fav?1:0)||rsScore(rsOf(b[0]))-rsScore(rsOf(a[0]))||a[1].localeCompare(b[1],'it')).map(x=>x[0]);
  $('count').textContent=clients.length===1?'1 anagrafica':clients.length+' anagrafiche';
  paintFilt();const l=$('list');l.textContent='';
  if(!rows.length){
    const d=document.createElement('div');d.className='empty';
    d.textContent=clients.length?'Nessun risultato.':'Nessun cliente. Scansiona un biglietto da visita o aggiungi il primo cliente.';
    l.append(d);return}
  const shown=rows.slice(0,cLim);
  shown.forEach(c=>{
    const b=document.createElement('button');b.className='row';
    const nm=fullName(c),av=document.createElement('div');av.className='av';av.textContent=inits(nm);av.style.background=['#ffc2d4','#cdbff5','#b9e6d3','#ffd9b0','#fff0a3','#bfe0f8'][(nm.charCodeAt(0)+nm.length)%6];
    const t=document.createElement('div');
    const n=document.createElement('b');n.textContent=nm;n.append(stChip(c));
    const s=document.createElement('span');s.textContent=c.tipo==='azienda'?[[c.nome,c.cognome].filter(Boolean).join(' '),c.ruolo].filter(Boolean).join(', '):[c.ruolo,c.azienda].filter(Boolean).join(', ');if(!s.textContent)s.hidden=true;const ex=[];if(c.telefono){const p=document.createElement('em');const fe=flagEl(c.paese||'IT');fe.classList.add('sm');p.append(fe,' '+dial(c.paese)+' '+c.telefono);ex.push(p)}if(c.email){const m=document.createElement('em');m.textContent=c.email;ex.push(m)}if(!c.privacy||!c.privacy.informativa){const w=document.createElement('em');w.className='warn';const pq=c.privacy&&(c.privacy.richieste||[]).find(r=>r.stato==='inviata'&&Date.now()<=new Date(r.scade+'Z')),dd=pq?Math.floor((Date.now()-new Date(pq.creata+'Z'))/864e5):0;w.textContent=pq?(dd>=7?'Informativa inviata, nessuna risposta da '+dd+' giorni':'Informativa inviata, in attesa di risposta'):c.privacy?'Informativa privacy da inviare':'Privacy da verificare';ex.push(w)}
    t.append(n,s,...ex);{const rr=rsRow(rsOf(c).filter(x=>!x[2]));if(rr)t.append(rr)}t.className='tx';if(c.tipo==='azienda'&&!c.foto)av.innerHTML=ICONS.building;if(c.foto){av.textContent='';av.style.background="url('"+okImg(c.foto)+"') center/cover"}{const fb=h('span','fav'+(c.fav?' on':''));fb.setAttribute('role','button');fb.tabIndex=0;fb.title=c.fav?'Togli dai preferiti':'Aggiungi ai preferiti';fb.setAttribute('aria-label',fb.title+' '+nm);fb.innerHTML=ICONS.star;const tg=e=>{e.stopPropagation();e.preventDefault();c.fav=!c.fav;c.agg=new Date().toISOString();persist();render()};fb.onclick=tg;fb.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')tg(e)};fb.onpointerdown=e=>e.stopPropagation();b.append(av,t,fb)}l.append(swipeRow(b,c))});
  if(rows.length>cLim){const mo=h('button','btn lbl','Mostra altri ('+(rows.length-cLim)+')');mo.type='button';mo.style.margin='4px 0 16px';mo.onclick=()=>{cLim+=100;render()};l.append(mo)}
  if(rows.length)l.prepend(h('div','hint','Scorri una scheda: a destra chiami, a sinistra scrivi una email o un WhatsApp.'))
}
let swOpen=null;
function swipeRow(b,c,o){o=o||{};
  const w=h('div','swp'),hasTel=!!c.telefono,hasMail=!!c.email,Lw=hasTel?72:0,Rw=(hasMail?72:0)+(hasTel?72:0);
  const mk=(cls,ic,lab,bg,fn)=>{const x=h('button');x.type='button';x.innerHTML=ICONS[ic];x.title=lab;x.setAttribute('aria-label',lab+' '+fullName(c));x.style.background=bg;x.onclick=e=>{e.stopPropagation();close();fn()};return x};
  if(Lw){const a=h('div','swa l');a.append(mk('','Chiama','Chiama','#b5ebc0',()=>launch('tel:'+telHref(c),c.telefono,c)));w.append(a)}
  if(Rw){const a=h('div','swa r');if(hasMail)a.append(mk('','Scrivi','Email','#bfe0f8',()=>{if(o.mail)o.mail();else{openCompose(c);offerInf(c)}}));if(hasTel)a.append(mk('','WhatsApp','WhatsApp','#b9e6d3',()=>{if(o.wa)o.wa();else openWa(c)}));w.append(a)}
  w.append(b);
  let x0=0,y0=0,off=0,cur=0,drag=false,down=false,moved=false;
  const set=(v,anim)=>{cur=v;b.style.transition=anim?'transform .2s':'none';b.style.transform=v?'translateX('+v+'px)':''};
  function close(){set(0,true);off=0;if(swOpen===close)swOpen=null}
  b.addEventListener('pointerdown',e=>{if(!Lw&&!Rw)return;down=true;drag=false;moved=false;x0=e.clientX;y0=e.clientY;off=cur;if(swOpen&&swOpen!==close)swOpen()});
  b.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-x0,dy=e.clientY-y0;
    if(!drag){if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.5){drag=true;moved=true;window.__swDrag=Date.now();try{b.setPointerCapture(e.pointerId)}catch(_){}}else return}
    set(Math.max(-Rw,Math.min(Lw,off+dx)),false)});
  const end=()=>{if(!down)return;down=false;if(!drag)return;drag=false;
    const v=cur>Lw/2?Lw:cur<-Rw/2?-Rw:0;set(v,true);off=v;swOpen=v?close:null;setTimeout(()=>{moved=false},350)};
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
  b.onclick=e=>{if(moved){e.preventDefault();return}if(cur){close();return}(o.open||openSheet)(c)};
  return w}
function showMsg(t){const m=$('msg');m.textContent=t;m.hidden=!t}
function openSheet(c,data){
  newRef=null;editing=c||null;try{paintCre('sheet',c,'cl')}catch(e){}const d=data||c||{};
  FIELDS.forEach(f=>$(f).value=d[f]||'');setErr('nascita','');ageHint();
  if(!$('paese').value)$('paese').value='IT';
  curFav=!!d.fav;paintFav();curFoto=d.foto||'';paintPhoto();applyTipo(d.tipo||'persona');try{['csBox','viesBox'].forEach(i=>{const e=$(i);if(e)e.hidden=true});window.csReset&&csReset();window.viesReset&&viesReset();window.csUpd&&csUpd();window.viesUpd&&viesUpd()}catch(e){}renderLinked();loadPriv(d.privacy);setPane('dati');document.querySelectorAll('#cTabs [data-p=opp],#cTabs [data-p=comm],#cTabs [data-p=tp],#cTabs [data-p=tr]').forEach(b=>{b.hidden=!editing});tpSel=null;tpOff=new Set();mapQ='';updMap();$('p_copy').hidden=!editing;setErr('telefono','');setErr('email','');setErr('piva','');
  $('sheetTitle').textContent=c?fullName(c):'Nuovo cliente';if(c)$('sheetTitle').append(stChip(c));
  $('del').hidden=!c;
  const a=$('acts');a.textContent='';a.hidden=!c;
  if(c){
    [['Chiama',c.telefono&&'tel:'+telHref(c)],['Scrivi',c.email&&'mailto:'+c.email],['WhatsApp',c.telefono&&'https://wa.me/'+telHref(c).replace(/\D/g,'')]]
    .forEach(([n,h])=>{if(!h)return;const x=document.createElement('a');x.innerHTML=ICONS[n];x.setAttribute('aria-label',n);x.title=n;x.href=h;x.target='_blank';x.rel='noopener noreferrer';if(n==='Chiama')x.onclick=ev=>{ev.preventDefault();launch(h,telHref(c),c)};if(n==='Scrivi')x.onclick=ev=>{ev.preventDefault();openCompose(c)};if(n==='WhatsApp')x.onclick=ev=>{ev.preventDefault();openWa(c)};a.append(x)});
    a.hidden=!a.children.length}
  showMsg(data?'Dati letti dal biglietto. Controllali e salva.':'');
  $('sheet').hidden=false;$('sheet').scrollTop=0;
}
$('close').onclick=()=>{$('sheet').hidden=true};
$('ml_x').onclick=()=>{$('mLaunch').hidden=true};
$('cAdd').onclick=()=>openSheet(null);$('lAdd').onclick=()=>openLead(null);$('oAdd').onclick=()=>openOpp(null);{let t1,t2;$('lq').oninput=()=>{clearTimeout(t1);t1=setTimeout(renderL,150)};$('oq').oninput=()=>{clearTimeout(t2);t2=setTimeout(renderO,150)}}$('pAdd').onclick=()=>openProd(null);
$('addBtn').onclick=()=>tab==='opp'?openOpp(null):tab==='prod'?(window.pSec==='lst'?openLst(null):openProd(null)):tab==='lead'?openLead(null):openSheet(null);
$('save').onclick=()=>saveClient();
let newRef=null;/* anagrafica appena creata da questo foglio: va esclusa dai controlli di unicità e aggiornata, non duplicata */
function saveClient(viaSend){
  const d={};FIELDS.forEach(f=>d[f]=$(f).value.trim());d.indirizzo=addrC(d.indirizzo);if(curTipo!=='azienda')d.pec='';d.foto=curFoto;d.tipo=curTipo;d.fav=curFav;if(!validate(d)){setPane('dati');const el=$('sheet').querySelector('.bad');if(el)el.scrollIntoView({block:'center'});return null}
  if(!viaSend&&!editing&&$('p_fonte').value==='interessato'&&!$('p_inf').checked&&!$('p_later').checked){setPane('priv');$('p_det').open=true;setErr('p_inf','Conferma di aver fornito l’informativa privacy oppure scegli «Invierò l’informativa più tardi».');return null}
  d.privacy=collectPriv(editing&&editing.privacy,!editing);d.agg=new Date().toISOString();
  if(!['nome','cognome','azienda','telefono','email'].some(f=>d[f])){showMsg('Inserisci almeno un dato.');return null}
  let cl=editing;if(!cl&&newRef&&clients.includes(newRef)&&!$('sheet').hidden)cl=newRef;if(cl)Object.assign(cl,d);else{cl=stampNew({id:Date.now().toString(36),...d});clients.push(cl)}newRef=cl;
  persist();render();if(!viaSend)$('sheet').hidden=true;return cl
}
function viaNew(kind){
  if(kind==='email'&&!$('email').value.trim()){setPane('dati');setErr('email','Inserisci l’email per inviare l’informativa.');return}
  if(kind==='wa'&&!$('telefono').value.trim()){setPane('dati');setErr('telefono','Inserisci il telefono per inviare l’informativa su WhatsApp.');return}
  const cl=saveClient(true);if(!cl)return;openSheet(cl);setPane('priv');kind==='email'?openSend():sendWaInfo()}

$('del').onclick=()=>{
  if(!editing)return;
  const cl=editing,nl=opps.filter(o=>o.clienteId===cl.id).length;
  askConfirm('Eliminare '+fullName(cl)+'? '+(nl?'Verranno eliminate anche '+nl+' opportunità collegate. ':'')+'L’operazione non si può annullare.','trash','Elimina',()=>{opps=opps.filter(o=>o.clienteId!==cl.id);persistO();clients=clients.filter(c=>c!==cl);persist();purgeLog('eliminazione','manuale',cl.id);$('sheet').hidden=true;render();renderO();toast('Cliente eliminato.')});
};
$('favBtn').onclick=()=>{curFav=!curFav;paintFav();if(editing){editing.fav=curFav;editing.agg=new Date().toISOString();persist();render()}};
let qt;$('q').oninput=()=>{clearTimeout(qt);qt=setTimeout(()=>{cLim=60;render()},150)};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICONS={chat:svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>'),help:svg('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.6 2.6 0 0 1 4.9 1c0 1.7-2.5 2.2-2.5 3.8M12 17.4h.01"/>'),compass:svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),layers:svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>'),plus2:svg('<path d="M12 5v14M5 12h14"/>'),tag:svg('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>'),mappin:svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),back:svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),bag:svg('<path d="M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21z"/><path d="M10 8h4M10 12h4"/>'),menu:svg('<path d="M4 6.5h16M4 12h11M4 17.5h16"/>'),analytics:svg('<path d="M4 20h16"/><rect x="5" y="12" width="3" height="5" rx=".8"/><rect x="10.5" y="8" width="3" height="9" rx=".8"/><rect x="16" y="4" width="3" height="13" rx=".8"/>'),mega:svg('<path d="M4 10v4h3l8 4V6L7 10z"/><path d="M18.5 9a4 4 0 0 1 0 6"/><path d="M7 14l1.5 5h2.5l-1.2-4.5"/>'),chart:svg('<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M21 20H3"/>'),star:svg('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>'),link:svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),cloud:svg('<path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.75 4.75 0 0 1 0 9.5z"/>'),download:svg('<path d="M12 4v11"/><path d="M7.5 11L12 15.5 16.5 11"/><path d="M5 19h14"/>'),inbox:svg('<path d="M4 13l2.5-7h11L20 13v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>'),route:svg('<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>'),camera:svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),plus:svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6M19 8v6M16 11h6"/>'),x:svg('<path d="M6 6l12 12M18 6L6 18"/>'),check:svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),trash:svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>'),Chiama:svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>'),Scrivi:svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),gear:svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),search:svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),shield:svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),copy:svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>'),doc:svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'),users:svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .7 3.3 2.5 3.5 5.5"/>'),target:svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'),list:svg('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),columns:svg('<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>'),add:svg('<path d="M12 5v14M5 12h14"/>'),clip:svg('<path d="M20 11l-8 8a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>'),chevL:svg('<path d="M15 5l-7 7 7 7"/>'),chevR:svg('<path d="M9 5l7 7-7 7"/>'),user:svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>'),building:svg('<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M8 9h1M8 13h1M8 17h1M16 12h1M16 16h1"/>'),carico:svg('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),scarico:svg('<path d="M12 15V3M7 8l5-5 5 5M4 20h16"/>'),edit:svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),home:svg('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>'),gift:svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8h14v-8M12 8c-2-4-6-3-5 0 .5 1.5 3 1 5 0zM12 8c2-4 6-3 5 0-.5 1.5-3 1-5 0z"/>'),alert:svg('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>'),clock:svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),box:svg('<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),reset:svg('<path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.7L3 8"/><path d="M3 3v5h5"/>'),WhatsApp:svg('<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1-1 .9a4.5 4.5 0 01-2-2l.9-1-1-2.2z"/>')};
ICONS.info=svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.6v.1"/>');
document.querySelectorAll('[data-i]').forEach(e=>e.innerHTML=ICONS[e.dataset.i]);
/* tasto Salva in fondo alla scheda: compare solo se il record e' nuovo o modificato */
const SVREG=new WeakMap();
window.saveBtn=(host,sigFn,saveFn,baseFn)=>{
  const b=document.createElement('button');b.type='button';b.className='btn p lbl svb';b.innerHTML=ICONS.check+'Salva';b.hidden=true;
  let s0;try{s0=sigFn()}catch(e){}
  let seen=false,miss=0,iv=0;const box=(host.closest&&host.closest('.sheet,.modal'))||host;
  const stop=()=>{clearInterval(iv);const s=SVREG.get(box);if(s)s.delete(chk)};
  /* il controllo si ferma da solo quando il tasto sparisce dalla pagina (schede ricreate a ogni apertura) */
  const chk=()=>{if(!b.isConnected){if(seen||++miss>5)stop();return}seen=true;if(document.hidden||(b.hidden&&!host.offsetParent))return;try{b.hidden=sigFn()===(baseFn?baseFn():s0)}catch(e){}};
  b.onclick=()=>saveFn();
  host.insertBefore(b,host.firstChild);
  iv=setInterval(chk,400);
  let s=SVREG.get(box);if(!s){s=new Set();SVREG.set(box,s);box.addEventListener('input',()=>setTimeout(()=>s.forEach(f=>f()),0))}s.add(chk);
  b.rebase=()=>{try{s0=sigFn()}catch(e){}b.hidden=true};return b};
let curTipo='persona';
function applyTipo(t){curTipo=t;document.querySelectorAll('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  const L=(id,x)=>{document.querySelector('label[for='+id+']').textContent=x},two=document.querySelector('#sheet .two'),az=$('azienda').closest('.f'),pf=$('pivaF'),pc=$('pecF');
  if(t==='azienda'){L('azienda','Ragione sociale');L('nome','Nome referente');L('cognome','Cognome referente');L('ruolo','Ruolo del referente');pf.hidden=false;pc.hidden=false;two.before(az,pf,pc)}
  else{L('azienda','Azienda');L('nome','Nome');L('cognome','Cognome');L('ruolo','Ruolo');pf.hidden=true;pc.hidden=true;two.after(az,pf,pc)}}
$('seg').onclick=e=>{const b=e.target.closest('button');if(b)applyTipo(b.dataset.t)};
let curFoto='';
function setErr(f,t){const e=$('err-'+f);e.textContent=t;e.hidden=!t;$(f).classList.toggle('bad',!!t)}
function validate(d,only,commit=true){
  let ok=true;const bad=(f,t)=>{setErr(f,t);ok=false};
  if(!only||only==='telefono')setErr('telefono','');if(!only||only==='email')setErr('email','');if(!only||only==='piva')setErr('piva','');if(!only||only==='pec'){setErr('pec','');if(d.pec&&curTipo==='azienda'){d.pec=d.pec.toLowerCase();if(!/^[^\s@.][^\s@]*@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/.test(d.pec))bad('pec','Inserisci una PEC valida, ad esempio nome@pec.azienda.it.')}}
  if((!only||only==='telefono')&&d.telefono){
    let n=d.telefono.replace(/[\s.()\/-]/g,'');
    if(n.startsWith('00'))n='+'+n.slice(2);
    if(n.startsWith('+')){
      const hit=splitPfx(n);
      if(hit){if(dial(d.paese)!==hit.pfx)d.paese=hit.iso;n=hit.rest}else bad('telefono','Prefisso internazionale non riconosciuto.')}
    if(ok){
      const it=d.paese==='IT';
      if(!/^\d+$/.test(n))bad('telefono','Il numero può contenere solo cifre.');
      else if(it&&!/^(3\d{8,9}|0\d{5,10}|8\d{5,9})$/.test(n))bad('telefono','Numero italiano non valido: i cellulari iniziano per 3, i fissi per 0.');
      else if(!it&&(n.length<6||n.length>12))bad('telefono','Il numero deve avere tra 6 e 12 cifre.');
      else{
        d.telefono=n;if(commit){$('paese').value=d.paese;$('telefono').value=n}
        const full=dial(d.paese)+n,clash=clients.find(c=>c!==editing&&c!==newRef&&c.telefono&&dial(c.paese)+c.telefono.replace(/\D/g,'')===full);
        if(clash)bad('telefono','Numero già registrato per '+fullName(clash)+'.')}}}
  if((!only||only==='piva')&&d.tipo==='azienda'&&d.piva){
    let v=d.piva.replace(/[\s.-]/g,'').toUpperCase();
    if(d.paese==='IT'&&v.startsWith('IT'))v=v.slice(2);
    let okv=d.paese==='IT'?/^\d{11}$/.test(v):/^[A-Z0-9]{4,15}$/.test(v);
    if(okv&&d.paese==='IT'){let s=0;for(let i=0;i<10;i++){let n=+v[i];if(i%2){n*=2;if(n>9)n-=9}s+=n}okv=(10-s%10)%10===+v[10]}
    if(!okv)bad('piva',d.paese==='IT'?'Partita IVA non valida: servono 11 cifre corrette.':'Partita IVA non valida.');
    else{d.piva=v;if(commit)$('piva').value=v;const clash=clients.find(c=>c!==editing&&c!==newRef&&(c.piva||'').toUpperCase()===v);if(clash)bad('piva','Partita IVA già registrata per '+fullName(clash)+'.')}}
  if(!only||only==='nascita'){setErr('nascita','');if(d.nascita){const t=new Date(d.nascita+'T00:00');if(isNaN(t)||t.getFullYear()<1900)bad('nascita','Inserisci una data valida.');else if(d.nascita>ymd())bad('nascita','La data di nascita non può essere nel futuro.')}}
  if((!only||only==='email')&&d.email){
    d.email=d.email.toLowerCase();
    if(!/^[^\s@.][^\s@]*@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/.test(d.email)||d.email.includes('..'))bad('email','Inserisci un’email valida, ad esempio nome@azienda.it.');
    else{const clash=clients.find(c=>c!==editing&&c!==newRef&&(c.email||'').toLowerCase()===d.email);if(clash)bad('email','Email già registrata per '+fullName(clash)+'.')}}
  if(!ok){const el=$('sheet').querySelector('.bad');if(el)el.scrollIntoView({block:'center'})}
  return ok}
async function copyText(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}}
function launch(h,val,rec){
  const m=$('mLaunch'),kind=/^tel:/.test(h)?'Chiama':/^mailto:/.test(h)?'Apri posta':/wa\.me/.test(h)?'Apri WhatsApp':'Apri';
  $('ml_txt').textContent=/^tel:/.test(h)?String(val||''):kind==='Apri posta'?'Apre la tua app di posta con il messaggio pronto.':kind==='Apri WhatsApp'?'Apre WhatsApp con il messaggio pronto.':'';
  const a=$('ml_go');a.href=h;a.target='_blank';a.rel='noopener noreferrer';a.querySelector('span:last-child').textContent=kind;a.firstElementChild.innerHTML=ICONS[kind==='Chiama'?'Chiama':kind==='Apri posta'?'Scrivi':'WhatsApp'];a.style.textDecoration='none';
  $('ml_copy').onclick=async()=>{$('ml_copy').lastChild.textContent=(await copyText(String(val||h)))?' Copiato':' Seleziona e copia'};$('ml_copy').lastChild.textContent=' Copia '+(/^tel:/.test(h)?'numero':'testo');
  a.onclick=()=>{if(kind==='Chiama'&&rec)try{callMark(rec)}catch(e){}setTimeout(()=>{m.hidden=true},400)};m.hidden=false}
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{e.hidden=true},4000)}
function askConfirm(text,icon,label,fn){$('confirmText').textContent=text;$('cYes').firstChild.innerHTML=ICONS[icon];$('cYes').lastChild.textContent=label;$('cYes').onclick=()=>{$('confirm').hidden=true;fn()};$('confirm').hidden=false}
$('cNo').onclick=()=>{$('confirm').hidden=true};
$('confirm').onclick=e=>{if(e.target===$('confirm'))$('confirm').hidden=true};
/* età e prossimo compleanno (base per le future "next best action") */
function bday(iso){if(!iso)return null;const b=new Date(iso+'T00:00');if(isNaN(b))return null;const t=new Date(ymd()+'T00:00');
  const at=y=>{const d=new Date(y,b.getMonth(),b.getDate());if(d.getMonth()!==b.getMonth())d.setDate(0);return d};
  const thisY=at(t.getFullYear()),nx=thisY<t?at(t.getFullYear()+1):thisY;
  return{age:t.getFullYear()-b.getFullYear()-(thisY>t?1:0),days:Math.round((nx-t)/864e5)}}
function ageHint(){const v=$('nascita').value,r=bday(v);$('nascitaH').textContent=r&&r.age>=0&&v<=ymd()?r.age+' anni · '+(r.days===0?'compleanno oggi':r.days===1?'compleanno domani':'prossimo compleanno tra '+r.days+' giorni'):''}
$('nascita').addEventListener('change',()=>{live('nascita');ageHint()});
const live=(w,c=false)=>$('sheet').hidden?true:validate({telefono:$('telefono').value.trim(),paese:$('paese').value,email:$('email').value.trim(),piva:$('piva').value.trim(),nascita:$('nascita').value,tipo:curTipo},w,c);
let tm;const later=w=>{clearTimeout(tm);setErr(w,'');tm=setTimeout(()=>live(w),600)};
$('telefono').addEventListener('input',()=>later('telefono'));
$('email').addEventListener('input',()=>later('email'));
$('piva').addEventListener('input',()=>later('piva'));
/* ricerca della partita IVA (VIES): propone ragione sociale e indirizzo, l'utente conferma */
{const tc=s=>String(s||'').toLowerCase().replace(/(^|[\s'’\-\/.(])([a-zà-ÿ])/g,(m,p,c)=>p+c.toUpperCase()).replace(/\b(Di|Del|Della|Dei|Delle|Degli|Dello|Da|De|E|Ed|Il|La|Le|Lo|Al|Alla|In|Con|Per|Su|Sul|Sulla|Dal|Dalla)\b(?!$)/g,m=>m.toLowerCase()).replace(/\b(Srl|Spa|Sas|Snc|Srls|Sapa|Scarl|Ltd|Gmbh|Ag|Sa|Bv|Nv)\b/gi,m=>({srl:'Srl',spa:'SpA',sas:'Sas',snc:'Snc',srls:'Srls',sapa:'Sapa',scarl:'Scarl',ltd:'Ltd',gmbh:'GmbH',ag:'AG',sa:'SA',bv:'BV',nv:'NV'})[m.toLowerCase()]);
  window.viesAddr=(s,iso)=>{const L=String(s||'').split(/\n/).map(x=>x.trim()).filter(Boolean);if(!L.length)return '';if(iso==='IT'&&L.length>=2){const m=L[L.length-1].match(/^(\d{5})\s+(.+?)(?:\s+([A-Z]{2}))?$/);const via=tc(L.slice(0,-1).join(' '));if(m)return via+', '+m[1]+' '+tc(m[2])+(m[3]?' '+m[3]:'')}return L.map(tc).join(', ')};
  window.viesName=tc;
  const box=document.createElement('div');box.id='viesBox';box.className='vies';box.hidden=true;
  const btn=document.createElement('button');btn.type='button';btn.id='viesBtn';btn.className='btn lbl';btn.innerHTML=ICONS.search+'Cerca dati online';btn.hidden=true;
  const pf=$('pivaF');pf.append(btn,box);
  const upd=()=>{const t=curTipo==='azienda',v=($('piva').value||'').replace(/[\s.-]/g,'').toUpperCase();btn.hidden=!(t&&v.length>=4&&navigator.onLine!==false&&typeof SB!=='undefined'&&SB.has&&SB.has());if(btn.hidden)box.hidden=true};
  $('piva').addEventListener('input',upd);$('paese').addEventListener('change',upd);$('seg').addEventListener('click',()=>setTimeout(upd,0));window.addEventListener('online',upd);window.addEventListener('offline',upd);
  window.viesUpd=upd;let vseq=0;window.viesReset=()=>{vseq++;box.hidden=true;box.replaceChildren();btn.disabled=false};
  const say=(t,warn)=>{box.hidden=false;box.replaceChildren();const p=document.createElement('div');p.className=warn?'warn':'hint';p.textContent=t;box.append(p);return box};
  btn.onclick=async()=>{
    const d={tipo:'azienda',paese:$('paese').value,piva:$('piva').value.trim()};
    if(!validate(d,'piva',false)){say('Controlla prima la partita IVA.',true);return}
    let v=d.piva.replace(/[\s.-]/g,'').toUpperCase();if(d.paese==='IT'&&v.startsWith('IT'))v=v.slice(2);
    const my=++vseq;btn.disabled=true;say('Ricerca in corso…');
    try{const r=await SB.vies({paese:d.paese,piva:v});if(my!==vseq)return;
      if(!r||r.valid!==true){say('Questa partita IVA non risulta registrata in VIES. Controlla le cifre.',true);return}
      const nm=r.name?tc(r.name):'',ad=r.address?viesAddr(r.address,d.paese):'';
      if(!nm&&!ad){say('Partita IVA valida. Questo paese non fornisce nome e indirizzo: compilali a mano.');return}
      box.replaceChildren();box.hidden=false;
      const t=document.createElement('div');t.className='hint';t.textContent='Trovato in VIES (registro europeo delle partite IVA). Controlla prima di usarli:';box.append(t);
      const rows=[];[['azienda','Ragione sociale',nm],['indirizzo','Indirizzo',ad]].forEach(([f,l,x])=>{if(!x)return;const lab=document.createElement('label');lab.className='chk';const cb=document.createElement('input');cb.type='checkbox';cb.checked=!$(f).value.trim()||$(f).value.trim().toLowerCase()===x.toLowerCase();const s=document.createElement('span');s.textContent=l+': '+x+($(f).value.trim()&&!cb.checked?' (sostituisce «'+$(f).value.trim()+'»)':'');lab.append(cb,s);box.append(lab);rows.push([f,x,cb])});
      const go=document.createElement('button');go.type='button';go.className='btn p lbl';go.textContent='Usa i dati selezionati';
      go.onclick=()=>{let n=0;rows.forEach(([f,x,cb])=>{if(cb.checked){$(f).value=x;$(f).dispatchEvent(new Event('input',{bubbles:true}));n++}});box.hidden=true;if(n)toast('Dati compilati da VIES: controllali prima di salvare.')};
      const no=document.createElement('button');no.type='button';no.className='btn lbl';no.textContent='Annulla';no.onclick=()=>{box.hidden=true};
      const bar=document.createElement('div');bar.className='vrow';bar.append(go,no);box.append(bar)
    }catch(e){if(my!==vseq)return;const st=e&&e.status;say(st===429?'Hai raggiunto il limite di ricerche di oggi: riprova domani o compila a mano.':'Ricerca non disponibile ora: compila a mano.',true);try{window.logErr&&st!==429&&window.logErr('rete','Ricerca VIES: '+(st||'errore'),'vies-lookup')}catch(x){}}
    finally{if(my===vseq)btn.disabled=false}}}

/* suggerimenti azienda dal nome (Wikidata, OpenStreetMap; se vuote, ricerca Google): l'utente sceglie e conferma */
{const cb=document.createElement('button');cb.type='button';cb.id='csBtn';cb.className='btn lbl';cb.innerHTML=ICONS.search+'Cerca azienda online';cb.hidden=true;
  const cx=document.createElement('div');cx.id='csBox';cx.className='vies';cx.hidden=true;
  $('azienda').parentNode.append(cb,cx);
  const upd=()=>{const t=curTipo==='azienda',n=($('azienda').value||'').trim();cb.hidden=!(t&&n.length>=3&&navigator.onLine!==false&&typeof SB!=='undefined'&&SB.has&&SB.has());if(cb.hidden)cx.hidden=true};
  $('azienda').addEventListener('input',upd);$('seg').addEventListener('click',()=>setTimeout(upd,0));window.addEventListener('online',upd);window.addEventListener('offline',upd);window.csUpd=upd;let seq=0;window.csReset=()=>{seq++;cx.hidden=true;cx.replaceChildren();cb.disabled=false};
  const say=(t,warn)=>{cx.hidden=false;cx.replaceChildren();const p=document.createElement('div');p.className=warn?'warn':'hint';p.textContent=t;cx.append(p)};
  const SRC={wikidata:'Wikidata',osm:'OpenStreetMap',google:'Ricerca Google'};
  const pick=(it,via)=>{
    cx.replaceChildren();const t=document.createElement('div');t.className='hint';t.textContent=(it.src==='google'?'Dati trovati con una ricerca Google: possono essere imprecisi, da verificare. ':'Fonte: '+SRC[it.src]+'. ')+'Scegli cosa compilare:';cx.append(t);
    let piva=it.piva;if(piva){const m=piva.match(/^([A-Z]{2})(.+)$/);if(m&&m[1]===$('paese').value)piva=m[2]}
    const rows=[];[['azienda','Ragione sociale',it.name],['indirizzo','Indirizzo',it.address],['sito','Sito web',it.website],['telefono','Telefono',it.phone],['email','Email',it.email],['piva','Partita IVA',piva]].forEach(([f,l,x])=>{if(!x||!$(f))return;const cur=$(f).value.trim();const lab=document.createElement('label');lab.className='chk';const c=document.createElement('input');c.type='checkbox';c.checked=f==='azienda'||!cur||cur.toLowerCase()===x.toLowerCase();const sp=document.createElement('span');sp.textContent=l+': '+x+(cur&&!c.checked?' (sostituisce «'+cur+'»)':'');lab.append(c,sp);cx.append(lab);rows.push([f,x,c])});
    const go=document.createElement('button');go.type='button';go.className='btn p lbl';go.textContent='Usa i dati selezionati';
    go.onclick=()=>{let n=0;rows.forEach(([f,x,c])=>{if(c.checked){$(f).value=x;$(f).dispatchEvent(new Event('input',{bubbles:true}));n++}});cx.hidden=true;if(n)toast('Dati compilati: controllali prima di salvare.')};
    const back=document.createElement('button');back.type='button';back.className='btn lbl';back.textContent='Indietro';back.onclick=()=>list(via,window._csItems);
    const bar=document.createElement('div');bar.className='vrow';bar.append(go,back);cx.append(bar);
    if(!piva&&it.website&&$('piva')&&it.src!=='google'){const st=document.createElement('div');st.className='hint';st.textContent='Cerco la partita IVA nel sito dell’azienda…';cx.insertBefore(st,bar);
      SB.csearch({site:it.website}).then(r=>{if(!st.isConnected)return;if(!r||!r.piva){st.textContent='Partita IVA non trovata nel sito: puoi inserirla a mano.';return}
        let x=r.piva;const m=x.match(/^([A-Z]{2})(.+)$/);if(m&&m[1]===$('paese').value)x=m[2];const cur=$('piva').value.trim();
        const lab=document.createElement('label');lab.className='chk';const c=document.createElement('input');c.type='checkbox';c.checked=!cur||cur===x;const sp=document.createElement('span');
        sp.textContent='Partita IVA: '+x+(r.verified?' (trovata nel sito e confermata da VIES)':' (trovata nel sito, VIES non ha risposto: da verificare)')+(cur&&!c.checked?' (sostituisce «'+cur+'»)':'');lab.append(c,sp);cx.insertBefore(lab,st);rows.push(['piva',x,c]);
        const nm=(it.name||'').trim().toLowerCase().replace(/[^a-z0-9àèéìòù ]/g,'');st.textContent=r.name&&nm&&!r.name.toLowerCase().includes(nm.split(' ')[0])?'Attenzione: per VIES questa partita IVA è intestata a «'+r.name+'». Controlla che sia l’azienda giusta.':'';st.className=st.textContent?'warn':'hint'
      }).catch(()=>{if(st.isConnected)st.textContent='Ricerca della partita IVA dal sito non disponibile: inseriscila a mano.'})}};
  const list=(via,items)=>{
    window._csItems=items;cx.replaceChildren();cx.hidden=false;
    const t=document.createElement('div');t.className='hint';t.textContent=via==='google'?'Nessun risultato in Wikidata e OpenStreetMap: ecco cosa risulta da una ricerca Google (da verificare).':'Trovati in Wikidata e OpenStreetMap. Tocca quello giusto:';cx.append(t);
    items.forEach(it=>{const b=document.createElement('button');b.type='button';b.className='csr';const a=document.createElement('b');a.textContent=it.name;const d=document.createElement('span');d.textContent=[it.address||it.note,SRC[it.src]].filter(Boolean).join(' · ');b.append(a,d);b.onclick=()=>pick(it,via);cx.append(b)});
    const no=document.createElement('button');no.type='button';no.className='btn lbl';no.textContent='Chiudi';no.onclick=()=>{cx.hidden=true};cx.append(no)};
  cb.onclick=async()=>{
    const q=($('azienda').value||'').trim();if(q.length<3)return;
    const my=++seq;cb.disabled=true;say('Ricerca in corso…');
    try{const r=await SB.csearch({q});if(my!==seq)return;
      if(r&&r.limit){say('Ricerca Google non disponibile oggi per il limite raggiunto: compila a mano.',true);return}
      if(!r||!Array.isArray(r.items)||!r.items.length){say('Nessun risultato per «'+q+'». Le fonti gratuite (Wikidata e OpenStreetMap) conoscono soprattutto le aziende più grandi o già mappate: le piccole attività spesso non ci sono. Prova con un nome più preciso (aggiungi la città) oppure compila a mano.');return}
      list(r.via,r.items)
    }catch(e){if(my!==seq)return;const st=e&&e.status;say(st===429?'Hai raggiunto il limite di ricerche di oggi: riprova domani o compila a mano.':'Ricerca non disponibile ora: compila a mano.',true);try{window.logErr&&st!==429&&window.logErr('rete','Ricerca azienda: '+(st||'errore'),'company-search')}catch(x){}}
    finally{if(my===seq)cb.disabled=false}}}

$('paese').addEventListener('change',()=>{live('telefono');live('piva')});
['telefono','email','piva'].forEach(id=>$(id).addEventListener('blur',()=>{clearTimeout(tm);live(id,true)}));
function paintPhoto(){const b=$('photoBtn');if(curFoto){b.style.background="url('"+okImg(curFoto)+"') center/cover";b.innerHTML=''}else{b.style.background='';b.innerHTML=ICONS.camera}$('photoDel').hidden=!curFoto}
$('photoBtn').onclick=()=>$('photoFile').click();
$('photoDel').onclick=()=>{curFoto='';paintPhoto()};
$('photoFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  let u;try{const im=await new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=u=URL.createObjectURL(f)});
  const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=192;
  c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,192,192);
  curFoto=c.toDataURL('image/jpeg',.8);paintPhoto()}catch(err){showMsg('Immagine non leggibile.')}finally{if(u)URL.revokeObjectURL(u)}};

// Scansione biglietto da visita
function shrink(file){return new Promise((ok,ko)=>{
  const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const s=Math.min(1,1400/Math.max(img.width,img.height));
    const c=document.createElement('canvas');c.width=img.width*s;c.height=img.height*s;
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);
    c.toBlob(b=>b?ok(b):ko(new Error('img')),'image/jpeg',.85)};
  img.onerror=()=>{URL.revokeObjectURL(u);ko(new Error('img'))};img.src=u})}
const OKEY='crm-opps-v1';
const FASI=[['nuova','Nuova',10,'#bfe0f8'],['qualificata','Qualificata',25,'#d9d1f3'],['proposta','Negoziazione',50,'#f6edb8'],['vinta','Vinta',100,'#b5ebc0'],['persa','Persa',0,'#f5cad6']];
  const FASI_STD=FASI.map(x=>x[3]),FASI_ARA={nuova:'#bfe0f8',qualificata:'#dccfff',proposta:'#ffe9cc',vinta:'#a9e8f7',persa:'#f9cfcf'};
  const applyFasi=()=>{const o=document.documentElement.dataset.tpl==='arancio';FASI.forEach((f,i)=>{f[3]=o?FASI_ARA[f[0]]:FASI_STD[i]})};applyFasi();
const FONTI=['Sito web','Passaparola','Fiera o evento','Email o telefono','Social','Partner','Altro'];
const NF=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:'always'}),DF=new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric'}),DTF=new Intl.DateTimeFormat('it-IT',{dateStyle:'short',timeStyle:'short'});
const eur=n=>NF.format(n||0);
const fmtD=s=>{if(!s)return'';const d=new Date(s+'T00:00');return isNaN(d)?'':DF.format(d)};
let _yT=0,_yV='';const ymd=d=>{if(!d){const n=Date.now();if(n-_yT<1000)return _yV;const x=new Date(n);_yV=new Date(n-x.getTimezoneOffset()*6e4).toISOString().slice(0,10);_yT=n;return _yV}return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const okImg=u=>typeof u==='string'&&/^data:image\/(jpeg|png|webp|gif);base64,/.test(u)&&!/['"()\\\s]/.test(u)?u:'';
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
const DEMO_OPPS=[
{id:'o1',creata:'2026-09-15',titolo:'Regali aziendali di Natale',clienteId:'demo1',fase:'proposta',valore:708,prob:50,fonte:'Passaparola',data:'2026-12-10',prodotti:[{prodId:'w2',nome:'Primatus',unita:'bt',qta:24,prezzo:22,costo:10,iva:22,sconto:0},{prodId:'w3',nome:'Idealis',unita:'bt',qta:24,prezzo:7.5,costo:3.2,iva:22,sconto:0}],allegati:[],note:'Confezioni regalo da 2 bottiglie, in attesa del numero definitivo.'},
{id:'o2',creata:'2026-10-02',titolo:'Vini per le cene con i clienti',clienteId:'demo2',fase:'proposta',valore:936,prob:50,fonte:'Sito web',data:'2027-01-31',prodotti:[{prodId:'w4',nome:'EmmeErre',unita:'bt',qta:36,prezzo:12,costo:5.5,iva:22,sconto:0},{prodId:'w1',nome:'Dalibrà Bollicine',unita:'bt',qta:36,prezzo:14,costo:6.5,iva:22,sconto:0}],allegati:[],note:''},
{id:'o3',creata:'2026-10-12',titolo:'Selezione bio per la boutique',clienteId:'demo3',fase:'qualificata',valore:810,prob:25,fonte:'Fiera o evento',data:'2027-02-10',prodotti:[{prodId:'w6',nome:'Mammarosa',unita:'bt',qta:60,prezzo:6.5,costo:2.8,iva:22,sconto:0},{prodId:'w8',nome:'Argello',unita:'bt',qta:60,prezzo:7,costo:3.2,iva:22,sconto:0}],allegati:[],note:''},
{id:'o4',creata:'2026-10-28',titolo:'Fornitura annuale per l’ufficio',clienteId:'demo4',fase:'nuova',valore:1500,prob:10,fonte:'Email o telefono',data:'2027-03-31',prodotti:[{prodId:'w7',nome:'Magnalia',unita:'bt',qta:120,prezzo:7,costo:3,iva:22,sconto:0},{prodId:'w9',nome:'Riamò',unita:'bt',qta:120,prezzo:5.5,costo:2.3,iva:22,sconto:0}],allegati:[],note:'Richiesta campionatura.'},
{id:'o5',creata:'2026-09-20',chiusa:'2026-10-20',titolo:'Riordino Idealis',clienteId:'demo2',fase:'vinta',valore:900,prob:100,fonte:'Passaparola',data:'2026-10-20',prodotti:[{prodId:'w3',nome:'Idealis',unita:'bt',qta:120,prezzo:7.5,costo:3.2,iva:22,sconto:0}],allegati:[],note:'',scaricato:true}];
let opps=[],tab='clienti',oView='list',oEd=null,oD=null,oFilt='';
try{opps=JSON.parse(localStorage.getItem(OKEY)||'[]')}catch(e){}
{let mg_=false;opps.forEach(o=>{if(o&&o.fase==='negoziazione'){o.fase='proposta';if(+o.prob===75)o.prob=50;mg_=true}});if(mg_){try{localStorage.setItem(OKEY,JSON.stringify(opps))}catch(e){}}}
let _avgS;const dayN=(a,b)=>Math.max(0,Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5));
function avgSale(){if(_avgS!==undefined)return _avgS;const a=opps.filter(o=>o.fase==='vinta'&&o.creata&&o.chiusa).map(o=>dayN(o.creata,o.chiusa));return _avgS=a.length?Math.round(a.reduce((t,x)=>t+x,0)/a.length):null}
function trackF(){_avgS=undefined;const td=ymd();opps.forEach(o=>{const l=o.fh&&o.fh[o.fh.length-1];if(!l)o.fh=[{f:o.fase,d:(o.fase==='vinta'||o.fase==='persa'?o.chiusa:o.creata)||o.creata||td}];else if(l.f!==o.fase)o.fh.push({f:o.fase,d:td})})}
function faseInfo(o){const open=o.fase!=='vinta'&&o.fase!=='persa',td=ymd(),fh=o.fh||[],since=(fh.length?fh[fh.length-1].d:o.creata)||td,cr=o.creata||since;return{open,since,inF:dayN(since,open?td:(o.chiusa||td)),tot:dayN(cr,open?td:(o.chiusa||td)),stale:open&&avgSale()!=null&&dayN(cr,td)>avgSale()}}
function ageLine(o){const i=faseInfo(o);if(!o.creata&&!(o.fh&&o.fh.length))return null;const d=h('span','prs'+(i.stale?' warn':''));d.textContent=i.open?i.inF+' gg in questa fase'+(i.tot!==i.inF?' · '+i.tot+' gg dall’apertura':''):(o.fase==='vinta'?'Vinta':'Persa')+' in '+i.tot+' gg';return d}
function persistO(){trackF();try{stampMods(opps,'o')}catch(e){}OBC=null;WONS=null;try{localStorage.setItem(OKEY,JSON.stringify(opps))}catch(e){toast('Spazio pieno: impossibile salvare le opportunità.')}}
let _cmA=null,_cmL=-1,_cm=null;const cById=id=>{if(_cmA!==clients||_cmL!==clients.length){_cmA=clients;_cmL=clients.length;_cm=new Map();clients.forEach(c=>_cm.set(c.id,c))}let c=_cm.get(id);if(c&&c.id!==id)c=null;return c};
const cname=id=>{const c=cById(id);return c?fullName(c):'Cliente rimosso'};
const fase=k=>FASI.find(f=>f[0]===k)||FASI[0];
const fIdx=k=>FASI.findIndex(f=>f[0]===k);
const riga=p=>(+p.qta||0)*(+p.prezzo||0)*(1-Math.min(100,Math.max(0,+p.sconto||0))/100);
const total=o=>(o.prodotti||[]).reduce((s,p)=>s+riga(p),0);
const known=p=>p.costo!=null&&p.costo!=='';
const mg=o=>{let ric=0,cos=0,par=false,ok=false;(o.prodotti||[]).forEach(p=>{if(known(p)){ok=true;ric+=riga(p);cos+=(+p.qta||0)*(+p.costo||0)}else par=true});const mar=ric-cos;return{ok,par,ric,cos,mar,pct:ric>0?mar/ric*100:0}};
const PF=new Intl.NumberFormat('it-IT',{maximumFractionDigits:1});const pct=n=>PF.format(Math.round(n*10)/10)+'%';
function move(o,d){const i=fIdx(o.fase)+d;if(i<0||i>=FASI.length)return;o.fase=FASI[i][0];o.prob=FASI[i][2];if(o.fase==='vinta'||o.fase==='persa')o.chiusa=ymd();persistO();renderO();renderP();afterOppSave(o)}
function oCard(o,kan){
  const f=fase(o.fase),c=h('div','oc');c.tabIndex=0;c.setAttribute('role','button');c.onclick=()=>openOpp(o);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openOpp(o)}};
  if(!kan){const ch=h('i','chip',f[1]);ch.style.background=f[3];c.append(ch)}
  const m=h('div','om');m.append(h('strong','',eur(o.valore)),h('em','',o.prob+'%'));
  c.append(h('b','',o.titolo),h('span','',cname(o.clienteId)),m);{const g=mg(o);if(g.ok)c.append(h('span','','Margine '+eur(g.mar)+' ('+pct(g.pct)+')'+(g.par?' parziale':'')))}
  if(o.data)c.append(h('span','',fmtD(o.data)));{const a=ageLine(o);if(a)c.append(a)}{const rr=rsRow(oReasons(o));if(rr)c.append(rr)}
  if(kan){const mv=h('div','mv');[[-1,'chevL','Fase precedente'],[1,'chevR','Fase successiva']].forEach(([d,ic,lb])=>{const b=h('button');b.type='button';b.innerHTML=ICONS[ic];b.setAttribute('aria-label',lb);b.disabled=fIdx(o.fase)+d<0||fIdx(o.fase)+d>=FASI.length;b.onclick=e=>{e.stopPropagation();move(o,d)};mv.append(b)});c.append(mv)}
  return c}
function renderO(){
  if(tab==='home')renderH();
  if(!$('sheet').hidden)renderLinked();
  const open=opps.filter(o=>o.fase!=='vinta'&&o.fase!=='persa');
  const sum=(a,f=o=>o.valore)=>a.reduce((s,o)=>s+(+f(o)||0),0);
  $('sum').textContent='';
  {const W=opps.filter(o=>o.fase==='vinta');[['Aperte',open.length,eur(sum(open)),'Opportunità non ancora vinte né perse: tra parentesi quante sono, sotto il loro valore totale.'],['Ponderato',null,eur(sum(open,o=>o.valore*o.prob/100)),'Ogni opportunità aperta conta per la sua probabilità di chiusura (es. 1.000 € al 50% = 500 €): è una stima di quanto ti aspetti di incassare.'],['Vinte',W.length,eur(sum(W)),'Valore delle opportunità vinte, tra parentesi quante sono.'],['Margine vinte',null,eur(sum(W,o=>mg(o).mar)),'Margine complessivo delle opportunità vinte (prezzo meno costo dei prodotti).']].forEach(([k,n,v,i])=>{const d=h('div','stat'),l=h('span','',k+(n!=null?' ':''));if(n!=null)l.append(h('small','','('+n+')'));d.append(l,h('b','',v));$('sum').append(d);infoBtn(d,i)})}
  {const f=$('oFilt'),vt=window._vt||(window._vt=document.querySelector('#oppView .vt'));f.textContent='';[['','Tutte'],...FASI.map(x=>[x[0],x[1]])].forEach(([k,l])=>{const b=h('button','',l);b.type='button';const fs=FASI.find(x=>x[0]===k);b.style.background=fs?fs[3]:'var(--lilac)';b.classList.toggle('on',oFilt===k);b.onclick=()=>{oFilt=k;renderO()};f.append(b)});f.append(vt)}
  {let s2=$('sum2');if(!s2){s2=h('div','sum');s2.id='sum2';$('sum').after(s2)}s2.textContent='';
   const W=opps.filter(o=>o.fase==='vinta'),P=opps.filter(o=>o.fase==='persa'),T=W.length+P.length,cw=W.filter(o=>o.creata&&o.chiusa).map(o=>faseInfo(o).tot),ci=cw.length?Math.round(cw.reduce((t,x)=>t+x,0)/cw.length):null;
   [['Tasso di vittoria',T?W.length+' su '+T:null,T?Math.round(W.length/T*100)+'%':'—','Opportunità vinte sul totale di quelle chiuse (vinte più perse).'],['Media vendita',ci==null?null:cw.length,ci==null?'—':ci+' gg','Giorni medi tra la creazione e la vittoria, calcolati sulle opportunità vinte (tra parentesi quante).']].forEach(([k,n,v,i])=>{const d=h('div','stat'),l=h('span','',k+(n!=null?' ':''));if(n!=null)l.append(h('small','','('+n+')'));d.append(l,h('b','',v));s2.append(d);infoBtn(d,i)})}
  $('vList').classList.toggle('on',oView==='list');$('vKan').classList.toggle('on',oView==='kan');
  $('oList').hidden=oView!=='list';$('kan').hidden=oView!=='kan';
  const oq=nrm(($('oq').value||'').trim()),om=o=>!oq||nrm([o.titolo,cname(o.clienteId),o.fonte,o.note].filter(Boolean).join(' ')).includes(oq);
  const L=$('oList'),K=$('kan');L.textContent='';K.textContent='';
  if(!opps.length){L.append(h('div','empty','Nessuna opportunità. Tocca + per crearne una.'));return}
  if(oFilt&&!opps.some(o=>o.fase===oFilt)&&oView==='list'){L.append(h('div','empty','Nessuna opportunità in questa fase.'));return}
  if(oq&&oView==='list'&&!opps.some(o=>(!oFilt||o.fase===oFilt)&&om(o))){L.append(h('div','hint','Nessuna opportunità trovata.'));return}
  if(oView==='list')opps.filter(o=>(!oFilt||o.fase===oFilt)&&om(o)).sort((a,b)=>rsScore(oReasons(b))-rsScore(oReasons(a))||fIdx(a.fase)-fIdx(b.fase)||(a.data||'9').localeCompare(b.data||'9')).forEach(o=>L.append(oCard(o,false)));
  else FASI.filter(f=>!oFilt||f[0]===oFilt).forEach(f=>{const col=h('div','col'),items=opps.filter(o=>o.fase===f[0]&&om(o)).sort((a,b)=>rsScore(oReasons(b))-rsScore(oReasons(a)));const hd=h('h3');hd.style.background=f[3];hd.append(h('span','',f[1]),h('span','',items.length+' · '+eur(sum(items))));col.append(hd);items.forEach(o=>col.append(oCard(o,true)));K.append(col)})}
try{trackF()}catch(e){}
function setTab(v){tab=v;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  const c=v==='clienti';$('homeView').hidden=v!=='home';$('oppView').hidden=v!=='opp';$('prodView').hidden=v!=='prod';$('leadView').hidden=v!=='lead';$('list').hidden=!c;$('q').hidden=!c;$('qRow').hidden=!c;$('cFilt').hidden=!c;$('count').hidden=!c;$('cfRow').hidden=!c;document.querySelector('.bar').hidden=true;
  $('title').textContent={home:'Home',clienti:'Clienti',lead:'Lead',opp:'Opportunità',prod:'Prodotti'}[v];
  const l={home:'',clienti:'Nuovo cliente',lead:'Nuovo lead',opp:'Nuova opportunità',prod:'Nuovo prodotto'}[v];$('addBtn').setAttribute('aria-label',l);$('addBtn').title=l;$('addLbl').textContent=l;if(v==='prod')renderP();if(v==='home')renderH();if(c)render();if(v==='lead')renderL()}
$('tabs').onclick=e=>{const b=e.target.closest('button');if(b){if(b.dataset.v==='opp'){oFilt='';setTab('opp');renderO();return}setTab(b.dataset.v)}};
$('vList').onclick=()=>{oView='list';renderO()};$('vKan').onclick=()=>{oView='kan';renderO()};
FONTI.forEach(f=>{const o=h('option','',f);o.value=f;$('o_fonte').append(o)});
function paintFasi(){const w=$('o_fasi');w.textContent='';FASI.forEach(f=>{const b=h('button','',f[1]);b.type='button';b.style.background=f[3];b.classList.toggle('on',oD.fase===f[0]);b.onclick=()=>{oD.fase=f[0];$('o_prob').value=f[2];setErr('o_prob','');paintFasi()};w.append(b)})}
function recalc(){updAll.forEach(f=>f());const n=oD.prodotti.length,m=mg(oD);$('o_tot').textContent=n?'Totale prodotti: '+eur(total(oD))+(m.ok?' · Margine: '+eur(m.mar)+' ('+pct(m.pct)+')'+(m.par?' sulle righe con costo':''):''):'';if(n){$('o_valore').value=total(oD);setErr('o_valore','')}$('o_valore').disabled=n>0;if(window.paintAppr)paintAppr()}
function paintProd(){const w=$('o_prod');w.textContent='';updAll=[];oD.prodotti.forEach((p,i)=>{const c=h('div','pc'),l1=h('div','l1'),l2=h('div','l2');
  const n=h('input');n.placeholder='Prodotto';n.value=p.nome;if(p.prodId){n.readOnly=true;n.title='Prodotto del catalogo: il nome non si modifica';n.style.background='var(--bg)'}n.setAttribute('aria-label','Nome prodotto');n.oninput=()=>{p.nome=n.value};
  const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Rimuovi prodotto');x.title='Rimuovi prodotto';x.onclick=()=>{oD.prodotti.splice(i,1);paintProd()};
  const tot=h('div','rt');const upd=()=>{let t=eur2(riga(p))+(known(p)?' · margine '+eur2(riga(p)-(+p.qta||0)*(+p.costo||0)):''),bad=false;const pr=mprod(p.prodId);if(pr&&!(oEd&&oEd.scaricato)){const need=oD.prodotti.filter(x=>x.prodId===p.prodId).reduce((a,x)=>a+(+x.qta||0),0),av=disp(p.prodId,oEd);bad=need>av;t+=' · disponibili '+av+' '+(pr.unita||'')}tot.textContent=t;tot.classList.toggle('warn',bad)};
  const fld=(lb,val,fn,nul)=>{const d=h('div'),inp=h('input');inp.inputMode='decimal';inp.value=val;inp.setAttribute('aria-label',lb);inp.oninput=()=>{const t=inp.value.trim().replace(',','.');fn(nul&&t===''?null:(parseFloat(t)||0));upd();recalc()};d.append(h('small','',lb),inp);return d};
  const pp=prods.find(z=>z.id===p.prodId);if(pp){l1.append(pthumb(pp,true));l1.style.gridTemplateColumns='40px minmax(0,1fr) 40px'}l1.append(n,x);let scF;const qF=fld('Q.tà'+(p.unita?' ('+p.unita+')':''),p.qta,v=>{p.qta=v;if(p.auto&&pp){const r=prezzoCPQ(pp,cOf(),v||1);p.sconto=r.sconto;if(scF)scF.querySelector('input').value=r.sconto||0}});scF=fld('Sconto %',p.sconto||0,v=>{p.sconto=v;p.auto=false});l2.append(qF,fld('Prezzo €',p.prezzo,v=>{p.prezzo=v;p.auto=false}),scF,fld('Costo €',known(p)?p.costo:'',v=>p.costo=v,true));
  updAll.push(upd);upd();c.append(l1,l2,tot);w.append(c)});recalc()}
function paintAtt(){const w=$('o_att');w.textContent='';oD.allegati.forEach((a,i)=>{const r=h('div','att');
  let th;if((a.tipo||'').startsWith('image/')){th=h('img');th.src=okImg(a.dati);th.alt=''}else{th=h('div','ai');th.innerHTML=ICONS.clip}
  const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Rimuovi allegato');x.title='Rimuovi allegato';x.onclick=()=>{oD.allegati.splice(i,1);paintAtt()};
  r.append(th,h('div','an',a.nome+' ('+Math.max(1,Math.round(a.size/1024))+' KB)'),x);w.append(r)})}
$('o_addProd').onclick=()=>{oD.prodotti.push({nome:'',qta:1,prezzo:0,iva:22,sconto:0});paintProd()};
$('o_addAtt').onclick=()=>$('o_file').click();
$('o_file').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setErr('o_att','');
  let b=f;if(f.type.startsWith('image/')){try{b=await shrink(f)}catch(_){}}
  if(b.size>512000){setErr('o_att','File troppo grande: massimo 500 KB.');return}
  const r=new FileReader();r.onload=()=>{oD.allegati.push({nome:f.name,tipo:f.type,size:b.size,dati:r.result});paintAtt()};r.onerror=()=>setErr('o_att','File non leggibile.');r.readAsDataURL(b)};
function paintOKpi(o){const w=$('o_kpiW'),b=$('o_kpi');b.textContent='';if(!o||!(o.creata||(o.fh&&o.fh.length))){w.hidden=true;return}w.hidden=false;const i=faseInfo(o),fh=o.fh||[];
  const a=h('div','');a.style.cssText='font-weight:700;color:'+(i.stale?'var(--danger)':'var(--ink)');a.textContent=i.open?i.inF+' gg in questa fase'+(i.tot!==i.inF?' · '+i.tot+' gg dall’apertura':''):(o.fase==='vinta'?'Vinta':'Persa')+' dopo '+i.tot+' gg';b.append(a);
  const pv=fh.slice(0,-1).map((x,k)=>fase(x.f)[1]+' '+dayN(x.d,fh[k+1].d)+' gg');if(pv.length)b.append(h('div','','Fasi precedenti: '+pv.join(' · ')))}
function openOpp(o){
  oEd=o||null;try{paintCre('oSheet',o,'opp')}catch(e){}oD={apprMax:o?o.apprMax||0:0,fase:o?o.fase:'nuova',prodotti:o?o.prodotti.map(p=>({...p})):[],allegati:o?o.allegati.map(a=>({...a})):[]};
  $('o_titolo').value=o?o.titolo:'';
  const s=$('o_cliente');s.textContent='';const p0=h('option','','Seleziona cliente');p0.value='';s.append(p0);
  clients.slice().sort((a,b)=>fullName(a).localeCompare(fullName(b),'it')).forEach(c=>{const op=h('option','',fullName(c));op.value=c.id;s.append(op)});s.value=o?o.clienteId:'';s.disabled=!!o;$('sheet').style.zIndex='';oTouched=false;paintCl();
  $('o_valore').value=o?o.valore:'';$('o_prob').value=o?o.prob:10;$('o_data').value=o?o.data:'';$('o_fonte').value=o?o.fonte:FONTI[0];$('o_note').value=o?o.note:'';
  ['titolo','cliente','valore','prob','att'].forEach(k=>setErr('o_'+k,''));
  $('oTitle').textContent=o?o.titolo:'Nuova opportunità';$('oDel').hidden=!o;
  paintOKpi(o);paintFasi();paintProd();paintAtt();paintQ();$('oSheet').hidden=false;$('oSheet').scrollTop=0}
$('oClose').onclick=()=>{$('oSheet').hidden=true};
['o_titolo','o_cliente','o_valore','o_prob'].forEach(id=>['input','change'].forEach(ev=>$(id).addEventListener(ev,()=>setErr(id,''))));
$('oSave').onclick=()=>saveOpp();
let oTouched=false;
function autoTitle(){if(oEd||oTouched)return;const c=clients.find(x=>x.id===$('o_cliente').value);if(!c)return;$('o_titolo').value=(c.tipo==='azienda'&&c.azienda?c.azienda:fullName(c))+' – '+fmtD(ymd())}
$('o_titolo').addEventListener('input',()=>{oTouched=true});$('o_cliente').addEventListener('change',autoTitle);
function paintCl(){const c=oEd&&clients.find(x=>x.id===oEd.clienteId),b=$('o_cl'),sel=$('o_cliente');b.hidden=!c;sel.hidden=!!c;$('o_clh').textContent=c?'':'';if(!c)return;sel.value=oEd.clienteId;b.textContent='';const t=h('div','tx');t.append(h('b','',fullName(c)),h('span','',[c.azienda&&c.tipo!=='azienda'?c.azienda:'',c.telefono,c.email].filter(Boolean).join(' · ')||'Apri anagrafica'));const ic=h('span');ic.innerHTML=ICONS.chevR;ic.style.cssText='width:20px;flex:none';b.append(t,ic);b.setAttribute('aria-label','Apri anagrafica di '+fullName(c));b.onclick=()=>{openSheet(c);$('sheet').style.zIndex=8}}
function saveOpp(keep){
  const d={titolo:$('o_titolo').value.trim(),clienteId:$('o_cliente').value,valore:parseFloat(String($('o_valore').value).replace(',','.')),prob:parseInt($('o_prob').value,10)};
  let ok=true;const bad=(k,t)=>{setErr('o_'+k,t);ok=false};
  if(!d.titolo)bad('titolo','Inserisci un titolo.');
  if(!d.clienteId)bad('cliente','Seleziona un cliente.');
  if(!(d.valore>=0))bad('valore','Inserisci un importo valido (0 o più).');
  if(!(d.prob>=0&&d.prob<=100))bad('prob','Inserisci un valore da 0 a 100.');
  if(!ok){const el=$('oSheet').querySelector('.bad');if(el)el.scrollIntoView({block:'center'});return null}
  if(oD.fase==='vinta'&&oppOver({prodotti:oD.prodotti})>(oD.apprMax||0)){toast('Sconto oltre soglia: approvalo prima di chiudere come vinta.');$('o_tot').scrollIntoView({block:'center'});return null}
  const rec={...d,apprMax:oD.apprMax||0,fase:oD.fase,fonte:$('o_fonte').value,data:$('o_data').value,prodotti:oD.prodotti.filter(p=>p.nome.trim()),allegati:oD.allegati,note:$('o_note').value.trim()};
  if(rec.prodotti.length)rec.valore=total(rec);
  if(oEd){if(oEd.fase!==rec.fase&&(rec.fase==='vinta'||rec.fase==='persa'))rec.chiusa=ymd();Object.assign(oEd,rec)}else{oEd=stampNew({id:'o'+Date.now().toString(36),creata:ymd(),...rec});opps.push(oEd)}
  const o=oEd;paintCl();persistO();renderO();renderP();if(!keep){$('oSheet').hidden=true;afterOppSave(o)}return o}
$('oDel').onclick=()=>{if(!oEd)return;askConfirm('Eliminare l’opportunità “'+oEd.titolo+'”? L’operazione non si può annullare.','trash','Elimina',()=>{opps=opps.filter(x=>x!==oEd);persistO();$('oSheet').hidden=true;renderO();toast('Opportunità eliminata.')})};
function setPane(p){if(p==='priv'){try{$('p_det').open=false}catch(e){}}
 if(p==='comm'&&editing&&editing.id&&waUnread(editing)){const a=waLast(editing);editing.waSeen=a.data;try{persist()}catch(e){}setTimeout(()=>{try{paintBadges()}catch(e){}},0)}
document.querySelectorAll('#cTabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));$('sheet').classList.toggle('np-dati',p!=='dati');
  [...$('sheet').firstElementChild.children].forEach(el=>{if(el.classList.contains('top')||el.id==='cTabs')return;const k=el.id==='linkedF'?'opp':el.id==='privF'?'priv':el.id==='commF'?'comm':el.id==='tpF'?'tp':el.id==='trF'?'tr':el.id==='msg'?'*':el.classList.contains('btns')?'dati,priv':el.classList.contains('delw')?'*':'dati';el.classList.toggle('pane-hide',k!=='*'&&!k.split(',').includes(p))})}
$('cTabs').onclick=e=>{const b=e.target.closest('button');if(b){setPane(b.dataset.p);if(b.dataset.p==='comm')loadComm();if(b.dataset.p==='tp')paintTouch();if(b.dataset.p==='tr')paintTr()}};
const CONS=['mkEmail','mkTel','profilazione','terzi'];
const CLABEL={mkEmail:'Marketing via email',mkTel:'Marketing telefonico e WhatsApp',profilazione:'Profilazione commerciale',terzi:'Comunicazione a partner terzi'};
function privUI(){const on=$('p_inf').checked;$('p_infx').hidden=!on;if(on&&!$('p_infdata').value)$('p_infdata').value=ymd();
  $('p_infhint').textContent=on?'':($('p_fonte').value==='interessato'?'Da fornire al momento della raccolta dei dati (art. 13).':'Dati non raccolti dall’interessato: invia l’informativa entro 30 giorni dalla raccolta (art. 14).');setErr('p_inf','')}
['p_inf','p_fonte'].forEach(id=>$(id).addEventListener('change',privUI));
function loadPriv(p){p=p||mkPriv();$('p_later').checked=false;
  $('p_fonte').value=p.fonteDati;$('p_base').value=p.base;$('p_inf').checked=!!p.informativa;$('p_infmodo').value=p.infModo||'Di persona';$('p_infdata').value=p.infData||'';$('p_cons').value=p.conserva||'';{const a=autoRet(),ad=a.until?ymd(new Date(a.until)):'';$('p_cons').dataset.auto=ad;if(!p.conserva)$('p_cons').value=ad}
  CONS.forEach(k=>{const c=p.cons[k]||{v:false,d:''};$('c_'+k).checked=!!c.v;$('s_'+k).textContent=c.v?'Prestato il '+fmtD(c.d):(c.d?'Revocato il '+fmtD(c.d):'')});
  const L=$('p_log');L.textContent='';(p.log||[]).slice(-6).reverse().forEach(x=>L.append(h('div','logi',fmtDT(x.d+'Z')+' – '+x.t+(x.op?' ('+x.op+')':''))));
  if(!(p.log||[]).length)L.append(h('div','hint','Nessuna modifica registrata.'));
  privUI();paintReq();$('p_det').open=false}
function collectPriv(prev,isNew){
  prev=prev||mkPriv();const now=new Date().toISOString().slice(0,16),today=ymd(),log=(prev.log||[]).slice();
  const p={base:$('p_base').value,fonteDati:$('p_fonte').value,informativa:$('p_inf').checked,infData:$('p_infdata').value,infModo:$('p_infmodo').value,infVer:'1.0',cons:{},conserva:($('p_cons').value&&$('p_cons').value!==$('p_cons').dataset.auto)?$('p_cons').value:'',anon:prev.anon,log,richieste:prev.richieste||[]};
  if(isNew)log.push({d:now,t:'Anagrafica creata (fonte: '+$('p_fonte').selectedOptions[0].textContent+')'});
  if(p.informativa&&!p.infData)p.infData=today;if(!p.informativa)p.infData='';
  if(p.informativa&&(!prev.informativa||prev.infData!==p.infData))log.push({d:now,t:'Informativa fornita ('+p.infModo+', v1.0) il '+fmtD(p.infData)});
  if(!p.informativa&&prev.informativa)log.push({d:now,t:'Informativa: registrazione annullata'});
  CONS.forEach(k=>{const old=prev.cons[k]||{v:false,d:''},is=$('c_'+k).checked;p.cons[k]=is===!!old.v?{...old}:{v:is,d:today};if(is!==!!old.v)log.push({d:now,t:CLABEL[k]+': '+(is?'prestato':'revocato')})});
  return p}
$('p_show').onclick=()=>{const w=$('infoBody');w.textContent='';const t=h('p');t.append(h('b','','Informativa sul trattamento dei dati personali (artt. 13 e 14 GDPR)'));w.append(t);infoSections().forEach(([k,v])=>{const p=h('p');p.append(h('b','',k+': '),document.createTextNode(v));w.append(p)});const n=h('p');n.append(h('i','','Modello indicativo da adattare: fallo verificare da un consulente legale o dal DPO.'));w.append(n);$('info').hidden=false};$('infoClose').onclick=()=>{$('info').hidden=true};
$('p_copy').onclick=async()=>{if(!editing)return;const data={cliente:{...editing,foto:editing.foto?'[presente]':''},opportunità:opps.filter(o=>o.clienteId===editing.id).map(o=>({...o,allegati:o.allegati.map(a=>({nome:a.nome,tipo:a.tipo,size:a.size}))})),esportato:new Date().toISOString()};toast(await copyText(JSON.stringify(data,null,2))?'Dati copiati negli appunti.':'Copia non riuscita.')};
const mesi=n=>n%12===0?(n/12===1?'1 anno':n/12+' anni'):n+' mesi';
function infoSections(){const R=S.ret||{};return [
['Titolare',(S.azienda?S.azienda+(S.piva?', P. IVA '+S.piva:'')+(S.indirizzo?', sede in '+S.indirizzo:'')+(S.replyTo?' ('+S.replyTo+')':''):'[denominazione e contatti del titolare]')+'.'],
['Dati trattati','dati anagrafici e di contatto (nome, azienda, ruolo, telefono, email, indirizzo e, se forniti, data di nascita e foto); comunicazioni scambiate via email, telefono e WhatsApp; preventivi, ordini e dati commerciali. I dati non forniti direttamente da lei possono provenire da biglietti da visita, fiere ed eventi o fonti pubbliche professionali.'],
['Finalità e basi giuridiche','(a) gestire richieste, preventivi, ordini e il rapporto contrattuale: contratto o misure precontrattuali; (b) adempiere agli obblighi fiscali e contabili: obbligo di legge; (c) gestire la clientela, tutelare i diritti del titolare e la sicurezza: legittimo interesse; (d) inviare comunicazioni promozionali via email, telefono e WhatsApp, usare la data di nascita per auguri e offerte personalizzate, profilare le preferenze commerciali e comunicare i dati a partner terzi: solo con il suo consenso, revocabile in ogni momento.'],
['Natura del conferimento','i dati per (a) e (b) sono necessari al rapporto e il rifiuto impedisce di dar seguito alla richiesta; i consensi di cui al punto (d) sono facoltativi e il rifiuto non incide sul servizio. Non è presente alcun processo decisionale automatizzato.'],
['Destinatari','personale autorizzato e fornitori che trattano i dati per conto del titolare (assistenza informatica, hosting, servizi di posta e messaggistica, consulenti, corrieri). I dati non sono diffusi.'],
['Trasferimenti extra UE','alcuni fornitori, ad esempio dei servizi di posta e messaggistica, possono trattare i dati fuori dallo Spazio economico europeo con le garanzie previste dal GDPR (decisioni di adeguatezza o clausole contrattuali tipo).'],
['Conservazione','dati contrattuali e fiscali: '+mesi(R.contratto||120)+' dalla fine del rapporto; contatti senza contratto: '+mesi(R.contatti||24)+' dall’ultimo contatto; consensi di marketing: fino alla revoca e comunque '+mesi(R.marketing||24)+' dall’ultima interazione; profilazione: '+mesi(R.profilazione||12)+'; messaggi ed email registrati: '+mesi(R.comunicazioni||24)+'. Scaduti i termini i dati sono cancellati o resi anonimi.'],
['Diritti','accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del consenso, scrivendo al titolare. È possibile proporre reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).']]}
const infoTxt=()=>infoSections().map(x=>x[0]+': '+x[1]).join('\n\n');
let opName='';try{opName=localStorage.getItem('crm-op')||''}catch(e){}
const tok=()=>{const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789',r=new Uint32Array(6);crypto.getRandomValues(r);return [...r].map(x=>a[x%a.length]).join('')};
const fmtDT=s=>{const d=new Date(s);return isNaN(d)?'':DTF.format(d)};
/* data e utente di creazione: cre (ISO) e creU (email o "Questo dispositivo"), salvati nel record e quindi nel backup */
const whoU=()=>{let u='';try{u=SB.email()||''}catch(e){}return u||'Questo dispositivo'};
function stampNew(r){if(r&&!r.cre){r.cre=new Date().toISOString();r.creU=whoU()}return r}
/* ultimo aggiornamento: mod (ISO) e modU; si aggiorna al salvataggio se il contenuto del record è cambiato */
const MODS={},MODX=new Set(['cre','creU','mod','modU','waSeen']);
const modSig=r=>JSON.stringify(r,(k,v)=>MODX.has(k)?undefined:v);
function stampMods(a,k){let ap=false;try{ap=CLOUD.applying}catch(e){}let now='',u='';
  a.forEach(r=>{if(!r||r.id==null)return;const key=k+r.id,sg=modSig(r);
    if(MODS[key]===undefined||ap){MODS[key]=sg;return}
    if(MODS[key]!==sg){MODS[key]=sg;if(!now){now=new Date().toISOString();u=whoU()}r.mod=now;r.modU=u}})}
function baselineMods(){[[clients,'c'],[opps,'o'],[prods,'p'],[leads,'l'],[movs,'m']].forEach(([a,k])=>a.forEach(r=>{if(r&&r.id!=null)MODS[k+r.id]=modSig(r)}))}
function creOf(r,kind){if(!r)return 0;if(r.cre){const t=new Date(r.cre).getTime();if(!isNaN(t))return t}
  let t=NaN;if(kind==='lead')t=+r.creato||+r.data;else if(kind==='opp')t=r.creata?new Date(r.creata+'T12:00:00').getTime():NaN;
  if(isNaN(t)||!t){const m=/^[a-z]?([0-9a-z]{7,9})[a-z]?$/.exec(String(r.id||''));if(m){const x=parseInt(m[1],36);if(x>1e12&&x<4e12)t=x}}
  return isNaN(t)?0:t}
function backfillCre(){[[clients,'cl'],[opps,'opp'],[prods,'pr'],[leads,'lead']].forEach(([a,k])=>a.forEach(r=>{if(!r.cre){const t=creOf(r,k);if(t)r.cre=new Date(t).toISOString()}}))}
function creLine(r,kind){const t=creOf(r,kind),m=r.mod?new Date(r.mod).getTime():0;const a=t?'Creato il '+fmtDT(t)+(r.creU?' da '+r.creU:''):'';const b=m&&!isNaN(m)?'Aggiornato il '+fmtDT(m)+(r.modU?' da '+r.modU:''):'';return [a,b].filter(Boolean).join('\n')}
function paintCre(sheetId,r,kind){const box=$(sheetId).firstElementChild;if(!box)return;let e=box.querySelector(':scope > .creL');
  if(!e){e=document.createElement('div');e.className='hint creL';e.style.whiteSpace='pre-line';const b=box.querySelector(':scope > .btns');b?box.insertBefore(e,b):box.append(e)}
  const t=r?creLine(r,kind):'';e.textContent=t;e.hidden=!t}
const effSt=r=>r.stato==='inviata'&&Date.now()>new Date(r.scade+'Z').getTime()?'scaduta':r.stato;
function logP(c,t,ev){const p=c.privacy=c.privacy||mkPriv();p.log=p.log||[];p.log.push({d:new Date().toISOString().slice(0,16),t,op:opName,ev})}
function saveOp(op){opName=op;try{localStorage.setItem('crm-op',op)}catch(e){}}
function mailText(c,r){const nome=contactName(c);
  return ['Gentile '+nome+',','','la informiamo che '+(az()||'il titolare')+' tratta i suoi dati personali per gestire il rapporto commerciale. Di seguito l’informativa sintetica ai sensi dell’art. 13 del Regolamento (UE) 2016/679.','',infoTxt(),'','CONSENSI FACOLTATIVI','Per autorizzare i trattamenti facoltativi, risponda a questa email indicando il codice '+r.token+' e i numeri delle voci a cui acconsente:','1) '+CLABEL.mkEmail,'2) '+CLABEL.mkTel,'3) '+CLABEL.profilazione,'4) '+CLABEL.terzi,'','Se non desidera prestare alcun consenso non è necessario rispondere: il rifiuto non incide sul servizio. Può revocare un consenso in qualsiasi momento rispondendo a questa email.','Il codice è valido fino al '+fmtD(r.scade.slice(0,10))+'.','',firma()].join('\n')}

/* stato attuale della privacy, in sola lettura: informativa, consensi e conservazione */
function paintPrivSum(){
  const sm=$('p_sum');if(!sm)return;sm.textContent='';sm.className='psum';
  const p=(editing&&editing.privacy)||mkPriv(),pend=editing&&(p.richieste||[]).find(r=>effSt(r)==='inviata');
  const inf=$('p_inf').checked,infD=$('p_infdata').value,infM=$('p_infmodo').value;
  const row=(ok,title,sub,tone)=>{const r=document.createElement('div');r.className='ps-r';const ic=document.createElement('span');ic.className='ps-i '+tone;ic.textContent=tone==='ok'?'✓':tone==='wait'?'…':tone==='warn'?'!':'–';const t=document.createElement('div');t.className='ps-t';const b=document.createElement('b');b.textContent=title;t.append(b);if(sub){const e=document.createElement('span');e.textContent=sub;t.append(e)}r.append(ic,t);return r};
  const hd=document.createElement('div');hd.className='ps-h';hd.textContent='Stato attuale';sm.append(hd);
  sm.append(inf?row(1,'Informativa privacy','Fornita'+(infD?' il '+fmtD(infD):'')+(infM?' · '+infM:''),'ok'):pend?row(1,'Informativa privacy','Inviata, in attesa di risposta','wait'):row(1,'Informativa privacy','Da inviare','no'));
  CONS.forEach(k=>{const on=$('c_'+k).checked,c=p.cons[k]||{v:false,d:''},same=!!c.v===on;
    sm.append(row(1,CLABEL[k],on?'Consenso prestato'+(same&&c.d?' il '+fmtD(c.d):''):(c.d&&same?'Revocato il '+fmtD(c.d):'Non prestato'),on?'ok':'no'))});
  const cv=$('p_cons').value;if(cv){const au=cv===$('p_cons').dataset.auto;{const sc=cv<ymd();sm.append(row(1,'Conservazione dei dati',sc?'Scaduta il '+fmtD(cv)+(au?' (calcolata in automatico): valuta di anonimizzare o cancellare':' (impostata a mano): valuta di anonimizzare o cancellare'):au?'Scadenza calcolata in automatico: '+fmtD(cv):'Fino al '+fmtD(cv)+' (impostata a mano)',sc?'warn':au?'no':'ok'))}}
  {const a=editing&&editing.privacy&&editing.privacy.anon;if(a&&a.stato==='aperta')sm.append(row(1,'Richiesta di anonimizzazione','Da evadere entro '+fmtD(a.scade),'wait'))}
}
['change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target&&e.target.closest&&e.target.closest('#p_det'))try{paintPrivSum()}catch(x){}}));
let rq=null,rr=null;
function paintReq(){
  retHint();
  const w=$('p_req');w.textContent='';$('p_mailF').hidden=false;$('p_sum').hidden=false;paintPrivSum();try{paintAnon()}catch(e){}$('p_wa').onclick=sendWaInfo;
  $('p_laterW').hidden=!!editing;if(editing||$('p_inf').checked)$('p_later').checked=false;if(!$('p_laterW').dataset.w){$('p_laterW').dataset.w=1;$('p_inf').addEventListener('change',()=>{if($('p_inf').checked)$('p_later').checked=false})}
  if(!editing){const pb=$('p_prep');pb.disabled=false;pb.innerHTML=ICONS.Scrivi+'Invia informativa';pb.onclick=()=>viaNew('email');return}
  const p=editing.privacy||mkPriv(),R=p.richieste||[],pend=R.find(r=>effSt(r)==='inviata'),ok=!!editing.email,given=CONS.filter(k=>p.cons[k]&&p.cons[k].v).map(k=>CLABEL[k]);

  const pb=$('p_prep');pb.disabled=!ok;if(pend&&ok)autoReq(pend);
  if(pend){const fr=AUTOREP[pend.token];pb.innerHTML=(fr?ICONS.check+'Risposta trovata: esamina':ICONS.search+'Controlla risposta in '+PV().nome);pb.onclick=()=>fr?showFound(pend,fr.best,fr.P):checkReplies(pend,pb)}else{pb.innerHTML=ICONS.Scrivi+(p.informativa?'Reinvia informativa':'Invia informativa');pb.onclick=openSend}
  $('p_mailhint').textContent=!ok?'Aggiungi e salva un’email del cliente nella scheda Dati.':(!S.azienda?'Imposta il nome azienda in Menu → Impostazioni: è il titolare indicato nell’informativa.':'');
  ((editing.privacy&&editing.privacy.richieste)||[]).slice().reverse().forEach(r=>{
    const st=effSt(r),C={inviata:['In attesa di risposta','#f6edb8'],completata:['Completata','#b5ebc0'],scaduta:['Scaduta','#f5cad6'],annullata:['Annullata','#dde3ee']}[st];
    const d=h('div','req'),ch=h('i','chip',C[0]);ch.style.background=C[1];
    d.append(ch,h('div','','Inviata il '+fmtDT(r.creata+'Z')+' a '+r.email+(r.via&&r.via!=='mailto'?' (da '+provName(r.via)+')':'')),h('div','','Codice '+r.token+', valido fino al '+fmtD(r.scade.slice(0,10))+(r.stato==='completata'?'. Risposta ricevuta il '+fmtDT(r.ricevuta+'Z')+'.':'')));
    if(r.consegna){d.append(h('div',r.consegna.stato==='respinta'?'warn':'','Consegna: '+(r.consegna.stato==='respinta'?'email respinta, controlla l’indirizzo':'nessun errore rilevato')+' (verificata il '+fmtDT(r.consegna.verificata+'Z')+')'))}
    if(st==='inviata'){const dd=Math.floor((Date.now()-new Date(r.creata+'Z'))/864e5);if(dd>=7)d.append(h('div','warn','Nessuna risposta da '+dd+' giorni.'));
      const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS.check+'Registra risposta';b.onclick=()=>openResp(r);
      const x=h('button','btn lbl');x.type='button';x.innerHTML=ICONS.x+'Annulla richiesta';x.onclick=()=>askConfirm('Annullare la richiesta con codice '+r.token+'? Il codice non potrà più essere usato.','x','Annulla richiesta',()=>{r.stato='annullata';logP(editing,'Richiesta di consenso annullata (codice '+r.token+')','annullo');persist();loadPriv(editing.privacy)});
      const fr=AUTOREP[r.token];if(fr){const fb=h('button','btn p lbl');fb.type='button';fb.innerHTML=ICONS.check+'Risposta trovata: esamina';fb.onclick=()=>showFound(r,fr.best,fr.P);d.append(fb)}else d.append(h('div','hint','Controllo automatico delle risposte in '+PV().nome+' attivo.'));if(dd>=7){const rb=h('button','btn lbl');rb.type='button';rb.innerHTML=ICONS.Scrivi+'Invia promemoria';rb.onclick=()=>remind(r);d.append(rb)}d.append(b,x)}
    w.append(d)})}
function openSend(){
  if(!editing||!editing.email)return;
  if(!S.azienda){toast('Imposta prima il nome azienda: è il titolare indicato nell’informativa.');openSettings();setErr('st_az','Inserisci il nome dell’azienda.');return}
  const now=new Date();
  rq={id:'r'+Date.now().toString(36),token:tok(),creata:now.toISOString().slice(0,16),scade:new Date(now.getTime()+14*864e5).toISOString().slice(0,16),email:editing.email,stato:'inviata'};
  $('ms_to').value=rq.email;$('ms_sub').value=INFO_SUBJ();$('ms_body').value=mailText(editing,rq);$('ms_op').value=opName;setErr('ms_op','');setErr('ms_gmail','');$('ms_gmail').hidden=true;gm().then(m=>{$('ms_gmail').hidden=!(m&&autoOk());$('ms_gmail').lastChild.textContent='Invia con '+PV().nome}).catch(()=>{});$('mSend').hidden=false}
$('p_prep').onclick=openSend;
$('ms_x').onclick=()=>{$('mSend').hidden=true};
$('ms_copy').onclick=async()=>toast(await copyText('Oggetto: '+$('ms_sub').value+'\n\n'+$('ms_body').value)?'Testo copiato.':'Copia non riuscita.');
$('ms_open').onclick=()=>launch('mailto:'+rq.email+'?subject='+encodeURIComponent($('ms_sub').value)+'&body='+encodeURIComponent($('ms_body').value),$('ms_body').value);
$('ms_ok').onclick=()=>{
  const op=$('ms_op').value.trim();if(!op){setErr('ms_op','Indica chi registra l’invio.');return}
  saveOp(op);const p=editing.privacy=editing.privacy||mkPriv();p.richieste=p.richieste||[];p.richieste.push(rq);
  logP(editing,'Informativa inviata via email a '+rq.email+' (codice '+rq.token+', valido fino al '+fmtD(rq.scade.slice(0,10))+')','invio');
  persist();$('mSend').hidden=true;loadPriv(p);render();toast('Invio registrato nel registro.')};
CONS.forEach(k=>{const r=h('div','mrrow');r.append(h('span','',CLABEL[k]));const s=h('select');s.id='mr_'+k;[['','Nessuna modifica'],['dato','Consenso dato'],['revoca','Consenso revocato']].forEach(([v,t])=>{const o=h('option','',t);o.value=v;s.append(o)});r.append(s);$('mr_cons').append(r)});
function openResp(r){rr=r;rrMsg=null;rrFrom='';$('mr_mailF').hidden=true;$('mr_newmail').checked=false;setErr('mr_newmail','');$('mResp').firstElementChild.classList.remove('compact');$('mr_hint').textContent='Richiesta inviata il '+fmtDT(r.creata+'Z')+'. Il codice indicato dal cliente deve coincidere con quello inviato.';
  $('mr_code').value='';$('mr_date').value=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16);$('mr_ev').value='';$('mr_op').value=opName;
  CONS.forEach(k=>{$('mr_'+k).value=''});['code','date','ev','op'].forEach(x=>setErr('mr_'+x,''));$('mResp').hidden=false}
$('mr_x').onclick=()=>{$('mResp').hidden=true};
$('mr_ok').onclick=()=>{
  let ok=true;const bad=(k,t)=>{setErr('mr_'+k,t);ok=false};['code','date','ev','op'].forEach(k=>setErr('mr_'+k,''));
  const code=$('mr_code').value.trim().toUpperCase(),dt=new Date($('mr_date').value),ev=$('mr_ev').value.trim(),op=$('mr_op').value.trim();
  if(code!==rr.token)bad('code','Il codice non corrisponde a quello inviato.');
  if(isNaN(dt))bad('date','Indica data e ora di ricezione.');
  else if(dt<new Date(rr.creata+'Z'))bad('date','La risposta non può precedere l’invio.');
  else if(dt>new Date(Date.now()+3e5))bad('date','La data non può essere nel futuro.');
  else if(dt>new Date(rr.scade+'Z'))bad('date','Risposta oltre la scadenza del codice: invia una nuova email.');
  if(ev.length<5)bad('ev','Incolla il testo della risposta come prova.');
  if(!op)bad('op','Indica chi registra la risposta.');setErr('mr_newmail','');if(rrFrom&&$('mr_newmail').checked&&clients.some(c=>c!==editing&&c!==newRef&&(c.email||'').toLowerCase()===rrFrom))bad('newmail','Questo indirizzo è già usato da un altro cliente.');if(!ok)$('mResp').firstElementChild.classList.remove('compact');
  if(!ok)return;
  saveOp(op);const p=editing.privacy=editing.privacy||mkPriv(),day=ymd(dt),esito=[];
  if(!p.informativa){p.informativa=true;p.infModo='Email';p.infData=ymd(new Date(rr.creata+'Z'))}
  CONS.forEach(k=>{const v=$('mr_'+k).value;if(v){const on=v==='dato';p.cons[k]={v:on,d:day};esito.push(CLABEL[k]+': '+(on?'prestato':'revocato'));logP(editing,CLABEL[k]+': '+(on?'prestato':'revocato')+' via email (codice '+rr.token+')',on?'consenso':'revoca')}});
  rr.stato='completata';if(rrMsg)rr.gmailMsgId=rrMsg;if(rrFrom)rr.mittente=rrFrom;
  if(rrFrom&&$('mr_newmail').checked){const old=editing.email;editing.email=rrFrom;$('email').value=rrFrom;logP(editing,'Email del cliente aggiornata da '+old+' a '+rrFrom+' (risposta con codice '+rr.token+')','email')}rr.ricevuta=dt.toISOString().slice(0,16);rr.evidenza=ev;rr.esito=esito;rr.op=op;
  logP(editing,'Risposta registrata (codice '+rr.token+', ricevuta il '+fmtDT(rr.ricevuta+'Z')+'): '+(esito.join('; ')||'nessuna modifica ai consensi'),'risposta');
  persist();$('mResp').hidden=true;loadPriv(p);render();toast('Anagrafica aggiornata.')};
function finishSend(via,res){
  const p=editing.privacy=editing.privacy||mkPriv();p.richieste=p.richieste||[];
  rq.via=via==='auto'?PV().id:via;const pl=res&&res.payload;if(pl&&typeof pl==='object'){if(pl.id)rq.msgId=String(pl.id);if(pl.threadId)rq.threadId=String(pl.threadId)}
  p.richieste.push(rq);
  logP(editing,'Informativa inviata '+(via==='auto'?'da '+PV().nome+' ':'via email ')+'a '+rq.email+' (codice '+rq.token+', valido fino al '+fmtD(rq.scade.slice(0,10))+')','invio');
  persist();$('mSend').hidden=true;loadPriv(p);render();toast(via==='auto'?'Email inviata e registrata nel registro.':'Invio registrato nel registro.')}
async function doGmailSend(){
  const b=$('ms_gmail');b.disabled=true;setErr('ms_gmail','');
  try{
    const mcp=await gm();
    if(!mcp||!autoOk()){setErr('ms_gmail',hasClaude()?pn('Collegamento a Gmail non disponibile qui: usa Apri posta o invia l’email a mano.'):gmNo()+' Oppure usa Apri posta.');return}
    if(!S.replyTo){try{const w=await detectMe();if(w.email){S.replyTo=w.email;saveS()}}catch(e){}}
    const a={to:rq.email,subject:$('ms_sub').value,text:$('ms_body').value,fromName:mitt()};
    if(S.replyTo&&mailRe.test(S.replyTo))a.html=mailHtml($('ms_body').value,rq,S.replyTo,$('ms_sub').value);
    const res=await PV().send(mcp,a);
    finishSend('auto',res);
  }catch(e){
    const c=e&&e.code,U='Esito incerto: controlla la cartella Posta inviata di Gmail prima di riprovare. Se l’email è partita, tocca “Ho inviato l’email”.';
    const M={server_not_connected:'Gmail non è collegato: collegalo da Impostazioni, Connettori, su claude.ai.',needs_reauth:'La connessione a Gmail è scaduta: ricollegala da Impostazioni, Connettori, su claude.ai.',selection_required:'Hai più connettori Gmail: sceglinone uno quando richiesto e riprova.',not_in_manifest:'Autorizzazione negata: riprova e consenti a questa pagina di usare Gmail.',approval_required:'Serve la tua approvazione: riprova e consenti l’invio.',blocked_by_policy:'Il tuo amministratore blocca l’invio da Gmail.',tool_error:'Gmail ha rifiutato l’invio. Controlla l’indirizzo del destinatario.',server_unavailable:U,upstream_error:U,cancelled:U};
    setErr('ms_gmail',pn(M[c]||'Invio non riuscito. Riprova o invia l’email a mano.'));
  }finally{b.disabled=false}}
$('ms_gmail').onclick=()=>{const op=$('ms_op').value.trim();if(!op){setErr('ms_op','Indica chi registra l’invio.');return}saveOp(op);
  doGmailSend()};
let rrMsg=null,rrFrom='';
const pj=r=>{let p=r&&r.payload;if(typeof p==='string'){try{p=JSON.parse(p)}catch(e){}}return(p&&typeof p==='object')?p:{}};
function gmReadErr(e){return pn(gmReadErr0(e))}
function gmReadErr0(e){const c=e&&e.code;if(e&&e.gd&&GDM[c])return GDM[c];return({server_not_connected:'Gmail non è collegato: collegalo da Impostazioni, Connettori, su claude.ai.',needs_reauth:'La connessione a Gmail è scaduta: ricollegala da Impostazioni, Connettori.',not_in_manifest:'Autorizzazione negata: riprova e consenti la lettura di Gmail.',approval_required:'Serve la tua approvazione per leggere Gmail: riprova.',blocked_by_policy:'Il tuo amministratore blocca l’accesso a Gmail.',server_unavailable:'Gmail non risponde: riprova tra poco.'})[c]||'Lettura di Gmail non riuscita. Riprova.'}
function newText(body){const out=[];for(const l of String(body||'').split('\n')){const t=l.trim();if(t.startsWith('>')||/^(Il giorno|On)\s.*(scritto|wrote|alle ore|<.+@.+>)/i.test(t)||/^-{2,}\s*(Messaggio inoltrato|Original Message)/i.test(t))break;out.push(l)}return out.join('\n').replace(/Inviato da .*/i,'').trim()}
function parseCons(txt,token){
  const low=txt.toLowerCase(),t=txt.toUpperCase().split(token).join(' '),map={},rev=/revoc|annull|ritir|non acconsent/.test(low),v=rev?'revoca':'dato';
  if(rev&&/acconsent|autorizz/.test(low.replace(/non acconsent\w*/g,'')))return{map,none:false,amb:true};
  (t.match(/\b[1-4]\b/g)||[]).forEach(n=>{map[CONS[+n-1]]=v});
  if(/\btutt[ie]\b|\btutto\b/.test(low))CONS.forEach(k=>{map[k]=v});
  return{map,none:!Object.keys(map).length&&/\bnessun[oa]?\b/.test(low)}}
async function checkReplies(r,btn,silent){
  if(btn)btn.disabled=true;
  try{
    const mcp=await gm(),P=PV();
    if(!mcp||!P.search){if(!silent)toast('La lettura automatica non è disponibile per '+P.nome+': registra la risposta a mano.');return}
    const s=await P.search(mcp,P.qCode(r.token));
    const since=new Date(r.creata+'Z').getTime(),mail=r.email.toLowerCase();let best=null;
    for(const th of (pj(s).threads||[]).slice(0,5)){
      const g=pj(await P.thread(mcp,th.id));
      for(const m of (g.messages||[])){
        const from=(String(m.sender||'').toLowerCase().match(/[^\s<>"]+@[^\s<>"]+/)||[''])[0],same=from===mail||String(m.sender||'').toLowerCase().includes(mail),me=(S.replyTo||'').toLowerCase();
        if(!/^\s*(re|r|risposta)\s*:/i.test(m.subject||'')||+m.internalDate<since)continue;
        if(!same){if(me&&from===me)continue;if(!newText(m.plaintextBody||m.snippet||'').toUpperCase().includes(r.token))continue}
        m._from=from;m._same=same;
        if(!best||(m._same&&!best._same)||(m._same===best._same&&+m.internalDate>+best.internalDate))best=m}}
    if(!best){if(silent){if(!r.consegna&&editing&&editing.privacy&&editing.privacy.richieste.includes(r))await bounceCheck(mcp,r);return}const bn=await bounceCheck(mcp,r);toast('Nessuna risposta trovata. '+(bn?'Attenzione: l’email risulta respinta dal server del destinatario: controlla l’indirizzo.':'Nessun errore di consegna rilevato.'));return}
    if(silent){if(S.autoCons!==false&&applyReply(r,best,P)){return}
      AUTOREP[r.token]={best,P,r};if(editing&&editing.privacy&&(editing.privacy.richieste||[]).includes(r))try{loadPriv(editing.privacy)}catch(e){}return}
    showFound(r,best,P)
  }catch(e){if(!silent)toast(gmReadErr(e))}
  finally{if(btn)btn.disabled=false}}
function applyReply(r,best,P){
  try{const c=clients.find(x=>(x.privacy&&x.privacy.richieste||[]).includes(r));if(!c)return false;
    const txt=newText(best.plaintextBody||best.snippet||''),pc=parseCons(txt,r.token),hasCode=txt.toUpperCase().includes(r.token),dt=new Date(+best.internalDate);
    const vals=Object.values(pc.map);
    if(!hasCode||pc.amb||!best._same||effSt(r)!=='inviata'||isNaN(dt)||dt<new Date(r.creata+'Z')||dt>new Date(Date.now()+3e5)||dt>new Date(r.scade+'Z'))return false;
    if(!(vals.length&&vals.every(v=>v==='dato'))&&!pc.none)return false;
    const p=c.privacy=c.privacy||mkPriv(),day=ymd(dt),esito=[],opx=opName;opName='Registrazione automatica';
    if(!p.informativa){p.informativa=true;p.infModo='Email';p.infData=ymd(new Date(r.creata+'Z'))}
    CONS.forEach(k=>{if(pc.map[k]){p.cons[k]={v:true,d:day};esito.push(CLABEL[k]+': prestato');logP(c,CLABEL[k]+': prestato via email (codice '+r.token+')','consenso')}});
    r.stato='completata';r.gmailMsgId=String(best.id||'');r.mittente=best._from;r.ricevuta=dt.toISOString().slice(0,16);r.evidenza=txt+'\n\n[Messaggio '+P.nome+' '+best.id+', da '+best.sender+']';r.esito=esito;r.op='Registrazione automatica';
    logP(c,'Risposta registrata automaticamente (codice '+r.token+', ricevuta il '+fmtDT(r.ricevuta+'Z')+'): '+(esito.join('; ')||'nessun consenso facoltativo'),'risposta');opName=opx;
    persist();delete AUTOREP[r.token];if(editing===c)try{loadPriv(p)}catch(e){}try{render()}catch(e){}toast('Consensi di '+fullName(c)+' aggiornati dalla risposta.');return true}catch(e){return false}}
function showFound(r,best,P){
  {
    const txt=newText(best.plaintextBody||best.snippet||''),pc=parseCons(txt,r.token),hasCode=txt.toUpperCase().includes(r.token);
    openResp(r);rrMsg=String(best.id||'');
    $('mr_code').value=hasCode?r.token:'';
    $('mr_date').value=new Date(+best.internalDate-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16);
    $('mr_ev').value=txt+'\n\n[Messaggio '+P.nome+' '+best.id+', da '+best.sender+']';
    CONS.forEach(k=>{$('mr_'+k).value=pc.map[k]||''});
    $('mr_hint').textContent='Compilato dalla risposta trovata in '+P.nome+'. Controlla e conferma.'+(hasCode?'':' Il cliente non ha indicato il codice: verifica la sua identità.')+(pc.none?' Il cliente non ha dato consensi.':'')+(pc.amb?' La risposta mescola consensi e revoche: seleziona le voci a mano.':'');
    if(hasCode&&!pc.amb){$('mr_hint').textContent='Risposta trovata in '+P.nome+' ('+fmtDT(+best.internalDate)+'). Consensi indicati: '+(Object.keys(pc.map).map(k=>CLABEL[k]+' ('+(pc.map[k]==='dato'?'prestato':'revocato')+')').join(', ')||'nessuno')+'. Controlla e conferma.';$('mResp').firstElementChild.classList.add('compact')}
    if(!best._same){$('mResp').firstElementChild.classList.remove('compact');rrFrom=best._from;$('mr_hint').textContent='Attenzione: la risposta arriva da '+best._from+', diverso dall’indirizzo registrato ('+r.email+'). Verifica l’identità del cliente. '+$('mr_hint').textContent;$('mr_mailF').hidden=false;$('mr_newmail').checked=false;$('mr_newmail_t').textContent='Aggiorna l’email del cliente con '+best._from}
  }}
const AUTOREP={},LAST={};
let tr='',cmpTo='';
const gm=async()=>{if(typeof claude!=='undefined'){const m=await claude.use('mcp');if(m)return m}if(window.GD){GD.setClient(S.gcid||'');if(GD.ready())return GD}return null};
const hasClaude=()=>typeof claude!=='undefined';
const gmNo=d=>hasClaude()?d:'Gmail non è collegato (il collegamento dura circa un’ora): tocca Collega Gmail in Impostazioni, Posta.';
const dec=s=>new DOMParser().parseFromString(String(s||''),'text/html').documentElement.textContent;
function gmSendErr(e){return pn(gmSendErr0(e))}
const GDM={server_not_connected:'Gmail non è collegato: inserisci l’ID client e tocca Collega Gmail (Impostazioni, Posta).',needs_reauth:'La connessione a Gmail è scaduta (dura circa un’ora): tocca Collega Gmail in Impostazioni, Posta.',not_in_manifest:'Google ha negato l’accesso: ricollega Gmail e consenti sia l’invio sia la lettura.',gd_api:'La Gmail API non è attiva nel tuo progetto Google Cloud: attivala e riprova.',tool_error:'Gmail ha rifiutato la richiesta. Controlla l’indirizzo del destinatario.',server_unavailable:'Gmail non risponde: riprova tra poco.'};
function gmSendErr0(e){const c=e&&e.code;if(e&&e.gd&&GDM[c])return c==='server_unavailable'?'Esito incerto: controlla la cartella Posta inviata di Gmail prima di riprovare.':GDM[c];const U='Esito incerto: controlla la cartella Posta inviata di Gmail prima di riprovare.';return({server_not_connected:'Gmail non è collegato: collegalo da Impostazioni, Connettori, su claude.ai.',needs_reauth:'La connessione a Gmail è scaduta: ricollegala da Impostazioni, Connettori.',selection_required:'Hai più connettori Gmail: sceglinone uno e riprova.',not_in_manifest:'Autorizzazione negata: riprova e consenti l’invio.',approval_required:'Serve la tua approvazione: riprova e consenti l’invio.',blocked_by_policy:'Il tuo amministratore blocca l’invio da Gmail.',tool_error:'Gmail ha rifiutato l’invio. Controlla l’indirizzo del destinatario.',server_unavailable:U,upstream_error:U,cancelled:U})[c]||'Invio non riuscito. Riprova o usa Apri posta.'}
/* registro minimo delle email sul cliente (solo data e direzione, niente testo) */
function emSave(c,ms,local){if(!c)return 0;const em=c.em=c.em||[],mail=(c.email||'').toLowerCase();let n=0;
  const add=(id,dir,iso,stop)=>{if(!iso||isNaN(new Date(iso)))return;if(id&&em.some(e=>e.id===id)){if(stop){const e=em.find(x=>x.id===id);if(!e.stop){e.stop=1;n++}}return}
    if(dir==='out'&&id&&id[0]!=='s'&&em.some(e=>e.id&&e.id[0]==='s'&&e.dir==='out'&&Math.abs(Date.parse(e.data)-Date.parse(iso))<3e5)){const e=em.find(x=>x.id&&x.id[0]==='s'&&x.dir==='out'&&Math.abs(Date.parse(x.data)-Date.parse(iso))<3e5);e.id=id;return}
    em.push(stop?{id,dir,data:iso,stop:1}:{id,dir,data:iso});n++};
  if(local)add('s'+Date.now().toString(36),'out',new Date().toISOString());
  else(ms||[]).forEach(m=>{const t=+m.internalDate;if(!t||!m.id)return;{const inb=String(m.sender||'').toLowerCase().includes(mail);add(String(m.id),inb?'in':'out',new Date(t).toISOString(),inb&&/\bstop\b|annull\w*\s+(l.)?iscrizione|disiscri|cancellami|non voglio pi/i.test((typeof dec==='function'?dec(m.subject||''):m.subject||'')+' '+(typeof dec==='function'?dec(m.snippet||''):m.snippet||'')))}});
  if(n){c.agg=new Date().toISOString();try{persist()}catch(e){}try{if(window.applyStops&&window.applyStops())render()}catch(e){}}return n}
function paintComm(ths){
  const w=$('comm');w.textContent='';const mail=editing.email.toLowerCase(),ms=[];
  ths.forEach(t=>(t.messages||[]).forEach(m=>ms.push(m)));TM[editing.id]=ms.slice();emSave(editing,ms);try{paintAllC()}catch(e){}
  ms.sort((a,b)=>+b.internalDate-+a.internalDate);
  if(!ms.length){w.append(h('div','hint','Nessuna email scambiata con '+editing.email+'.'));return}
  w.append(h('div','hint',ms.length+' messaggi, dal più recente. Tocca un messaggio per leggere la conversazione.'));
  ms.forEach(m=>{const inb=String(m.sender||'').toLowerCase().includes(mail),d=h('div','req'),ch=h('i','chip',inb?'Ricevuta':'Inviata');ch.style.background=inb?'#b5ebc0':'#d9d1f3';
    d.tabIndex=0;d.style.cursor='pointer';d.append(ch,h('b','',dec(m.subject)||'(senza oggetto)'),h('div','',fmtDT(+m.internalDate)),h('div','',dec(m.snippet)));
    d.onclick=()=>openThread(m.threadId);d.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();openThread(m.threadId)}};w.append(d)})}
const cmStat=(t,err)=>{const e=$('allSt');if(!e)return;e.textContent=t||'';e.className=err?'err':'hint';e.hidden=!t};
async function loadComm(){
  paintWa();const w=$('comm'),cl=editing;w.textContent='';cmStat('');
  if(!cl||!cl.email){w.append(h('div','hint','Aggiungi e salva un’email del cliente nella scheda Dati.'));cmStat('Senza email del cliente le email non si leggono: aggiungila nella scheda Dati.');return}
  w.append(h('div','hint',pn('Lettura da Gmail in corso…')));cmStat('Lettura delle email da Gmail in corso…');
  try{
    const mcp=await gm();if(editing!==cl)return;
    if(!mcp){w.textContent='';w.append(h('div','hint',hasClaude()?pn('Collegamento a Gmail non disponibile in questa visualizzazione.'):gmNo()));cmStat(hasClaude()?'Collegamento a Gmail non disponibile in questa visualizzazione: si vedono solo i messaggi WhatsApp registrati.':gmNo()+' Si vedono solo i messaggi WhatsApp registrati.');return}
    const P=PV();if(!P.search){w.textContent='';w.append(h('div','hint','La lettura delle email non è ancora disponibile per '+P.nome+'.'));cmStat('La lettura delle email non è ancora disponibile per '+P.nome+'.');return}
    const s=await P.search(mcp,P.qContact(cl.email));
    if(editing!==cl)return;paintComm(pj(s).threads||[]);cmStat('');
  }catch(e){if(editing===cl){w.textContent='';w.append(h('div','err',gmReadErr(e)));$('comm').lastChild.hidden=false;cmStat(gmReadErr(e),true)}}}
async function openThread(id){
  tr='';$('mt_title').textContent='Conversazione';$('mt_body').textContent='Lettura in corso…';$('mThread').hidden=false;
  try{
    const mcp=await gm();if(!mcp){$('mt_body').textContent=hasClaude()?'Collegamento a Gmail non disponibile.':gmNo();return}
    const P=PV();if(!P.thread){$('mt_body').textContent='Non disponibile per '+P.nome+'.';return}
    const g=pj(await P.thread(mcp,id)),ms=(g.messages||[]).slice().sort((a,b)=>+a.internalDate-+b.internalDate);
    $('mt_title').textContent=dec((ms[0]&&ms[0].subject)||'Conversazione');
    const w=$('mt_body'),lines=[];w.textContent='';
    ms.forEach(m=>{const hd='['+fmtDT(+m.internalDate)+'] Da: '+m.sender+' A: '+(m.toRecipients||[]).join(', '),body=String(m.plaintextBody||dec(m.snippet)||'').trim(),b=h('div','msgb');b.append(h('div','mh',hd),h('pre','',body));w.append(b);lines.push(hd+'\n'+body)});
    tr='Oggetto: '+$('mt_title').textContent+'\n\n'+lines.join('\n\n---\n\n');
  }catch(e){$('mt_body').textContent=gmReadErr(e)}}
$('mt_copy').onclick=async()=>toast(tr&&await copyText(tr)?'Trascrizione copiata.':'Niente da copiare.');
$('mt_x').onclick=()=>{$('mThread').hidden=true};
$('cm_ref').onclick=loadComm;$('cm_new').onclick=()=>{if(editing){openCompose(editing);offerInf(editing)}};
function openCompose(c){cmpLeadRef=null;cmpInfC=null;cmpAtt=[];cmpQ=null;cmpOpts=null;$('mc_att').hidden=true;$('mc_att').textContent='';
  if(!c.email){toast('Aggiungi un’email al cliente.');return}
  cmpTo=c.email;cmpLog='';const nome=contactName(c);
  cmpName=nome;$('mc_to').value=cmpTo;$('mc_sub').value='';$('mc_body').value='Gentile '+nome+',\n\n\n\n'+firma();
  ['mc_sub','mc_body','mc_gmail'].forEach(k=>setErr(k,''));
  const ok=c.privacy&&c.privacy.cons&&c.privacy.cons.mkEmail&&c.privacy.cons.mkEmail.v;
  $('mc_hint').textContent=ok?'':'Questo cliente non ha dato il consenso al marketing via email: usa questa email solo per comunicazioni legate al rapporto in corso.';
  $('mc_gmail').hidden=true;
  const T=$('mc_tpl');T.textContent='';TEMPLATES.forEach(([l,s,t])=>{const b=h('button','',l);b.type='button';b.style.background='var(--lilac)';b.onclick=()=>{$('mc_sub').value=subj(s);$('mc_body').value=tpl('Gentile {nome},\n\n'+t+'\n\n',{nome})+firma()};T.append(b)});
  gm().then(m=>{$('mc_gmail').hidden=!((m||(!hasClaude()&&S.gcid&&PV().id==='gmail'))&&autoOk());$('mc_gmail').lastChild.textContent='Invia con '+PV().nome}).catch(()=>{});mcActs();$('mCompose').hidden=false}
$('mr_more').onclick=()=>$('mResp').firstElementChild.classList.remove('compact');
$('mc_x').onclick=()=>{$('mCompose').hidden=true};
const mcFiles=()=>cmpAtt.map(a=>new File([a.u8],a.name,{type:a.mime||'application/pdf'}));
const canShareF=()=>{try{return !!(cmpAtt.length&&navigator.share&&navigator.canShare&&navigator.canShare({files:mcFiles()}))}catch(e){return false}};
const attNote=()=>canShareF()?'Con “Condividi con allegati” li alleghi in un tocco; con “Apri posta” vanno allegati a mano.':'Con “Apri posta” i file vengono salvati e vanno allegati a mano.';
function mcActs(){const ok=canShareF();$('mc_share').hidden=!ok;$('mc_open').classList.toggle('p',!ok)}
const mcCheck=()=>{const s=$('mc_sub').value.trim(),t=$('mc_body').value.trim();setErr('mc_sub',s?'':'Inserisci l’oggetto.');setErr('mc_body',t?'':'Scrivi il testo del messaggio.');return !!(s&&t)};
$('mc_open').onclick=async()=>{if(!mcCheck())return;let bad=false;for(const a of cmpAtt){if(!(await savePdf(a.u8,a.name)))bad=true}if(bad)toast('Allegati non salvati: allegali a mano.');launchMail()};
$('mc_share').onclick=async()=>{if(!mcCheck())return;try{await navigator.share({files:mcFiles(),title:$('mc_sub').value.trim(),text:$('mc_body').value})}catch(e){if(e&&e.name==='AbortError')return;toast('Condivisione non riuscita: usa Apri posta.')}};
$('mc_done').onclick=()=>{if(!mcCheck())return;afterSent('Registrata come inviata.')};
const launchMail=()=>launch('mailto:'+cmpTo+'?subject='+encodeURIComponent($('mc_sub').value)+'&body='+encodeURIComponent($('mc_body').value),$('mc_body').value);
function afterSent(msg){
    {const cc=clients.find(x=>x.email&&x.email.toLowerCase()===String(cmpTo||'').toLowerCase());if(cc)emSave(cc,null,true)}
    if(cmpLeadRef&&$('mc_body').value.includes(INF_MARK)){const inf={d:ymd(),via:'Email'};if(cmpLeadRef.l){cmpLeadRef.l.inf=inf;persistL()}else pendInf[cmpLeadRef.email]=inf}
    if(cmpLeadRef&&cmpLeadRef.l){lLog(cmpLeadRef.l,{dir:'out',via:'Email',data:new Date().toISOString(),oggetto:$('mc_sub').value.trim(),testo:$('mc_body').value.split(INF_MARK)[0].trim()+($('mc_body').value.includes(INF_MARK)?'\n[+ informativa privacy]':'')});try{paintLM()}catch(e){}}
    if(cmpInfC&&$('mc_body').value.includes(INF_MARK)){const c=cmpInfC,pv=c.privacy=c.privacy||mkPriv();pv.informativa=true;pv.infData=ymd();pv.infModo='Email';pv.infVer='1.0';logP(c,'Informativa inviata via email a '+cmpTo,'invio');persist();if(editing===c)loadPriv(pv);try{render()}catch(e){}}
    if(cmpLog){logP(editing,cmpLog,'promemoria');persist();loadPriv(editing.privacy);cmpLog=''}$('mCompose').hidden=true;toast(cmpQ?markSent(cmpQ,'Email registrata. Preventivo impostato su “Inviato”.','email'):(msg||'Email inviata.'));if(!$('commF').classList.contains('pane-hide'))loadComm();
}
async function doCompose(){
  const b=$('mc_gmail');b.disabled=true;setErr('mc_gmail','');
  try{
    const mcp=await gm();if(!mcp){setErr('mc_gmail',hasClaude()?'Collegamento a Gmail non disponibile qui: usa Apri posta.':gmNo()+' Oppure usa Apri posta.');return}
    if(!autoOk()){setErr('mc_gmail','L’invio automatico non è disponibile per '+PV().nome+': usa Apri posta.');return}
    await PV().send(mcp,{to:cmpTo,subject:$('mc_sub').value.trim(),text:$('mc_body').value,html:mailHtmlBro($('mc_body').value)||undefined,fromName:mitt(),atts:cmpAtt.map(a=>({name:a.name,b64:b64(a.u8),mime:a.mime}))});
    afterSent();
  }catch(e){setErr('mc_gmail',gmSendErr(e))}
  finally{b.disabled=false}}
$('mc_gmail').onclick=()=>{
  const s=$('mc_sub').value.trim(),t=$('mc_body').value.trim();setErr('mc_sub',s?'':'Inserisci l’oggetto.');setErr('mc_body',t?'':'Scrivi il testo del messaggio.');
  if(!s||!t)return;
  doCompose()};
let cmpInfC=null,cmpLeadRef=null,cmpName='',cmpLog='',cmpAtt=[],cmpQ=null,cmpOpts=null;
let S={azienda:'',replyTo:'',alias:'',firma:'Cordiali saluti\n{azienda}',provider:'mailto'};try{S=Object.assign(S,JSON.parse(localStorage.getItem('crm-settings-v1')||'{}'))}catch(e){}
S.ret=Object.assign({contratto:120,contatti:24,marketing:24,profilazione:12,comunicazioni:24},S.ret||{});
if(S.wa){delete S.wa.bus;delete S.wa.send}
S.qValid=S.qValid>0?S.qValid:30;S.qCond=S.qCond||'Prezzi in euro, IVA esclusa salvo diversa indicazione. Pagamento e tempi di consegna da concordare.';
S.lead=Object.assign({scartati:30,nuovi:12,giorni:30,inf:true},S.lead||{});
S.wa=Object.assign({paese:'IT',inf:'full',tpl:[['Ciao','Ciao {nome}, '],['Ordine','Ciao {nome}, ti scrivo per il tuo ordine: '],['Preventivo','Ciao {nome}, ti ho inviato il preventivo. Dimmi se va bene o se vuoi modificare qualcosa.'],['Grazie','Ciao {nome}, grazie per il tempo dedicatoci! ']]},S.wa||{});
function savedOK(){try{return localStorage.getItem('crm-settings-v1')===JSON.stringify(S)}catch(e){return false}}
function swSave(inp,fn,msgOn,msgOff){const v=inp.checked;try{fn(v)}catch(e){}if(savedOK())toast(v?msgOn:msgOff);else{inp.checked=!v;try{fn(!v)}catch(e){}toast('Non sono riuscito a salvare la modifica. Riprova.')}}
function saveS(){try{localStorage.setItem('crm-settings-v1',JSON.stringify(S))}catch(e){}}
const mailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
/* ===== Parametri azienda e segnaposto dinamici ===== */
const az=()=>S.azienda||'',mitt=()=>S.alias||S.azienda||'';
const tpl=(s,v)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>{const d=Object.assign({azienda:az(),mittente:mitt()},v||{});return d[k]!==undefined?d[k]:m});
const subj=s=>tpl(s).replace(/\s+–\s*$/,'');
const firma=()=>tpl(S.firma||'Cordiali saluti\n{azienda}').replace(/\n{3,}/g,'\n\n').trim();
const INFO_SUBJ=()=>'Informativa sulla privacy'+(az()?' – '+az():'')+' e richiesta di consensi';
const TEMPLATES=[['Ringraziamento','Grazie per il nostro incontro – {azienda}','grazie per il tempo dedicatoci. Restiamo a disposizione per qualsiasi chiarimento.'],['Preventivo','Il nostro preventivo – {azienda}','come concordato le invio il nostro preventivo. Resto a disposizione per ogni chiarimento.'],['Seguito','Aggiornamento sulla nostra conversazione – {azienda}','volevo sapere se ha avuto modo di valutare la nostra proposta.']];
/* ===== Strato provider di posta =====
   Ogni provider espone la stessa interfaccia:
   send(mcp,{to,subject,text,html,fromName}), search(mcp,query), thread(mcp,id),
   qContact/qCode/qBounce/qSent (costruttori di ricerca nel linguaggio del provider).
   I messaggi restituiti devono avere la forma canonica: id, threadId, sender, toRecipients,
   subject, internalDate (ms), plaintextBody, snippet, labelIds.
   Un provider senza send/search resta in modalità manuale (Apri posta, Copia). */
const PROVIDERS=[
 {id:'mailto',nome:'Programma di posta del dispositivo',gruppo:'Consigliato',stato:'manuale'},
 {id:'gmail',nome:'Gmail',server:'Gmail',gruppo:'Avanzato: invio automatico',stato:'attivo',alias:'account',aliasHelp:'In Gmail il nome del mittente si imposta nell’account: Impostazioni, Account e importazione, Invia messaggio come.',
  send:(m,a)=>{const g={to:[a.to],subject:a.subject,body:a.text};if(a.html)g.htmlBody=a.html;if(a.atts&&a.atts.length)g.attachments=a.atts.map(x=>({filename:x.name,content:x.b64,mimeType:x.mime||'application/pdf'}));return m.callTool('Gmail','send_message',g)},
  search:(m,q)=>m.callTool('Gmail','search_threads',{query:q,pageSize:20}),
  thread:(m,id)=>m.callTool('Gmail','get_thread',{threadId:id}),
  qContact:e=>'from:'+e+' OR to:'+e+' OR cc:'+e,qCode:t=>'"'+t+'"',
  qInbound:'in:inbox newer_than:30d -category:promotions -category:social -category:updates -category:forums',qBounce:(e,d)=>'from:(mailer-daemon OR postmaster) "'+e+'" after:'+d.replace(/-/g,'/'),qSent:'in:sent'}];
const PV=()=>PROVIDERS.find(p=>p.id===S.provider)||PROVIDERS[0];
const autoOk=()=>!!PV().send;
const pn=s=>String(s).replace(/Gmail/g,PV().nome);
const provName=id=>(PROVIDERS.find(p=>p.id===id)||{nome:id}).nome;
let detName='';
async function detectMe(P=PV()){const mcp=await gm();const E={email:'',name:''};if(!mcp||!P.search)return E;const s=await P.search(mcp,P.qSent);for(const t of(pj(s).threads||[]))for(const m of(t.messages||[]))if((m.labelIds||[]).includes('SENT')){const raw=String(m.sender||''),x=raw.match(/[^\s<>"]+@[^\s<>"]+/);if(x)return{email:x[0].toLowerCase(),name:raw.replace(/<[^>]*>/g,'').replace(/["']/g,'').replace(x[0],'').trim()}}return E}
async function provStatus(P){if(!P.server)return null;try{const mcp=await gm();if(!mcp||!mcp.listTools)return null;const r=await mcp.listTools(),s=((r&&r.servers)||[]).find(x=>x.server===P.server);return s?s.authStatus:'assente'}catch(e){return null}}
const selProv=()=>PROVIDERS.find(p=>p.id===$('st_prov').value)||PROVIDERS[0];
function fillProv(){const s=$('st_prov');s.textContent='';const g={};PROVIDERS.forEach(p=>{if(!g[p.gruppo]){const o=document.createElement('optgroup');o.label=p.gruppo;s.append(o);g[p.gruppo]=o}const op=h('option','',p.nome+({prossimo:' (in arrivo)',server:' (con l’app)'}[p.stato]||''));op.value=p.id;g[p.gruppo].append(op)})}
function aliasHint(){const P=selProv(),al=$('st_alias').value.trim()||$('st_az').value.trim();let t;
  if(P.alias==='account'){t=P.aliasHelp;if(detName&&al)t+=detName.toLowerCase()===al.toLowerCase()?' Il nome attualmente mostrato coincide.':' Il nome attualmente mostrato è «'+detName+'», diverso da «'+al+'».'}
  else if(P.alias==='messaggio')t='Questo servizio permette di indicare il nome del mittente a ogni messaggio.';
  else t='Il nome mostrato al destinatario dipende dall’account di posta o dal programma usato. Il nome azienda compare comunque in oggetto, testo e firma.';
  $('st_aliashint').textContent=t}
function gdPaint(){const e=$('st_gds');if(!e)return;const c=($('st_gcid').value||'').trim();GD.setClient(c);e.textContent=GD.ready()?'Gmail è collegato. Il collegamento dura circa un’ora: poi tocca di nuovo Collega Gmail.':c?'Non collegato: tocca Collega Gmail.':'Inserisci l’ID client per collegare Gmail.'}
function provHint(){const P=selProv(),el=$('st_provhint');{const dt=$('st_det');if(dt)dt.hidden=P.id!=='gmail'}const dir=P.id==='gmail'&&!hasClaude();{const b=$('st_gd');if(b)b.hidden=!dir}if(dir){el.textContent='Gmail si collega direttamente al tuo account Google: le email vanno dal tuo dispositivo a Google, senza passare da altri server.';gdPaint();return}
  const T={manuale:'Nessun collegamento e nessun permesso: scrivi l’email qui e inviala dal tuo programma di posta con Apri posta (o con Condividi con allegati, se ci sono PDF). Poi tocca Segna come inviata. Le risposte dei clienti si registrano a mano.',};
  if(P.stato!=='attivo'){el.textContent=T[P.stato]||'';return}
  el.textContent='Verifica del collegamento…';
  provStatus(P).then(s=>{if(selProv()!==P)return;el.textContent=s==='connected'?P.nome+' è collegato.':s==='needs_reauth'?'La connessione a '+P.nome+' è scaduta: ricollegala da claude.ai, Impostazioni, Connettori.':s==='assente'?P.nome+' non risulta collegato: collegalo da claude.ai, Impostazioni, Connettori.':''})}
function mailHtml(txt,r,rt,sj){
  const i=txt.indexOf('\nCONSENSI FACOLTATIVI\n'),a=i<0?txt:txt.slice(0,i),b=i<0?'':txt.slice(i+22),sub='Re: '+(sj||INFO_SUBJ());
  const lk=(l,body,bg)=>'<a href="mailto:'+esc(rt)+'?subject='+encodeURIComponent(sub)+'&amp;body='+encodeURIComponent(body)+'" style="display:block;margin:8px 0;padding:12px 16px;background:'+bg+';color:#263045;text-decoration:none;border-radius:10px;font-weight:bold;text-align:center">'+l+'</a>';
  return '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#263045;max-width:560px">'+esc(a).replace(/\n/g,'<br>')+'<p><b>CONSENSI FACOLTATIVI</b><br>Tocca un pulsante: si aprirà una risposta già compilata, ti basterà premere Invia.</p>'+lk('Acconsento a tutto',r.token+' 1 2 3 4','#b5ebc0')+lk('Solo marketing via email',r.token+' 1','#d9d1f3')+lk('Nessun consenso',r.token+' nessuno','#f5cad6')+lk('Scelgo io le voci',r.token+'\nAcconsento alle voci n.: ','#f6edb8')+'<p>'+esc(b).replace(/\n/g,'<br>')+'</p><p style="font-size:12px;color:#6b7488">Questa email non contiene strumenti di tracciamento.</p></div>'}
async function bounceCheck(mcp,r){
  const P=PV();if(!P.search)return false;const s=await P.search(mcp,P.qBounce(r.email,r.creata.slice(0,10)));
  const since=new Date(r.creata+'Z').getTime();let hit=null;
  for(const t of(pj(s).threads||[]))for(const m of(t.messages||[]))if(+m.internalDate>=since&&!hit)hit=m;
  r.consegna={stato:hit?'respinta':'ok',verificata:new Date().toISOString().slice(0,16)};
  logP(editing,'Verifica consegna: '+(hit?'email respinta dal server del destinatario':'nessun errore di consegna rilevato')+' (codice '+r.token+')','consegna');persist();loadPriv(editing.privacy);return!!hit}
function remind(r){openCompose(editing);$('mc_sub').value='Promemoria: informativa sulla privacy'+(az()?' – '+az():'');
  $('mc_body').value='Gentile '+cmpName+',\n\nle abbiamo inviato alcuni giorni fa la nostra informativa sulla privacy. Se desidera indicare i consensi facoltativi, può rispondere alla nostra email precedente con il codice '+r.token+' e i numeri delle voci. Non è necessario rispondere se non desidera prestare consensi.\n\n'+firma();
  cmpLog='Promemoria inviato via email (codice '+r.token+')'}
function openSettings(){setSp(null);try{$('st_gcid').value=S.gcid||''}catch(e){}try{paintCloud();paintDrive()}catch(e){}paintWaSet();$('st_qv').value=S.qValid;$('st_qc').value=S.qCond;$('st_ls').value=S.lead.scartati;$('st_ln').value=S.lead.nuovi;$('st_lg').value=S.lead.giorni;$('st_linf').checked=S.lead.inf!==false;['st_qv','st_ls','st_ln','st_lg'].forEach(k=>setErr(k,''));try{paintBro()}catch(e){}$('st_piva').value=S.piva||'';$('st_ind').value=S.indirizzo||'';$('st_tel').value=S.telefono||'';$('st_sito').value=S.sito||'';fillProv();$('st_acons').checked=S.autoCons!==false;$('st_az').value=S.azienda;$('st_alias').value=S.alias;$('st_firma').value=S.firma;$('st_prov').value=PV().id;$('st_rt').value=S.replyTo;['contratto','contatti','marketing','profilazione','comunicazioni'].forEach(k=>{$('st_r_'+k).value=S.ret[k];setErr('st_r_'+k,'')});['st_rt','st_az'].forEach(k=>setErr(k,''));detName='';aliasHint();provHint();$('mSet').hidden=false;stTouched=false;stBase=stSig();setTimeout(()=>{if(!stTouched)stBase=stSig()},900)}
['st_az','st_alias'].forEach(id=>$(id).addEventListener('input',aliasHint));
let stTouched=false,stBase='';
const stSig=()=>[...$('mSet').querySelectorAll('input:not([type=file]):not([data-ns]),select:not([data-ns]),textarea')].map(e=>e.type==='checkbox'?(e.checked?1:0):e.value).join('\u0001');
$('mSet').addEventListener('input',()=>{stTouched=true});$('mSet').addEventListener('change',()=>{stTouched=true});
$('st_gdb').onclick=async()=>{const b=$('st_gdb'),id=($('st_gcid').value||'').trim();if(!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(id)){$('st_gds').textContent='L’ID client deve finire con .apps.googleusercontent.com.';return}
  S.gcid=id;GD.setClient(id);b.disabled=true;$('st_gds').textContent='Apro l’accesso Google…';
  try{await GD.connect();saveS();if(!$('st_rt').value.trim()){try{const w=await detectMe(selProv());if(w.email){$('st_rt').value=w.email;detName=w.name;aliasHint()}}catch(e){}}toast('Gmail collegato.')}
  catch(e){$('st_gds').textContent=e&&e.code==='server_unavailable'?'Impossibile contattare Google: controlla la connessione.':'Accesso non riuscito o annullato. Controlla l’ID client e che la tua email sia tra gli utenti di prova.';b.disabled=false;return}
  b.disabled=false;gdPaint()};
$('st_gcid').addEventListener('input',()=>{try{gdPaint()}catch(e){}});
$('st_prov').addEventListener('change',()=>{detName='';aliasHint();provHint()});
$('st_x').onclick=()=>{$('mSet').hidden=true};
saveBtn($('stSv'),stSig,()=>{stStay=!!spCur;try{$('st_ok').onclick()}finally{stStay=false}},()=>stBase);
let stStay=false;
$('stBack').onclick=()=>{if(spCur){if(stSig()===stBase){setSp(null);return}$('mDirty').hidden=false;$('dC').onclick=()=>{$('mDirty').hidden=true};$('dN').onclick=()=>{$('mDirty').hidden=true;openSettings()};$('dY').onclick=()=>{$('mDirty').hidden=true;stStay=true;try{$('st_ok').onclick()}finally{stStay=false}};return}if(stSig()===stBase){$('mSet').hidden=true;return}$('mDirty').hidden=false;$('dC').onclick=()=>{$('mDirty').hidden=true};$('dN').onclick=()=>{$('mDirty').hidden=true;$('mSet').hidden=true};$('dY').onclick=()=>{$('mDirty').hidden=true;$('st_ok').onclick()}};
$('st_det').onclick=async()=>{const b=$('st_det');b.disabled=true;setErr('st_rt','');try{const w=await detectMe(selProv());if(w.email){$('st_rt').value=w.email;detName=w.name;aliasHint()}else setErr('st_rt','Non sono riuscito a rilevarlo: scrivilo a mano.')}catch(e){setErr('st_rt',gmReadErr(e))}finally{b.disabled=false}};
$('st_ok').onclick=()=>{const RK=['contratto','contatti','marketing','profilazione','comunicazioni'],nr={};let rok=true;RK.forEach(k=>{const v=parseInt($('st_r_'+k).value,10);if(!(v>=1&&v<=240)){setErr('st_r_'+k,'Inserisci i mesi (da 1 a 240).');rok=false;setSp('pv')}else{setErr('st_r_'+k,'');nr[k]=v}});if(!rok)return;const NV=[['st_qv',1,365,'pr'],['st_ls',1,365,'ld'],['st_ln',1,60,'ld'],['st_lg',1,365,'ld']],nvv={};for(const [k,a,b,pn] of NV){const v=parseInt($(k).value,10);if(!(v>=a&&v<=b)){setSp(pn);setErr(k,'Inserisci un numero da '+a+' a '+b+'.');return}setErr(k,'');nvv[k]=v}
  S.gcid=($('st_gcid').value||'').trim();S.wa={paese:$('st_wpaese').value||'IT',inf:$('st_winf').value,tpl:[...document.querySelectorAll('#st_wtpl .wt')].map(r=>[r.querySelector('input').value.trim(),r.querySelector('textarea').value]).filter(x=>x[0]&&x[1].trim())};if(!S.wa.tpl.length)S.wa.tpl=[['Ciao','Ciao {nome}, ']];S.qValid=nvv.st_qv;S.qCond=$('st_qc').value.trim()||S.qCond;S.lead={scartati:nvv.st_ls,nuovi:nvv.st_ln,giorni:nvv.st_lg,inf:$('st_linf').checked};S.ret=nr;const rt=$('st_rt').value.trim().toLowerCase();if(rt&&!mailRe.test(rt)){setSp('em');setErr('st_rt','Indirizzo email non valido.');return}S.azienda=$('st_az').value.trim();S.piva=$('st_piva').value.trim();S.indirizzo=$('st_ind').value.trim();S.telefono=$('st_tel').value.trim();S.sito=$('st_sito').value.trim();S.alias=$('st_alias').value.trim();S.firma=$('st_firma').value.trim()||'Cordiali saluti\n{azienda}';S.autoCons=$('st_acons').checked;S.provider=$('st_prov').value;S.replyTo=rt;saveS();if(stStay){stStay=false;setSp(null);stBase=stSig()}else $('mSet').hidden=true;try{paintReq()}catch(e){}toast('Impostazioni salvate.')};
function renderLinked(){
  const f=$('linkedF'),w=$('linked');w.textContent='';
  if(!editing){f.hidden=true;return}
  f.hidden=false;
  const l=opps.filter(o=>o.clienteId===editing.id).sort((a,b)=>fIdx(a.fase)-fIdx(b.fase)||(a.data||'9').localeCompare(b.data||'9'));
  $('cCnt').textContent=l.filter(o=>o.fase!=='vinta'&&o.fase!=='persa').length||'';if(!l.length)w.append(h('div','hint','Nessuna opportunità collegata.'));
  l.forEach(o=>w.append(oCard(o,false)))}
$('addOppFor').onclick=()=>{const id=editing&&editing.id;openOpp(null);if(id){$('o_cliente').value=id;$('o_cliente').disabled=true;$('o_clh').textContent='Cliente impostato dall’anagrafica: non modificabile.';autoTitle()}};
const nrm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
(()=>{const inp=$('indirizzo'),box=$('addrList');let t,ctl,last='',phDown=0;
const hide=()=>{box.hidden=true;box.textContent='';inp.setAttribute('aria-expanded','false')};
const show=items=>{box.textContent='';items.forEach(it=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.textContent=it.t;if(it.s){const s=document.createElement('small');s.textContent=it.s;b.append(s)}b.onmousedown=e=>e.preventDefault();b.onclick=()=>{inp.value=addrC(it.t);last=inp.value;hide();inp.dispatchEvent(new Event('input',{bubbles:true}))};box.append(b)});box.hidden=!items.length;inp.setAttribute('aria-expanded',String(!!items.length))};
const pk=s=>s.split(',').flatMap(x=>{const[a,b]=x.split('-');if(!b)return[+a];const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o});
const CAPS_RAW=`Abano Terme|PD|35031
Abbadia Cerreto|LO|26834
Abbadia Lariana|LC|23821
Abbadia San Salvatore|SI|53021
Abbasanta|OR|09071
Abbateggio|PE|65020
Abbiategrasso|MI|20081
Abetone Cutigliano|PT|51024
Abriola|PZ|85010
Acate|RG|97011
Accadia|FG|71021
Acceglio|CN|12021
Accettura|MT|75011
Acciano|AQ|67020
Accumoli|RI|02011
Acerenza|PZ|85011
Acerno|SA|84042
Acerra|NA|80011
Aci Bonaccorsi|CT|95020
Aci Castello|CT|95021
Aci Catena|CT|95022
Aci Sant'Antonio|CT|95025
Acireale|CT|95024
Acquafondata|FR|03040
Acquaformosa|CS|87010
Acquafredda|BS|25010
Acqualagna|PU|61041
Acquanegra Cremonese|CR|26020
Acquanegra sul Chiese|MN|46011
Acquapendente|VT|01021
Acquappesa|CS|87020
Acquaro|VV|89832
Acquasanta Terme|AP|63095
Acquasparta|TR|05021
Acquaviva Collecroce|CB|86030
Acquaviva Picena|AP|63075
Acquaviva Platani|CL|93010
Acquaviva d'Isernia|IS|86080
Acquaviva delle Fonti|BA|70021
Acquedolci|ME|98070
Acqui Terme|AL|15011
Acri|CS|87041
Acuto|FR|03010
Adelfia|BA|70010
Adrano|CT|95031
Adrara San Martino|BG|24060
Adrara San Rocco|BG|24060
Adria|RO|45011
Adro|BS|25030
Affi|VR|37010
Affile|RM|00021
Afragola|NA|80021
Africo|RC|89030
Agazzano|PC|29010
Agerola|NA|80051
Aggius|OT|07020
Agira|EN|94011
Agliana|PT|51031
Agliano Terme|AT|14041
Aglientu|OT|07020
Agliè|TO|10011
Agna|PD|35021
Agnadello|CR|26020
Agnana Calabra|RC|89040
Agnone|IS|86081
Agnosine|BS|25071
Agordo|BL|32021
Agosta|RM|00020
Agra|VA|21010
Agrate Brianza|MB|20864
Agrate Conturbia|NO|28010
Agrigento|AG|92100|1
Agropoli|SA|84043
Agugliano|AN|60020
Agugliaro|VI|36020
Aicurzio|MB|20886
Aidomaggiore|OR|09070
Aidone|EN|94020
Aielli|AQ|67041
Aiello Calabro|CS|87031
Aiello del Friuli|UD|33041
Aiello del Sabato|AV|83020
Aieta|CS|87020
Ailano|CE|81010
Ailoche|BI|13861
Airasca|TO|10060
Airola|BN|82011
Airole|IM|18030
Airuno|LC|23881
Aisone|CN|12010
Ala|TN|38061
Ala di Stura|TO|10070
Alagna|PV|27020
Alagna Valsesia|VC|13021
Alanno|PE|65020
Alassio|SV|17021
Alatri|FR|03011
Alba|CN|12051
Alba Adriatica|TE|64011
Albagiara|OR|09090
Albairate|MI|20080
Albanella|SA|84044
Albano Laziale|RM|00041
Albano Sant'Alessandro|BG|24061
Albano Vercellese|VC|13030
Albano di Lucania|PZ|85010
Albaredo d'Adige|VR|37041
Albaredo per San Marco|SO|23010
Albareto|PR|43051
Albaretto della Torre|CN|12050
Albavilla|CO|22031
Albenga|SV|17031
Albera Ligure|AL|15060
Alberobello|BA|70011
Alberona|FG|71031
Albese con Cassano|CO|22032
Albettone|VI|36020
Albi|CZ|88055
Albiano|TN|38041
Albiano d'Ivrea|TO|10010
Albiate|MB|20847
Albidona|CS|87070
Albignasego|PD|35020
Albinea|RE|42020
Albino|BG|24021
Albiolo|CO|22070
Albisola Superiore|SV|17011
Albissola Marina|SV|17012
Albizzate|VA|21041
Albonese|PV|27020
Albosaggia|SO|23010
Albugnano|AT|14022
Albuzzano|PV|27010
Alcamo|TP|91011
Alcara li Fusi|ME|98070
Aldeno|TN|38060
Aldino|BZ|39040
Ales|OR|09091
Alessandria|AL|15121-15122|1
Alessandria del Carretto|CS|87070
Alessandria della Rocca|AG|92010
Alessano|LE|73031
Alezio|LE|73011
Alfano|SA|84040
Alfedena|AQ|67030
Alfianello|BS|25020
Alfiano Natta|AL|15021
Alfonsine|RA|48011
Alghero|SS|07041
Algua|BG|24010
Alia|PA|90021
Aliano|MT|75010
Alice Bel Colle|AL|15010
Alice Castello|VC|13040
Alife|CE|81011
Alimena|PA|90020
Aliminusa|PA|90020
Allai|OR|09080
Alleghe|BL|32022
Allein|AO|11010
Allerona|TR|05011
Alliste|LE|73040
Allumiere|RM|00051
Alluvioni Piovera|AL|15047
Almenno San Bartolomeo|BG|24030
Almenno San Salvatore|BG|24031
Almese|TO|10040
Almè|BG|24011
Alonte|VI|36045
Alpago|BL|32016
Alpette|TO|10080
Alpignano|TO|10091
Alseno|PC|29010
Alserio|CO|22040
Alta Val Tidone|PC|29031
Alta Valle Intelvi|CO|22024
Altamura|BA|70022
Altare|SV|17041
Altavalle|TN|38092
Altavilla Irpina|AV|83011
Altavilla Milicia|PA|90010
Altavilla Monferrato|AL|15041
Altavilla Silentina|SA|84045
Altavilla Vicentina|VI|36077
Altidona|FM|63824
Altilia|CS|87040
Altino|CH|66040
Altissimo|VI|36070
Altivole|TV|31030
Alto|CN|12070
Alto Reno Terme|BO|40046
Alto Sermenza|VC|13029
Altofonte|PA|90072
Altomonte|CS|87042
Altopascio|LU|55011
Altopiano della Vigolana|TN|38049
Alviano|TR|05020
Alvignano|CE|81012
Alvito|FR|03041
Alzano Lombardo|BG|24022
Alzano Scrivia|AL|15050
Alzate Brianza|CO|22040
Alà dei Sardi|OT|07020
Alì|ME|98020
Alì Terme|ME|98021
Amalfi|SA|84011
Amandola|FM|63857
Amantea|CS|87032
Amaro|UD|33020
Amaroni|CZ|88050
Amaseno|FR|03021
Amato|CZ|88040
Amatrice|RI|02012
Ambivere|BG|24030
Amblar-Don|TN|38011
Ameglia|SP|19031
Amelia|TR|05022
Amendolara|CS|87071
Ameno|NO|28010
Amorosi|BN|82031
Ampezzo|UD|33021
Anacapri|NA|80071
Anagni|FR|03012
Ancarano|TE|64010
Ancona|AN|60121-60129,60131|1
Andali|CZ|88050
Andalo|TN|38010
Andalo Valtellino|SO|23009
Andezeno|TO|10020
Andora|SV|17051
Andorno Micca|BI|13811
Andrano|LE|73032
Andrate|TO|10010
Andreis|PN|33080
Andretta|AV|83040
Andria|BT|76123|1
Andriano|BZ|39010
Anela|SS|07010
Anfo|BS|25070
Angera|VA|21021
Anghiari|AR|52031
Angiari|VR|37050
Angolo Terme|BS|25040
Angri|SA|84012
Angrogna|TO|10060
Anguillara Sabazia|RM|00061
Anguillara Veneta|PD|35022
Annicco|CR|26021
Annone Veneto|VE|30020
Annone di Brianza|LC|23841
Anoia|RC|89020
Antegnate|BG|24051
Anterivo|BZ|39040
Antey-Saint-André|AO|11020
Anticoli Corrado|RM|00022
Antignano|AT|14010
Antillo|ME|98030
Antonimina|RC|89040
Antrodoco|RI|02013
Antrona Schieranco|VB|28841
Anversa degli Abruzzi|AQ|67030
Anzano del Parco|CO|22040
Anzano di Puglia|FG|71020
Anzi|PZ|85010
Anzio|RM|00042
Anzola d'Ossola|VB|28877
Anzola dell'Emilia|BO|40011
Aosta|AO|11100|1
Apecchio|PU|61042
Apice|BN|82021
Apiro|MC|62021
Apollosa|BN|82030
Appiano Gentile|CO|22070
Appiano sulla strada del vino|BZ|39057
Appignano|MC|62010
Appignano del Tronto|AP|63083
Aprica|SO|23031
Apricale|IM|18035
Apricena|FG|71011
Aprigliano|CS|87051
Aprilia|LT|04011
Aquara|SA|84020
Aquila d'Arroscia|IM|18020
Aquileia|UD|33051
Aquilonia|AV|83041
Aquino|FR|03031
Aradeo|LE|73040
Aragona|AG|92021
Aramengo|AT|14020
Arba|PN|33090
Arborea|OR|09092
Arborio|VC|13031
Arbus|VS|09031
Arcade|TV|31030
Arce|FR|03032
Arcene|BG|24040
Arcevia|AN|60011
Archi|CH|66044
Arcidosso|GR|58031
Arcinazzo Romano|RM|00020
Arcisate|VA|21051
Arco|TN|38062
Arcola|SP|19021
Arcole|VR|37040
Arconate|MI|20020
Arcore|MB|20862
Arcugnano|VI|36057
Ardara|SS|07010
Ardauli|OR|09081
Ardea|RM|00040
Ardenno|SO|23011
Ardesio|BG|24020
Ardore|RC|89031
Arena|VV|89832
Arena Po|PV|27040
Arenzano|GE|16011
Arese|MI|20044
Arezzo|AR|52100|1
Argegno|CO|22010
Argelato|BO|40050
Argenta|FE|44011
Argentera|CN|12010
Arguello|CN|12050
Argusto|CZ|88060
Ari|CH|66010
Ariano Irpino|AV|83031
Ariano nel Polesine|RO|45012
Ariccia|RM|00072
Arielli|CH|66030
Arienzo|CE|81021
Arignano|TO|10020
Aritzo|NU|08031
Arizzano|VB|28811
Arlena di Castro|VT|01010
Arluno|MI|20004
Armeno|NO|28011
Armento|PZ|85010
Armo|IM|18026
Armungia|CA|09040
Arnad|AO|11020
Arnara|FR|03020
Arnasco|SV|17032
Arnesano|LE|73010
Arola|VB|28899
Arona|NO|28041
Arosio|CO|22060
Arpaia|BN|82011
Arpaise|BN|82010
Arpino|FR|03033
Arquata Scrivia|AL|15061
Arquata del Tronto|AP|63096
Arquà Petrarca|PD|35032
Arquà Polesine|RO|45031
Arre|PD|35020
Arrone|TR|05031
Arsago Seprio|VA|21010
Arsiero|VI|36011
Arsita|TE|64031
Arsiè|BL|32030
Arsoli|RM|00023
Arta Terme|UD|33022
Artegna|UD|33011
Artena|RM|00031
Artogne|BS|25040
Arvier|AO|11011
Arzachena|OT|07021
Arzago d'Adda|BG|24040
Arzana|OG|08040
Arzano|NA|80022
Arzergrande|PD|35020
Arzignano|VI|36071
Ascea|SA|84046
Asciano|SI|53041
Ascoli Piceno|AP|63100|1
Ascoli Satriano|FG|71022
Ascrea|RI|02020
Asiago|VI|36012
Asigliano Veneto|VI|36020
Asigliano Vercellese|VC|13032
Asola|MN|46041
Asolo|TV|31011
Assago|MI|20057
Assemini|CA|09032
Assisi|PG|06081
Asso|CO|22033
Assolo|OR|09080
Assoro|EN|94010
Asti|AT|14100|1
Asuni|OR|09080
Ateleta|AQ|67030
Atella|PZ|85020
Atena Lucana|SA|84030
Atessa|CH|66041
Atina|FR|03042
Atrani|SA|84010
Atri|TE|64032
Atripalda|AV|83042
Attigliano|TR|05012
Attimis|UD|33040
Atzara|NU|08030
Augusta|SR|96011
Auletta|SA|84031
Aulla|MS|54011
Aurano|VB|28812
Aurigo|IM|18020
Auronzo di Cadore|BL|32041
Ausonia|FR|03040
Austis|NU|08030
Avegno|GE|16036
Avelengo|BZ|39010
Avella|AV|83021
Avellino|AV|83100|1
Averara|BG|24010
Aversa|CE|81031
Avetrana|TA|74020
Avezzano|AQ|67051
Aviano|PN|33081
Aviatico|BG|24020
Avigliana|TO|10051
Avigliano|PZ|85021
Avigliano Umbro|TR|05020
Avio|TN|38063
Avise|AO|11010
Avola|SR|96012
Avolasca|AL|15050
Ayas|AO|11020
Aymavilles|AO|11010
Azeglio|TO|10010
Azzanello|CR|26010
Azzano Decimo|PN|33082
Azzano Mella|BS|25020
Azzano San Paolo|BG|24052
Azzano d'Asti|AT|14030
Azzate|VA|21022
Azzio|VA|21030
Azzone|BG|24020
Baceno|VB|28861
Bacoli|NA|80070
Badalucco|IM|18010
Badesi|OT|07053
Badia|BZ|39036
Badia Calavena|VR|37030
Badia Pavese|PV|27010
Badia Polesine|RO|45021
Badia Tedalda|AR|52032
Badolato|CZ|88060
Bagaladi|RC|89060
Bagheria|PA|90011
Bagnacavallo|RA|48012
Bagnara Calabra|RC|89011
Bagnara di Romagna|RA|48031
Bagnaria|PV|27050
Bagnaria Arsa|UD|33050
Bagnasco|CN|12071
Bagnatica|BG|24060
Bagni di Lucca|LU|55022
Bagno a Ripoli|FI|50012
Bagno di Romagna|FC|47021
Bagnoli Irpino|AV|83043
Bagnoli del Trigno|IS|86091
Bagnoli di Sopra|PD|35023
Bagnolo Cremasco|CR|26010
Bagnolo Mella|BS|25021
Bagnolo Piemonte|CN|12031
Bagnolo San Vito|MN|46031
Bagnolo del Salento|LE|73020
Bagnolo di Po|RO|45022
Bagnolo in Piano|RE|42011
Bagnone|MS|54021
Bagnoregio|VT|01022
Bagolino|BS|25072
Baia e Latina|CE|81010
Baiano|AV|83022
Bairo|TO|10010
Baiso|RE|42031
Bajardo|IM|18031
Balangero|TO|10070
Baldichieri d'Asti|AT|14011
Baldissero Canavese|TO|10080
Baldissero Torinese|TO|10020
Baldissero d'Alba|CN|12040
Balestrate|PA|90041
Balestrino|SV|17020
Ballabio|LC|23811
Ballao|CA|09040
Balme|TO|10070
Balmuccia|VC|13020
Balocco|VC|13040
Balsorano|AQ|67052
Balvano|PZ|85050
Balzola|AL|15031
Banari|SS|07040
Banchette|TO|10010
Bannio Anzino|VB|28871
Banzi|PZ|85010
Baone|PD|35030
Baradili|OR|09090
Baragiano|PZ|85050
Baranello|CB|86011
Barano d'Ischia|NA|80072
Baranzate|MI|20021
Barasso|VA|21020
Baratili San Pietro|OR|09070
Barbania|TO|10070
Barbara|AN|60010
Barbarano Mossano|VI|36048
Barbarano Romano|VT|01010
Barbaresco|CN|12050
Barbariga|BS|25030
Barbata|BG|24040
Barberino Tavarnelle|FI|50028
Barberino di Mugello|FI|50031
Barbianello|PV|27041
Barbiano|BZ|39040
Barbona|PD|35040
Barcellona Pozzo di Gotto|ME|98051
Barcis|PN|33080
Bard|AO|11020
Bardello con Malgesso e Bregano|VA|21009
Bardi|PR|43032
Bardineto|SV|17057
Bardolino|VR|37011
Bardonecchia|TO|10052
Bareggio|MI|20008
Barengo|NO|28010
Baressa|OR|09090
Barete|AQ|67010
Barga|LU|55051
Bargagli|GE|16021
Barge|CN|12032
Barghe|BS|25070
Bari|BA|70121-70129,70131-70132|1
Bari Sardo|OG|08042
Bariano|BG|24050
Baricella|BO|40052
Barile|PZ|85022
Barisciano|AQ|67021
Barlassina|MB|20825
Barletta|BT|76121|1
Barni|CO|22030
Barolo|CN|12060
Barone Canavese|TO|10010
Baronissi|SA|84081
Barrafranca|EN|94012
Barrali|CA|09040
Barrea|AQ|67030
Barumini|VS|09021
Barzago|LC|23890
Barzana|BG|24030
Barzanò|LC|23891
Barzio|LC|23816
Basaluzzo|AL|15060
Bascapè|PV|27010
Baschi|TR|05023
Basciano|TE|64030
Baselga di Pinè|TN|38042
Baselice|BN|82020
Basiano|MI|20060
Basicò|ME|98060
Basiglio|MI|20079
Basiliano|UD|33031
Bassano Bresciano|BS|25020
Bassano Romano|VT|01030
Bassano del Grappa|VI|36061
Bassano in Teverina|VT|01030
Bassiano|LT|04010
Bassignana|AL|15042
Bastia Mondovì|CN|12060
Bastia Umbra|PG|06083
Bastida Pancarana|PV|27050
Bastiglia|MO|41030
Battaglia Terme|PD|35041
Battifollo|CN|12070
Battipaglia|SA|84091
Battuda|PV|27020
Baucina|PA|90061
Bauladu|OR|09070
Baunei|OG|08040
Baveno|VB|28831
Bedero Valcuvia|VA|21039
Bedizzole|BS|25081
Bedollo|TN|38043
Bedonia|PR|43041
Bedulita|BG|24030
Bee|VB|28813
Beinasco|TO|10092
Beinette|CN|12081
Belcastro|CZ|88050
Belfiore|VR|37050
Belforte Monferrato|AL|15070
Belforte all'Isauro|PU|61026
Belforte del Chienti|MC|62020
Belgioioso|PV|27011
Belgirate|VB|28832
Bella|PZ|85051
Bellagio|CO|22021
Bellano|LC|23822
Bellante|TE|64020
Bellaria-Igea Marina|RN|47814
Bellegra|RM|00030
Bellino|CN|12020
Bellinzago Lombardo|MI|20060
Bellinzago Novarese|NO|28043
Bellizzi|SA|84092
Bellona|CE|81041
Bellosguardo|SA|84020
Belluno|BL|32100|1
Bellusco|MB|20882
Belmonte Calabro|CS|87033
Belmonte Castello|FR|03040
Belmonte Mezzagno|PA|90031
Belmonte Piceno|FM|63838
Belmonte del Sannio|IS|86080
Belmonte in Sabina|RI|02020
Belpasso|CT|95032
Belsito|CS|87030
Belvedere Langhe|CN|12060
Belvedere Marittimo|CS|87021
Belvedere Ostrense|AN|60030
Belvedere di Spinello|KR|88824
Belveglio|AT|14040
Belvì|NU|08030
Bema|SO|23010
Bene Lario|CO|22010
Bene Vagienna|CN|12041
Benestare|RC|89030
Benetutti|SS|07010
Benevello|CN|12050
Benevento|BN|82100|1
Benna|BI|13871
Bentivoglio|BO|40010
Berbenno|BG|24030
Berbenno di Valtellina|SO|23010
Berceto|PR|43042
Berchidda|OT|07022
Beregazzo con Figliaro|CO|22070
Bereguardo|PV|27021
Bergamasco|AL|15022
Bergamo|BG|24121-24129|1
Bergantino|RO|45032
Bergeggi|SV|17028
Bergolo|CN|12074
Berlingo|BS|25030
Bernalda|MT|75012
Bernareggio|MB|20881
Bernate Ticino|MI|20010
Bernezzo|CN|12010
Bertinoro|FC|47032
Bertiolo|UD|33032
Bertonico|LO|26821
Berzano di San Pietro|AT|14020
Berzano di Tortona|AL|15050
Berzo Demo|BS|25040
Berzo Inferiore|BS|25040
Berzo San Fermo|BG|24060
Besana in Brianza|MB|20842
Besano|VA|21050
Besate|MI|20080
Besenello|TN|38060
Besenzone|PC|29010
Besnate|VA|21010
Besozzo|VA|21023
Bessude|SS|07040
Bettola|PC|29021
Bettona|PG|06084
Beura-Cardezza|VB|28851
Bevagna|PG|06031
Beverino|SP|19020
Bevilacqua|VR|37040
Biancavilla|CT|95033
Bianchi|CS|87050
Bianco|RC|89032
Biandrate|NO|28061
Biandronno|VA|21024
Bianzano|BG|24060
Bianzone|SO|23030
Bianzè|VC|13041
Biassono|MB|20853
Bibbiano|RE|42021
Bibbiena|AR|52011
Bibbona|LI|57020
Bibiana|TO|10060
Biccari|FG|71032
Bicinicco|UD|33050
Bidonì|OR|09080
Biella|BI|13900|1
Bienno|BS|25040
Bieno|TN|38050
Bientina|PI|56031
Binago|CO|22070
Binasco|MI|20082
Binetto|BA|70020
Bioglio|BI|13841
Bionaz|AO|11010
Bione|BS|25070
Birori|NU|08010
Bisaccia|AV|83044
Bisacquino|PA|90032
Bisceglie|BT|76011
Bisegna|AQ|67050
Bisenti|TE|64033
Bisignano|CS|87043
Bistagno|AL|15012
Bisuschio|VA|21050
Bitetto|BA|70020
Bitonto|BA|70032
Bitritto|BA|70020
Bitti|NU|08021
Bivona|AG|92010
Bivongi|RC|89040
Bizzarone|CO|22020
Bleggio Superiore|TN|38071
Blello|BG|24010
Blera|VT|01010
Blessagno|CO|22028
Blevio|CO|22020
Blufi|PA|90020
Boara Pisani|PD|35040
Bobbio|PC|29022
Bobbio Pellice|TO|10060
Boca|NO|28010
Bocchigliero|CS|87060
Boccioleto|VC|13022
Bocenago|TN|38080
Bodio Lomnago|VA|21020
Boffalora d'Adda|LO|26811
Boffalora sopra Ticino|MI|20010
Bogliasco|GE|16031
Bognanco|VB|28842
Bogogno|NO|28010
Boissano|SV|17054
Bojano|CB|86021
Bolano|SP|19020
Bolgare|BG|24060
Bollate|MI|20021
Bollengo|TO|10012
Bologna|BO|40121-40129,40131-40139,40141|1
Bolognano|PE|65020
Bolognetta|PA|90030
Bolognola|MC|62035
Bolotana|NU|08011
Bolsena|VT|01023
Boltiere|BG|24040
Bolzano|BZ|39100|1
Bolzano Novarese|NO|28010
Bolzano Vicentino|VI|36050
Bomarzo|VT|01020
Bomba|CH|66042
Bompensiere|CL|93010
Bompietro|PA|90020
Bomporto|MO|41030
Bonarcado|OR|09070
Bonassola|SP|19011
Bonate Sopra|BG|24040
Bonate Sotto|BG|24040
Bonavigo|VR|37040
Bondeno|FE|44012
Bondone|TN|38080
Bonea|BN|82013
Bonefro|CB|86041
Bonemerse|CR|26040
Bonifati|CS|87020
Bonito|AV|83032
Bonnanaro|SS|07043
Bono|SS|07011
Bonorva|SS|07012
Bonvicino|CN|12060
Borbona|RI|02010
Borca di Cadore|BL|32040
Bordano|UD|33010
Bordighera|IM|18012
Bordolano|CR|26020
Bore|PR|43030
Boretto|RE|42022
Borgarello|PV|27010
Borgaro Torinese|TO|10071
Borgetto|PA|90042
Borghetto Lodigiano|LO|26812
Borghetto Santo Spirito|SV|17052
Borghetto d'Arroscia|IM|18020
Borghetto di Borbera|AL|15060
Borghetto di Vara|SP|19020
Borghi|FC|47030
Borgia|CZ|88021
Borgiallo|TO|10080
Borgio Verezzi|SV|17022
Borgo Chiese|TN|38083
Borgo Lares|TN|38079
Borgo Mantovano|MN|46036
Borgo Pace|PU|61040
Borgo Priolo|PV|27040
Borgo San Dalmazzo|CN|12011
Borgo San Giacomo|BS|25022
Borgo San Giovanni|LO|26851
Borgo San Lorenzo|FI|50032
Borgo San Martino|AL|15032
Borgo San Siro|PV|27020
Borgo Ticino|NO|28040
Borgo Tossignano|BO|40021
Borgo Val di Taro|PR|43043
Borgo Valbelluna|BL|32026
Borgo Valsugana|TN|38051
Borgo Velino|RI|02010
Borgo Veneto|PD|35046
Borgo Vercelli|VC|13012
Borgo Virgilio|MN|46034
Borgo a Mozzano|LU|55023
Borgo d'Ale|VC|13040
Borgo d'Anaunia|TN|38013
Borgo di Terzo|BG|24060
Borgocarbonara|MN|46021
Borgofranco d'Ivrea|TO|10013
Borgolavezzaro|NO|28071
Borgomale|CN|12050
Borgomanero|NO|28021
Borgomaro|IM|18021
Borgomasino|TO|10031
Borgomezzavalle|VB|28846
Borgone Susa|TO|10050
Borgonovo Val Tidone|PC|29011
Borgoratto Alessandrino|AL|15013
Borgoratto Mormorolo|PV|27040
Borgoricco|PD|35010
Borgorose|RI|02021
Borgosatollo|BS|25010
Borgosesia|VC|13011
Bormida|SV|17045
Bormio|SO|23032
Bornasco|PV|27010
Borno|BS|25042
Boroneddu|OR|09080
Borore|NU|08016
Borrello|CH|66040
Borriana|BI|13872
Borso del Grappa|TV|31030
Bortigali|NU|08012
Bortigiadas|OT|07054
Borutta|SS|07040
Borzonasca|GE|16041
Bosa|OR|09089
Bosaro|RO|45033
Boschi Sant'Anna|VR|37040
Bosco Chiesanuova|VR|37021
Bosco Marengo|AL|15062
Bosconero|TO|10080
Boscoreale|NA|80041
Boscotrecase|NA|80042
Bosia|CN|12050
Bosio|AL|15060
Bosisio Parini|LC|23842
Bosnasco|PV|27040
Bossico|BG|24060
Bossolasco|CN|12060
Botricello|CZ|88070
Botrugno|LE|73020
Bottanuco|BG|24040
Botticino|BS|25082
Bottidda|SS|07010
Bova|RC|89033
Bova Marina|RC|89035
Bovalino|RC|89034
Bovegno|BS|25061
Boves|CN|12012
Bovezzo|BS|25073
Boville Ernica|FR|03022
Bovino|FG|71023
Bovisio-Masciago|MB|20813
Bovolenta|PD|35024
Bovolone|VR|37051
Bozzole|AL|15040
Bozzolo|MN|46012
Bra|CN|12042
Bracca|BG|24010
Bracciano|RM|00062
Bracigliano|SA|84082
Braies|BZ|39030
Brallo di Pregola|PV|27050
Brancaleone|RC|89036
Brandico|BS|25030
Brandizzo|TO|10032
Branzi|BG|24010
Braone|BS|25040
Brebbia|VA|21020
Breda di Piave|TV|31030
Breganze|VI|36042
Bregnano|CO|22070
Brembate|BG|24041
Brembate di Sopra|BG|24030
Brembio|LO|26822
Breme|PV|27020
Brendola|VI|36040
Brenna|CO|22040
Brennero|BZ|39041
Breno|BS|25043
Brenta|VA|21030
Brentino Belluno|VR|37020
Brentonico|TN|38060
Brenzone sul Garda|VR|37010
Brescello|RE|42041
Brescia|BS|25121-25129,25131-25136|1
Bresimo|TN|38020
Bressana Bottarone|PV|27042
Bressanone|BZ|39042
Bressanvido|VI|36050
Bresso|MI|20091
Brezzo di Bedero|VA|21010
Briaglia|CN|12080
Briatico|VV|89817
Bricherasio|TO|10060
Brienno|CO|22010
Brienza|PZ|85050
Briga Alta|CN|18025
Briga Novarese|NO|28010
Brignano Gera d'Adda|BG|24053
Brignano-Frascata|AL|15050
Brindisi|BR|72100|1
Brindisi Montagna|PZ|85010
Brinzio|VA|21030
Briona|NO|28072
Brione|BS|25060
Briosco|MB|20836
Brisighella|RA|48013
Brissago-Valtravaglia|VA|21030
Brissogne|AO|11020
Brittoli|PE|65010
Brivio|LC|23883
Broccostella|FR|03030
Brogliano|VI|36070
Brognaturo|VV|89822
Brolo|ME|98061
Brondello|CN|12030
Broni|PV|27043
Bronte|CT|95034
Bronzolo|BZ|39051
Brossasco|CN|12020
Brosso|TO|10080
Brovello-Carpugnino|VB|28833
Brozolo|TO|10020
Brugherio|MB|20861
Brugine|PD|35020
Brugnato|SP|19020
Brugnera|PN|33070
Bruino|TO|10090
Brumano|BG|24037
Brunate|CO|22034
Brunello|VA|21020
Brunico|BZ|39031
Bruno|AT|14046
Brusaporto|BG|24060
Brusasco|TO|10020
Brusciano|NA|80031
Brusimpiano|VA|21050
Brusnengo|BI|13862
Brusson|AO|11022
Bruzolo|TO|10050
Bruzzano Zeffirio|RC|89030
Bubbiano|MI|20080
Bubbio|AT|14051
Buccheri|SR|96010
Bucchianico|CH|66011
Bucciano|BN|82010
Buccinasco|MI|20090
Buccino|SA|84021
Bucine|AR|52021
Buddusò|OT|07020
Budoia|PN|33070
Budoni|OT|07051
Budrio|BO|40054
Buggerru|SU|09010
Buggiano|PT|51011
Buglio in Monte|SO|23010
Bugnara|AQ|67030
Buguggiate|VA|21020
Buja|UD|33030
Bulciago|LC|23892
Bulgarograsso|CO|22070
Bultei|SS|07010
Bulzi|SS|07030
Buonabitacolo|SA|84032
Buonalbergo|BN|82020
Buonconvento|SI|53022
Buonvicino|CS|87020
Burago di Molgora|MB|20875
Burcei|CA|09040
Burgio|AG|92010
Burgos|SS|07010
Buriasco|TO|10060
Burolo|TO|10010
Buronzo|VC|13040
Busachi|OR|09082
Busalla|GE|16012
Busano|TO|10080
Busca|CN|12022
Buscate|MI|20010
Buscemi|SR|96010
Buseto Palizzolo|TP|91012
Busnago|MB|20874
Bussero|MI|20041
Busseto|PR|43011
Bussi sul Tirino|PE|65022
Busso|CB|86010
Bussolengo|VR|37012
Bussoleno|TO|10053
Busto Arsizio|VA|21052
Busto Garolfo|MI|20038
Butera|CL|93011
Buti|PI|56032
Buttapietra|VR|37060
Buttigliera Alta|TO|10090
Buttigliera d'Asti|AT|14021
Buttrio|UD|33042
Cabella Ligure|AL|15060
Cabiate|CO|22060
Cabras|OR|09072
Caccamo|PA|90012
Caccuri|KR|88833
Cadegliano-Viconago|VA|21031
Cadelbosco di Sopra|RE|42023
Cadeo|PC|29010
Caderzone Terme|TN|38080
Cadoneghe|PD|35010
Cadorago|CO|22071
Cadrezzate con Osmate|VA|21062
Caerano di San Marco|TV|31031
Cafasse|TO|10070
Caggiano|SA|84030
Cagli|PU|61043
Cagliari|CA|09121-09129,09131,09134|1
Caglio|CO|22030
Cagnano Amiterno|AQ|67012
Cagnano Varano|FG|71010
Caianello|CE|81059
Caiazzo|CE|81013
Caines|BZ|39010
Caino|BS|25070
Caiolo|SO|23010
Cairano|AV|83040
Cairate|VA|21050
Cairo Montenotte|SV|17014
Caivano|NA|80023
Calabritto|AV|83040
Calalzo di Cadore|BL|32042
Calamandrana|AT|14042
Calamonaci|AG|92010
Calangianus|OT|07023
Calanna|RC|89050
Calasca-Castiglione|VB|28873
Calascibetta|EN|94021
Calascio|AQ|67020
Calasetta|SU|09011
Calatabiano|CT|95011
Calatafimi-Segesta|TP|91013
Calcata|VT|01030
Calceranica al Lago|TN|38050
Calci|PI|56011
Calciano|MT|75010
Calcinaia|PI|56012
Calcinate|BG|24050
Calcinato|BS|25011
Calcio|BG|24054
Calco|LC|23885
Caldaro sulla strada del vino|BZ|39052
Caldarola|MC|62020
Calderara di Reno|BO|40012
Caldes|TN|38022
Caldiero|VR|37042
Caldogno|VI|36030
Caldonazzo|TN|38052
Calendasco|PC|29010
Calenzano|FI|50041
Calestano|PR|43030
Calice Ligure|SV|17020
Calice al Cornoviglio|SP|19020
Calimera|LE|73021
Calitri|AV|83045
Calizzano|SV|17057
Callabiana|BI|13821
Calliano|TN|38060
Calliano Monferrato|AT|14031
Calolziocorte|LC|23801
Calopezzati|CS|87060
Calosso|AT|14052
Caloveto|CS|87060
Caltabellotta|AG|92010
Caltagirone|CT|95041
Caltanissetta|CL|93100|1
Caltavuturo|PA|90022
Caltignaga|NO|28010
Calto|RO|45030
Caltrano|VI|36030
Calusco d'Adda|BG|24033
Caluso|TO|10014
Calvagese della Riviera|BS|25080
Calvanico|SA|84080
Calvatone|CR|26030
Calvello|PZ|85010
Calvene|VI|36030
Calvenzano|BG|24040
Calvera|PZ|85030
Calvi|BN|82018
Calvi Risorta|CE|81042
Calvi dell'Umbria|TR|05032
Calvignano|PV|27040
Calvignasco|MI|20080
Calvisano|BS|25012
Calvizzano|NA|80012
Camagna Monferrato|AL|15030
Camaiore|LU|55041
Camandona|BI|13821
Camastra|AG|92020
Cambiago|MI|20040
Cambiano|TO|10020
Cambiasca|VB|28814
Camburzano|BI|13891
Camerana|CN|12072
Camerano|AN|60021
Camerano Casasco|AT|14020
Camerata Cornello|BG|24010
Camerata Nuova|RM|00020
Camerata Picena|AN|60020
Cameri|NO|28062
Camerino|MC|62032
Camerota|SA|84059
Camigliano|CE|81050
Camini|RC|89040
Camino|AL|15020
Camino al Tagliamento|UD|33030
Camisano|CR|26010
Camisano Vicentino|VI|36043
Cammarata|AG|92022
Camogli|GE|16032
Campagna|SA|84022
Campagna Lupia|VE|30010
Campagnano di Roma|RM|00063
Campagnatico|GR|58042
Campagnola Cremasca|CR|26010
Campagnola Emilia|RE|42012
Campana|CS|87061
Camparada|MB|20857
Campegine|RE|42040
Campello sul Clitunno|PG|06042
Campertogno|VC|13023
Campi Bisenzio|FI|50013
Campi Salentina|LE|73012
Campiglia Cervo|BI|13812
Campiglia Marittima|LI|57021
Campiglia dei Berici|VI|36020
Campiglione Fenile|TO|10060
Campione d'Italia|CO|22061
Campitello di Fassa|TN|38031
Campli|TE|64012
Campo Calabro|RC|89052
Campo Ligure|GE|16013
Campo San Martino|PD|35010
Campo Tures|BZ|39032
Campo di Giove|AQ|67030
Campo di Trens|BZ|39040
Campo nell'Elba|LI|57034
Campobasso|CB|86100|1
Campobello di Licata|AG|92023
Campobello di Mazara|TP|91021
Campochiaro|CB|86020
Campodarsego|PD|35011
Campodenno|TN|38010
Campodimele|LT|04020
Campodipietra|CB|86010
Campodolcino|SO|23021
Campodoro|PD|35010
Campofelice di Fitalia|PA|90030
Campofelice di Roccella|PA|90010
Campofilone|FM|63828
Campofiorito|PA|90030
Campoformido|UD|33030
Campofranco|CL|93010
Campogalliano|MO|41011
Campolattaro|BN|82020
Campoli Appennino|FR|03030
Campoli del Monte Taburno|BN|82030
Campolieto|CB|86040
Campolongo Maggiore|VE|30010
Campolongo Tapogliano|UD|33040
Campomaggiore|PZ|85010
Campomarino|CB|86042
Campomorone|GE|16014
Camponogara|VE|30010
Campora|SA|84040
Camporeale|PA|90043
Camporgiano|LU|55031
Camporosso|IM|18033
Camporotondo Etneo|CT|95058
Camporotondo di Fiastrone|MC|62020
Camposampiero|PD|35012
Camposano|NA|80030
Camposanto|MO|41031
Campospinoso Albaredo|PV|27062
Campotosto|AQ|67013
Camugnano|BO|40032
Canal San Bovo|TN|38050
Canale|CN|12043
Canale Monterano|RM|00060
Canale d'Agordo|BL|32020
Canaro|RO|45034
Canazei|TN|38032
Cancellara|PZ|85010
Cancello ed Arnone|CE|81030
Canda|RO|45020
Candela|FG|71024
Candelo|BI|13878
Candia Canavese|TO|10010
Candia Lomellina|PV|27031
Candiana|PD|35020
Candida|AV|83040
Candidoni|RC|89020
Candiolo|TO|10060
Canegrate|MI|20039
Canelli|AT|14053
Canepina|VT|01030
Caneva|PN|33070
Canicattini Bagni|SR|96010
Canicattì|AG|92024
Canino|VT|01011
Canischio|TO|10080
Canistro|AQ|67050
Canna|CS|87070
Cannalonga|SA|84040
Cannara|PG|06033
Cannero Riviera|VB|28821
Canneto Pavese|PV|27044
Canneto sull'Oglio|MN|46013
Cannobio|VB|28822
Cannole|LE|73020
Canolo|RC|89040
Canonica d'Adda|BG|24040
Canosa Sannita|CH|66010
Canosa di Puglia|BT|76012
Canosio|CN|12020
Canossa|RE|42026
Cansano|AQ|67030
Cantagallo|PO|59025
Cantalice|RI|02014
Cantalupa|TO|10060
Cantalupo Ligure|AL|15060
Cantalupo in Sabina|RI|02040
Cantalupo nel Sannio|IS|86092
Cantarana|AT|14010
Cantello|VA|21050
Canterano|RM|00020
Cantiano|PU|61044
Cantoira|TO|10070
Cantù|CO|22063
Canzano|TE|64020
Canzo|CO|22035
Caorle|VE|30021
Caorso|PC|29012
Capaccio Paestum|SA|84047
Capaci|PA|90040
Capalbio|GR|58011
Capannoli|PI|56033
Capannori|LU|55012
Capena|RM|00060
Capergnanica|CR|26010
Capestrano|AQ|67022
Capiago Intimiano|CO|22070
Capistrano|VV|89818
Capistrello|AQ|67053
Capitignano|AQ|67014
Capizzi|ME|98031
Capizzone|BG|24030
Capo d'Orlando|ME|98071
Capo di Ponte|BS|25044
Capodimonte|VT|01010
Capodrise|CE|81020
Capoliveri|LI|57031
Capolona|AR|52010
Caponago|MB|20867
Caporciano|AQ|67020
Caposele|AV|83040
Capoterra|CA|09012
Capovalle|BS|25070
Cappadocia|AQ|67060
Cappella Cantone|CR|26020
Cappella Maggiore|TV|31012
Cappella de' Picenardi|CR|26030
Cappelle sul Tavo|PE|65010
Capracotta|IS|86082
Capraia Isola|LI|57032
Capraia e Limite|FI|50050
Capralba|CR|26010
Capranica|VT|01012
Capranica Prenestina|RM|00030
Caprarica di Lecce|LE|73010
Caprarola|VT|01032
Caprauna|CN|12070
Caprese Michelangelo|AR|52033
Caprezzo|VB|28815
Capri|NA|80073
Capri Leone|ME|98070
Capriana|TN|38030
Capriano del Colle|BS|25020
Capriata d'Orba|AL|15060
Capriate San Gervasio|BG|24042
Capriati a Volturno|CE|81014
Caprie|TO|10040
Capriglia Irpina|AV|83010
Capriglio|AT|14014
Caprile|BI|13864
Caprino Bergamasco|BG|24030
Caprino Veronese|VR|37013
Capriolo|BS|25031
Capriva del Friuli|GO|34070
Capua|CE|81043
Capurso|BA|70010
Caraffa del Bianco|RC|89030
Caraffa di Catanzaro|CZ|88050
Caraglio|CN|12023
Caramagna Piemonte|CN|12030
Caramanico Terme|PE|65023
Carapelle|FG|71041
Carapelle Calvisio|AQ|67020
Carasco|GE|16042
Carassai|AP|63063
Carate Brianza|MB|20841
Carate Urio|CO|22010
Caravaggio|BG|24043
Caravate|VA|21032
Caravino|TO|10010
Caravonica|IM|18020
Carbognano|VT|01030
Carbonara Scrivia|AL|15050
Carbonara al Ticino|PV|27020
Carbonara di Nola|NA|80030
Carbonate|CO|22070
Carbone|PZ|85030
Carbonera|TV|31030
Carbonia|SU|09013|1
Carcare|SV|17043
Carcoforo|VC|13026
Cardano al Campo|VA|21010
Cardedu|OG|08040
Cardeto|RC|89060
Cardinale|CZ|88062
Cardito|NA|80024
Cardè|CN|12030
Careggine|LU|55030
Carema|TO|10010
Carenno|LC|23802
Carentino|AL|15026
Careri|RC|89030
Caresana|VC|13010
Caresanablot|VC|13030
Carezzano|AL|15051
Carfizzi|KR|88817
Cargeghe|SS|07030
Cariati|CS|87062
Carife|AV|83040
Carignano|TO|10041
Carimate|CO|22060
Carinaro|CE|81032
Carini|PA|90044
Carinola|CE|81030
Carisio|VC|13040
Carisolo|TN|38080
Carlantino|FG|71030
Carlazzo|CO|22010
Carlentini|SR|96013
Carlino|UD|33050
Carloforte|SU|09014
Carlopoli|CZ|88040
Carmagnola|TO|10022
Carmiano|LE|73041
Carmignano|PO|59015
Carmignano di Brenta|PD|35010
Carnago|VA|21040
Carnate|MB|20866
Carobbio degli Angeli|BG|24060
Carolei|CS|87030
Carona|BG|24010
Caronia|ME|98072
Caronno Pertusella|VA|21042
Caronno Varesino|VA|21040
Carosino|TA|74021
Carovigno|BR|72012
Carovilli|IS|86083
Carpaneto Piacentino|PC|29013
Carpanzano|CS|87050
Carpegna|PU|61021
Carpenedolo|BS|25013
Carpeneto|AL|15071
Carpi|MO|41012
Carpiano|MI|20074
Carpignano Salentino|LE|73020
Carpignano Sesia|NO|28064
Carpineti|RE|42033
Carpineto Romano|RM|00032
Carpineto Sinello|CH|66030
Carpineto della Nora|PE|65010
Carpino|FG|71010
Carpinone|IS|86093
Carrara|MS|54033|1
Carrega Ligure|AL|15060
Carro|SP|19012
Carrodano|SP|19020
Carrosio|AL|15060
Carrè|VI|36010
Carrù|CN|12061
Carsoli|AQ|67061
Cartigliano|VI|36050
Cartignano|CN|12020
Cartoceto|PU|61030
Cartosio|AL|15015
Cartura|PD|35025
Carugate|MI|20061
Carugo|CO|22060
Carunchio|CH|66050
Carvico|BG|24030
Carzano|TN|38050
Casabona|KR|88822
Casacalenda|CB|86043
Casacanditella|CH|66010
Casagiove|CE|81022
Casal Cermelli|AL|15072
Casal Velino|SA|84040
Casal di Principe|CE|81033
Casalanguida|CH|66031
Casalattico|FR|03030
Casalbeltrame|NO|28060
Casalbordino|CH|66021
Casalbore|AV|83034
Casalborgone|TO|10020
Casalbuono|SA|84030
Casalbuttano ed Uniti|CR|26011
Casalciprano|CB|86010
Casalduni|BN|82027
Casale Corte Cerro|VB|28881
Casale Cremasco-Vidolasco|CR|26010
Casale Litta|VA|21020
Casale Marittimo|PI|56040
Casale Monferrato|AL|15033
Casale di Scodosia|PD|35040
Casale sul Sile|TV|31032
Casalecchio di Reno|BO|40033
Casaleggio Boiro|AL|15070
Casaleggio Novara|NO|28060
Casaleone|VR|37052
Casaletto Ceredano|CR|26010
Casaletto Lodigiano|LO|26852
Casaletto Spartano|SA|84030
Casaletto Vaprio|CR|26010
Casaletto di Sopra|CR|26014
Casalfiumanese|BO|40020
Casalgrande|RE|42013
Casalgrasso|CN|12030
Casali del Manco|CS|87059
Casalincontrada|CH|66012
Casalino|NO|28060
Casalmaggiore|CR|26041
Casalmaiocco|LO|26831
Casalmorano|CR|26020
Casalmoro|MN|46040
Casalnoceto|AL|15052
Casalnuovo Monterotaro|FG|71033
Casalnuovo di Napoli|NA|80013
Casaloldo|MN|46040
Casalpusterlengo|LO|26841
Casalromano|MN|46040
Casalserugo|PD|35020
Casaluce|CE|81030
Casalvecchio Siculo|ME|98032
Casalvecchio di Puglia|FG|71030
Casalvieri|FR|03034
Casalvolone|NO|28060
Casalzuigno|VA|21030
Casamarciano|NA|80032
Casamassima|BA|70010
Casamicciola Terme|NA|80074
Casandrino|NA|80025
Casanova Elvo|VC|13030
Casanova Lerrone|SV|17033
Casanova Lonati|PV|27041
Casape|RM|00010
Casapesenna|CE|81030
Casapinta|BI|13866
Casaprota|RI|02030
Casapulla|CE|81020
Casarano|LE|73042
Casargo|LC|23831
Casarile|MI|20059
Casarsa della Delizia|PN|33072
Casarza Ligure|GE|16030
Casasco|AL|15050
Casatenovo|LC|23880
Casatisma|PV|27040
Casavatore|NA|80020
Casazza|BG|24060
Cascia|PG|06043
Casciago|VA|21020
Casciana Terme Lari|PI|56035
Cascina|PI|56021
Cascinette d'Ivrea|TO|10010
Casei Gerola|PV|27050
Caselette|TO|10040
Casella|GE|16015
Caselle Landi|LO|26842
Caselle Lurani|LO|26853
Caselle Torinese|TO|10072
Caselle in Pittari|SA|84030
Caserta|CE|81100|1
Casier|TV|31030
Casignana|RC|89030
Casina|RE|42034
Casirate d'Adda|BG|24040
Caslino d'Erba|CO|22030
Casnate con Bernate|CO|22070
Casnigo|BG|24020
Casola Valsenio|RA|48032
Casola di Napoli|NA|80050
Casola in Lunigiana|MS|54014
Casole d'Elsa|SI|53031
Casoli|CH|66043
Casorate Primo|PV|27022
Casorate Sempione|VA|21011
Casorezzo|MI|20003
Casoria|NA|80026
Casorzo Monferrato|AT|14032
Casperia|RI|02041
Caspoggio|SO|23020
Cassacco|UD|33010
Cassago Brianza|LC|23893
Cassano Irpino|AV|83040
Cassano Magnago|VA|21012
Cassano Spinola|AL|15063
Cassano Valcuvia|VA|21030
Cassano all'Ionio|CS|87011
Cassano d'Adda|MI|20062
Cassano delle Murge|BA|70020
Cassaro|SR|96010
Cassiglio|BG|24010
Cassina Rizzardi|CO|22070
Cassina Valsassina|LC|23817
Cassina de' Pecchi|MI|20051
Cassinasco|AT|14050
Cassine|AL|15016
Cassinelle|AL|15070
Cassinetta di Lugagnano|MI|20081
Cassino|FR|03043
Cassola|VI|36022
Cassolnovo|PV|27023
Castagnaro|VR|37043
Castagneto Carducci|LI|57022
Castagneto Po|TO|10090
Castagnito|CN|12050
Castagnole Monferrato|AT|14030
Castagnole Piemonte|TO|10060
Castagnole delle Lanze|AT|14054
Castana|PV|27040
Castano Primo|MI|20022
Casteggio|PV|27045
Castegnato|BS|25045
Castegnero Nanto|VI|36020,36024
Castel Baronia|AV|83040
Castel Boglione|AT|14040
Castel Bolognese|RA|48014
Castel Campagnano|CE|81010
Castel Castagna|TE|64030
Castel Condino|TN|38082
Castel Focognano|AR|52016
Castel Frentano|CH|66032
Castel Gabbiano|CR|26010
Castel Gandolfo|RM|00073
Castel Giorgio|TR|05013
Castel Goffredo|MN|46042
Castel Guelfo di Bologna|BO|40023
Castel Ivano|TN|38059
Castel Madama|RM|00024
Castel Maggiore|BO|40013
Castel Mella|BS|25030
Castel Morrone|CE|81020
Castel Ritaldi|PG|06044
Castel Rocchero|AT|14044
Castel Rozzone|BG|24040
Castel San Giorgio|SA|84083
Castel San Giovanni|PC|29015
Castel San Lorenzo|SA|84049
Castel San Niccolò|AR|52018
Castel San Pietro Romano|RM|00030
Castel San Pietro Terme|BO|40024
Castel San Vincenzo|IS|86071
Castel Sant'Angelo|RI|02010
Castel Sant'Elia|VT|01030
Castel Viscardo|TR|05014
Castel Vittorio|IM|18030
Castel Volturno|CE|81030
Castel d'Aiano|BO|40034
Castel d'Ario|MN|46033
Castel d'Azzano|VR|37060
Castel del Giudice|IS|86080
Castel del Monte|AQ|67023
Castel del Piano|GR|58033
Castel del Rio|BO|40022
Castel di Casio|BO|40030
Castel di Ieri|AQ|67020
Castel di Iudica|CT|95040
Castel di Lama|AP|63082
Castel di Lucio|ME|98070
Castel di Sangro|AQ|67031
Castel di Sasso|CE|81040
Castel di Tora|RI|02020
Castelbaldo|PD|35040
Castelbelforte|MN|46032
Castelbellino|AN|60030
Castelbello-Ciardes|BZ|39020
Castelbianco|SV|17030
Castelbottaccio|CB|86030
Castelbuono|PA|90013
Castelcivita|SA|84020
Castelcovati|BS|25030
Castelcucco|TV|31030
Casteldaccia|PA|90014
Casteldelci|RN|47861
Casteldelfino|CN|12020
Casteldidone|CR|26030
Castelfidardo|AN|60022
Castelfiorentino|FI|50051
Castelforte|LT|04021
Castelfranci|AV|83040
Castelfranco Emilia|MO|41013
Castelfranco Piandiscò|AR|52026
Castelfranco Veneto|TV|31033
Castelfranco di Sotto|PI|56022
Castelfranco in Miscano|BN|82022
Castelgerundo|LO|26844
Castelgomberto|VI|36070
Castelgrande|PZ|85050
Castelguglielmo|RO|45020
Castelguidone|CH|66040
Castell'Alfero|AT|14033
Castell'Arquato|PC|29014
Castell'Azzara|GR|58034
Castell'Umberto|ME|98070
Castellabate|SA|84048
Castellafiume|AQ|67050
Castellalto|TE|64020
Castellammare del Golfo|TP|91014
Castellammare di Stabia|NA|80053
Castellamonte|TO|10081
Castellana Grotte|BA|70013
Castellana Sicula|PA|90020
Castellaneta|TA|74011
Castellania Coppi|AL|15051
Castellanza|VA|21053
Castellar Guidobono|AL|15050
Castellarano|RE|42014
Castellaro|IM|18011
Castellazzo Bormida|AL|15073
Castellazzo Novarese|NO|28060
Castelleone|CR|26012
Castelleone di Suasa|AN|60010
Castellero|AT|14013
Castelletto Cervo|BI|13851
Castelletto Merli|AL|15020
Castelletto Molina|AT|14040
Castelletto Monferrato|AL|15040
Castelletto Stura|CN|12040
Castelletto Uzzone|CN|12070
Castelletto d'Erro|AL|15010
Castelletto d'Orba|AL|15060
Castelletto di Branduzzo|PV|27040
Castelletto sopra Ticino|NO|28053
Castelli|TE|64041
Castelli Calepio|BG|24060
Castellina Marittima|PI|56040
Castellina in Chianti|SI|53011
Castellinaldo d'Alba|CN|12050
Castellino Tanaro|CN|12060
Castellino del Biferno|CB|86020
Castelliri|FR|03030
Castello Cabiaglio|VA|21030
Castello Tesino|TN|38053
Castello d'Agogna|PV|27030
Castello d'Argile|BO|40050
Castello del Matese|CE|81016
Castello dell'Acqua|SO|23030
Castello di Annone|AT|14034
Castello di Brianza|LC|23884
Castello di Cisterna|NA|80030
Castello di Godego|TV|31030
Castello-Molina di Fiemme|TN|38030
Castellucchio|MN|46014
Castelluccio Inferiore|PZ|85040
Castelluccio Superiore|PZ|85040
Castelluccio Valmaggiore|FG|71020
Castelluccio dei Sauri|FG|71025
Castelmagno|CN|12020
Castelmarte|CO|22030
Castelmassa|RO|45035
Castelmauro|CB|86031
Castelmezzano|PZ|85010
Castelmola|ME|98030
Castelnovetto|PV|27030
Castelnovo Bariano|RO|45030
Castelnovo del Friuli|PN|33090
Castelnovo di Sotto|RE|42024
Castelnovo ne' Monti|RE|42035
Castelnuovo|TN|38050
Castelnuovo Belbo|AT|14043
Castelnuovo Berardenga|SI|53019
Castelnuovo Bocca d'Adda|LO|26843
Castelnuovo Bormida|AL|15017
Castelnuovo Bozzente|CO|22070
Castelnuovo Calcea|AT|14040
Castelnuovo Cilento|SA|84040
Castelnuovo Don Bosco|AT|14022
Castelnuovo Magra|SP|19033
Castelnuovo Nigra|TO|10080
Castelnuovo Parano|FR|03040
Castelnuovo Rangone|MO|41051
Castelnuovo Scrivia|AL|15053
Castelnuovo del Garda|VR|37014
Castelnuovo della Daunia|FG|71034
Castelnuovo di Ceva|CN|12070
Castelnuovo di Conza|SA|84020
Castelnuovo di Farfa|RI|02031
Castelnuovo di Garfagnana|LU|55032
Castelnuovo di Porto|RM|00060
Castelnuovo di Val di Cecina|PI|56041
Castelpagano|BN|82024
Castelpetroso|IS|86090
Castelpizzuto|IS|86090
Castelplanio|AN|60031
Castelpoto|BN|82030
Castelraimondo|MC|62022
Castelrotto|BZ|39040
Castelsantangelo sul Nera|MC|62039
Castelsaraceno|PZ|85031
Castelsardo|SS|07031
Castelseprio|VA|21050
Castelsilano|KR|88834
Castelspina|AL|15070
Casteltermini|AG|92025
Castelveccana|VA|21010
Castelvecchio Calvisio|AQ|67020
Castelvecchio Subequo|AQ|67024
Castelvecchio di Rocca Barbena|SV|17034
Castelvenere|BN|82037
Castelverde|CR|26022
Castelverrino|IS|86080
Castelvetere in Val Fortore|BN|82023
Castelvetere sul Calore|AV|83040
Castelvetrano|TP|91022
Castelvetro Piacentino|PC|29010
Castelvetro di Modena|MO|41014
Castelvisconti|CR|26010
Castenaso|BO|40055
Castenedolo|BS|25014
Castiadas|CA|09040
Castiglion Fibocchi|AR|52029
Castiglion Fiorentino|AR|52043
Castiglione Chiavarese|GE|16030
Castiglione Cosentino|CS|87040
Castiglione Falletto|CN|12060
Castiglione Messer Marino|CH|66033
Castiglione Messer Raimondo|TE|64034
Castiglione Olona|VA|21043
Castiglione Tinella|CN|12053
Castiglione Torinese|TO|10090
Castiglione a Casauria|PE|65020
Castiglione d'Adda|LO|26823
Castiglione d'Orcia|SI|53023
Castiglione dei Pepoli|BO|40035
Castiglione del Genovesi|SA|84090
Castiglione del Lago|PG|06061
Castiglione della Pescaia|GR|58043
Castiglione delle Stiviere|MN|46043
Castiglione di Garfagnana|LU|55033
Castiglione di Sicilia|CT|95012
Castiglione in Teverina|VT|01024
Castignano|AP|63072
Castilenti|TE|64035
Castino|CN|12050
Castione Andevenno|SO|23012
Castione della Presolana|BG|24020
Castions di Strada|UD|33050
Castiraga Vidardo|LO|26866
Casto|BS|25070
Castorano|AP|63081
Castrezzato|BS|25030
Castri di Lecce|LE|73020
Castrignano de' Greci|LE|73020
Castrignano del Capo|LE|73040
Castro|BG|24063
Castro|LE|73030
Castro dei Volsci|FR|03020
Castrocaro Terme e Terra del Sole|FC|47011
Castrocielo|FR|03030
Castrofilippo|AG|92020
Castrolibero|CS|87040
Castronno|VA|21040
Castronovo di Sicilia|PA|90030
Castronuovo di Sant'Andrea|PZ|85030
Castropignano|CB|86010
Castroreale|ME|98053
Castroregio|CS|87070
Castrovillari|CS|87012
Catania|CT|95121-95129,95131|1
Catanzaro|CZ|88100|1
Catenanuova|EN|94010
Catignano|PE|65011
Cattolica|RN|47841
Cattolica Eraclea|AG|92011
Caulonia|RC|89041
Cautano|BN|82030
Cava Manara|PV|27051
Cava de' Tirreni|SA|84013
Cavaglietto|NO|28010
Cavaglio d'Agogna|NO|28010
Cavaglià|BI|13881
Cavagnolo|TO|10020
Cavaion Veronese|VR|37010
Cavalese|TN|38033
Cavallerleone|CN|12030
Cavallermaggiore|CN|12030
Cavallino|LE|73020
Cavallino-Treporti|VE|30013
Cavallirio|NO|28010
Cavareno|TN|38011
Cavargna|CO|22010
Cavaria con Premezzo|VA|21044
Cavarzere|VE|30014
Cavaso del Tomba|TV|31034
Cavasso Nuovo|PN|33092
Cavatore|AL|15010
Cavazzo Carnico|UD|33020
Cave|RM|00033
Cavedago|TN|38010
Cavedine|TN|38073
Cavenago d'Adda|LO|26824
Cavenago di Brianza|MB|20873
Cavernago|BG|24050
Cavezzo|MO|41032
Cavizzana|TN|38022
Cavour|TO|10061
Cavriago|RE|42025
Cavriana|MN|46040
Cavriglia|AR|52022
Cazzago Brabbia|VA|21020
Cazzago San Martino|BS|25046
Cazzano Sant'Andrea|BG|24026
Cazzano di Tramigna|VR|37030
Ceccano|FR|03023
Cecima|PV|27050
Cecina|LI|57023
Cedegolo|BS|25051
Cedrasco|SO|23010
Cefalà Diana|PA|90030
Cefalù|PA|90015
Ceggia|VE|30022
Ceglie Messapica|BR|72013
Celano|AQ|67043
Celenza Valfortore|FG|71035
Celenza sul Trigno|CH|66050
Celico|CS|87053
Cella Dati|CR|26040
Cella Monte|AL|15034
Cellamare|BA|70010
Cellara|CS|87050
Cellarengo|AT|14010
Cellatica|BS|25060
Celle Enomondo|AT|14010
Celle Ligure|SV|17015
Celle di Bulgheria|SA|84040
Celle di Macra|CN|12020
Celle di San Vito|FG|71020
Celleno|VT|01020
Cellere|VT|01010
Cellino Attanasio|TE|64036
Cellino San Marco|BR|72020
Cellio con Breia|VC|13024
Cellole|CE|81030
Cembra Lisignago|TN|38034
Cenadi|CZ|88067
Cenate Sopra|BG|24060
Cenate Sotto|BG|24069
Cencenighe Agordino|BL|32020
Cene|BG|24020
Ceneselli|RO|45030
Cengio|SV|17056
Centallo|CN|12044
Cento|FE|44042
Centola|SA|84051
Centrache|CZ|88067
Centro Valle Intelvi|CO|22023
Centuripe|EN|94010
Cepagatti|PE|65012
Ceppaloni|BN|82014
Ceppo Morelli|VB|28875
Ceprano|FR|03024
Cerami|EN|94010
Ceranesi|GE|16014
Cerano|NO|28065
Cerano d'Intelvi|CO|22020
Ceranova|PV|27010
Ceraso|SA|84052
Cercemaggiore|CB|86012
Cercenasco|TO|10060
Cercepiccola|CB|86010
Cerchiara di Calabria|CS|87070
Cerchio|AQ|67044
Cercino|SO|23016
Cercivento|UD|33020
Cercola|NA|80040
Cerda|PA|90052
Cerea|VR|37053
Ceregnano|RO|45010
Cerenzia|KR|88833
Ceres|TO|10070
Ceresara|MN|46040
Cereseto|AL|15020
Ceresole Alba|CN|12040
Ceresole Reale|TO|10080
Cerete|BG|24020
Ceretto Lomellina|PV|27030
Cergnago|PV|27020
Ceriale|SV|17023
Ceriana|IM|18034
Ceriano Laghetto|MB|20816
Cerignale|PC|29020
Cerignola|FG|71042
Cerisano|CS|87044
Cermenate|CO|22072
Cermes|BZ|39010
Cermignano|TE|64037
Cernobbio|CO|22012
Cernusco Lombardone|LC|23870
Cernusco sul Naviglio|MI|20063
Cerreto Grue|AL|15050
Cerreto Guidi|FI|50050
Cerreto Laziale|RM|00020
Cerreto Sannita|BN|82032
Cerreto d'Asti|AT|14020
Cerreto d'Esi|AN|60043
Cerreto di Spoleto|PG|06041
Cerretto Langhe|CN|12050
Cerrina Monferrato|AL|15020
Cerrione|BI|13882
Cerro Maggiore|MI|20023
Cerro Tanaro|AT|14030
Cerro Veronese|VR|37020
Cerro al Lambro|MI|20070
Cerro al Volturno|IS|86072
Cersosimo|PZ|85030
Certaldo|FI|50052
Certosa di Pavia|PV|27012
Cerva|CZ|88050
Cervara di Roma|RM|00020
Cervarese Santa Croce|PD|35030
Cervaro|FR|03044
Cervasca|CN|12010
Cervatto|VC|13025
Cerveno|BS|25040
Cervere|CN|12040
Cervesina|PV|27050
Cerveteri|RM|00052
Cervia|RA|48015
Cervicati|CS|87010
Cervignano d'Adda|LO|26832
Cervignano del Friuli|UD|33052
Cervinara|AV|83012
Cervino|CE|81023
Cervo|IM|18010
Cerzeto|CS|87040
Cesa|CE|81030
Cesana Brianza|LC|23861
Cesana Torinese|TO|10054
Cesano Boscone|MI|20090
Cesano Maderno|MB|20811
Cesara|VB|28891
Cesarò|ME|98033
Cesate|MI|20031
Cesena|FC|47521-47522|1
Cesenatico|FC|47042
Cesinali|AV|83020
Cesio|IM|18022
Cesiomaggiore|BL|32030
Cessalto|TV|31040
Cessaniti|VV|89816
Cessapalombo|MC|62020
Cessole|AT|14050
Cetara|SA|84010
Ceto|BS|25040
Cetona|SI|53040
Cetraro|CS|87022
Ceva|CN|12073
Cevo|BS|25040
Challand-Saint-Anselme|AO|11020
Challand-Saint-Victor|AO|11020
Chambave|AO|11023
Chamois|AO|11020
Champdepraz|AO|11020
Champorcher|AO|11020
Charvensod|AO|11020
Cherasco|CN|12062
Cheremule|SS|07040
Chialamberto|TO|10070
Chiampo|VI|36072
Chianche|AV|83010
Chianciano Terme|SI|53042
Chianni|PI|56034
Chianocco|TO|10050
Chiaramonte Gulfi|RG|97012
Chiaramonti|SS|07030
Chiarano|TV|31040
Chiaravalle|AN|60033
Chiaravalle Centrale|CZ|88064
Chiari|BS|25032
Chiaromonte|PZ|85032
Chiauci|IS|86097
Chiavari|GE|16043
Chiavenna|SO|23022
Chiaverano|TO|10010
Chienes|BZ|39030
Chieri|TO|10023
Chies d'Alpago|BL|32010
Chiesa in Valmalenco|SO|23023
Chiesanuova|TO|10080
Chiesina Uzzanese|PT|51013
Chieti|CH|66100|1
Chieuti|FG|71010
Chieve|CR|26010
Chignolo Po|PV|27013
Chignolo d'Isola|BG|24040
Chioggia|VE|30015
Chiomonte|TO|10050
Chions|PN|33083
Chiopris-Viscone|UD|33048
Chitignano|AR|52010
Chiuduno|BG|24060
Chiuppano|VI|36010
Chiuro|SO|23030
Chiusa|BZ|39043
Chiusa Sclafani|PA|90033
Chiusa di Pesio|CN|12013
Chiusa di San Michele|TO|10050
Chiusaforte|UD|33010
Chiusanico|IM|18027
Chiusano d'Asti|AT|14025
Chiusano di San Domenico|AV|83040
Chiusavecchia|IM|18027
Chiusdino|SI|53012
Chiusi|SI|53043
Chiusi della Verna|AR|52010
Chivasso|TO|10034
Châtillon|AO|11024
Ciampino|RM|00043
Cianciana|AG|92012
Cibiana di Cadore|BL|32040
Cicagna|GE|16044
Cicala|CZ|88040
Cicciano|NA|80033
Cicerale|SA|84053
Ciciliano|RM|00020
Cicognolo|CR|26030
Ciconio|TO|10080
Cigliano|VC|13043
Cigliè|CN|12060
Cigognola|PV|27040
Cigole|BS|25020
Cilavegna|PV|27024
Cimadolmo|TV|31010
Cimbergo|BS|25050
Ciminna|PA|90023
Ciminà|RC|89040
Cimitile|NA|80030
Cimolais|PN|33080
Cimone|TN|38060
Cinaglio|AT|14020
Cineto Romano|RM|00020
Cingia de' Botti|CR|26042
Cingoli|MC|62011
Cinigiano|GR|58044
Cinisello Balsamo|MI|20092
Cinisi|PA|90045
Cino|SO|23010
Cinquefrondi|RC|89021
Cintano|TO|10080
Cinte Tesino|TN|38050
Cinto Caomaggiore|VE|30020
Cinto Euganeo|PD|35030
Cinzano|TO|10090
Ciorlano|CE|81010
Cipressa|IM|18017
Circello|BN|82020
Cirigliano|MT|75010
Cirimido|CO|22070
Ciriè|TO|10073
Cirò|KR|88813
Cirò Marina|KR|88811
Cis|TN|38020
Cisano Bergamasco|BG|24034
Cisano sul Neva|SV|17035
Ciserano|BG|24040
Cislago|VA|21040
Cisliano|MI|20046
Cison di Valmarino|TV|31030
Cissone|CN|12050
Cisterna d'Asti|AT|14010
Cisterna di Latina|LT|04012
Cisternino|BR|72014
Citerna|PG|06010
Cittadella|PD|35013
Cittaducale|RI|02015
Cittanova|RC|89022
Cittareale|RI|02010
Cittiglio|VA|21033
Città Sant'Angelo|PE|65013
Città della Pieve|PG|06062
Città di Castello|PG|06012
Civate|LC|23862
Civezza|IM|18017
Civezzano|TN|38045
Civiasco|VC|13010
Cividale del Friuli|UD|33043
Cividate Camuno|BS|25040
Cividate al Piano|BG|24050
Civita|CS|87010
Civita Castellana|VT|01033
Civita d'Antino|AQ|67050
Civitacampomarano|CB|86030
Civitaluparella|CH|66040
Civitanova Marche|MC|62012
Civitanova del Sannio|IS|86094
Civitaquana|PE|65010
Civitavecchia|RM|00053
Civitella Alfedena|AQ|67030
Civitella Casanova|PE|65010
Civitella Messer Raimondo|CH|66010
Civitella Paganico|GR|58045
Civitella Roveto|AQ|67054
Civitella San Paolo|RM|00060
Civitella d'Agliano|VT|01020
Civitella del Tronto|TE|64010
Civitella di Romagna|FC|47012
Civitella in Val di Chiana|AR|52041
Civo|SO|23010
Claino con Osteno|CO|22010
Claut|PN|33080
Clauzetto|PN|33090
Clavesana|CN|12060
Claviere|TO|10050
Cles|TN|38023
Cleto|CS|87030
Clivio|VA|21050
Clusone|BG|24023
Coassolo Torinese|TO|10070
Coazze|TO|10050
Coazzolo|AT|14054
Coccaglio|BS|25030
Cocconato|AT|14023
Cocquio-Trevisago|VA|21034
Cocullo|AQ|67030
Codevigo|PD|35020
Codevilla|PV|27050
Codigoro|FE|44021
Codogno|LO|26845
Codognè|TV|31013
Codroipo|UD|33033
Codrongianos|SS|07040
Coggiola|BI|13863
Cogliate|MB|20815
Cogne|AO|11012
Cogoleto|GE|16016
Cogollo del Cengio|VI|36010
Cogorno|GE|16030
Colazza|NO|28010
Colceresa|VI|36064
Colere|BG|24020
Colfelice|FR|03030
Coli|PC|29020
Colico|LC|23823
Collalto Sabino|RI|02022
Collarmele|AQ|67071
Collazzone|PG|06050
Colle Brianza|LC|23886
Colle San Magno|FR|03030
Colle Sannita|BN|82024
Colle Santa Lucia|BL|32020
Colle Umberto|TV|31014
Colle d'Anchise|CB|86020
Colle di Tora|RI|02020
Colle di Val d'Elsa|SI|53034
Collebeato|BS|25060
Collecchio|PR|43044
Collecorvino|PE|65010
Colledara|TE|64042
Colledimacine|CH|66010
Colledimezzo|CH|66040
Colleferro|RM|00034
Collegiove|RI|02020
Collegno|TO|10093
Collelongo|AQ|67050
Collepardo|FR|03010
Collepasso|LE|73040
Collepietro|AQ|67020
Colleretto Castelnuovo|TO|10080
Colleretto Giacosa|TO|10010
Collesalvetti|LI|57014
Collesano|PA|90016
Colletorto|CB|86044
Collevecchio|RI|02042
Colli Verdi|PV|27061
Colli a Volturno|IS|86073
Colli al Metauro|PU|61036
Colli del Tronto|AP|63079
Colli sul Velino|RI|02010
Colliano|SA|84020
Collinas|VS|09020
Collio|BS|25060
Collobiano|VC|13030
Colloredo di Monte Albano|UD|33010
Colmurano|MC|62020
Colobraro|MT|75021
Cologna Veneta|VR|37044
Cologne|BS|25033
Cologno Monzese|MI|20093
Cologno al Serio|BG|24055
Colognola ai Colli|VR|37030
Colonna|RM|00030
Colonnella|TE|64010
Colonno|CO|22010
Colorina|SO|23010
Colorno|PR|43052
Colosimi|CS|87050
Colturano|MI|20075
Colverde|CO|22041
Colzate|BG|24020
Comabbio|VA|21020
Comacchio|FE|44022
Comano|MS|54015
Comano Terme|TN|38077
Comazzo|LO|26833
Comeglians|UD|33023
Comelico Superiore|BL|32040
Comerio|VA|21025
Comezzano-Cizzago|BS|25030
Comignago|NO|28060
Comiso|RG|97013
Comitini|AG|92020
Comiziano|NA|80030
Commessaggio|MN|46010
Commezzadura|TN|38020
Como|CO|22100|1
Compiano|PR|43053
Comun Nuovo|BG|24040
Comunanza|AP|63087
Cona|VE|30010
Conca Casale|IS|86070
Conca dei Marini|SA|84010
Conca della Campania|CE|81044
Concamarise|VR|37050
Concerviano|RI|02020
Concesio|BS|25062
Concordia Sagittaria|VE|30023
Concordia sulla Secchia|MO|41033
Concorezzo|MB|20863
Condofuri|RC|89030
Condove|TO|10055
Condrò|ME|98040
Conegliano|TV|31015
Confienza|PV|27030
Configni|RI|02040
Conflenti|CZ|88040
Coniolo|AL|15030
Conselice|RA|48017
Conselve|PD|35026
Contessa Entellina|PA|90030
Contigliano|RI|02043
Contrada|AV|83020
Controguerra|TE|64010
Controne|SA|84020
Contursi Terme|SA|84024
Contà|TN|38093
Conversano|BA|70014
Conza della Campania|AV|83040
Conzano|AL|15030
Copertino|LE|73043
Copiano|PV|27010
Copparo|FE|44034
Corana|PV|27050
Corato|BA|70033
Corbara|SA|84010
Corbetta|MI|20011
Corbola|RO|45015
Corchiano|VT|01030
Corciano|PG|06073
Cordenons|PN|33084
Cordignano|TV|31016
Cordovado|PN|33075
Coreglia Antelminelli|LU|55025
Coreglia Ligure|GE|16040
Coreno Ausonio|FR|03040
Corfinio|AQ|67030
Cori|LT|04010
Coriano|RN|47853
Corigliano d'Otranto|LE|73022
Corigliano-Rossano|CS|87064
Corinaldo|AN|60013
Corio|TO|10070
Corleone|PA|90034
Corleto Monforte|SA|84020
Corleto Perticara|PZ|85012
Cormano|MI|20032
Cormons|GO|34071
Corna Imagna|BG|24030
Cornalba|BG|24017
Cornale e Bastida|PV|27056
Cornaredo|MI|20007
Cornate d'Adda|MB|20872
Cornedo Vicentino|VI|36073
Cornedo all'Isarco|BZ|39053
Cornegliano Laudense|LO|26854
Corneliano d'Alba|CN|12040
Corniglio|PR|43021
Corno Giovine|LO|26846
Corno di Rosazzo|UD|33040
Cornovecchio|LO|26842
Cornuda|TV|31041
Correggio|RE|42015
Correzzana|MB|20856
Correzzola|PD|35020
Corrido|CO|22010
Corridonia|MC|62014
Corropoli|TE|64013
Corsano|LE|73033
Corsico|MI|20094
Corsione|AT|14020
Cortaccia sulla strada del vino|BZ|39040
Cortale|CZ|88020
Cortandone|AT|14013
Cortanze|AT|14020
Cortazzone|AT|14010
Corte Brugnatella|PC|29020
Corte Franca|BS|25040
Corte Palasio|LO|26834
Corte de' Cortesi con Cignone|CR|26020
Corte de' Frati|CR|26010
Cortemaggiore|PC|29016
Cortemilia|CN|12074
Corteno Golgi|BS|25040
Cortenova|LC|23813
Cortenuova|BG|24050
Corteolona e Genzone|PV|27014
Cortiglione|AT|14040
Cortina d'Ampezzo|BL|32043
Cortina sulla strada del vino|BZ|39040
Cortino|TE|64040
Cortona|AR|52044
Corvara|PE|65020
Corvara in Badia|BZ|39033
Corvino San Quirico|PV|27050
Corzano|BS|25030
Coseano|UD|33030
Cosenza|CS|87100|1
Cosio Valtellino|SO|23013
Cosio d'Arroscia|IM|18023
Cosoleto|RC|89050
Cossano Belbo|CN|12054
Cossano Canavese|TO|10010
Cossato|BI|13836
Cosseria|SV|17017
Cossignano|AP|63067
Cossogno|VB|28801
Cossoine|SS|07010
Cossombrato|AT|14020
Costa Masnaga|LC|23845
Costa Serina|BG|24010
Costa Valle Imagna|BG|24030
Costa Vescovato|AL|15050
Costa Volpino|BG|24062
Costa de' Nobili|PV|27010
Costa di Mezzate|BG|24060
Costa di Rovigo|RO|45023
Costabissara|VI|36030
Costacciaro|PG|06021
Costanzana|VC|13033
Costarainera|IM|18017
Costermano sul Garda|VR|37010
Costigliole Saluzzo|CN|12024
Costigliole d'Asti|AT|14055
Cotignola|RA|48033
Cotronei|KR|88836
Cottanello|RI|02040
Courmayeur|AO|11013
Covo|BG|24050
Cozzo|PV|27030
Craco|MT|75010
Crandola Valsassina|LC|23832
Cravagliana|VC|13020
Cravanzana|CN|12050
Craveggia|VB|28852
Creazzo|VI|36051
Crecchio|CH|66014
Credaro|BG|24060
Credera Rubbiano|CR|26010
Crema|CR|26013
Cremella|LC|23894
Cremenaga|VA|21030
Cremeno|LC|23814
Cremia|CO|22010
Cremolino|AL|15010
Cremona|CR|26100|1
Cremosano|CR|26010
Crescentino|VC|13044
Crespadoro|VI|36070
Crespiatica|LO|26835
Crespina Lorenzana|PI|56042
Crespino|RO|45030
Cressa|NO|28012
Crevacuore|BI|13864
Crevalcore|BO|40014
Crevoladossola|VB|28865
Crispano|NA|80020
Crispiano|TA|74012
Crissolo|CN|12030
Crocefieschi|GE|16010
Crocetta del Montello|TV|31035
Crodo|VB|28862
Crognaleto|TE|64043
Cropalati|CS|87060
Cropani|CZ|88051
Crosia|CS|87060
Crosio della Valle|VA|21020
Crotone|KR|88900|1
Crotta d'Adda|CR|26020
Crova|VC|13040
Croviana|TN|38027
Crucoli|KR|88812
Cuasso al Monte|VA|21050
Cuccaro Vetere|SA|84050
Cucciago|CO|22060
Cuceglio|TO|10090
Cuggiono|MI|20012
Cugliate-Fabiasco|VA|21030
Cuglieri|OR|09073
Cugnoli|PE|65020
Cumiana|TO|10040
Cumignano sul Naviglio|CR|26020
Cunardo|VA|21035
Cuneo|CN|12100|1
Cunico|AT|14026
Cuorgnè|TO|10082
Cupello|CH|66051
Cupra Marittima|AP|63064
Cupramontana|AN|60034
Cura Carpignano|PV|27010
Curcuris|OR|09090
Cureggio|NO|28060
Curiglia con Monteviasco|VA|21010
Curinga|CZ|88022
Curino|BI|13865
Curno|BG|24035
Curon Venosta|BZ|39027
Cursi|LE|73020
Curtarolo|PD|35010
Curtatone|MN|46010
Curti|CE|81040
Cusago|MI|20047
Cusano Milanino|MI|20095
Cusano Mutri|BN|82033
Cusino|CO|22010
Cusio|BG|24010
Custonaci|TP|91015
Cutro|KR|88842
Cutrofiano|LE|73020
Cuveglio|VA|21030
Cuvio|VA|21030
Dairago|MI|20036
Dalmine|BG|24044
Dambel|TN|38010
Danta di Cadore|BL|32040
Darfo Boario Terme|BS|25047
Dasà|VV|89832
Davagna|GE|16022
Daverio|VA|21020
Davoli|CZ|88060
Dazio|SO|23010
Decimomannu|CA|09033
Decimoputzu|CA|09001
Decollatura|CZ|88041
Dego|SV|17058
Deiva Marina|SP|19013
Delebio|SO|23014
Delia|CL|93010
Delianuova|RC|89012
Deliceto|FG|71026
Dello|BS|25020
Demonte|CN|12014
Denice|AL|15010
Denno|TN|38010
Dernice|AL|15056
Derovere|CR|26040
Deruta|PG|06053
Dervio|LC|23824
Desana|VC|13034
Desenzano del Garda|BS|25015
Desio|MB|20832
Desulo|NU|08032
Diamante|CS|87023
Diano Arentino|IM|18013
Diano Castello|IM|18013
Diano Marina|IM|18013
Diano San Pietro|IM|18013
Diano d'Alba|CN|12055
Dicomano|FI|50062
Dignano|UD|33030
Dimaro Folgarida|TN|38025
Dinami|VV|89833
Dipignano|CS|87045
Diso|LE|73030
Divignano|NO|28010
Dizzasco|CO|22020
Dobbiaco|BZ|39034
Doberdò del Lago|GO|34070
Dogliani|CN|12063
Dogliola|CH|66050
Dogna|UD|33010
Dolceacqua|IM|18035
Dolcedo|IM|18020
Dolcè|VR|37020
Dolegna del Collio|GO|34070
Dolianova|CA|09041
Dolo|VE|30031
Dolzago|LC|23843
Domanico|CS|87030
Domaso|CO|22013
Domegge di Cadore|BL|32040
Domicella|AV|83020
Domodossola|VB|28845
Domus de Maria|CA|09002
Domusnovas|SU|09015
Donato|BI|13893
Dongo|CO|22014
Donnas|AO|11020
Donori|CA|09040
Dorgali|NU|08022
Dorio|LC|23824
Dormelletto|NO|28040
Dorno|PV|27020
Dorzano|BI|13881
Dosolo|MN|46030
Dossena|BG|24010
Dosso del Liro|CO|22010
Doues|AO|11010
Dovadola|FC|47013
Dovera|CR|26010
Dozza|BO|40060
Dragoni|CE|81010
Drapia|VV|89862
Drena|TN|38074
Drenchia|UD|33040
Dresano|MI|20070
Dro|TN|38074
Dronero|CN|12025
Druento|TO|10040
Druogno|VB|28853
Dualchi|NU|08010
Dubino|SO|23015
Due Carrare|PD|35020
Dueville|VI|36031
Dugenta|BN|82030
Duino Aurisina|TS|34011
Dumenza|VA|21010
Duno|VA|21030
Durazzano|BN|82015
Duronia|CB|86020
Dusino San Michele|AT|14010
Eboli|SA|84025
Edolo|BS|25048
Egna|BZ|39044
Elice|PE|65010
Elini|OG|08040
Ello|LC|23848
Elmas|CA|09067
Elva|CN|12020
Emarèse|AO|11020
Empoli|FI|50053
Endine Gaiano|BG|24060
Enego|VI|36052
Enemonzo|UD|33020
Enna|EN|94100|1
Entracque|CN|12010
Entratico|BG|24060
Envie|CN|12030
Episcopia|PZ|85033
Eraclea|VE|30020
Erba|CO|22036
Erbezzo|VR|37020
Erbusco|BS|25030
Erbè|VR|37060
Erchie|BR|72020
Ercolano|NA|80056
Erice|TP|91016
Erli|SV|17030
Erto e Casso|PN|33080
Erula|SS|07030
Erve|LC|23805
Esanatoglia|MC|62024
Escalaplano|CA|09051
Escolca|CA|09052
Esine|BS|25040
Esino Lario|LC|23825
Esperia|FR|03045
Esporlatu|SS|07010
Este|PD|35042
Esterzili|CA|09053
Etroubles|AO|11014
Eupilio|CO|22030
Exilles|TO|10050
Fabbrica Curone|AL|15054
Fabbriche di Vergemoli|LU|55021
Fabbrico|RE|42042
Fabriano|AN|60044
Fabrica di Roma|VT|01034
Fabrizia|VV|89823
Fabro|TR|05015
Faedis|UD|33040
Faedo Valtellino|SO|23020
Faenza|RA|48018
Faeto|FG|71020
Fagagna|UD|33034
Faggeto Lario|CO|22020
Faggiano|TA|74020
Fagnano Alto|AQ|67020
Fagnano Castello|CS|87013
Fagnano Olona|VA|21054
Fai della Paganella|TN|38010
Faicchio|BN|82030
Falcade|BL|32020
Falciano del Massico|CE|81030
Falconara Albanese|CS|87030
Falconara Marittima|AN|60015
Falcone|ME|98060
Faleria|VT|01030
Falerna|CZ|88042
Falerone|FM|63837
Fallo|CH|66040
Faloppio|CO|22020
Falvaterra|FR|03020
Falzes|BZ|39030
Fanano|MO|41021
Fanna|PN|33092
Fano|PU|61032
Fano Adriano|TE|64044
Fara Filiorum Petri|CH|66010
Fara Gera d'Adda|BG|24045
Fara Novarese|NO|28073
Fara Olivana con Sola|BG|24058
Fara San Martino|CH|66015
Fara Vicentino|VI|36030
Fara in Sabina|RI|02032
Fardella|PZ|85034
Farigliano|CN|12060
Farindola|PE|65010
Farini|PC|29023
Farnese|VT|01010
Farra d'Isonzo|GO|34072
Farra di Soligo|TV|31010
Fasano|BR|72015
Fascia|GE|16020
Fauglia|PI|56043
Faule|CN|12030
Favale di Malvaro|GE|16040
Favara|AG|92026
Favignana|TP|91023
Favria|TO|10083
Feisoglio|CN|12050
Feletto|TO|10080
Felino|PR|43035
Felitto|SA|84055
Felizzano|AL|15023
Feltre|BL|32032
Fenegrò|CO|22070
Fenestrelle|TO|10060
Ferentillo|TR|05034
Ferentino|FR|03013
Ferla|SR|96010
Fermignano|PU|61033
Fermo|FM|63900|1
Ferno|VA|21010
Feroleto Antico|CZ|88040
Feroleto della Chiesa|RC|89050
Ferrandina|MT|75013
Ferrara|FE|44121-44124|1
Ferrara di Monte Baldo|VR|37020
Ferrazzano|CB|86010
Ferrera Erbognone|PV|27032
Ferrera di Varese|VA|21030
Ferrere|AT|14012
Ferriere|PC|29024
Ferruzzano|RC|89030
Fiamignano|RI|02023
Fiano|TO|10070
Fiano Romano|RM|00065
Fiastra|MC|62035
Fiavè|TN|38075
Ficarazzi|PA|90010
Ficarolo|RO|45036
Ficarra|ME|98062
Ficulle|TR|05016
Fidenza|PR|43036
Fierozzo|TN|38050
Fiesco|CR|26010
Fiesole|FI|50014
Fiesse|BS|25020
Fiesso Umbertiano|RO|45024
Fiesso d'Artico|VE|30032
Figino Serenza|CO|22060
Figline Vegliaturo|CS|87050
Figline e Incisa Valdarno|FI|50063
Filacciano|RM|00060
Filadelfia|VV|89814
Filago|BG|24040
Filandari|VV|89841
Filattiera|MS|54023
Filettino|FR|03010
Filetto|CH|66030
Filiano|PZ|85020
Filighera|PV|27010
Filignano|IS|86074
Filogaso|VV|89843
Filottrano|AN|60024
Finale Emilia|MO|41034
Finale Ligure|SV|17024
Fino Mornasco|CO|22073
Fino del Monte|BG|24020
Fiorano Canavese|TO|10010
Fiorano Modenese|MO|41042
Fiorano al Serio|BG|24020
Fiorenzuola d'Arda|PC|29017
Firenze|FI|50121-50127,50129,50131-50137,50139,50141-50145|1
Firenzuola|FI|50033
Firmo|CS|87010
Fiscaglia|FE|44027
Fisciano|SA|84084
Fiuggi|FR|03014
Fiumalbo|MO|41022
Fiumara|RC|89050
Fiume Veneto|PN|33080
Fiumedinisi|ME|98022
Fiumefreddo Bruzio|CS|87030
Fiumefreddo di Sicilia|CT|95013
Fiumicello Villa Vicentina|UD|33059
Fiumicino|RM|00054
Fiuminata|MC|62025
Fivizzano|MS|54013
Fiè allo Sciliar|BZ|39050
Flaibano|UD|33030
Flero|BS|25020
Floresta|ME|98030
Floridia|SR|96014
Florinas|SS|07030
Flumeri|AV|83040
Fluminimaggiore|SU|09010
Flussio|OR|09090
Fobello|VC|13025
Foggia|FG|71121-71122|1
Foglianise|BN|82030
Fogliano Redipuglia|GO|34070
Foglizzo|TO|10090
Foiano della Chiana|AR|52045
Foiano di Val Fortore|BN|82020
Folgaria|TN|38064
Folignano|AP|63084
Foligno|PG|06034
Follina|TV|31051
Follo|SP|19020
Follonica|GR|58022
Fombio|LO|26861
Fondachelli-Fantina|ME|98050
Fondi|LT|04022
Fonni|NU|08023
Fontainemore|AO|11020
Fontana Liri|FR|03035
Fontanafredda|PN|33074
Fontanarosa|AV|83040
Fontanelice|BO|40025
Fontanella|BG|24056
Fontanellato|PR|43012
Fontanelle|TV|31043
Fontaneto d'Agogna|NO|28010
Fontanetto Po|VC|13040
Fontanigorda|GE|16023
Fontanile|AT|14044
Fontaniva|PD|35014
Fonte|TV|31010
Fonte Nuova|RM|00013
Fontecchio|AQ|67020
Fontechiari|FR|03030
Fontegreca|CE|81014
Fonteno|BG|24060
Fontevivo|PR|43010
Fonzaso|BL|32030
Foppolo|BG|24010
Forano|RI|02044
Force|AP|63086
Forchia|BN|82011
Forcola|SO|23010
Fordongianus|OR|09083
Forenza|PZ|85023
Foresto Sparso|BG|24060
Forgaria nel Friuli|UD|33030
Forino|AV|83020
Forio|NA|80075
Forlimpopoli|FC|47034
Forlì|FC|47121-47122|1
Forlì del Sannio|IS|86084
Formazza|VB|28863
Formello|RM|00060
Formia|LT|04023
Formicola|CE|81040
Formigara|CR|26020
Formigine|MO|41043
Formigliana|VC|13030
Fornace|TN|38040
Fornelli|IS|86070
Forni Avoltri|UD|33020
Forni di Sopra|UD|33024
Forni di Sotto|UD|33020
Forno Canavese|TO|10084
Fornovo San Giovanni|BG|24040
Fornovo di Taro|PR|43045
Forte dei Marmi|LU|55042
Fortezza|BZ|39045
Fortunago|PV|27040
Forza d'Agrò|ME|98030
Fosciandora|LU|55020
Fosdinovo|MS|54035
Fossa|AQ|67020
Fossacesia|CH|66022
Fossalta di Piave|VE|30020
Fossalta di Portogruaro|VE|30025
Fossalto|CB|86020
Fossano|CN|12045
Fossato Serralta|CZ|88050
Fossato di Vico|PG|06022
Fossombrone|PU|61034
Fossò|VE|30030
Foza|VI|36010
Frabosa Soprana|CN|12082
Frabosa Sottana|CN|12083
Fraconalto|AL|15060
Fragagnano|TA|74022
Fragneto Monforte|BN|82020
Fragneto l'Abate|BN|82020
Fraine|CH|66050
Framura|SP|19014
Francavilla Angitola|VV|89815
Francavilla Bisio|AL|15060
Francavilla Fontana|BR|72021
Francavilla Marittima|CS|87072
Francavilla al Mare|CH|66023
Francavilla d'Ete|FM|63816
Francavilla di Sicilia|ME|98034
Francavilla in Sinni|PZ|85034
Francica|VV|89851
Francofonte|SR|96015
Francolise|CE|81050
Frascaro|AL|15010
Frascarolo|PV|27030
Frascati|RM|00044
Frascineto|CS|87010
Frassilongo|TN|38050
Frassinelle Polesine|RO|45030
Frassinello Monferrato|AL|15035
Frassineto Po|AL|15040
Frassinetto|TO|10080
Frassino|CN|12020
Frassinoro|MO|41044
Frasso Sabino|RI|02030
Frasso Telesino|BN|82030
Fratta Polesine|RO|45025
Fratta Todina|PG|06054
Frattamaggiore|NA|80027
Frattaminore|NA|80020
Fratte Rosa|PU|61040
Frazzanò|ME|98070
Fregona|TV|31010
Fresagrandinaria|CH|66050
Fresonara|AL|15064
Frigento|AV|83040
Frignano|CE|81030
Frinco|AT|14030
Frisa|CH|66030
Frisanco|PN|33080
Front|TO|10070
Frontino|PU|61021
Frontone|PU|61040
Frosinone|FR|03100|1
Frosolone|IS|86095
Frossasco|TO|10060
Frugarolo|AL|15065
Fubine Monferrato|AL|15043
Fucecchio|FI|50054
Fuipiano Valle Imagna|BG|24030
Fumane|VR|37022
Fumone|FR|03010
Funes|BZ|39040
Furci|CH|66050
Furci Siculo|ME|98023
Furnari|ME|98054
Furore|SA|84010
Furtei|VS|09020
Fuscaldo|CS|87024
Fusignano|RA|48034
Fusine|SO|23010
Futani|SA|84050
Fénis|AO|11020
Gabbioneta-Binanuova|CR|26030
Gabiano|AL|15020
Gabicce Mare|PU|61011
Gaby|AO|11020
Gadesco-Pieve Delmona|CR|26030
Gadoni|NU|08030
Gaeta|LT|04024
Gaggi|ME|98030
Gaggiano|MI|20083
Gaggio Montano|BO|40041
Gaglianico|BI|13894
Gagliano Aterno|AQ|67020
Gagliano Castelferrato|EN|94010
Gagliano del Capo|LE|73034
Gagliato|CZ|88060
Gagliole|MC|62022
Gaiarine|TV|31018
Gaiba|RO|45030
Gaiola|CN|12010
Gaiole in Chianti|SI|53013
Gairo|OG|08040
Gais|BZ|39030
Galati Mamertino|ME|98070
Galatina|LE|73013
Galatone|LE|73044
Galatro|RC|89054
Galbiate|LC|23851
Galeata|FC|47010
Galgagnano|LO|26832
Gallarate|VA|21013
Gallese|VT|01035
Galliate|NO|28066
Galliate Lombardo|VA|21020
Galliavola|PV|27034
Gallicano|LU|55027
Gallicano nel Lazio|RM|00010
Gallicchio|PZ|85010
Galliera|BO|40015
Galliera Veneta|PD|35015
Gallinaro|FR|03040
Gallio|VI|36032
Gallipoli|LE|73014
Gallo Matese|CE|81010
Gallodoro|ME|98030
Galluccio|CE|81044
Galtellì|NU|08020
Galzignano Terme|PD|35030
Gamalero|AL|15010
Gambara|BS|25020
Gambarana|PV|27030
Gambasca|CN|12030
Gambassi Terme|FI|50050
Gambatesa|CB|86013
Gambellara|VI|36053
Gamberale|CH|66040
Gambettola|FC|47035
Gambolò|PV|27025
Gandellino|BG|24020
Gandino|BG|24024
Gandosso|BG|24060
Gangi|PA|90024
Garaguso|MT|75010
Garbagna|AL|15050
Garbagna Novarese|NO|28070
Garbagnate Milanese|MI|20024
Garbagnate Monastero|LC|23846
Garda|VR|37016
Gardone Riviera|BS|25083
Gardone Val Trompia|BS|25063
Garessio|CN|12075
Gargallo|NO|28010
Gargazzone|BZ|39010
Gargnano|BS|25084
Garlasco|PV|27026
Garlate|LC|23852
Garlenda|SV|17033
Garniga Terme|TN|38060
Garzeno|CO|22010
Garzigliana|TO|10060
Gasperina|CZ|88060
Gassino Torinese|TO|10090
Gattatico|RE|42043
Gatteo|FC|47043
Gattico-Veruno|NO|28013
Gattinara|VC|13045
Gavardo|BS|25085
Gavello|RO|45010
Gaverina Terme|BG|24060
Gavi|AL|15066
Gavignano|RM|00030
Gavirate|VA|21026
Gavoi|NU|08020
Gavorrano|GR|58023
Gazoldo degli Ippoliti|MN|46040
Gazzada Schianno|VA|21045
Gazzaniga|BG|24025
Gazzo|PD|35010
Gazzo Veronese|VR|37060
Gazzola|PC|29010
Gazzuolo|MN|46010
Gela|CL|93012
Gemmano|RN|47855
Gemona del Friuli|UD|33013
Gemonio|VA|21036
Genazzano|RM|00030
Genga|AN|60040
Genivolta|CR|26020
Genola|CN|12040
Genoni|CA|09054
Genova|GE|16121-16129,16131-16139,16141-16149,16151-16159,16161-16167|1
Genuri|VS|09020
Genzano di Lucania|PZ|85013
Genzano di Roma|RM|00045
Gera Lario|CO|22010
Gerace|RC|89040
Geraci Siculo|PA|90054
Gerano|RM|00025
Gerenzago|PV|27010
Gerenzano|VA|21040
Gergei|CA|09055
Germagnano|TO|10070
Germagno|VB|28887
Germignaga|VA|21010
Gerocarne|VV|89831
Gerola Alta|SO|23010
Gerre de' Caprioli|CR|26040
Gesico|CA|09040
Gessate|MI|20060
Gessopalena|CH|66010
Gesturi|VS|09020
Gesualdo|AV|83040
Ghedi|BS|25016
Ghemme|NO|28074
Ghiffa|VB|28823
Ghilarza|OR|09074
Ghisalba|BG|24050
Ghislarengo|VC|13030
Giacciano con Baruchella|RO|45020
Giaglione|TO|10050
Gianico|BS|25040
Giano Vetusto|CE|81042
Giano dell'Umbria|PG|06030
Giardinello|PA|90084
Giardini-Naxos|ME|98035
Giarole|AL|15036
Giarratana|RG|97010
Giarre|CT|95014
Giave|SS|07010
Giaveno|TO|10094
Giavera del Montello|TV|31040
Giba|SU|09010
Gibellina|TP|91024
Gifflenga|BI|13874
Giffone|RC|89020
Giffoni Sei Casali|SA|84090
Giffoni Valle Piana|SA|84095
Gignese|VB|28836
Gignod|AO|11010
Gildone|CB|86010
Gimigliano|CZ|88045
Ginestra|PZ|85020
Ginestra degli Schiavoni|BN|82020
Ginosa|TA|74013
Gioi|SA|84056
Gioia Sannitica|CE|81010
Gioia Tauro|RC|89013
Gioia dei Marsi|AQ|67055
Gioia del Colle|BA|70023
Gioiosa Ionica|RC|89042
Gioiosa Marea|ME|98063
Giove|TR|05024
Giovinazzo|BA|70054
Giovo|TN|38030
Girasole|OG|08040
Girifalco|CZ|88024
Gissi|CH|66052
Giuggianello|LE|73030
Giugliano in Campania|NA|80014
Giuliana|PA|90030
Giuliano Teatino|CH|66010
Giuliano di Roma|FR|03020
Giulianova|TE|64021
Giungano|SA|84050
Giurdignano|LE|73020
Giussago|PV|27010
Giussano|MB|20833
Giustenice|SV|17027
Giustino|TN|38086
Giusvalla|SV|17010
Givoletto|TO|10040
Gizzeria|CZ|88040
Glorenza|BZ|39020
Godega di Sant'Urbano|TV|31010
Godiasco Salice Terme|PV|27052
Godrano|PA|90030
Goito|MN|46044
Golasecca|VA|21010
Golferenzo|PV|27047
Golfo Aranci|OT|07020
Gombito|CR|26020
Gonars|UD|33050
Goni|CA|09040
Gonnesa|SU|09010
Gonnoscodina|OR|09090
Gonnosfanadiga|VS|09035
Gonnosnò|OR|09090
Gonnostramatza|OR|09093
Gonzaga|MN|46023
Gordona|SO|23020
Gorga|RM|00030
Gorgo al Monticano|TV|31040
Gorgoglione|MT|75010
Gorgonzola|MI|20064
Goriano Sicoli|AQ|67030
Gorizia|GO|34170|1
Gorla Maggiore|VA|21050
Gorla Minore|VA|21055
Gorlago|BG|24060
Gorle|BG|24020
Gornate Olona|VA|21040
Gorno|BG|24020
Goro|FE|44020
Gorreto|GE|16020
Gorzegno|CN|12070
Gosaldo|BL|32020
Gossolengo|PC|29020
Gottasecca|CN|12070
Gottolengo|BS|25023
Govone|CN|12040
Gozzano|NO|28024
Gradara|PU|61012
Gradisca d'Isonzo|GO|34072
Grado|GO|34073
Gradoli|VT|01010
Graffignana|LO|26813
Graffignano|VT|01020
Graglia|BI|13895
Gragnano|NA|80054
Gragnano Trebbiense|PC|29010
Grammichele|CT|95042
Grana Monferrato|AT|14031
Granarolo dell'Emilia|BO|40057
Grandate|CO|22070
Grandola ed Uniti|CO|22010
Graniti|ME|98036
Granozzo con Monticello|NO|28060
Grantola|VA|21030
Grantorto|PD|35010
Granze|PD|35040
Grassano|MT|75014
Grassobbio|BG|24050
Gratteri|PA|90010
Gravedona ed Uniti|CO|22015
Gravellona Lomellina|PV|27020
Gravellona Toce|VB|28883
Gravere|TO|10050
Gravina di Catania|CT|95030
Gravina in Puglia|BA|70024
Grazzanise|CE|81046
Grazzano Badoglio|AT|14035
Greccio|RI|02045
Greci|AV|83030
Greggio|VC|13030
Gremiasco|AL|15056
Gressan|AO|11020
Gressoney-La-Trinité|AO|11020
Gressoney-Saint-Jean|AO|11025
Greve in Chianti|FI|50022
Grezzago|MI|20056
Grezzana|VR|37023
Griante|CO|22011
Gricignano di Aversa|CE|81030
Grignasco|NO|28075
Grigno|TN|38055
Grimacco|UD|33040
Grimaldi|CS|87034
Grinzane Cavour|CN|12060
Grisignano di Zocco|VI|36040
Grisolia|CS|87020
Grizzana Morandi|BO|40030
Grognardo|AL|15010
Gromo|BG|24020
Grondona|AL|15060
Grone|BG|24060
Grontardo|CR|26044
Gropello Cairoli|PV|27027
Gropparello|PC|29025
Groscavallo|TO|10070
Grosio|SO|23033
Grosotto|SO|23034
Grosseto|GR|58100|1
Grosso|TO|10070
Grottaferrata|RM|00046
Grottaglie|TA|74023
Grottaminarda|AV|83035
Grottammare|AP|63066
Grottazzolina|FM|63844
Grotte|AG|92020
Grotte di Castro|VT|01025
Grotteria|RC|89043
Grottole|MT|75010
Grottolella|AV|83010
Gruaro|VE|30020
Grugliasco|TO|10095
Grumello Cremonese ed Uniti|CR|26023
Grumello del Monte|BG|24064
Grumento Nova|PZ|85050
Grumo Appula|BA|70025
Grumo Nevano|NA|80028
Grumolo delle Abbadesse|VI|36040
Guagnano|LE|73010
Gualdo|MC|62020
Gualdo Cattaneo|PG|06035
Gualdo Tadino|PG|06023
Gualtieri|RE|42044
Gualtieri Sicaminò|ME|98040
Guamaggiore|CA|09040
Guanzate|CO|22070
Guarcino|FR|03016
Guarda Veneta|RO|45030
Guardabosone|VC|13010
Guardamiglio|LO|26862
Guardavalle|CZ|88065
Guardea|TR|05025
Guardia Lombardi|AV|83040
Guardia Perticara|PZ|85010
Guardia Piemontese|CS|87020
Guardia Sanframondi|BN|82034
Guardiagrele|CH|66016
Guardialfiera|CB|86030
Guardiaregia|CB|86014
Guardistallo|PI|56040
Guarene|CN|12050
Guasila|CA|09040
Guastalla|RE|42016
Guazzora|AL|15050
Gubbio|PG|06024
Gudo Visconti|MI|20088
Guglionesi|CB|86034
Guidizzolo|MN|46040
Guidonia Montecelio|RM|00012
Guiglia|MO|41052
Guilmi|CH|66050
Gurro|VB|28828
Guspini|VS|09036
Gussago|BS|25064
Gussola|CR|26040
Hône|AO|11020
Idro|BS|25074
Iglesias|SU|09016|1
Igliano|CN|12060
Ilbono|OG|08040
Illasi|VR|37031
Illorai|SS|07010
Imbersago|LC|23898
Imer|TN|38050
Imola|BO|40026
Imperia|IM|18100|1
Impruneta|FI|50023
Inarzo|VA|21020
Incisa Scapaccino|AT|14045
Incudine|BS|25040
Induno Olona|VA|21056
Ingria|TO|10080
Intragna|VB|28816
Introbio|LC|23815
Introd|AO|11010
Introdacqua|AQ|67030
Inverigo|CO|22044
Inverno e Monteleone|PV|27010
Inverso Pinasca|TO|10060
Inveruno|MI|20001
Invorio|NO|28045
Inzago|MI|20065
Irgoli|NU|08020
Irma|BS|25061
Irsina|MT|75022
Isasca|CN|12020
Isca sullo Ionio|CZ|88060
Ischia|NA|80077
Ischia di Castro|VT|01010
Ischitella|FG|71010
Iseo|BS|25049
Isera|TN|38060
Isernia|IS|86170|1
Isili|CA|09056
Isnello|PA|90010
Isola Dovarese|CR|26031
Isola Rizza|VR|37050
Isola Sant'Antonio|AL|15050
Isola Vicentina|VI|36033
Isola d'Asti|AT|14057
Isola del Cantone|GE|16017
Isola del Giglio|GR|58012
Isola del Gran Sasso d'Italia|TE|64045
Isola del Liri|FR|03036
Isola del Piano|PU|61030
Isola della Scala|VR|37063
Isola delle Femmine|PA|90040
Isola di Capo Rizzuto|KR|88841
Isola di Fondra|BG|24010
Isolabella|TO|10046
Isolabona|IM|18035
Isole Tremiti|FG|71051
Isorella|BS|25010
Ispani|SA|84050
Ispica|RG|97014
Ispra|VA|21027
Issiglio|TO|10080
Issime|AO|11020
Isso|BG|24040
Issogne|AO|11020
Istrana|TV|31036
Itala|ME|98025
Itri|LT|04020
Ittireddu|SS|07010
Ittiri|SS|07044
Ivrea|TO|10015
Izano|CR|26010
Jacurso|CZ|88020
Jelsi|CB|86015
Jenne|RM|00020
Jerago con Orago|VA|21040
Jerzu|OG|08044
Jesi|AN|60035
Jesolo|VE|30016
Jolanda di Savoia|FE|44037
Jonadi|VV|89851
Joppolo|VV|89863
Joppolo Giancaxio|AG|92035
Jovençan|AO|11020
L'Aquila|AQ|67100|1
La Cassa|TO|10040
La Loggia|TO|10040
La Maddalena|OT|07024
La Magdeleine|AO|11020
La Morra|CN|12064
La Salle|AO|11015
La Spezia|SP|19121-19126,19131-19137|1
La Thuile|AO|11016
La Valle|BZ|39030
La Valle Agordina|BL|32020
La Valletta Brianza|LC|23888
Labico|RM|00030
Labro|RI|02010
Lacchiarella|MI|20084
Lacco Ameno|NA|80076
Lacedonia|AV|83046
Laces|BZ|39021
Laconi|OR|09090
Ladispoli|RM|00055
Laerru|SS|07030
Laganadi|RC|89050
Laghi|VI|36010
Laglio|CO|22010
Lagnasco|CN|12030
Lago|CS|87035
Lagonegro|PZ|85042
Lagosanto|FE|44023
Lagundo|BZ|39022
Laigueglia|SV|17053
Lainate|MI|20045
Laino|CO|22020
Laino Borgo|CS|87014
Laino Castello|CS|87015
Laion|BZ|39040
Laives|BZ|39055
Lajatico|PI|56030
Lallio|BG|24040
Lama Mocogno|MO|41023
Lama dei Peligni|CH|66010
Lambrugo|CO|22045
Lamezia Terme|CZ|88046
Lamon|BL|32033
Lampedusa e Linosa|AG|92031
Lamporecchio|PT|51035
Lamporo|VC|13046
Lana|BZ|39011
Lanciano|CH|66034
Landiona|NO|28064
Landriano|PV|27015
Langhirano|PR|43013
Langosco|PV|27030
Lanusei|OG|08045|1
Lanuvio|RM|00075
Lanzada|SO|23020
Lanzo Torinese|TO|10074
Lapedona|FM|63823
Lapio|AV|83030
Lappano|CS|87050
Larciano|PT|51036
Lardirago|PV|27016
Lariano|RM|00076
Larino|CB|86035
Las Plassas|VS|09020
Lasa|BZ|39023
Lascari|PA|90010
Lasnigo|CO|22030
Lastebasse|VI|36040
Lastra a Signa|FI|50055
Latera|VT|01010
Laterina Pergine Valdarno|AR|52019
Laterza|TA|74014
Latiano|BR|72022
Latina|LT|04100|1
Latisana|UD|33053
Latronico|PZ|85043
Lattarico|CS|87010
Lauco|UD|33029
Laureana Cilento|SA|84050
Laureana di Borrello|RC|89023
Lauregno|BZ|39040
Laurenzana|PZ|85014
Lauria|PZ|85044
Lauriano|TO|10020
Laurino|SA|84057
Laurito|SA|84050
Lauro|AV|83023
Lavagna|GE|16033
Lavagno|VR|37030
Lavarone|TN|38046
Lavello|PZ|85024
Lavena Ponte Tresa|VA|21037
Laveno-Mombello|VA|21014
Lavenone|BS|25074
Laviano|SA|84020
Lavis|TN|38015
Lazise|VR|37017
Lazzate|MB|20824
Lecce|LE|73100|1
Lecce nei Marsi|AQ|67050
Lecco|LC|23900|1
Ledro|TN|38067
Leffe|BG|24026
Leggiuno|VA|21038
Legnago|VR|37045
Legnano|MI|20025
Legnaro|PD|35020
Lei|NU|08010
Leini|TO|10040
Leivi|GE|16040
Lemie|TO|10070
Lendinara|RO|45026
Leni|ME|98050
Lenna|BG|24010
Leno|BS|25024
Lenola|LT|04025
Lenta|VC|13035
Lentate sul Seveso|MB|20823
Lentella|CH|66050
Lentini|SR|96016
Leonessa|RI|02016
Leonforte|EN|94013
Leporano|TA|74020
Lequile|LE|73010
Lequio Berria|CN|12050
Lequio Tanaro|CN|12060
Lercara Friddi|PA|90025
Lerici|SP|19032
Lerma|AL|15070
Lesa|NO|28040
Lesegno|CN|12076
Lesignano de' Bagni|PR|43037
Lesina|FG|71010
Lesmo|MB|20855
Lessolo|TO|10010
Lessona|BI|13853
Lestizza|UD|33050
Letino|CE|81010
Letojanni|ME|98037
Lettere|NA|80050
Lettomanoppello|PE|65020
Lettopalena|CH|66010
Levanto|SP|19015
Levate|BG|24040
Leverano|LE|73045
Levice|CN|12070
Levico Terme|TN|38056
Levone|TO|10070
Lezzeno|CO|22025
Liberi|CE|81040
Librizzi|ME|98064
Licata|AG|92027
Licciana Nardi|MS|54016
Licenza|RM|00026
Licodia Eubea|CT|95059
Lierna|LC|23827
Lignana|VC|13034
Lignano Sabbiadoro|UD|33054
Lillianes|AO|11020
Limana|BL|32020
Limatola|BN|82030
Limbadi|VV|89844
Limbiate|MB|20812
Limena|PD|35010
Limido Comasco|CO|22070
Limina|ME|98030
Limone Piemonte|CN|12015
Limone sul Garda|BS|25010
Limosano|CB|86022
Linarolo|PV|27010
Linguaglossa|CT|95015
Lioni|AV|83047
Lipari|ME|98055
Lipomo|CO|22030
Liscate|MI|20050
Liscia|CH|66050
Lisciano Niccone|PG|06060
Lisio|CN|12070
Lissone|MB|20851
Liveri|NA|80030
Livigno|SO|23041
Livinallongo del Col di Lana|BL|32020
Livo|CO|22010
Livo|TN|38020
Livorno|LI|57121-57128|1
Livorno Ferraris|VC|13046
Livraga|LO|26814
Lizzanello|LE|73023
Lizzano|TA|74020
Lizzano in Belvedere|BO|40042
Loano|SV|17025
Loazzolo|AT|14051
Locana|TO|10080
Locate Varesino|CO|22070
Locate di Triulzi|MI|20085
Locatello|BG|24030
Loceri|OG|08040
Locorotondo|BA|70010
Locri|RC|89044
Loculi|NU|08020
Lodi|LO|26900|1
Lodi Vecchio|LO|26855
Lodine|NU|08020
Lodrino|BS|25060
Lodè|NU|08020
Lograto|BS|25030
Loiano|BO|40050
Loiri Porto San Paolo|OT|07020
Lomagna|LC|23871
Lomazzo|CO|22074
Lombardore|TO|10040
Lombriasco|TO|10040
Lomello|PV|27034
Lona-Lases|TN|38040
Lonate Ceppino|VA|21050
Lonate Pozzolo|VA|21015
Lonato del Garda|BS|25017
Londa|FI|50060
Longano|IS|86090
Longare|VI|36023
Longarone|BL|32013
Longhena|BS|25030
Longi|ME|98070
Longiano|FC|47020
Longobardi|CS|87030
Longobucco|CS|87066
Longone Sabino|RI|02020
Longone al Segrino|CO|22030
Lonigo|VI|36045
Loranzè|TO|10010
Loreggia|PD|35010
Loreglia|VB|28893
Lorenzago di Cadore|BL|32040
Loreo|RO|45017
Loreto|AN|60025
Loreto Aprutino|PE|65014
Loria|TV|31037
Loro Ciuffenna|AR|52024
Loro Piceno|MC|62020
Lorsica|GE|16045
Losine|BS|25050
Lotzorai|OG|08040
Lovere|BG|24065
Lovero|SO|23030
Lozio|BS|25040
Lozza|VA|21040
Lozzo Atestino|PD|35034
Lozzo di Cadore|BL|32040
Lozzolo|VC|13045
Lu e Cuccaro Monferrato|AL|15037
Lubriano|VT|01020
Lucca|LU|55100|1
Lucca Sicula|AG|92010
Lucera|FG|71036
Lucignano|AR|52046
Lucinasco|IM|18020
Lucito|CB|86030
Luco dei Marsi|AQ|67056
Lucoli|AQ|67045
Lugagnano Val d'Arda|PC|29018
Lugnano in Teverina|TR|05020
Lugo|RA|48022
Lugo di Vicenza|VI|36030
Luino|VA|21016
Luisago|CO|22070
Lula|NU|08020
Lumarzo|GE|16024
Lumezzane|BS|25065
Lunamatrona|VS|09022
Lunano|PU|61026
Lungavilla|PV|27053
Lungro|CS|87010
Luni|SP|19034
Luogosano|AV|83040
Luogosanto|OT|07020
Lupara|CB|86030
Lurago Marinone|CO|22070
Lurago d'Erba|CO|22040
Lurano|BG|24050
Luras|OT|07025
Lurate Caccivio|CO|22075
Lusciano|CE|81030
Luserna|TN|38040
Luserna San Giovanni|TO|10062
Lusernetta|TO|10060
Lusevera|UD|33010
Lusia|RO|45020
Lusiana Conco|VI|36046
Lusigliè|TO|10080
Luson|BZ|39040
Lustra|SA|84050
Luvinate|VA|21020
Luzzana|BG|24069
Luzzara|RE|42045
Luzzi|CS|87040
Maccagno con Pino e Veddasca|VA|21061
Maccastorna|LO|26843
Macchia Valfortore|CB|86040
Macchia d'Isernia|IS|86070
Macchiagodena|IS|86096
Macello|TO|10060
Macerata|MC|62100|1
Macerata Campania|CE|81047
Macerata Feltria|PU|61023
Macherio|MB|20846
Maclodio|BS|25030
Macomer|NU|08015
Macra|CN|12020
Macugnaga|VB|28876
Maddaloni|CE|81024
Madesimo|SO|23024
Madignano|CR|26020
Madone|BG|24040
Madonna del Sasso|VB|28894
Madruzzo|TN|38076
Maenza|LT|04010
Mafalda|CB|86030
Magasa|BS|25080
Magenta|MI|20013
Maggiora|NO|28014
Magherno|PV|27010
Magione|PG|06063
Magisano|CZ|88050
Magliano Alfieri|CN|12050
Magliano Alpi|CN|12060
Magliano Romano|RM|00060
Magliano Sabina|RI|02046
Magliano Vetere|SA|84050
Magliano de' Marsi|AQ|67062
Magliano di Tenna|FM|63832
Magliano in Toscana|GR|58051
Maglie|LE|73024
Magliolo|SV|17020
Maglione|TO|10030
Magnacavallo|MN|46020
Magnago|MI|20020
Magnano|BI|13887
Magnano in Riviera|UD|33010
Magomadas|OR|09090
Magreglio|CO|22030
Magrè sulla strada del vino|BZ|39040
Maida|CZ|88025
Maierato|VV|89843
Maierà|CS|87020
Maiolati Spontini|AN|60030
Maiolo|RN|47862
Maiori|SA|84010
Mairago|LO|26825
Mairano|BS|25030
Maissana|SP|19010
Majano|UD|33030
Malagnino|CR|26030
Malalbergo|BO|40051
Malborghetto Valbruna|UD|33010
Malcesine|VR|37018
Malegno|BS|25053
Maleo|LO|26847
Malesco|VB|28854
Maletto|CT|95035
Malfa|ME|98050
Malgrate|LC|23864
Malito|CS|87030
Mallare|SV|17045
Malles Venosta|BZ|39024
Malnate|VA|21046
Malo|VI|36034
Malonno|BS|25040
Maltignano|AP|63085
Malvagna|ME|98030
Malvicino|AL|15015
Malvito|CS|87010
Malé|TN|38027
Mammola|RC|89045
Mamoiada|NU|08024
Manciano|GR|58014
Mandanici|ME|98020
Mandas|CA|09040
Mandatoriccio|CS|87060
Mandela|RM|00020
Mandello Vitta|NO|28060
Mandello del Lario|LC|23826
Manduria|TA|74024
Manerba del Garda|BS|25080
Manerbio|BS|25025
Manfredonia|FG|71043
Mango|CN|12056
Mangone|CS|87050
Maniace|CT|95050
Maniago|PN|33085
Manocalzati|AV|83030
Manoppello|PE|65024
Mansuè|TV|31040
Manta|CN|12030
Mantello|SO|23016
Mantova|MN|46100|1
Manzano|UD|33044
Manziana|RM|00066
Mapello|BG|24030
Mappano|TO|10079
Mara|SS|07010
Maracalagonis|CA|09069
Maranello|MO|41053
Marano Equo|RM|00020
Marano Lagunare|UD|33050
Marano Marchesato|CS|87040
Marano Principato|CS|87040
Marano Ticino|NO|28040
Marano Vicentino|VI|36035
Marano di Napoli|NA|80016
Marano di Valpolicella|VR|37020
Marano sul Panaro|MO|41054
Maranzana|AT|14040
Maratea|PZ|85046
Marcallo con Casone|MI|20010
Marcaria|MN|46010
Marcedusa|CZ|88050
Marcellina|RM|00010
Marcellinara|CZ|88044
Marcetelli|RI|02020
Marcheno|BS|25060
Marchirolo|VA|21030
Marciana|LI|57030
Marciana Marina|LI|57033
Marcianise|CE|81025
Marciano della Chiana|AR|52047
Marcignago|PV|27020
Marcon|VE|30020
Marebbe|BZ|39030
Marene|CN|12030
Mareno di Piave|TV|31010
Marentino|TO|10020
Maretto|AT|14018
Margarita|CN|12040
Margherita di Savoia|BT|76016
Margno|LC|23832
Mariana Mantovana|MN|46010
Mariano Comense|CO|22066
Mariano del Friuli|GO|34070
Marianopoli|CL|93010
Mariglianella|NA|80030
Marigliano|NA|80034
Marina di Gioiosa Ionica|RC|89046
Marineo|PA|90035
Marino|RM|00047
Marlengo|BZ|39020
Marliana|PT|51010
Marmentino|BS|25060
Marmirolo|MN|46045
Marmora|CN|12020
Marnate|VA|21050
Marone|BS|25054
Maropati|RC|89020
Marostica|VI|36063
Marradi|FI|50034
Marrubiu|OR|09094
Marsaglia|CN|12060
Marsala|TP|91025
Marsciano|PG|06055
Marsico Nuovo|PZ|85052
Marsicovetere|PZ|85050
Marta|VT|01010
Martano|LE|73025
Martellago|VE|30030
Martello|BZ|39020
Martignacco|UD|33035
Martignana di Po|CR|26040
Martignano|LE|73020
Martina Franca|TA|74015
Martinengo|BG|24057
Martiniana Po|CN|12030
Martinsicuro|TE|64014
Martirano|CZ|88040
Martirano Lombardo|CZ|88040
Martis|SS|07030
Martone|RC|89040
Marudo|LO|26866
Maruggio|TA|74020
Marzabotto|BO|40043
Marzano|PV|27010
Marzano Appio|CE|81035
Marzano di Nola|AV|83020
Marzi|CS|87050
Marzio|VA|21030
Masainas|SU|09010
Masate|MI|20060
Mascali|CT|95016
Mascalucia|CT|95030
Maschito|PZ|85020
Masciago Primo|VA|21030
Maser|TV|31010
Masera|VB|28855
Maserada sul Piave|TV|31052
Maserà di Padova|PD|35020
Masi|PD|35040
Masi Torello|FE|44020
Masio|AL|15024
Maslianico|CO|22026
Masone|GE|16010
Massa|MS|54100|1
Massa Fermana|FM|63834
Massa Lombarda|RA|48024
Massa Lubrense|NA|80061
Massa Marittima|GR|58024
Massa Martana|PG|06056
Massa d'Albe|AQ|67050
Massa di Somma|NA|80040
Massa e Cozzile|PT|51010
Massafra|TA|74016
Massalengo|LO|26815
Massanzago|PD|35010
Massarosa|LU|55054
Massazza|BI|13873
Massello|TO|10060
Masserano|BI|13866
Massignano|AP|63061
Massimeno|TN|38086
Massimino|SV|12071
Massino Visconti|NO|28040
Massiola|VB|28895
Masullas|OR|09090
Matelica|MC|62024
Matera|MT|75100|1
Mathi|TO|10075
Matino|LE|73046
Matrice|CB|86030
Mattie|TO|10050
Mattinata|FG|71030
Mazara del Vallo|TP|91026
Mazzano|BS|25080
Mazzano Romano|RM|00060
Mazzarino|CL|93013
Mazzarrone|CT|95040
Mazzarrà Sant'Andrea|ME|98056
Mazzin|TN|38030
Mazzo di Valtellina|SO|23030
Mazzè|TO|10035
Meana Sardo|NU|08030
Meana di Susa|TO|10050
Meda|MB|20821
Mede|PV|27035
Medea|GO|34076
Medesano|PR|43014
Medicina|BO|40059
Mediglia|MI|20076
Medolago|BG|24030
Medole|MN|46046
Medolla|MO|41036
Meduna di Livenza|TV|31040
Meduno|PN|33092
Megliadino San Vitale|PD|35040
Meina|NO|28046
Melara|RO|45037
Melazzo|AL|15010
Meldola|FC|47014
Mele|GE|16010
Melegnano|MI|20077
Melendugno|LE|73026
Meleti|LO|26843
Melfi|PZ|85025
Melicucco|RC|89020
Melicuccà|RC|89020
Melilli|SR|96010
Melissa|KR|88814
Melissano|LE|73040
Melito Irpino|AV|83030
Melito di Napoli|NA|80017
Melito di Porto Salvo|RC|89063
Melizzano|BN|82030
Melle|CN|12020
Mello|SO|23010
Melpignano|LE|73020
Meltina|BZ|39010
Melzo|MI|20066
Menaggio|CO|22017
Menconico|PV|27050
Mendatica|IM|18025
Mendicino|CS|87040
Menfi|AG|92013
Mentana|RM|00013
Meolo|VE|30020
Merana|AL|15010
Merano|BZ|39012
Merate|LC|23807
Mercallo|VA|21020
Mercatello sul Metauro|PU|61040
Mercatino Conca|PU|61013
Mercato San Severino|SA|84085
Mercato Saraceno|FC|47025
Mercenasco|TO|10010
Mercogliano|AV|83013
Mereto di Tomba|UD|33036
Mergo|AN|60030
Mergozzo|VB|28802
Merlara|PD|35040
Merlino|LO|26833
Merone|CO|22046
Merì|ME|98040
Mesagne|BR|72023
Mese|SO|23020
Mesenzana|VA|21030
Mesero|MI|20010
Mesola|FE|44026
Mesoraca|KR|88838
Messina|ME|98121-98129,98131-98139,98141-98149,98151-98158,98161-98168|1
Mestrino|PD|35035
Meta|NA|80062
Mezzago|MB|20883
Mezzana|TN|38020
Mezzana Bigli|PV|27030
Mezzana Mortigliengo|BI|13831
Mezzana Rabattone|PV|27030
Mezzane di Sotto|VR|37030
Mezzanego|GE|16046
Mezzanino|PV|27040
Mezzano|TN|38050
Mezzenile|TO|10070
Mezzocorona|TN|38016
Mezzojuso|PA|90030
Mezzoldo|BG|24010
Mezzolombardo|TN|38017
Mezzomerico|NO|28040
Miagliano|BI|13816
Miane|TV|31050
Miasino|NO|28010
Miazzina|VB|28817
Micigliano|RI|02010
Miggiano|LE|73035
Miglianico|CH|66010
Miglierina|CZ|88040
Miglionico|MT|75010
Mignanego|GE|16018
Mignano Monte Lungo|CE|81049
Milano|MI|20121-20129,20131-20139,20141-20149,20151-20159,20161-20162|1
Milazzo|ME|98057
Milena|CL|93010
Mileto|VV|89852
Milis|OR|09070
Militello Rosmarino|ME|98070
Militello in Val di Catania|CT|95043
Millesimo|SV|17017
Milo|CT|95010
Milzano|BS|25020
Mineo|CT|95044
Minerbe|VR|37046
Minerbio|BO|40061
Minervino Murge|BT|76013
Minervino di Lecce|LE|73027
Minori|SA|84010
Minturno|LT|04026
Minucciano|LU|55034
Mioglia|SV|17040
Mira|VE|30034
Mirabella Eclano|AV|83036
Mirabella Imbaccari|CT|95040
Mirabello Monferrato|AL|15040
Mirabello Sannitico|CB|86010
Miradolo Terme|PV|27010
Miranda|IS|86080
Mirandola|MO|41037
Mirano|VE|30035
Mirto|ME|98070
Misano Adriatico|RN|47843
Misano di Gera d'Adda|BG|24040
Misiliscemi|TP|91031
Misilmeri|PA|90036
Misinto|MB|20826
Missaglia|LC|23873
Missanello|PZ|85010
Misterbianco|CT|95045
Mistretta|ME|98073
Moasca|AT|14050
Moconesi|GE|16047
Modena|MO|41121-41126|1
Modica|RG|97015
Modigliana|FC|47015
Modolo|OR|09090
Modugno|BA|70026
Moena|TN|38035
Moggio|LC|23817
Moggio Udinese|UD|33015
Moglia|MN|46024
Mogliano|MC|62010
Mogliano Veneto|TV|31021
Mogorella|OR|09080
Mogoro|OR|09095
Moiano|BN|82010
Moimacco|UD|33040
Moio Alcantara|ME|98030
Moio de' Calvi|BG|24010
Moio della Civitella|SA|84060
Moiola|CN|12010
Mola di Bari|BA|70042
Molare|AL|15074
Molazzana|LU|55020
Molfetta|BA|70056
Molina Aterno|AQ|67020
Molinara|BN|82020
Molinella|BO|40062
Molini di Triora|IM|18010
Molino dei Torti|AL|15050
Molise|CB|86020
Moliterno|PZ|85047
Mollia|VC|13020
Molochio|RC|89010
Molteno|LC|23847
Moltrasio|CO|22010
Molveno|TN|38018
Mombaldone|AT|14050
Mombarcaro|CN|12070
Mombaroccio|PU|61024
Mombaruzzo|AT|14046
Mombasiglio|CN|12070
Mombello Monferrato|AL|15020
Mombello di Torino|TO|10020
Mombercelli|AT|14047
Momo|NO|28015
Mompantero|TO|10059
Mompeo|RI|02040
Momperone|AL|15050
Monacilioni|CB|86040
Monale|AT|14013
Monasterace|RC|89040
Monastero Bormida|AT|14058
Monastero di Lanzo|TO|10070
Monastero di Vasco|CN|12080
Monasterolo Casotto|CN|12080
Monasterolo del Castello|BG|24060
Monasterolo di Savigliano|CN|12030
Monastier di Treviso|TV|31050
Monastir|CA|09023
Moncalieri|TO|10024
Moncalvo|AT|14036
Moncenisio|TO|10050
Moncestino|AL|15020
Monchiero|CN|12060
Monchio delle Corti|PR|43010
Moncrivello|VC|13040
Moncucco Torinese|AT|14024
Mondaino|RN|47836
Mondavio|PU|61040
Mondolfo|PU|61037
Mondovì|CN|12084
Mondragone|CE|81034
Moneglia|GE|16030
Monesiglio|CN|12077
Monfalcone|GO|34074
Monforte San Giorgio|ME|98041
Monforte d'Alba|CN|12065
Monfumo|TV|31010
Mongardino|AT|14040
Monghidoro|BO|40063
Mongiana|VV|89823
Mongiardino Ligure|AL|15060
Mongiuffi Melia|ME|98030
Mongrando|BI|13888
Mongrassano|CS|87040
Monguelfo-Tesido|BZ|39035
Monguzzo|CO|22040
Moniga del Garda|BS|25080
Monleale|AL|15059
Monno|BS|25040
Monopoli|BA|70043
Monreale|PA|90046
Monrupino|TS|34016
Monsampietro Morico|FM|63842
Monsampolo del Tronto|AP|63077
Monsano|AN|60030
Monselice|PD|35043
Monserrato|CA|09042
Monsummano Terme|PT|51015
Montabone|AT|14040
Montacuto|AL|15050
Montafia|AT|14014
Montagano|CB|86023
Montagna in Valtellina|SO|23020
Montagna sulla strada del vino|BZ|39040
Montagnana|PD|35044
Montagnareale|ME|98060
Montaguto|AV|83030
Montaione|FI|50050
Montalbano Elicona|ME|98065
Montalbano Jonico|MT|75023
Montalcino|SI|53024
Montaldeo|AL|15060
Montaldo Bormida|AL|15010
Montaldo Roero|CN|12040
Montaldo Scarampi|AT|14048
Montaldo Torinese|TO|10020
Montaldo di Mondovì|CN|12080
Montale|PT|51037
Montalenghe|TO|10090
Montallegro|AG|92010
Montalto Carpasio|IM|18028
Montalto Dora|TO|10016
Montalto Pavese|PV|27040,27063
Montalto Uffugo|CS|87046
Montalto delle Marche|AP|63068
Montalto di Castro|VT|01014
Montanaro|TO|10017
Montanaso Lombardo|LO|26836
Montanera|CN|12040
Montano Antilia|SA|84060
Montano Lucino|CO|22070
Montappone|FM|63835
Montaquila|IS|86070
Montasola|RI|02040
Montauro|CZ|88060
Montazzoli|CH|66030
Monte Argentario|GR|58019
Monte Castello di Vibio|PG|06057
Monte Cavallo|MC|62036
Monte Cerignone|PU|61010
Monte Compatri|RM|00077
Monte Cremasco|CR|26010
Monte Giberto|FM|63846
Monte Grimano Terme|PU|61010
Monte Isola|BS|25050
Monte Marenzo|LC|23804
Monte Porzio|PU|61040
Monte Porzio Catone|RM|00078
Monte Rinaldo|FM|63852
Monte Roberto|AN|60030
Monte Romano|VT|01010
Monte San Biagio|LT|04020
Monte San Giacomo|SA|84030
Monte San Giovanni Campano|FR|03025
Monte San Giovanni in Sabina|RI|02040
Monte San Giusto|MC|62015
Monte San Martino|MC|62020
Monte San Pietrangeli|FM|63815
Monte San Pietro|BO|40050
Monte San Savino|AR|52048
Monte San Vito|AN|60037
Monte Sant'Angelo|FG|71037
Monte Santa Maria Tiberina|PG|06010
Monte Urano|FM|63813
Monte Vidon Combatte|FM|63847
Monte Vidon Corrado|FM|63836
Monte di Malo|VI|36030
Monte di Procida|NA|80070
Montebello Jonico|RC|89064
Montebello Vicentino|VI|36054
Montebello della Battaglia|PV|27054
Montebello di Bertona|PE|65010
Montebello sul Sangro|CH|66040
Montebelluna|TV|31044
Montebruno|GE|16025
Montebuono|RI|02040
Montecalvo Irpino|AV|83037
Montecalvo Versiggia|PV|27047
Montecalvo in Foglia|PU|61020
Montecarlo|LU|55015
Montecarotto|AN|60036
Montecassiano|MC|62010
Montecastello|AL|15040
Montecastrilli|TR|05026
Montecatini Val di Cecina|PI|56040
Montecatini-Terme|PT|51016
Montecchia di Crosara|VR|37030
Montecchio|TR|05020
Montecchio Emilia|RE|42027
Montecchio Maggiore|VI|36075
Montecchio Precalcino|VI|36030
Montechiaro d'Acqui|AL|15010
Montechiaro d'Asti|AT|14025
Montechiarugolo|PR|43022
Montecilfone|CB|86032
Montecopiolo|RN|47868
Montecorice|SA|84060
Montecorvino Pugliano|SA|84090
Montecorvino Rovella|SA|84096
Montecosaro|MC|62010
Montecrestese|VB|28864
Montecreto|MO|41025
Montedinove|AP|63069
Montedoro|CL|93010
Montefalcione|AV|83030
Montefalco|PG|06036
Montefalcone Appennino|FM|63855
Montefalcone di Val Fortore|BN|82025
Montefalcone nel Sannio|CB|86033
Montefano|MC|62010
Montefelcino|PU|61030
Monteferrante|CH|66040
Montefiascone|VT|01027
Montefino|TE|64030
Montefiore Conca|RN|47834
Montefiore dell'Aso|AP|63062
Montefiorino|MO|41045
Monteflavio|RM|00010
Monteforte Cilento|SA|84060
Monteforte Irpino|AV|83024
Monteforte d'Alpone|VR|37032
Montefortino|FM|63858
Montefranco|TR|05030
Montefredane|AV|83030
Montefusco|AV|83030
Montegabbione|TR|05010
Montegalda|VI|36047
Montegaldella|VI|36047
Montegallo|AP|63094
Montegioco|AL|15050
Montegiordano|CS|87070
Montegiorgio|FM|63833
Montegranaro|FM|63812
Montegridolfo|RN|47837
Montegrino Valtravaglia|VA|21010
Montegrosso Pian Latte|IM|18025
Montegrosso d'Asti|AT|14048
Montegrotto Terme|PD|35036
Monteiasi|TA|74020
Montelabbate|PU|61025
Montelanico|RM|00030
Montelapiano|CH|66040
Monteleone Rocca Doria|SS|07010
Monteleone Sabino|RI|02033
Monteleone d'Orvieto|TR|05017
Monteleone di Fermo|FM|63841
Monteleone di Puglia|FG|71020
Monteleone di Spoleto|PG|06045
Montelepre|PA|90086
Montelibretti|RM|00010
Montella|AV|83048
Montello|BG|24060
Montelongo|CB|86040
Montelparo|FM|63853
Montelupo Albese|CN|12050
Montelupo Fiorentino|FI|50056
Montelupone|MC|62010
Montemaggiore Belsito|PA|90020
Montemagno Monferrato|AT|14030
Montemale di Cuneo|CN|12025
Montemarano|AV|83040
Montemarciano|AN|60018
Montemarzino|AL|15050
Montemesola|TA|74020
Montemezzo|CO|22010
Montemignaio|AR|52010
Montemiletto|AV|83038
Montemilone|PZ|85020
Montemitro|CB|86030
Montemonaco|AP|63088
Montemurlo|PO|59013
Montemurro|PZ|85053
Montenars|UD|33010
Montenero Sabino|RI|02040
Montenero Val Cocchiara|IS|86080
Montenero di Bisaccia|CB|86036
Montenerodomo|CH|66010
Monteodorisio|CH|66050
Montepaone|CZ|88060
Monteparano|TA|74020
Monteprandone|AP|63076
Montepulciano|SI|53045
Monterchi|AR|52035
Montereale|AQ|67015
Montereale Valcellina|PN|33086
Monterenzio|BO|40050
Monteriggioni|SI|53035
Monteroduni|IS|86075
Monteroni d'Arbia|SI|53014
Monteroni di Lecce|LE|73047
Monterosi|VT|01030
Monterosso Almo|RG|97010
Monterosso Calabro|VV|89819
Monterosso Grana|CN|12020
Monterosso al Mare|SP|19016
Monterotondo|RM|00015
Monterotondo Marittimo|GR|58025
Monterubbiano|FM|63825
Montesano Salentino|LE|73030
Montesano sulla Marcellana|SA|84033
Montesarchio|BN|82016
Montescaglioso|MT|75024
Montescano|PV|27040
Montescheno|VB|28843
Montescudaio|PI|56040
Montescudo-Monte Colombo|RN|47854
Montese|MO|41055
Montesegale|PV|27052
Montesilvano|PE|65015
Montespertoli|FI|50025
Monteu Roero|CN|12040
Monteu da Po|TO|10020
Montevago|AG|92038
Montevarchi|AR|52025
Montevecchia|LC|23874
Monteverde|AV|83049
Monteverdi Marittimo|PI|56040
Monteviale|VI|36050
Montezemolo|CN|12070
Monti|OT|07020
Montiano|FC|47020
Monticelli Brusati|BS|25040
Monticelli Pavese|PV|27010
Monticelli d'Ongina|PC|29010
Monticello Brianza|LC|23876
Monticello Conte Otto|VI|36010
Monticello d'Alba|CN|12066
Montichiari|BS|25018
Monticiano|SI|53015
Montieri|GR|58026
Montiglio Monferrato|AT|14026
Montignoso|MS|54038
Montirone|BS|25010
Montjovet|AO|11020
Montodine|CR|26010
Montoggio|GE|16026
Montone|PG|06014
Montopoli di Sabina|RI|02034
Montopoli in Val d'Arno|PI|56020
Montorfano|CO|22030
Montorio Romano|RM|00010
Montorio al Vomano|TE|64046
Montorio nei Frentani|CB|86040
Montoro|AV|83025
Montorso Vicentino|VI|36050
Montottone|FM|63843
Montresta|OR|09090
Montà|CN|12046
Montù Beccaria|PV|27040
Monvalle|VA|21020
Monza|MB|20900|1
Monzambano|MN|46040
Monzuno|BO|40036
Morano Calabro|CS|87016
Morano sul Po|AL|15025
Moransengo-Tonengo|AT|14027
Moraro|GO|34070
Morazzone|VA|21040
Morbegno|SO|23017
Morbello|AL|15010
Morciano di Leuca|LE|73040
Morciano di Romagna|RN|47833
Morcone|BN|82026
Mordano|BO|40027
Morengo|BG|24050
Mores|SS|07013
Moresco|FM|63826
Moretta|CN|12033
Morfasso|PC|29020
Morgano|TV|31050
Morgex|AO|11017
Morgongiori|OR|09090
Mori|TN|38065
Moriago della Battaglia|TV|31010
Moricone|RM|00010
Morigerati|SA|84030
Morimondo|MI|20081
Morino|AQ|67050
Moriondo Torinese|TO|10020
Morlupo|RM|00067
Mormanno|CS|87026
Mornago|VA|21020
Mornese|AL|15075
Mornico Losana|PV|27040
Mornico al Serio|BG|24050
Morolo|FR|03017
Morozzo|CN|12040
Morra De Sanctis|AV|83040
Morro Reatino|RI|02010
Morro d'Alba|AN|60030
Morro d'Oro|TE|64020
Morrone del Sannio|CB|86040
Morrovalle|MC|62010
Morsano al Tagliamento|PN|33075
Morsasco|AL|15010
Mortara|PV|27036
Mortegliano|UD|33050
Morterone|LC|23811
Moruzzo|UD|33030
Moscazzano|CR|26010
Moschiano|AV|83020
Mosciano Sant'Angelo|TE|64023
Moscufo|PE|65010
Moso in Passiria|BZ|39013
Mossa|GO|34070
Motta Baluffi|CR|26045
Motta Camastra|ME|98030
Motta Montecorvino|FG|71030
Motta San Giovanni|RC|89065
Motta Sant'Anastasia|CT|95062
Motta Santa Lucia|CZ|88040
Motta Visconti|MI|20086
Motta d'Affermo|ME|98070
Motta de' Conti|VC|13010
Motta di Livenza|TV|31045
Mottafollone|CS|87010
Mottalciata|BI|13874
Motteggiana|MN|46020
Mottola|TA|74017
Mozzagrogna|CH|66030
Mozzanica|BG|24050
Mozzate|CO|22076
Mozzecane|VR|37060
Mozzo|BG|24030
Muccia|MC|62034
Muggia|TS|34015
Muggiò|MB|20835
Mugnano del Cardinale|AV|83027
Mugnano di Napoli|NA|80018
Mulazzano|LO|26837
Mulazzo|MS|54026
Mura|BS|25070
Muravera|CA|09043
Murazzano|CN|12060
Murello|CN|12030
Murialdo|SV|17013
Murisengo Monferrato|AL|15020
Murlo|SI|53016
Muro Leccese|LE|73036
Muro Lucano|PZ|85054
Muros|SS|07030
Muscoline|BS|25080
Musei|SU|09010
Musile di Piave|VE|30024
Musso|CO|22010
Mussolente|VI|36065
Mussomeli|CL|93014
Muzzana del Turgnano|UD|33055
Muzzano|BI|13895
Nago-Torbole|TN|38069
Nalles|BZ|39010
Napoli|NA|80121-80129,80131-80139,80141-80147|1
Narbolia|OR|09070
Narcao|SU|09010
Nardodipace|VV|89824
Nardò|LE|73048
Narni|TR|05035
Naro|AG|92028
Narzole|CN|12068
Nasino|SV|17030
Naso|ME|98074
Naturno|BZ|39025
Nave|BS|25075
Navelli|AQ|67020
Naz-Sciaves|BZ|39040
Nazzano|RM|00060
Ne|GE|16040
Nebbiuno|NO|28010
Negrar di Valpolicella|VR|37024
Neirone|GE|16040
Neive|CN|12052
Nembro|BG|24027
Nemi|RM|00074
Nemoli|PZ|85040
Neoneli|OR|09080
Nepi|VT|01036
Nereto|TE|64015
Nerola|RM|00017
Nervesa della Battaglia|TV|31040
Nerviano|MI|20014
Nespolo|RI|02020
Nesso|CO|22020
Netro|BI|13896
Nettuno|RM|00048
Neviano|LE|73040
Neviano degli Arduini|PR|43024
Neviglie|CN|12050
Niardo|BS|25050
Nibbiola|NO|28070
Nibionno|LC|23895
Nichelino|TO|10042
Nicolosi|CT|95052
Nicorvo|PV|27020
Nicosia|EN|94014
Nicotera|VV|89844
Niella Belbo|CN|12050
Niella Tanaro|CN|12060
Nimis|UD|33045
Niscemi|CL|93015
Nissoria|EN|94010
Nizza Monferrato|AT|14049
Nizza di Sicilia|ME|98026
Noale|VE|30033
Noasca|TO|10080
Nocara|CS|87070
Nocciano|PE|65010
Nocera Inferiore|SA|84014
Nocera Superiore|SA|84015
Nocera Terinese|CZ|88047
Nocera Umbra|PG|06025
Noceto|PR|43015
Noci|BA|70015
Nociglia|LE|73020
Noepoli|PZ|85035
Nogara|VR|37054
Nogaredo|TN|38060
Nogarole Rocca|VR|37060
Nogarole Vicentino|VI|36070
Noicattaro|BA|70016
Nola|NA|80035
Nole|TO|10076
Noli|SV|17026
Nomaglio|TO|10010
Nomi|TN|38060
Nonantola|MO|41015
None|TO|10060
Nonio|VB|28891
Noragugume|NU|08010
Norbello|OR|09070
Norcia|PG|06046
Norma|LT|04010
Nosate|MI|20020
Notaresco|TE|64024
Noto|SR|96017
Nova Levante|BZ|39056
Nova Milanese|MB|20834
Nova Ponente|BZ|39050
Nova Siri|MT|75020
Novafeltria|RN|47863
Novaledo|TN|38050
Novalesa|TO|10050
Novara|NO|28100|1
Novara di Sicilia|ME|98058
Novate Mezzola|SO|23025
Novate Milanese|MI|20026
Nove|VI|36055
Novedrate|CO|22060
Novella|TN|38028
Novellara|RE|42017
Novello|CN|12060
Noventa Padovana|PD|35027
Noventa Vicentina|VI|36025
Noventa di Piave|VE|30020
Novi Ligure|AL|15067
Novi Velia|SA|84060
Novi di Modena|MO|41016
Noviglio|MI|20082
Novoli|LE|73051
Nucetto|CN|12070
Nughedu San Nicolò|SS|07010
Nughedu Santa Vittoria|OR|09080
Nule|SS|07010
Nulvi|SS|07032
Numana|AN|60026
Nuoro|NU|08100|1
Nurachi|OR|09070
Nuragus|CA|09057
Nurallao|CA|09058
Nuraminis|CA|09024
Nureci|OR|09080
Nurri|CA|09059
Nus|AO|11020
Nusco|AV|83051
Nuvolento|BS|25080
Nuvolera|BS|25080
Nuxis|SU|09010
Occhieppo Inferiore|BI|13897
Occhieppo Superiore|BI|13898
Occhiobello|RO|45030
Occimiano|AL|15040
Ocre|AQ|67040
Odalengo Grande|AL|15020
Odalengo Piccolo|AL|15020
Oderzo|TV|31046
Odolo|BS|25076
Ofena|AQ|67025
Offagna|AN|60020
Offanengo|CR|26010
Offida|AP|63073
Offlaga|BS|25020
Oggebbio|VB|28824
Oggiona con Santo Stefano|VA|21040
Oggiono|LC|23848
Oglianico|TO|10080
Ogliastro Cilento|SA|84061
Olbia|OT|07026|1
Olcenengo|VC|13047
Oldenico|VC|13030
Oleggio|NO|28047
Oleggio Castello|NO|28040
Olevano Romano|RM|00035
Olevano di Lomellina|PV|27020
Olevano sul Tusciano|SA|84062
Olgiate Comasco|CO|22077
Olgiate Molgora|LC|23887
Olgiate Olona|VA|21057
Olginate|LC|23854
Oliena|NU|08025
Oliva Gessi|PV|27050
Olivadi|CZ|88067
Oliveri|ME|98060
Oliveto Citra|SA|84020
Oliveto Lario|LC|23865
Oliveto Lucano|MT|75010
Olivetta San Michele|IM|18030
Olivola|AL|15030
Ollastra|OR|09088
Ollolai|NU|08020
Ollomont|AO|11010
Olmedo|SS|07040
Olmeneta|CR|26010
Olmo Gentile|AT|14050
Olmo al Brembo|BG|24010
Oltre il Colle|BG|24013
Oltressenda Alta|BG|24020
Oltrona di San Mamette|CO|22070
Olzai|NU|08020
Ome|BS|25050
Omegna|VB|28887
Omignano|SA|84060
Onano|VT|01010
Onanì|NU|08020
Oncino|CN|12030
Oneta|BG|24020
Onifai|NU|08020
Oniferi|NU|08020
Ono San Pietro|BS|25040
Onore|BG|24020
Onzo|SV|17037
Opera|MI|20073
Opi|AQ|67030
Oppeano|VR|37050
Oppido Lucano|PZ|85015
Oppido Mamertina|RC|89014
Ora|BZ|39040
Orani|NU|08026
Oratino|CB|86010
Orbassano|TO|10043
Orbetello|GR|58015
Orciano Pisano|PI|56040
Orco Feglino|SV|17024
Ordona|FG|71040
Orero|GE|16040
Orgiano|VI|36040
Orgosolo|NU|08027
Oria|BR|72024
Oricola|AQ|67063
Origgio|VA|21040
Orino|VA|21030
Orio Canavese|TO|10010
Orio Litta|LO|26863
Orio al Serio|BG|24050
Oriolo|CS|87073
Oriolo Romano|VT|01010
Oristano|OR|09170|1
Ormea|CN|12078
Ormelle|TV|31024
Ornago|MB|20876
Ornavasso|VB|28877
Ornica|BG|24010
Orosei|NU|08028
Orotelli|NU|08020
Orria|SA|84060
Orroli|CA|09061
Orsago|TV|31010
Orsara Bormida|AL|15010
Orsara di Puglia|FG|71027
Orsenigo|CO|22030
Orsogna|CH|66036
Orsomarso|CS|87020
Orta Nova|FG|71045
Orta San Giulio|NO|28016
Orta di Atella|CE|81030
Ortacesus|CA|09040
Orte|VT|01028
Ortelle|LE|73030
Ortezzano|FM|63851
Ortignano Raggiolo|AR|52010
Ortisei|BZ|39046
Ortona|CH|66026
Ortona dei Marsi|AQ|67050
Ortovero|SV|17037
Ortucchio|AQ|67050
Ortueri|NU|08036
Orune|NU|08020
Orvieto|TR|05018
Orvinio|RI|02035
Orzinuovi|BS|25034
Orzivecchi|BS|25030
Osasco|TO|10060
Osasio|TO|10040
Oschiri|OT|07027
Osidda|NU|08020
Osiglia|SV|17010
Osilo|SS|07033
Osimo|AN|60027
Osini|OG|08040
Osio Sopra|BG|24040
Osio Sotto|BG|24046
Osnago|LC|23875
Osoppo|UD|33010
Ospedaletti|IM|18014
Ospedaletto|TN|38050
Ospedaletto Euganeo|PD|35045
Ospedaletto Lodigiano|LO|26864
Ospedaletto d'Alpinolo|AV|83014
Ospitale di Cadore|BL|32010
Ospitaletto|BS|25035
Ossago Lodigiano|LO|26816
Ossana|TN|38026
Ossi|SS|07045
Ossimo|BS|25050
Ossona|MI|20002
Ostana|CN|12030
Ostellato|FE|44020
Ostiano|CR|26032
Ostiglia|MN|46035
Ostra|AN|60010
Ostra Vetere|AN|60010
Ostuni|BR|72017
Otranto|LE|73028
Otricoli|TR|05030
Ottana|NU|08020
Ottati|SA|84020
Ottaviano|NA|80044
Ottiglio|AL|15038
Ottobiano|PV|27030
Ottone|PC|29026
Oulx|TO|10056
Ovada|AL|15076
Ovaro|UD|33025
Oviglio|AL|15026
Ovindoli|AQ|67046
Ovodda|NU|08020
Oyace|AO|11010
Ozegna|TO|10080
Ozieri|SS|07014
Ozzano Monferrato|AL|15039
Ozzano dell'Emilia|BO|40064
Ozzero|MI|20080
Pabillonis|VS|09030
Pace del Mela|ME|98042
Paceco|TP|91027
Pacentro|AQ|67030
Pachino|SR|96018
Paciano|PG|06060
Padenghe sul Garda|BS|25080
Paderna|AL|15050
Paderno Dugnano|MI|20037
Paderno Franciacorta|BS|25050
Paderno Ponchielli|CR|26024
Paderno d'Adda|LC|23877
Padova|PD|35121-35129,35131-35139,35141-35143|1
Padria|SS|07015
Padru|OT|07020
Padula|SA|84034
Paduli|BN|82020
Paesana|CN|12034
Paese|TV|31038
Pagani|SA|84016
Paganico Sabino|RI|02020
Pagazzano|BG|24040
Pagliara|ME|98020
Paglieta|CH|66020
Pagnacco|UD|33010
Pagno|CN|12030
Pagnona|LC|23833
Pago Veiano|BN|82020
Pago del Vallo di Lauro|AV|83020
Paisco Loveno|BS|25050
Paitone|BS|25080
Paladina|BG|24030
Palagano|MO|41046
Palagianello|TA|74018
Palagiano|TA|74019
Palagonia|CT|95046
Palaia|PI|56036
Palanzano|PR|43025
Palata|CB|86037
Palau|OT|07020
Palazzago|BG|24030
Palazzo Adriano|PA|90030
Palazzo Canavese|TO|10010
Palazzo Pignano|CR|26020
Palazzo San Gervasio|PZ|85026
Palazzolo Acreide|SR|96010
Palazzolo Vercellese|VC|13040
Palazzolo dello Stella|UD|33056
Palazzolo sull'Oglio|BS|25036
Palazzuolo sul Senio|FI|50035
Palena|CH|66017
Palermiti|CZ|88050
Palermo|PA|90121,90123-90129,90131,90133-90136,90138-90139,90141-90147,90149,90151|1
Palestrina|RM|00036
Palestro|PV|27030
Paliano|FR|03018
Palizzi|RC|89038
Pallagorio|KR|88818
Pallanzeno|VB|28884
Pallare|SV|17043
Palma Campania|NA|80036
Palma di Montechiaro|AG|92044
Palmanova|UD|33057
Palmariggi|LE|73020
Palmas Arborea|OR|09090
Palmi|RC|89015
Palmiano|AP|63092
Palmoli|CH|66050
Palo del Colle|BA|70027
Palombara Sabina|RM|00018
Palombaro|CH|66010
Palomonte|SA|84020
Palosco|BG|24050
Paludi|CS|87060
Paluzza|UD|33026
Palù|VR|37050
Palù del Fersina|TN|38050
Pamparato|CN|12087
Pancalieri|TO|10060
Pancarana|PV|27050
Panchià|TN|38030
Pandino|CR|26025
Panettieri|CS|87050
Panicale|PG|06064
Pannarano|BN|82017
Panni|FG|71020
Pantelleria|TP|91017
Pantigliate|MI|20048
Paola|CS|87027
Paolisi|BN|82011
Papasidero|CS|87020
Papozze|RO|45010
Parabiago|MI|20015
Parabita|LE|73052
Paratico|BS|25030
Parcines|BZ|39020
Parella|TO|10010
Parenti|CS|87040
Parete|CE|81030
Pareto|AL|15010
Parghelia|VV|89861
Parlasco|LC|23837
Parma|PR|43121-43126|1
Parodi Ligure|AL|15060
Paroldo|CN|12070
Parolise|AV|83050
Parona|PV|27020
Parrano|TR|05010
Parre|BG|24020
Partanna|TP|91028
Partinico|PA|90047
Paruzzaro|NO|28040
Parzanica|BG|24060
Pasian di Prato|UD|33037
Pasiano di Pordenone|PN|33087
Paspardo|BS|25050
Passerano Marmorito|AT|14020
Passignano sul Trasimeno|PG|06065
Passirano|BS|25050
Pastena|FR|03020
Pastorano|CE|81050
Pastrengo|VR|37010
Pasturana|AL|15060
Pasturo|LC|23818
Paterno|PZ|85050
Paterno Calabro|CS|87040
Paternopoli|AV|83052
Paternò|CT|95047
Patrica|FR|03010
Pattada|SS|07016
Patti|ME|98066
Patù|LE|73053
Pau|OR|09090
Paularo|UD|33027
Pauli Arbarei|VS|09020
Paulilatino|OR|09070
Paullo|MI|20067
Paupisi|BN|82030
Pavarolo|TO|10020
Pavia|PV|27100|1
Pavia di Udine|UD|33050
Pavone Canavese|TO|10018
Pavone del Mella|BS|25020
Pavullo nel Frignano|MO|41026
Pazzano|RC|89040
Peccioli|PI|56037
Pecetto Torinese|TO|10020
Pecetto di Valenza|AL|15040
Pedara|CT|95053
Pedaso|FM|63827
Pedavena|BL|32034
Pedemonte|VI|36040
Pederobba|TV|31040
Pedesina|SO|23010
Pedivigliano|CS|87050
Pedrengo|BG|24066
Peglio|CO|22010
Peglio|PU|61049
Pegognaga|MN|46020
Peia|BG|24020
Peio|TN|38024
Pelago|FI|50060
Pella|NO|28010
Pellegrino Parmense|PR|43047
Pellezzano|SA|84080
Pellizzano|TN|38020
Pelugo|TN|38079
Penango|AT|14030
Penna San Giovanni|MC|62020
Penna Sant'Andrea|TE|64039
Penna in Teverina|TR|05028
Pennabilli|RN|47864
Pennadomo|CH|66040
Pennapiedimonte|CH|66010
Penne|PE|65017
Pentone|CZ|88050
Perano|CH|66040
Perarolo di Cadore|BL|32010
Perca|BZ|39030
Percile|RM|00020
Perdasdefogu|OG|08046
Perdaxius|SU|09010
Perdifumo|SA|84060
Pereto|AQ|67064
Perfugas|SS|07034
Pergine Valsugana|TN|38057
Pergola|PU|61045
Perinaldo|IM|18032
Perito|SA|84060
Perledo|LC|23828
Perletto|CN|12070
Perlo|CN|12070
Perloz|AO|11020
Pernumia|PD|35020
Pero|MI|20016
Perosa Argentina|TO|10063
Perosa Canavese|TO|10010
Perrero|TO|10060
Persico Dosimo|CR|26043
Pertengo|VC|13030
Pertica Alta|BS|25070
Pertica Bassa|BS|25078
Pertosa|SA|84030
Pertusio|TO|10080
Perugia|PG|06121-06129,06131-06135|1
Pesaro|PU|61121-61122|1
Pescaglia|LU|55064
Pescantina|VR|37026
Pescara|PE|65121-65129|1
Pescarolo ed Uniti|CR|26033
Pescasseroli|AQ|67032
Pescate|LC|23855
Pesche|IS|86090
Peschici|FG|71010
Peschiera Borromeo|MI|20068
Peschiera del Garda|VR|37019
Pescia|PT|51017
Pescina|AQ|67057
Pesco Sannita|BN|82020
Pescocostanzo|AQ|67033
Pescolanciano|IS|86097
Pescopagano|PZ|85020
Pescopennataro|IS|86080
Pescorocchiano|RI|02024
Pescosansonesco|PE|65020
Pescosolido|FR|03030
Pessano con Bornago|MI|20042
Pessina Cremonese|CR|26030
Pessinetto|TO|10070
Petacciato|CB|86038
Petilia Policastro|KR|88837
Petina|SA|84020
Petralia Soprana|PA|90026
Petralia Sottana|PA|90027
Petrella Salto|RI|02025
Petrella Tifernina|CB|86024
Petriano|PU|61020
Petriolo|MC|62014
Petritoli|FM|63848
Petrizzi|CZ|88060
Petronà|CZ|88050
Petrosino|TP|91032
Petruro Irpino|AV|83010
Pettenasco|NO|28028
Pettinengo|BI|13843
Pettineo|ME|98070
Pettoranello del Molise|IS|86090
Pettorano sul Gizio|AQ|67034
Pettorazza Grimani|RO|45010
Peveragno|CN|12016
Pezzana|VC|13010
Pezzaze|BS|25060
Pezzolo Valle Uzzone|CN|12070
Piacenza|PC|29121-29122|1
Piacenza d'Adige|PD|35040
Piadena Drizzona|CR|26034
Piaggine|SA|84065
Pian Camuno|BS|25050
Piana Crixia|SV|17058
Piana degli Albanesi|PA|90037
Piana di Monte Verna|CE|81013
Piancastagnaio|SI|53025
Piancogno|BS|25052
Piandimeleto|PU|61026
Piane Crati|CS|87050
Pianella|PE|65019
Pianello Val Tidone|PC|29010
Pianello del Lario|CO|22010
Pianengo|CR|26010
Pianezza|TO|10044
Pianezze|VI|36060
Pianfei|CN|12080
Pianico|BG|24060
Pianiga|VE|30030
Piano di Sorrento|NA|80063
Pianopoli|CZ|88040
Pianoro|BO|40065
Piansano|VT|01010
Piantedo|SO|23010
Piario|BG|24020
Piasco|CN|12026
Piateda|SO|23020
Piatto|BI|13844
Piazza Armerina|EN|94015
Piazza Brembana|BG|24014
Piazza al Serchio|LU|55035
Piazzatorre|BG|24010
Piazzola sul Brenta|PD|35016
Piazzolo|BG|24010
Picciano|PE|65010
Picerno|PZ|85055
Picinisco|FR|03040
Pico|FR|03020
Piea|AT|14020
Piedicavallo|BI|13812
Piedimonte Etneo|CT|95017
Piedimonte Matese|CE|81016
Piedimonte San Germano|FR|03030
Piedimulera|VB|28885
Piegaro|PG|06066
Pienza|SI|53026
Pieranica|CR|26017
Pietra Ligure|SV|17027
Pietra Marazzi|AL|15040
Pietra de' Giorgi|PV|27040
Pietrabbondante|IS|86085
Pietrabruna|IM|18010
Pietracamela|TE|64047
Pietracatella|CB|86040
Pietracupa|CB|86020
Pietradefusi|AV|83030
Pietraferrazzana|CH|66040
Pietrafitta|CS|87050
Pietragalla|PZ|85016
Pietralunga|PG|06026
Pietramelara|CE|81051
Pietramontecorvino|FG|71038
Pietranico|PE|65020
Pietrapaola|CS|87060
Pietrapertosa|PZ|85010
Pietraperzia|EN|94016
Pietraporzio|CN|12010
Pietraroja|BN|82030
Pietrarubbia|PU|61023
Pietrasanta|LU|55045
Pietrastornina|AV|83015
Pietravairano|CE|81040
Pietrelcina|BN|82020
Pieve Albignola|PV|27030
Pieve Emanuele|MI|20072
Pieve Fissiraga|LO|26854
Pieve Fosciana|LU|55036
Pieve Ligure|GE|16031
Pieve Porto Morone|PV|27017
Pieve San Giacomo|CR|26035
Pieve Santo Stefano|AR|52036
Pieve Tesino|TN|38050
Pieve Torina|MC|62036
Pieve Vergonte|VB|28886
Pieve a Nievole|PT|51018
Pieve d'Olmi|CR|26040
Pieve del Cairo|PV|27037
Pieve del Grappa|TV|31017
Pieve di Bono-Prezzo|TN|38085
Pieve di Cadore|BL|32044
Pieve di Cento|BO|40066
Pieve di Soligo|TV|31053
Pieve di Teco|IM|18026
Pievepelago|MO|41027
Piglio|FR|03010
Pigna|IM|18037
Pignataro Interamna|FR|03040
Pignataro Maggiore|CE|81052
Pignola|PZ|85010
Pignone|SP|19020
Pigra|CO|22020
Pila|VC|13020
Pimentel|CA|09006
Pimonte|NA|80050
Pinarolo Po|PV|27040
Pinasca|TO|10060
Pincara|RO|45020
Pinerolo|TO|10064
Pineto|TE|64025
Pino Torinese|TO|10025
Pino d'Asti|AT|14020
Pinzano al Tagliamento|PN|33094
Pinzolo|TN|38086
Piobbico|PU|61046
Piobesi Torinese|TO|10040
Piobesi d'Alba|CN|12040
Piode|VC|13020
Pioltello|MI|20096
Piombino|LI|57025
Piombino Dese|PD|35017
Pioraco|MC|62025
Piossasco|TO|10045
Piove di Sacco|PD|35028
Piovene Rocchette|VI|36013
Piovà Massaia|AT|14026
Piozzano|PC|29010
Piozzo|CN|12060
Piraino|ME|98060
Pisa|PI|56121-56128|1
Pisano|NO|28010
Piscina|TO|10060
Piscinas|SU|09010
Pisciotta|SA|84066
Pisogne|BS|25055
Pisoniano|RM|00020
Pisticci|MT|75015
Pistoia|PT|51100|1
Pitigliano|GR|58017
Piubega|MN|46040
Piuro|SO|23020
Piverone|TO|10010
Pizzale|PV|27050
Pizzighettone|CR|26026
Pizzo|VV|89812
Pizzoferrato|CH|66040
Pizzoli|AQ|67017
Pizzone|IS|86071
Pizzoni|VV|89834
Placanica|RC|89040
Plataci|CS|87070
Platania|CZ|88040
Platì|RC|89039
Plaus|BZ|39025
Plesio|CO|22010
Ploaghe|SS|07017
Plodio|SV|17043
Pocapaglia|CN|12060
Pocenia|UD|33050
Podenzana|MS|54010
Podenzano|PC|29027
Pofi|FR|03026
Poggiardo|LE|73037
Poggibonsi|SI|53036
Poggio Bustone|RI|02018
Poggio Catino|RI|02040
Poggio Imperiale|FG|71010
Poggio Mirteto|RI|02047
Poggio Moiano|RI|02037
Poggio Nativo|RI|02030
Poggio Picenze|AQ|67026
Poggio Renatico|FE|44028
Poggio Rusco|MN|46025
Poggio San Lorenzo|RI|02030
Poggio San Marcello|AN|60030
Poggio San Vicino|MC|62021
Poggio Sannita|IS|86086
Poggio Torriana|RN|47824
Poggio a Caiano|PO|59016
Poggiodomo|PG|06040
Poggiofiorito|CH|66030
Poggiomarino|NA|80040
Poggioreale|TP|91020
Poggiorsini|BA|70020
Poggiridenti|SO|23020
Pogliano Milanese|MI|20005
Pognana Lario|CO|22020
Pognano|BG|24040
Pogno|NO|28076
Poirino|TO|10046
Pojana Maggiore|VI|36026
Polaveno|BS|25060
Polcenigo|PN|33070
Polesella|RO|45038
Polesine Zibello|PR|43016
Poli|RM|00010
Polia|VV|89813
Policoro|MT|75025
Polignano a Mare|BA|70044
Polinago|MO|41040
Polino|TR|05030
Polistena|RC|89024
Polizzi Generosa|PA|90028
Polla|SA|84035
Pollein|AO|11020
Pollena Trocchia|NA|80040
Pollenza|MC|62010
Pollica|SA|84068
Pollina|PA|90010
Pollone|BI|13814
Pollutri|CH|66020
Polonghera|CN|12030
Polpenazze del Garda|BS|25080
Polverara|PD|35020
Polverigi|AN|60020
Pomarance|PI|56045
Pomaretto|TO|10063
Pomarico|MT|75016
Pomaro Monferrato|AL|15040
Pomarolo|TN|38060
Pombia|NO|28050
Pomezia|RM|00071
Pomigliano d'Arco|NA|80038
Pompei|NA|80045
Pompeiana|IM|18015
Pompiano|BS|25030
Pomponesco|MN|46030
Pompu|OR|09093
Poncarale|BS|25020
Ponderano|BI|13875
Ponna|CO|22020
Ponsacco|PI|56038
Ponso|PD|35040
Pont Canavese|TO|10085
Pont-Saint-Martin|AO|11026
Pontassieve|FI|50065
Pontboset|AO|11020
Ponte|BN|82030
Ponte Buggianese|PT|51019
Ponte Gardena|BZ|39040
Ponte Lambro|CO|22037
Ponte Nizza|PV|27050
Ponte Nossa|BG|24028
Ponte San Nicolò|PD|35020
Ponte San Pietro|BG|24036
Ponte dell'Olio|PC|29028
Ponte di Legno|BS|25056
Ponte di Piave|TV|31047
Ponte in Valtellina|SO|23026
Ponte nelle Alpi|BL|32014
Pontebba|UD|33016
Pontecagnano Faiano|SA|84098
Pontecchio Polesine|RO|45030
Pontechianale|CN|12020
Pontecorvo|FR|03037
Pontecurone|AL|15055
Pontedassio|IM|18027
Pontedera|PI|56025
Pontelandolfo|BN|82027
Pontelatone|CE|81040
Pontelongo|PD|35029
Pontenure|PC|29010
Ponteranica|BG|24010
Pontestura|AL|15027
Pontevico|BS|25026
Pontey|AO|11024
Ponti|AL|15010
Ponti sul Mincio|MN|46040
Pontida|BG|24030
Pontinia|LT|04014
Pontinvrea|SV|17042
Pontirolo Nuovo|BG|24040
Pontoglio|BS|25037
Pontremoli|MS|54027
Ponza|LT|04027
Ponzano Monferrato|AL|15020
Ponzano Romano|RM|00060
Ponzano Veneto|TV|31050
Ponzano di Fermo|FM|63845
Ponzone|AL|15010
Popoli Terme|PE|65026
Poppi|AR|52014
Porano|TR|05010
Porcari|LU|55016
Porcia|PN|33080
Pordenone|PN|33170|1
Porlezza|CO|22018
Pornassio|IM|18024
Porpetto|UD|33050
Portacomaro|AT|14037
Portalbera|PV|27040
Porte|TO|10060
Porte di Rendena|TN|38094
Portici|NA|80055
Portico di Caserta|CE|81050
Portico e San Benedetto|FC|47010
Portigliola|RC|89040
Porto Azzurro|LI|57036
Porto Ceresio|VA|21050
Porto Cesareo|LE|73010
Porto Empedocle|AG|92014
Porto Mantovano|MN|46047
Porto Recanati|MC|62017
Porto San Giorgio|FM|63822
Porto Sant'Elpidio|FM|63821
Porto Tolle|RO|45018
Porto Torres|SS|07046
Porto Valtravaglia|VA|21010
Porto Viro|RO|45014
Portobuffolè|TV|31040
Portocannone|CB|86045
Portoferraio|LI|57037
Portofino|GE|16034
Portogruaro|VE|30026
Portomaggiore|FE|44015
Portopalo di Capo Passero|SR|96026
Portoscuso|SU|09010
Portovenere|SP|19025
Portula|BI|13833
Posada|NU|08020
Posina|VI|36010
Positano|SA|84017
Possagno|TV|31054
Posta|RI|02019
Posta Fibreno|FR|03030
Postal|BZ|39014
Postalesio|SO|23010
Postiglione|SA|84026
Postua|VC|13010
Potenza|PZ|85100|1
Potenza Picena|MC|62018
Pove del Grappa|VI|36020
Povegliano|TV|31050
Povegliano Veronese|VR|37064
Poviglio|RE|42028
Povoletto|UD|33040
Pozzaglia Sabina|RI|02030
Pozzaglio ed Uniti|CR|26010
Pozzallo|RG|97016
Pozzilli|IS|86077
Pozzo d'Adda|MI|20060
Pozzol Groppo|AL|15050
Pozzolengo|BS|25010
Pozzoleone|VI|36050
Pozzolo Formigaro|AL|15068
Pozzomaggiore|SS|07018
Pozzonovo|PD|35020
Pozzuoli|NA|80078
Pozzuolo Martesana|MI|20060
Pozzuolo del Friuli|UD|33050
Pradalunga|BG|24020
Pradamano|UD|33040
Pradleves|CN|12027
Pragelato|TO|10060
Praia a Mare|CS|87028
Praiano|SA|84010
Pralboino|BS|25020
Prali|TO|10060
Pralormo|TO|10040
Pralungo|BI|13899
Pramaggiore|VE|30020
Pramollo|TO|10065
Prarolo|VC|13012
Prarostino|TO|10060
Prasco|AL|15010
Prascorsano|TO|10080
Prata Camportaccio|SO|23020
Prata Sannita|CE|81010
Prata d'Ansidonia|AQ|67020
Prata di Pordenone|PN|33080
Prata di Principato Ultra|AV|83030
Pratella|CE|81010
Pratiglione|TO|10080
Prato|PO|59100|1
Prato Carnico|UD|33020
Prato Sesia|NO|28077
Prato allo Stelvio|BZ|39026
Pratola Peligna|AQ|67035
Pratola Serra|AV|83039
Pratovecchio Stia|AR|52015
Pravisdomini|PN|33076
Pray|BI|13867
Prazzo|CN|12028
Precenicco|UD|33050
Preci|PG|06047
Predaia|TN|38012
Predappio|FC|47016
Predazzo|TN|38037
Predoi|BZ|39030
Predore|BG|24060
Predosa|AL|15077
Preganziol|TV|31022
Pregnana Milanese|MI|20006
Prelà|IM|18020
Premana|LC|23834
Premariacco|UD|33040
Premeno|VB|28818
Premia|VB|28866
Premilcuore|FC|47010
Premolo|BG|24020
Premosello-Chiovenda|VB|28803
Preone|UD|33020
Prepotto|UD|33040
Preseglie|BS|25070
Presenzano|CE|81050
Presezzo|BG|24030
Presicce-Acquarica|LE|73054
Pressana|VR|37040
Pretoro|CH|66010
Prevalle|BS|25080
Prezza|AQ|67030
Priero|CN|12070
Prignano Cilento|SA|84060
Prignano sulla Secchia|MO|41048
Primaluna|LC|23819
Primiero San Martino di Castrozza|TN|38054
Priocca|CN|12040
Priola|CN|12070
Priolo Gargallo|SR|96010
Priverno|LT|04015
Prizzi|PA|90038
Proceno|VT|01020
Procida|NA|80079
Propata|GE|16027
Proserpio|CO|22030
Prossedi|LT|04010
Provaglio Val Sabbia|BS|25070
Provaglio d'Iseo|BS|25050
Proves|BZ|39040
Provvidenti|CB|86040
Prunetto|CN|12077
Pré-Saint-Didier|AO|11010
Puegnago del Garda|BS|25080
Puglianello|BN|82030
Pula|CA|09050
Pulfero|UD|33046
Pulsano|TA|74026
Pumenengo|BG|24050
Pusiano|CO|22030
Putifigari|SS|07040
Putignano|BA|70017
Quadrelle|AV|83020
Quadri|CH|66040
Quagliuzzo|TO|10010
Qualiano|NA|80019
Quaranti|AT|14040
Quaregna Cerreto|BI|13854
Quargnento|AL|15044
Quarna Sopra|VB|28898
Quarna Sotto|VB|28896
Quarona|VC|13017
Quarrata|PT|51039
Quart|AO|11020
Quarto|NA|80010
Quarto d'Altino|VE|30020
Quartu Sant'Elena|CA|09045
Quartucciu|CA|09044
Quassolo|TO|10010
Quattordio|AL|15028
Quattro Castella|RE|42020
Quiliano|SV|17047
Quincinetto|TO|10010
Quindici|AV|83020
Quingentole|MN|46020
Quintano|CR|26017
Quinto Vercellese|VC|13030
Quinto Vicentino|VI|36050
Quinto di Treviso|TV|31055
Quinzano d'Oglio|BS|25027
Quistello|MN|46026
Rabbi|TN|38020
Racale|LE|73055
Racalmuto|AG|92020
Racconigi|CN|12035
Raccuja|ME|98067
Racines|BZ|39040
Radda in Chianti|SI|53017
Raddusa|CT|95040
Radicofani|SI|53040
Radicondoli|SI|53030
Raffadali|AG|92015
Ragalna|CT|95054
Ragogna|UD|33030
Ragusa|RG|97100|1
Raiano|AQ|67027
Ramacca|CT|95040
Rancio Valcuvia|VA|21030
Ranco|VA|21020
Randazzo|CT|95036
Ranica|BG|24020
Ranzanico|BG|24060
Ranzo|IM|18020
Rapagnano|FM|63831
Rapallo|GE|16035
Rapino|CH|66010
Rapolano Terme|SI|53040
Rapolla|PZ|85027
Rapone|PZ|85020
Rassa|VC|13020
Rasun-Anterselva|BZ|39030
Rasura|SO|23010
Ravanusa|AG|92029
Ravarino|MO|41017
Ravascletto|UD|33020
Ravello|SA|84010
Ravenna|RA|48121-48125|1
Raveo|UD|33029
Raviscanina|CE|81017
Re|VB|28856
Rea|PV|27040
Realmonte|AG|92010
Reana del Rojale|UD|33010
Reano|TO|10090
Recale|CE|81020
Recanati|MC|62019
Recco|GE|16036
Recetto|NO|28060
Recoaro Terme|VI|36076
Redavalle|PV|27050
Redondesco|MN|46010
Refrancore|AT|14030
Refrontolo|TV|31020
Regalbuto|EN|94017
Reggello|FI|50066
Reggio di Calabria|RC|89121-89129,89131-89135|1
Reggio nell'Emilia|RE|42121-42124|1
Reggiolo|RE|42046
Reino|BN|82020
Reitano|ME|98070
Remanzacco|UD|33047
Remedello|BS|25010
Renate|MB|20838
Rende|CS|87036
Renon|BZ|39054
Resana|TV|31023
Rescaldina|MI|20027
Resia|UD|33010
Resiutta|UD|33010
Resuttano|CL|93010
Retorbido|PV|27050
Revello|CN|12036
Revigliasco d'Asti|AT|14010
Revine Lago|TV|31020
Rezzago|CO|22030
Rezzato|BS|25086
Rezzo|IM|18026
Rezzoaglio|GE|16048
Rho|MI|20017
Rhêmes-Notre-Dame|AO|11010
Rhêmes-Saint-Georges|AO|11010
Riace|RC|89040
Rialto|SV|17020
Riano|RM|00060
Riardo|CE|81053
Ribera|AG|92016
Ribordone|TO|10080
Ricadi|VV|89866
Ricaldone|AL|15010
Riccia|CB|86016
Riccione|RN|47838
Riccò del Golfo di Spezia|SP|19020
Ricengo|CR|26010
Ricigliano|SA|84020
Riese Pio X|TV|31039
Riesi|CL|93016
Rieti|RI|02100|1
Rifiano|BZ|39010
Rifreddo|CN|12030
Rignano Flaminio|RM|00068
Rignano Garganico|FG|71010
Rignano sull'Arno|FI|50067
Rigolato|UD|33020
Rimella|VC|13020
Rimini|RN|47921-47924|1
Rio|LI|57038
Rio Saliceto|RE|42010
Rio di Pusteria|BZ|39037
Riofreddo|RM|00020
Riola Sardo|OR|09070
Riolo Terme|RA|48025
Riolunato|MO|41020
Riomaggiore|SP|19017
Rionero Sannitico|IS|86087
Rionero in Vulture|PZ|85028
Ripa Teatina|CH|66010
Ripabottoni|CB|86040
Ripacandida|PZ|85020
Ripalimosani|CB|86025
Ripalta Arpina|CR|26010
Ripalta Cremasca|CR|26010
Ripalta Guerina|CR|26010
Riparbella|PI|56046
Ripatransone|AP|63065
Ripe San Ginesio|MC|62020
Ripi|FR|03027
Riposto|CT|95018
Rittana|CN|12010
Riva Ligure|IM|18015
Riva del Garda|TN|38066
Riva del Po|FE|44033
Riva di Solto|BG|24060
Riva presso Chieri|TO|10020
Rivalba|TO|10090
Rivalta Bormida|AL|15010
Rivalta di Torino|TO|10040
Rivamonte Agordino|BL|32020
Rivanazzano Terme|PV|27055
Rivara|TO|10080
Rivarolo Canavese|TO|10086
Rivarolo Mantovano|MN|46017
Rivarolo del Re ed Uniti|CR|26036
Rivarone|AL|15040
Rivarossa|TO|10040
Rive|VC|13030
Rive d'Arcano|UD|33030
Rivello|PZ|85040
Rivergaro|PC|29029
Rivignano Teor|UD|33061
Rivisondoli|AQ|67036
Rivodutri|RI|02010
Rivoli|TO|10098
Rivoli Veronese|VR|37010
Rivolta d'Adda|CR|26027
Rizziconi|RC|89016
Roana|VI|36010
Roaschia|CN|12010
Roascio|CN|12073
Roasio|VC|13060
Roatto|AT|14018
Robassomero|TO|10070
Robbiate|LC|23899
Robbio|PV|27038
Robecchetto con Induno|MI|20020
Robecco Pavese|PV|27042
Robecco d'Oglio|CR|26010
Robecco sul Naviglio|MI|20087
Robella|AT|14020
Robilante|CN|12017
Roburent|CN|12080
Rocca Canavese|TO|10070
Rocca Canterano|RM|00020
Rocca Cigliè|CN|12060
Rocca Grimalda|AL|15078
Rocca Imperiale|CS|87074
Rocca Massima|LT|04010
Rocca Pia|AQ|67030
Rocca Pietore|BL|32023
Rocca Priora|RM|00079
Rocca San Casciano|FC|47017
Rocca San Felice|AV|83050
Rocca San Giovanni|CH|66020
Rocca Santa Maria|TE|64010
Rocca Santo Stefano|RM|00030
Rocca Sinibalda|RI|02026
Rocca Susella|PV|27052
Rocca d'Arazzo|AT|14030
Rocca d'Arce|FR|03030
Rocca d'Evandro|CE|81040
Rocca de' Baldi|CN|12047
Rocca de' Giorgi|PV|27040
Rocca di Botte|AQ|67066
Rocca di Cambio|AQ|67047
Rocca di Cave|RM|00030
Rocca di Mezzo|AQ|67048
Rocca di Neto|KR|88821
Rocca di Papa|RM|00040
Roccabascerana|AV|83016
Roccabernarda|KR|88835
Roccabianca|PR|43010
Roccabruna|CN|12020
Roccacasale|AQ|67030
Roccadaspide|SA|84069
Roccafiorita|ME|98030
Roccafluvione|AP|63093
Roccaforte Ligure|AL|15060
Roccaforte Mondovì|CN|12088
Roccaforte del Greco|RC|89060
Roccaforzata|TA|74020
Roccafranca|BS|25030
Roccagiovine|RM|00020
Roccagloriosa|SA|84060
Roccagorga|LT|04010
Roccalbegna|GR|58053
Roccalumera|ME|98027
Roccamandolfi|IS|86092
Roccamena|PA|90040
Roccamonfina|CE|81035
Roccamontepiano|CH|66010
Roccamorice|PE|65020
Roccanova|PZ|85036
Roccantica|RI|02040
Roccapalumba|PA|90066
Roccapiemonte|SA|84086
Roccarainola|NA|80030
Roccaraso|AQ|67037
Roccaromana|CE|81051
Roccascalegna|CH|66040
Roccasecca|FR|03038
Roccasecca dei Volsci|LT|04010
Roccasicura|IS|86080
Roccasparvera|CN|12010
Roccaspinalveti|CH|66050
Roccastrada|GR|58036
Roccavaldina|ME|98040
Roccaverano|AT|14050
Roccavignale|SV|17017
Roccavione|CN|12018
Roccavivara|CB|86020
Roccella Ionica|RC|89047
Roccella Valdemone|ME|98030
Rocchetta Belbo|CN|12050
Rocchetta Ligure|AL|15060
Rocchetta Nervina|IM|18030
Rocchetta Palafea|AT|14042
Rocchetta Sant'Antonio|FG|71020
Rocchetta Tanaro|AT|14030
Rocchetta a Volturno|IS|86070
Rocchetta di Vara|SP|19020
Rocchetta e Croce|CE|81042
Rodano|MI|20053
Roddi|CN|12060
Roddino|CN|12050
Rodello|CN|12050
Rodengo|BZ|39037
Rodengo Saiano|BS|25050
Rodero|CO|22070
Rodi Garganico|FG|71012
Rodigo|MN|46040
Rodì Milici|ME|98059
Rofrano|SA|84070
Rogeno|LC|23849
Roggiano Gravina|CS|87017
Roghudi|RC|89060
Rogliano|CS|87054
Rognano|PV|27010
Rogno|BG|24060
Rogolo|SO|23010
Roiate|RM|00030
Roio del Sangro|CH|66040
Roisan|AO|11010
Roletto|TO|10060
Rolo|RE|42047
Roma|RM|00118-00128,00131-00139,00141-00149,00151-00159,00161-00169,00171-00179,00181-00189,00191-00193,00195-00199|1
Romagnano Sesia|NO|28078
Romagnano al Monte|SA|84020
Romagnese|PV|27050
Romana|SS|07010
Romanengo|CR|26014
Romano Canavese|TO|10090
Romano d'Ezzelino|VI|36060
Romano di Lombardia|BG|24058
Romans d'Isonzo|GO|34076
Rombiolo|VV|89841
Romeno|TN|38010
Romentino|NO|28068
Rometta|ME|98043
Roncade|TV|31056
Roncadelle|BS|25030
Roncaro|PV|27010
Roncegno Terme|TN|38050
Roncello|MB|20877
Ronchi Valsugana|TN|38050
Ronchi dei Legionari|GO|34077
Ronchis|UD|33050
Ronciglione|VT|01037
Ronco Biellese|BI|13845
Ronco Briantino|MB|20885
Ronco Canavese|TO|10080
Ronco Scrivia|GE|16019
Ronco all'Adige|VR|37055
Roncobello|BG|24010
Roncoferraro|MN|46037
Roncofreddo|FC|47020
Roncola|BG|24030
Roncà|VR|37030
Rondanina|GE|16025
Rondissone|TO|10030
Ronsecco|VC|13036
Ronzo-Chienis|TN|38060
Ronzone|TN|38010
Roppolo|BI|13883
Rorà|TO|10060
Rosarno|RC|89025
Rosasco|PV|27030
Rosate|MI|20088
Rosazza|BI|13815
Rosciano|PE|65020
Roscigno|SA|84020
Rose|CS|87040
Rosello|CH|66040
Roseto Capo Spulico|CS|87070
Roseto Valfortore|FG|71039
Roseto degli Abruzzi|TE|64026
Rosignano Marittimo|LI|57016
Rosignano Monferrato|AL|15030
Rosolina|RO|45010
Rosolini|SR|96019
Rosora|AN|60030
Rossa|VC|13020
Rossana|CN|12020
Rossano Veneto|VI|36028
Rossiglione|GE|16010
Rosta|TO|10090
Rosà|VI|36027
Rota Greca|CS|87010
Rota d'Imagna|BG|24037
Rotella|AP|63071
Rotello|CB|86040
Rotonda|PZ|85048
Rotondella|MT|75026
Rotondi|AV|83017
Rottofreno|PC|29010
Rotzo|VI|36010
Roure|TO|10060
Rovasenda|VC|13040
Rovato|BS|25038
Rovegno|GE|16028
Rovellasca|CO|22069
Rovello Porro|CO|22070
Roverbella|MN|46048
Roverchiara|VR|37050
Roveredo di Guà|VR|37040
Roveredo in Piano|PN|33080
Rovereto|TN|38068
Roverè Veronese|VR|37028
Roverè della Luna|TN|38030
Rovescala|PV|27040
Rovetta|BG|24020
Roviano|RM|00027
Rovigo|RO|45100|1
Rovito|CS|87050
Rovolon|PD|35030
Rozzano|MI|20089
Roè Volciano|BS|25077
Rubano|PD|35030
Rubiana|TO|10040
Rubiera|RE|42048
Ruda|UD|33050
Rudiano|BS|25030
Rueglio|TO|10010
Ruffano|LE|73049
Ruffia|CN|12030
Ruffrè-Mendola|TN|38010
Rufina|FI|50068
Ruinas|OR|09085
Rumo|TN|38020
Ruoti|PZ|85056
Russi|RA|48026
Rutigliano|BA|70018
Rutino|SA|84070
Ruviano|CE|81010
Ruvo del Monte|PZ|85020
Ruvo di Puglia|BA|70037
Sabaudia|LT|04016
Sabbio Chiese|BS|25070
Sabbioneta|MN|46018
Sacco|SA|84070
Saccolongo|PD|35030
Sacile|PN|33077
Sacrofano|RM|00060
Sadali|CA|09062
Sagama|OR|09090
Sagliano Micca|BI|13816
Sagrado|GO|34078
Sagron Mis|TN|38050
Saint-Christophe|AO|11020
Saint-Denis|AO|11023
Saint-Marcel|AO|11020
Saint-Nicolas|AO|11010
Saint-Oyen|AO|11014
Saint-Pierre|AO|11010
Saint-Rhémy-en-Bosses|AO|11010
Saint-Vincent|AO|11027
Sala Baganza|PR|43038
Sala Biellese|BI|13884
Sala Bolognese|BO|40010
Sala Comacina|CO|22010
Sala Consilina|SA|84036
Sala Monferrato|AL|15030
Salandra|MT|75017
Salaparuta|TP|91020
Salara|RO|45030
Salasco|VC|13040
Salassa|TO|10080
Salbertrand|TO|10050
Salcedo|VI|36040
Salcito|CB|86026
Sale|AL|15045
Sale Marasino|BS|25057
Sale San Giovanni|CN|12070
Sale delle Langhe|CN|12070
Salemi|TP|91018
Salento|SA|84070
Salerano Canavese|TO|10010
Salerano sul Lambro|LO|26857
Salerno|SA|84121-84129,84131-84135|1
Salgareda|TV|31040
Sali Vercellese|VC|13040
Salice Salentino|LE|73015
Saliceto|CN|12079
Salisano|RI|02040
Salizzole|VR|37056
Salle|PE|65020
Salmour|CN|12040
Salorno sulla strada del vino|BZ|39040
Salsomaggiore Terme|PR|43039
Saltrio|VA|21050
Saludecio|RN|47835
Saluggia|VC|13040
Salussola|BI|13885
Saluzzo|CN|12037
Salve|LE|73050
Salvirola|CR|26010
Salvitelle|SA|84020
Salza Irpina|AV|83050
Salza di Pinerolo|TO|10060
Salzano|VE|30030
Salò|BS|25087
Samarate|VA|21017
Samassi|VS|09030
Samatzai|CA|09007
Sambuca Pistoiese|PT|51020
Sambuca di Sicilia|AG|92017
Sambuci|RM|00020
Sambuco|CN|12010
Sammichele di Bari|BA|70010
Samo|RC|89030
Samolaco|SO|23027
Samone|TO|10010
Samone|TN|38059
Sampeyre|CN|12020
Samugheo|OR|09086
San Bartolomeo Val Cavargna|CO|22010
San Bartolomeo al Mare|IM|18016
San Bartolomeo in Galdo|BN|82028
San Basile|CS|87010
San Basilio|CA|09040
San Bassano|CR|26020
San Bellino|RO|45020
San Benedetto Belbo|CN|12050
San Benedetto Po|MN|46027
San Benedetto Ullano|CS|87040
San Benedetto Val di Sambro|BO|40048
San Benedetto dei Marsi|AQ|67058
San Benedetto del Tronto|AP|63074
San Benedetto in Perillis|AQ|67020
San Benigno Canavese|TO|10080
San Bernardino Verbano|VB|28804
San Biagio Platani|AG|92020
San Biagio Saracinisco|FR|03040
San Biagio della Cima|IM|18036
San Biagio di Callalta|TV|31048
San Biase|CB|86020
San Bonifacio|VR|37047
San Buono|CH|66050
San Calogero|VV|89842
San Candido|BZ|39038
San Canzian d'Isonzo|GO|34075
San Carlo Canavese|TO|10070
San Casciano dei Bagni|SI|53040
San Casciano in Val di Pesa|FI|50026
San Cassiano|LE|73020
San Cataldo|CL|93017
San Cesareo|RM|00030
San Cesario di Lecce|LE|73016
San Cesario sul Panaro|MO|41018
San Chirico Nuovo|PZ|85010
San Chirico Raparo|PZ|85030
San Cipirello|PA|90088
San Cipriano Picentino|SA|84099
San Cipriano Po|PV|27043
San Cipriano d'Aversa|CE|81036
San Clemente|RN|47832
San Colombano Belmonte|TO|10080
San Colombano Certenoli|GE|16040
San Colombano al Lambro|MI|20078
San Cono|CT|95040
San Cosmo Albanese|CS|87060
San Costantino Albanese|PZ|85030
San Costantino Calabro|VV|89851
San Costanzo|PU|61039
San Cristoforo|AL|15060
San Damiano Macra|CN|12029
San Damiano al Colle|PV|27040
San Damiano d'Asti|AT|14015
San Daniele Po|CR|26046
San Daniele del Friuli|UD|33038
San Demetrio Corone|CS|87069
San Demetrio ne' Vestini|AQ|67028
San Didero|TO|10050
San Donaci|BR|72025
San Donato Milanese|MI|20097
San Donato Val di Comino|FR|03046
San Donato di Lecce|LE|73010
San Donato di Ninea|CS|87010
San Donà di Piave|VE|30027
San Dorligo della Valle|TS|34018
San Fele|PZ|85020
San Felice Circeo|LT|04017
San Felice a Cancello|CE|81027
San Felice del Benaco|BS|25010
San Felice del Molise|CB|86030
San Felice sul Panaro|MO|41038
San Ferdinando|RC|89026
San Ferdinando di Puglia|BT|76017
San Fermo della Battaglia|CO|22042
San Fili|CS|87037
San Filippo del Mela|ME|98044
San Fior|TV|31020
San Fiorano|LO|26848
San Floriano del Collio|GO|34070
San Floro|CZ|88021
San Francesco al Campo|TO|10070
San Fratello|ME|98075
San Gavino Monreale|VS|09037
San Gemini|TR|05029
San Genesio Atesino|BZ|39050
San Genesio ed Uniti|PV|27010
San Gennaro Vesuviano|NA|80040
San Germano Chisone|TO|10065
San Germano Vercellese|VC|13047
San Gervasio Bresciano|BS|25020
San Giacomo Filippo|SO|23020
San Giacomo Vercellese|VC|13030
San Giacomo degli Schiavoni|CB|86030
San Giacomo delle Segnate|MN|46020
San Gillio|TO|10040
San Gimignano|SI|53037
San Ginesio|MC|62026
San Giorgio Albanese|CS|87060
San Giorgio Bigarello|MN|46051
San Giorgio Canavese|TO|10090
San Giorgio Ionico|TA|74027
San Giorgio La Molara|BN|82020
San Giorgio Lucano|MT|75027
San Giorgio Monferrato|AL|15020
San Giorgio Morgeto|RC|89017
San Giorgio Piacentino|PC|29019
San Giorgio Scarampi|AT|14059
San Giorgio a Cremano|NA|80046
San Giorgio a Liri|FR|03047
San Giorgio del Sannio|BN|82018
San Giorgio della Richinvelda|PN|33095
San Giorgio delle Pertiche|PD|35010
San Giorgio di Lomellina|PV|27020
San Giorgio di Nogaro|UD|33058
San Giorgio di Piano|BO|40016
San Giorgio in Bosco|PD|35010
San Giorgio su Legnano|MI|20034
San Giorio di Susa|TO|10050
San Giovanni Bianco|BG|24015
San Giovanni Gemini|AG|92020
San Giovanni Ilarione|VR|37035
San Giovanni Incarico|FR|03028
San Giovanni Lipioni|CH|66050
San Giovanni Lupatoto|VR|37057
San Giovanni Rotondo|FG|71013
San Giovanni Suergiu|SU|09010
San Giovanni Teatino|CH|66020
San Giovanni Valdarno|AR|52027
San Giovanni a Piro|SA|84070
San Giovanni al Natisone|UD|33048
San Giovanni del Dosso|MN|46020
San Giovanni di Fassa|TN|38036
San Giovanni di Gerace|RC|89040
San Giovanni in Croce|CR|26037
San Giovanni in Fiore|CS|87055
San Giovanni in Galdo|CB|86010
San Giovanni in Marignano|RN|47842
San Giovanni in Persiceto|BO|40017
San Giovanni la Punta|CT|95037
San Giuliano Milanese|MI|20098
San Giuliano Terme|PI|56017
San Giuliano del Sannio|CB|86010
San Giuliano di Puglia|CB|86040
San Giuseppe Jato|PA|90048
San Giuseppe Vesuviano|NA|80047
San Giustino|PG|06016
San Giusto Canavese|TO|10090
San Godenzo|FI|50060
San Gregorio Magno|SA|84020
San Gregorio Matese|CE|81010
San Gregorio d'Ippona|VV|89853
San Gregorio da Sassola|RM|00010
San Gregorio di Catania|CT|95027
San Gregorio nelle Alpi|BL|32030
San Lazzaro di Savena|BO|40068
San Leo|RN|47865
San Leonardo|UD|33040
San Leonardo in Passiria|BZ|39015
San Leucio del Sannio|BN|82010
San Lorenzello|BN|82030
San Lorenzo|RC|89069
San Lorenzo Bellizzi|CS|87070
San Lorenzo Dorsino|TN|38078
San Lorenzo Isontino|GO|34070
San Lorenzo Maggiore|BN|82034
San Lorenzo Nuovo|VT|01020
San Lorenzo al Mare|IM|18017
San Lorenzo del Vallo|CS|87040
San Lorenzo di Sebato|BZ|39030
San Lorenzo in Campo|PU|61047
San Luca|RC|89030
San Lucido|CS|87038
San Lupo|BN|82034
San Mango Piemonte|SA|84090
San Mango d'Aquino|CZ|88040
San Mango sul Calore|AV|83050
San Marcellino|CE|81030
San Marcello|AN|60030
San Marcello Piteglio|PT|51028
San Marco Argentano|CS|87018
San Marco Evangelista|CE|81020
San Marco d'Alunzio|ME|98070
San Marco dei Cavoti|BN|82029
San Marco in Lamis|FG|71014
San Marco la Catola|FG|71030
San Martino Alfieri|AT|14010
San Martino Buon Albergo|VR|37036
San Martino Canavese|TO|10010
San Martino Sannita|BN|82010
San Martino Siccomario|PV|27028
San Martino Valle Caudina|AV|83018
San Martino al Tagliamento|PN|33098
San Martino d'Agri|PZ|85030
San Martino dall'Argine|MN|46010
San Martino del Lago|CR|26040
San Martino di Finita|CS|87010
San Martino di Lupari|PD|35018
San Martino di Venezze|RO|45030
San Martino in Badia|BZ|39030
San Martino in Passiria|BZ|39010
San Martino in Pensilis|CB|86046
San Martino in Rio|RE|42018
San Martino in Strada|LO|26817
San Martino sulla Marrucina|CH|66010
San Marzano Oliveto|AT|14050
San Marzano di San Giuseppe|TA|74020
San Marzano sul Sarno|SA|84010
San Massimo|CB|86027
San Maurizio Canavese|TO|10077
San Maurizio d'Opaglio|NO|28017
San Mauro Castelverde|PA|90010
San Mauro Cilento|SA|84070
San Mauro Forte|MT|75010
San Mauro Marchesato|KR|88831
San Mauro Pascoli|FC|47030
San Mauro Torinese|TO|10099
San Mauro di Saline|VR|37030
San Mauro la Bruca|SA|84070
San Michele Mondovì|CN|12080
San Michele Salentino|BR|72018
San Michele al Tagliamento|VE|30028
San Michele all'Adige|TN|38098
San Michele di Ganzaria|CT|95040
San Michele di Serino|AV|83020
San Miniato|PI|56028
San Nazzaro|BN|82018
San Nazzaro Sesia|NO|28060
San Nazzaro Val Cavargna|CO|22010
San Nicandro Garganico|FG|71015
San Nicola Arcella|CS|87020
San Nicola Baronia|AV|83050
San Nicola Manfredi|BN|82010
San Nicola da Crissa|VV|89821
San Nicola dell'Alto|KR|88817
San Nicola la Strada|CE|81020
San Nicolò Gerrei|CA|09040
San Nicolò d'Arcidano|OR|09097
San Nicolò di Comelico|BL|32040
San Pancrazio|BZ|39010
San Pancrazio Salentino|BR|72026
San Paolo|BS|25020
San Paolo Albanese|PZ|85030
San Paolo Bel Sito|NA|80030
San Paolo Solbrito|AT|14010
San Paolo d'Argon|BG|24060
San Paolo di Civitate|FG|71010
San Paolo di Jesi|AN|60038
San Pellegrino Terme|BG|24016
San Pier Niceto|ME|98045
San Pier d'Isonzo|GO|34070
San Piero Patti|ME|98068
San Pietro Apostolo|CZ|88040
San Pietro Avellana|IS|86088
San Pietro Clarenza|CT|95055
San Pietro Infine|CE|81049
San Pietro Mosezzo|NO|28060
San Pietro Mussolino|VI|36070
San Pietro Val Lemina|TO|10060
San Pietro Vernotico|BR|72027
San Pietro Viminario|PD|35020
San Pietro a Maida|CZ|88025
San Pietro al Natisone|UD|33049
San Pietro al Tanagro|SA|84030
San Pietro di Cadore|BL|32040
San Pietro di Caridà|RC|89020
San Pietro di Feletto|TV|31020
San Pietro di Morubio|VR|37050
San Pietro in Amantea|CS|87030
San Pietro in Cariano|VR|37029
San Pietro in Casale|BO|40018
San Pietro in Cerro|PC|29010
San Pietro in Gu|PD|35010
San Pietro in Guarano|CS|87047
San Pietro in Lama|LE|73010
San Pio delle Camere|AQ|67020
San Polo Matese|CB|86020
San Polo d'Enza|RE|42020
San Polo dei Cavalieri|RM|00010
San Polo di Piave|TV|31020
San Ponso|TO|10080
San Possidonio|MO|41039
San Potito Sannitico|CE|81016
San Potito Ultra|AV|83050
San Prisco|CE|81054
San Procopio|RC|89020
San Prospero|MO|41030
San Quirico d'Orcia|SI|53027
San Quirino|PN|33080
San Raffaele Cimena|TO|10090
San Roberto|RC|89050
San Rocco al Porto|LO|26865
San Romano in Garfagnana|LU|55038
San Rufo|SA|84030
San Salvatore Monferrato|AL|15046
San Salvatore Telesino|BN|82030
San Salvatore di Fitalia|ME|98070
San Salvo|CH|66050
San Sebastiano Curone|AL|15056
San Sebastiano al Vesuvio|NA|80040
San Sebastiano da Po|TO|10020
San Secondo Parmense|PR|43017
San Secondo di Pinerolo|TO|10060
San Severino Lucano|PZ|85030
San Severino Marche|MC|62027
San Severo|FG|71016
San Siro|CO|22010
San Sossio Baronia|AV|83050
San Sostene|CZ|88060
San Sosti|CS|87010
San Sperate|CA|09026
San Stino di Livenza|VE|30029
San Tammaro|CE|81050
San Teodoro|OT|07052
San Teodoro|ME|98030
San Tomaso Agordino|BL|32020
San Valentino Torio|SA|84010
San Valentino in Abruzzo Citeriore|PE|65020
San Venanzo|TR|05010
San Vendemiano|TV|31020
San Vero Milis|OR|09070
San Vincenzo|LI|57027
San Vincenzo La Costa|CS|87030
San Vincenzo Valle Roveto|AQ|67050
San Vitaliano|NA|80030
San Vito|CA|09040
San Vito Chietino|CH|66038
San Vito Lo Capo|TP|91030
San Vito Romano|RM|00030
San Vito al Tagliamento|PN|33078
San Vito al Torre|UD|33050
San Vito dei Normanni|BR|72019
San Vito di Cadore|BL|32046
San Vito di Fagagna|UD|33030
San Vito di Leguzzano|VI|36030
San Vito sullo Ionio|CZ|88067
San Vittore Olona|MI|20028
San Vittore del Lazio|FR|03040
San Zeno Naviglio|BS|25010
San Zeno di Montagna|VR|37010
San Zenone al Lambro|MI|20070
San Zenone al Po|PV|27010
San Zenone degli Ezzelini|TV|31020
Sanarica|LE|73030
Sandigliano|BI|13876
Sandrigo|VI|36066
Sanfront|CN|12030
Sanfrè|CN|12040
Sangano|TO|10090
Sangiano|VA|21038
Sangineto|CS|87020
Sanguinetto|VR|37058
Sanluri|VS|09025|1
Sannazzaro de' Burgondi|PV|27039
Sannicandro di Bari|BA|70028
Sannicola|LE|73017
Sanremo|IM|18038
Sansepolcro|AR|52037
Sant'Agapito|IS|86070
Sant'Agata Bolognese|BO|40019
Sant'Agata Feltria|RN|47866
Sant'Agata Fossili|AL|15050
Sant'Agata de' Goti|BN|82019
Sant'Agata del Bianco|RC|89030
Sant'Agata di Esaro|CS|87010
Sant'Agata di Militello|ME|98076
Sant'Agata di Puglia|FG|71028
Sant'Agata li Battiati|CT|95056
Sant'Agata sul Santerno|RA|48020
Sant'Agnello|NA|80065
Sant'Albano Stura|CN|12040
Sant'Alessio Siculo|ME|98030
Sant'Alessio con Vialone|PV|27016
Sant'Alessio in Aspromonte|RC|89050
Sant'Alfio|CT|95010
Sant'Ambrogio di Torino|TO|10057
Sant'Ambrogio di Valpolicella|VR|37015
Sant'Ambrogio sul Garigliano|FR|03040
Sant'Anastasia|NA|80048
Sant'Anatolia di Narco|PG|06040
Sant'Andrea Apostolo dello Ionio|CZ|88060
Sant'Andrea Frius|CA|09040
Sant'Andrea del Garigliano|FR|03040
Sant'Andrea di Conza|AV|83053
Sant'Angelo Le Fratte|PZ|85050
Sant'Angelo Limosano|CB|86020
Sant'Angelo Lodigiano|LO|26866
Sant'Angelo Lomellina|PV|27030
Sant'Angelo Muxaro|AG|92020
Sant'Angelo Romano|RM|00010
Sant'Angelo a Cupolo|BN|82010
Sant'Angelo a Fasanella|SA|84027
Sant'Angelo a Scala|AV|83010
Sant'Angelo all'Esca|AV|83050
Sant'Angelo d'Alife|CE|81017
Sant'Angelo dei Lombardi|AV|83054
Sant'Angelo del Pesco|IS|86080
Sant'Angelo di Brolo|ME|98060
Sant'Angelo di Piove di Sacco|PD|35020
Sant'Angelo in Pontano|MC|62020
Sant'Angelo in Vado|PU|61048
Sant'Anna Arresi|SU|09010
Sant'Anna d'Alfaedo|VR|37020
Sant'Antimo|NA|80029
Sant'Antioco|SU|09017
Sant'Antonino di Susa|TO|10050
Sant'Antonio Abate|NA|80057
Sant'Antonio di Gallura|OT|07055
Sant'Apollinare|FR|03048
Sant'Arcangelo|PZ|85037
Sant'Arcangelo Trimonte|BN|82021
Sant'Arpino|CE|81030
Sant'Arsenio|SA|84037
Sant'Egidio alla Vibrata|TE|64016
Sant'Egidio del Monte Albino|SA|84010
Sant'Elena|PD|35040
Sant'Elena Sannita|IS|86095
Sant'Elia Fiumerapido|FR|03049
Sant'Elia a Pianisi|CB|86048
Sant'Elpidio a Mare|FM|63811
Sant'Eufemia a Maiella|PE|65020
Sant'Eufemia d'Aspromonte|RC|89027
Sant'Eusanio Forconese|AQ|67020
Sant'Eusanio del Sangro|CH|66037
Sant'Ilario d'Enza|RE|42049
Sant'Ilario dello Ionio|RC|89040
Sant'Ippolito|PU|61040
Sant'Olcese|GE|16010
Sant'Omero|TE|64027
Sant'Omobono Terme|BG|24038
Sant'Onofrio|VV|89843
Sant'Oreste|RM|00060
Sant'Orsola Terme|TN|38050
Sant'Urbano|PD|35040
Santa Brigida|BG|24010
Santa Caterina Albanese|CS|87010
Santa Caterina Villarmosa|CL|93018
Santa Caterina d'Este|PD|35049
Santa Caterina dello Ionio|CZ|88060
Santa Cesarea Terme|LE|73020
Santa Cristina Gela|PA|90082
Santa Cristina Valgardena|BZ|39047
Santa Cristina d'Aspromonte|RC|89056
Santa Cristina e Bissone|PV|27010
Santa Croce Camerina|RG|97017
Santa Croce del Sannio|BN|82020
Santa Croce di Magliano|CB|86047
Santa Croce sull'Arno|PI|56029
Santa Domenica Talao|CS|87020
Santa Domenica Vittoria|ME|98030
Santa Elisabetta|AG|92020
Santa Fiora|GR|58037
Santa Flavia|PA|90017
Santa Giuletta|PV|27046
Santa Giusta|OR|09096
Santa Giustina|BL|32035
Santa Giustina in Colle|PD|35010
Santa Luce|PI|56040
Santa Lucia del Mela|ME|98046
Santa Lucia di Piave|TV|31025
Santa Lucia di Serino|AV|83020
Santa Margherita Ligure|GE|16038
Santa Margherita di Belice|AG|92018
Santa Margherita di Staffora|PV|27050
Santa Maria Capua Vetere|CE|81055
Santa Maria Coghinas|SS|07030
Santa Maria Hoè|LC|23889
Santa Maria Imbaro|CH|66030
Santa Maria Maggiore|VB|28857
Santa Maria Nuova|AN|60030
Santa Maria a Monte|PI|56020
Santa Maria a Vico|CE|81028
Santa Maria del Cedro|CS|87020
Santa Maria del Molise|IS|86096
Santa Maria della Versa|PV|27047
Santa Maria di Licodia|CT|95038
Santa Maria di Sala|VE|30036
Santa Maria la Carità|NA|80050
Santa Maria la Fossa|CE|81050
Santa Maria la Longa|UD|33050
Santa Marina|SA|84067
Santa Marina Salina|ME|98050
Santa Marinella|RM|00058
Santa Ninfa|TP|91029
Santa Paolina|AV|83030
Santa Severina|KR|88832
Santa Sofia|FC|47018
Santa Sofia d'Epiro|CS|87048
Santa Teresa Gallura|OT|07028
Santa Teresa di Riva|ME|98028
Santa Venerina|CT|95010
Santa Vittoria d'Alba|CN|12069
Santa Vittoria in Matenano|FM|63854
Santadi|SU|09010
Santarcangelo di Romagna|RN|47822
Sante Marie|AQ|67067
Santena|TO|10026
Santeramo in Colle|BA|70029
Santhià|VC|13048
Santi Cosma e Damiano|LT|04020
Santo Stefano Belbo|CN|12058
Santo Stefano Lodigiano|LO|26849
Santo Stefano Quisquina|AG|92020
Santo Stefano Roero|CN|12040
Santo Stefano Ticino|MI|20010
Santo Stefano al Mare|IM|18010
Santo Stefano d'Aveto|GE|16049
Santo Stefano del Sole|AV|83050
Santo Stefano di Cadore|BL|32045
Santo Stefano di Camastra|ME|98077
Santo Stefano di Magra|SP|19037
Santo Stefano di Rogliano|CS|87056
Santo Stefano di Sessanio|AQ|67020
Santo Stefano in Aspromonte|RC|89057
Santomenna|SA|84020
Santopadre|FR|03030
Santorso|VI|36014
Santu Lussurgiu|OR|09075
Sanza|SA|84030
Sanzeno|TN|38010
Saonara|PD|35020
Saponara|ME|98047
Sappada|UD|33012
Sapri|SA|84073
Saracena|CS|87010
Saracinesco|RM|00020
Sarcedo|VI|36030
Sarconi|PZ|85050
Sardara|VS|09030
Sardigliano|AL|15060
Sarego|VI|36040
Sarentino|BZ|39058
Sarezzano|AL|15050
Sarezzo|BS|25068
Sarmato|PC|29010
Sarmede|TV|31026
Sarnano|MC|62028
Sarnico|BG|24067
Sarno|SA|84087
Sarnonico|TN|38011
Saronno|VA|21047
Sarre|AO|11010
Sarroch|CA|09018
Sarsina|FC|47027
Sarteano|SI|53047
Sartirana Lomellina|PV|27020
Sarule|NU|08020
Sarzana|SP|19038
Sassano|SA|84038
Sassari|SS|07100|1
Sassello|SV|17046
Sassetta|LI|57020
Sassinoro|BN|82026
Sasso Marconi|BO|40037
Sasso di Castalda|PZ|85050
Sassocorvaro Auditore|PU|61028
Sassofeltrio|RN|47869
Sassoferrato|AN|60041
Sassuolo|MO|41049
Satriano|CZ|88060
Satriano di Lucania|PZ|85050
Sauris|UD|33020
Sauze d'Oulx|TO|10050
Sauze di Cesana|TO|10054
Sava|TA|74028
Savelli|KR|88825
Saviano|NA|80039
Savigliano|CN|12038
Savignano Irpino|AV|83030
Savignano sul Panaro|MO|41056
Savignano sul Rubicone|FC|47039
Savignone|GE|16010
Saviore dell'Adamello|BS|25040
Savoca|ME|98038
Savogna|UD|33040
Savogna d'Isonzo|GO|34070
Savoia di Lucania|PZ|85050
Savona|SV|17100|1
Scafa|PE|65027
Scafati|SA|84018
Scagnello|CN|12070
Scala|SA|84010
Scala Coeli|CS|87060
Scaldasole|PV|27020
Scalea|CS|87029
Scalenghe|TO|10060
Scaletta Zanclea|ME|98029
Scampitella|AV|83050
Scandale|KR|88831
Scandiano|RE|42019
Scandicci|FI|50018
Scandolara Ravara|CR|26040
Scandolara Ripa d'Oglio|CR|26047
Scandriglia|RI|02038
Scanno|AQ|67038
Scano di Montiferro|OR|09078
Scansano|GR|58054
Scanzano Jonico|MT|75020
Scanzorosciate|BG|24020
Scapoli|IS|86070
Scarlino|GR|58020
Scarmagno|TO|10010
Scarnafigi|CN|12030
Scarperia e San Piero|FI|50038
Scena|BZ|39017
Scerni|CH|66020
Scheggia e Pascelupo|PG|06027
Scheggino|PG|06040
Schiavi di Abruzzo|CH|66045
Schiavon|VI|36060
Schignano|CO|22020
Schilpario|BG|24020
Schio|VI|36015
Schivenoglia|MN|46020
Sciacca|AG|92019
Sciara|PA|90020
Scicli|RG|97018
Scido|RC|89010
Scigliano|CS|87057
Scilla|RC|89058
Scillato|PA|90020
Sciolze|TO|10090
Scisciano|NA|80030
Sclafani Bagni|PA|90020
Scontrone|AQ|67030
Scopa|VC|13027
Scopello|VC|13028
Scoppito|AQ|67019
Scordia|CT|95048
Scorrano|LE|73020
Scorzè|VE|30037
Scurcola Marsicana|AQ|67068
Scurelle|TN|38050
Scurzolengo|AT|14030
Seborga|IM|18012
Secinaro|AQ|67029
Seclì|LE|73050
Secugnago|LO|26826
Sedegliano|UD|33039
Sedico|BL|32036
Sedilo|OR|09076
Sedini|SS|07035
Sedriano|MI|20018
Sedrina|BG|24010
Sefro|MC|62025
Segariu|VS|09020
Seggiano|GR|58038
Segni|RM|00037
Segonzano|TN|38047
Segrate|MI|20054
Segusino|TV|31040
Selargius|CA|09047
Selci|RI|02040
Selegas|CA|09040
Sella Giudicarie|TN|38087
Sellano|PG|06030
Sellero|BS|25050
Sellia|CZ|88050
Sellia Marina|CZ|88050
Selva dei Molini|BZ|39030
Selva di Cadore|BL|32020
Selva di Progno|VR|37030
Selva di Val Gardena|BZ|39048
Selvazzano Dentro|PD|35030
Selvino|BG|24020
Semestene|SS|07010
Semiana|PV|27020
Seminara|RC|89028
Semproniano|GR|58055
Senago|MI|20030
Senale-San Felice|BZ|39010
Senales|BZ|39020
Seneghe|OR|09070
Senerchia|AV|83050
Seniga|BS|25020
Senigallia|AN|60019
Senis|OR|09080
Senise|PZ|85038
Senna Comasco|CO|22070
Senna Lodigiana|LO|26856
Sennariolo|OR|09078
Sennori|SS|07036
Senorbì|CA|09040
Sepino|CB|86017
Sequals|PN|33090
Seravezza|LU|55047
Serdiana|CA|09040
Seregno|MB|20831
Seren del Grappa|BL|32030
Sergnano|CR|26010
Seriate|BG|24068
Serina|BG|24017
Serino|AV|83028
Serle|BS|25080
Sermide e Felonica|MN|46028
Sermoneta|LT|04013
Sernaglia della Battaglia|TV|31020
Sernio|SO|23030
Serole|AT|14050
Serra Riccò|GE|16010
Serra San Bruno|VV|89822
Serra San Quirico|AN|60048
Serra Sant'Abbondio|PU|61040
Serra d'Aiello|CS|87030
Serra de' Conti|AN|60030
Serracapriola|FG|71010
Serradifalco|CL|93010
Serralunga d'Alba|CN|12050
Serralunga di Crea|AL|15020
Serramanna|VS|09038
Serramazzoni|MO|41028
Serramezzana|SA|84070
Serramonacesca|PE|65025
Serrapetrona|MC|62020
Serrara Fontana|NA|80081
Serrastretta|CZ|88040
Serrata|RC|89020
Serravalle Langhe|CN|12050
Serravalle Pistoiese|PT|51034
Serravalle Scrivia|AL|15069
Serravalle Sesia|VC|13037
Serravalle a Po|MN|46030
Serravalle di Chienti|MC|62038
Serre|SA|84028
Serrenti|VS|09027
Serri|CA|09063
Serrone|FR|03010
Sersale|CZ|88054
Servigliano|FM|63839
Sessa Aurunca|CE|81037
Sessa Cilento|SA|84074
Sessame|AT|14058
Sessano del Molise|IS|86097
Sesta Godano|SP|19020
Sestino|AR|52038
Sesto|BZ|39030
Sesto Calende|VA|21018
Sesto Campano|IS|86078
Sesto Fiorentino|FI|50019
Sesto San Giovanni|MI|20099
Sesto al Reghena|PN|33079
Sesto ed Uniti|CR|26028
Sestola|MO|41029
Sestri Levante|GE|16039
Sestriere|TO|10058
Sestu|CA|09028
Settala|MI|20049
Settefrati|FR|03040
Setteville|BL|32038
Settime|AT|14020
Settimo Milanese|MI|20019
Settimo Rottaro|TO|10010
Settimo San Pietro|CA|09060
Settimo Torinese|TO|10036
Settimo Vittone|TO|10010
Settingiano|CZ|88040
Setzu|VS|09029
Seui|OG|08051
Seulo|NU|08014
Seveso|MB|20822
Sezzadio|AL|15079
Sezze|LT|04018
Sfruz|TN|38010
Sgonico|TS|34010
Sgurgola|FR|03010
Siamaggiore|OR|09070
Siamanna|OR|09080
Siano|SA|84088
Siapiccia|OR|09080
Sicignano degli Alburni|SA|84029
Siculiana|AG|92010
Siddi|VS|09020
Siderno|RC|89048
Siena|SI|53100|1
Sigillo|PG|06028
Signa|FI|50058
Silandro|BZ|39028
Silanus|NU|08017
Silea|TV|31057
Siligo|SS|07040
Siliqua|CA|09003
Silius|CA|09040
Sillano Giuncugnano|LU|55039
Sillavengo|NO|28064
Silvano Pietra|PV|27050
Silvano d'Orba|AL|15060
Silvi|TE|64028
Simala|OR|09090
Simaxis|OR|09088
Simbario|VV|89822
Simeri Crichi|CZ|88050
Sinagra|ME|98069
Sinalunga|SI|53048
Sindia|NU|08018
Sini|OR|09090
Sinio|CN|12050
Siniscola|NU|08029
Sinnai|CA|09048
Sinopoli|RC|89020
Siracusa|SR|96100|1
Sirignano|AV|83020
Siris|OR|09090
Sirmione|BS|25019
Sirolo|AN|60020
Sirone|LC|23844
Sirtori|LC|23896
Sissa Trecasali|PR|43018
Siurgus Donigala|CA|09040
Siziano|PV|27010
Sizzano|NO|28070
Sluderno|BZ|39020
Smerillo|FM|63856
Soave|VR|37038
Socchieve|UD|33020
Soddì|OR|09080
Sogliano Cavour|LE|73010
Sogliano al Rubicone|FC|47030
Soglio|AT|14020
Soiano del Lago|BS|25080
Solagna|VI|36020
Solarino|SR|96010
Solaro|MI|20033
Solarolo|RA|48027
Solarolo Rainerio|CR|26030
Solarussa|OR|09077
Solbiate Arno|VA|21048
Solbiate Olona|VA|21058
Solbiate con Cagno|CO|22043
Soldano|IM|18036
Soleminis|CA|09040
Solero|AL|15029
Solesino|PD|35047
Soleto|LE|73010
Solferino|MN|46040
Soliera|MO|41019
Solignano|PR|43046
Solofra|AV|83029
Solonghello|AL|15020
Solopaca|BN|82036
Solto Collina|BG|24060
Solza|BG|24030
Somaglia|LO|26867
Somano|CN|12060
Somma Lombardo|VA|21019
Somma Vesuviana|NA|80049
Sommacampagna|VR|37066
Sommariva Perno|CN|12040
Sommariva del Bosco|CN|12048
Sommatino|CL|93019
Sommo|PV|27048
Sona|VR|37060
Soncino|CR|26029
Sondalo|SO|23035
Sondrio|SO|23100|1
Songavazzo|BG|24020
Sonico|BS|25048
Sonnino|LT|04010
Sora|FR|03039
Soraga di Fassa|TN|38030
Soragna|PR|43019
Sorano|GR|58010
Sorbo San Basile|CZ|88050
Sorbo Serpico|AV|83050
Sorbolo Mezzani|PR|43058
Sordevolo|BI|13817
Sordio|LO|26858
Soresina|CR|26015
Sorgono|NU|08038
Sorgà|VR|37060
Sori|GE|16031
Sorianello|VV|89831
Soriano Calabro|VV|89831
Soriano nel Cimino|VT|01038
Sorico|CO|22010
Soriso|NO|28010
Sorisole|BG|24010
Sormano|CO|22030
Sorradile|OR|09080
Sorrento|NA|80067
Sorso|SS|07037
Sortino|SR|96010
Sospiro|CR|26048
Sospirolo|BL|32037
Sossano|VI|36040
Sostegno|BI|13868
Sotto il Monte Giovanni XXIII|BG|24039
Sover|TN|38048
Soverato|CZ|88068
Sovere|BG|24060
Soveria Mannelli|CZ|88049
Soveria Simeri|CZ|88050
Soverzene|BL|32010
Sovicille|SI|53018
Sovico|MB|20845
Sovizzo|VI|36049
Sovramonte|BL|32030
Sozzago|NO|28060
Spadafora|ME|98048
Spadola|VV|89822
Sparanise|CE|81056
Sparone|TO|10080
Specchia|LE|73040
Spello|PG|06038
Sperlinga|EN|94010
Sperlonga|LT|04029
Sperone|AV|83020
Spessa|PV|27010
Spezzano Albanese|CS|87019
Spezzano della Sila|CS|87058
Spiazzo|TN|38088
Spigno Monferrato|AL|15018
Spigno Saturnia|LT|04020
Spilamberto|MO|41057
Spilimbergo|PN|33097
Spilinga|VV|89864
Spinadesco|CR|26020
Spinazzola|BT|76014
Spinea|VE|30038
Spineda|CR|26030
Spinete|CB|86020
Spineto Scrivia|AL|15050
Spinetoli|AP|63078
Spino d'Adda|CR|26016
Spinone al Lago|BG|24060
Spinoso|PZ|85039
Spirano|BG|24050
Spoleto|PG|06049
Spoltore|PE|65010
Spongano|LE|73038
Spormaggiore|TN|38010
Sporminore|TN|38010
Spotorno|SV|17028
Spresiano|TV|31027
Spriana|SO|23020
Squillace|CZ|88069
Squinzano|LE|73018
Staffolo|AN|60039
Stagno Lombardo|CR|26049
Staiti|RC|89030
Stalettì|CZ|88071
Stanghella|PD|35048
Staranzano|GO|34079
Statte|TA|74010
Stazzano|AL|15060
Stazzema|LU|55040
Stazzona|CO|22010
Stefanaconi|VV|89843
Stella|SV|17044
Stella Cilento|SA|84070
Stellanello|SV|17020
Stelvio|BZ|39029
Stenico|TN|38070
Sternatia|LE|73010
Stezzano|BG|24040
Stienta|RO|45039
Stigliano|MT|75018
Stignano|RC|89040
Stilo|RC|89049
Stimigliano|RI|02048
Stintino|SS|07040
Stio|SA|84075
Stornara|FG|71047
Stornarella|FG|71048
Storo|TN|38089
Stra|VE|30039
Stradella|PV|27049
Strambinello|TO|10010
Strambino|TO|10019
Strangolagalli|FR|03020
Stregna|UD|33040
Strembo|TN|38080
Stresa|VB|28838
Strevi|AL|15019
Striano|NA|80040
Strona|BI|13823
Stroncone|TR|05039
Strongoli|KR|88816
Stroppiana|VC|13010
Stroppo|CN|12020
Strozza|BG|24030
Sturno|AV|83055
Suardi|PV|27030
Subbiano|AR|52010
Subiaco|RM|00028
Succivo|CE|81030
Sueglio|LC|23835
Suelli|CA|09040
Suello|LC|23867
Suisio|BG|24040
Sulbiate|MB|20884
Sulmona|AQ|67039
Sulzano|BS|25058
Sumirago|VA|21040
Summonte|AV|83010
Suni|OR|09090
Suno|NO|28019
Supersano|LE|73040
Supino|FR|03019
Surano|LE|73030
Surbo|LE|73010
Susa|TO|10059
Susegana|TV|31058
Sustinente|MN|46030
Sutera|CL|93010
Sutri|VT|01015
Sutrio|UD|33020
Suvereto|LI|57028
Suzzara|MN|46029
Taceno|LC|23837
Tadasuni|OR|09080
Taggia|IM|18018
Tagliacozzo|AQ|67069
Taglio di Po|RO|45019
Tagliolo Monferrato|AL|15070
Taibon Agordino|BL|32027
Taino|VA|21020
Taipana|UD|33040
Talamello|RN|47867
Talamona|SO|23018
Talana|OG|08040
Taleggio|BG|24010
Talla|AR|52010
Talmassons|UD|33030
Tambre|BL|32010
Taormina|ME|98039
Tarano|RI|02040
Taranta Peligna|CH|66018
Tarantasca|CN|12020
Taranto|TA|74121-74123|1
Tarcento|UD|33017
Tarquinia|VT|01016
Tarsia|CS|87040
Tartano|SO|23010
Tarvisio|UD|33018
Tarzo|TV|31020
Tassarolo|AL|15060
Taurano|AV|83020
Taurasi|AV|83030
Taurianova|RC|89029
Taurisano|LE|73056
Tavagnacco|UD|33010
Tavagnasco|TO|10010
Tavazzano con Villavesco|LO|26838
Tavenna|CB|86030
Taverna|CZ|88055
Tavernerio|CO|22038
Tavernola Bergamasca|BG|24060
Tavernole sul Mella|BS|25060
Taviano|LE|73057
Tavigliano|BI|13811
Tavoleto|PU|61020
Tavullia|PU|61010
Teana|PZ|85032
Teano|CE|81057
Teggiano|SA|84039
Teglio|SO|23036
Teglio Veneto|VE|30025
Telese Terme|BN|82037
Telgate|BG|24060
Telti|OT|07020
Telve|TN|38050
Telve di Sopra|TN|38050
Tempio Pausania|OT|07029|1
Temù|BS|25050
Tenna|TN|38050
Tenno|TN|38060
Teolo|PD|35037
Teora|AV|83056
Teramo|TE|64100|1
Terdobbiate|NO|28070
Terelle|FR|03040
Terento|BZ|39030
Terenzo|PR|43040
Tergu|SS|07030
Terlano|BZ|39018
Terlizzi|BA|70038
Terme Vigliatore|ME|98050
Termeno sulla strada del vino|BZ|39040
Termini Imerese|PA|90018
Termoli|CB|86039
Ternate|VA|21020
Ternengo|BI|13844
Terni|TR|05100|1
Terno d'Isola|BG|24030
Terracina|LT|04019
Terragnolo|TN|38060
Terralba|OR|09098
Terranova Sappo Minulio|RC|89010
Terranova da Sibari|CS|87010
Terranova dei Passerini|LO|26827
Terranova di Pollino|PZ|85030
Terranuova Bracciolini|AR|52028
Terrasini|PA|90049
Terrassa Padovana|PD|35020
Terravecchia|CS|87060
Terrazzo|VR|37040
Terre Roveresche|PU|61038
Terre d'Adige|TN|38097
Terre del Reno|FE|44047
Terricciola|PI|56030
Terruggia|AL|15030
Tertenia|OG|08047
Terzigno|NA|80040
Terzo|AL|15010
Terzo d'Aquileia|UD|33050
Terzolas|TN|38027
Terzorio|IM|18010
Tesero|TN|38038
Tesimo|BZ|39010
Tessennano|VT|01010
Testico|SV|17020
Teti|NU|08030
Teulada|SU|09019
Teverola|CE|81030
Tezze sul Brenta|VI|36056
Thiene|VI|36016
Thiesi|SS|07047
Tiana|NU|08020
Ticengo|CR|26020
Ticineto|AL|15040
Tiggiano|LE|73030
Tiglieto|GE|16010
Tigliole|AT|14016
Tignale|BS|25080
Tinnura|OR|09090
Tione degli Abruzzi|AQ|67020
Tione di Trento|TN|38079
Tirano|SO|23037
Tires|BZ|39050
Tiriolo|CZ|88056
Tirolo|BZ|39019
Tissi|SS|07040
Tito|PZ|85050
Tivoli|RM|00019
Tizzano Val Parma|PR|43028
Toano|RE|42010
Tocco Caudio|BN|82030
Tocco da Casauria|PE|65028
Toceno|VB|28858
Todi|PG|06059
Toffia|RI|02039
Toirano|SV|17055
Tolentino|MC|62029
Tolfa|RM|00059
Tollegno|BI|13818
Tollo|CH|66010
Tolmezzo|UD|33028
Tolve|PZ|85017
Tombolo|PD|35019
Ton|TN|38010
Tonara|NU|08039
Tonco|AT|14039
Tonezza del Cimone|VI|36040
Tora e Piccilli|CE|81044
Torano Castello|CS|87010
Torano Nuovo|TE|64010
Torbole Casaglia|BS|25030
Torcegno|TN|38050
Torchiara|SA|84076
Torchiarolo|BR|72020
Torella dei Lombardi|AV|83057
Torella del Sannio|CB|86028
Torgiano|PG|06089
Torgnon|AO|11020
Torino|TO|10121-10129,10131-10139,10141-10149,10151-10156|1
Torino di Sangro|CH|66020
Toritto|BA|70020
Torlino Vimercati|CR|26017
Tornaco|NO|28070
Tornareccio|CH|66046
Tornata|CR|26030
Tornimparte|AQ|67049
Torno|CO|22020
Tornolo|PR|43059
Toro|CB|86018
Torpè|NU|08020
Torraca|SA|84030
Torralba|SS|07048
Torrazza Coste|PV|27050
Torrazza Piemonte|TO|10037
Torrazzo|BI|13884
Torre Annunziata|NA|80058
Torre Beretti e Castellaro|PV|27030
Torre Boldone|BG|24020
Torre Bormida|CN|12050
Torre Cajetani|FR|03010
Torre Canavese|TO|10010
Torre Le Nocelle|AV|83030
Torre Mondovì|CN|12080
Torre Orsaia|SA|84077
Torre Pallavicina|BG|24050
Torre Pellice|TO|10066
Torre San Giorgio|CN|12030
Torre San Patrizio|FM|63814
Torre Santa Susanna|BR|72028
Torre d'Arese|PV|27010
Torre d'Isola|PV|27020
Torre de' Busi|BG|24032
Torre de' Negri|PV|27011
Torre de' Passeri|PE|65029
Torre de' Picenardi|CR|26038
Torre de' Roveri|BG|24060
Torre del Greco|NA|80059
Torre di Mosto|VE|30020
Torre di Ruggiero|CZ|88060
Torre di Santa Maria|SO|23020
Torreano|UD|33040
Torrebelvicino|VI|36036
Torrebruna|CH|66050
Torrecuso|BN|82030
Torreglia|PD|35038
Torregrotta|ME|98040
Torremaggiore|FG|71017
Torrenova|ME|98070
Torresina|CN|12070
Torretta|PA|90040
Torrevecchia Pia|PV|27010
Torrevecchia Teatina|CH|66010
Torri del Benaco|VR|37010
Torri di Quartesolo|VI|36040
Torri in Sabina|RI|02049
Torrice|FR|03020
Torricella|TA|74020
Torricella Peligna|CH|66019
Torricella Sicura|TE|64010
Torricella Verzate|PV|27050
Torricella del Pizzo|CR|26040
Torricella in Sabina|RI|02030
Torriglia|GE|16029
Torrile|PR|43056
Torrioni|AV|83010
Torrita Tiberina|RM|00060
Torrita di Siena|SI|53049
Tortolì|OG|08048|1
Tortona|AL|15057
Tortora|CS|87020
Tortorella|SA|84030
Tortoreto|TE|64018
Tortorici|ME|98078
Torviscosa|UD|33050
Toscolano-Maderno|BS|25088
Tossicia|TE|64049
Tovo San Giacomo|SV|17020
Tovo di Sant'Agata|SO|23030
Trabia|PA|90019
Tradate|VA|21049
Tramatza|OR|09070
Trambileno|TN|38068
Tramonti|SA|84010
Tramonti di Sopra|PN|33090
Tramonti di Sotto|PN|33090
Tramutola|PZ|85057
Trana|TO|10090
Trani|BT|76125|1
Traona|SO|23019
Trapani|TP|91100|1
Trappeto|PA|90090
Trarego Viggiona|VB|28826
Trasacco|AQ|67059
Trasaghis|UD|33010
Trasquera|VB|28868
Tratalias|SU|09010
Travacò Siccomario|PV|27020
Travagliato|BS|25039
Travedona-Monate|VA|21028
Traversella|TO|10080
Traversetolo|PR|43029
Traves|TO|10070
Travesio|PN|33090
Travo|PC|29020
Tre Ville|TN|38095
Trebaseleghe|PD|35010
Trebisacce|CS|87075
Trecase|NA|80040
Trecastagni|CT|95039
Trecastelli|AN|60012
Trecate|NO|28069
Trecchina|PZ|85049
Trecenta|RO|45027
Tredozio|FC|47019
Treglio|CH|66030
Tregnago|VR|37039
Treia|MC|62010
Treiso|CN|12050
Tremestieri Etneo|CT|95030
Tremezzina|CO|22016
Tremosine sul Garda|BS|25010
Trentinara|SA|84070
Trento|TN|38121-38123|1
Trentola Ducenta|CE|81038
Trenzano|BS|25030
Treppo Grande|UD|33010
Treppo Ligosullo|UD|33014
Trepuzzi|LE|73019
Trequanda|SI|53020
Tresana|MS|54012
Trescore Balneario|BG|24069
Trescore Cremasco|CR|26017
Tresignana|FE|44039
Tresivio|SO|23020
Tresnuraghes|OR|09079
Trevenzuolo|VR|37060
Trevi|PG|06039
Trevi nel Lazio|FR|03010
Trevico|AV|83058
Treviglio|BG|24047
Trevignano|TV|31040
Trevignano Romano|RM|00069
Treville|AL|15030
Treviolo|BG|24048
Treviso|TV|31100|1
Treviso Bresciano|BS|25070
Trezzano Rosa|MI|20060
Trezzano sul Naviglio|MI|20090
Trezzo Tinella|CN|12050
Trezzo sull'Adda|MI|20056
Trezzone|CO|22010
Tribano|PD|35020
Tribiano|MI|20067
Tribogna|GE|16030
Tricarico|MT|75019
Tricase|LE|73039
Tricerro|VC|13038
Tricesimo|UD|33019
Triei|OG|08040
Trieste|TS|34121-34129,34131-34139,34141-34149,34151|1
Triggiano|BA|70019
Trigolo|CR|26018
Trinitapoli|BT|76015
Trinità|CN|12049
Trinità d'Agultu e Vignola|OT|07038
Trino|VC|13039
Triora|IM|18010
Tripi - Abakainon|ME|98060
Trisobbio|AL|15070
Trissino|VI|36070
Triuggio|MB|20844
Trivento|CB|86029
Trivigliano|FR|03010
Trivignano Udinese|UD|33050
Trivigno|PZ|85018
Trivolzio|PV|27020
Trodena nel parco naturale|BZ|39040
Trofarello|TO|10028
Troia|FG|71029
Troina|EN|94018
Tromello|PV|27020
Trontano|VB|28859
Tronzano Lago Maggiore|VA|21010
Tronzano Vercellese|VC|13049
Tropea|VV|89861
Trovo|PV|27020
Truccazzano|MI|20060
Tubre|BZ|39020
Tufara|CB|86010
Tufillo|CH|66050
Tufino|NA|80030
Tufo|AV|83010
Tuglie|LE|73058
Tuili|VS|09029
Tula|SS|07010
Tuoro sul Trasimeno|PG|06069
Turania|RI|02020
Turano Lodigiano|LO|26828
Turate|CO|22078
Turbigo|MI|20029
Turi|BA|70010
Turri|VS|09020
Turriaco|GO|34070
Turrivalignani|PE|65020
Tursi|MT|75028
Tusa|ME|98079
Tuscania|VT|01017
Ubiale Clanezzo|BG|24010
Uboldo|VA|21040
Ucria|ME|98060
Udine|UD|33100|1
Ugento|LE|73059
Uggiano la Chiesa|LE|73020
Uggiate con Ronago|CO|22029
Ulassai|OG|08040
Ultimo|BZ|39016
Ulà Tirso|OR|09080
Umbertide|PG|06019
Umbriatico|KR|88823
Urago d'Oglio|BS|25030
Uras|OR|09099
Urbana|PD|35040
Urbania|PU|61049
Urbe|SV|17048
Urbino|PU|61029|1
Urbisaglia|MC|62010
Urgnano|BG|24059
Uri|SS|07040
Ururi|CB|86049
Urzulei|OG|08040
Uscio|GE|16036
Usellus|OR|09090
Usini|SS|07049
Usmate Velate|MB|20865
Ussana|CA|09008
Ussaramanna|VS|09020
Ussassai|OG|08040
Usseaux|TO|10060
Usseglio|TO|10070
Ussita|MC|62039
Ustica|PA|90051
Uta|CA|09068
Uzzano|PT|51010
Vaccarizzo Albanese|CS|87060
Vacone|RI|02040
Vacri|CH|66010
Vadena|BZ|39051
Vado Ligure|SV|17047
Vagli Sotto|LU|55030
Vaglia|FI|50036
Vaglio Basilicata|PZ|85010
Vaglio Serra|AT|14049
Vaiano|PO|59021
Vaiano Cremasco|CR|26010
Vaie|TO|10050
Vailate|CR|26019
Vairano Patenora|CE|81058
Vajont|PN|33080
Val Brembilla|BG|24012
Val Liona|VI|36044
Val Masino|SO|23010
Val Rezzo|CO|22010
Val della Torre|TO|10040
Val di Chy|TO|10039
Val di Nizza|PV|27050
Val di Vizze|BZ|39049
Val di Zoldo|BL|32012
Valbondione|BG|24020
Valbrembo|BG|24030
Valbrenta|VI|36029
Valbrevenna|GE|16010
Valbrona|CO|22039
Valchiusa|TO|10089
Valdagno|VI|36078
Valdaone|TN|38091
Valdaora|BZ|39030
Valdastico|VI|36040
Valdengo|BI|13855
Valderice|TP|91019
Valdidentro|SO|23038
Valdieri|CN|12010
Valdilana|BI|13835
Valdina|ME|98040
Valdisotto|SO|23030
Valdobbiadene|TV|31049
Valduggia|VC|13018
Valeggio|PV|27020
Valeggio sul Mincio|VR|37067
Valentano|VT|01018
Valenza|AL|15048
Valenzano|BA|70010
Valera Fratta|LO|26859
Valfabbrica|PG|06029
Valfenera|AT|14017
Valfloriana|TN|38040
Valfornace|MC|62031
Valfurva|SO|23030
Valganna|VA|21039
Valgioie|TO|10094
Valgoglio|BG|24020
Valgrana|CN|12020
Valgreghentino|LC|23857
Valgrisenche|AO|11010
Valguarnera Caropepe|EN|94019
Vallada Agordina|BL|32020
Vallanzengo|BI|13847
Vallarsa|TN|38060
Vallata|AV|83059
Valle Agricola|CE|81010
Valle Aurina|BZ|39030
Valle Cannobina|VB|28827
Valle Castellana|TE|64010
Valle Lomellina|PV|27020
Valle Salimbene|PV|27010
Valle San Nicolao|BI|13847
Valle dell'Angelo|SA|84070
Valle di Cadore|BL|32040
Valle di Casies|BZ|39030
Valle di Maddaloni|CE|81020
Vallebona|IM|18012
Vallecorsa|FR|03020
Vallecrosia al mare|IM|18019
Valledolmo|PA|90029
Valledoria|SS|07039
Vallefiorita|CZ|88050
Vallefoglia|PU|61022
Vallelaghi|TN|38096
Vallelonga|VV|89821
Vallelunga Pratameno|CL|93010
Vallemaio|FR|03040
Vallepietra|RM|00020
Vallerano|VT|01030
Vallermosa|CA|09004
Vallerotonda|FR|03040
Vallesaccarda|AV|83050
Valleve|BG|24010
Valli del Pasubio|VI|36030
Vallinfreda|RM|00020
Vallio Terme|BS|25080
Vallo Torinese|TO|10070
Vallo della Lucania|SA|84078
Vallo di Nera|PG|06040
Valloriate|CN|12010
Valmacca|AL|15040
Valmadrera|LC|23868
Valmontone|RM|00038
Valmorea|CO|22070
Valmozzola|PR|43050
Valnegra|BG|24010
Valpelline|AO|11010
Valperga|TO|10087
Valprato Soana|TO|10080
Valsamoggia|BO|40053
Valsavarenche|AO|11010
Valsinni|MT|75029
Valsolda|CO|22010
Valstrona|VB|28897
Valtopina|PG|06030
Valtorta|BG|24010
Valtournenche|AO|11028
Valva|SA|84020
Valvarrone|LC|23836
Valvasone Arzene|PN|33098
Valverde|CT|95028
Valvestino|BS|25080
Vandoies|BZ|39030
Vanzaghello|MI|20020
Vanzago|MI|20043
Vanzone con San Carlo|VB|28879
Vaprio d'Adda|MI|20069
Vaprio d'Agogna|NO|28010
Varallo|VC|13019
Varallo Pombia|NO|28040
Varano Borghi|VA|21020
Varano de' Melegari|PR|43040
Varapodio|RC|89010
Varazze|SV|17019
Varco Sabino|RI|02020
Varedo|MB|20814
Varenna|LC|23829
Varese|VA|21100|1
Varese Ligure|SP|19028
Varisella|TO|10070
Varmo|UD|33030
Varna|BZ|39040
Varsi|PR|43049
Varzi|PV|27057
Varzo|VB|28868
Vasanello|VT|01030
Vasia|IM|18020
Vasto|CH|66054
Vastogirardi|IS|86089
Vauda Canavese|TO|10070
Vazzano|VV|89834
Vazzola|TV|31028
Vecchiano|PI|56019
Vedano Olona|VA|21040
Vedano al Lambro|MB|20854
Vedelago|TV|31050
Vedeseta|BG|24010
Veduggio con Colzano|MB|20837
Veggiano|PD|35030
Veglie|LE|73010
Veglio|BI|13824
Vejano|VT|01010
Veleso|CO|22020
Velezzo Lomellina|PV|27020
Velletri|RM|00049
Vellezzo Bellini|PV|27010
Velo Veronese|VR|37030
Velo d'Astico|VI|36010
Velturno|BZ|39040
Venafro|IS|86079
Venaria Reale|TO|10078
Venarotta|AP|63091
Venasca|CN|12020
Venaus|TO|10050
Vendone|SV|17032
Venegono Inferiore|VA|21040
Venegono Superiore|VA|21040
Venetico|ME|98040
Venezia|VE|30121-30126,30132-30133,30135,30141-30142,30171-30176|1
Veniano|CO|22070
Venosa|PZ|85029
Ventasso|RE|42032
Venticano|AV|83030
Ventimiglia|IM|18039
Ventimiglia di Sicilia|PA|90070
Ventotene|LT|04031
Venzone|UD|33010
Verano|BZ|39010
Verano Brianza|MB|20843
Verbania|VB|28921-28925|1
Verbicaro|CS|87020
Vercana|CO|22013
Verceia|SO|23020
Vercelli|VC|13100|1
Vercurago|LC|23808
Verdellino|BG|24040
Verdello|BG|24049
Verderio|LC|23879
Verduno|CN|12060
Vergato|BO|40038
Verghereto|FC|47028
Vergiate|VA|21029
Vermezzo con Zelo|MI|20071
Vermiglio|TN|38029
Vernante|CN|12019
Vernasca|PC|29010
Vernate|MI|20080
Vernazza|SP|19018
Vernio|PO|59024
Vernole|LE|73029
Verolanuova|BS|25028
Verolavecchia|BS|25029
Verolengo|TO|10038
Veroli|FR|03029
Verona|VR|37121-37129,37131-37139,37141-37142|1
Veronella|VR|37040
Verrayes|AO|11020
Verretto|PV|27053
Verrone|BI|13871
Verrua Po|PV|27040
Verrua Savoia|TO|10020
Verrès|AO|11029
Vertemate con Minoprio|CO|22070
Vertova|BG|24029
Verucchio|RN|47826
Vervio|SO|23030
Verzegnis|UD|33020
Verzino|KR|88819
Verzuolo|CN|12039
Vescovana|PD|35040
Vescovato|CR|26039
Vesime|AT|14059
Vespolate|NO|28079
Vessalico|IM|18026
Vestenanova|VR|37030
Vestignè|TO|10030
Vestone|BS|25078
Vetralla|VT|01019
Vetto|RE|42020
Vezza d'Alba|CN|12040
Vezza d'Oglio|BS|25059
Vezzano Ligure|SP|19020
Vezzano sul Crostolo|RE|42030
Vezzi Portio|SV|17028
Viadana|MN|46019
Viadanica|BG|24060
Viagrande|CT|95029
Viale|AT|14010
Vialfrè|TO|10090
Viano|RE|42030
Viareggio|LU|55049
Viarigi|AT|14030
Vibo Valentia|VV|89900|1
Vibonati|SA|84079
Vicalvi|FR|03030
Vicari|PA|90071
Vicchio|FI|50039
Vicenza|VI|36100|1
Vico Equense|NA|80069
Vico del Gargano|FG|71018
Vico nel Lazio|FR|03010
Vicoforte|CN|12080
Vicoli|PE|65010
Vicolungo|NO|28060
Vicopisano|PI|56010
Vicovaro|RM|00029
Viddalba|SS|07030
Vidigulfo|PV|27018
Vidor|TV|31020
Vidracco|TO|10080
Vieste|FG|71019
Vietri di Potenza|PZ|85058
Vietri sul Mare|SA|84019
Vigano San Martino|BG|24060
Viganò|LC|23897
Vigarano Mainarda|FE|44049
Vigasio|VR|37068
Vigevano|PV|27029
Viggianello|PZ|85040
Viggiano|PZ|85059
Viggiù|VA|21059
Vigliano Biellese|BI|13856
Vigliano d'Asti|AT|14040
Vignale Monferrato|AL|15049
Vignanello|VT|01039
Vignate|MI|20052
Vignola|MO|41058
Vignola-Falesina|TN|38057
Vignole Borbera|AL|15060
Vignolo|CN|12010
Vignone|VB|28819
Vigo di Cadore|BL|32040
Vigodarzere|PD|35010
Vigolo|BG|24060
Vigolzone|PC|29020
Vigone|TO|10067
Vigonovo|VE|30030
Vigonza|PD|35010
Viguzzolo|AL|15058
Villa Bartolomea|VR|37049
Villa Basilica|LU|55019
Villa Biscossi|PV|27035
Villa Carcina|BS|25069
Villa Castelli|BR|72029
Villa Celiera|PE|65010
Villa Collemandina|LU|55030
Villa Cortese|MI|20035
Villa Estense|PD|35040
Villa Faraldi|IM|18010
Villa Guardia|CO|22079
Villa Lagarina|TN|38060
Villa Latina|FR|03040
Villa Literno|CE|81039
Villa Minozzo|RE|42030
Villa San Giovanni|RC|89018
Villa San Giovanni in Tuscia|VT|01010
Villa San Pietro|CA|09050
Villa San Secondo|AT|14020
Villa Sant'Angelo|AQ|67020
Villa Sant'Antonio|OR|09080
Villa Santa Lucia|FR|03030
Villa Santa Lucia degli Abruzzi|AQ|67020
Villa Santa Maria|CH|66047
Villa Santina|UD|33029
Villa Santo Stefano|FR|03020
Villa Verde|OR|09090
Villa d'Adda|BG|24030
Villa d'Almè|BG|24018
Villa d'Ogna|BG|24020
Villa del Bosco|BI|13868
Villa del Conte|PD|35010
Villa di Briano|CE|81030
Villa di Chiavenna|SO|23029
Villa di Serio|BG|24020
Villa di Tirano|SO|23030
Villabassa|BZ|39039
Villabate|PA|90039
Villachiara|BS|25030
Villacidro|VS|09039|1
Villadeati|AL|15020
Villadose|RO|45010
Villadossola|VB|28844
Villafalletto|CN|12020
Villafranca Padovana|PD|35010
Villafranca Piemonte|TO|10068
Villafranca Sicula|AG|92020
Villafranca Tirrena|ME|98049
Villafranca d'Asti|AT|14018
Villafranca di Verona|VR|37069
Villafranca in Lunigiana|MS|54028
Villafrati|PA|90030
Villaga|VI|36021
Villagrande Strisaili|OG|08049
Villalago|AQ|67030
Villalba|CL|93010
Villalfonsina|CH|66020
Villalvernia|AL|15050
Villamagna|CH|66010
Villamaina|AV|83050
Villamar|VS|09020
Villamarzana|RO|45030
Villamassargia|SU|09010
Villamiroglio|AL|15020
Villandro|BZ|39040
Villanova Biellese|BI|13877
Villanova Canavese|TO|10070
Villanova Marchesana|RO|45030
Villanova Mondovì|CN|12089
Villanova Monferrato|AL|15030
Villanova Monteleone|SS|07019
Villanova Solaro|CN|12030
Villanova Truschedu|OR|09084
Villanova Tulo|CA|09066
Villanova d'Albenga|SV|17038
Villanova d'Ardenghi|PV|27030
Villanova d'Asti|AT|14019
Villanova del Battista|AV|83030
Villanova del Ghebbo|RO|45020
Villanova del Sillaro|LO|26818
Villanova di Camposampiero|PD|35010
Villanova sull'Arda|PC|29010
Villanovaforru|VS|09020
Villanovafranca|VS|09020
Villanterio|PV|27019
Villanuova sul Clisi|BS|25089
Villaperuccio|SU|09010
Villapiana|CS|87076
Villaputzu|CA|09040
Villar Dora|TO|10040
Villar Focchiardo|TO|10050
Villar Pellice|TO|10060
Villar Perosa|TO|10069
Villar San Costanzo|CN|12020
Villarbasse|TO|10090
Villarboit|VC|13030
Villareggia|TO|10030
Villaricca|NA|80010
Villaromagnano|AL|15050
Villarosa|EN|94028
Villasalto|CA|09040
Villasanta|MB|20852
Villasimius|CA|09049
Villasor|CA|09034
Villaspeciosa|CA|09005
Villastellone|TO|10029
Villata|VC|13010
Villaurbana|OR|09080
Villavallelonga|AQ|67050
Villaverla|VI|36030
Ville d'Anaunia|TN|38019
Ville di Fiemme|TN|38099
Villeneuve|AO|11018
Villesse|GO|34070
Villetta Barrea|AQ|67030
Villette|VB|28856
Villimpenta|MN|46039
Villongo|BG|24060
Villorba|TV|31020
Vilminore di Scalve|BG|24020
Vimercate|MB|20871
Vimodrone|MI|20055
Vinadio|CN|12010
Vinchiaturo|CB|86019
Vinchio|AT|14040
Vinci|FI|50059
Vinovo|TO|10048
Vinzaglio|NO|28060
Viola|CN|12070
Vione|BS|25050
Vipiteno|BZ|39049
Virle Piemonte|TO|10060
Visano|BS|25010
Vische|TO|10030
Visciano|NA|80030
Visco|UD|33040
Visone|AL|15010
Visso|MC|62039
Vistarino|PV|27010
Vistrorio|TO|10080
Vita|TP|91010
Viterbo|VT|01100|1
Viticuso|FR|03040
Vito d'Asio|PN|33090
Vitorchiano|VT|01030
Vittoria|RG|97019
Vittorio Veneto|TV|31029
Vittorito|AQ|67030
Vittuone|MI|20009
Vitulano|BN|82038
Vitulazio|CE|81041
Vivaro|PN|33099
Vivaro Romano|RM|00020
Viverone|BI|13886
Vizzini|CT|95049
Vizzola Ticino|VA|21010
Vizzolo Predabissi|MI|20070
Viù|TO|10070
Vo'|PD|35030
Vobarno|BS|25079
Vobbia|GE|16010
Vocca|VC|13020
Vodo Cadore|BL|32040
Voghera|PV|27058
Voghiera|FE|44019
Vogogna|VB|28805
Volano|TN|38060
Volla|NA|80040
Volongo|CR|26030
Volpago del Montello|TV|31040
Volpara|PV|27047
Volpedo|AL|15059
Volpeglino|AL|15050
Volpiano|TO|10088
Volta Mantovana|MN|46049
Voltaggio|AL|15060
Voltago Agordino|BL|32020
Volterra|PI|56048
Voltido|CR|26030
Volturara Appula|FG|71030
Volturara Irpina|AV|83050
Volturino|FG|71030
Volvera|TO|10040
Vottignasco|CN|12020
Zaccanopoli|VV|89867
Zafferana Etnea|CT|95019
Zagarise|CZ|88050
Zagarolo|RM|00039
Zambrone|VV|89868
Zandobbio|BG|24060
Zanica|BG|24050
Zanè|VI|36010
Zapponeta|FG|71030
Zavattarello|PV|27059
Zeccone|PV|27010
Zeddiani|OR|09070
Zelbio|CO|22020
Zelo Buon Persico|LO|26839
Zeme|PV|27030
Zenevredo|PV|27049
Zenson di Piave|TV|31050
Zerba|PC|29020
Zerbo|PV|27017
Zerbolò|PV|27020
Zerfaliu|OR|09070
Zeri|MS|54029
Zermeghedo|VI|36050
Zero Branco|TV|31059
Zevio|VR|37059
Ziano Piacentino|PC|29010
Ziano di Fiemme|TN|38030
Zibido San Giacomo|MI|20058
Zignago|SP|19020
Zimella|VR|37040
Zimone|BI|13887
Zinasco|PV|27030
Zoagli|GE|16035
Zocca|MO|41059
Zogno|BG|24019
Zola Predosa|BO|40069
Zollino|LE|73010
Zone|BS|25050
Zoppola|PN|33080
Zoppè di Cadore|BL|32010
Zovencedo|VI|36020
Zubiena|BI|13888
Zuccarello|SV|17039
Zugliano|VI|36030
Zuglio|UD|33020
Zumaglia|BI|13848
Zumpano|CS|87040
Zungoli|AV|83030
Zungri|VV|89867`;
let CAPSL;const CAPS=()=>CAPSL||(CAPSL=CAPS_RAW.split('\n').map(l=>{const[n,p,c,f]=l.split('|');return{n,p,k:pk(c),f:f?1:0,x:nrm(n)}}));
const z5=n=>String(n).padStart(5,'0');
const offline=q=>{const i=q.lastIndexOf(',');if(i<0)return[];const head=q.slice(0,i+1)+' ',m=q.slice(i+1).trim().match(/^(\d{1,5})?\s*(.*)$/),dg=m[1]||'',nm=nrm(m[2].trim());if(dg.length+nm.length<2)return[];
const mn=dg?+dg.padEnd(5,'0'):0,mx=dg?+dg.padEnd(5,'9'):99999,hit=CAPS().filter(c=>(!nm||c.x.startsWith(nm)||c.x.split(/[ ']/).some(w=>w.startsWith(nm)))&&c.k.some(k=>k>=mn&&k<=mx));
hit.sort((a,b)=>((b.x.startsWith(nm)?1:0)-(a.x.startsWith(nm)?1:0))||(b.f-a.f)||(a.x<b.x?-1:1));
const out=[];for(const c of hit){if(out.length>=6)break;const ks=c.k.filter(k=>k>=mn&&k<=mx);
if(dg||c.k.length===1)ks.slice(0,dg?3:1).forEach(k=>out.length<6&&out.push({t:head+z5(k)+' '+c.n,s:c.p+' · CAP '+z5(k)}));
else out.push({t:head+c.n,s:c.p+' · CAP '+z5(c.k[0])+'–'+z5(c.k[c.k.length-1])+': scegli quello della tua via'})}
return out};
inp.addEventListener('input',()=>{const q=inp.value.trim();clearTimeout(t);if(ctl)ctl.abort();if(q.length<3||q===last){hide();return}
const off=offline(q);if(off.length){show(off);return}hide();if(q.length<5)return;
t=setTimeout(async()=>{ctl=new AbortController();const mine=ctl;let rem=[];
if(!phDown&&!mine.signal.aborted){try{const pc=new AbortController(),to=setTimeout(()=>pc.abort(),4000);mine.signal.addEventListener('abort',()=>pc.abort());const r=await fetch('https://photon.komoot.io/api/?limit=6&q='+encodeURIComponent(q),{signal:pc.signal});clearTimeout(to);if(!r.ok)throw 0;const j=await r.json();const seen=new Set();
 rem=(j.features||[]).map(f=>{const a=f.properties||{},st=[a.street||(a.osm_key==='highway'?a.name:''),a.housenumber].filter(Boolean).join(' '),ct=a.city||a.town||a.village||a.county||a.name&&!a.street&&a.osm_key==='place'&&a.name||'',cc=(a.countrycode||'').toUpperCase(),pc=[a.postcode,ct].filter(Boolean).join(' '),t=[st||(a.name&&a.osm_key!=='place'?a.name:''),pc].filter(Boolean).join(', ');return t&&t.length>3?{t:cc&&(ctName(cc)||a.country)?t+', '+(ctName(cc)||a.country):t,s:[a.state,a.country].filter(Boolean).join(', ')}:null}).filter(x=>x&&!seen.has(x.t)&&seen.add(x.t)).slice(0,5);
 }catch(e){if(!mine.signal.aborted)phDown=Date.now()+60000}}
if(phDown&&Date.now()>phDown)phDown=0;
if(!rem.length&&!mine.signal.aborted){try{const sm=window.claude&&await claude.use('sample');if(sm){const js=await sm.json('Sei un assistente per l’inserimento di indirizzi postali. Testo digitato: "'+q.replace(/"/g,"'")+'". Proponi fino a 4 indirizzi postali completi che corrispondono a questo testo, nel formato "Via Roma 12, 20121 Milano" (via e civico, CAP e città; per l’estero aggiungi il paese tra parentesi). Non inventare civici o CAP di cui non sei sicuro: in quel caso ometti il dato. Rispondi SOLO con un array JSON di stringhe, oppure [] se non sai.',{signal:mine.signal,modelTier:'quick'});rem=(Array.isArray(js)?js:[]).filter(x=>typeof x==='string'&&x.trim()).slice(0,4).map(t=>({t:t.trim(),s:'Suggerito da Claude, verifica'}))}}catch(e){}}
if(!mine.signal.aborted&&inp.value.trim()===q)show(rem)},600)});
inp.addEventListener('blur',()=>setTimeout(hide,150));
inp.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
})();

/* ===== Catalogo prodotti ===== */
const PKEY='crm-prod-v1',UNITA=['pz','confezione','cartone','bt','kg','l','m','m²','ore','giorni','mese','anno','forfait'],ALIQ=[22,10,5,4,0];
const DEMO_PRODS=[
{id:'w1',codice:'DB-BOL',nome:'Dalibrà Bollicine',categoria:'Spumante',caratt:'Pecorino Brut Nature · Pecorino 100% · 12,5% vol · 6–8 °C',descr:'Rifermentazione in bottiglia, senza solfiti aggiunti; si serve con i lieviti (sur lie).',unita:'bt',prezzo:14,costo:6.5,mag:true,scorta:60,iva:22,attivo:true},
{id:'w2',codice:'DB-PRI',nome:'Primatus',categoria:'Rosso',caratt:'Appassito Rosso · Montepulciano 100% · 14,5% vol · 14–16 °C',descr:'Uve appassite in pianta, almeno 12 mesi in legno grande. Vino da meditazione.',unita:'bt',prezzo:22,costo:10,mag:true,scorta:50,iva:22,attivo:true},
{id:'w3',codice:'DB-IDE',nome:'Idealis',categoria:'Rosso',caratt:'Montepulciano d’Abruzzo DOP · 14% vol · 14–16 °C',descr:'Montepulciano 100%, 8–10 mesi in legno grande. Ottimo con brasati e formaggi stagionati.',unita:'bt',prezzo:7.5,costo:3.2,mag:true,scorta:150,iva:22,attivo:true},
{id:'w4',codice:'DB-EMR',nome:'EmmeErre',categoria:'Rosso',caratt:'Montepulciano d’Abruzzo DOP Riserva · 14,5% vol · 16–18 °C',descr:'Almeno 18 mesi in legno, in parte in barrique francesi. Per carni alla griglia e primi robusti.',unita:'bt',prezzo:12,costo:5.5,mag:true,scorta:80,iva:22,attivo:true},
{id:'w5',codice:'DB-ORI',nome:'Origine',categoria:'Rosso',caratt:'Primitivo IGP · Primitivo min. 85% · 14% vol · 14–16 °C',descr:'Colline pugliesi a 300–400 m. Strutturato e caldo, per selvaggina e carni rosse.',unita:'bt',prezzo:6.5,costo:3,mag:true,scorta:50,iva:22,attivo:true},
{id:'w6',codice:'DB-MAM',nome:'Mammarosa',categoria:'Rosato',caratt:'Cerasuolo d’Abruzzo DOP · Montepulciano 100% · 13,5% vol · 10–12 °C',descr:'Vinificato in bianco, fresco e sapido. Antipasti, pasta e pizza.',unita:'bt',prezzo:6.5,costo:2.8,mag:true,scorta:100,iva:22,attivo:true},
{id:'w7',codice:'DB-MAG',nome:'Magnalia',categoria:'Bianco',caratt:'Pinot Grigio IGP Terre di Chieti · min. 85% · 13,5% vol · 9–11 °C',descr:'Colore ramato naturale, note di ciliegia e amarena. Verdure, pesce, piatti delicati.',unita:'bt',prezzo:7,costo:3,mag:true,scorta:80,iva:22,attivo:true},
{id:'w8',codice:'DB-ARG',nome:'Argello',categoria:'Bianco',caratt:'Pecorino IGP Terre di Chieti · min. 85% · 13,5% vol · 9–11 °C',descr:'Fresco e strutturato, note di frutta matura e pera. Crudi di pesce, risotti, pollame.',unita:'bt',prezzo:7,costo:3.2,mag:true,scorta:80,iva:22,attivo:true},
{id:'w9',codice:'DB-RIA',nome:'Riamò',categoria:'Bianco',caratt:'Trebbiano d’Abruzzo DOP · Trebbiano abruzzese 100% · 12,5% vol · 9–11 °C',descr:'Floreale con sentori di nocciola, sapido e minerale. Antipasti di pesce e carni bianche.',unita:'bt',prezzo:5.5,costo:2.3,mag:true,scorta:80,iva:22,attivo:true}];
let prods=[];
try{prods=JSON.parse(localStorage.getItem(PKEY)||'[]')}catch(e){}
function persistP(){try{stampMods(prods,'p')}catch(e){}try{localStorage.setItem(PKEY,JSON.stringify(prods))}catch(e){toast('Spazio pieno: impossibile salvare i prodotti.')}}
const MKEY='crm-mov-v1';
const DEMO_MOVS=[
{id:'m1',prodId:'w1',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:240,nota:'Giacenza iniziale'},
{id:'m2',prodId:'w2',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:40,nota:'Giacenza iniziale'},
{id:'m3',prodId:'w3',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:600,nota:'Giacenza iniziale'},
{id:'m4',prodId:'w4',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:300,nota:'Giacenza iniziale'},
{id:'m5',prodId:'w5',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:200,nota:'Giacenza iniziale'},
{id:'m6',prodId:'w6',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:400,nota:'Giacenza iniziale'},
{id:'m7',prodId:'w7',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:350,nota:'Giacenza iniziale'},
{id:'m8',prodId:'w8',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:300,nota:'Giacenza iniziale'},
{id:'m9',prodId:'w9',data:'2026-09-01T09:00:00.000Z',tipo:'carico',qta:280,nota:'Giacenza iniziale'},
{id:'m10',prodId:'w3',data:'2026-10-20T10:00:00.000Z',tipo:'scarico',qta:-120,nota:'Opportunità Riordino Idealis',oppId:'o5'}];
let movs=[];
try{movs=JSON.parse(localStorage.getItem(MKEY)||'[]')}catch(e){}
function persistM(){try{stampMods(movs,'m')}catch(e){}try{localStorage.setItem(MKEY,JSON.stringify(movs))}catch(e){toast('Spazio pieno: impossibile salvare i movimenti di magazzino.')}}
const RES_FASI=['proposta'];
const giac=id=>movs.reduce((t,m)=>m.prodId===id?t+m.qta:t,0);
const impeg=(id,skip)=>{let t=0;opps.forEach(o=>{if(o===skip||o.scaricato)return;if(RES_FASI.includes(o.fase)||o.fase==='vinta')(o.prodotti||[]).forEach(p=>{if(p.prodId===id)t+=+p.qta||0})});return t};
const disp=(id,skip)=>giac(id)-impeg(id,skip);
const lowOf=p=>p.mag&&(disp(p.id)<=0||(p.scorta!=null&&p.scorta!==''&&disp(p.id)<+p.scorta));
let pFilter='tutti',updAll=[];
const NF2=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',useGrouping:'always'}),eur2=n=>NF2.format(n||0);
const goOn=(el,fn)=>{el.tabIndex=0;el.setAttribute('role','button');el.onclick=fn;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}}};
function renderP(){if(tab==='home')renderH();const L=$('pList');L.textContent='';const q=nrm($('pq').value.trim());
  const a=prods.filter(p=>(pFilter!=='scorta'||lowOf(p))&&(!q||nrm([p.codice,p.nome,p.categoria,p.caratt,p.descr].join(' ')).includes(q))).sort((x,y)=>rsScore(pReasons(y))-rsScore(pReasons(x))||(y.attivo?1:0)-(x.attivo?1:0)||x.nome.localeCompare(y.nome,'it'));
  paintPSum();$('pCount').textContent=prods.length+(prods.length===1?' prodotto':' prodotti');
  if(!a.length){L.append(h('div','empty',prods.length?'Nessun risultato.':'Nessun prodotto. Tocca + per crearne uno.'));return}
  a.forEach(p=>{const c=h('div','oc pi pr'+(p.attivo?'':' off')),bd=h('div','pbd');goOn(c,()=>openProd(p));
    const t=h('div','prt'),pr=h('div','prp');pr.append(h('strong','',eur2(p.prezzo)),h('small','','/ '+p.unita));t.append(h('b','',p.nome),pr);
    bd.append(t,h('span','',[p.categoria,p.codice].filter(Boolean).join(' · ')||'\u00a0'));
    if(!p.attivo)bd.append(h('span','prs','Non attivo'));
    c.append(pthumb(p),bd);L.append(c)})}
function paintPSum(){const w=$('pSum');w.textContent='';const m=prods.filter(p=>p.mag),val=m.reduce((t,p)=>t+Math.max(0,giac(p.id))*(known(p)?+p.costo:0),0);
  [['Valore magazzino (al costo)',eur(val)],['Da riordinare o esauriti',String(m.filter(lowOf).length)]].forEach(([k,v])=>{const d=h('div','stat');d.append(h('span','',k),h('b','',v));w.append(d)});
  const f=$('pFilt');f.textContent='';[['tutti','Tutti'],['scorta','Da riordinare']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.style.background='var(--lilac)';b.classList.toggle('on',pFilter===k);b.onclick=()=>{pFilter=k;renderP()};f.append(b)})}
let pq_t;$('pq').oninput=()=>{clearTimeout(pq_t);pq_t=setTimeout(renderP,150)};
UNITA.forEach(u=>{const o=h('option','',u);o.value=u;$('p_unita').append(o)});
ALIQ.forEach(v=>{const o=h('option','',v+'%');o.value=v;$('p_iva').append(o)});
let pEd=null;
function openProd(p){pEd=p||null;try{paintCre('pSheet',p,'pr')}catch(e){}pFoto=p&&p.foto||'';paintPPhoto();const cats=[...new Set(prods.map(x=>x.categoria).filter(Boolean))].sort();$('p_catlist').textContent='';cats.forEach(c=>{const o=h('option');o.value=c;$('p_catlist').append(o)});$('p_categoria').value=p?p.categoria||'':'';$('p_caratt').value=p?p.caratt||'':'';$('p_codice').value=p?p.codice||'':'';$('p_nome').value=p?p.nome:'';$('p_descr').value=p?p.descr||'':'';$('p_unita').value=p?p.unita:'pz';$('p_prezzo').value=p?p.prezzo:'';$('p_costo').value=p&&known(p)?p.costo:'';pMarg();$('p_mag').checked=!!(p&&p.mag);$('p_scorta').value=p&&p.scorta!=null?p.scorta:'';$('p_g0').value='';setErr('p_scorta','');setErr('p_g0','');pStock();$('p_iva').value=p?p.iva:22;$('p_attivo').checked=p?!!p.attivo:true;
  ['p_codice','p_nome','p_prezzo','p_costo'].forEach(k=>setErr(k,''));$('pTitle').textContent=p?p.nome:'Nuovo prodotto';$('pDel').hidden=!p;$('pSheet').hidden=false;$('pSheet').scrollTop=0}
$('pClose').onclick=()=>{$('pSheet').hidden=true};
['p_codice','p_nome','p_prezzo','p_costo'].forEach(id=>$(id).addEventListener('input',()=>setErr(id,'')));
const pthumb=(p,sm)=>{const d=h('div','pth'+(sm?' sm':''));if(p&&p.foto){d.style.backgroundImage="url('"+okImg(p.foto)+"')";d.setAttribute('role','img');d.setAttribute('aria-label',p.nome||'Prodotto')}else d.innerHTML=ICONS.box;return d};
function toData(file,max){return new Promise((ok,ko)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.82))};
  img.onerror=()=>{URL.revokeObjectURL(u);ko(new Error('img'))};img.src=u})}
let pFoto='';
function paintPPhoto(){const b=$('pPhotoBtn');if(pFoto){b.style.backgroundImage="url('"+okImg(pFoto)+"')";b.innerHTML=''}else{b.style.backgroundImage='';b.innerHTML=ICONS.camera}$('pPhotoDel').hidden=!pFoto}
$('pPhotoBtn').onclick=()=>$('pPhotoFile').click();$('pPhotoDel').onclick=()=>{pFoto='';paintPPhoto()};
$('pPhotoFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{pFoto=await toData(f,640);paintPPhoto()}catch(err){toast('Immagine non leggibile.')}};
const stockLbl={carico:'Carico',scarico:'Scarico',rettifica:'Inventario'};
const num=v=>{const t=String(v).trim().replace(',','.');return t===''?null:Number(t)};
function pMarg(){const pr=num($('p_prezzo').value),co=num($('p_costo').value);$('p_marg').textContent=pr>=0&&co>=0&&pr!=null&&co!=null?'Margine per unità: '+eur2(pr-co)+(pr>0?' ('+pct((pr-co)/pr*100)+' sul prezzo)':''):'Facoltativo: serve a calcolare il margine di guadagno.'}
['p_prezzo','p_costo'].forEach(id=>$(id).addEventListener('input',pMarg));
$('pSave').onclick=()=>{const d={categoria:$('p_categoria').value.trim(),caratt:$('p_caratt').value.trim(),codice:$('p_codice').value.trim(),nome:$('p_nome').value.trim(),descr:$('p_descr').value.trim(),unita:$('p_unita').value,prezzo:parseFloat($('p_prezzo').value.replace(',','.')),iva:+$('p_iva').value,attivo:$('p_attivo').checked,costo:num($('p_costo').value),mag:$('p_mag').checked,scorta:num($('p_scorta').value),foto:pFoto};const g0=num($('p_g0').value);
  let ok=true;const bad=(k,t)=>{setErr('p_'+k,t);ok=false};
  if(!d.nome)bad('nome','Inserisci il nome del prodotto.');
  if(!(d.prezzo>=0))bad('prezzo','Inserisci un prezzo valido (0 o più).');
  if(d.costo!==null&&!(d.costo>=0))bad('costo','Inserisci un costo valido (0 o più) oppure lascia vuoto.');
  if(d.mag&&d.scorta!==null&&!(d.scorta>=0))bad('scorta','Inserisci una scorta valida (0 o più) oppure lascia vuoto.');
  if(d.mag&&g0!==null&&!(g0>=0))bad('g0','Inserisci una giacenza valida (0 o più).');
  if(d.codice&&prods.some(x=>x!==pEd&&(x.codice||'').toLowerCase()===d.codice.toLowerCase()))bad('codice','Questo codice è già usato da un altro prodotto.');
  if(!ok){const el=$('pSheet').querySelector('.bad');if(el)el.scrollIntoView({block:'center'});return}
  let pr=pEd;if(pr)Object.assign(pr,d);else{pr=stampNew({id:'p'+Date.now().toString(36),...d});prods.push(pr)}
  if(d.mag&&g0>0&&!movs.some(m=>m.prodId===pr.id)){movs.push(stampNew({id:'m'+Date.now().toString(36),prodId:pr.id,data:new Date().toISOString(),tipo:'carico',qta:g0,nota:'Giacenza iniziale'}));persistM()}
  persistP();$('pSheet').hidden=true;renderP()};
$('pDel').onclick=()=>{if(!pEd)return;const p=pEd;askConfirm('Eliminare il prodotto “'+p.nome+'”? Le opportunità e i preventivi già creati non cambiano.','trash','Elimina',()=>{prods=prods.filter(x=>x!==p);persistP();movs=movs.filter(m=>m.prodId!==p.id);persistM();$('pSheet').hidden=true;renderP();toast('Prodotto eliminato.')})};

/* selezione dal catalogo (dentro l'opportunità) */
function paintPick(){const L=$('pk_list');L.textContent='';const q=nrm($('pk_q').value.trim());
  const a=prods.filter(p=>p.attivo&&(!q||nrm([p.codice,p.nome,p.categoria,p.caratt,p.descr].join(' ')).includes(q))).sort((x,y)=>x.nome.localeCompare(y.nome,'it'));
  if(!a.length){L.append(h('div','empty',prods.some(p=>p.attivo)?'Nessun risultato.':'Il catalogo è vuoto: crea i prodotti dalla scheda Prodotti.'));return}
  a.forEach(p=>{const b=h('button','qrow'),t=h('div','tx');b.type='button';t.append(h('b','',p.nome),h('span','',[p.categoria,p.codice,p.unita].filter(Boolean).join(' · ')));if(p.mag){const dd=disp(p.id,oEd);t.append(h('span',dd<=0?'warn':'',dd<=0?'Esaurito':'Disponibili: '+dd+' '+p.unita))}b.append(pthumb(p,true),t,h('strong','',eur2(prezzoCPQ(p,cOf(),1).prezzo)));
    b.onclick=()=>{const r=prezzoCPQ(p,cOf(),1);oD.prodotti.push({prodId:p.id,nome:p.nome,unita:p.unita,qta:1,prezzo:r.prezzo,costo:known(p)?p.costo:null,iva:p.iva,sconto:r.sconto,auto:true});$('mPick').hidden=true;paintProd()};L.append(b)})}
$('o_addCat').onclick=()=>{$('pk_q').value='';paintPick();$('mPick').hidden=false};
$('pk_q').oninput=paintPick;$('pk_x').onclick=()=>{$('mPick').hidden=true};

/* ===== Preventivi ===== */
const STATI=[['bozza','Bozza','#d9d1f3'],['inviato','Inviato','#bfe0f8'],['accettato','Accettato','#b9e6d3'],['rifiutato','Rifiutato','#f5cad6']];
const COND='Prezzi in euro, IVA esclusa salvo diversa indicazione. Pagamento e tempi di consegna da concordare.';
const ivaOf=p=>p.iva==null?22:+p.iva,r2=n=>Math.round(n*100)/100;
function qTot(righe){const by={};let net=0;righe.forEach(p=>{const n=riga(p);net+=n;by[ivaOf(p)]=(by[ivaOf(p)]||0)+n});
  const iv=Object.keys(by).map(Number).sort((a,b)=>b-a).map(a=>[a,r2(by[a]),r2(by[a]*a/100)]);const imp=r2(net),iva=r2(iv.reduce((s,x)=>s+x[2],0));return{net:imp,iv,iva,lordo:r2(imp+iva)}}
const addDays=(d,n)=>{const x=new Date(d+'T00:00');x.setDate(x.getDate()+n);return ymd(x)};
const qExp=q=>{const v=Math.max(0,parseInt(q.validita,10)||0);return v?addDays(q.data,v):''};
const qInfo=q=>{const e=qExp(q),td=ymd(),L=[];if(q.inviato)L.push('inviato il '+fmtD(q.inviato)+(q.via?' via '+q.via:''));else if(q.stato==='bozza')L.push('non ancora inviato');
  if(e){const dd=Math.round((new Date(e+'T00:00')-new Date(td+'T00:00'))/864e5);L.push('valido fino al '+fmtD(e)+(q.stato==='accettato'||q.stato==='rifiutato'?'':dd<0?' (scaduto)':dd===0?' (scade oggi)':dd<=7?' (scade tra '+dd+' gg)':''))}return L.join(' · ')};
const stato=k=>STATI.find(x=>x[0]===k)||STATI[0];
const qEff=q=>{if((q.stato==='bozza'||q.stato==='inviato')&&q.validita){const e=qExp(q);if(e&&e<ymd())return 'scaduto'}return q.stato};
const statoE=k=>k==='scaduto'?['scaduto','Scaduto','#f5cad6']:stato(k);
function qStale(q,o){if(!q||q.stato!=='inviato')return 0;const cli=clients.find(x=>x.id===o.clienteId)||null;let n=0;(q.righe||[]).forEach(l=>{const pp=l.prodId&&prods.find(z=>z.id===l.prodId);if(!pp||l.auto!==true)return;const r=prezzoCPQ(pp,cli,+l.qta||1);if(r.prezzo!==+l.prezzo||r.sconto!==(+l.sconto||0))n++});return n}
function paintQ(){const L=$('o_quotes');L.textContent='';const qs=oEd&&oEd.preventivi||[];$('o_addQ').disabled=false;
  $('o_qhint').textContent=oEd?'Usa i prodotti attuali e salva l’opportunità.':'Aggiungi i prodotti: l’opportunità viene salvata da sola.';
  {const ns=qs.filter(q=>qStale(q,oEd)).length,ne=qs.filter(q=>qEff(q)==='scaduto').length,m=[];if(ns)m.push(ns===1?'1 preventivo inviato ha prezzi o sconti non aggiornati':ns+' preventivi inviati hanno prezzi o sconti non aggiornati');if(ne)m.push(ne===1?'1 preventivo è scaduto':ne+' preventivi sono scaduti');
   if(m.length){const a=h('div','hint',m.join(' · ')+'.');a.style.cssText='margin:0 0 8px;padding:10px 12px;border-radius:12px;background:#fdecec;color:#8a1f2f';L.append(a)}}
  qs.forEach(q=>{const b=h('div','qrow'),t=h('div','tx');goOn(b,()=>openQuote(oEd,q));
    const se=statoE(qEff(q)),sp=h('span'),ch=h('i','st',se[1]);ch.style.background=se[2];sp.append(ch,'del '+fmtD(q.data));const sp2=h('span','',qInfo(q));t.append(h('b','','Preventivo '+q.num),sp,sp2);if(qStale(q,oEd)){const w=h('span','warn','Prezzi non aggiornati');t.append(w)}b.append(t,h('strong','',eur2(qTot(q.righe).lordo)));L.append(b)})}
$('o_addQ').onclick=()=>{if(!saveOpp(true))return;if(!(oEd.prodotti||[]).length){toast('Aggiungi almeno un prodotto all’opportunità per creare il preventivo.');paintQ();return}
  const yr=String(new Date().getFullYear());let mx=0;opps.forEach(x=>(x.preventivi||[]).forEach(q=>{if(q.num.startsWith(yr+'-'))mx=Math.max(mx,parseInt(q.num.slice(5),10)||0)}));
  const q={id:'q'+Date.now().toString(36),num:yr+'-'+String(mx+1).padStart(3,'0'),data:ymd(),validita:S.qValid||30,stato:'bozza',righe:oEd.prodotti.map(p=>({...p})),cond:S.qCond||COND,note:''};
  openQuote(oEd,q,true)};
let qO=null,qC=null,qW=null;
let qNew=false;
function openQuote(o,q,isNew){qNew=!!isNew;qO=o;qC=q;if(q.stato==='bozza'&&o.fase!=='vinta'&&o.fase!=='persa'){const cli=clients.find(x=>x.id===o.clienteId)||null;(q.righe||[]).forEach(l=>{const pp=l.prodId&&prods.find(z=>z.id===l.prodId);if(!pp||l.auto!==true)return;const r=prezzoCPQ(pp,cli,+l.qta||1);l.prezzo=r.prezzo;l.sconto=r.sconto;if(known(pp))l.costo=pp.costo})}qW=JSON.parse(JSON.stringify(q));$('qTitle').textContent='Preventivo '+q.num;$('q_val').value=qW.validita;$('q_cond').value=qW.cond||'';$('q_note').value=qW.note||'';setErr('q_val','');paintStati();paintDoc();$('qSheet').hidden=false;$('qSheet').scrollTop=0}
function paintStati(){const w=$('q_stato');w.textContent='';const bi=$('q_info');bi.textContent=qInfo(qW);bi.style.background=statoE(qEff(qW))[2];
  {let al=$('q_alert');if(!al){al=h('div','hint');al.id='q_alert';al.style.cssText='margin:8px 0;padding:10px 12px;border-radius:12px;background:#fdecec;color:#8a1f2f;display:flex;gap:10px;align-items:center;flex-wrap:wrap';bi.after(al)}al.textContent='';
   const ex=qEff(qW)==='scaduto',st=qStale(qW,qO);al.hidden=!(ex||st);
   if(ex)al.append(h('div','','Preventivo scaduto il '+fmtD(qExp(qW))+'. Crea un nuovo preventivo o aggiorna la validità.'));
   if(st){const m=h('div','',(st===1?'Un prezzo non è aggiornato':st+' prezzi non sono aggiornati')+': catalogo o listino sono cambiati dopo la creazione.');m.style.flex='1 1 180px';al.append(m)}}STATI.forEach(s=>{const b=h('button','',s[1]);b.type='button';b.style.background=s[2];b.classList.toggle('on',qW.stato===s[0]);b.onclick=()=>{qW.stato=s[0];if(s[0]==='inviato'&&!qW.inviato)qW.inviato=ymd();paintStati()};w.append(b)})}
function paintDoc(){const d=$('qDoc');d.textContent='';const c=clients.find(x=>x.id===qO.clienteId),t=qTot(qW.righe),val=Math.max(0,parseInt(qW.validita,10)||0);
  d.append(h('h3','',S.azienda||'La tua azienda'),h('div','m','Preventivo n. '+qW.num+' del '+fmtD(qW.data)+(val?' · valido fino al '+fmtD(addDays(qW.data,val)):'')));
  d.append(h('p','','Spett.le '+(c?(c.tipo==='azienda'&&c.azienda?c.azienda:fullName(c)):'Cliente')+(c&&c.indirizzo?'\n'+c.indirizzo:'')));
  d.append(h('p','',qO.titolo));
  qW.righe.forEach(p=>{const l=h('div','ln'),x=h('div'),pp=prods.find(z=>z.id===p.prodId);if(pp&&pp.foto)l.append(pthumb(pp,true));x.append(h('b','',p.nome),h('span','',p.qta+(p.unita?' '+p.unita:'')+' × '+eur2(p.prezzo)+(+p.sconto?' − '+p.sconto+'%':'')+' · IVA '+ivaOf(p)+'%'));l.append(x,h('em','',eur2(riga(p))));d.append(l)});
  const row=(a,b,g)=>{const r=h('div','tt'+(g?' g':''));r.append(h('span','',a),h('span','',b));d.append(r)};
  row('Imponibile',eur2(t.net));t.iv.forEach(x=>row('IVA '+x[0]+'% su '+eur2(x[1]),eur2(x[2])));row('Totale',eur2(t.lordo),1);
  if((qW.cond||'').trim())d.append(h('p','m',qW.cond.trim()));if((qW.note||'').trim())d.append(h('p','',qW.note.trim()));const g=mg({prodotti:qW.righe});$('q_marg').textContent=g.ok?'Solo per te, non compare nel preventivo. Margine: '+eur2(g.mar)+' ('+pct(g.pct)+')'+(g.par?' sulle righe con costo':'')+'.':''}
$('q_val').addEventListener('input',()=>{const v=parseInt($('q_val').value,10);setErr('q_val',$('q_val').value===''||(v>=0&&v<=365)?'':'Inserisci un numero di giorni da 0 a 365.');qW.validita=v>=0?v:0;paintDoc();paintStati()});
$('q_cond').addEventListener('input',()=>{qW.cond=$('q_cond').value;paintDoc()});$('q_note').addEventListener('input',()=>{qW.note=$('q_note').value;paintDoc()});
const e2=n=>eur2(n).replace(/\u00a0/g,' ');
function quoteText(){const t=qTot(qW.righe),c=clients.find(x=>x.id===qO.clienteId),val=Math.max(0,parseInt(qW.validita,10)||0);
  const L=['Preventivo n. '+qW.num+' del '+fmtD(qW.data),'Oggetto: '+qO.titolo];if(val)L.push('Valido fino al '+fmtD(addDays(qW.data,val)));L.push('');
  qW.righe.forEach(p=>L.push('- '+p.nome+': '+p.qta+(p.unita?' '+p.unita:'')+' × '+e2(p.prezzo)+(+p.sconto?' (sconto '+p.sconto+'%)':'')+' = '+e2(riga(p))));
  L.push('','Imponibile: '+e2(t.net));t.iv.forEach(x=>L.push('IVA '+x[0]+'%: '+e2(x[2])));L.push('Totale: '+e2(t.lordo));
  if((qW.cond||'').trim())L.push('',qW.cond.trim());if((qW.note||'').trim())L.push('',qW.note.trim());return L.join('\n')}
function saveQuote(){const v=$('q_val').value;if(v!==''&&!(parseInt(v,10)>=0&&parseInt(v,10)<=365)){setErr('q_val','Inserisci un numero di giorni da 0 a 365.');return false}const wasSent=qC.stato==='inviato'||!!qC.inviato&&!qNew&&false;const prevSt=qNew?'bozza':qC.stato;if(qNew){(qO.preventivi=qO.preventivi||[]).push(qC);qNew=false;advOpp(qO,'qualificata')}Object.assign(qC,JSON.parse(JSON.stringify(qW)));if(qW.stato==='inviato'&&prevSt!=='inviato')advOpp(qO);if(qW.stato==='accettato'&&prevSt!=='accettato')accOpp(qO);persistO();paintQ();renderO();return true}
function accOpp(o){if(!o||['vinta','persa'].includes(o.fase))return;if(['nuova','qualificata'].includes(o.fase))advOpp(o);if((+o.prob||0)<75){o.prob=75;if(oEd===o&&oD&&!$('oSheet').hidden)$('o_prob').value=75;toast('Preventivo accettato: probabilità di vittoria al 75%.')}}
function advOpp(o,to){to=to||'proposta';const from=to==='qualificata'?['nuova']:['nuova','qualificata'];if(!o||!from.includes(o.fase))return;const f=FASI.find(x=>x[0]===to);o.fase=to;if(f)o.prob=f[2];if(oEd===o&&oD&&!$('oSheet').hidden){oD.fase=to;if(f)$('o_prob').value=f[2];paintFasi()}toast('Opportunità spostata in “'+(f?f[1]:to)+'”.')}
$('qSave').onclick=()=>{if(saveQuote()){$('qSheet').hidden=true;toast('Preventivo salvato.')}};
$('qClose').onclick=()=>{$('qSheet').hidden=true};
window.qNewClose=()=>{const c=$('qClose').onclick;$('qClose').onclick=()=>{if(!qNew){c();return}$('mDirty').hidden=false;$('dC').onclick=()=>{$('mDirty').hidden=true};$('dN').onclick=()=>{$('mDirty').hidden=true;qNew=false;$('qSheet').hidden=true};$('dY').onclick=()=>{$('mDirty').hidden=true;if(saveQuote()){$('qSheet').hidden=true;toast('Preventivo salvato.')}}}};
$('qCopy').onclick=async()=>{toast(await copyText(quoteText())?'Testo del preventivo copiato.':'Copia non riuscita.')};
$('qRefresh').onclick=()=>askConfirm('Sostituire le righe del preventivo con i prodotti attuali dell’opportunità?','reset','Aggiorna',()=>{if(!(qO.prodotti||[]).length){toast('L’opportunità non ha prodotti.');return}qW.righe=qO.prodotti.map(p=>({...p}));paintDoc()});
$('qSend').onclick=()=>{if(!saveQuote())return;const c=clients.find(x=>x.id===qO.clienteId);if(!c){toast('Cliente non trovato.');return}
  openCompose(c);if($('mCompose').hidden)return;$('mc_sub').value='Preventivo n. '+qW.num+(S.azienda?' – '+S.azienda:'');
  cmpQ=qC;cmpAtt=[{name:qName(),u8:quotePdf()}];$('mc_att').hidden=false;$('mc_att').textContent='Allegato: '+cmpAtt[0].name+' ('+Math.max(1,Math.round(cmpAtt[0].u8.length/1024))+' KB). '+attNote();mcActs();
  $('mc_body').value='Gentile '+contactName(c)+',\n\nin allegato il preventivo n. '+qW.num+' (totale '+e2(qTot(qW.righe).lordo)+').\n\nRestiamo a disposizione per qualsiasi chiarimento.\n\n'+firma();};
function markSent(q,msg,via){q.inviato=ymd();q.via=via||q.via||'';if(q.stato==='bozza')q.stato='inviato';advOpp(opps.find(o=>(o.preventivi||[]).includes(q))||qO);persistO();paintQ();renderO();if(qC===q){qW.stato=q.stato;qW.inviato=q.inviato;qW.via=q.via;paintStati()}return msg}
const qName=()=>'Preventivo-'+qW.num+'.pdf';
const b64=u8=>{let t='';for(let i=0;i<u8.length;i+=8192)t+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(t)};
async function savePdf(u8,name){try{const d=typeof claude!=='undefined'?await claude.use('downloads'):null;if(!d){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([u8]));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return true}await d.save({filename:name,data:u8});return true}catch(e){return false}}
$('qPdf').onclick=async()=>{if(!saveQuote())return;toast(await savePdf(quotePdf(),qName())?'PDF pronto.':'Salvataggio del PDF non disponibile qui.')};
$('qWa').onclick=async()=>{if(!saveQuote())return;const c=clients.find(x=>x.id===qO.clienteId);if(!c){toast('Cliente non trovato.');return}
  if(!c.telefono){toast('Aggiungi un numero di telefono al cliente.');return}
  const u8=quotePdf(),name=qName(),txt='Buongiorno '+contactName(c)+', le invio il preventivo n. '+qW.num+(S.azienda?' di '+S.azienda:'')+' (totale '+e2(qTot(qW.righe).lordo)+').';
  let shared=false;
  try{const f=new File([u8],name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});shared=true}}catch(e){if(e&&e.name==='AbortError')return}
  if(!shared){if(!(await savePdf(u8,name))){toast('PDF non salvato: invio annullato.');return}
    launch('https://wa.me/'+waNum(c)+'?text='+encodeURIComponent(txt),txt);toast(markSent(qC,'Allega il PDF salvato nella chat di WhatsApp. Preventivo impostato su “Inviato”.','WhatsApp'))}
  (c.wa=c.wa||[]).push({id:waId(),dir:'out',data:new Date().toISOString(),testo:txt+' [PDF '+name+']',fonte:'app'});persist();if(shared)toast(markSent(qC,'Preventivo condiviso. Impostato su “Inviato”.','WhatsApp'))};
function pdfDoc(){const W=595,H=842,pages=[];let cur=null;
  const enc=t=>{let o='';for(const ch of String(t)){let c=ch.charCodeAt(0);if(ch==='€')c=128;else if(ch==='’'||ch==='‘')c=39;else if(ch==='“'||ch==='”')c=34;else if(ch==='–'||ch==='—')c=45;else if(ch==='·')c=183;else if(c>255)c=63;if(c<32)c=32;o+=String.fromCharCode(c)}return o};
  const esc=t=>enc(t).replace(/[\\()]/g,m=>'\\'+m);
  const wd=(t,sz,b)=>{let w=0;for(const ch of enc(t))w+=" il.,:;'|!tfjI".includes(ch)?.28:'mwMW'.includes(ch)?.82:/[A-Z]/.test(ch)?.68:/[0-9\x80]/.test(ch)?.556:.52;return w*sz*(b?1.05:1)};
  const D={pages,wd,page(){cur=[];pages.push(cur);return cur},
    text(x,y,t,sz,b,al,g){if(!t&&t!==0)return;t=String(t);if(al==='r')x-=wd(t,sz,b);else if(al==='c')x-=wd(t,sz,b)/2;cur.push((g==null?'0.12':g)+' g BT /'+(b?'F2':'F1')+' '+sz+' Tf '+x.toFixed(1)+' '+(H-y).toFixed(1)+' Td ('+esc(t)+') Tj ET')},
    line(x1,y1,x2,y2,g,w){cur.push((g==null?'0.8':g)+' G '+(w||.6)+' w '+x1+' '+(H-y1)+' m '+x2+' '+(H-y2)+' l S')},
    rect(x,y,w,h,g){cur.push(g+' rg '+x+' '+(H-y-h)+' '+w+' '+h+' re f')},
    wrap(t,w,sz,b){const out=[];String(t).split('\n').forEach(par=>{let l='';par.split(/\s+/).filter(Boolean).forEach(wr=>{const tr=l?l+' '+wr:wr;if(wd(tr,sz,b)<=w||!l)l=tr;else{out.push(l);l=wr}});out.push(l)});return out},
    build(){pages.forEach((c,i)=>{cur=c;D.text(W/2,H-24,'Pagina '+(i+1)+' di '+pages.length,8,0,'c',.5)});
      const objs=[];const add=b=>objs.push(b)-1;
      add('<< /Type /Catalog /Pages 2 0 R >>');add(null);add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
      const kids=[];pages.forEach(c=>{const st=c.join('\n'),ci=objs.length+1,pi=objs.length;add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+(ci+1)+' 0 R >>');add('<< /Length '+st.length+' >>\nstream\n'+st+'\nendstream');kids.push((pi+1)+' 0 R')});
      objs[1]='<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+kids.length+' >>';
      let out='%PDF-1.4\n',off=[];objs.forEach((o,i)=>{off.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n'});
      const x=out.length;out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF';
      const u=new Uint8Array(out.length);for(let i=0;i<out.length;i++)u[i]=out.charCodeAt(i)&255;return u}};
  return D}



const CRC_T=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t.push(c>>>0)}return t})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC_T[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
async function zipOne(name,u8){
  let data=u8,method=0;
  try{if(typeof CompressionStream!=='undefined'){const cs=new Blob([u8]).stream().pipeThrough(new CompressionStream('deflate-raw'));const z=new Uint8Array(await new Response(cs).arrayBuffer());if(z.length<u8.length){data=z;method=8}}}catch(e){}
  const nm=new TextEncoder().encode(name),d=new Date(),tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate(),crc=crc32(u8);
  const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(8,method,true);lh.setUint16(10,tm,true);lh.setUint16(12,dt,true);lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,u8.length,true);lh.setUint16(26,nm.length,true);
  const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(10,method,true);ch.setUint16(12,tm,true);ch.setUint16(14,dt,true);ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,u8.length,true);ch.setUint16(28,nm.length,true);
  const off=30+nm.length+data.length,cdSize=46+nm.length,eo=new DataView(new ArrayBuffer(22));eo.setUint32(0,0x06054b50,true);eo.setUint16(8,1,true);eo.setUint16(10,1,true);eo.setUint32(12,cdSize,true);eo.setUint32(16,off,true);
  const out=new Uint8Array(off+cdSize+22);let o=0;[new Uint8Array(lh.buffer),nm,data,new Uint8Array(ch.buffer),nm,new Uint8Array(eo.buffer)].forEach(x=>{out.set(x,o);o+=x.length});return out}
const fromB64=t=>{const b=atob(t),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
const sedeLines=(D,x,y,w,max)=>{const t=[S.indirizzo,S.piva?'P. IVA '+S.piva:'',S.telefono,S.sito].filter(Boolean).join(' · ');if(!t)return 0;const ls=D.wrap(t,w,8.5,0).slice(0,max);ls.forEach((l,i)=>D.text(x,y+i*11,l,8.5,0,'l',.45));return ls.length};
/* listino per il destinatario: se ha un listino attivo (per nazione o generale) si usano i suoi prezzi, altrimenti il prezzo base del catalogo */
function priceListPdf(cli){const LS=(()=>{try{return cli?listinoFor(cli):null}catch(e){return null}})(),px=p=>LS?prezzoCPQ(p,cli,1).prezzo:(+p.prezzo||0);
  const D=pdfDoc(),L=40,R=555,BOT=790,list=prods.filter(p=>p.attivo!==false&&px(p)>0).map(p=>Object.assign({},p,{prezzo:px(p)})).sort((a,b)=>((a.categoria||'')+a.nome).localeCompare((b.categoria||'')+b.nome,'it'));
  let y=50;D.page();
  const head=()=>{D.text(L,y+8,'Prodotto',8.5,1,'l',.35);D.text(330,y+8,'Unità',8.5,1,'r',.35);D.text(415,y+8,'Prezzo IVA escl.',8.5,1,'r',.35);D.text(R-70,y+8,'IVA',8.5,1,'r',.35);D.text(R,y+8,'Prezzo IVA incl.',8.5,1,'r',.35);D.line(L,y+14,R,y+14,.55,.8);y+=24};
  D.rect(0,0,595,6,'0.65 0.86 0.78');
  D.text(L,y+10,S.azienda||'La tua azienda',17,1);sedeLines(D,L,y+30,300,2);D.text(R,y+10,'LISTINO PREZZI',13,1,'r',.35);D.text(R,y+26,(LS?LS.nome+' · ':'')+'aggiornato al '+fmtD(ymd()),10,0,'r');
  y+=64;D.line(L,y,R,y,.85,.8);y+=20;head();let cat=null;
  list.forEach(p=>{const nl=D.wrap(p.nome,250,10,1),h=nl.length*13+12,hc=(p.categoria||'')!==cat?22:0;if(y+h+hc>BOT){D.page();y=50;head()}
    if(hc){cat=p.categoria||'';D.text(L,y+4,cat||'Altri prodotti',9.5,1,'l',.4);y+=hc}
    nl.forEach((l,i)=>D.text(L+6,y+i*13+3,l,10,1));D.text(330,y+3,p.unita||'',10,0,'r');D.text(415,y+3,e2(p.prezzo),10,0,'r');D.text(R-70,y+3,(+p.iva||0)+'%',10,0,'r');D.text(R,y+3,e2(p.prezzo*(1+(+p.iva||0)/100)),10,1,'r');
    y+=h;D.line(L,y-5,R,y-5,.92,.5)});
  if(!list.length)D.text(L,y+10,'Nessun prodotto attivo con prezzo.',10,0,'l',.5);
  y+=14;if(LS&&(LS.scaglioni||[]).length){const sc=LS.scaglioni.slice().sort((a,b)=>a.da-b.da).map(x=>'da '+x.da+' pezzi −'+x.pct+'%').join(' · ');D.wrap('Sconti per quantità: '+sc+'.',R-L,9,1).forEach(l=>{if(y>BOT){D.page();y=50}D.text(L,y,l,9,1,'l',.35);y+=12});y+=4}
  D.wrap('Prezzi in euro, validi salvo variazioni e salvo errori od omissioni. Per quantità e condizioni particolari contattaci per un preventivo.',R-L,9,0).forEach(l=>{if(y>BOT){D.page();y=50}D.text(L,y,l,9,0,'l',.35);y+=12});
  return D.build()}
const brochureOk=()=>!!(S.brochure&&S.brochure.b64);
function quotePdf(){const D=pdfDoc(),c=clients.find(x=>x.id===qO.clienteId),t=qTot(qW.righe),val=Math.max(0,parseInt(qW.validita,10)||0),L=40,R=555,TOP=50,BOT=790;
  let y=TOP;D.page();
  const need=n=>{if(y+n>BOT){D.page();y=TOP;head()}};
  const head=()=>{D.text(L,y+8,'Descrizione',8.5,1,'l',.35);D.text(300,y+8,'Qtà',8.5,1,'r',.35);D.text(360,y+8,'Prezzo',8.5,1,'r',.35);D.text(395,y+8,'Sc. %',8.5,1,'r',.35);D.text(430,y+8,'IVA',8.5,1,'r',.35);D.text(R,y+8,'Importo',8.5,1,'r',.35);D.line(L,y+14,R,y+14,.55,.8);y+=24};
  D.rect(0,0,595,6,'0.65 0.86 0.78');
  D.text(L,y+10,S.azienda||'La tua azienda',17,1);sedeLines(D,L,y+30,300,3);
  D.text(R,y+10,'PREVENTIVO',13,1,'r',.35);D.text(R,y+26,'n. '+qW.num,10,0,'r');D.text(R,y+40,'del '+fmtD(qW.data),10,0,'r');if(val)D.text(R,y+54,'valido fino al '+fmtD(addDays(qW.data,val)),9,0,'r',.4);
  y+=84;D.line(L,y,R,y,.85,.8);y+=22;
  D.text(L,y,'Spett.le',8.5,0,'l',.5);y+=14;
  const nm=c?(c.tipo==='azienda'&&c.azienda?c.azienda:fullName(c)):'Cliente';D.text(L,y,nm,12,1);y+=15;
  if(c&&c.tipo==='azienda'&&(c.nome||c.cognome))D.text(L,y,'c.a. '+[c.nome,c.cognome].filter(Boolean).join(' '),10,0);y+=(c&&c.tipo==='azienda'&&(c.nome||c.cognome))?14:0;
  if(c&&c.indirizzo)D.wrap(c.indirizzo,300,10,0).forEach(l=>{D.text(L,y,l,10,0);y+=13});
  if(c&&c.piva){D.text(L,y,'P. IVA '+c.piva,9,0,'l',.4);y+=13}
  y+=12;D.wrap('Oggetto: '+qO.titolo,R-L,11,1).forEach(l=>{D.text(L,y,l,11,1);y+=15});y+=10;
  head();
  qW.righe.forEach(p=>{const nl=D.wrap(p.nome,235,10,1),sub=(p.unita?'Unità: '+p.unita:''),h=nl.length*13+(sub?11:0)+12;need(h);
    nl.forEach((l,i)=>D.text(L,y+i*13+3,l,10,1));if(sub)D.text(L,y+nl.length*13+2,sub,8,0,'l',.5);
    D.text(300,y+3,String(p.qta),10,0,'r');D.text(360,y+3,e2(p.prezzo),10,0,'r');D.text(395,y+3,+p.sconto?p.sconto+'%':'-',10,0,'r');D.text(430,y+3,ivaOf(p)+'%',10,0,'r');D.text(R,y+3,e2(riga(p)),10,1,'r');
    y+=h;D.line(L,y-7,R,y-7,.9,.5)});
  y+=10;need(30+t.iv.length*15);
  const tr=(a,b,g)=>{D.text(430,y,a,g?12:10,g,'r',g?.12:.35);D.text(R,y,b,g?12:10,g,'r');y+=g?19:15};
  tr('Imponibile',e2(t.net));t.iv.forEach(x=>tr('IVA '+x[0]+'% su '+e2(x[1]),e2(x[2])));D.line(330,y-8,R,y-8,.7,.8);y+=4;tr('Totale',e2(t.lordo),1);
  y+=14;
  [['Condizioni',qW.cond],['Note',qW.note]].forEach(([k,v])=>{if(!(v||'').trim())return;const ls=D.wrap(v.trim(),R-L,9,0);need(16+ls.length*12);D.text(L,y,k,8.5,1,'l',.4);y+=13;ls.forEach(l=>{D.text(L,y,l,9,0,'l',.25);y+=12});y+=8});
  return D.build()}
$('qDel').onclick=()=>askConfirm('Eliminare il preventivo '+qC.num+'?','trash','Elimina',()=>{qO.preventivi=qO.preventivi.filter(x=>x!==qC);persistO();$('qSheet').hidden=true;paintQ();renderO();toast('Preventivo eliminato.')});

function pStock(){const on=$('p_mag').checked;$('p_magbox').hidden=!on;if(!on)return;
  const has=pEd&&pEd.mag,hm=pEd&&movs.some(m=>m.prodId===pEd.id);$('p_g0w').hidden=!!hm;$('p_acts').hidden=!has;
  const w=$('p_stock'),H=$('p_hist');w.textContent='';H.textContent='';w.hidden=!has;if(!has)return;
  const g=giac(pEd.id),i=impeg(pEd.id),d=g-i;[['Giacenza',g],['Impegnati',i],['Disponibili',d]].forEach(([k,v])=>{const e=h('div','stat');e.append(h('span','',k),h('b',k==='Disponibili'&&d<=0?'warn':'',v+' '+pEd.unita));w.append(e)});
  movs.filter(m=>m.prodId===pEd.id).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,8).forEach(m=>H.append(h('div','logi',fmtDT(m.data)+' · '+(stockLbl[m.tipo]||m.tipo)+' '+(m.qta>0?'+':'')+m.qta+(m.nota?' · '+m.nota:''))))}
$('p_mag').addEventListener('change',pStock);
let mvT='';
function openMov(t){mvT=t;$('mvTitle').textContent=({carico:'Carico (merce in entrata)',scarico:'Scarico (merce in uscita)',rettifica:'Inventario (giacenza contata)'})[t]+' – '+pEd.nome;
  $('mv_lbl').textContent=t==='rettifica'?'Giacenza contata ('+pEd.unita+')':'Quantità ('+pEd.unita+')';$('mv_qta').value=t==='rettifica'?giac(pEd.id):'';$('mv_nota').value='';setErr('mv_qta','');$('mMov').hidden=false}
$('mv_c').onclick=()=>openMov('carico');$('mv_s').onclick=()=>openMov('scarico');$('mv_r').onclick=()=>openMov('rettifica');$('mv_x').onclick=()=>{$('mMov').hidden=true};
$('mv_qta').addEventListener('input',()=>setErr('mv_qta',''));
$('mv_ok').onclick=()=>{const v=num($('mv_qta').value),g=giac(pEd.id);let q;
  if(mvT==='rettifica'){if(v===null||!(v>=0)){setErr('mv_qta','Inserisci la giacenza contata (0 o più).');return}q=v-g;if(q===0){setErr('mv_qta','La giacenza è già questa.');return}}
  else{if(!(v>0)){setErr('mv_qta','Inserisci una quantità maggiore di zero.');return}q=mvT==='carico'?v:-v;if(q<0&&-q>g){setErr('mv_qta','Giacenza insufficiente: ce ne sono '+g+'.');return}}
  movs.push(stampNew({id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),prodId:pEd.id,data:new Date().toISOString(),tipo:mvT,qta:Math.round(q*1000)/1000,nota:$('mv_nota').value.trim()}));persistM();$('mMov').hidden=true;pStock();renderP();toast('Movimento registrato.')};
/* collegamento opportunità - magazzino */
const mprod=id=>{const p=prods.find(x=>x.id===id);return p&&p.mag?p:null};
function afterOppSave(o){const short=[];(o.prodotti||[]).forEach(r=>{const pr=mprod(r.prodId);if(!pr||o.scaricato)return;const need=o.prodotti.filter(x=>x.prodId===r.prodId).reduce((t,x)=>t+(+x.qta||0),0);if(need>disp(r.prodId,o)&&!short.includes(pr.nome))short.push(pr.nome)});
  const rows=(o.prodotti||[]).filter(r=>mprod(r.prodId));
  if(o.fase==='vinta'&&!o.scaricato&&rows.length){askConfirm('Scaricare dal magazzino i prodotti di “'+o.titolo+'”?'+(short.length?' Attenzione: la disponibilità non basta per '+short.join(', ')+'.':''),'scarico','Scarica',()=>{rows.forEach(r=>movs.push(stampNew({id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),prodId:r.prodId,data:new Date().toISOString(),tipo:'scarico',qta:-(+r.qta||0),nota:'Opportunità '+o.titolo,oppId:o.id})));o.scaricato=true;persistM();persistO();renderO();renderP();toast('Magazzino aggiornato.')});return}
  if(short.length)toast('Attenzione: disponibilità insufficiente per '+short.join(', ')+'.')}

/* ===== Home ===== */
let hAll=false;
function actions(){const A=[],noInf=[],td=ymd(),add=(pri,ic,title,sub,go)=>A.push({pri,ic,title,sub,go});
  clients.forEach(c=>{const b=bday(c.nascita);if(b&&b.days<=7)add(b.days===0?90:60-b.days,'gift','Compleanno di '+fullName(c),(b.days===0?'Oggi':b.days===1?'Domani':'Tra '+b.days+' giorni')+' · '+(b.age+(b.days===0?0:1))+' anni',()=>openSheet(c));
    const pv=c.privacy;if(!pv||!pv.informativa)noInf.push(c);
    (pv&&pv.richieste||[]).forEach(r=>{if(effSt(r)==='scaduta')add(62,'clock','Richiesta consensi scaduta',fullName(c)+' · codice '+r.token,()=>openSheet(c))})});
  clients.forEach(c=>{if(c.rich&&c.rich<=td)add(c.rich<td?88:84,'Chiama','Richiama '+fullName(c),c.rich<td?'In ritardo dal '+fmtD(c.rich):'Da richiamare oggi',()=>openSheet(c))});
  (typeof leads!=='undefined'?leads:[]).forEach(l=>{if(l.rich&&l.rich<=td&&l.stato!=='scartato')add(l.rich<td?88:84,'Chiama','Richiama '+fullName(l),l.rich<td?'In ritardo dal '+fmtD(l.rich):'Da richiamare oggi',()=>openLead(l))});
  const nl=(typeof leads!=='undefined'?leads:[]).filter(l=>l.stato==='nuovo').length;if(nl)add(70,'plus',nl===1?'1 lead da valutare':nl+' lead da valutare','Convertili in prospect o scartali',()=>setTab('lead'));
  opps.forEach(o=>{const open=o.fase!=='vinta'&&o.fase!=='persa',cn=cname(o.clienteId);
    if(open&&o.data&&o.data<td)add(75,'clock','Chiusura prevista scaduta',o.titolo+' · '+cn,()=>openOpp(o));
    if(open&&RES_FASI.includes(o.fase)&&(o.prodotti||[]).length&&!(o.preventivi||[]).length)add(50,'doc','Crea il preventivo',o.titolo+' · '+cn,()=>openOpp(o));
    (o.preventivi||[]).forEach(q=>{if(q.stato!=='bozza'&&q.stato!=='inviato')return;const exp=addDays(q.data,Math.max(0,parseInt(q.validita,10)||0)),age=Math.round((new Date(td+'T00:00')-new Date(q.data+'T00:00'))/864e5);
      const go=()=>{openOpp(o);openQuote(o,q)};
      if(qStale(q,o)>0)add(75,'alert','Preventivo '+q.num+': prezzi non aggiornati',cn+' · catalogo o listino sono cambiati',go);
      if(q.validita&&exp<td)add(80,'alert','Preventivo '+q.num+' scaduto',cn+' · era valido fino al '+fmtD(exp),go);
      else if(q.stato==='inviato'&&age>=5)add(70,'Scrivi','Sollecita il preventivo '+q.num,cn+' · inviato da '+age+' giorni',go);
      else if(q.stato==='bozza'&&age>=2)add(40,'doc','Completa e invia il preventivo '+q.num,cn+' · bozza da '+age+' giorni',go)});
    if(o.fase==='vinta'&&!o.scaricato&&(o.prodotti||[]).some(r=>mprod(r.prodId)))add(85,'scarico','Scarica il magazzino',o.titolo+' · '+cn,()=>openOpp(o))});
  if(noInf.length===1)add(55,'alert','Informativa privacy da inviare',fullName(noInf[0]),()=>openSheet(noInf[0]));else if(noInf.length>1)add(55,'alert',noInf.length+' clienti senza informativa privacy',noInf.slice(0,3).map(fullName).join(', ')+(noInf.length>3?'…':''),()=>setTab('clienti'));
  (typeof leads!=='undefined'?leads:[]).filter(l=>l.stato==='nuovo').forEach(l=>{const m=lMsgs(l)[0];if(m&&lUnread(l,14))add(76,m.via==='WhatsApp'?'WhatsApp':'Scrivi','Il lead ha risposto',([l.nome,l.cognome].filter(Boolean).join(' ')||l.email||'Lead')+' · '+String(m.testo||'').slice(0,50),()=>{setTab('lead');openLead(l)})});
  clients.forEach(c=>{((c.privacy&&c.privacy.richieste)||[]).forEach(r=>{if(AUTOREP[r.token]&&effSt(r)==='inviata')add(77,'check','Risposta ai consensi ricevuta',fullName(c)+' · da confermare',()=>{openSheet(c);setPane('priv')})})});
  {const nli=(typeof leads!=='undefined'?leads:[]).filter(l=>l.stato==='nuovo'&&!l.inf);if(nli.length===1){const l=nli[0];add(54,'alert','Informativa privacy da inviare al lead',[l.nome,l.cognome].filter(Boolean).join(' ')||l.email||'Lead',()=>{setTab('lead');openLead(l)})}else if(nli.length>1)add(54,'alert',nli.length+' lead senza informativa privacy',nli.slice(0,3).map(l=>[l.nome,l.cognome].filter(Boolean).join(' ')||l.email||'Lead').join(', ')+(nli.length>3?'…':''),()=>setTab('lead'))}
  clients.forEach(c=>{const a=waLast(c);if(waUnread(c))add(78,'WhatsApp','Rispondi su WhatsApp',fullName(c)+' · '+a.testo.slice(0,50),()=>{openSheet(c);setPane('comm');setCm('wa');loadComm()})});
  {const I=reviewItems();I.anon.forEach(c=>{const a=c.privacy.anon,n=daysTo(a.scade);add(n<0?96:n<=10?92:72,'shield','Richiesta di anonimizzazione',fullName(c)+' · '+(n<0?'scaduta da '+(-n)+' gg':'entro '+fmtD(a.scade)),()=>{openSheet(c);setPane('priv')})})}
  {const I=reviewItems(),n=I.exp.length+I.cons.length+(I.msg.n?1:0);if(n)add(58,'shield','Revisione conservazione dati',(I.exp.length?I.exp.length+' dati scaduti':'')+(I.cons.length?(I.exp.length?' · ':'')+I.cons.length+' consensi da rivedere':'')+(I.msg.n?((I.exp.length||I.cons.length)?' · ':'')+I.msg.n+' messaggi scaduti':''),openReview)}
  const low=prods.filter(lowOf);if(low.length)add(65,'box',low.length===1?'Prodotto da riordinare':low.length+' prodotti da riordinare',low.slice(0,3).map(x=>x.nome).join(', ')+(low.length>3?'…':''),()=>{window.pSec='mag';window.magFilter('sc');setTab('prod')});
  return A.sort((a,b)=>b.pri-a.pri)}
function infoBtn(el,text){el.style.position='relative';const b=document.createElement('button');b.type='button';b.className='ib';b.setAttribute('aria-label','Informazioni');b.title='Informazioni';b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';let tip=null;
  b.onclick=e=>{e.stopPropagation();if(tip){tip.remove();tip=null;b.classList.remove('on');return}tip=document.createElement('div');tip.className='itip';tip.textContent=text;el.append(tip);b.classList.add('on')};el.append(b)}
function renderH(){
  const hr=new Date().getHours(),op=(()=>{try{return localStorage.getItem('crm-op')||''}catch(e){return''}})();
  try{paintWel()}catch(e){}
  $('hGreet').textContent=(hr<13?'Buongiorno':hr<18?'Buon pomeriggio':'Buonasera')+(op?', '+op:'');
  const dt=new Intl.DateTimeFormat('it-IT',{weekday:'long',day:'numeric',month:'long'}).format(new Date());$('hDate').textContent=(S.azienda?S.azienda+' · ':'')+dt.charAt(0).toUpperCase()+dt.slice(1);
  const open=opps.filter(o=>o.fase!=='vinta'&&o.fase!=='persa'),sm=(a,f)=>a.reduce((t,o)=>t+(+f(o)||0),0),won=opps.filter(o=>o.fase==='vinta');
  {const S0=$('hSum');S0.textContent='';
   const t1=h('div','stat');{const l1=h('span','','Aperte ');l1.append(h('small','','('+open.length+')'));t1.append(l1,h('b','',eur(sm(open,o=>o.valore))))}
   const t2=h('div','stat');t2.append(h('span','','Ponderato'),h('b','',eur(sm(open,o=>o.valore*o.prob/100))));
   S0.append(t1,t2);infoBtn(t1,'Opportunità non ancora vinte né perse: tra parentesi quante sono, sotto il loro valore totale.');infoBtn(t2,'Ogni opportunità aperta conta per la sua probabilità di chiusura (es. 1.000 € al 50% = 500 €): è una stima di quanto ti aspetti di incassare.');
   const PER=[[30,'30 giorni'],[90,'90 giorni'],[365,'12 mesi'],[0,'Sempre']];let hp=30;try{const v=localStorage.getItem('crm-hper');if(v!==null&&PER.some(x=>x[0]===+v))hp=+v}catch(e){}
   const from=hp?ymd(new Date(Date.now()-hp*864e5)):'',wp=won.filter(o=>!hp||(o.chiusa&&o.chiusa>=from)),tot=sm(wp,o=>o.valore),mar=sm(wp,o=>mg(o).mar),pc=tot>0?Math.round(mar/tot*100):0;
   const box=h('div','wonbox'),hd=h('div','wb-h');hd.append(h('b','','Vinte'));
   const chips=h('div','tp-chips');PER.forEach(([d,l])=>{const b=h('button');b.type='button';b.classList.toggle('on',hp===d);b.textContent=l;b.onclick=()=>{try{localStorage.setItem('crm-hper',String(d))}catch(e){}renderH()};chips.append(b)});
   const vals=h('div','wb-v');vals.append(h('span','',eur(tot)));vals.append(h('small','',wp.length+(wp.length===1?' opportunità vinta':' opportunità vinte')));
   const tr=h('div','wb-tr'),fill=h('i');fill.style.width=(tot>0?Math.max(2,Math.min(100,pc)):0)+'%';tr.append(fill);
   const lg=h('div','wb-l');lg.append(h('span','','Margine '+eur(mar)),h('span','',tot>0?pc+'% del totale':'—'));
   const first=opps.reduce((m,o)=>{const d=[o.creata,o.chiusa].filter(Boolean).sort()[0];return d&&(!m||d<m)?d:m},''),cmp=(cur,prev,lab)=>{if(!hp||(!cur&&!prev)||!first||first>pf)return null;const d=h('span','cmp');const up=cur>=prev;d.style.cssText='font-size:12px;padding:2px 8px;border-radius:10px;background:'+(up?'#b5ebc0':'#f5cad6')+';color:#2d2b55';d.textContent=prev>0?(up?'+':'−')+Math.abs(Math.round((cur-prev)/prev*100))+'% '+lab:'';return d.textContent?d:null};
   const pf=hp?ymd(new Date(Date.now()-2*hp*864e5)):'',pw=hp?won.filter(o=>o.chiusa&&o.chiusa>=pf&&o.chiusa<from):[],ptot=sm(pw,o=>o.valore),pmar=sm(pw,o=>mg(o).mar);const cv=cmp(tot,ptot,'vs '+hp+' gg prima'),cm=cmp(mar,pmar,'vs prima');if(cv)vals.append(cv);
   if(cm)lg.firstChild.after(cm);box.append(hd,chips,vals,tr,lg);infoBtn(box,'Valore delle opportunità vinte nel periodo scelto (il periodo vale solo per le vinte). La parte colorata della barra è il margine. Le etichette confrontano con lo stesso numero di giorni precedenti, solo se i tuoi dati partono prima di quel periodo.');if(!wp.length)box.append(h('div','hint','Nessuna opportunità vinta in questo periodo.'));$('hWon').textContent='';$('hWon').append(box)}
  const A=actions(),T=$('hTodo');T.textContent='';const show=hAll?A:A.slice(0,5);
  if(!A.length)T.append(h('div','empty','Tutto in ordine: nessuna azione consigliata.'));
  show.forEach(a=>{const r=h('div','qrow todo'),t=h('div','tx'),ic=pthumb(null,true);ic.innerHTML=ICONS[a.ic]||ICONS.alert;ic.style.background=a.pri>=80?'var(--pink)':a.pri>=60?'var(--warm)':'var(--lilac)';goOn(r,a.go);t.append(h('b','',a.title),h('span','',a.sub));const cv=h('span','chv');cv.innerHTML=ICONS.chevR;r.append(ic,t,cv);T.append(r)});
  const mo=$('hMore');mo.hidden=A.length<=5;mo.textContent=hAll?'Mostra meno':'Mostra tutte ('+A.length+')';mo.onclick=()=>{hAll=!hAll;renderH()};
  const P=$('hPipe');P.textContent='';const FA=FASI.filter(f=>f[0]!=='vinta'&&f[0]!=='persa'),mx=Math.max(1,...FA.map(f=>sm(opps.filter(o=>o.fase===f[0]),o=>o.valore)));
  FA.forEach(f=>{const it=opps.filter(o=>o.fase===f[0]),v=sm(it,o=>o.valore),b=h('button','pbar');b.type='button';b.onclick=()=>{oFilt=f[0];setTab('opp');renderO();window.scrollTo(0,0)};const tr=h('div','tr'),bar=h('i');bar.style.width=(it.length?Math.max(4,v/mx*100):0)+'%';bar.style.background=f[3];tr.append(bar);const lb=h('span','',f[1]+' ');lb.append(h('small','','('+it.length+')'));const mr=sm(it,o=>mg(o).mar),em=h('em','',eur(v));em.append(h('small','','margine '+eur(mr)));b.setAttribute('aria-label',f[1]+': '+it.length+' opportunità, valore '+eur(v)+', margine '+eur(mr));b.append(lb,tr,em);P.append(b)});
  $('hPipeBox').hidden=!opps.length;if(!$('hPipeBox').querySelector('.ib'))infoBtn($('hPipeBox'),'Opportunità aperte per fase: tra parentesi quante sono, a destra il valore totale e sotto il margine stimato. La barra mette a confronto i valori delle fasi.')}


/* ===== registro chiamate ===== */
const CALLK='crm-call-v1',ESITI=[['ok','Ha risposto'],['no','Non risponde'],['occ','Occupato'],['seg','Segreteria'],['err','Numero errato']];
const esLabel=k=>(ESITI.find(e=>e[0]===k)||['','Chiamata'])[1];
const callTxt=k=>(k.nota||'')+(k.rich?(k.nota?'\n':'')+'Richiama il '+fmtD(k.rich):'');
let callCur=null;
function callMark(rec){try{localStorage.setItem(CALLK,JSON.stringify({id:rec.id,lead:leads.includes(rec),t0:Date.now()}))}catch(e){}}
function callClear(){try{localStorage.removeItem(CALLK)}catch(e){}}
function callCheck(){let p=null;try{p=JSON.parse(localStorage.getItem(CALLK)||'null')}catch(e){}
  if(!p||!$('mCall').hidden||callCur)return;const el=Date.now()-p.t0;if(el<0||el>3*36e5){callClear();return}if(el<4000)return;
  if(document.documentElement.classList.contains('noauth'))return;
  const rec=(p.lead?leads:clients).find(x=>x.id===p.id);if(!rec){callClear();return}openCallSheet(rec,p)}
function paintCallEs(){const B=$('cl_es');B.textContent='';ESITI.forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.classList.toggle('on',callCur.es===k);b.onclick=()=>{callCur.es=k;paintCallEs()};B.append(b)});$('cl_dw').hidden=callCur.es!=='ok'}
function paintCallRq(){const Q=$('cl_rq');Q.textContent='';[['Domani',1],['Tra 3 giorni',3],['Tra una settimana',7]].forEach(([l,n])=>{const b=h('button','',l);b.type='button';b.onclick=()=>{$('cl_ric').value=addDays(ymd(),n)};Q.append(b)})}
function openCallSheet(rec,p){callCur={rec,lead:!!p.lead,t0:p.t0,es:'ok'};$('cl_t').textContent='Com’è andata la chiamata?';$('cl_dtw').hidden=true;
  $('cl_who').textContent=fullName(rec)+(rec.telefono?' · '+rec.telefono:'');
  $('cl_dur').value=String(Math.max(1,Math.round((Date.now()-p.t0)/60000)));$('cl_nota').value='';$('cl_ric').value='';setErr('cl_dur','');
  paintCallEs();paintCallRq();
  $('mCall').hidden=false}
$('cl_ok').onclick=()=>{const c=callCur;if(!c)return;let dur=0;
  if(c.es==='ok'){dur=parseInt($('cl_dur').value,10);if(!(dur>=0&&dur<=600)){setErr('cl_dur','Inserisci i minuti (da 0 a 600).');return}}
  let t0=c.t0;if(c.manual){t0=new Date($('cl_dt').value).getTime();if(isNaN(t0)){setErr('cl_dt','Inserisci data e ora.');return}setErr('cl_dt','')}
  const e={id:'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),data:new Date(t0).toISOString(),esito:c.es,dur,nota:$('cl_nota').value.trim().slice(0,2000),rich:$('cl_ric').value||''},rec=c.rec;
  (rec.calls=rec.calls||[]).push(e);if(!c.manual||e.rich)rec.rich=e.rich;if(!c.lead&&c.es==='ok')rec.agg=new Date().toISOString();
  if(!c.manual)callClear();$('mCall').hidden=true;callCur=null;
  if(c.lead){persistL();try{paintLM()}catch(x){}try{renderL()}catch(x){}}else{persist();try{paintAllC()}catch(x){}try{render()}catch(x){}}
  try{renderH()}catch(x){}toast('Chiamata registrata.')};
$('cl_x').onclick=()=>{if(!(callCur&&callCur.manual))callClear();$('mCall').hidden=true;callCur=null};

/* sezione Chiamate (cliente e lead) */
function callCard(rec,k,isLead){const d=h('div','req'),ch=h('i','chip',esLabel(k.esito)+(k.esito==='ok'?' · '+k.dur+' min':''));ch.style.background=k.esito==='ok'?'#b5ebc0':'#bfe0f8';
  const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Elimina la chiamata');x.title='Elimina';x.style.cssText='float:right;width:36px;height:36px;min-height:0;padding:0';x.onclick=()=>delCall(rec,k,isLead);
  d.append(x,ch,h('div','',fmtDT(new Date(k.data).getTime())));
  if(k.nota){const t=h('div','',k.nota);t.style.cssText='white-space:pre-wrap;color:var(--ink);font-size:14px;margin-top:4px';d.append(t)}
  if(k.rich)d.append(h('div','hint','Richiama il '+fmtD(k.rich)));return d}
function paintCalls(rec,isLead){const p=isLead?'l_':'',L=$(p+'callList'),B=$(p+'callBox'),n=(rec&&rec.calls||[]).length;
  $(isLead?'l_callCnt':'callCnt').textContent=n||'';if(!L||!rec)return;L.textContent='';B.textContent='';
  $(isLead?'l_call':'cl_call').hidden=!rec.telefono;
  if(rec.rich){const b=h('div','req');b.style.background='var(--lilac)';const t=h('b','','Da richiamare '+(rec.rich<ymd()?'dal ':'il ')+fmtD(rec.rich));const f=h('button','btn lbl');f.type='button';f.innerHTML=ICONS.check+'<span>Fatto</span>';f.style.marginTop='8px';
    f.onclick=()=>{rec.rich='';if(isLead)persistL();else persist();paintCalls(rec,isLead);try{renderH()}catch(e){}};b.append(t,f);B.append(b)}
  if(!n){L.append(h('div','hint','Nessuna chiamata registrata. Tocca Chiama: al ritorno nell’app registri l’esito. Con Registra aggiungi una chiamata già fatta o ricevuta.'));return}
  L.append(h('div','hint',n+(n===1?' chiamata':' chiamate')+', dalla più recente.'));
  rec.calls.slice().sort((a,b)=>String(b.data).localeCompare(String(a.data))).forEach(k=>L.append(callCard(rec,k,isLead)))}
const localDT=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
function openCallManual(rec,isLead){callCur={rec,lead:isLead,t0:Date.now(),es:'ok',manual:true};$('cl_t').textContent='Registra una chiamata';$('cl_who').textContent=fullName(rec)+(rec.telefono?' · '+rec.telefono:'');
  $('cl_dtw').hidden=false;$('cl_dt').value=localDT();setErr('cl_dt','');$('cl_dur').value='5';$('cl_nota').value='';$('cl_ric').value='';setErr('cl_dur','');paintCallEs();paintCallRq();$('mCall').hidden=false}
$('cl_call').onclick=()=>{const c=editing;if(c&&c.telefono)launch('tel:'+telHref(c),c.telefono,c)};
$('cl_reg').onclick=()=>{if(editing)openCallManual(editing,false)};
$('l_call').onclick=()=>{const l=lCur;if(l&&l.telefono)launch('tel:'+telHref(l),l.telefono,l)};
$('l_regcall').onclick=()=>{if(lCur)openCallManual(lCur,true)};
function delCall(rec,k,isLead){askConfirm('Eliminare questa chiamata dal registro?','trash','Elimina',()=>{rec.calls=(rec.calls||[]).filter(x=>x.id!==k.id);
  rec.rich=((rec.calls.slice().sort((a,b)=>String(b.data).localeCompare(String(a.data)))[0])||{}).rich||'';
  if(isLead){persistL();try{paintLM()}catch(x){}}else{persist();try{paintAllC()}catch(x){}}try{renderH()}catch(x){}toast('Chiamata eliminata.')})}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(callCheck,600)});
setTimeout(callCheck,1800);

/* ===== WhatsApp: registro comunicazioni ===== */
const waNum=c=>telHref(c).replace(/\D/g,''),waId=()=>'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const WA_TPL0=[['Ciao','Ciao {nome}, '],['Ordine','Ciao {nome}, ti scrivo per il tuo ordine: '],['Preventivo','Ciao {nome}, ti ho inviato il preventivo. Dimmi se va bene o se vuoi modificare qualcosa.'],['Grazie','Ciao {nome}, grazie per il tempo dedicatoci! ']];
let waC=null,waShow=30,wrDir='in';
function setCm(k){$('cmAll').hidden=k!=='all';if(k==='all')try{paintAllC()}catch(e){}$('cmMail').hidden=k!=='mail';$('cmWa').hidden=k!=='wa';$('cmCall').hidden=k!=='call';if(k==='call')try{paintCalls(editing,false)}catch(e){}document.querySelectorAll('#cmSeg button').forEach(b=>b.classList.toggle('on',b.dataset.c===k))}
$('cmSeg').onclick=e=>{const b=e.target.closest('button');if(b){setCm(b.dataset.c);if(b.dataset.c==='wa')paintWa()}};
function paintAllC(){const c=editing;if(!c)return;try{paintCalls(c,false)}catch(e){}paintAll($('allList'),allClient(c),'Nessun messaggio ancora. Scrivi una email o un WhatsApp, oppure registra a mano un messaggio ricevuto.')}
$('cm_aMail').onclick=()=>$('cm_new').onclick();$('cm_aWa').onclick=()=>$('wa_new').onclick();
{const _os=openSheet;openSheet=function(){const r=_os.apply(this,arguments);setCm('all');return r}}
function paintWa(){const c=editing,L=$('waList');L.textContent='';try{paintAllC()}catch(e){}const a=(c&&c.wa||[]).slice().sort((x,y)=>y.data.localeCompare(x.data));$('waCnt').textContent=a.length||'';
  if(!c)return;if(!a.length){L.append(h('div','hint','Nessun messaggio registrato. Puoi scrivere da qui, registrare a mano un messaggio oppure importare la chat esportata da WhatsApp.'));return}
  L.append(h('div','hint',a.length+(a.length===1?' messaggio':' messaggi')+', dal più recente.'));
  a.slice(0,waShow).forEach(m=>{const d=h('div','req'),ch=h('i','chip',m.dir==='in'?'Ricevuto':'Inviato');ch.style.background=m.dir==='in'?'#b5ebc0':'#d9d1f3';
    const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Elimina messaggio');x.style.cssText='float:right;width:34px;height:34px;border-radius:10px';x.querySelector('svg').style.cssText='width:16px;height:16px';
    x.onclick=()=>askConfirm('Eliminare questo messaggio dal registro?','trash','Elimina',()=>{c.wa=c.wa.filter(z=>z!==m);persist();paintWa()});
    const tx=h('div','',m.testo);tx.style.cssText='white-space:pre-wrap;color:var(--ink);font-size:14px;margin-top:4px';
    d.append(x,ch,h('div','',fmtDT(m.data)+(m.fonte==='app'?' · aperto da app':m.fonte==='import'?' · importato':m.fonte==='business'?' · da WhatsApp Business':m.fonte==='api'?' · inviato dal CRM':'')),tx);L.append(d)});
  if(a.length>waShow){const b=h('button','btn lbl','');b.type='button';b.innerHTML=ICONS.chevR+'Mostra altri';b.onclick=()=>{waShow+=30;paintWa()};L.append(b)}}
let waInf=false,waLead=null,wrLead=null;
function waInfText(c){const sec=infoSections().filter(x=>/^(Titolare|Finalit|Diritti)/.test(x[0])).map(x=>x[0]+': '+x[1]).join('\n\n');return 'Buongiorno '+contactName(c)+',\necco l’informativa privacy di '+S.azienda+' (artt. 13-14 GDPR).\n\n'+sec+'\n\nIl testo completo è disponibile su richiesta. Per i consensi facoltativi risponda a questo messaggio.'}
function sendWaInfo(){if(!editing){viaNew('wa');return}const c=editing;if(!c.telefono){toast('Aggiungi un numero di telefono al cliente.');return}
  if(!S.azienda){toast('Imposta prima il nome azienda: è il titolare indicato nell’informativa.');openSettings();setErr('st_az','Inserisci il nome dell’azienda.');return}
  openWa(c);$('wa_txt').value=waInfText(c);waInf=true}
function openWa(c){waInf=false;waLead=null;if(!c.telefono){toast('Aggiungi un numero di telefono al cliente.');return}waC=c;$('wa_title').textContent='WhatsApp a '+fullName(c);$('wa_txt').value='';setErr('wa_txt','');
  const T=$('wa_tpl');T.textContent='';(S.wa.tpl||WA_TPL0).forEach(([l,t])=>{const b=h('button','',l);b.type='button';b.style.background='var(--lilac)';b.onclick=()=>{$('wa_txt').value=t.replace('{nome}',c.nome||fullName(c));$('wa_txt').focus()};T.append(b)});$('mWa').hidden=false}
$('wa_new').onclick=()=>openWa(editing);$('wa_x').onclick=()=>{$('mWa').hidden=true};
$('wa_go').onclick=()=>{const t=$('wa_txt').value.trim();if(!t){setErr('wa_txt','Scrivi il messaggio.');return}setErr('wa_txt','');
  (waC.wa=waC.wa||[]).push({id:waId(),dir:'out',data:new Date().toISOString(),testo:t,fonte:'app'});
  if(waLead){const inf={d:ymd(),via:'WhatsApp'};if(t.includes(INF_MARK)){if(waLead.l){waLead.l.inf=inf}else pendInf[waLead.key]=inf}if(waLead.l)waLead.l.wa=waC.wa;persistL();persist();try{paintLM()}catch(e){}$('mWa').hidden=true;const num=waNum(waC);launch('https://wa.me/'+num+'?text='+encodeURIComponent(t),t);return}
  if(waInf){waInf=false;const pv=waC.privacy=waC.privacy||mkPriv();pv.informativa=true;pv.infData=ymd();pv.infModo='WhatsApp';pv.infVer='1.0';logP(waC,'Informativa inviata via WhatsApp a '+waC.telefono,'invioWa');if(editing===waC){loadPriv(pv);}}
  persist();$('mWa').hidden=true;paintWa();launch('https://wa.me/'+waNum(waC)+'?text='+encodeURIComponent(t),t)};
function paintWr(){const w=$('wr_dir');w.textContent='';[['in','Ricevuto','#b5ebc0'],['out','Inviato','#d9d1f3']].forEach(([k,l,c])=>{const b=h('button','',l);b.type='button';b.style.background=c;b.classList.toggle('on',wrDir===k);b.onclick=()=>{wrDir=k;paintWr()};w.append(b)})}
$('wa_reg').onclick=()=>{wrLead=null;wrDir='in';paintWr();const n=new Date();$('wr_dt').value=new Date(n.getTime()-n.getTimezoneOffset()*6e4).toISOString().slice(0,16);$('wr_txt').value='';setErr('wr_dt','');setErr('wr_txt','');$('mWr').hidden=false};
$('wr_x').onclick=()=>{$('mWr').hidden=true};
$('wr_ok').onclick=()=>{const t=$('wr_txt').value.trim(),d=new Date($('wr_dt').value);let ok=true;if(isNaN(d)){setErr('wr_dt','Inserisci data e ora.');ok=false}else setErr('wr_dt','');if(!t){setErr('wr_txt','Scrivi il testo del messaggio.');ok=false}else setErr('wr_txt','');if(!ok)return;
  if(wrLead){(wrLead.wa=wrLead.wa||[]).push({id:waId(),dir:wrDir,data:d.toISOString(),testo:t,fonte:'manuale'});persistL();$('mWr').hidden=true;wrLead=null;paintLM();toast('Messaggio registrato.');return}
  (editing.wa=editing.wa||[]).push({id:waId(),dir:wrDir,data:d.toISOString(),testo:t,fonte:'manuale'});persist();$('mWr').hidden=true;paintWa();toast('Messaggio registrato.')};
/* importazione della chat esportata da WhatsApp (.txt oppure .zip) */
async function unzipTxt(u8){const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);let e=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-65558);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}if(e<0)throw new Error('zip');
  const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true),best=null;
  for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true),name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;if(/\.txt$/i.test(name)&&(!best||/chat/i.test(name)))best={meth,csz,off}}
  if(!best)throw new Error('notxt');const st=best.off+30+dv.getUint16(best.off+26,true)+dv.getUint16(best.off+28,true),data=u8.subarray(st,st+best.csz);
  if(best.meth===0)return new TextDecoder().decode(data);if(best.meth!==8)throw new Error('meth');
  return new TextDecoder().decode(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}
function parseChat(txt){const re=/^\[?(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4}),?\s+(\d{1,2})[:.](\d{2})(?::\d{2})?\]?\s*(?:-\s*)?([^:]{1,80}?):\s([\s\S]*)$/,st=/^\[?\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4},?\s+\d{1,2}[:.]\d{2}/,out=[];let cur=null;
  txt.replace(/\r/g,'').replace(/[‎‏‪-‮]/g,'').split('\n').forEach(line=>{const m=line.match(re);
    if(m){const y=+m[3]<100?2000+ +m[3]:+m[3],dt=new Date(y,+m[2]-1,+m[1],+m[4],+m[5]);if(!isNaN(dt)&&+m[2]>=1&&+m[2]<=12){cur={who:m[6].trim(),data:dt.toISOString(),testo:m[7]};out.push(cur);return}}
    if(st.test(line)){cur=null;return}if(cur)cur.testo+='\n'+line});return out}
let wiMsgs=[],wiWho='';
let wiTarget=null;
$('wa_imp').onclick=()=>{wiTarget=null;$('wa_file').click()};
$('l_wimp').onclick=()=>{if(!lCur)return;wiTarget=lCur;$('wa_file').click()};
$('wa_file').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  try{const u8=new Uint8Array(await f.arrayBuffer()),txt=(u8[0]===0x50&&u8[1]===0x4b)?await unzipTxt(u8):new TextDecoder('utf-8').decode(u8),all=parseChat(txt);if(!all.length){toast('Non ho trovato messaggi: è una chat esportata da WhatsApp?');return}
    const cnt={};all.forEach(m=>cnt[m.who]=(cnt[m.who]||0)+1);const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,2);wiMsgs=all.filter(m=>top.includes(m.who)).slice(-3000);
    const c=wiTarget||editing,tk=[c.nome,c.cognome,c.azienda].filter(Boolean).join(' ').toLowerCase().split(/\s+/).filter(x=>x.length>2),isCl=w=>tk.some(t=>w.toLowerCase().includes(t));
    const cl=top.find(isCl);wiWho=top.length===1?(isCl(top[0])?'':top[0]):(cl?top.find(w=>w!==cl):top[0]);
    const d1=new Date(wiMsgs[0].data),d2=new Date(wiMsgs[wiMsgs.length-1].data);$('wi_sum').textContent=wiMsgs.length+' messaggi dal '+fmtD(ymd(d1))+' al '+fmtD(ymd(d2))+(all.length>wiMsgs.length?' (solo i partecipanti principali, al massimo 3000)':'')+'.';
    paintWi(top);$('mWi').hidden=false}catch(err){toast('Impossibile leggere il file. Esporta la chat da WhatsApp (senza media) e scegli il file .txt o .zip.')}};
function paintWi(top){const w=$('wi_who');w.textContent='';top.forEach(n=>{const b=h('button','',n);b.type='button';b.style.background='var(--lilac)';b.classList.toggle('on',wiWho===n);b.onclick=()=>{wiWho=n;paintWi(top)};w.append(b)})}
$('wi_x').onclick=()=>{$('mWi').hidden=true;wiTarget=null};
$('wi_ok').onclick=()=>{const c=wiTarget||editing,have=new Set((c.wa||[]).map(m=>m.data.slice(0,16)+'|'+m.dir+'|'+m.testo.slice(0,80)));let add=0;
  wiMsgs.forEach(m=>{const dir=m.who===wiWho?'out':'in',t=m.testo.trim().slice(0,1500),k=m.data.slice(0,16)+'|'+dir+'|'+t.slice(0,80);if(!t||have.has(k))return;have.add(k);(c.wa=c.wa||[]).push({id:waId(),dir,data:m.data,testo:t,fonte:'import'});add++});
  if(add&&c.privacy)c.privacy.log=(c.privacy.log||[]).concat({d:new Date().toISOString().slice(0,16),t:'Chat WhatsApp importata: '+add+' messaggi'});
  if(wiTarget){persistL();$('mWi').hidden=true;wiTarget=null;paintLM()}else{persist();$('mWi').hidden=true;paintWa()}toast(add?add+' messaggi importati.':'Nessun messaggio nuovo: erano già registrati.')};

/* ===== Conservazione dei dati (art. 5.1.e GDPR) ===== */
const PGKEY='crm-purge-v1';let purges=[];try{purges=JSON.parse(localStorage.getItem(PGKEY)||'[]')}catch(e){}
function purgeLog(tipo,motivo,rif){purges.push({d:new Date().toISOString().slice(0,16),tipo,motivo,rif:String(rif||'').slice(-6)});try{localStorage.setItem(PGKEY,JSON.stringify(purges.slice(-200)))}catch(e){}}
const addM=(t,n)=>{const d=new Date(t);d.setMonth(d.getMonth()+n);return d.getTime()};
function lastTouch(c){let t=0;const up=v=>{if(!v)return;const x=new Date(v).getTime();if(x>t)t=x};up(c.agg);(c.wa||[]).forEach(m=>up(m.data));
  oppsOf(c.id).forEach(o=>{if(o.fase==='vinta')up(o.data);(o.preventivi||[]).forEach(q=>up(q.data))});
  const pv=c.privacy;if(pv){up(pv.infData);(pv.log||[]).forEach(l=>up(l.d));(pv.richieste||[]).forEach(r=>up(r.creata));CONS.forEach(k=>pv.cons&&pv.cons[k]&&up(pv.cons[k].d))}return t}
function rapportoEnd(c){let t=0;oppsOf(c.id).forEach(o=>{if(o.fase==='vinta'&&o.data)t=Math.max(t,new Date(o.data).getTime());(o.preventivi||[]).forEach(q=>{if(q.stato==='accettato')t=Math.max(t,new Date(q.data).getTime())})});return t}
function retention(c){const R=S.ret,pv=c.privacy||{},re=rapportoEnd(c),lt=lastTouch(c),man=pv.conserva?new Date(pv.conserva+'T00:00').getTime():0;
  const open=oppsOf(c.id).some(o=>o.fase!=='vinta'&&o.fase!=='persa');
  let until=0,why='';if(re){until=addM(re,R.contratto);why='dati contrattuali: '+mesi(R.contratto)+' dalla fine del rapporto'}else if(lt){until=addM(lt,R.contatti);why='contatto senza contratto: '+mesi(R.contatti)+' dall’ultimo contatto'}
  if(man){until=man;why='scadenza impostata a mano'}
  return{until,why,open,expired:!c.anon&&!open&&until>0&&until<Date.now()}}
function staleConsents(c){const pv=c.privacy;if(!pv||c.anon)return[];const lt=lastTouch(c);if(!lt)return[];return CONS.filter(k=>pv.cons&&pv.cons[k]&&pv.cons[k].v&&addM(lt,k==='profilazione'?S.ret.profilazione:S.ret.marketing)<Date.now())}
const oldMsgs=()=>{const cut=addM(Date.now(),-S.ret.comunicazioni);let n=0,cl=0;clients.forEach(c=>{const k=(c.wa||[]).filter(m=>new Date(m.data).getTime()<cut).length;if(k){n+=k;cl++}});return{n,cl,cut}};
function reviewItems(){return{anon:clients.filter(anonOpen).sort((a,b)=>a.privacy.anon.scade<b.privacy.anon.scade?-1:1),exp:clients.filter(c=>retention(c).expired),cons:clients.map(c=>[c,staleConsents(c)]).filter(x=>x[1].length),msg:oldMsgs()}}
function autoRet(){if(editing){const c={...editing,privacy:{...(editing.privacy||{}),conserva:''}};return retention(c)}return{until:addM(Date.now(),S.ret.contatti),why:'contatto senza contratto: '+mesi(S.ret.contatti)+' dall’ultimo contatto',open:false}}
function retHint(){const e=$('p_consH');if(!e)return;const a=autoRet(),v=$('p_cons').value,ad=a.until?ymd(new Date(a.until)):'';$('p_cons').dataset.auto=ad;e.textContent='';
  if(!ad){e.textContent='Scadenza non determinabile: mancano date di riferimento.';return}
  if(!v||v===ad){e.textContent='Calcolata in automatico. '+a.why.charAt(0).toUpperCase()+a.why.slice(1)+'.'+(a.open?' Ci sono opportunità aperte: i dati restano in uso.':'')}
  else{e.append('Impostata a mano. Con le regole sarebbe il '+fmtD(ad)+'. ');const b=h('button','link','Torna all’automatico');b.type='button';b.onclick=()=>{$('p_cons').value=ad;$('p_cons').dispatchEvent(new Event('input',{bubbles:true}));retHint()};e.append(b)}}
$('p_cons').addEventListener('input',()=>{try{retHint();paintPrivSum()}catch(e){}});
function anonymize(c,motivo){const id=c.id,tipo=c.tipo||'persona',pv=c.privacy||mkPriv(),log=(pv.log||[]).concat({d:new Date().toISOString().slice(0,16),t:'Dati personali anonimizzati ('+motivo+')'});
  Object.keys(c).forEach(k=>delete c[k]);Object.assign(c,{id,tipo,anon:true,nome:'Anonimo',cognome:'#'+id.slice(-4),azienda:'',paese:'IT',agg:new Date().toISOString(),privacy:mkPriv({base:'legittimo',fonteDati:'altro',log,richieste:[]})});purgeLog('anonimizzazione',motivo,id)}

/* ===== richiesta di anonimizzazione (diritto alla cancellazione, art. 17 GDPR): registrazione, scadenza di 30 giorni, conferma ed esecuzione ===== */
const daysTo=d=>Math.round((new Date(d+'T00:00')-new Date(ymd()+'T00:00'))/864e5);
const anonOpen=c=>!!(c&&!c.anon&&c.privacy&&c.privacy.anon&&c.privacy.anon.stato==='aperta');
function anonChip(a){const n=daysTo(a.scade),t=n<0?'Scaduta da '+(-n)+(n===-1?' giorno':' giorni'):n===0?'Scade oggi':'Entro '+fmtD(a.scade)+' · '+n+(n===1?' giorno':' giorni'),i=h('i','chip',t);i.style.background=n<0?'#f5cad6':n<=10?'#f6edb8':'#b5ebc0';return i}
function anonLog(c,t){const pv=c.privacy=c.privacy||mkPriv();pv.log=(pv.log||[]).concat({d:new Date().toISOString().slice(0,16),t})}
let anonCb=null;
function anonAsk(o){$('an_t').textContent=o.title;$('an_dF').hidden=!o.date;$('an_cF').hidden=!o.date;$('an_nl').textContent=o.nl;$('an_n').value='';$('an_d').value=ymd();setErr('an_n','');$('an_ok').textContent=o.ok;anonCb=o.fn;$('mAnon').hidden=false}
$('an_x').onclick=()=>{$('mAnon').hidden=true};
$('an_ok').onclick=()=>{const f=anonCb;if(f&&f({d:$('an_d').value||ymd(),c:$('an_c').value,n:$('an_n').value.trim()})===false)return;$('mAnon').hidden=true};
function anonMail(c){const a=c.privacy.anon;openCompose(c);if($('mCompose').hidden)return;$('mc_sub').value='Conferma della richiesta di anonimizzazione dei dati';
  $('mc_body').value='Gentile '+contactName(c)+',\n\nabbiamo ricevuto la sua richiesta del '+fmtD(a.ric)+' di anonimizzazione dei suoi dati personali e la prendiamo in carico. Provvederemo entro il '+fmtD(a.scade)+' (un mese dalla richiesta).\n\nPotremo conservare solo i dati che la legge ci impone di trattenere (ad esempio quelli fiscali e contabili), per il tempo previsto. Dopo l’anonimizzazione non saremo più in grado di riconoscerla né di scriverle a questo indirizzo.\n\nPer qualsiasi dubbio può rispondere a questa email.\n\n'+firma()}
function anonRun(c,after){const op=oppsOf(c.id),open=op.filter(o=>o.fase!=='vinta'&&o.fase!=='persa').length,won=op.filter(o=>o.fase==='vinta').length;
  const w=[];if(open)w.push(open+(open===1?' opportunità aperta':' opportunità aperte')+': i dati sono ancora in uso');if(won)w.push(won+(won===1?' opportunità vinta':' opportunità vinte')+': verifica gli obblighi fiscali e contabili (di norma 10 anni) prima di procedere');
  askConfirm('Anonimizzare '+fullName(c)+'? Nome, contatti, foto, note e messaggi vengono cancellati e non si può annullare. L’email viene cancellata: se vuoi confermare l’interessato, invia prima l’email di conferma.'+(w.length?'\n\nAttenzione: '+w.join('; ')+'.':''),'edit','Anonimizza',()=>{
    const ric=c.privacy&&c.privacy.anon?c.privacy.anon.ric:'';anonymize(c,ric?'richiesta dell’interessato del '+fmtD(ric):'richiesta dell’interessato');c.privacy.anon={stato:'evasa',ric,evasa:ymd()};persist();try{render();renderO()}catch(e){}if(after)after();toast('Cliente anonimizzato.')})}
function paintAnon(){const w=$('p_anonF');if(!w)return;w.textContent='';
  if(!editing||editing.anon){w.hidden=true;return}
  const c=editing,a=c.privacy&&c.privacy.anon;w.hidden=false;
  const btn=(ic,l,f,cl)=>{const b=h('button','btn lbl'+(cl?' '+cl:''));b.type='button';b.innerHTML=ICONS[ic]+l;b.onclick=f;return b};
  if(a&&a.stato==='aperta'){const d=h('div','req');d.append(h('b','','Richiesta di anonimizzazione'),h('div','','Ricevuta il '+fmtD(a.ric)+(a.canale?' · '+a.canale:'')+(a.nota?' · '+a.nota:'')),anonChip(a));
    const bt=h('div','mact');bt.style.marginTop='8px';
    bt.append(btn('Scrivi','Conferma',()=>anonMail(c)),btn('edit','Anonimizza',()=>anonRun(c,()=>{$('sheet').hidden=true})),btn('x','Rifiuta',()=>anonAsk({title:'Rifiuta la richiesta',nl:'Motivo del rifiuto (obbligatorio: va comunicato all’interessato)',ok:'Rifiuta',fn:v=>{if(!v.n){setErr('an_n','Indica il motivo.');return false}c.privacy.anon={...a,stato:'rifiutata',motivo:v.n,chiusa:ymd()};anonLog(c,'Richiesta di anonimizzazione rifiutata: '+v.n);persist();paintAnon();paintPrivSum();toast('Richiesta rifiutata e registrata.')}})));
    d.append(bt);w.append(d)}
  else{if(a&&a.stato==='rifiutata'){const d=h('div','hint','Richiesta di anonimizzazione del '+fmtD(a.ric)+' rifiutata il '+fmtD(a.chiusa)+': '+a.motivo);d.style.marginBottom='8px';w.append(d)}
    w.append(btn('shield','Registra una richiesta di anonimizzazione',()=>anonAsk({title:'Richiesta di anonimizzazione',date:1,nl:'Note (facoltative)',ok:'Registra',fn:v=>{if(v.d>ymd()){setErr('an_n','La data non può essere nel futuro.');return false}const sc=new Date(v.d+'T00:00');sc.setMonth(sc.getMonth()+1);c.privacy=c.privacy||mkPriv();c.privacy.anon={stato:'aperta',ric:v.d,canale:v.c,nota:v.n,scade:ymd(sc)};anonLog(c,'Richiesta di anonimizzazione ricevuta ('+v.c+') il '+fmtD(v.d));persist();paintAnon();paintPrivSum();toast('Richiesta registrata: hai tempo fino al '+fmtD(ymd(sc))+'.')}})))}}
function paintReview(){const I=reviewItems(),B=$('rvBody'),R=S.ret;B.textContent='';
  $('rvRules').textContent='Regole attive (modificabili dalle impostazioni): dati contrattuali '+mesi(R.contratto)+' dalla fine del rapporto; contatti senza contratto '+mesi(R.contatti)+'; consensi marketing '+mesi(R.marketing)+' e profilazione '+mesi(R.profilazione)+' dall’ultima interazione; messaggi registrati '+mesi(R.comunicazioni)+'.';
  const sm=$('rvSum');sm.textContent='';[['Richieste di anonimizzazione',I.anon.length],['Dati scaduti',I.exp.length],['Consensi da rivedere',I.cons.length],['Messaggi scaduti',I.msg.n]].forEach(([k,v])=>{const e=h('div','stat');e.append(h('span','',k),h('b',v?'warn':'',String(v)));sm.append(e)});
  const sec=t=>{const d=h('div','hh');d.append(h('span','',t));B.append(d)};
  if(!I.anon.length&&!I.exp.length&&!I.cons.length&&!I.msg.n)B.append(h('div','empty','Tutto in regola: nessun dato da rivedere.'));
  if(I.anon.length){sec('Richieste di anonimizzazione');I.anon.forEach(c=>{const a=c.privacy.anon,d=h('div','req');d.append(h('b','',fullName(c)),h('div','','Ricevuta il '+fmtD(a.ric)+(a.canale?' · '+a.canale:'')),anonChip(a));const bt=h('div','dual');bt.style.marginTop='8px';[['user','Apri',()=>{$('rvSheet').hidden=true;openSheet(c);setPane('priv')}],['edit','Anonimizza',()=>anonRun(c,paintReview)]].forEach(([i,l,f])=>{const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS[i]+l;b.onclick=f;bt.append(b)});d.append(bt);B.append(d)})}
  if(I.exp.length){sec('Clienti con conservazione scaduta');I.exp.forEach(c=>{const r=retention(c),d=h('div','req');d.append(h('b','',fullName(c)),h('div','','Scaduta il '+fmtD(ymd(new Date(r.until)))+' · '+r.why));
    const bt=h('div','mact');bt.style.marginTop='8px';
    [['Anonimizza','edit',()=>askConfirm('Anonimizzare '+fullName(c)+'? Nome, contatti, foto, note e messaggi vengono cancellati; le opportunità restano senza riferimenti al cliente. Non si può annullare.','edit','Anonimizza',()=>{anonymize(c,'conservazione scaduta');persist();render();renderO();paintReview();toast('Cliente anonimizzato.')})],
     ['Elimina','trash',()=>askConfirm('Eliminare '+fullName(c)+' e le sue opportunità? Non si può annullare.','trash','Elimina',()=>{opps=opps.filter(o=>o.clienteId!==c.id);persistO();clients=clients.filter(x=>x!==c);persist();purgeLog('eliminazione','conservazione scaduta',c.id);render();renderO();paintReview();toast('Cliente eliminato.')})],
     ['Prolunga','clock',()=>{const pv=c.privacy=c.privacy||mkPriv();pv.conserva=ymd(new Date(addM(Date.now(),12)));pv.log=(pv.log||[]).concat({d:new Date().toISOString().slice(0,16),t:'Conservazione prolungata fino al '+fmtD(pv.conserva)});persist();paintReview();toast('Conservazione prolungata di 12 mesi.')}]].forEach(([l,i,f])=>{const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS[i]+l;b.onclick=f;bt.append(b)});d.append(bt);B.append(d)})}
  if(I.cons.length){sec('Consensi da riconfermare per inattività');I.cons.forEach(([c,ks])=>{const d=h('div','req');d.append(h('b','',fullName(c)),h('div','','Nessuna interazione dal '+fmtD(ymd(new Date(lastTouch(c))))+' · '+ks.map(k=>CLABEL[k]).join(', ')));
    const bt=h('div','dual');bt.style.marginTop='8px';
    [['Apri','user',()=>{$('rvSheet').hidden=true;openSheet(c);setPane('priv')}],['Revoca','x',()=>askConfirm('Revocare i consensi scaduti di '+fullName(c)+'?','x','Revoca',()=>{const pv=c.privacy,now=new Date().toISOString().slice(0,16);ks.forEach(k=>{pv.cons[k]={v:false,d:ymd()};pv.log=(pv.log||[]).concat({d:now,t:CLABEL[k]+': revocato per inattività'})});persist();paintReview();toast('Consensi revocati.')})]].forEach(([l,i,f])=>{const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS[i]+l;b.onclick=f;bt.append(b)});d.append(bt);B.append(d)})}
  if(I.msg.n){sec('Messaggi oltre il periodo di conservazione');const d=h('div','req');d.append(h('div','',I.msg.n+(I.msg.n===1?' messaggio WhatsApp in ':' messaggi WhatsApp in ')+I.msg.cl+(I.msg.cl===1?' cliente':' clienti')+', precedenti al '+fmtD(ymd(new Date(I.msg.cut)))+'.'));const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS.trash+'Elimina messaggi scaduti';
    b.onclick=()=>askConfirm('Eliminare '+I.msg.n+' messaggi WhatsApp scaduti? Non si può annullare.','trash','Elimina',()=>{const cut=I.msg.cut,now=new Date().toISOString().slice(0,16);clients.forEach(c=>{const k=(c.wa||[]).filter(m=>new Date(m.data).getTime()<cut).length;if(k){c.wa=c.wa.filter(m=>new Date(m.data).getTime()>=cut);if(c.privacy)c.privacy.log=(c.privacy.log||[]).concat({d:now,t:k+' messaggi WhatsApp eliminati (oltre '+mesi(S.ret.comunicazioni)+')'})}});purgeLog('messaggi','oltre '+mesi(S.ret.comunicazioni),'vari');persist();paintReview();toast('Messaggi eliminati.')});d.append(b);B.append(d)}
  sec('Registro delle cancellazioni');if(!purges.length)B.append(h('div','hint','Nessuna cancellazione registrata. Il registro non contiene dati personali.'));
  purges.slice().reverse().slice(0,20).forEach(x=>B.append(h('div','logi',fmtDT(x.d)+' · '+x.tipo+' · '+x.motivo+(x.rif&&x.rif!=='vari'?' · rif. '+x.rif:''))))}
function openReview(){paintReview();$('rvSheet').hidden=false;$('rvSheet').scrollTop=0}
$('rvClose').onclick=()=>{$('rvSheet').hidden=true;if(tab==='home')renderH()};$('st_rev').onclick=()=>{$('mSet').hidden=true;openReview()};

const TP_LANES=[['anag','Anagrafica','user','#cdbff5'],['priv','Privacy','shield','#b9e6d3'],['mail','Email','Scrivi','#bfe0f8'],['wa','WhatsApp','WhatsApp','#b5ebc0'],['call','Chiamate','Chiama','#f7c6d9'],['opp','Commerciale','target','#ffd9b0']];
const TM={};let tpOff=new Set(),tpSel=null;
const tsOf=x=>{if(!x)return NaN;x=String(x);return new Date(x.length<=10?x+'T12:00':/Z|[+-]\d\d:?\d\d$/.test(x)?x:x+'Z').getTime()};
function oppCreated(o){if(o.creata)return tsOf(o.creata);const m=/^o([0-9a-z]{7,9})$/.exec(o.id||'');if(m){const t=parseInt(m[1],36);if(t>1e12&&t<4e12)return t}return NaN}
function leadEvents(l){const E=[],add=(t,lane,title,sub,go)=>{if(!isNaN(t))E.push({t,lane,title,sub:sub||'',go})};
  const gM=()=>{setLTab('msg');setLCm('mail')},gW=()=>{setLTab('msg');setLCm('wa')},gP=()=>setLTab('priv');
  add(+l.data||+l.creato,'anag','Lead acquisito',({web:'da form web',email:'da email',manuale:'inserito a mano'}[l.fonte]||'')+(l.richiesta?' · '+l.richiesta.slice(0,80):''),()=>setLTab('dati'));
  if(l.inf)add(tsOf(l.inf.d),'priv','Informativa fornita','via '+(l.inf.via||'email'),gP);
  (l.msgs||[]).forEach(m=>{const t=+m.data||tsOf(m.data);add(isNaN(t)?new Date(m.data).getTime():t,'mail',m.dir==='in'?'Email ricevuta':'Email inviata',m.oggetto||'(senza oggetto)',gM)});
  const g={};(l.wa||[]).forEach(m=>{const d=String(m.data||'').slice(0,10),k=d+m.dir;(g[k]=g[k]||{d,dir:m.dir,n:0,t:tsOf(m.data)}).n++});
  Object.values(g).forEach(x=>add(x.t,'wa',x.dir==='in'?'WhatsApp ricevuto':'WhatsApp inviato',x.n>1?x.n+' messaggi':'1 messaggio',gW));
  (l.calls||[]).forEach(k=>add(new Date(k.data).getTime(),'call','Chiamata · '+esLabel(k.esito),(k.esito==='ok'&&k.dur?k.dur+' min':'')+(k.nota?(k.esito==='ok'&&k.dur?' · ':'')+k.nota.slice(0,60):''),()=>{setLTab('msg');setLCm('call')}));
  if(l.stato==='scartato'&&l.scartato)add(+l.scartato,'anag','Lead scartato','',null);
  return E.sort((a,b)=>a.t-b.t)}
function touchEvents(c){
  const E=[],add=(t,lane,title,sub,go)=>{if(!isNaN(t))E.push({t,lane,title,sub:sub||'',go})};
  const pv=c.privacy||{},goP=()=>setPane('priv');
  (pv.log||[]).forEach(x=>{const tx=x.t||'';if(x.ev==='invio'||x.ev==='risposta')return;
    if(/^Anagrafica creata/.test(tx))add(tsOf(x.d),'anag','Anagrafica creata',tx.replace(/^Anagrafica creata\s*/,''),()=>setPane('dati'));
    else if(/^Informativa fornita/.test(tx))add(tsOf(x.d),'priv','Informativa fornita',tx.replace(/^Informativa fornita\s*/,''),goP);
    else if(x.ev==='invioWa')add(tsOf(x.d),'priv','Informativa inviata via WhatsApp','',goP);
    else if(x.ev==='consenso')add(tsOf(x.d),'priv','Consenso prestato',tx,goP);
    else if(x.ev==='revoca')add(tsOf(x.d),'priv','Consenso revocato',tx,goP);
    else if(x.ev==='promemoria')add(tsOf(x.d),'priv','Promemoria privacy inviato','',goP);
    else if(x.ev==='annullo')add(tsOf(x.d),'priv','Richiesta privacy annullata','',goP);
    else if(x.ev==='consegna')add(tsOf(x.d),'priv','Verifica consegna',tx,goP);
    else add(tsOf(x.d),'priv',tx.length>60?tx.slice(0,57)+'…':tx,'',goP)});
  (pv.richieste||[]).forEach(r=>{add(tsOf(r.creata),'priv','Informativa inviata','a '+(r.email||''),goP);if(r.ricevuta)add(tsOf(r.ricevuta),'priv','Privacy ricevuta','risposta del cliente',goP)});
  const g={};(c.wa||[]).forEach(m=>{const d=String(m.data||'').slice(0,10),k=d+m.dir;(g[k]=g[k]||{d,dir:m.dir,n:0,t:tsOf(m.data)}).n++});
  Object.values(g).forEach(x=>add(x.t,'wa',x.dir==='in'?'WhatsApp ricevuto':'WhatsApp inviato',x.n>1?x.n+' messaggi':'1 messaggio',()=>{setPane('comm');setCm('wa');loadComm()}));
  (c.calls||[]).forEach(k=>add(new Date(k.data).getTime(),'call','Chiamata · '+esLabel(k.esito),(k.esito==='ok'&&k.dur?k.dur+' min':'')+(k.nota?(k.esito==='ok'&&k.dur?' · ':'')+k.nota.slice(0,60):''),()=>{setPane('comm');setCm('call')}));
  (TM[c.id]||[]).forEach(m=>{const inb=String(m.sender||'').toLowerCase().includes((c.email||'').toLowerCase());add(+m.internalDate,'mail',inb?'Email ricevuta':'Email inviata',dec(m.subject)||'(senza oggetto)',()=>openThread(m.threadId))});
  if(c.lead)add(+c.lead.data||tsOf(c.agg),'anag','Lead acquisito',({web:'da form web',email:'da email',manuale:'inserito a mano'}[c.lead.fonte]||'')+(c.lead.richiesta?' · '+c.lead.richiesta.slice(0,80):''),()=>setPane('dati'));
  const won=opps.filter(o=>o.clienteId===c.id&&o.fase==='vinta'&&o.chiusa).sort((a,b)=>a.chiusa<b.chiusa?-1:1)[0];if(won)add(tsOf(won.chiusa),'opp','Diventato cliente','prima opportunità vinta: '+won.titolo,()=>openOpp(won));
  oppsOf(c.id).forEach(o=>{const go=()=>openOpp(o);add(oppCreated(o),'opp','Opportunità creata',o.titolo,go);
    if(o.chiusa&&(o.fase==='vinta'||o.fase==='persa'))add(tsOf(o.chiusa),'opp',o.fase==='vinta'?'Opportunità vinta':'Opportunità persa',o.titolo+' · '+eur(o.valore),go);
    (o.preventivi||[]).forEach(q=>{add(tsOf(q.data),'opp','Preventivo '+q.num+' creato',o.titolo+' · '+eur2(qTot(q.righe).lordo),()=>openQuote(o,q));if(q.inviato)add(tsOf(q.inviato),'opp','Preventivo '+q.num+' inviato',(q.via?'via '+q.via+' · ':'')+qInfo(q).split(' · ').slice(-1)[0],()=>openQuote(o,q))})});
  return E.sort((a,b)=>a.t-b.t)}
async function touchMail(cl){
  if(TM[cl.id]||!cl.email)return;
  try{const mcp=await gm();if(!mcp)return;const P=PV();if(!P.search)return;const r=pj(await P.search(mcp,P.qContact(cl.email))),ms=[];
    (r.threads||[]).forEach(t=>(t.messages||[]).forEach(m=>ms.push(m)));TM[cl.id]=ms;emSave(cl,ms);
    if(editing===cl&&!$('tpF').classList.contains('pane-hide'))paintTouch(true)}catch(e){}}
function paintTouch(noFetch,L0){
  const c=L0||editing,w=L0?$('l_tpBody'):$('tpBody');if(!c)return;w.textContent='';
  if(!L0&&!noFetch&&c.email&&!TM[c.id])touchMail(c);
  const E=L0?leadEvents(c):touchEvents(c);
  if(!E.length){w.append(h('div','hint','Nessun contatto registrato per questo '+(L0?'lead':'cliente')+'.'));return}
  const first=E[0].t,last=E[E.length-1].t,days=Math.floor((Date.now()-last)/864e5);
  w.append(h('div','tp-sum',E.length+' touchpoint · dal '+fmtD(ymd(new Date(first)))+' · ultimo '+(days<=0?'oggi':days===1?'ieri':days+' giorni fa')+((!L0&&c.email&&!TM[c.id])?' · lettura email…':'')));
  const span=Math.max(last-first,864e5),map=h('div','tp-map'),sel=h('div','tp-sel',tpSel?'':'Tocca un punto per i dettagli.');
  const dots=[];
  TP_LANES.forEach(L=>{const ev=E.filter(e=>e.lane===L[0]);if(!ev.length)return;
    const row=h('div','tp-lane'),ic=h('i');ic.style.background=L[3];ic.innerHTML=ICONS[L[2]];ic.title=L[1]+' ('+ev.length+')';
    const trk=h('div','tp-trk');
    ev.forEach(e=>{const d=h('button','tp-dot');d.type='button';d.style.left=(2+96*(e.t-first)/span)+'%';d.style.background=L[3];d.setAttribute('aria-label',e.title+' '+fmtD(ymd(new Date(e.t))));
      d.onclick=()=>{tpSel=e;dots.forEach(x=>x.classList.toggle('on',x===d));sel.textContent='';const b=h('b','',e.title),dt=h('span','',' · '+fmtD(ymd(new Date(e.t))));sel.append(b,dt);if(e.sub)sel.append(h('div','',e.sub));
        if(e.go){const o=h('button','btn ico pk');o.type='button';o.title='Apri';o.setAttribute('aria-label','Apri');o.innerHTML=ICONS.chevR;o.style.cssText='float:right;margin:-4px 0 0 8px;width:32px;height:32px';o.onclick=e.go;sel.prepend(o)}};
      dots.push(d);trk.append(d)});
    row.append(ic,trk);map.append(row)});
  const ax=h('div','tp-ax');ax.append(h('span','',fmtD(ymd(new Date(first)))),h('span','',fmtD(ymd(new Date(last)))));
  map.append(ax,sel);w.append(map);
  const chips=h('div','tp-chips');
  TP_LANES.forEach(L=>{const n=E.filter(e=>e.lane===L[0]).length;if(!n)return;const b=h('button');b.type='button';b.classList.toggle('on',!tpOff.has(L[0]));b.innerHTML=ICONS[L[2]];b.append(' '+n);b.title=L[1];b.setAttribute('aria-label',L[1]+' '+n);
    b.onclick=()=>{tpOff.has(L[0])?tpOff.delete(L[0]):tpOff.add(L[0]);paintTouch(true,L0)};chips.append(b)});
  w.append(chips);
  let mo='';const col=Object.fromEntries(TP_LANES.map(L=>[L[0],L]));
  E.filter(e=>!tpOff.has(e.lane)).reverse().forEach(e=>{const d=new Date(e.t),m=d.toLocaleDateString('it-IT',{month:'long',year:'numeric'});
    if(m!==mo){mo=m;w.append(h('div','tp-mo',m))}
    const it=h('div','tp-it'),L=col[e.lane],i=h('i');i.style.background=L[3];i.innerHTML=ICONS[L[2]];
    const bx=h('div');bx.append(h('b','',e.title),h('span','',fmtD(ymd(d))+(e.sub?' · '+e.sub:'')));it.append(i,bx);
    it.tabIndex=0;it.setAttribute('role','button');if(e.go){it.onclick=e.go;it.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();e.go()}}}w.append(it)})}

const ctName=iso=>(COUNTRIES.find(x=>x[0]===iso)||[])[1]||'';
const addrC=v=>{v=(v||'').replace(/\s*\n+\s*/g,' ').trim();if(!v)return v;const last=nrm(v.split(',').pop().replace(/\(.*?\)/g,'')).trim();if(COUNTRIES.some(c=>nrm(c[1])===last))return v;return v+', '+(ctName($('paese').value)||'Italia')};
let mapT,mapQ='';
let mapBad=false;
document.addEventListener('securitypolicyviolation',e=>{if(/google|frame/i.test((e.blockedURI||'')+(e.effectiveDirective||''))){mapBad=true;const b=$('mapThumb');if(b){b.classList.add('nomap');const f=b.querySelector('iframe');if(f)f.remove()}}});
function updMap(){clearTimeout(mapT);mapT=setTimeout(()=>{const box=$('mapThumb'),mb=$('mapBtn'),a=$('indirizzo').value.trim();if(!box)return;
  if(a.length<5){box.hidden=true;box.textContent='';mapQ='';mb.hidden=true;return}
  const q=addrC(a);
  mb.hidden=false;mb.innerHTML=ICONS.mappin;mb.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
  if(mapBad){box.hidden=true;return}
  box.hidden=false;if(q===mapQ)return;mapQ=q;box.textContent='';
  const f=document.createElement('iframe');f.loading='lazy';f.title='Mappa dell’indirizzo';f.referrerPolicy='no-referrer';f.src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=15&output=embed';
  f.onerror=()=>{mapBad=true;box.hidden=true;f.remove()};box.append(f)},500)}
$('indirizzo').addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});$('indirizzo').addEventListener('blur',()=>{const a=$('indirizzo');if(a.value.trim().length>4){const v=addrC(a.value);if(v!==a.value){a.value=v;updMap()}}});$('indirizzo').addEventListener('input',updMap);$('paese').addEventListener('change',updMap);
document.querySelectorAll('#cTabs [data-i=route]').forEach(e=>e.innerHTML=ICONS.route);

// ===== LEAD =====
const LKEY='crm-lead-v1',LSEEN='crm-lead-seen-v1';
let leads=[],lSeen=[],lFilter='nuovo',lCur=null,lBusy=false;
try{leads=JSON.parse(localStorage.getItem(LKEY)||'[]')}catch(e){}
try{lSeen=JSON.parse(localStorage.getItem(LSEEN)||'[]')}catch(e){}
const persistL=()=>{try{stampMods(leads,'l')}catch(e){}try{localStorage.setItem(LKEY,JSON.stringify(leads));localStorage.setItem(LSEEN,JSON.stringify(lSeen.slice(-600)))}catch(e){toast('Spazio pieno: impossibile salvare i lead.')}try{cloudPush('ld')}catch(e){}try{dPush()}catch(e){}};
(function purgeLeads(){const n=Date.now(),b=leads.length;leads=leads.filter(l=>!(l.stato==='scartato'&&n-(l.scartato||l.creato)>S.lead.scartati*864e5)&&!(l.stato==='nuovo'&&n-l.creato>S.lead.nuovi*30.5*864e5));if(leads.length!==b)persistL()})();
const AUTO_RE=/no-?reply|donotreply|do-not-reply|mailer-daemon|postmaster|notification|newsletter|bounce|alert|noreply|automated|updates?@|billing|invoice|fattura/i;
const lName=l=>[l.nome,l.cognome].filter(Boolean).join(' ')||l.email||'Lead senza nome';
const knownEmail=e=>{e=(e||'').toLowerCase();return !!e&&(clients.some(c=>(c.email||'').toLowerCase()===e))};
const fromHeader=sd=>{sd=String(sd||'');const m=/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(sd),em=(m?m[2]:sd).trim().toLowerCase(),nm=m?m[1].trim():'';const parts=nm.replace(/[,;]/g,' ').split(/\s+/).filter(Boolean);return{email:em,nome:parts[0]||'',cognome:parts.slice(1).join(' ')}};
const caps=t=>t?t.charAt(0).toUpperCase()+t.slice(1):t;
async function extractLead(raw){
  const base={nome:'',cognome:'',email:'',telefono:'',azienda:'',richiesta:'',enquiry:true};
  const em=(String(raw.text).match(/[^\s<>()"',;:]+@[^\s<>()"',;:]+\.[a-z]{2,}/gi)||[]).filter(x=>!AUTO_RE.test(x));
  const ph=(String(raw.text).match(/(?:\+|00)?\d[\d\s./-]{7,}\d/)||[''])[0].trim();
  const f=fromHeader(raw.sender||'');
  const kv=(ks)=>{const m=new RegExp('^\\s*(?:'+ks+')\\s*[:=-]\\s*(.+)$','im').exec(String(raw.text));return m?m[1].trim():''};
  const fnm=kv('nome e cognome|nome completo|name|full name'),fn=kv('nome|first name'),ln=kv('cognome|last name|surname'),fem=kv('e-?mail|email'),fph=kv('telefono|tel|cellulare|phone'),faz=kv('azienda|società|company|ragione sociale'),fms=kv('messaggio|richiesta|note|message|oggetto');
  const full=fnm?fnm.split(/\s+/):[];
  const fb=Object.assign({},base,{nome:caps(fn||full[0]||f.nome),cognome:caps(ln||full.slice(1).join(' ')||f.cognome),email:(mailRe.test(fem)?fem.toLowerCase():'')||f.email||(em[0]||'').toLowerCase(),telefono:fph||ph,azienda:faz,richiesta:fms?fms.slice(0,400):String(raw.subject?raw.subject+'. ':'')+String(raw.text).replace(/\s+/g,' ').trim().slice(0,400)});
  try{const sm=window.claude&&await claude.use('sample');if(!sm)return fb;
    const js=await sm.json('Analizza questo messaggio ricevuto da un’azienda e ricava i dati del potenziale cliente. Rispondi SOLO con JSON: {"enquiry":boolean,"nome":"","cognome":"","email":"","telefono":"","azienda":"","richiesta":""}. "enquiry" è true solo se è una richiesta reale di una persona o azienda interessata ai nostri prodotti o servizi (anche compilata da un form "contattaci"); è false per newsletter, notifiche automatiche, fatture, spam, comunicazioni interne. Se è un messaggio di un form web, nome ed email del potenziale cliente sono nei campi del form, non nel mittente tecnico. "richiesta" è un riassunto fedele in italiano, massimo 300 caratteri. Campi non presenti: stringa vuota.\n\nMittente: '+(raw.sender||'(non indicato)')+'\nOggetto: '+(raw.subject||'')+'\nTesto:\n'+String(raw.text).slice(0,3000),{modelTier:'quick'});
    if(js&&typeof js==='object'){const o=Object.assign({},fb);['nome','cognome','telefono','azienda','richiesta'].forEach(k=>{if(js[k])o[k]=String(js[k]).trim()});if(js.email&&mailRe.test(String(js.email).trim()))o.email=String(js.email).trim().toLowerCase();o.enquiry=js.enquiry!==false;return o}
  }catch(e){}
  return fb}
function renderL(){
  const w=$('lList');w.textContent='';const F=$('lFilt');F.textContent='';
  const cnt=k=>leads.filter(l=>l.stato===k).length;
  [['nuovo','Nuovi'],['convertito','Convertiti'],['scartato','Scartati']].forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l+' '+cnt(k);b.classList.toggle('on',lFilter===k);b.onclick=()=>{lFilter=k;renderL()};F.append(b)});
  const lqv=nrm(($('lq').value||'').trim()),rows=leads.filter(l=>l.stato===lFilter&&(!lqv||nrm([l.nome,l.cognome,l.azienda,l.email,l.telefono,l.richiesta,l.oggetto].filter(Boolean).join(' ')).includes(lqv))).sort((a,b)=>rsScore(lReasons(b))-rsScore(lReasons(a))||b.data-a.data);
  if(!rows.length){w.append(h('div','hint',lqv?'Nessun lead trovato.':lFilter==='nuovo'?'Nessun lead da valutare. Tocca l’icona di aggiornamento per cercare richieste nelle email da indirizzi non in anagrafica, oppure + per inserirne uno.':'Nessun lead in questa sezione.'));return}
  rows.forEach(l=>{const b=h('button','row');b.type='button';
    const av=h('div','av',inits(lName(l)));av.style.background='#ffd9b0';
    const t=h('div','tx'),n=h('b','',lName(l));const ch=h('i','cst',{web:'Form web',email:'Email',manuale:'Manuale'}[l.fonte]||'Lead');ch.style.background='#bfe0f8';n.append(ch);
    const sp=h('span','',l.tipo==='azienda'?[[l.nome,l.cognome].filter(Boolean).join(' ')].filter(Boolean).join(''):l.azienda||'');if(!sp.textContent)sp.hidden=true;const ex=[];
    if(l.telefono){const p=h('em');const fe=flagEl(l.paese||(S.wa&&S.wa.paese)||'IT');fe.classList.add('sm');p.append(fe,' '+dial(l.paese||(S.wa&&S.wa.paese)||'IT')+' '+l.telefono);ex.push(p)}
    if(l.email)ex.push(h('em','',l.email));
    t.append(n,sp,...ex,h('span','lq',l.richiesta||l.oggetto||''),h('span','',fmtD(ymd(new Date(l.data)))));{const rr=rsRow(lReasons(l));if(rr)t.append(rr)}
    b.append(av,t);b.onclick=()=>openLead(l);w.append(swipeRow(b,l,{open:openLead,mail:()=>{openLead(l);setLTab('msg');setLCm('mail');$('l_reply').onclick()},wa:()=>{openLead(l);setLTab('msg');setLCm('wa');$('l_wa').onclick()}}))});if(rows.length)w.prepend(h('div','hint','Scorri una scheda: a destra chiami, a sinistra scrivi una email o un WhatsApp.'))}
function paintLActs(l){const a=$('l_acts');a.textContent='';a.hidden=!l;if(!l)return;const tel=l.telefono&&l.telefono.replace(/\D/g,'');
  [['Chiama',tel,()=>launch('tel:'+telHref(l),l.telefono,l)],['Scrivi',l.email,()=>{setLTab('msg');setLCm('mail');$('l_reply').onclick()}],['WhatsApp',tel,()=>{setLTab('msg');setLCm('wa');$('l_wa').onclick()}]]
  .forEach(([n,ok,fn])=>{if(!ok)return;const x=document.createElement('a');x.innerHTML=ICONS[n];x.setAttribute('aria-label',n);x.title=n;x.href='#';x.onclick=ev=>{ev.preventDefault();fn()};a.append(x)});a.hidden=!a.children.length}
function openLead(l){
  try{paintCre('lSheet',l,'lead')}catch(e){}
  lCur=l||null;const d=l||{};
  $('l_privT').textContent='quelli scartati dopo '+S.lead.scartati+' giorni, i nuovi dopo '+S.lead.nuovi+' '+(S.lead.nuovi===1?'mese':'mesi')+'.';
  setErr('l_email','');setLTipo(d.tipo||(d.azienda?'azienda':'persona'));setLTab('dati');$('lTabs').hidden=!l;paintLP();
  $('l_nome').value=d.nome||'';$('l_cognome').value=d.cognome||'';$('l_email').value=d.email||'';$('l_tel').value=d.telefono||'';$('l_paese').value=d.paese||(S.wa&&S.wa.paese)||'IT';if(window.paintLPaese)paintLPaese();$('l_az').value=d.azienda||'';$('l_rich').value=d.richiesta||'';$('l_ruolo').value=d.ruolo||'';$('l_nascita').value=d.nascita||'';$('l_piva').value=d.piva||'';$('l_pec').value=d.pec||'';$('l_sito').value=d.sito||'';$('l_ind').value=d.indirizzo||'';$('l_note').value=d.note||'';['l_pec','l_piva','l_nascita'].forEach(f=>setErr(f,''));$('l_paste').value='';$('l_exth').textContent='';
  $('lTitle').textContent=l?lName(l):'Nuovo lead';
  $('l_pasteBox').hidden=!!l;$('l_open').hidden=!(l&&l.threadId);$('l_act').style.gridTemplateColumns=l&&l.threadId?'':'repeat(2,minmax(0,1fr))';$('l_sync').hidden=!(l&&l.email);setLCm('all');$('l_chkh').textContent='';paintLM();paintLActs(l);if(l&&l.email&&Date.now()-(LAST['l'+l.id]||0)>18e4)leadSync(l);
  const done=l&&l.stato!=='nuovo',src=$('l_src');src.hidden=!l;
  if(l){const st=l.stato==='convertito'?'Convertito in prospect':l.stato==='scartato'?'Scartato':'Nuovo';src.textContent=st+' · '+({web:'form web',email:'email',manuale:'inserito a mano'}[l.fonte]||'')+' · '+fmtD(ymd(new Date(l.data)));src.style.background=l.stato==='convertito'?'#b9e6d3':l.stato==='scartato'?'var(--line)':'#ffd9b0'}
  $('l_ripr').hidden=!(l&&l.stato==='scartato');$('l_conv').hidden=!!(l&&l.stato==='convertito');$('l_scarta').hidden=!l||l.stato!=='nuovo';$('l_del').hidden=!l;$('l_reply').hidden=!l;
  if(l&&l.stato==='convertito'){$('l_conv').hidden=true}
  $('lSheet').hidden=false}
$('lClose').onclick=()=>{$('lSheet').hidden=true};
let lTipo='persona';
function setLTab(k){if(k==='tp'&&lCur)setTimeout(()=>paintTouch(true,lCur),0);document.querySelectorAll('#lTabs button').forEach(b=>b.classList.toggle('on',b.dataset.lp===k));document.querySelectorAll('#lSheet .lp').forEach(e=>e.hidden=e.dataset.lp!==k)}
$('lTabs').onclick=e=>{const b=e.target.closest('button');if(b){setLTab(b.dataset.lp);if(b.dataset.lp==='msg'&&lCur){const mm=lMsgs(lCur)[0];if(mm&&mm.dir==='in'&&lUnread(lCur)){lCur.msgSeen=+mm.data||tsOf(mm.data);try{persistL()}catch(e){}setTimeout(()=>{try{paintBadges()}catch(e){}},0)}}if(b.dataset.lp==='msg'&&lCur&&lCur.email&&Date.now()-(LAST['l'+lCur.id]||0)>18e4)leadSync(lCur)}};
function paintLP(){const w=$('l_pst');w.textContent='';const l=lCur;if(!l)return;const ok=!!l.inf,c=h('i','chip',ok?'Informativa fornita il '+fmtD(l.inf.d)+' · '+l.inf.via:'Informativa da inviare');c.style.background=ok?'#b5ebc0':'#f5cad6';w.append(c);
  $('l_pinfE').lastChild.textContent=ok?'Reinvia via email':'Via email';$('l_pinfW').lastChild.textContent=ok?'Reinvia via WhatsApp':'Via WhatsApp'}
$('l_pinfE').onclick=()=>{setLTab('msg');$('l_reply').onclick()};$('l_pinfW').onclick=()=>{setLTab('msg');$('l_wa').onclick()};
function setLTipo(t){lTipo=t;{const two=document.querySelector('#lSheet .lp[data-lp=dati] .two'),az=$('l_azF'),pf=$('l_pivaF'),pc=$('l_pecF');if(t==='azienda'){pf.hidden=false;pc.hidden=false;two.before(az,pf,pc)}else{pf.hidden=true;pc.hidden=true;two.after(az,pf,pc)}}document.querySelectorAll('#l_seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));const L=(id,x)=>{const e=document.querySelector('label[for='+id+']');if(e)e.textContent=x};if(t==='azienda'){L('l_az','Ragione sociale');L('l_nome','Nome referente');L('l_cognome','Cognome referente');L('l_ruolo','Ruolo del referente')}else{L('l_az','Azienda');L('l_nome','Nome');L('l_cognome','Cognome');L('l_ruolo','Ruolo')}}
$('l_seg').onclick=e=>{const b=e.target.closest('button');if(b)setLTipo(b.dataset.t)};
function lTel(){let n=$('l_tel').value.replace(/[\s.()\/-]/g,''),pa=$('l_paese').value||'IT';if(n.startsWith('00'))n='+'+n.slice(2);if(n.startsWith('+')){const hit=splitPfx(n);if(hit){pa=hit.iso;n=hit.rest}}else n=n.replace(/\D/g,'');return{telefono:n,paese:pa}}
function lRead(){return{tipo:lTipo,nome:$('l_nome').value.trim(),cognome:$('l_cognome').value.trim(),email:$('l_email').value.trim().toLowerCase(),...lTel(),azienda:$('l_az').value.trim(),richiesta:$('l_rich').value.trim(),ruolo:$('l_ruolo').value.trim(),nascita:$('l_nascita').value,piva:$('l_piva').value.trim(),pec:$('l_pec').value.trim(),sito:$('l_sito').value.trim(),indirizzo:$('l_ind').value.trim(),note:$('l_note').value.trim()}}
function lCheck(d){let ok=true;setErr('l_email','');['l_pec','l_piva','l_nascita'].forEach(f=>setErr(f,''));
  if(d.tipo!=='azienda'){d.piva='';d.pec=''}
  if(d.pec){d.pec=d.pec.toLowerCase();if(!/^[^\s@.][^\s@]*@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/.test(d.pec)){setErr('l_pec','Inserisci una PEC valida, ad esempio nome@pec.azienda.it.');ok=false}}
  if(d.piva){let v=d.piva.replace(/[\s.-]/g,'').toUpperCase();const it=(d.paese||'IT')==='IT';if(it&&v.startsWith('IT'))v=v.slice(2);let okv=it?/^\d{11}$/.test(v):/^[A-Z0-9]{4,15}$/.test(v);
    if(okv&&it){let s=0;for(let i=0;i<10;i++){let n=+v[i];if(i%2){n*=2;if(n>9)n-=9}s+=n}okv=(10-s%10)%10===+v[10]}
    if(!okv){setErr('l_piva',it?'Partita IVA non valida: servono 11 cifre corrette.':'Partita IVA non valida.');ok=false}
    else{d.piva=v;$('l_piva').value=v;const clash=clients.find(c=>(c.piva||'').toUpperCase()===v);if(clash){setErr('l_piva','Partita IVA già registrata per '+fullName(clash)+'.');ok=false}}}
  if(d.nascita){const t=new Date(d.nascita+'T00:00');if(isNaN(t)||t.getFullYear()<1900){setErr('l_nascita','Inserisci una data valida.');ok=false}else if(d.nascita>ymd()){setErr('l_nascita','La data di nascita non può essere nel futuro.');ok=false}}
if(d.tipo==='azienda'&&!d.azienda){toast('Indica la ragione sociale dell’azienda.');$('l_az').focus();return false}
  if(!d.email||!mailRe.test(d.email)){setErr('l_email','Inserisci un’email valida.');ok=false}
  else if(knownEmail(d.email)){setErr('l_email','Questa email è già in anagrafica clienti.');ok=false}
  else if(leads.some(x=>x!==lCur&&x.email===d.email&&x.stato!=='scartato')){setErr('l_email','Esiste già un lead con questa email.');ok=false}
  return ok}
$('l_ext').onclick=async()=>{const t=$('l_paste').value.trim();if(!t){$('l_exth').textContent='Incolla prima il testo del messaggio.';return}
  const b=$('l_ext');b.disabled=true;$('l_exth').textContent='Lettura in corso…';
  try{const o=await extractLead({text:t,sender:'',subject:''});['nome','cognome','telefono','azienda','richiesta'].forEach(k=>{const el={nome:'l_nome',cognome:'l_cognome',telefono:'l_tel',azienda:'l_az',richiesta:'l_rich'}[k];if(o[k])$(el).value=o[k]});if(o.email)$('l_email').value=o.email;$('l_exth').textContent='Controlla i dati ricavati e correggi se serve.'}
  finally{b.disabled=false}};
$('l_save').onclick=()=>{const d=lRead();if(!lCheck(d))return;
  if(lCur)Object.assign(lCur,d);else{const n=Date.now();lCur=stampNew({id:'l'+n.toString(36),fonte:'manuale',oggetto:'',data:n,creato:n,stato:'nuovo',...d});leads.push(lCur)}
  persistL();renderL();$('lSheet').hidden=true;toast('Lead salvato.')};
$('l_ripr').onclick=()=>{if(!lCur||lCur.stato!=='scartato')return;lCur.stato='nuovo';delete lCur.scartato;persistL();renderL();lFilter='nuovo';renderL();$('lSheet').hidden=true;toast('Lead rimesso tra i nuovi.')};
$('l_scarta').onclick=()=>{if(!lCur)return;lCur.stato='scartato';lCur.scartato=Date.now();persistL();renderL();$('lSheet').hidden=true;toast('Lead scartato. Verrà eliminato dopo 30 giorni.')};
$('l_del').onclick=()=>{const l=lCur;if(!l)return;askConfirm('Eliminare il lead '+lName(l)+'?','trash','Elimina',()=>{leads=leads.filter(x=>x!==l);persistL();renderL();$('lSheet').hidden=true;toast('Lead eliminato.')})};
function lUnread(l,days){const m=lMsgs(l)[0];if(!m||m.dir!=='in')return false;const t=+m.data||tsOf(m.data);if(days&&!(Date.now()-t<days*864e5))return false;return !(l.msgSeen&&t<=l.msgSeen)}
function lMsgs(l){const a=[];((l&&l.msgs)||[]).forEach(m=>a.push(m));((l&&l.wa)||[]).forEach(m=>a.push({dir:m.dir,via:'WhatsApp',data:m.data,testo:m.testo}));return a.sort((x,y)=>String(y.data).localeCompare(String(x.data)))}
function paintAll(host,items,empty){host.textContent='';items.sort((a,b)=>b.t-a.t);
  if(!items.length){host.append(h('div','hint',empty));return}
  host.append(h('div','hint',items.length+(items.length===1?' voce':' voci')+' tra email, WhatsApp e chiamate, dal più recente.'));
  items.slice(0,80).forEach(m=>{const d=h('div','req'),ch=h('i','chip',m.kind==='call'?'Chiamata · '+esLabel(m.call.esito)+(m.call.esito==='ok'?' · '+m.call.dur+' min':''):(m.kind==='wa'?'WhatsApp · ':'Email · ')+(m.dir==='in'?(m.kind==='wa'?'Ricevuto':'Ricevuta'):(m.kind==='wa'?'Inviato':'Inviata')));ch.style.background=m.kind==='call'?'#bfe0f8':m.dir==='in'?'#b5ebc0':'#d9d1f3';d.append(ch);
    if(m.title)d.append(h('b','',m.title));d.append(h('div','',fmtDT(m.t)));
    if(m.text){const x=h('div','',m.text.length>300?m.text.slice(0,300)+'…':m.text);x.style.cssText='white-space:pre-wrap;color:var(--ink);font-size:14px;margin-top:4px';d.append(x)}
    if(m.del){const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Elimina la chiamata');x.title='Elimina';x.style.cssText='float:right;width:36px;height:36px;min-height:0;padding:0';x.onclick=e=>{e.stopPropagation();m.del()};d.prepend(x)}
    if(m.go){d.tabIndex=0;d.style.cursor='pointer';d.onclick=m.go;d.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();m.go()}}}host.append(d)})}
function allClient(c){const mail=(c.email||'').toLowerCase(),it=[];(TM[c.id]||[]).forEach(m=>it.push({t:+m.internalDate,kind:'mail',dir:String(m.sender||'').toLowerCase().includes(mail)?'in':'out',title:dec(m.subject)||'(senza oggetto)',text:dec(m.snippet),go:()=>openThread(m.threadId)}));
  (c.wa||[]).forEach(m=>it.push({t:new Date(m.data).getTime(),kind:'wa',dir:m.dir,text:m.testo}));(c.calls||[]).forEach(k=>it.push({t:new Date(k.data).getTime(),kind:'call',dir:'out',call:k,text:callTxt(k),del:()=>delCall(c,k,false)}));return it}
function allLead(l){const it=[];(l.msgs||[]).forEach(m=>{let t=String(m.testo||'');const ii=t.indexOf(INF_MARK);if(ii>=0)t=t.slice(0,ii).trim()+'\n[+ informativa privacy]';it.push({t:new Date(m.data).getTime(),kind:'mail',dir:m.dir,title:m.oggetto,text:t})});
  (l.wa||[]).forEach(m=>it.push({t:new Date(m.data).getTime(),kind:'wa',dir:m.dir,text:m.testo}));(l.calls||[]).forEach(k=>it.push({t:new Date(k.data).getTime(),kind:'call',dir:'out',call:k,text:callTxt(k),del:()=>delCall(l,k,true)}));return it}
let lCm='all';
function setLCm(k){lCm=k;$('l_cmAll').hidden=k!=='all';document.querySelectorAll('#l_cmSeg button').forEach(b=>b.classList.toggle('on',b.dataset.c===k));$('l_cmMail').hidden=k!=='mail';$('l_cmWa').hidden=k!=='wa';$('l_cmCall').hidden=k!=='call';if(k==='call')try{paintCalls(lCur,true)}catch(e){}}
$('l_cmSeg').onclick=e=>{const b=e.target.closest('button');if(b)setLCm(b.dataset.c)};
function paintLM(){const l=lCur,w=$('l_msgs'),W=$('l_waList');w.textContent='';W.textContent='';if(l)try{paintCalls(l,true)}catch(e){}if(l)paintAll($('l_allList'),allLead(l),'Nessun messaggio ancora. Scrivi una email o un WhatsApp, oppure registra a mano un messaggio ricevuto.');if(!l){$('l_mailCnt').textContent='';$('l_waCnt').textContent='';return}paintLP();
  const all=lMsgs(l),ml=all.filter(m=>m.via!=='WhatsApp'),wl=(l.wa||[]).slice().sort((x,y)=>String(y.data).localeCompare(String(x.data)));
  {const bd=$('l_bdg');bd.hidden=!all.length;bd.textContent=all.length}
  $('l_mailCnt').textContent=ml.length||'';$('l_waCnt').textContent=wl.length||'';
  if(!ml.length)w.append(h('div','hint','Nessuna email ancora. Quelle che invii da qui compaiono nell’elenco e le risposte ricevute in Gmail si aggiungono da sole.'));
  ml.slice(0,30).forEach(m=>{const d=h('div','lm'),ch=h('i','chip',(m.dir==='in'?'Ricevuto':'Inviato')+' · '+m.via);ch.style.background=m.dir==='in'?'#b5ebc0':'#d9d1f3';d.append(ch,h('div','t',fmtDT(m.data)+(m.oggetto?' · '+m.oggetto:'')));let t=String(m.testo||'');const ii=t.indexOf(INF_MARK);if(ii>=0)t=t.slice(0,ii).trim()+'\n[+ informativa privacy]';d.append(h('pre','',t.length>400?t.slice(0,400)+'…':t));w.append(d)});
  if(!wl.length)W.append(h('div','hint','Nessun messaggio registrato. Puoi scrivere da qui, registrare a mano un messaggio ricevuto o importare la chat esportata da WhatsApp.'));
  else W.append(h('div','hint',wl.length+(wl.length===1?' messaggio':' messaggi')+', dal più recente.'));
  wl.slice(0,60).forEach(m=>{const d=h('div','req'),ch=h('i','chip',m.dir==='in'?'Ricevuto':'Inviato');ch.style.background=m.dir==='in'?'#b5ebc0':'#d9d1f3';
    const x=h('button','btn ico');x.type='button';x.innerHTML=ICONS.trash;x.setAttribute('aria-label','Elimina messaggio');x.style.cssText='float:right;width:34px;height:34px;border-radius:10px';x.querySelector('svg').style.cssText='width:16px;height:16px';
    x.onclick=()=>askConfirm('Eliminare questo messaggio dal registro?','trash','Elimina',()=>{l.wa=l.wa.filter(z=>z!==m);persistL();paintLM()});
    const tx=h('div','',m.testo);tx.style.cssText='white-space:pre-wrap;color:var(--ink);font-size:14px;margin-top:4px';
    d.append(x,ch,h('div','',fmtDT(m.data)+(m.fonte==='app'?' · aperto da app':m.fonte==='import'?' · importato':m.fonte==='business'?' · da WhatsApp Business':m.fonte==='api'?' · inviato dal CRM':'')),tx);W.append(d)})}
function lLog(l,m){(l.msgs=l.msgs||[]).push(m);persistL()}
$('l_aMail').onclick=()=>$('l_reply').onclick();$('l_aWa').onclick=()=>$('l_wa').onclick();
$('l_sync').onclick=()=>{if(lCur&&lCur.email)leadSync(lCur)};
$('l_regwa').onclick=()=>{if(!lCur)return;wrLead=lCur;wrDir='in';paintWr();const n=new Date();$('wr_dt').value=new Date(n.getTime()-n.getTimezoneOffset()*6e4).toISOString().slice(0,16);$('wr_txt').value='';setErr('wr_dt','');setErr('wr_txt','');$('mWr').hidden=false};
async function leadSync(l,quiet){const st=$('l_chkh'),em=(l.email||'').toLowerCase();if(!em)return 0;LAST['l'+l.id]=Date.now();
  if(!quiet&&lCur===l)st.textContent='Controllo delle risposte…';
  try{const mcp=await gm();if(!mcp){if(!quiet&&lCur===l)st.textContent=hasClaude()?'Collegamento a Gmail non disponibile in questa visualizzazione: si vedono solo i messaggi già registrati.':gmNo();return 0}
    const P=PV();if(!P.search)return 0;
    const r=pj(await P.search(mcp,'from:'+em+' OR to:'+em+' newer_than:180d'));let n=0;const have=new Set((l.msgs||[]).map(m=>m.gid).filter(Boolean));
    (r.threads||[]).forEach(t=>(t.messages||[]).forEach(m=>{const id=m.id||m.messageId;if(!id||have.has(id))return;have.add(id);
      const from=fromHeader(m.sender).email,inb=from===em,dt=+m.internalDate||Date.parse(m.date||'')||Date.now();
      (l.msgs=l.msgs||[]).push({gid:id,dir:inb?'in':'out',via:'Email',data:new Date(dt).toISOString(),oggetto:dec(m.subject||''),testo:String(m.plaintextBody||dec(m.snippet)||'').trim()});n++}));
    l.msgs=(l.msgs||[]).filter(m=>{if(m.gid)return true;return !(l.msgs||[]).some(x=>x.gid&&x.dir==='out'&&Math.abs(Date.parse(x.data)-Date.parse(m.data))<12e4)});
    persistL();if(lCur===l){paintLM();const d=new Date();st.textContent='Aggiornato alle '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+(n?' · '+n+(n===1?' nuovo messaggio':' nuovi messaggi'):'')}
    return n
  }catch(e){if(!quiet&&lCur===l)st.textContent='';return 0}}
$('l_open').onclick=()=>{if(lCur&&lCur.threadId)openThread(lCur.threadId)};
function leadAttPaint(){const w=$('mc_att');w.textContent='';w.hidden=false;
  w.append(h('div','','Allegati e informativa (tocca per includere o togliere):'));
  const row=h('div','tp-chips');cmpOpts.forEach(o=>{const b=h('button');b.type='button';b.classList.toggle('on',o.on);b.textContent=(o.on?'✓ ':'')+o.label;b.onclick=()=>{if(o.none){toast('Carica la brochure o incolla il suo link in Impostazioni, Allegati.');return}o.on=!o.on;if(o.inf)infSet(o.on);if(o.link)broLinkSet(o.on);leadAttApply();leadAttPaint()};row.append(b)});w.append(row);
  const k=cmpAtt.reduce((t,a)=>t+a.u8.length,0);w.append(h('div','',cmpAtt.length?cmpAtt.length+' allegat'+(cmpAtt.length===1?'o':'i')+' · '+Math.max(1,Math.round(k/1024))+' KB. '+attNote():''));mcActs()}
const INF_MARK='\n\n— INFORMATIVA PRIVACY (art. 13-14 GDPR) —\n',pendInf={};
const infBlock=()=>INF_MARK+infoTxt();
const BROL=()=>'\n\nLa brochure è disponibile a questo link: '+((S.broLink&&S.broLink.url)||'');
function mailHtmlBro(t){if(!(S.broLink&&S.broLink.url))return null;const L=BROL().trim();if(!t.includes(L))return null;const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),url=esc(S.broLink.url).replace(/"/g,'&quot;');return '<div>'+esc(t).split(esc(L)).join('La brochure è <a href="'+url+'">disponibile a questo link</a>.').replace(/\n/g,'<br>')+'</div>'}
function broPlace(v,on){const L=BROL();v=v.split(L).join('');const i=v.indexOf(INF_MARK),head=i>=0?v.slice(0,i):v,tail=i>=0?v.slice(i):'';if(!on)return head+tail;let sg='';try{sg='\n\n'+firma()}catch(e){}const k=sg.length>2?head.lastIndexOf(sg):-1;return (k>=0?head.slice(0,k)+L+head.slice(k):head.replace(/\s+$/,'')+L)+tail}
function broLinkSet(on){const t=$('mc_body');if(!S.broLink||!S.broLink.url)return;t.value=broPlace(t.value,on)}
function waBroSet(on){const t=$('wa_txt');if(!S.broLink||!S.broLink.url)return;t.value=broPlace(t.value,on)}
function infSet(on){const t=$('mc_body'),i=t.value.indexOf(INF_MARK);if(i>=0)t.value=t.value.slice(0,i);if(on)t.value=t.value.replace(/\s+$/,'')+infBlock()}
function offerInf(c){if($('mCompose').hidden||!c||!c.id||(c.privacy&&c.privacy.informativa))return;cmpOpts=[{label:'Informativa privacy',on:true,inf:true}];cmpInfC=c;infSet(true);leadAttApply();leadAttPaint()}
function paintWaSet(){const sel=$('st_wpaese');if(!sel.children.length)[...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).forEach(c=>{const o=document.createElement('option');o.value=c[0];o.textContent=flag(c[0])+' '+c[1]+' '+c[2];sel.append(o)});
  sel.value=S.wa.paese;$('st_winf').value=S.wa.inf;const w=$('st_wtpl');w.textContent='';
  const add=(l,t)=>{const r=h('div','wt');r.style.cssText='border:1px solid var(--line);border-radius:12px;padding:8px;margin-bottom:8px';const i=h('input');i.value=l;i.placeholder='Nome pulsante';i.setAttribute('aria-label','Nome pulsante');const a=h('textarea');a.rows=2;a.value=t;a.style.marginTop='6px';a.setAttribute('aria-label','Testo');const x=h('button','btn lbl');x.type='button';x.innerHTML=ICONS.trash+' Rimuovi';x.style.marginTop='6px';x.onclick=()=>r.remove();r.append(i,a,x);w.append(r)};
  S.wa.tpl.forEach(([l,t])=>add(l,t));const ad=h('button','btn lbl');ad.type='button';ad.innerHTML=ICONS.add+' Aggiungi messaggio';ad.onclick=()=>{add('','');w.lastChild.querySelector('input').focus();w.append(ad)};w.append(ad);
  const o=ad.onclick;ad.onclick=()=>{ad.remove();add('','');w.append(ad)}}
function cmpExtras(c){const inf=cmpInfC===c?(cmpOpts||[]).find(o=>o.inf):null;cmpOpts=[];
  if(S.listino!==false)cmpOpts.push({label:'Listino prezzi',on:false,make:()=>({name:'Listino-prezzi.pdf',u8:priceListPdf(c)})});
  if(brochureOk())cmpOpts.push({label:'Brochure',on:false,make:()=>({name:S.brochure.name||'Brochure.pdf',u8:fromB64(S.brochure.b64),mime:S.brochure.mime||'application/pdf'})});
  else cmpOpts.push(S.broLink&&S.broLink.url?{label:'Brochure (link)',on:false,link:true}:{label:'Brochure (non impostata)',on:false,none:true});
  if(brochureOk()&&S.broLink&&S.broLink.url)cmpOpts.push({label:'Brochure (link)',on:false,link:true});
  if(inf)cmpOpts.push(inf);leadAttApply();leadAttPaint()}
function waExtra(c){const T=$('wa_tpl');if(!T)return;let on=false;const has=!!(S.broLink&&S.broLink.url);const b=h('button','','Brochure (link)'+(has?'':' · non impostata'));b.type='button';b.style.background='var(--lilac)';
  b.onclick=()=>{if(!has){toast('Incolla il link della brochure in Impostazioni, Allegati.');return}on=!on;waBroSet(on);b.textContent=(on?'✓ ':'')+'Brochure (link)'};T.append(b)}
function leadAttApply(){cmpAtt=cmpOpts.filter(o=>o.on&&o.make).map(o=>o.make())}
$('l_reply').onclick=()=>{const d=lRead();if(!d.email||!mailRe.test(d.email)){setErr('l_email','Inserisci un’email valida.');return}
  const l=lCur;openCompose({tipo:'persona',nome:d.nome,cognome:d.cognome,azienda:d.azienda,email:d.email,privacy:null});
  if($('mCompose').hidden)return;
  $('mc_sub').value=l&&l.oggetto?(/^re:/i.test(l.oggetto)?l.oggetto:'Re: '+l.oggetto):'La sua richiesta';
  cmpOpts=[];
  if(S.listino!==false)cmpOpts.push({label:'Listino prezzi',on:true,make:()=>({name:'Listino-prezzi.pdf',u8:priceListPdf(Object.assign({},l||{},d))})});
  if(brochureOk())cmpOpts.push({label:'Brochure',on:true,make:()=>({name:S.brochure.name||'Brochure.pdf',u8:fromB64(S.brochure.b64),mime:S.brochure.mime||'application/pdf'})});
  const hasLink=!!(S.broLink&&S.broLink.url);if(!brochureOk()){cmpOpts.push(hasLink?{label:'Brochure (link)',on:true,link:true}:{label:'Brochure (non impostata)',on:false,none:true})}
  const hasInf=!(l&&l.inf)&&S.lead.inf!==false;cmpOpts.push({label:'Informativa privacy',on:hasInf,inf:true});cmpLeadRef={l:l,email:d.email.toLowerCase()};
  leadAttApply();leadAttPaint();
  const mkBody=()=>{const al=cmpOpts.filter(o=>o.on&&o.make).map(o=>o.label.toLowerCase());return 'Gentile '+contactName({tipo:'persona',nome:d.nome,cognome:d.cognome,azienda:d.azienda})+',\n\ngrazie per averci contattato'+(l&&l.richiesta?' in merito alla sua richiesta':'')+'.'+(al.length?'\n\nIn allegato trova il '+al.join(' e la ')+'.':'')+'\n\nSe desidera un preventivo personalizzato mi indichi prodotti e quantità: le rispondo subito.\n\n'+firma()};
  const b0=mkBody();$('mc_body').value=b0;if(hasLink&&!brochureOk())broLinkSet(true);if(hasInf)infSet(true);
};
function waLeadSet(m){const t=$('wa_txt'),i=t.value.indexOf(INF_MARK);if(i>=0)t.value=t.value.slice(0,i);t.value=t.value.replace(/\s+$/,'');
  if(m==='full')t.value+=INF_MARK+infoTxt();else if(m==='short')t.value+=INF_MARK+infoSections().filter(x=>/^(Titolare|Finalit|Diritti)/.test(x[0])).map(x=>x[0]+': '+x[1]).join('\n\n')+'\n\nIl testo completo è disponibile su richiesta.'}
$('l_wa').onclick=()=>{const d=lRead();if(!d.telefono||!d.telefono.replace(/\D/g,'')){setErr('l_email','');toast('Aggiungi un numero di telefono al lead.');return}
  if(!S.azienda){toast('Imposta prima il nome azienda: è il titolare indicato nell’informativa.');openSettings();setErr('st_az','Inserisci il nome dell’azienda.');return}
  const l=lCur,ps={tipo:'persona',nome:d.nome,cognome:d.cognome,azienda:d.azienda,telefono:d.telefono,wa:(l&&l.wa)||[]};
  openWa(ps);waLead={l:l,key:d.telefono.replace(/\D/g,'')};$('wa_title').textContent='WhatsApp a '+(contactName(ps)||'lead');
  const inf0=!(l&&l.inf)&&S.lead.inf!==false&&S.wa.inf!=='none';
  $('wa_txt').value='Buongiorno '+contactName(ps)+',\ngrazie per averci contattato'+(l&&l.richiesta?' in merito alla sua richiesta':'')+'.\n\nSe desidera un preventivo personalizzato mi indichi prodotti e quantità: le rispondo subito.\n\n'+firma();
  const T=$('wa_tpl');T.textContent='';let cur=inf0?(S.wa.inf==='short'?'short':'full'):'none';
  let broOn=!!(S.broLink&&S.broLink.url);const paint=()=>{T.textContent='';[['full','Informativa completa'],['short','Informativa breve'],['none','Senza informativa']].forEach(([k,lb])=>{const b=h('button','',(cur===k?'✓ ':'')+lb);b.type='button';b.style.background=cur===k?'var(--act)':'';b.onclick=()=>{cur=k;waLeadSet(k);paint()};T.append(b)});
    const bl=h('button','',(broOn?'✓ ':'')+(S.broLink&&S.broLink.url?'Link brochure':'Brochure (non impostata)'));bl.type='button';bl.style.background=broOn?'var(--act)':'';bl.onclick=()=>{if(!(S.broLink&&S.broLink.url)){toast('Incolla il link della brochure in Impostazioni, Allegati.');return}broOn=!broOn;waBroSet(broOn);paint()};T.append(bl)};
  if(broOn)waBroSet(true);paint();waLeadSet(cur)};
$('l_conv').onclick=()=>{const d=lRead();if(!lCheck(d))return;$('mConv').hidden=false;$('cv_p').classList.toggle('p',lTipo==='persona');$('cv_a').classList.toggle('p',lTipo==='azienda')};
$('cv_x').onclick=()=>{$('mConv').hidden=true};
$('cv_p').onclick=()=>{$('mConv').hidden=true;setLTipo('persona');doConv()};
$('cv_a').onclick=()=>{const d=lRead();if(!d.azienda){$('mConv').hidden=true;setLTipo('azienda');toast('Indica la ragione sociale dell’azienda, poi converti.');$('l_az').focus();return}$('mConv').hidden=true;setLTipo('azienda');doConv()};
function doConv(){const d=lRead();if(!lCheck(d))return;const l=lCur||(()=>{const n=Date.now();const x=stampNew({id:'l'+n.toString(36),fonte:'manuale',oggetto:'',data:n,creato:n,stato:'nuovo',...d});leads.push(x);return x})();Object.assign(l,d);
  const digits=(d.telefono||'').replace(/\D/g,''),dupTel=digits&&clients.some(c=>(c.telefono||'').replace(/\D/g,'')===digits);
  const c={id:Date.now().toString(36)+'c',tipo:d.tipo,nome:d.nome,cognome:d.cognome,azienda:d.azienda,ruolo:d.ruolo||'',nascita:d.nascita||'',piva:d.piva||'',pec:d.pec||'',paese:d.paese||'IT',telefono:dupTel?'':d.telefono,email:d.email,sito:d.sito||'',indirizzo:d.indirizzo||'',note:[d.note,d.richiesta?'Richiesta iniziale ('+fmtD(ymd(new Date(l.data)))+'): '+d.richiesta:''].filter(Boolean).join('\n\n'),foto:'',wa:[],agg:ymd(),privacy:mkPriv({fonteDati:'interessato',base:'contratto'}),lead:{id:l.id,fonte:l.fonte,data:l.data,richiesta:d.richiesta}};
  const inf=l.inf||pendInf[(d.email||'').toLowerCase()]||pendInf[(d.telefono||'').replace(/\D/g,'')];if(l.wa&&l.wa.length&&!dupTel)c.wa=l.wa.slice();if(inf){c.privacy.informativa=true;c.privacy.infData=inf.d;c.privacy.infModo=inf.via||'Email';c.privacy.infVer='1.0';}
  stampNew(c);clients.push(c);if(inf)logP(c,'Informativa inviata via '+(inf.via==='WhatsApp'?'WhatsApp':'email')+' in risposta al lead',inf.via==='WhatsApp'?'invioWa':'invio');logP(c,'Anagrafica creata (fonte: lead da '+({web:'form web',email:'email',manuale:'inserimento manuale'}[l.fonte]||'lead')+')','creazione');
  l.stato='convertito';l.clienteId=c.id;l.convertito=Date.now();persist();persistL();$('lSheet').hidden=true;renderL();setTab('clienti');render();openSheet(c);toast('Lead convertito in prospect.'+(dupTel?' Telefono non copiato: già presente in un altro cliente.':''))};
async function leadScan(){if(lBusy)return;LAST.scan=Date.now();lBusy=true;try{if(!localStorage.getItem('crm-lead-reseen-v2')){lSeen=[];localStorage.setItem('crm-lead-reseen-v2','1')}}catch(e){}const st=$('lStatus'),btn=$('lScan');btn.disabled=true;st.textContent='Lettura delle email in corso…';
  try{const mcp=await gm();if(!mcp){st.textContent=hasClaude()?'Collegamento alla posta non disponibile in questa visualizzazione.':gmNo();return}
    const P=PV();if(!P.search||!P.qInbound){st.textContent='L’analisi delle email non è ancora disponibile per '+P.nome+'.';return}
    const r=pj(await P.search(mcp,P.qInbound.replace(/newer_than:\d+d/,'newer_than:'+S.lead.giorni+'d'))),msgs=[];(r.threads||[]).forEach(t=>(t.messages||[]).forEach(m=>msgs.push(m)));
    msgs.sort((a,b)=>+b.internalDate-+a.internalDate);
    const by={};msgs.forEach(m=>{if((m.labelIds||[]).includes('SENT'))return;const f=fromHeader(m.sender);if(!f.email||AUTO_RE.test(f.email)||knownEmail(f.email))return;if(lSeen.includes(m.id))return;if(!by[f.email])by[f.email]=m});
    const cand=Object.values(by).slice(0,12);let added=0,n=0,skip=0,fail=0;
    const dn=(m,e)=>{const x=(m.addressDisplayNames||[]).find(a=>String(a.emailAddress||'').toLowerCase()===e);return x&&x.displayName?x.displayName:''};
    for(const m of cand){n++;st.textContent='Analisi email '+n+' di '+cand.length+'…';
      const f=fromHeader(m.sender),nm=dn(m,f.email);
      // legge la conversazione intera: l'anteprima della ricerca non contiene il testo
      let body='',sent=false;
      try{if(P.thread){const g=pj(await P.thread(mcp,m.threadId)),ms=g.messages||[];sent=ms.some(x=>(x.labelIds||[]).includes('SENT'));const mm=ms.find(x=>x.id===m.id)||{};body=String(mm.plaintextBody||'')}}catch(e){}
      if(sent){lSeen.push(m.id);skip++;continue}                     // conversazione già aperta da me: non è un nuovo contatto
      const text=(body||dec(m.snippet||'')).trim();
      let o;try{o=await extractLead({sender:nm?'"'+nm+'" <'+f.email+'>':m.sender,subject:dec(m.subject),text})}catch(e){fail++;continue}
      const short=text.replace(/\s+/g,' ').length<25;                // testo troppo breve per giudicare: lo propongo comunque
      if((!short&&o.enquiry===false)||!o.email||knownEmail(o.email)||leads.some(x=>x.email===o.email)){lSeen.push(m.id);skip++;continue}
      leads.push(stampNew({id:'l'+(+m.internalDate).toString(36)+n,nome:o.nome,cognome:o.cognome,email:o.email,telefono:o.telefono,azienda:o.azienda,richiesta:o.richiesta||dec(m.subject)||'',oggetto:dec(m.subject),fonte:f.email===o.email?'email':'web',threadId:m.threadId,msgId:m.id,data:+m.internalDate,creato:Date.now(),stato:'nuovo'}));lSeen.push(m.id);added++}
    persistL();lFilter='nuovo';renderL();
    st.textContent=cand.length?(added?'Trovati '+added+(added===1?' nuovo lead':' nuovi lead')+' su '+cand.length+' email da indirizzi non in anagrafica.':'Nessun nuovo lead: '+cand.length+' email analizzate, '+skip+' ignorate perché non sembrano richieste di contatto o riguardano conversazioni già aperte.')+(fail?' '+fail+' da riprovare.':''):'Nessuna email nuova da indirizzi sconosciuti negli ultimi '+S.lead.giorni+' giorni.';
  }catch(e){st.textContent=gmReadErr(e)}
  finally{lBusy=false;btn.disabled=false;try{renderH()}catch(e){}}}
$('lScan').onclick=leadScan;

let broK='file';
function setBroK(k){broK=k;[['file','st_bFile'],['url','st_bUrl']].forEach(([x,id])=>$(id).hidden=x!==k);document.querySelectorAll('#st_broSeg button').forEach(b=>b.classList.toggle('on',b.dataset.b===k))}
function paintBro(){const b=S.brochure,L=S.broLink&&S.broLink.url||'';
  $('st_brolink').value=L;
  const p=[];if(b&&b.b64)p.push('File allegato alle email: '+b.name+' ('+Math.round(b.b64.length*.75/1024)+' KB).');if(L)p.push('Link nei testi: '+L);
  $('st_bro').textContent=p.length?p.join(' '):'Nessuna brochure impostata. Scegli come aggiungerla.';
  $('st_broDel').hidden=!(b&&b.b64);$('st_listino').checked=S.listino!==false;
  if(!paintBro.done){paintBro.done=1;setBroK(L?'url':'file')}}
document.querySelectorAll('#st_broSeg button').forEach(b=>b.onclick=()=>setBroK(b.dataset.b));
const broLinkSave=(id)=>{const v=$(id).value.trim();if(v&&!/^https:\/\//i.test(v)){setErr(id,'Inserisci un link che inizia con https://');return}setErr(id,'');S.broLink=v?{url:v}:null;saveS();paintBro()};
$('st_brolink').onchange=()=>broLinkSave('st_brolink');
$('st_broAdd').onclick=()=>$('st_broFile').click();
$('st_broFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setErr('st_bro','');
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){setErr('st_bro','Seleziona un file PDF.');return}
  const MAX=700*1024;let u8=new Uint8Array(await f.arrayBuffer()),name=f.name,mime='application/pdf',msg='Brochure salvata.';
  if(u8.length>MAX){const z=await zipOne(f.name,u8);
    if(z.length>MAX){
      setErr('st_bro','Anche compresso in zip il file pesa '+Math.round(z.length/1024)+' KB (massimo 700 KB). Il connettore non trasferisce file più grandi: riduci immagini o pagine, oppure caricalo tu su Google Drive, condividilo con “chiunque abbia il link” e incolla il link qui sotto.');return}
    msg='File compresso in zip: da '+Math.round(u8.length/1024)+' a '+Math.round(z.length/1024)+' KB.';u8=z;name=f.name.replace(/\.pdf$/i,'')+'.zip';mime='application/zip'}
  S.brochure={name,b64:b64(u8),mime};
  try{localStorage.setItem('crm-settings-v1',JSON.stringify(S))}catch(x){S.brochure=null;setErr('st_bro','Spazio pieno: impossibile salvare la brochure.');paintBro();return}
  paintBro();toast(msg)};
$('st_broDel').onclick=()=>{S.brochure=null;saveS();paintBro()};

const SPG=[['La tua azienda',[['az','building','Profilo azienda',()=>S.azienda||'Nome, partita IVA, sede e contatti']]],
 ['Comunicazione',[['em','Scrivi','Posta',()=>provName(S.provider)+(S.replyTo?' · '+S.replyTo:'')],['wa','WhatsApp','WhatsApp',()=>'Messaggi rapidi e paese dei numeri'],['al','clip','Allegati e brochure',()=>'Listino e brochure per le risposte ai lead']]],
 ['Vendite',[['pr','doc','Preventivi',()=>'Validità '+S.qValid+' giorni e condizioni'],['ld','target','Lead',()=>'Pulizia automatica e analisi delle email']]],
 ['Dati e privacy',[['sc','user','Accesso e sicurezza',()=>LOCK.on?'Biometria attiva':'Blocco non attivo'],['pv','shield','Privacy e conservazione',()=>'Durate di conservazione e revisione'],['bk','download','Backup, accessi ed esempi',()=>'Esporta, importa, persone e dati di prova']]]];
const SPN={};SPG.forEach(g=>g[1].forEach(r=>SPN[r[0]]=r[2]));
(()=>{const cl=document.querySelector('#mSet .sp[data-sp=cl]'),k=[...cl.children],bk=h('div','sp');bk.dataset.sp='bk';bk.hidden=true;k.slice(1).forEach(e=>bk.append(e));cl.after(bk)})();
let spCur=null;
function paintHub(){const H=$('stHub');H.textContent='';SPG.forEach(([t,rows])=>{const g=h('div','shg'),l=h('div','sl');g.append(h('h3','',t),l);rows.forEach(([k,ic,nm,sm])=>{const b=h('button','shr');b.type='button';const i=h('span','ic');i.innerHTML=ICONS[ic]||'';const tx=h('div','tx');let sub='';try{sub=sm()}catch(e){}tx.append(h('b','',nm),h('span','',sub));const c=h('span','ch');c.innerHTML=ICONS.chevR;b.append(i,tx,c);b.onclick=()=>setSp(k);l.append(b)});H.append(g)})}
function setSp(k){spCur=k||null;document.querySelectorAll('#mSet .sp').forEach(e=>e.hidden=e.dataset.sp!==k);$('stHub').hidden=!!k;if(!k)paintHub();if(k==='sc')try{paintLock()}catch(e){}$('stTitle').textContent=k?SPN[k]:'Impostazioni';$('stBack').setAttribute('aria-label',k?'Indietro':'Chiudi');const sh=$('mSet');if(sh)sh.scrollTop=0}

document.querySelectorAll('#tabs [data-i=inbox]').forEach(e=>e.innerHTML=ICONS.inbox);
/* ===== motivi per record: chip + ordinamento per priorità ===== */
const rsScore=rs=>rs.reduce((t,x)=>t+(x[1]>=2?10:3),0);
function rsRow(rs){if(!rs||!rs.length)return null;const d=document.createElement('div');d.className='rs';rs.slice(0,3).forEach(x=>{const i=document.createElement('i');i.className='rchip'+(x[1]>=2?' al':'');i.textContent=x[0];d.append(i)});if(rs.length>3){const i=document.createElement('i');i.className='rchip';i.textContent='+'+(rs.length-3);d.append(i)}return d}
function cReasons(c){const r=[];try{const pv=c.privacy,R=(pv&&pv.richieste)||[];
  if(!pv||!pv.informativa){if(R.some(x=>effSt(x)==='inviata'))r.push(['Attesa risposta privacy',1]);else r.push(['Informativa da inviare',1,true])}
  R.forEach(x=>{if(effSt(x)==='scaduta')r.push(['Consensi scaduti',2]);if(AUTOREP[x.token]&&effSt(x)==='inviata')r.push(['Risposta consensi',2])});
  if(waUnread(c))r.push(['WhatsApp da leggere',2]);
  try{if(retention(c).expired)r.push(['Dati scaduti',2]);else if(staleConsents(c).length)r.push(['Consensi da rivedere',1])}catch(e){}
  if(opps.some(o=>o.clienteId===c.id&&oReasons(o).length))r.push(['Opportunità da seguire',1])}catch(e){}
  return r}
function lReasons(l){const r=[];try{if(l.stato!=='nuovo')return r;const m=lMsgs(l)[0];if(m&&lUnread(l,14))r.push(['Ha risposto',2]);if(!l.inf)r.push(['Informativa da inviare',1]);if(!m)r.push(['Da valutare',1])}catch(e){}return r}
function oReasons(o){const r=[],td=ymd();try{const open=o.fase!=='vinta'&&o.fase!=='persa';
  if(open&&o.data&&o.data<td)r.push(['Chiusura scaduta',2]);
  if(open&&RES_FASI.includes(o.fase)&&(o.prodotti||[]).length&&!(o.preventivi||[]).length)r.push(['Crea il preventivo',1]);
  (o.preventivi||[]).forEach(q=>{if(q.stato!=='bozza'&&q.stato!=='inviato')return;const exp=addDays(q.data,Math.max(0,parseInt(q.validita,10)||0)),age=Math.round((new Date(td+'T00:00')-new Date(q.data+'T00:00'))/864e5);
    if(qStale(q,o)>0)r.push(['Prezzi preventivo '+q.num+' non aggiornati',1]);if(q.validita&&exp<td)r.push(['Preventivo '+q.num+' scaduto',2]);else if(q.stato==='inviato'&&age>=5)r.push(['Sollecita '+q.num,1]);else if(q.stato==='bozza'&&age>=2)r.push(['Bozza '+q.num+' da inviare',1])});
  if(o.fase==='vinta'&&!o.scaricato&&(o.prodotti||[]).some(x=>mprod(x.prodId)))r.push(['Scarica magazzino',2])}catch(e){}return r}
function pReasons(p){return lowOf(p)?[['Da riordinare',2]]:[]}
function waLast(c){let a=null;(c.wa||[]).forEach(m=>{if(!a||m.data>a.data)a=m});return a}
function waUnread(c){const a=waLast(c);return !!(a&&a.dir==='in'&&Date.now()-new Date(a.data).getTime()<7*864e5&&(!c.waSeen||a.data>c.waSeen))}
function setBadge(btn,n,al){if(!btn)return;let c=btn.querySelector(':scope>.cnt.bd');if(!c){c=document.createElement('span');c.className='cnt bd';btn.append(c)}c.textContent=n?(n>99?'99+':String(n)):'';c.classList.toggle('al',!!al&&!!n)}
function paintBadges(){try{
  const td=ymd(),inc=waUnread,
   privNeed=c=>{const pv=c.privacy;if(!pv||!pv.informativa)return true;return (pv.richieste||[]).some(r=>effSt(r)==='scaduta'||(AUTOREP[r.token]&&effSt(r)==='inviata'))};
  let cl=0,clAl=false;clients.forEach(c=>{if(privNeed(c)||inc(c))cl++;if(inc(c)||((c.privacy&&c.privacy.richieste)||[]).some(r=>effSt(r)==='scaduta'))clAl=true});
  try{const I=reviewItems();const n=I.exp.length+I.cons.length+(I.msg.n?1:0);cl+=n;if(n)clAl=true}catch(e){}
  const L=leads.filter(l=>l.stato==='nuovo'),lRep=L.some(l=>{const m=lMsgs(l)[0];return m&&lUnread(l,14)});
  let op=0,opAl=false;opps.forEach(o=>{const open=o.fase!=='vinta'&&o.fase!=='persa';if(open&&o.data&&o.data<td){op++;opAl=true}
    if(open&&RES_FASI.includes(o.fase)&&(o.prodotti||[]).length&&!(o.preventivi||[]).length)op++;
    (o.preventivi||[]).forEach(q=>{if(q.stato!=='bozza'&&q.stato!=='inviato')return;const exp=addDays(q.data,Math.max(0,parseInt(q.validita,10)||0)),age=Math.round((new Date(td+'T00:00')-new Date(q.data+'T00:00'))/864e5);
      if(qStale(q,o)>0)op++;if(q.validita&&exp<td){op++;opAl=true}else if((q.stato==='inviato'&&age>=5)||(q.stato==='bozza'&&age>=2))op++});
    if(o.fase==='vinta'&&!o.scaricato&&(o.prodotti||[]).some(r=>mprod(r.prodId))){op++;opAl=true}});
  const pr=prods.filter(lowOf).length;
  const B=document.querySelectorAll('#tabs button');B.forEach(b=>{const v=b.dataset.v;
    if(v==='home'){const A=actions();setBadge(b,A.length,A.some(a=>a.pri>=75))}
    else if(v==='clienti')setBadge(b,cl,clAl);else if(v==='lead')setBadge(b,L.length,lRep);else if(v==='opp')setBadge(b,op,opAl);});setBadge(document.querySelector('#appMenu [data-m=prod]'),pr,pr>0);setBadge($('menuBtn'),pr,pr>0);
  if(editing&&!$('sheet').hidden){const c=editing,bt=k=>document.querySelector('#cTabs [data-p='+k+']');
    setBadge(bt('priv'),c.id&&privNeed(c)?1:0,true);setBadge(bt('comm'),inc(c)?1:0,true)}
  if(lCur&&!$('lSheet').hidden){const l=lCur,m=lMsgs(l)[0],bt=k=>document.querySelector('#lTabs [data-lp='+k+']');
    setBadge(bt('priv'),l.inf?0:1,true);setBadge(bt('msg'),lUnread(l)?1:0,true);const old=$('l_bdg');if(old)old.hidden=true}
 }catch(e){}}
setInterval(()=>{if(!document.hidden)paintBadges()},5000);setTimeout(paintBadges,300);

/* ===== Cloud: database condiviso (capability db) ===== */
const CKEY='crm-cloud-v1';
const CLOUD={on:false,db:null,uid:'',canW:false,canA:false,subs:[],t:{},busy:{},sync:{},applying:false,last:0,err:'',first:{},lite:0,started:false,timer:0,n:{}};
try{CLOUD.on=!!JSON.parse(localStorage.getItem(CKEY)||'{}').on}catch(e){}
const hs=str=>{let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))|0;return String(h)+':'+str.length};
const CSPEC={
 cl:{col:'clienti',arr:()=>clients,set:v=>{clients=v},save:()=>{try{localStorage.setItem(KEY,JSON.stringify(clients))}catch(e){}},heavy:{foto:''},after:()=>{try{render()}catch(e){}}},
 op:{col:'opportunita',arr:()=>opps,set:v=>{opps=v},save:()=>{try{localStorage.setItem(OKEY,JSON.stringify(opps))}catch(e){}},heavy:{allegati:[]},after:()=>{try{renderO()}catch(e){}}},
 pr:{col:'prodotti',arr:()=>prods,set:v=>{prods=v},save:()=>{try{localStorage.setItem(PKEY,JSON.stringify(prods))}catch(e){}},heavy:{foto:''},after:()=>{try{renderP()}catch(e){}}},
 mv:{col:'movimenti',arr:()=>movs,set:v=>{movs=v},save:()=>{try{localStorage.setItem(MKEY,JSON.stringify(movs))}catch(e){}},heavy:{},after:()=>{try{renderP()}catch(e){}}},
 ld:{col:'lead',arr:()=>leads,set:v=>{leads=v},save:()=>{try{localStorage.setItem(LKEY,JSON.stringify(leads))}catch(e){}},heavy:{},after:()=>{try{renderL()}catch(e){}}}};
function cloudClean(r,sp){let c=JSON.parse(JSON.stringify(r));if(JSON.stringify(Object.assign({},c,{foto:''})).length>240000){Object.keys(sp.heavy).forEach(k=>{c[k]=sp.heavy[k]});c._lite=1}return canon(c)}
const canon=o=>Array.isArray(o)?o.map(canon):o&&typeof o==='object'?Object.keys(o).sort().reduce((a,k)=>(a[k]=canon(o[k]),a),{}):o;
function cloudPush(key){if(!CLOUD.on||!CLOUD.db||!CLOUD.canW||CLOUD.applying)return;clearTimeout(CLOUD.t[key]);CLOUD.t[key]=setTimeout(()=>cloudFlush(key),1200)}
async function cloudFlush(key){const sp=CSPEC[key];if(!sp||!CLOUD.db||!CLOUD.canW||CLOUD.busy[key])return;if(!CLOUD.first[key])return;CLOUD.busy[key]=1;
  try{const cur=sp.arr(),seen=new Set(),sy=CLOUD.sync[key]||(CLOUD.sync[key]={});let lite=0;
    for(const r of cur){if(!r||!r.id)continue;const id=String(r.id);seen.add(id);const c=cloudClean(r,sp);if(c._lite)lite++;const hh=hs(JSON.stringify(c));if(sy[id]===hh)continue;
      await CLOUD.db.collection(sp.col).doc(id).set(Object.assign({},c,{_u:Date.now(),_by:CLOUD.uid||''}));sy[id]=hh}
    for(const id of Object.keys(sy)){if(!seen.has(id)){await CLOUD.db.collection(sp.col).doc(id).delete();delete sy[id]}}
    CLOUD.n[key]=cur.length;CLOUD.lite=Object.keys(CSPEC).reduce((t,k)=>t+(k===key?lite:(CLOUD['l_'+k]||0)),0);CLOUD['l_'+key]=lite;CLOUD.err='';CLOUD.last=Date.now()
  }catch(e){CLOUD.err=(e&&e.code)||'errore'}
  finally{CLOUD.busy[key]=0;try{paintCloud()}catch(e){}}}
function cloudPull(key,snap){const sp=CSPEC[key],sy=CLOUD.sync[key]||(CLOUD.sync[key]={});let ch=false,arr=sp.arr().slice();const idx=new Map(arr.map((r,i)=>[String(r.id),i]));CLOUD.applying=true;
  try{snap.docChanges().forEach(c=>{const id=c.doc.id;
    if(c.type==='removed'){delete sy[id];if(idx.has(id)){arr=arr.filter(r=>String(r.id)!==id);idx.clear();arr.forEach((r,i)=>idx.set(String(r.id),i));ch=true}return}
    const d=Object.assign({},c.doc.data());delete d._u;delete d._by;const hh=hs(JSON.stringify(canon(d))),lite=d._lite;delete d._lite;
    const i=idx.get(id),cur=i===undefined?null:arr[i];
    if(cur){const curH=hs(JSON.stringify(cloudClean(cur,sp)));if(curH===hh){sy[id]=hh;return}
      if(sy[id]!==undefined&&sy[id]!==curH)return;            // modifica locale non ancora inviata: vince quella locale
      if(lite)Object.keys(sp.heavy).forEach(k=>{d[k]=cur[k]});else Object.keys(sp.heavy).forEach(k=>{const e=Array.isArray(d[k])?d[k].length:d[k],l=Array.isArray(cur[k])?cur[k].length:cur[k];if(!e&&l)d[k]=cur[k]});arr[i]=d}
    else{arr.push(d);idx.set(id,arr.length-1)}
    sy[id]=hh;ch=true})}
  finally{CLOUD.applying=false}
  if(ch){sp.set(arr);sp.save();sp.after()}
  CLOUD.n[key]=arr.length;CLOUD.last=Date.now();CLOUD.err='';
  if(!CLOUD.first[key]){CLOUD.first[key]=1;const mg=SB.e2e.needMig();if(mg)CLOUD.sync[key]={};Promise.resolve(cloudFlush(key)).then(()=>{if(mg)E2EUI.done(key)})}
  try{paintCloud()}catch(e){}}
function cloudSettings(snap){CLOUD.applying=true;try{if(snap.exists){const d=Object.assign({},snap.data());delete d._u;delete d._by;const hh=hs(JSON.stringify(canon(d)));if(CLOUD.sh===hh)return;CLOUD.sh=hh;const br=S.brochure;Object.assign(S,d);if(br)S.brochure=br;
      S.ret=Object.assign({contratto:120,contatti:24,marketing:24,profilazione:12,comunicazioni:24},S.ret||{});S.lead=Object.assign({scartati:30,nuovi:12,giorni:30,inf:true},S.lead||{});S.wa=Object.assign({paese:'IT',inf:'full',tpl:[['Ciao','Ciao {nome}, ']]},S.wa||{});
      try{localStorage.setItem('crm-settings-v1',JSON.stringify(S))}catch(e){}try{paintReq()}catch(e){}}}
  finally{CLOUD.applying=false}
  CLOUD.sf=1;if(!snap.exists&&CLOUD.canA)cloudPushS();else if(SB.e2e.needMig()&&!CLOUD.mgS){CLOUD.mgS=1;CLOUD.sh='';cloudPushS()}}
function cloudPushS(){if(!CLOUD.on||!CLOUD.db||!CLOUD.canA||CLOUD.applying||!CLOUD.sf)return;clearTimeout(CLOUD.t.s);CLOUD.t.s=setTimeout(async()=>{try{const d=Object.assign({},S);delete d.brochure;const hh=hs(JSON.stringify(canon(d)));if(CLOUD.sh===hh)return;await CLOUD.db.doc('config/settings').set(Object.assign({},d,{_u:Date.now(),_by:CLOUD.uid||''}));CLOUD.sh=hh;CLOUD.last=Date.now();CLOUD.err='';if(SB.e2e.needMig())E2EUI.done('s')}catch(e){CLOUD.err=(e&&e.code)||'errore'}try{paintCloud()}catch(e){}},1200)}
async function cloudGate(){if(CLOUD.started||!CLOUD.on||!SB.has())return;const st=await SB.e2e.init();if(st==='ready'){E2EUI.close();let pend=false;try{pend=localStorage.getItem('crm-rk-pending')==='1'}catch(e){}if(pend&&$('mE2E').hidden){try{E2EUI.showRk(await SB.e2e.newRecovery(),null)}catch(e){}}return cloudStart()}if(st==='offline'||st==='error'){CLOUD.err=st==='offline'?'offline':'errore';paintCloud();return}CLOUD.err='locked';paintCloud();E2EUI.open(st)}
async function cloudStart(){if(CLOUD.started||!CLOUD.on)return;CLOUD.started=true;CLOUD.err='';
  try{const db=SB.db();if(!db){CLOUD.started=false;CLOUD.err='nodb';paintCloud();return}
    CLOUD.uid=SB.uid();CLOUD.canW=true;CLOUD.canA=true;CLOUD.db=db;
    Object.keys(CSPEC).forEach(k=>{const sp=CSPEC[k];CLOUD.subs.push(db.collection(sp.col).onSnapshot(snap=>cloudPull(k,snap),e=>{CLOUD.err=(e&&e.code)||'errore';paintCloud()}))});
    CLOUD.subs.push(db.doc('config/settings').onSnapshot(cloudSettings,e=>{CLOUD.err=(e&&e.code)||'errore';paintCloud()}));
    clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(()=>{if(!CLOUD.last){CLOUD.err='timeout';paintCloud()}},10000);paintCloud()
  }catch(e){CLOUD.started=false;CLOUD.err=(e&&e.code)||'errore';paintCloud()}}
function cloudStop(){CLOUD.subs.forEach(f=>{try{f()}catch(e){}});CLOUD.subs=[];CLOUD.db=null;CLOUD.started=false;CLOUD.mgS=0;try{E2EUI.reset()}catch(e){}CLOUD.first={};CLOUD.sync={};CLOUD.sf=0;CLOUD.sh='';paintCloud()}
function paintCloud(){const e=$('st_cstat');if(!e)return;
  const E={nodb:'Il cloud non è disponibile in questa visualizzazione: serve aprire l’app con il tuo account Claude.',timeout:'Il database non risponde ancora: i dati restano su questo dispositivo e si sincronizzeranno appena possibile.',offline:'Sei offline: i dati restano su questo dispositivo e si sincronizzeranno appena torna la rete.',locked:'Sincronizzazione in pausa: i dati sono cifrati e serve la passphrase. Apri Impostazioni → Account.',quota_exceeded:'Limite di spazio del database raggiunto: elimina dati o allegati pesanti.',revoked:'Accesso al cloud revocato per questa sessione.',resource_exhausted:'Troppe operazioni ravvicinate: riprovo da solo.',invalid_argument:'Un record non è stato accettato dal database (troppo grande o non valido).'};
  let t;if(!CLOUD.on)t='Sincronizzazione disattivata: i dati sono solo in questo browser.';
  else if(CLOUD.err&&!CLOUD.last)t=E[CLOUD.err]||('Errore: '+CLOUD.err);
  else if(!CLOUD.db)t='Collegamento al cloud in corso…';
  else{const n=Object.values(CLOUD.n).reduce((a,b)=>a+(b||0),0),d=CLOUD.last?new Date(CLOUD.last):null;t='Cloud attivo'+(d?' · ultimo scambio alle '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'):'')+' · '+n+' record.'+(CLOUD.canW?'':' Sola lettura: il tuo ruolo non consente di modificare i dati.')+(CLOUD.lite?' '+CLOUD.lite+' record con foto o allegati troppo pesanti: restano completi solo su questo dispositivo.':'')+(CLOUD.err?' '+(E[CLOUD.err]||CLOUD.err):'')}
  e.textContent=t}
// invio automatico dopo ogni salvataggio locale
{const w=(fn,key)=>function(){const r=fn.apply(this,arguments);try{cloudPush(key)}catch(e){}return r};
 persist=w(persist,'cl');persistO=w(persistO,'op');persistP=w(persistP,'pr');persistM=w(persistM,'mv');
 const _sv=saveS;saveS=function(){const r=_sv.apply(this,arguments);try{cloudPushS()}catch(e){}return r}}
/* backup JSON */
$('st_bkx').onclick=async()=>{try{backfillCre()}catch(e){}const o={v:1,exp:new Date().toISOString(),clienti:clients,opportunita:opps,prodotti:prods,movimenti:movs,lead:leads,impostazioni:Object.assign({},S,{brochure:undefined})};
  if(SB.e2e.state()!=='ready'){setErr('st_bk','I dati sono cifrati e bloccati su questo dispositivo: esci e accedi di nuovo con la tua password, poi riprova.');return}setErr('st_bk','');let env;try{env=await SB.e2e.seal(new TextEncoder().encode(JSON.stringify(o)))}catch(e){setErr('st_bk','Backup non riuscito: controlla la connessione e riprova.');return}const ok=await savePdf(new TextEncoder().encode(JSON.stringify(env)),'crm-backup-'+ymd()+'.json');toast(ok?'Backup salvato.':'Salvataggio non disponibile qui.')};
$('st_bki').onclick=()=>$('st_bkf').click();
$('st_bkf').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setErr('st_bk','');
  let o;try{o=JSON.parse(await f.text());if(o&&o.enc===2){try{o=JSON.parse(new TextDecoder().decode(await SB.e2e.open(o,()=>E2EUI.ask({bt:'Backup cifrato',bx:'Inserisci la password dell’account con cui è stato creato il backup (oppure la sua chiave di recupero).',bl:'Password o chiave di recupero'}))))}catch(x){if(!(x&&x.code==='cancel'))setErr('st_bk','Password errata o file danneggiato.');return}}
  else if(o&&o.enc===1){const pw=await E2EUI.ask({bt:'Backup di una versione precedente',bx:'Questo file è stato cifrato con la vecchia password dei backup. Inseriscila per riaprirlo.',bl:'Vecchia password dei backup'});if(pw==null)return;DRV.pw=pw;try{o=JSON.parse(new TextDecoder().decode(await decEnv(o)))}catch(x){DRV.pw='';setErr('st_bk','Password errata o file danneggiato.');return}DRV.pw=''}if(!o||o.v!==1||!Array.isArray(o.clienti))throw 0;
    askConfirm('Importare il backup? Clienti ('+o.clienti.length+'), opportunità ('+(o.opportunita||[]).length+'), prodotti ('+(o.prodotti||[]).length+') e lead ('+(o.lead||[]).length+') vengono uniti ai dati attuali; i record con lo stesso identificativo vengono sostituiti.','clip','Importa',()=>{
      const mg=(cur,inc)=>{const m=new Map(cur.map(r=>[String(r.id),r]));(inc||[]).forEach(r=>{if(r&&r.id)m.set(String(r.id),r)});return [...m.values()]};
      clients=mg(clients,o.clienti);opps=mg(opps,o.opportunita);prods=mg(prods,o.prodotti);movs=mg(movs,o.movimenti);leads=mg(leads,o.lead);baselineMods();
      persist();persistO();persistP();persistM();persistL();render();renderO();renderP();try{renderL()}catch(x){}try{renderH()}catch(x){}toast('Backup importato.')})
  }catch(x){setErr('st_bk','File non valido: scegli un backup esportato da questo CRM.')}};

/* ===== form senza tasti in fondo: salvataggio all'uscita ===== */
{const DG={sheet:{c:'close',sv:'save',del:['del'],x:()=>curFoto+'|'+curTipo},pSheet:{c:'pClose',sv:'pSave',del:['pDel'],x:()=>pFoto},qSheet:{c:'qClose',sv:'qSave',del:['qDel'],x:()=>JSON.stringify(qW)},oSheet:{c:'oClose',sv:'oSave',del:['oDel'],x:()=>JSON.stringify(oD)},lSheet:{c:'lClose',sv:'l_save',del:['l_ripr','l_scarta','l_del'],x:()=>lTipo}};
 const SNAP={},HOLD={};window.holdDirty=id=>{HOLD[id]=1};
 const sig=id=>{const v=[];$(id).querySelectorAll('input,select,textarea').forEach(i=>{if(i.type==='file'||i.closest('.vies'))return;v.push(i.type==='checkbox'||i.type==='radio'?(i.checked?1:0):i.value)});let x='';try{x=DG[id].x()}catch(e){}return v.join('\u0001')+'\u0002'+x};
 const snap=id=>{SNAP[id]=sig(id)};
 window.resnap=snap;
 Object.keys(DG).forEach(id=>{const g=DG[id],sh=$(id),top=sh.querySelector('.top'),cl=$(g.c);
   const bar=document.createElement('div');bar.className='tbar';top.append(bar);
   const dw=document.createElement('div');dw.className='delw';g.del.forEach(d=>{const b=$(d);if(!b)return;const dl=/Elimina/.test(b.getAttribute('aria-label')||b.title||''),lb=d==='l_scarta'?'Scarta lead':(b.getAttribute('aria-label')||b.title||'');b.className='btn lbl'+(dl?' d':'');b.style.cssText='width:100%';b.innerHTML=(d==='l_scarta'?ICONS.inbox:d==='l_ripr'?ICONS.reset:ICONS.trash)+lb;if(d==='l_scarta')b.title='Scarta lead (archivia)';dw.append(b)});sh.firstElementChild.append(dw);saveBtn(dw,()=>sig(id),()=>$(g.sv).onclick(),()=>SNAP[id]);top.prepend(cl);if(id==='sheet'){bar.append($('favBtn'))}
   const bt=sh.querySelector('.btns');if(bt)bt.style.display='none';
   const orig=cl.onclick;
   cl.onclick=()=>{if(sig(id)===SNAP[id]){orig();return}
     const md=$('mDirty'),kd=e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();cls()}},cls=()=>{md.hidden=true;document.removeEventListener('keydown',kd,true)};
     md.hidden=false;document.addEventListener('keydown',kd,true);setTimeout(()=>{try{$('dC').focus({preventScroll:true})}catch(e){}},0);
     $('dC').onclick=cls;
     $('dN').onclick=()=>{cls();orig()};
     $('dY').onclick=()=>{cls();$(g.sv).onclick()}};
   new MutationObserver(()=>{if(!sh.hidden){if(HOLD[id]){HOLD[id]=0;SNAP[id]='\u0003sporco';return}snap(id);setTimeout(()=>snap(id),150);setTimeout(()=>snap(id),600)}}).observe(sh,{attributes:true,attributeFilter:['hidden']})});
 const _sc=saveClient;saveClient=function(){const r=_sc.apply(this,arguments);if(r)snap('sheet');return r};
 const _so=saveOpp;saveOpp=function(){const r=_so.apply(this,arguments);if(r)snap('oSheet');return r};
 const _sq=saveQuote;saveQuote=function(){const r=_sq.apply(this,arguments);if(r)snap('qSheet');return r}}
/* estensioni alla scheda WhatsApp ed email */
{const _ow=openWa;openWa=function(){const r=_ow.apply(this,arguments);{const c=arguments[0];if(c&&c.id&&!$('mWa').hidden)waExtra(c)}return r};
 {const _oi=offerInf;offerInf=function(c){const r=_oi.apply(this,arguments);if(!$('mCompose').hidden&&c&&c.id&&!cmpQ&&!cmpLeadRef)cmpExtras(c);return r}}}
/* ===== dati di esempio per provare i periodi e fare stress test: clienti, lead, opportunità, catalogo, listini e magazzino ===== */
{const NM=['Laura','Marco','Elena','Paolo','Chiara','Andrea','Sara','Davide','Marta','Luca','Francesca','Matteo','Giulia','Stefano','Valentina','Alberto','Silvia','Federico','Elisa','Roberto','Anna','Simone','Claudia','Fabio','Alessia','Giorgio','Ilaria','Nicola','Monica','Riccardo','Veronica','Daniele','Barbara','Massimo','Cristina','Enrico','Serena','Gabriele','Paola','Tommaso','Martina','Michele','Roberta','Antonio','Federica','Giacomo','Lucia','Pietro','Beatrice','Emanuele','Irene','Vincenzo','Camilla','Sergio','Noemi','Gianluca','Arianna','Carlo','Daniela','Filippo'];
 const CG=['Conti','Ferri','Riva','Serra','Moretti','Gallo','Costa','Fontana','Greco','Bruno','Marino','Rinaldi','Caruso','Ferrara','Bianco','Villa','Lombardi','Barbieri','Testa','Longo','Pace','Monti','Orlando','Sala','Colombo','De Luca','Mancini','Giordano','Rizzo','Parisi','Silvestri','Vitale','Leone','Martini','Bianchi','Santoro','Palmieri','Valentini','Piras','Neri','Basile','Cattaneo','Gentile','Ruggeri','Fabbri','Amato','Mariani','Sanna','Benedetti','Pellegrini','Grasso','Messina','Donati','Guerra','Bellini','Zanini','Farina','Coppola','Cirillo'];
 const AZ=['Enoteca','Ristorante','Hotel','Eventi','Trattoria','Cantina','Osteria','Catering','Boutique','Pasticceria','Bistrot','Agriturismo','Wine Bar','Gastronomia','Resort','Pizzeria','Salumeria','Caffè','Locanda','Banqueting'];
 const RUOLI=['Titolare','Responsabile acquisti','Direttore','Sommelier','Chef','Amministratore','Event manager','Responsabile F&B'];
 const CITTA=[['IT','Milano','MI','20121','Via Roma'],['IT','Torino','TO','10138','Corso Francia'],['IT','Bologna','BO','40121','Via Indipendenza'],['IT','Firenze','FI','50123','Via dei Servi'],['IT','Roma','RM','00184','Via Nazionale'],['IT','Napoli','NA','80132','Via Chiaia'],['IT','Verona','VR','37121','Via Mazzini'],['IT','Trento','TN','38122','Via Brennero'],['IT','Pescara','PE','65121','Corso Umberto'],['IT','Padova','PD','35121','Via Roma'],['IT','Bari','BA','70121','Corso Cavour'],['IT','Palermo','PA','90133','Via Maqueda'],['IT','Genova','GE','16121','Via XX Settembre'],['FR','Lyon','','69002','Rue de la République'],['FR','Paris','','75004','Rue de Rivoli'],['DE','München','','80331','Marienplatz'],['DE','Berlin','','10117','Friedrichstraße'],['CH','Zürich','','8001','Bahnhofstrasse'],['CH','Lugano','','6900','Via Nassa'],['AT','Wien','','1010','Graben'],['ES','Barcelona','','08002','Carrer de Ferran']];
 const slug=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'');
 const mailSeen=new Set();
 /* email sempre su yopmail.com; se il nome si ripete si aggiunge un numero */
 const yp=(n,c)=>{const b=slug(n)+'.'+slug(c);let e=b,k=1;while(mailSeen.has(e))e=b+(++k);mailSeen.add(e);return e+'@yopmail.com'};
 const vatIT=n=>{const b=String(1000000+n*7919%8999999).padStart(7,'0')+String(1+n%120).padStart(3,'0');let s=0;for(let i=0;i<10;i++){let d=+b[i];if(i%2){d*=2;if(d>9)d-=9}s+=d}return b+((10-s%10)%10)};
 /* catalogo: prodotti con giacenza e soglia di scorta (alcuni volutamente sotto scorta) */
 const CAT=[
 ['DB-BOL','Dalibrà Bollicine','Spumante','Pecorino Brut Nature · 12,5% vol · 6–8 °C','bt',14,6.5,1,60,900],['DB-ROS','Spumante Rosé','Spumante','Montepulciano rosato Brut · 12% vol · 6–8 °C','bt',18,8,1,50,500],['DB-MCR','Metodo Classico Riserva','Spumante','Pecorino, 36 mesi sui lieviti · 12,5% vol','bt',28,13,1,40,60],['DB-BNM','Brut Nature Magnum','Spumante','Magnum 1,5 l · 12,5% vol','bt',34,16,1,20,45],
 ['DB-PRI','Primatus','Rosso','Appassito Rosso · Montepulciano 100% · 14,5% vol','bt',22,10,1,50,400],['DB-IDE','Idealis','Rosso','Montepulciano d’Abruzzo DOP · 14% vol','bt',7.5,3.2,1,150,3000],['DB-EMR','EmmeErre','Rosso','Montepulciano d’Abruzzo DOP Riserva · 14,5% vol','bt',12,5.5,1,80,1200],['DB-ORI','Origine','Rosso','Primitivo IGP · 14% vol','bt',6.5,3,1,50,900],['DB-SEL','Selezione Riserva','Rosso','Montepulciano, 24 mesi in barrique · 14,5% vol','bt',38,17,1,30,90],['DB-RSU','Rosso Superiore','Rosso','Blend rosso · 14% vol','bt',14,6,1,60,700],['DB-CAB','Cabernet Barrique','Rosso','Cabernet Sauvignon IGP · 13,5% vol','bt',19,8.5,1,40,35],
 ['DB-MAM','Mammarosa','Rosato','Cerasuolo d’Abruzzo DOP · 13,5% vol','bt',6.5,2.8,1,100,1500],['DB-RBR','Rosato Brut','Rosato','Rosato frizzante · 11,5% vol','bt',9,4,1,50,300],
 ['DB-MAG','Magnalia','Bianco','Pinot Grigio IGP · 13,5% vol','bt',7,3,1,80,1400],['DB-ARG','Argello','Bianco','Pecorino IGP · 13,5% vol','bt',7,3.2,1,80,1300],['DB-RIA','Riamò','Bianco','Trebbiano d’Abruzzo DOP · 12,5% vol','bt',5.5,2.3,1,80,1500],['DB-BFE','Bianco Fermo','Bianco','Bianco secco da tavola · 12% vol','bt',9.5,4,1,60,800],['DB-PAS','Passerina','Bianco','Passerina IGP · 13% vol','bt',8,3.5,1,60,700],['DB-CHR','Chardonnay Riserva','Bianco','Chardonnay in legno · 13,5% vol','bt',16,7,1,30,150],
 ['DB-PAD','Passito Dolce 0,5 l','Dolci','Passito da uve appassite · 14% vol','bt',18,8.5,1,30,200],['DB-VSA','Vin Santo','Dolci','Vin Santo invecchiato 4 anni · 15% vol','bt',24,11,1,20,120],
 ['DB-GRA','Grappa Invecchiata 0,5 l','Distillati','Grappa di Montepulciano · 40% vol','bt',26,12,1,20,150],['DB-AMA','Amaro alle Erbe','Distillati','Amaro artigianale · 28% vol','bt',22,9,1,20,25],
 ['DB-OLI','Olio EVO 0,75 l','Olio','Olio extravergine, cultivar Intosso','bt',12,6,1,40,600],['DB-OL5','Olio EVO lattina 5 l','Olio','Olio extravergine in lattina','pz',42,26,1,10,80],
 ['DB-CDG','Cassa degustazione 6 bottiglie','Confezioni','Selezione di 6 etichette','confezione',85,40,1,15,200],['DB-CRG','Cassa regalo 2 bottiglie','Confezioni','Confezione regalo in legno','confezione',34,15,1,30,300],['DB-C6I','Cartone 6 Idealis','Confezioni','6 bottiglie Idealis','cartone',40,17,1,40,500],
 ['SV-DEG','Degustazione guidata in cantina','Servizi','Fino a 10 persone, 2 ore','forfait',180,60,0,'',0],['SV-CON','Consulenza carta dei vini','Servizi','Consulenza per ristoranti e hotel','ore',90,30,0,'',0],['SV-VIS','Visita in cantina','Servizi','Visita guidata con assaggio','pz',25,8,0,'',0],['SV-SPE','Spedizione espressa','Servizi','Consegna in 24/48 ore','forfait',12,7,0,'',0],['SV-WCL','Abbonamento Wine Club annuale','Servizi','4 spedizioni all’anno','anno',240,110,0,'',0],['SV-NOL','Noleggio calici per eventi','Servizi','Fino a 100 calici, lavaggio incluso','forfait',60,20,0,'',0],
 ['AC-CAL','Calici ISO (6 pezzi)','Accessori','Calici da degustazione','confezione',18,7,1,40,260],['AC-CAV','Cavatappi sommelier','Accessori','Doppia leva, logo inciso','pz',9,3.5,1,50,400],['AC-POR','Portabottiglie in legno','Accessori','Per 3 bottiglie','pz',15,6,1,30,150],['AC-GRE','Grembiule con logo','Accessori','Cotone, regolabile','pz',14,5,1,20,60]];
 const LST=[
 ['lx1','Ristorazione Italia',['IT'],-8,[[12,3],[60,6],[120,9]],{}],
 ['lx2','Francia',['FR'],6,[[24,4]],{}],
 ['lx3','Germania e Austria',['DE','AT'],4,[[24,3],[96,6]],{}],
 ['lx4','Svizzera',['CH'],12,[],{'DB-PRI':26,'DB-SEL':44,'DB-CDG':98}],
 ['lx5','Distributori (tutti gli altri)',[],-15,[[48,4],[240,8]],{'DB-IDE':6.2,'DB-MAM':5.4,'DB-RIA':4.6}],
 ['lx6','Promo Natale',['IT'],-5,[],{},false]];
 const LR=[['Richiesta preventivo','Buongiorno, vorremmo un preventivo per alcune casse per un evento.'],['Listino ristorazione','Salve, è possibile avere il listino per la ristorazione?'],['Degustazione','Vorremmo organizzare una degustazione per i nostri ospiti: quali date avete?'],['Regali aziendali','Cerchiamo una selezione di vini per i regali ai clienti.'],['Fornitura locale','Siamo interessati a una fornitura mensile per il nostro locale.'],['Informazioni prodotti','Potete inviarmi le schede dei vostri prodotti?'],['Wine Club','Vorrei informazioni sull’abbonamento annuale al Wine Club.'],['Visita in cantina','Siamo un gruppo di 12 persone: è possibile una visita a fine mese?']];
 const WAT=[['out','Buongiorno, le confermo la consegna per giovedì.'],['in','Perfetto, grazie!'],['out','Le ho inviato il preventivo: mi dica se va bene.'],['in','Lo guardo e le faccio sapere entro domani.'],['out','Ricordo l’appuntamento di venerdì per la degustazione.'],['in','Confermato, a venerdì.']];
 const TIT=['Cena aziendale','Riserva per ristorante','Fornitura mensile','Offerta per hotel','Aperitivi estate','Regali clienti','Riordino cantina','Evento privato','Selezione matrimoni','Brindisi di fine anno','Fornitura stagionale','Regalistica Natale','Gara hotel','Carta vini nuova','Contratto annuale','Evento aziendale','Degustazione guidata','Menù di primavera'];
 const LS=['web','email','manuale','web'];
 /* quantità scelta con lo slider (numero di clienti): lead e opportunità seguono in proporzione */
 const sizeNow=()=>{const e=$('st_exSize'),c=Math.max(100,Math.min(1500,parseInt(e&&e.value,10)||100)),t=Math.round(c*1.5+30),o=Math.round(t*.22);return{c,l:Math.max(10,Math.round(c*.3)),k:t-o,o,t:c.toLocaleString('it-IT')+' clienti, '+Math.max(10,Math.round(c*.3)).toLocaleString('it-IT')+' lead e '+t.toLocaleString('it-IT')+' opportunità'}};
 const upH=()=>{const v=$('st_exV');if(v)v.textContent=sizeNow().t;const e=$('st_exH');if(e)e.textContent='Opportunità vinte, perse e aperte distribuite negli ultimi 14 mesi, più un catalogo di '+CAT.length+' prodotti con magazzino e '+LST.length+' listini. Le email sono tutte su yopmail.com e non ci sono numeri di telefono. “Rimuovi esempi” toglie solo quanto è stato aggiunto da qui.'};
 {const e=$('st_exSize');if(e)e.addEventListener('input',upH);upH()}
 $('st_exAdd').onclick=()=>{if(opps.some(o=>o.demo)||clients.some(c=>c.demo)){toast('Gli esempi sono già presenti: rimuovili prima di aggiungerli di nuovo.');return}
  const Z=sizeNow();let sd=7;const rnd=n=>{sd=(sd*1103515245+12345)&0x7fffffff;return sd%n};
  const dAgo=n=>ymd(new Date(Date.now()-n*864e5)),fut=n=>ymd(new Date(Date.now()+n*864e5));
  mailSeen.clear();clients.forEach(c=>{if(c.email)mailSeen.add(String(c.email).split('@')[0])});
  /* catalogo e magazzino */
  const P=CAT.map((r,i)=>({id:'xp'+(i+1),codice:r[0],nome:r[1],categoria:r[2],caratt:r[3],descr:'',unita:r[4],prezzo:r[5],costo:r[6],mag:!!r[7],scorta:r[8],iva:r[2]==='Olio'?4:22,attivo:true,demo:true}));
  const have=new Set(prods.map(p=>p.codice));let np=0;P.forEach((p,i)=>{if(have.has(p.codice))return;prods.push(p);np++;if(p.mag)movs.push({id:'xm'+(i+1),prodId:p.id,data:new Date(Date.now()-430*864e5).toISOString(),tipo:'carico',qta:CAT[i][9],nota:'Giacenza iniziale',demo:true})});
  const goods=P.filter(p=>p.mag);
  /* listini */
  S.cpq=S.cpq&&Array.isArray(S.cpq.listini)?S.cpq:{listini:[],maxSconto:0};let nl2=0;
  LST.forEach(l=>{if(S.cpq.listini.some(x=>x.id===l[0]))return;const pr={};Object.keys(l[5]).forEach(cod=>{const p=P.find(x=>x.codice===cod);if(p)pr[p.id]=l[5][cod]});S.cpq.listini.push({id:l[0],nome:l[1],paesi:l[2].slice(),mod:l[3],scaglioni:l[4].map(s=>({da:s[0],pct:s[1]})),prezzi:pr,attivo:l.length>6?l[6]:true,demo:true});nl2++});
  /* clienti */
  const XC=[];
  for(let i=0;i<Z.c;i++){const n=NM[i%NM.length],c=CG[(i*7+((i/NM.length)|0)*13)%CG.length],az=i%9===8?'':AZ[(i*3+((i/AZ.length)|0))%AZ.length]+' '+c,k=CITTA[(i*5+rnd(3))%CITTA.length],est=k[0]!=='IT';
   const ind=k[4]+' '+(1+(i*13)%97)+', '+k[3]+' '+k[1]+(k[2]?' '+k[2]:'');const id='xd'+(i+1);
   const o={id,tipo:az?'azienda':'persona',nome:n,cognome:c,azienda:az,ruolo:az?RUOLI[i%RUOLI.length]:'',paese:k[0],telefono:'',email:yp(n,c),sito:az?'www.'+slug(az)+(est?'.'+k[0].toLowerCase():'.it'):'',indirizzo:ind,note:i%7===0?'Cliente di esempio per prove e stress test.':'',wa:[],agg:ymd(),demo:true};
   if(az&&k[0]==='IT')o.piva=vatIT(i+1);
   if(i%5===0){const d=new Date(Date.now()+((i/5)%14)*864e5);o.nascita=(1960+(i%36))+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
   const q=i%4,idt=dAgo(40+rnd(500)),lg=[{d:idt+'T10:00',t:'Informativa fornita (Email, v1.0)'}];
   o.privacy=q===2?mkPriv({fonteDati:'interessato',base:'contratto'}):q===0?mkPriv({informativa:true,infData:idt,infModo:'Email',cons:{mkEmail:{v:true,d:idt},mkTel:{v:false,d:''},profilazione:{v:false,d:''},terzi:{v:false,d:''}},log:lg}):q===1?mkPriv({informativa:true,infData:idt,infModo:'Firmata',base:'contratto',log:lg}):mkPriv({informativa:true,infData:idt,infModo:'Email',base:'consenso',cons:{mkEmail:{v:true,d:idt},mkTel:{v:false,d:''},profilazione:{v:true,d:idt},terzi:{v:false,d:''}},log:lg});
   if(i%8===3){const nm=2+i%4;for(let j=0;j<nm;j++){const w=WAT[j%WAT.length];o.wa.push({id:'xw'+i+'_'+j,dir:w[0],data:new Date(Date.now()-(30-j*3-i%5)*864e5).toISOString(),testo:w[1],fonte:'manuale'})}}
   XC.push(o);clients.push(o)}
  /* opportunità: chiuse (vinte 78%, perse 22%) e aperte, con prezzi e sconti dai listini; le vinte scaricano il magazzino */
  const span=420/Math.max(1,Z.k);let nmv=0;
  const mk=(id,i,fase,chiusa,creata,data)=>{const cl=XC[i%XC.length],nr=1+rnd(3),pr=[];for(let j=0;j<nr;j++){const p=goods[rnd(goods.length)],q=6+rnd(90),r=window.prezzoCPQ?prezzoCPQ(p,cl,q):{prezzo:p.prezzo,sconto:0};if(!pr.some(x=>x.prodId===p.id))pr.push({prodId:p.id,nome:p.nome,unita:p.unita,qta:q,prezzo:r.prezzo,costo:p.costo,iva:p.iva,sconto:r.sconto,auto:true})}
   const o={id,demo:true,creata,titolo:TIT[i%TIT.length],clienteId:cl.id,fase,prob:(FASI.find(f=>f[0]===fase)||[])[2],fonte:FONTI[i%FONTI.length],data:data||chiusa||'',prodotti:pr,allegati:[],note:'Opportunità di esempio.'};
   if(chiusa)o.chiusa=chiusa;if(fase==='vinta'){o.scaricato=true;pr.forEach((x,j)=>{movs.push({id:'xs'+id+'_'+j,prodId:x.prodId,data:chiusa+'T10:00:00.000Z',tipo:'scarico',qta:-x.qta,nota:'Opportunità '+o.titolo,oppId:id,demo:true});nmv++})}
   o.valore=total(o);return o};
  for(let i=0;i<Z.k;i++){const d=Math.round(2+i*span+rnd(5));opps.push(mk('oxc'+i,i,rnd(100)<78?'vinta':'persa',dAgo(d),dAgo(d+25+(i%5)*6)))}
  const FS=['nuova','qualificata','proposta'];
  for(let j=0;j<Z.o;j++)opps.push(mk('oxo'+j,j*3+1,FS[j%3],'',dAgo(5+j%60),fut(10+(j*6)%120)));
  /* la giacenza iniziale copre quanto venduto e quanto è impegnato nelle proposte, così a fine esempio resta la giacenza progettata (alcuni prodotti restano volutamente sotto scorta) */
  {const sold={};movs.forEach(m=>{if(m.demo&&m.tipo==='scarico')sold[m.prodId]=(sold[m.prodId]||0)-m.qta});opps.forEach(o=>{if(o.demo&&RES_FASI.includes(o.fase))o.prodotti.forEach(x=>{sold[x.prodId]=(sold[x.prodId]||0)+x.qta})});movs.forEach(m=>{if(m.demo&&m.tipo==='carico'&&sold[m.prodId])m.qta+=sold[m.prodId]})}
  /* lead */
  const now=Date.now();let nl=0;for(let i=0;i<Z.l;i++){const id='lx'+(i+1);if(leads.some(l=>l.id===id))continue;const n=NM[(i*3+5)%NM.length],c=CG[(i*5+2+((i/NM.length)|0))%CG.length],r=LR[i%LR.length],t=now-(i*5%1400+2)*36e5;leads.push({id,demo:true,nome:n,cognome:c,email:yp(n,c),telefono:'',azienda:i%3?'':AZ[(i+7)%AZ.length]+' '+c,richiesta:r[1],oggetto:r[0],fonte:LS[i%LS.length],data:t,creato:t,stato:i%9===8?'scartato':'nuovo',...(i%9===8?{scartato:now-(i%25)*864e5}:{})});nl++}
  persist();persistO();persistL();persistP();persistM();try{saveS()}catch(e){}render();renderO();try{renderL()}catch(e){}try{renderH()}catch(e){}try{if(typeof renderP==='function')renderP();if(typeof renderMag==='function')renderMag();if(typeof renderCpq==='function')renderCpq()}catch(e){}
  toast('Esempi aggiunti: '+XC.length+' clienti, '+(Z.k+Z.o)+' opportunità, '+nl+' lead, '+np+' prodotti, '+nl2+' listini.')};
$('st_exDel').onclick=()=>{const has=opps.some(o=>o.demo)||clients.some(c=>c.demo)||leads.some(l=>l.demo)||prods.some(p=>p.demo)||((S.cpq&&S.cpq.listini)||[]).some(l=>l.demo);if(!has){toast('Non ci sono esempi da rimuovere.');return}
  const dc=new Set(clients.filter(c=>c.demo).map(c=>c.id)),ex=opps.filter(o=>!o.demo&&dc.has(o.clienteId));
  askConfirm('Rimuovere clienti, lead, opportunità, prodotti, magazzino e listini di esempio'+(ex.length?', comprese '+ex.length+' opportunità create da te sui clienti di esempio (e i relativi movimenti di magazzino)':'')+'? I tuoi altri dati non vengono toccati.','trash','Rimuovi',()=>{const xo=new Set(opps.filter(o=>o.demo||dc.has(o.clienteId)).map(o=>o.id));opps=opps.filter(o=>!xo.has(o.id));movs=movs.filter(m=>!(m.oppId&&xo.has(m.oppId)));clients=clients.filter(c=>!c.demo);leads=leads.filter(l=>!l.demo);prods=prods.filter(p=>!p.demo);movs=movs.filter(m=>!m.demo);if(S.cpq&&S.cpq.listini)S.cpq.listini=S.cpq.listini.filter(l=>!l.demo);persist();persistO();persistL();persistP();persistM();try{saveS()}catch(e){}render();renderO();try{renderL()}catch(e){}try{renderH()}catch(e){}try{if(typeof renderP==='function')renderP();if(typeof renderMag==='function')renderMag();if(typeof renderCpq==='function')renderCpq()}catch(e){}toast('Esempi rimossi.')})}}
/* ===== Marketing: segmenti, funnel, engagement ===== */
{const sm=(a,f)=>a.reduce((x,o)=>x+(+f(o)||0),0),DAY=864e5,PERM=[[30,'30 giorni'],[90,'90 giorni'],[365,'12 mesi'],[0,'Sempre']];
 let sub='seg',mp=90;try{const v=localStorage.getItem('crm-mper');if(v!==null&&PERM.some(x=>x[0]===+v))mp=+v;const u=localStorage.getItem('crm-msub');if(['seg','cam'].includes(u))sub=u}catch(e){}
 S.segs=S.segs||[];S.jr=S.jr||[];
 const C_=(f,o,v)=>({f,o,v});
 const PRE=[
  {id:'p_fav',nome:'Preferiti',q:{op:'AND',conds:[C_('fav','eq','si')]},pre:1},
  {id:'p_mk',nome:'Consenso marketing email',q:{op:'AND',conds:[C_('mkEmail','eq','si')]},pre:1},
  {id:'p_op',nome:'Con opportunità aperta',q:{op:'AND',conds:[C_('oppAperte','ge','1')]},pre:1},
  {id:'p_no',nome:'Senza opportunità',q:{op:'AND',conds:[C_('oppTot','eq','0')]},pre:1},
  {id:'p_pi',nome:'Prospect fermi da 30 giorni',q:{op:'AND',conds:[C_('stato','eq','prospect'),C_('giorni','ge','30')]},pre:1},
  {id:'p_ci',nome:'Clienti fermi da 90 giorni',q:{op:'AND',conds:[C_('stato','eq','cliente'),C_('giorni','ge','90')]},pre:1}];
 const fromR=r=>{const k=[];if(r.tipo)k.push(C_('stato','eq',r.tipo));if(r.fav)k.push(C_('fav','eq','si'));if(r.paese)k.push(C_('paese','eq',r.paese));if(r.opp==='aperta')k.push(C_('oppAperte','ge','1'));if(r.opp==='nessuna')k.push(C_('oppTot','eq','0'));if(r.fonte)k.push(C_('fonte','eq',r.fonte));if(r.cons)k.push(C_(r.cons,'eq','si'));if(r.inatt)k.push(C_('giorni','ge',String(r.inatt)));return{op:'AND',conds:k}};
 S.segs.forEach(sg=>{if(!sg.q){sg.q=fromR(sg.r||{});delete sg.r}});
 const lastC=c=>{let t=0;const up=x=>{const v=tsOf(x);if(!isNaN(v)&&v>t)t=v};(c.wa||[]).forEach(m=>up(m.data));((c.privacy&&c.privacy.log)||[]).forEach(e=>{if(/invio/i.test(e.ev||'')||/inviat/i.test(e.t||''))up(e.d)});(c.em||[]).forEach(m=>up(m.data));return t};
 const gg=c=>{const t=lastC(c);return t?Math.floor((Date.now()-t)/DAY):null};
 const hasC=(c,k)=>!!(c.privacy&&c.privacy.cons&&c.privacy.cons[k]&&c.privacy.cons[k].v);
 const recv=(c,jid)=>{const j=S.jr.find(x=>x.id===jid),e=j&&j.dest[c.id];return !!(e&&Object.values(e.s).some(s=>s.st==='ok'))};
 const FD=[
  {id:'stato',ent:'Cliente',label:'Stato',type:'enum',opts:()=>[['prospect','Prospect'],['cliente','Cliente']],get:c=>cstat(c)[0]},
  {id:'fav',ent:'Cliente',label:'Preferito',type:'bool',get:c=>!!c.fav},
  {id:'tipo',ent:'Cliente',label:'Tipo',type:'enum',opts:()=>[['persona','Persona'],['azienda','Azienda']],get:c=>c.tipo||'persona'},
  {id:'paese',ent:'Cliente',label:'Paese',type:'enum',opts:()=>[...new Set(clients.map(c=>c.paese||'IT'))].sort().map(p=>[p,p]),get:c=>c.paese||'IT'},
  {id:'azienda',ent:'Cliente',label:'Azienda',type:'text',get:c=>c.azienda||''},
  {id:'ruolo',ent:'Cliente',label:'Ruolo',type:'text',get:c=>c.ruolo||''},
  {id:'indirizzo',ent:'Cliente',label:'Indirizzo o città',type:'text',get:c=>c.indirizzo||''},
  {id:'haEmail',ent:'Cliente',label:'Ha un’email',type:'bool',get:c=>!!c.email},
  {id:'haTel',ent:'Cliente',label:'Ha un telefono',type:'bool',get:c=>!!c.telefono},
  {id:'compl',ent:'Cliente',label:'Compleanno tra (giorni)',type:'num',get:c=>{const b=c.nascita&&bday(c.nascita);return b?b.days:null}},
  {id:'mkEmail',ent:'Consensi',label:'Marketing via email',type:'bool',get:c=>hasC(c,'mkEmail')},
  {id:'mkTel',ent:'Consensi',label:'Marketing telefono e WhatsApp',type:'bool',get:c=>hasC(c,'mkTel')},
  {id:'profilazione',ent:'Consensi',label:'Profilazione',type:'bool',get:c=>hasC(c,'profilazione')},
  {id:'info',ent:'Consensi',label:'Informativa data',type:'bool',get:c=>!!(c.privacy&&c.privacy.informativa)},
  {id:'oppAperte',ent:'Opportunità',label:'Opportunità aperte (n)',type:'num',get:c=>oppsOf(c.id).filter(o=>o.fase!=='vinta'&&o.fase!=='persa').length},
  {id:'oppTot',ent:'Opportunità',label:'Opportunità totali (n)',type:'num',get:c=>oppsOf(c.id).length},
  {id:'valVinto',ent:'Opportunità',label:'Valore vinto (€)',type:'num',get:c=>sm(oppsOf(c.id).filter(o=>o.fase==='vinta'),o=>o.valore)},
  {id:'fonte',ent:'Opportunità',label:'Fonte di un’opportunità',type:'enum',opts:()=>FONTI.map(f=>[f,f]),get:c=>oppsOf(c.id).map(o=>o.fonte)},
  {id:'fase',ent:'Opportunità',label:'Stato di un’opportunità',type:'enum',opts:()=>[['aperta','Aperta (qualsiasi fase)'],...FASI.map(f=>[f[0],f[1]])],get:c=>oppsOf(c.id).flatMap(o=>o.fase==='vinta'||o.fase==='persa'?[o.fase]:[o.fase,'aperta'])},
  {id:'prev',ent:'Opportunità',label:'Stato di un preventivo',type:'enum',opts:()=>[['bozza','Bozza'],['inviato','Inviato'],['accettato','Accettato'],['rifiutato','Rifiutato']],get:c=>oppsOf(c.id).flatMap(o=>(o.preventivi||[]).map(q=>q.stato))},
  {id:'giorni',ent:'Contatti',label:'Giorni dall’ultimo contatto',type:'num',get:c=>{const g=gg(c);return g===null?Infinity:g}},
  {id:'camp',ent:'Campagne',label:'Ha ricevuto la campagna',type:'enum',opts:()=>S.jr.map(j=>[j.id,j.nome]),get:c=>S.jr.filter(j=>recv(c,j.id)).map(j=>j.id)}];
 const FDM={};FD.forEach(d=>FDM[d.id]=d);
 const OPS={enum:[['eq','è'],['ne','non è']],num:[['ge','almeno'],['le','al massimo'],['eq','esattamente']],text:[['ct','contiene'],['nc','non contiene']],bool:[]};
 const ev1=(c,k)=>{const d=FDM[k.f];if(!d)return true;const v=d.get(c);
  if(d.type==='bool')return k.v==='no'?!v:!!v;
  if(d.type==='enum'){const has=Array.isArray(v)?v.includes(k.v):v===k.v;return k.o==='ne'?!has:has}
  if(d.type==='num'){if(v===null||v===undefined||k.v==='')return false;const n=+k.v;return k.o==='le'?v<=n:k.o==='eq'?v===n:v>=n}
  const q=String(k.v||'').toLowerCase().trim();if(!q)return true;const has=String(v).toLowerCase().includes(q);return k.o==='nc'?!has:has};
 const evalQ=(c,q)=>{const L=((q&&q.conds)||[]).filter(k=>FDM[k.f]);if(!L.length)return true;return q.op==='OR'?L.some(k=>ev1(c,k)):L.every(k=>ev1(c,k))};
 function members(sg){const q=sg&&(sg.q||(sg.r?fromR(sg.r):null));return clients.filter(c=>evalQ(c,q))}
 const vlab=k=>{const d=FDM[k.f];if(d.type==='bool')return k.v==='no'?'no':'sì';if(d.type==='enum'){const o=(d.opts().find(x=>x[0]===k.v)||[])[1];return o||k.v||'…'}return k.v===''||k.v===undefined?'…':k.v};
 const ctext=k=>{const d=FDM[k.f];if(!d)return '';if(d.type==='bool')return d.label+': '+vlab(k);const o=(OPS[d.type].find(x=>x[0]===k.o)||[])[1]||'';return d.label+' '+o+' '+vlab(k)};
 const rtxt=sg=>{const q=sg.q||{op:'AND',conds:[]},L=q.conds.filter(k=>FDM[k.f]);return L.length?L.map(ctext).join(q.op==='OR'?' · oppure · ':' · e · '):'Tutti i clienti'};
 const from=()=>mp?Date.now()-mp*DAY:0;
 const box=(t,info)=>{const b=h('div','wonbox');const hd=h('div','wb-h');hd.append(h('b','',t));b.append(hd);if(info)infoBtn(b,info);return b};
 const bar=(pct,col)=>{const tr=h('div','wb-tr'),f=h('i');f.style.width=Math.max(pct>0?2:0,Math.min(100,pct))+'%';if(col)f.style.background=col;tr.append(f);return tr};
 const rowKV=(a,b,c)=>{const r=h('div','wb-l');r.append(h('span','',a),h('span','',b));if(c)r.append(h('span','',c));return r};
 const redraw=()=>{const a=$('anSh');if(a&&!a.hidden)renderAn();else renderM()};
 const per=()=>{const w=h('div','tp-chips');PERM.forEach(([d,l])=>{const b=h('button');b.type='button';b.textContent=l;b.classList.toggle('on',mp===d);b.onclick=()=>{mp=d;try{localStorage.setItem('crm-mper',String(d))}catch(e){}redraw()};w.append(b)});return w};
 const pct=(a,b)=>b?Math.round(a/b*100)+'%':'—';
 function openSeg(sg){let sh=$('segSheet');if(!sh){sh=h('div','sheet');sh.id='segSheet';sh.style.zIndex=4;document.body.append(sh)}sh.hidden=false;sh.textContent='';
  const w=h('div'),top=h('div','top'),x=h('button','btn ico pk');x.type='button';x.title=x.ariaLabel='Chiudi';x.innerHTML=ICONS.back;x.onclick=()=>{sh.hidden=true};top.append(h('h2','',sg.nome),x);
  const ms=members(sg).sort((a,b)=>(b.fav?1:0)-(a.fav?1:0)||fullName(a).localeCompare(fullName(b),'it'));
  const mk=ms.filter(c=>c.email&&c.privacy&&c.privacy.cons&&c.privacy.cons.mkEmail&&c.privacy.cons.mkEmail.v);
  w.append(top,h('div','hint',rtxt(sg)+' — '+ms.length+(ms.length===1?' contatto':' contatti')));
  const ac=h('div'),cp=h('button','btn lbl');ac.style.cssText='display:flex;gap:8px;margin:8px 0';cp.style.cssText='flex:1;white-space:nowrap';cp.type='button';cp.innerHTML='<span>'+ICONS.Scrivi+'</span> Copia email ('+mk.length+')';cp.title='Copia le email dei contatti con consenso al marketing via email';
  cp.onclick=async()=>{if(!mk.length){toast('Nessun contatto di questo segmento ha dato il consenso al marketing via email.');return}toast(await copyText(mk.map(c=>c.email).join(', '))?'Copiate '+mk.length+' email con consenso marketing.':'Copia non riuscita.')};ac.append(cp);
  if(!sg.pre){const ed=h('button','btn lbl');ed.style.cssText='flex:1;white-space:nowrap';ed.type='button';ed.innerHTML='<span>'+ICONS.edit+'</span> Modifica';ed.onclick=()=>{sh.hidden=true;editSeg(sg)};ac.append(ed)}
  const cb=h('button','btn p lbl');cb.type='button';cb.style.cssText='flex:1;white-space:nowrap';cb.innerHTML='<span>'+ICONS.Scrivi+'</span> Invia campagna';cb.onclick=()=>{sh.hidden=true;openJrEd(null,sg.id)};ac.append(cb);
  w.append(ac);if(ms.length&&mk.length<ms.length)w.append(h('div','hint','Vengono copiate solo le email di chi ha dato il consenso al marketing: gli altri ('+(ms.length-mk.length)+') si possono contattare solo per il rapporto in corso.'));
  const L=h('div');L.style.marginTop='10px';if(!ms.length)L.append(h('div','empty','Nessun contatto in questo segmento.'));
  ms.forEach(c=>{const b=h('button','row'),nm=fullName(c),t=h('div','tx'),g=gg(c);t.append(h('b','',nm),h('span','',[c.ruolo,c.azienda].filter(Boolean).join(', ')),h('em','',g===null?'Nessun contatto registrato':'Ultimo contatto '+g+(g===1?' giorno fa':' giorni fa')));const av=h('div','av',(nm[0]||'?').toUpperCase());av.style.background='var(--lilac)';b.append(av,t);b.onclick=()=>openSheet(c);L.append(b)});
  w.append(L);sh.append(w);sh.scrollTop=0}
 function editSeg(sg){let sh=$('segEd');if(!sh){sh=h('div','sheet');sh.id='segEd';sh.style.zIndex=4;document.body.append(sh)}sh.hidden=false;sh.textContent='';
  const q=JSON.parse(JSON.stringify(sg?(sg.q||{op:'AND',conds:[]}):{op:'AND',conds:[]}));q.conds=q.conds.filter(k=>FDM[k.f]);
  const w=h('div'),top=h('div','top'),x=h('button','btn ico pk');x.type='button';x.title=x.ariaLabel='Chiudi';x.innerHTML=ICONS.back;x.onclick=()=>{sh.hidden=true};top.append(h('h2','',sg?'Modifica segmento':'Nuovo segmento'),x);w.append(top);
  const f1=h('div','f');f1.append(h('label','','Nome'));const nome=h('input');nome.value=sg?sg.nome:'';nome.placeholder='Es. Ristoranti da riattivare';nome.id='seg_nome';f1.append(nome);{const er=h('div','err');er.id='err-seg_nome';er.hidden=true;f1.append(er)}w.append(f1);
  const f2=h('div','f');f2.append(h('label','','Chi rientra nel segmento'));const os=h('div','seg');const ob={};[['AND','Tutte le condizioni'],['OR','Almeno una']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.onclick=()=>{q.op=k;paint()};os.append(b);ob[k]=b});f2.append(os);const oh=h('div','hint');f2.append(oh);w.append(f2);
  const L=h('div');w.append(L);const add=h('button','btn lbl');add.type='button';add.innerHTML='<span>'+ICONS.plus+'</span> Aggiungi condizione';add.onclick=()=>{q.conds.push(dflt('stato'));paint()};w.append(add);
  const cnt=h('div','hint');cnt.style.marginTop='10px';w.append(cnt);const pv=h('div','hint');w.append(pv);
  const dflt=f=>{const d=FDM[f];return d.type==='bool'?C_(f,'eq','si'):d.type==='enum'?C_(f,'eq',(d.opts()[0]||[''])[0]):d.type==='num'?C_(f,'ge',''):C_(f,'ct','')};
  const sel=(opts,v)=>{const s=h('select');opts.forEach(([k,l])=>{const o=h('option','',l);o.value=k;s.append(o)});s.value=v;return s};
  const upd=()=>{const m=members({q}).sort((a,b)=>fullName(a).localeCompare(fullName(b),'it'));cnt.textContent='Corrispondono ora '+m.length+(m.length===1?' contatto':' contatti')+' su '+clients.length+'.';pv.textContent=m.length?'Ad esempio: '+m.slice(0,5).map(fullName).join(', ')+(m.length>5?'…':''):''};
  function paint(){ob.AND.classList.toggle('on',q.op!=='OR');ob.OR.classList.toggle('on',q.op==='OR');oh.textContent=q.op==='OR'?'Basta che il contatto soddisfi una qualsiasi delle condizioni.':'Il contatto deve soddisfare tutte le condizioni.';L.textContent='';
   if(!q.conds.length)L.append(h('div','hint','Nessuna condizione: il segmento comprende tutti i clienti. Aggiungine una per restringerlo.'));
   q.conds.forEach((k,i)=>{if(i){const j=h('div','cjoin',q.op==='OR'?'oppure':'e');L.append(j)}
    const d=FDM[k.f],r=h('div','crow'),l1=h('div','cr1');
    const fs=h('select');['Cliente','Consensi','Opportunità','Contatti','Campagne'].forEach(en=>{const g=h('optgroup');g.label=en;FD.filter(z=>z.ent===en).forEach(z=>{const o=h('option','',z.label);o.value=z.id;g.append(o)});fs.append(g)});fs.value=k.f;fs.onchange=()=>{q.conds[i]=dflt(fs.value);paint()};
    const dl=h('button','btn ico');dl.type='button';dl.title=dl.ariaLabel='Rimuovi condizione';dl.innerHTML=ICONS.trash;dl.onclick=()=>{q.conds.splice(i,1);paint()};l1.append(fs,dl);r.append(l1);
    const l2=h('div','cr2');
    const chips=(opts,cur,set)=>{const w2=h('div','cchips');opts.forEach(([v,l])=>{const c=h('button','',l);c.type='button';c.classList.toggle('on',cur()===v);c.onclick=()=>{set(v);[...w2.children].forEach((x,ix)=>x.classList.toggle('on',opts[ix][0]===v));upd()};w2.append(c)});return w2};
    if(d.type==='bool')l2.append(chips([['si','Sì'],['no','No']],()=>k.v,v=>k.v=v));
    else{const os=h('div','seg');OPS[d.type].forEach(([ok,ol])=>{const b2=h('button','',ol);b2.type='button';b2.classList.toggle('on',k.o===ok);b2.onclick=()=>{k.o=ok;[...os.children].forEach(x=>x.classList.toggle('on',x===b2));upd()};os.append(b2)});l2.append(os);
     if(d.type==='enum'){const op=d.opts();l2.append(op.length?chips(op,()=>k.v,v=>k.v=v):h('div','hint','Non ci sono ancora valori disponibili.'))}
     else{const v=h('input');v.type=d.type==='num'?'number':'text';if(d.type==='num'){v.inputMode='numeric';v.min=0}v.value=k.v||'';v.placeholder=d.type==='num'?'Numero':'Testo';v.oninput=()=>{k.v=v.value;upd()};l2.append(v)}}
    r.append(l2);L.append(r)});upd()}
  paint();
  const ac=h('div','delw');const saveSeg=()=>{const nm=nome.value.trim();if(!nm){setErr('seg_nome','Dai un nome al segmento.');nome.focus();return false}setErr('seg_nome','');if(sg){sg.nome=nm;sg.q=q}else S.segs.push({id:'s'+Date.now().toString(36),nome:nm,q});saveS();sh.hidden=true;renderM();toast('Segmento salvato.');return true};
  if(sg){const dl=h('button','btn lbl d');dl.type='button';dl.style.width='100%';dl.innerHTML='<span>'+ICONS.trash+'</span> Elimina segmento';dl.onclick=()=>{const used=S.jr.filter(j=>j.segId===sg.id).length;askConfirm('Eliminare il segmento “'+sg.nome+'”?'+(used?' È usato da '+used+(used===1?' campagna, che si fermerà.':' campagne, che si fermeranno.'):' I contatti non vengono toccati.'),'trash','Elimina',()=>{S.segs=S.segs.filter(z=>z!==sg);saveS();sh.hidden=true;renderM()})};ac.append(dl)}
  w.append(ac);saveBtn(ac,()=>JSON.stringify([nome.value,q]),saveSeg);sh.append(w);sh.scrollTop=0;{const bk=sh.querySelector('.top button');if(bk)dirtyBack(bk,()=>JSON.stringify([nome.value,q]),saveSeg,()=>{sh.hidden=true})}}
 function paneSeg(H){const add=h('button','btn p lbl');add.type='button';add.innerHTML='<span>'+ICONS.plus+'</span> Nuovo segmento';add.onclick=()=>editSeg(null);H.append(add);
  [['Segmenti pronti',PRE],['I tuoi segmenti',S.segs]].forEach(([t,a])=>{if(!a.length&&t!=='I tuoi segmenti')return;{const hh=h('div','hh');hh.append(h('span','',t));H.append(hh)}
   if(!a.length)H.append(h('div','hint','Nessun segmento tuo: creane uno con “Nuovo segmento”.'));
   a.forEach(sg=>{const b=h('button','row'),n=members(sg).length,tx=h('div','tx');tx.append(h('b','',sg.nome),h('span','',rtxt(sg)));const c=h('span','chv');c.innerHTML=ICONS.chevR;const bd=h('i','cst',String(n));bd.style.background='var(--lilac)';b.append(tx,bd,c);b.onclick=()=>openSeg(sg);H.append(b)})})}
 function paneFun(H){H.append(per());const f=from();
  const L=leads.filter(l=>!f||(l.creato||l.data||0)>=f),cv=L.filter(l=>l.stato==='convertito'),sc=L.filter(l=>l.stato==='scartato'),nu=L.filter(l=>l.stato==='nuovo');
  let b=box('Lead → cliente','Lead ricevuti nel periodo e quanti sono diventati clienti. Il tasso è convertiti su ricevuti; il tempo è la media tra l’arrivo del lead e la conversione.');
  const v=h('div','wb-v');v.append(h('span','',pct(cv.length,L.length)),h('small','',cv.length+' convertiti su '+L.length+' lead'));b.append(v,bar(L.length?cv.length/L.length*100:0,'#b5ebc0'));
  const tm=cv.filter(l=>l.convertito&&(l.creato||l.data)).map(l=>(l.convertito-(l.creato||l.data))/DAY);b.append(rowKV('Da gestire '+nu.length,'Scartati '+sc.length,tm.length?'Tempo medio '+Math.round(tm.reduce((a,x)=>a+x,0)/tm.length)+' gg':''));
  const bf={};L.forEach(l=>{const k={web:'Form web',email:'Email',manuale:'Manuale'}[l.fonte]||l.fonte||'Altro';(bf[k]=bf[k]||[0,0])[0]++;if(l.stato==='convertito')bf[k][1]++});
  Object.entries(bf).forEach(([k,[a,c]])=>{const r=h('div','pbar');r.append(h('span','',k+' '),bar(a?c/a*100:0,'#b5ebc0'),h('em','',c+'/'+a+' · '+pct(c,a)));b.append(r)});if(!L.length)b.append(h('div','hint','Nessun lead nel periodo.'));H.append(b);
  const O=opps.filter(o=>!f||tsOf(o.creata)>=f),W=O.filter(o=>o.fase==='vinta'),P=O.filter(o=>o.fase==='persa'),A=O.filter(o=>o.fase!=='vinta'&&o.fase!=='persa');
  b=box('Opportunità','Opportunità create nel periodo. Tasso di vittoria = vinte su chiuse (vinte + perse). Ciclo medio = giorni tra creazione e chiusura delle vinte.');
  const v2=h('div','wb-v');v2.append(h('span','',pct(W.length,W.length+P.length)),h('small','vittoria · '+O.length+' create'));b.append(v2,bar(W.length+P.length?W.length/(W.length+P.length)*100:0,'#b5ebc0'));
  const cy=W.filter(o=>o.chiusa).map(o=>(tsOf(o.chiusa)-tsOf(o.creata))/DAY).filter(x=>x>=0);b.append(rowKV('Vinte '+W.length+' · '+eur(sm(W,o=>o.valore)),'Perse '+P.length,cy.length?'Ciclo medio '+Math.round(cy.reduce((a,x)=>a+x,0)/cy.length)+' gg':''));
  const mx=Math.max(1,O.length);[['Create',O.length,'#bfe0f8'],['Aperte',A.length,'#f6edb8'],['Vinte',W.length,'#b5ebc0'],['Perse',P.length,'#f5cad6']].forEach(([l,n,c])=>{const r=h('div','pbar'),lb=h('span','',l+' ');lb.append(h('small','','('+n+')'));r.append(lb,bar(n/mx*100,c),h('em','',pct(n,O.length)));b.append(r)});
  FASI.slice(0,4).forEach(fs=>{const it=A.filter(o=>o.fase===fs[0]);const r=h('div','pbar'),lb=h('span','','· '+fs[1]+' ');lb.append(h('small','','('+it.length+')'));r.append(lb,bar(A.length?it.length/A.length*100:0,fs[3]),h('em','',eur(sm(it,o=>o.valore))));b.append(r)});H.append(b);
  const bo={};O.forEach(o=>{const k=o.fonte||'Altro';(bo[k]=bo[k]||{n:0,w:0,c:0,v:0});bo[k].n++;if(o.fase==='vinta'){bo[k].w++;bo[k].v+=o.valore||0}if(o.fase==='vinta'||o.fase==='persa')bo[k].c++});
  b=box('Per fonte','Per ogni fonte: opportunità create, tasso di vittoria sulle chiuse e valore vinto.');Object.entries(bo).sort((a,c)=>c[1].v-a[1].v).forEach(([k,x])=>{const r=h('div','pbar');r.append(h('span','',k+' '),bar(x.c?x.w/x.c*100:0,'#b5ebc0'),h('em','',x.n+' · '+pct(x.w,x.c)+' · '+eur(x.v)));b.append(r)});if(!O.length)b.append(h('div','hint','Nessuna opportunità nel periodo.'));H.append(b)}
 function paneEng(H){H.append(per());const f=from();
  const bk=[['Attivi (≤30 gg)',0,30,'#b5ebc0'],['31–90 gg',31,90,'#f6edb8'],['Oltre 90 gg',91,1e9,'#f7d9bb'],['Mai contattati',-1,-1,'#f5cad6']],cnt=bk.map(()=>0);clients.forEach(c=>{const g=gg(c);bk.forEach((x,i)=>{if(g===null?x[1]===-1:(x[1]!==-1&&g>=x[1]&&g<=x[2]))cnt[i]++})});
  const rf=h('button','btn lbl');rf.type='button';rf.innerHTML='<span>'+ICONS.reset+'</span> Aggiorna email dei clienti';rf.title='Legge da Gmail le email scambiate con i clienti e ne registra data e direzione';
  rf.onclick=async()=>{const L=clients.filter(c=>c.email);if(!L.length){toast('Nessun cliente con email.');return}rf.disabled=true;let i=0,add=0;try{for(const c of L){rf.textContent='Lettura '+(++i)+' di '+L.length+'…';const n0=(c.em||[]).length;delete TM[c.id];await touchMail(c);add+=(c.em||[]).length-n0}toast(add?'Registrate '+add+' email.':'Nessuna email nuova (o Gmail non raggiungibile).')}finally{redraw()}};H.append(rf);
  let b=box('Contatti con i clienti','Quanto tempo è passato dall’ultimo contatto registrato: messaggi WhatsApp, email (solo data e direzione) e informative inviate. Le email si registrano quando scrivi dall’app o apri la scheda del cliente; “Aggiorna email” le legge da Gmail per tutti.');
  const v=h('div','wb-v');v.append(h('span','',String(clients.length)),h('small','clienti e prospect'));b.append(v);bk.forEach((x,i)=>{const r=h('div','pbar'),lb=h('span','',x[0]);r.append(lb,bar(clients.length?cnt[i]/clients.length*100:0,x[3]),h('em','',String(cnt[i])));b.append(r)});H.append(b);
  let ws=0,wr=0;const inP=d=>!f||tsOf(d)>=f;clients.forEach(c=>(c.wa||[]).forEach(m=>{if(inP(m.data))m.dir==='out'?ws++:wr++}));leads.forEach(l=>(l.wa||[]).forEach(m=>{if(inP(m.data))m.dir==='out'?ws++:wr++}));let es=0,er=0,cs=0,cr=0;clients.forEach(c=>(c.em||[]).forEach(m=>{if(inP(m.data))m.dir==='out'?cs++:cr++}));leads.forEach(l=>(l.msgs||[]).forEach(m=>{if(inP(m.data))m.dir==='out'?es++:er++}));
  b=box('Messaggi nel periodo','Messaggi registrati nell’app per clienti e lead. Le email dei clienti contano da quando sono registrate (vedi “Aggiorna email”).');b.append(rowKV('WhatsApp inviati '+ws,'ricevuti '+wr),rowKV('Email clienti inviate '+cs,'ricevute '+cr),rowKV('Email lead inviate '+es,'ricevute '+er));H.append(b);
  const nc=n=>clients.filter(c=>c.privacy&&c.privacy.cons&&c.privacy.cons[n]&&c.privacy.cons[n].v).length;
  b=box('Consensi','Quanti clienti hanno dato il consenso: sono quelli che puoi raggiungere con comunicazioni di marketing.');[['Informativa data',clients.filter(c=>c.privacy&&c.privacy.informativa).length],['Marketing via email',nc('mkEmail')],['Marketing telefono e WhatsApp',nc('mkTel')]].forEach(([l,n])=>{const r=h('div','pbar');r.append(h('span','',l),bar(clients.length?n/clients.length*100:0,'#bfe0f8'),h('em','',n+' · '+pct(n,clients.length)));b.append(r)});H.append(b);
  const cold=clients.map(c=>[c,gg(c)]).filter(x=>x[1]===null||x[1]>90).sort((a,c)=>(c[0].fav?1:0)-(a[0].fav?1:0)||(c[1]===null?1e9:c[1])-(a[1]===null?1e9:a[1])).slice(0,6);
  if(cold.length){const hh=h('div','hh');hh.append(h('span','','Da riattivare'));H.append(hh);cold.forEach(([c,g])=>{const r=h('button','row'),t=h('div','tx'),nm=fullName(c);t.append(h('b','',(c.fav?'★ ':'')+nm),h('em','',g===null?'Nessun contatto registrato':g+' giorni senza contatti'));const av=h('div','av',(nm[0]||'?').toUpperCase());av.style.background='var(--lilac)';r.append(av,t);r.onclick=()=>openSheet(c);H.append(r)})}}
 /* ----- campagne ----- */
 S.camps=S.camps||[];
 const FOOT='\n\nSe non desideri più ricevere nostre comunicazioni, rispondi con la parola STOP.';
 const eligible=(ms,ch)=>{const ok=[],no={cons:0,dato:0};ms.forEach(c=>{const k=ch==='wa'?'mkTel':'mkEmail',has=ch==='wa'?c.telefono:c.email;if(!(c.privacy&&c.privacy.cons&&c.privacy.cons[k]&&c.privacy.cons[k].v)){no.cons++;return}if(!has){no.dato++;return}ok.push(c)});return{ok,no}};
 const campHtml=(t,sj)=>{const e=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),i=t.lastIndexOf(FOOT),a=i<0?t:t.slice(0,i),rt=S.replyTo,ok=rt&&/^[^\s@]+@[^\s@]+$/.test(rt);
  const btn=ok?'<p style="margin:18px 0 6px"><a href="mailto:'+e(rt)+'?subject='+encodeURIComponent('STOP – '+sj)+'&amp;body='+encodeURIComponent('STOP\n\nNon desidero più ricevere comunicazioni di marketing.')+'" style="display:inline-block;padding:10px 16px;background:#f5cad6;color:#263045;text-decoration:none;border-radius:10px;font-weight:bold">Annulla iscrizione</a></p>':'';
  return '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#263045;max-width:560px">'+e(a).replace(/\n/g,'<br>')+btn+'<p style="font-size:12px;color:#6b7488">Se non desideri più ricevere nostre comunicazioni, tocca “Annulla iscrizione” o rispondi con la parola STOP. Questa email non contiene strumenti di tracciamento.</p></div>'};
 const first=c=>c.tipo==='azienda'?(c.nome||fullName(c)):(c.nome||fullName(c));
 const fillT=(t,c)=>tpl(t,{nome:first(c)});
 const cdesc=cp=>{const d=cp.dest||[],ok=d.filter(x=>x.st==='ok').length;let rs=0,op=0;d.forEach(x=>{const t=tsOf(x.d||cp.data),c=clients.find(z=>z.id===x.id);if(!c)return;if([...(c.em||[]),...(c.wa||[])].some(m=>m.dir==='in'&&tsOf(m.data)>t))rs++;if(opps.some(o=>o.clienteId===c.id&&tsOf(o.creata)>=t-864e5))op++});return{ok,tot:d.length,rs,op}};
 const shell=(id,title)=>{let sh=$(id);if(!sh){sh=h('div','sheet');sh.id=id;sh.style.zIndex=4;document.body.append(sh)}sh.hidden=false;sh.textContent='';const w=h('div'),top=h('div','top'),x=h('button','btn ico pk');x.type='button';x.title=x.ariaLabel='Chiudi';x.innerHTML=ICONS.back;x.onclick=()=>{sh.hidden=true;renderM()};top.append(h('h2','',title),x);w.append(top);sh.append(w);sh.scrollTop=0;return w};
 function openQueue(cp){const w=shell('campQ',cp.nome);
  const info=h('div','hint');w.append(info);const L=h('div');w.append(L);
  const paintQ=()=>{const d=cp.dest,ok=d.filter(x=>x.st==='ok').length;info.textContent=ok+' di '+d.length+' inviati. '+'Tocca “Apri” per ogni contatto: il messaggio è già pronto, devi solo premere invio.';L.textContent='';
   d.forEach(x=>{const c=clients.find(z=>z.id===x.id);if(!c)return;const r=h('div','row'),t=h('div','tx');r.style.cursor='default';t.style.cssText='flex:1;min-width:0';t.append(h('b','',fullName(c)),h('em','',x.st==='ok'?'Inviato':x.st==='err'?'Errore':'Da inviare'));r.append(t);
    if(x.st!=='ok'){const b=h('button','btn lbl');b.type='button';b.style.cssText='flex:none;white-space:nowrap;width:auto';b.innerHTML='<span>'+ICONS.WhatsApp+'</span> Apri';b.onclick=async()=>{const txt=fillT(cp.txt,c);const log=()=>{(c.wa=c.wa||[]).push({id:waId(),dir:'out',data:new Date().toISOString(),testo:txt,fonte:'campagna'});x.st='ok';c.agg=new Date().toISOString();persist();saveS();paintQ()};
     log();launch('https://wa.me/'+waNum(c)+'?text='+encodeURIComponent(txt),txt)};r.append(b)}L.append(r)})};paintQ()}
function stops(){const out=[];clients.forEach(c=>{const p=c.privacy&&c.privacy.cons;if(!p||!((p.mkEmail&&p.mkEmail.v)||(p.mkTel&&p.mkTel.v)))return;let t=0;S.camps.forEach(cp=>{if(cp.dest.some(x=>x.id===c.id&&x.st==='ok')){const v=tsOf(cp.data);if(!t||v<t)t=v}});if(!t)return;const ig=c.stopOk?tsOf(c.stopOk):0;
   const hit=[...(c.em||[]).filter(m=>m.stop),...(c.wa||[]).filter(m=>/^\s*stop\b|annull\w*\s+iscrizione|disiscri|non voglio pi/i.test(m.testo||''))].filter(m=>m.dir==='in'&&tsOf(m.data)>t&&tsOf(m.data)>ig).sort((a,b)=>tsOf(b.data)-tsOf(a.data))[0];if(hit)out.push([c,hit])});return out}
 const revoke=(c,auto)=>{const pv=c.privacy=c.privacy||mkPriv(),d=ymd(),prev={};['mkEmail','mkTel'].forEach(k=>{if(pv.cons[k]&&pv.cons[k].v){prev[k]=pv.cons[k].d;pv.cons[k]={v:false,d};logP(c,CLABEL[k]+': revocato '+(auto?'automaticamente':'')+' su richiesta (STOP a una campagna)','revoca')}});c.stopOk=new Date().toISOString();if(auto)c.stopAuto={d:c.stopOk,prev};c.agg=c.stopOk;persist()};
 window.applyStops=()=>{const L=stops();L.forEach(([c])=>revoke(c,true));return L.length};
 const restore=c=>{const pv=c.privacy,sa=c.stopAuto;if(!pv||!sa)return;Object.keys(sa.prev||{}).forEach(k=>{pv.cons[k]={v:true,d:sa.prev[k]||ymd()}});logP(c,'Consensi di marketing ripristinati manualmente dopo revoca automatica','consenso');delete c.stopAuto;c.stopOk=new Date().toISOString();c.agg=c.stopOk;persist()};
 function paneCamp(H){try{applyStops()}catch(e){}
  const AU=clients.filter(c=>c.stopAuto&&Date.now()-tsOf(c.stopAuto.d)<90*DAY).sort((x,y)=>tsOf(y.stopAuto.d)-tsOf(x.stopAuto.d));
  if(AU.length){const bx=box('Disiscritti ('+AU.length+')','Chi risponde STOP (o tocca “Annulla iscrizione”) a una campagna perde subito il consenso al marketing. Se è stato un errore, puoi ripristinarlo.');
   AU.forEach(c=>{const r=h('div','pbar');r.style.gridTemplateColumns='minmax(0,1fr) auto';const nm=h('span','',fullName(c)+' · '+fmtD(c.stopAuto.d.slice(0,10)));const rv=h('button','btn lbl');rv.type='button';rv.style.cssText='height:34px;padding:0 10px;white-space:nowrap';rv.textContent='Ripristina';rv.onclick=()=>askConfirm('Ripristinare i consensi di marketing di '+fullName(c)+'? Fallo solo se ti ha confermato di volerli.','check','Ripristina',()=>{restore(c);toast('Consensi ripristinati.');renderM()});r.append(nm,rv);bx.append(r)});H.append(bx)}
  ovCamps(H);
  H.append(h('div','hint','Le risposte si contano dai messaggi registrati sul cliente: per le email usa “Aggiorna email dei clienti” in Engagement. Chi risponde STOP o tocca “Annulla iscrizione” perde subito il consenso al marketing: leggo le risposte dalle email registrate e dai messaggi WhatsApp.'))}
 /* ----- campagna sempre attiva: compleanno ----- */
 S.auto=S.auto||{};S.auto.bday=Object.assign({on:false,canale:'email',sub:'Tanti auguri {nome}!',txt:'Gentile {nome},\n\nda parte di tutti noi di {mittente} tanti auguri di buon compleanno!\n'},S.auto.bday||{});
 const bdayCamp=()=>{let k=S.camps.find(x=>x.id==='k_bday');if(!k){k={id:'k_bday',auto:1,nome:'Compleanno (sempre attiva)',segNome:'Compleanno del giorno',canale:S.auto.bday.canale,data:new Date().toISOString(),sub:'',txt:'',dest:[]};S.camps.unshift(k)}k.canale=S.auto.bday.canale;k.sub=S.auto.bday.sub;k.txt=S.auto.bday.txt;return k};
 const isBday=(c,d)=>{const n=c.nascita;if(!n||!/^\d{4}-\d\d-\d\d$/.test(n))return false;let md=n.slice(5);if(md==='02-29'&&!(new Date(d.getFullYear(),1,29).getMonth()===1))md='02-28';return md===ymd(d).slice(5)};
 let bBusy=false;
 window.runBday=async function(){const B=S.auto.bday;if(!B.on||bBusy)return 0;bBusy=true;let n=0;try{const now=new Date(),yr=now.getFullYear(),ch=B.canale;
  const todo=eligible(clients.filter(c=>isBday(c,now)&&c.bdayYear!==yr),ch).ok;if(!todo.length)return 0;
  const k=bdayCamp();
  if(ch==='wa'){todo.forEach(c=>{c.bdayYear=yr;k.dest.push({id:c.id,st:'att',d:new Date().toISOString()});n++});persist();saveS();return n}
  let mcp;try{mcp=await gm()}catch(e){}if(!mcp||!autoOk())return 0;
  if(!S.replyTo){try{const me=await detectMe();if(me.email){S.replyTo=me.email;saveS()}}catch(e){}}
  for(const c of todo){c.bdayYear=yr;persist();const body=fillT(B.txt,c)+'\n\n'+tpl(S.firma||'')+FOOT;
   try{await PV().send(mcp,{to:c.email,subject:fillT(B.sub,c),text:body,html:campHtml(body,fillT(B.sub,c)),fromName:mitt(),atts:[]});k.dest.push({id:c.id,st:'ok',d:new Date().toISOString()});emSave(c,null,true);n++}
   catch(e){delete c.bdayYear;persist();break}}
  if(k.dest.length>400)k.dest=k.dest.slice(-400);saveS();return n}finally{bBusy=false;try{if(n&&tab==='mkt')renderM()}catch(e){}}};
 function openBday(){const w=shell('bdSh','Compleanno'),B=S.auto.bday;
  const fld=(l,el)=>{const f=h('div','f');f.append(h('label','',l),el);w.append(f);return el};
  w.append(h('div','hint','Ogni giorno, quando l’app è aperta, viene mandato un augurio a chi compie gli anni. Serve la data di nascita e il consenso al marketing per il canale scelto. Ogni cliente riceve un solo augurio all’anno.'));
  const cs=h('div','seg');const chb={};[['email','Email'],['wa','WhatsApp']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.onclick=()=>{B.canale=k;paint()};cs.append(b);chb[k]=b});fld('Canale',cs);
  const sub=fld('Oggetto',h('input'));sub.value=B.sub;const tx=fld('Messaggio',h('textarea'));tx.rows=6;tx.value=B.txt;
  const hint=h('div','hint');w.append(hint);
  const paint=()=>{chb.email.classList.toggle('on',B.canale==='email');chb.wa.classList.toggle('on',B.canale==='wa');sub.parentNode.hidden=B.canale!=='email';const nb=clients.filter(c=>c.nascita).length,E=eligible(clients.filter(c=>c.nascita),B.canale);hint.textContent=nb+' contatti con data di nascita, '+E.ok.length+' raggiungibili con consenso. '+(B.canale==='wa'?'Su WhatsApp l’augurio non parte da solo: compare in coda e lo invii con un tocco.':'')};
  paint();const c0=B.canale;const sv9=()=>{B.sub=sub.value;B.txt=tx.value;saveS();$('bdSh').hidden=true;renderM();toast('Campagna salvata.')},sg9=()=>JSON.stringify([B.canale,sub.value,tx.value]);{const sw=h('div','delw');w.append(sw);saveBtn(sw,sg9,sv9)}dirtyBack(w.querySelector('.top button'),sg9,sv9,()=>{B.canale=c0;$('bdSh').hidden=true;renderM()})}
 /* ----- campagna sempre attiva: richiesta consensi ----- */
 S.auto.cons=Object.assign({on:false,max:10},S.auto.cons||{});
 const consCamp=()=>{let k=S.camps.find(x=>x.id==='k_cons');if(!k){k={id:'k_cons',auto:1,nome:'Richiesta consensi (sempre attiva)',segNome:'Consenso marketing mai espresso',canale:'email',data:new Date().toISOString(),sub:'',txt:'',dest:[]};S.camps.unshift(k)}return k};
 const needCons=c=>{if(!c.email||!mailRe.test(c.email))return false;const pv=c.privacy,m=pv&&pv.cons&&pv.cons.mkEmail;if(m&&(m.v||m.d))return false;const R=((pv&&pv.richieste)||[]).filter(r=>r.stato!=='annullata');if(R.some(r=>r.stato==='completata'))return false;const last=R.map(r=>tsOf(r.creata)).sort((a,b)=>b-a)[0];if(R.length>=2)return false;if(last&&Date.now()-last<14*DAY)return false;return true};
 window.needCons=needCons;let cBusy=false;
 window.runCons=async function(){const C=S.auto.cons;if(!C.on||cBusy||!S.azienda)return 0;cBusy=true;let n=0;try{const todo=clients.filter(needCons).slice(0,C.max||10);if(!todo.length)return 0;
  let mcp;try{mcp=await gm()}catch(e){}if(!mcp||!autoOk())return 0;if(!S.replyTo){try{const me=await detectMe();if(me.email){S.replyTo=me.email;saveS()}}catch(e){}}
  const k=consCamp();
  for(const c of todo){const now=new Date(),rq0={id:'r'+Date.now().toString(36)+n,token:tok(),creata:now.toISOString().slice(0,16),scade:new Date(now.getTime()+14*DAY).toISOString().slice(0,16),email:c.email,stato:'inviata',auto:1};
   try{const text=mailText(c,rq0),sj=INFO_SUBJ(),a={to:c.email,subject:sj,text,fromName:mitt()};if(S.replyTo&&mailRe.test(S.replyTo))a.html=mailHtml(text,rq0,S.replyTo,sj);
    const res=await PV().send(mcp,a);rq0.via=PV().id;const pl=res&&res.payload;if(pl&&typeof pl==='object'){if(pl.id)rq0.msgId=String(pl.id);if(pl.threadId)rq0.threadId=String(pl.threadId)}
    const p=c.privacy=c.privacy||mkPriv();p.richieste=p.richieste||[];p.richieste.push(rq0);logP(c,'Richiesta di consensi inviata automaticamente a '+c.email+' (codice '+rq0.token+', valido fino al '+fmtD(rq0.scade.slice(0,10))+')','invio');
    k.dest.push({id:c.id,st:'ok',d:new Date().toISOString()});emSave(c,null,true);persist();n++}catch(e){break}}
  if(k.dest.length>400)k.dest=k.dest.slice(-400);saveS();return n}finally{cBusy=false;try{if(n){render();if(tab==='mkt')renderM()}}catch(e){}}};
 /* ----- percorsi di campagna (passi, attese, ripetizioni) ----- */
 const segById=id=>PRE.find(x=>x.id===id)||S.segs.find(x=>x.id===id);
 const newStep=(first,ch)=>({id:'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),ch:ch||'email',wait:first?0:3,cond:first?'sempre':'norisp',sub:first?'Una novità per te da {mittente}':'Hai visto la nostra proposta?',txt:first?'Gentile {nome},\n\nvolevamo condividere con te una novità.\n\n':'Gentile {nome},\n\nvolevamo ricordarti la nostra proposta: restiamo a disposizione.\n\n'});
 const msgs=c=>[...(c.em||[]),...(c.wa||[])];
 const repliedSince=(c,t)=>msgs(c).some(m=>m.dir==='in'&&tsOf(m.data)>t);
 function jrStat(j){const CM=new Map(clients.map(c=>[c.id,c]));return j.steps.map((s,i)=>{const o={ok:0,att:0,skip:0,rep:0,L:{ok:[],att:[],skip:[],rep:[]}};Object.entries(j.dest).forEach(([id,e])=>{const st=e.s[s.id];if(!st)return;o[st.st]=(o[st.st]||0)+1;const c=CM.get(id);if(c&&o.L[st.st])o.L[st.st].push([c,st.d,st.w==='consenso'?'senza consenso':st.w==='risposto'?'aveva già risposto':'']);if(st.st==='ok'&&c){const nx=j.steps[i+1],nt=nx&&e.s[nx.id]?tsOf(e.s[nx.id].d):Infinity,t0=tsOf(st.d);if(msgs(c).some(m=>m.dir==='in'&&tsOf(m.data)>t0&&tsOf(m.data)<nt)){o.rep++;o.L.rep.push([c,st.d,''])}}});return o})}
 const listOf=(d,fn)=>{const L={ok:[],att:[],skip:[],rep:[]};d.forEach(x=>{const c=clients.find(z=>z.id===x.id);if(!c)return;const k=x.st==='ok'?'ok':x.st==='att'?'att':'skip';L[k].push([c,x.d,'']);if(x.st==='ok'&&repliedSince(c,tsOf(x.d)))L.rep.push([c,x.d,''])});return L};
 function showList(title,items){const w=shell('jrL',title);if(!items.length){w.append(h('div','empty','Nessun contatto.'));return}items.slice().sort((a,b)=>String(b[1]||'').localeCompare(String(a[1]||''))).forEach(([c,d,note])=>{const r=h('button','row'),t=h('div','tx'),nm=fullName(c);t.append(h('b','',nm),h('span','',[c.ruolo,c.azienda].filter(Boolean).join(', ')));const bits=[];if(d)bits.push(fmtDT(String(d).replace(/Z$/,'').slice(0,16)+'Z'));if(note)bits.push(note);if(bits.length)t.append(h('em','',bits.join(' · ')));const av=h('div','av',(nm[0]||'?').toUpperCase());av.style.background='var(--lilac)';r.append(av,t);r.onclick=()=>openSheet(c);w.append(r)})}
 async function sendStepMail(mcp,c,s){if(!S.replyTo){try{const me=await detectMe();if(me.email){S.replyTo=me.email;saveS()}}catch(e){}}const body=fillT(s.txt,c)+'\n\n'+tpl(S.firma||'')+FOOT;await PV().send(mcp,{to:c.email,subject:fillT(s.sub,c),text:body,html:campHtml(body,fillT(s.sub,c)),fromName:mitt(),atts:[]});emSave(c,null,true)}
 let jBusy=false;
 window.runJr=async function(){if(jBusy)return 0;jBusy=true;let n=0,dirty=false;try{
  const act=S.jr.filter(j=>j.on&&j.steps.length);if(!act.length)return 0;const now=Date.now(),CM=new Map(clients.map(c=>[c.id,c]));let mcp=null,tried=false,sent=0;
  for(const j of act){const sg=segById(j.segId);if(!sg)continue;const mem=members(sg);
   if(j.mode==='always'||!j.enrolled){mem.forEach(c=>{if(!j.dest[c.id]){j.dest[c.id]={e:new Date().toISOString(),cy:0,s:{}};dirty=true}});if(!j.enrolled){j.enrolled=1;dirty=true}}
   const inSeg=new Set(mem.map(c=>c.id));
   for(const [id,e] of Object.entries(j.dest)){const c=CM.get(id);if(!c)continue;
    const lastS=j.steps[j.steps.length-1],ls=e.s[lastS.id];
    if(ls&&j.rep>0&&now-tsOf(ls.d)>=j.rep*DAY&&inSeg.has(id)){j.dest[id]={e:new Date().toISOString(),cy:(e.cy||0)+1,s:{}};dirty=true;continue}
    let prev=tsOf(e.e);
    for(const s of j.steps){const st=e.s[s.id];if(st){prev=tsOf(st.d);continue}
     if(now<prev+(s.wait||0)*DAY)break;
     if(!eligible([c],s.ch).ok.length){e.s[s.id]={st:'skip',d:new Date().toISOString(),w:'consenso'};dirty=true;prev=now;continue}
     if(s.cond==='norisp'&&repliedSince(c,prev)){e.s[s.id]={st:'skip',d:new Date().toISOString(),w:'risposto'};dirty=true;prev=now;continue}
     if(s.ch==='wa'){e.s[s.id]={st:'att',d:new Date().toISOString()};dirty=true;n++;break}
     if(sent>=20)break;
     if(!tried){tried=true;try{mcp=await gm()}catch(x){}if(!(mcp&&autoOk()))mcp=null}
     if(!mcp){j.lastErr='Invio automatico non disponibile: controlla il collegamento a Gmail.';dirty=true;break}
     try{await sendStepMail(mcp,c,s);e.s[s.id]={st:'ok',d:new Date().toISOString()};delete j.lastErr;dirty=true;n++;sent++}catch(x){j.lastErr=gmSendErr(x);mcp=null;dirty=true}
     break}}}
  return n}finally{jBusy=false;if(dirty)saveS();try{if(tab==='mkt')renderM();const d=$('jrD');if(d&&!d.hidden)jrDraw()}catch(e){}}};
 /* coda WhatsApp di un percorso */
 function openJrQ(j){const w=shell('jrQ',j.nome),CM=new Map(clients.map(c=>[c.id,c]));const info=h('div','hint'),L=h('div');w.append(info,L);
  const paintQ=()=>{const P=[];Object.entries(j.dest).forEach(([id,e])=>j.steps.forEach(s=>{if(e.s[s.id]&&e.s[s.id].st==='att')P.push([CM.get(id),e,s])}));info.textContent=P.length?P.length+' messaggi da inviare. '+'Tocca “Apri” per ogni contatto: il messaggio è già pronto, devi solo premere invio.':'Nessun messaggio WhatsApp in attesa.';L.textContent='';
   P.forEach(([c,e,s])=>{if(!c)return;const r=h('div','row'),t=h('div','tx');r.style.cursor='default';t.style.cssText='flex:1;min-width:0';t.append(h('b','',fullName(c)),h('em','','Da inviare'));r.append(t);
    const b=h('button','btn lbl');b.type='button';b.style.cssText='flex:none;white-space:nowrap;width:auto';b.innerHTML='<span>'+ICONS.WhatsApp+'</span> Apri';
    b.onclick=async()=>{const txt=fillT(s.txt,c),log=()=>{(c.wa=c.wa||[]).push({id:waId(),dir:'out',data:new Date().toISOString(),testo:txt,fonte:'campagna'});e.s[s.id]={st:'ok',d:new Date().toISOString()};c.agg=new Date().toISOString();persist();saveS();paintQ()};
     log();launch('https://wa.me/'+waNum(c)+'?text='+encodeURIComponent(txt),txt)};r.append(b);L.append(r)})};paintQ()}
 /* editor del percorso */
 function openJrEd(j,segId){const w=shell('jrEd',j?'Modifica campagna':'Nuova campagna');
  const d=j?JSON.parse(JSON.stringify({id:j.id,nome:j.nome,segId:j.segId,mode:j.mode,rep:j.rep||0,steps:j.steps})):{id:'j'+Date.now().toString(36),nome:'',segId:segId||'p_mk',mode:'once',rep:0,steps:[newStep(true)]};
  const fld=(l,el,hint)=>{const f=h('div','f');f.append(h('label','',l),el);if(hint)f.append(h('div','hint',hint));w.append(f);return el};
  const nome=fld('Nome della campagna',h('input'));nome.id='jr_nome';{const er=h('div','err');er.id='err-jr_nome';er.hidden=true;nome.parentNode.append(er)}nome.value=d.nome;nome.placeholder='Es. Novità autunno';nome.oninput=()=>d.nome=nome.value;
  const segs=[...PRE,...S.segs];const ss=h('select');segs.forEach(sg=>{const o=h('option','',sg.nome+' ('+members(sg).length+')');o.value=sg.id;ss.append(o)});ss.value=segs.some(x=>x.id===d.segId)?d.segId:segs[0].id;d.segId=ss.value;ss.onchange=()=>{d.segId=ss.value;sum()};fld('A chi',ss);
  const ms=h('div','seg');const mb={};[['once','Una volta'],['always','Sempre attiva']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.onclick=()=>{d.mode=k;pm()};ms.append(b);mb[k]=b});const mh=h('div','hint');const mf=h('div','f');mf.append(h('label','','Chi entra nel percorso'),ms,mh);w.append(mf);
  const pm=()=>{mb.once.classList.toggle('on',d.mode==='once');mb.always.classList.toggle('on',d.mode==='always');mh.textContent=d.mode==='once'?'Entrano i contatti del segmento al momento dell’attivazione.':'Entra anche chi rientra nel segmento in futuro (controllo ogni volta che l’app è aperta).'};pm();
  const SL=h('div');  const hh=h('div','hh');hh.append(h('span','','Passi'));w.append(hh);w.append(SL);
  const sumEl=h('div','hint');
  function sum(){const sg=segById(d.segId),mem=sg?members(sg):[];const E=eligible(mem,d.steps[0]?d.steps[0].ch:'email');sumEl.textContent=mem.length+' contatti nel segmento, '+E.ok.length+' raggiungibili al primo passo con il consenso al marketing.'}
  function paintS(){SL.textContent='';d.steps.forEach((s,i)=>{
   if(i){const c=h('div','fcon');c.append(h('span','',(s.wait?'dopo '+s.wait+(s.wait===1?' giorno':' giorni'):'subito')+(s.cond==='norisp'?' · solo se non ha risposto':'')));SL.append(c)}
   const card=h('div','crow'),hd=h('div','cr1');hd.append(h('b','','Passo '+(i+1)));const bs=h('div');bs.style.cssText='display:flex;gap:6px';
   const mk=(ic,t,fn)=>{const b=h('button','btn ico');b.type='button';b.title=b.ariaLabel=t;b.innerHTML=ICONS[ic];b.onclick=fn;return b};
   bs.append(mk('copy','Duplica passo',()=>{const c=JSON.parse(JSON.stringify(s));c.id=newStep().id;c.wait=Math.max(1,s.wait||3);c.cond='norisp';d.steps.splice(i+1,0,c);paintS();sum()}));if(d.steps.length>1)bs.append(mk('trash','Elimina passo',()=>{d.steps.splice(i,1);if(d.steps[0])d.steps[0].wait=d.steps[0].wait||0;paintS();sum()}));hd.append(bs);card.append(hd);
   const cs=h('div','seg');const cb={};[['email','Email'],['wa','WhatsApp']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.onclick=()=>{s.ch=k;paintS();sum()};cs.append(b);cb[k]=b});cb[s.ch].classList.add('on');card.append(cs);
   const l2=h('div','cr2');const wi=h('input');wi.type='number';wi.min=0;wi.inputMode='numeric';wi.value=s.wait||0;wi.oninput=()=>{s.wait=Math.max(0,Math.round(+wi.value||0));wl.textContent=''};const wf=h('div');wf.append(h('div','hint',i?'Giorni di attesa dal passo prima':'Giorni di attesa dall’ingresso'),wi);const wl=h('span');
   const co=h('select');[['sempre','Sempre'],['norisp','Solo se non ha risposto']].forEach(([k,l])=>{const o=h('option','',l);o.value=k;co.append(o)});co.value=s.cond;co.onchange=()=>s.cond=co.value;const cf=h('div');cf.append(h('div','hint','Condizione'),co);l2.append(wf,cf);card.append(l2);
   if(s.ch==='email'){const su=h('input');su.value=s.sub;su.placeholder='Oggetto';su.oninput=()=>s.sub=su.value;card.append(su)}
   const tx=h('textarea');tx.rows=5;tx.value=s.txt;tx.placeholder='Messaggio: usa {nome} e {mittente}';tx.oninput=()=>s.txt=tx.value;card.append(tx);SL.append(card)})}
  paintS();const ad=h('button','btn lbl');ad.type='button';ad.innerHTML='<span>'+ICONS.plus+'</span> Aggiungi passo';ad.onclick=()=>{d.steps.push(newStep(false,d.steps[d.steps.length-1].ch));paintS();sum();ad.scrollIntoView({block:'center'})};w.append(ad);
  const ri=h('input');ri.type='number';ri.min=0;ri.inputMode='numeric';ri.value=d.rep||0;ri.oninput=()=>d.rep=Math.max(0,Math.round(+ri.value||0));const rf=h('div','f');rf.append(h('label','','Ripeti il percorso dopo (giorni)'),ri,h('div','hint','Dopo l’ultimo passo, il contatto ricomincia dopo questi giorni se è ancora nel segmento. 0 = mai.'));rf.style.marginTop='12px';w.append(rf);
  const fl=h('div','hint');w.append(sumEl,h('div','hint','Le email includono firma e pulsante “Annulla iscrizione”; ricevono i messaggi solo i contatti con il consenso al marketing. L’invio avviene quando l’app è aperta.'),fl);sum();
  const ac=h('div');ac.style.cssText='display:flex;gap:8px;margin-top:12px;flex-wrap:wrap';
  const val=()=>{if(!d.nome.trim()){setErr('jr_nome','Dai un nome alla campagna.');nome.scrollIntoView({block:'center'});return false}setErr('jr_nome','');const bad=d.steps.findIndex(s=>!s.txt.trim()||(s.ch==='email'&&!s.sub.trim()));if(bad>=0){fl.textContent='Completa il passo '+(bad+1)+': servono '+(d.steps[bad].ch==='email'?'oggetto e ':'')+'messaggio.';fl.style.color='var(--danger,#c0392b)';return false}return true};
  const save=on=>{if(!val())return;d.nome=d.nome.trim();let t=j;if(t){Object.assign(t,{nome:d.nome,segId:d.segId,mode:d.mode,rep:d.rep||0,steps:d.steps});if(on!==undefined)t.on=on}else{t={...d,on:!!on,dest:{},created:new Date().toISOString()};S.jr.unshift(t)}saveS();$('jrEd').hidden=true;renderM();if(t.on)runJr();toast(on?'Campagna attivata.':'Campagna salvata.')};
  if(j){const dl=h('button','btn lbl');dl.type='button';dl.className='btn lbl d';dl.style.cssText='flex:1 1 100%';dl.innerHTML='<span>'+ICONS.trash+'</span> Elimina campagna';dl.onclick=()=>askConfirm('Eliminare la campagna “'+j.nome+'” e il suo storico? I messaggi già inviati restano.','trash','Elimina',()=>{S.jr=S.jr.filter(z=>z!==j);saveS();$('jrEd').hidden=true;if($('jrD'))$('jrD').hidden=true;renderM()});ac.append(dl)}
  w.append(ac);saveBtn(ac,()=>JSON.stringify(d),()=>save());{const bk=$('jrEd').querySelector('.top button');if(bk)dirtyBack(bk,()=>JSON.stringify(d),()=>save(),()=>{$('jrEd').hidden=true})}}
 /* vista a flusso con contatori */
 let curItem=null,jrTimer=null;
 function viewOf(it){
  if(it.k==='jr'){const j=it.j,sg=segById(j.segId),st=jrStat(j);return{nome:j.nome,on:j.on,toggle:v=>setJr(j,v),edit:()=>{$('jrD').hidden=true;openJrEd(j)},err:j.lastErr,pend:st.reduce((a,x)=>a+x.att,0),openQ:()=>openJrQ(j),
   seg:{list:()=>sg?members(sg).map(c=>[c,null,'']):[],nome:sg?sg.nome:'Segmento eliminato',count:sg?members(sg).length:0,sub:Object.keys(j.dest).length+' entrati · '+(j.mode==='always'?'sempre attiva':'una volta')},
   steps:j.steps.map((s,i)=>({ch:s.ch,title:s.ch==='wa'?'WhatsApp':'Email',desc:s.ch==='email'?s.sub:s.txt.split('\n')[0],wait:s.wait,cond:s.cond,st:st[i]})),rep:j.rep}}
  if(it.k==='bday'){const B=S.auto.bday,k=S.camps.find(x=>x.id==='k_bday'),d=k?k.dest:[],now=new Date();return{nome:'Auguri di compleanno',on:B.on,toggle:v=>setAuto('bday',v),edit:()=>{$('jrD').hidden=true;openBday()},pend:d.filter(x=>x.st==='att').length,openQ:()=>k&&openQueue({...k,dest:d.filter(x=>x.st==='att'),nome:'Auguri di compleanno'}),
   seg:{list:()=>clients.filter(c=>isBday(c,now)).map(c=>[c,null,'']),nome:'Compleanno oggi',count:clients.filter(c=>isBday(c,now)).length,sub:'con consenso al marketing'},steps:[{ch:B.canale,title:B.canale==='wa'?'WhatsApp':'Email',desc:B.canale==='email'?B.sub:B.txt.split('\n')[0],wait:0,cond:'sempre',st:(()=>{const L=listOf(d);return{ok:L.ok.length,att:L.att.length,skip:0,rep:L.rep.length,L}})()}]}}
  if(it.k==='cons'){const C=S.auto.cons,k=S.camps.find(x=>x.id==='k_cons'),d=k?k.dest:[];return{nome:'Richiesta consensi',on:C.on,toggle:v=>setAuto('cons',v),
   seg:{list:()=>clients.filter(needCons).map(c=>[c,null,'']),nome:'Consenso marketing mai espresso',count:clients.filter(needCons).length,sub:'al massimo '+(C.max||10)+' al giorno'},steps:[{ch:'email',title:'Email',desc:'Informativa privacy con pulsanti per i consensi',wait:0,cond:'sempre',st:(()=>{const L=listOf(d);L.rep=L.ok.filter(x=>((x[0].privacy&&x[0].privacy.richieste)||[]).some(r=>r.stato==='completata'));return{ok:L.ok.length,att:0,skip:0,rep:L.rep.length,L}})()}]}}
  const cp=it.cp,d=cp.dest||[];return{nome:cp.nome,on:false,done:true,seg:{list:()=>d.map(x=>[clients.find(z=>z.id===x.id),x.d,'']).filter(x=>x[0]),nome:cp.segNome||'Segmento',count:d.length,sub:'campagna singola'},steps:[{ch:cp.canale,title:cp.canale==='wa'?'WhatsApp':'Email',desc:cp.sub||'',wait:0,cond:'sempre',st:(()=>{const L=listOf(d);return{ok:L.ok.length,att:L.att.length,skip:L.skip.length,rep:L.rep.length,L}})()}]}}
 function setJr(j,v){j.on=v;saveS();if(v)runJr();renderM();if($('jrD')&&!$('jrD').hidden)jrDraw()}
 function setAuto(k,v){if(k==='cons'&&v&&!S.azienda){toast('Imposta prima il nome azienda in Impostazioni: è il titolare indicato nell’informativa.');renderM();if($('jrD')&&!$('jrD').hidden)jrDraw();return}S.auto[k].on=v;if(v){if(k==='bday')bdayCamp();else consCamp()}saveS();if(v){k==='bday'?runBday():runCons()}renderM();if($('jrD')&&!$('jrD').hidden)jrDraw()}
 const swEl=(on,fn)=>{const l=h('label','sw'),i=h('input');i.type='checkbox';i.checked=on;i.setAttribute('aria-label','Attiva o spegni');i.onclick=e=>e.stopPropagation();i.onchange=()=>swSave(i,fn,'Attivata e salvata.','Spenta e salvata.');l.append(i,h('i'));l.onclick=e=>e.stopPropagation();return l};
 function node(ico,title,desc,badge,chips,onBadge){const n=h('div','fnode');if(badge!==null){const b=h(onBadge?'button':'i','fbadge',String(badge));if(onBadge){b.type='button';b.title=b.ariaLabel='Mostra i contatti';b.onclick=onBadge}n.append(b)}const t=h('div','fh');const ic=h('span','fic');ic.innerHTML=ICONS[ico]||'';t.append(ic,h('b','',title));n.append(t);if(desc)n.append(h('div','fd',desc));if(chips&&chips.length){const c=h('div','fchips');chips.forEach(([l,cl,fn])=>{const x=h(fn?'button':'span','fchip',l);if(fn){x.type='button';x.onclick=fn;x.style.border='0';x.style.cursor='pointer'}if(cl)x.style.background=cl;c.append(x)});n.append(c)}return n}
 function jrDraw(){const H=$('jrBody');if(!H||!curItem)return;const y=H.parentNode.parentNode.scrollTop;H.textContent='';const v=viewOf(curItem);
  const top=h('div','fstat');const dot=h('span','dot');dot.style.background=v.done?'#9aa3b5':v.on?'#4cc38a':'#c7cdd9';top.append(dot,h('b','',v.done?'Conclusa':v.on?'Attiva':'Spenta'));if(v.toggle)top.append(swEl(v.on,v.toggle));H.append(top);
  if(v.err)H.append(h('div','hint',v.err));
  const ac=h('div');ac.style.cssText='display:flex;gap:8px;margin:8px 0 14px;flex-wrap:wrap';
  if(v.edit){const e=h('button','btn lbl');e.type='button';e.style.cssText='flex:1;white-space:nowrap';e.innerHTML='<span>'+ICONS.edit+'</span> Modifica';e.onclick=v.edit;ac.append(e)}
  if(v.pend){const q=h('button','btn p lbl');q.type='button';q.style.cssText='flex:1;white-space:nowrap';q.innerHTML='<span>'+ICONS.WhatsApp+'</span> Da inviare ('+v.pend+')';q.onclick=v.openQ;ac.append(q)}if(ac.children.length)H.append(ac);
  H.append(node('users',v.seg.nome,v.seg.sub,v.seg.count,null,()=>showList(v.seg.nome,v.seg.list?v.seg.list():[])));
  v.steps.forEach((s,i)=>{const c=h('div','fcon');c.append(h('span','',i?((s.wait?'dopo '+s.wait+(s.wait===1?' giorno':' giorni'):'subito')+(s.cond==='norisp'?' · solo se non risponde':'')):(s.wait?'dopo '+s.wait+(s.wait===1?' giorno':' giorni'):'subito')));H.append(c);
   const x=s.st,ch=[],ttl='Passo '+(i+1)+' · '+s.title,LS=(x.L||{ok:[],att:[],skip:[],rep:[]});if(x.att)ch.push(['in attesa '+x.att,'#f6edb8',()=>showList(ttl+' · in attesa',LS.att)]);if(x.skip)ch.push(['saltati '+x.skip,'#e3e7ef',()=>showList(ttl+' · saltati',LS.skip)]);ch.push(['risposte '+x.rep,'#b5ebc0',()=>showList(ttl+' · hanno risposto',LS.rep)]);
   H.append(node(s.ch==='wa'?'WhatsApp':'Scrivi',ttl,s.desc,x.ok,ch,()=>showList(ttl+' · completato',LS.ok)))});
  if(v.rep){const c=h('div','fcon');c.append(h('span','','ricomincia dopo '+v.rep+(v.rep===1?' giorno':' giorni')));H.append(c)}
  H.append(h('div','hint','Il numero sul riquadro è quanti contatti hanno completato quel passo: toccalo (o tocca “risposte”, “in attesa”) per vedere chi sono. Si aggiorna da solo mentre la pagina è aperta.'));
  H.parentNode.parentNode.scrollTop=y}
 function openJrD(it){curItem=it;const w=shell('jrD',viewOf(it).nome);const b=h('div');b.id='jrBody';w.append(b);jrDraw();clearInterval(jrTimer);jrTimer=setInterval(()=>{const s=$('jrD');if(!s||s.hidden){clearInterval(jrTimer);return}try{runJr()}catch(e){}jrDraw()},8000);
  const x=$('jrD').querySelector('.top button');const cl=x.onclick;x.onclick=()=>{clearInterval(jrTimer);cl()}}
 /* panoramica */
 function ovCamps(H){const add=h('button','btn p lbl');add.type='button';add.innerHTML='<span>'+ICONS.plus+'</span> Nuova campagna';add.onclick=()=>openJrEd(null);H.append(add);
  const items=[...S.jr.map(j=>({k:'jr',j})),{k:'bday'},{k:'cons'}].map(it=>({it,v:viewOf(it)}));
  const sec=(t,L,col)=>{const hh=h('div','hh'),dt=h('span','dot');dt.style.background=col;dt.style.marginRight='8px';const sp=h('span','',t+' ('+L.length+')');sp.style.display='flex';sp.style.alignItems='center';sp.prepend(dt);hh.append(sp);H.append(hh);if(!L.length)H.append(h('div','hint','Nessuna.'));
   L.forEach(({it,v})=>{const r=h('div','row');r.style.cursor='pointer';r.tabIndex=0;const d2=h('span','dot');d2.style.background=col;const tx=h('div','tx'),sent=v.steps.reduce((a,s)=>a+s.st.ok,0),rep=v.steps.reduce((a,s)=>a+s.st.rep,0);
    tx.style.cssText='flex:1;min-width:0';tx.append(h('b','',v.nome),h('span','',v.seg.nome+' · '+v.steps.length+(v.steps.length===1?' passo':' passi')),h('em','',sent+' inviati · '+rep+' risposte'+(v.pend?' · '+v.pend+' da inviare':'')));
    r.append(d2,tx,swEl(v.on,v.toggle));r.onclick=()=>openJrD(it);r.onkeydown=e=>{if(e.key==='Enter')openJrD(it)};H.append(r)})};
  sec('Attive',items.filter(x=>x.v.on),'#4cc38a');sec('Spente',items.filter(x=>!x.v.on),'#c7cdd9');
  const old=S.camps.filter(c=>c.id!=='k_bday'&&c.id!=='k_cons');if(old.length){const hh=h('div','hh');hh.append(h('span','','Concluse ('+old.length+')'));H.append(hh);old.forEach(cp=>{const v=viewOf({k:'old',cp}),r=h('button','row'),tx=h('div','tx');tx.append(h('b','',cp.nome),h('span','',(cp.canale==='wa'?'WhatsApp':'Email')+' · '+fmtD(cp.data.slice(0,10))),h('em','',v.steps[0].st.ok+' inviati · '+v.steps[0].st.rep+' risposte'));r.append(tx);r.onclick=()=>openJrD({k:'old',cp});H.append(r)})}}
let asub='fun';try{const u=localStorage.getItem('crm-asub');if(u==='fun'||u==='eng')asub=u}catch(e){}
 function renderAn(){const sh=$('anSh');if(!sh||sh.hidden)return;let H=$('anBody');if(!H){H=h('div');H.id='anBody';sh.firstChild.append(H)}H.textContent='';const sg=h('div','seg');sg.style.marginBottom='10px';[['fun','Funnel'],['eng','Engagement']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.classList.toggle('on',asub===k);b.onclick=()=>{asub=k;try{localStorage.setItem('crm-asub',k)}catch(e){}renderAn()};sg.append(b)});H.append(sg);(asub==='fun'?paneFun:paneEng)(H)}
 window.openAn=()=>{const w=shell('anSh','Analytics'),sh=$('anSh');w.firstChild.hidden=true;$('tabs').style.display='none';$('title').innerHTML='Analytics '+'<span class="beta">Beta</span>';const q=document.querySelector('.bar');if(q)q.hidden=true;sh.style.zIndex=3;sh.style.top=document.querySelector('.stk').getBoundingClientRect().bottom+'px';renderAn()};
 window.renderM=function(){const H=$('mktBody');if(!H)return;try{applyStops()}catch(e){}H.textContent='';const sg=h('div','seg');sg.id='mSeg';sg.style.marginBottom='10px';[['seg','Segmenti'],['cam','Campagne']].forEach(([k,l])=>{const b=h('button','',l);b.style.cssText='font-size:13px;padding:0 4px;white-space:nowrap';b.type='button';b.classList.toggle('on',sub===k);b.onclick=()=>{sub=k;try{localStorage.setItem('crm-msub',k)}catch(e){}renderM()};sg.append(b)});H.append(sg);
  ({seg:paneSeg,fun:paneFun,eng:paneEng,cam:paneCamp})[sub](H)};
 const _st=setTab;setTab=function(v){_st(v);{const a=$('anSh');if(a)a.hidden=true}$('tabs').style.display=['home','clienti','lead','opp'].includes(v)?'':'none';$('mktView').hidden=v!=='mkt';if(v==='mkt'){document.querySelector('.bar').hidden=true;$('title').innerHTML='Marketing '+'<span class="beta">Beta</span>';renderM()}};
}
/* ===== Transazioni del cliente: acquisti, prodotti e KPI ===== */
{const DAY=864e5,sum=(a,f)=>a.reduce((x,o)=>x+(+f(o)||0),0),dOf=o=>o.chiusa||o.data||o.creata||'',tt=o=>tsOf(dOf(o));
 const kpi=(l,v,sub,info)=>{const b=h('div','stat');b.append(h('span','',l),h('b','',v));if(sub)b.append(h('small','',sub));if(info)infoBtn(b,info);return b};
 window.trData=c=>{const T=oppsOf(c.id).filter(o=>o.fase==='vinta').sort((a,b)=>tt(a)-tt(b));
  const P={};T.forEach(o=>(o.prodotti||[]).forEach(r=>{const k=r.prodId||('n:'+(r.nome||'').toLowerCase());const x=P[k]=P[k]||{k,prodId:r.prodId,nome:r.nome,unita:r.unita,qta:0,val:0,ord:new Map()};x.qta+=+r.qta||0;x.val+=riga(r);const t=tt(o);x.ord.set(o.id,t)}));
  const prodotti=Object.values(P).sort((a,b)=>b.val-a.val);
  const tot=sum(T,o=>sum(o.prodotti||[],riga)),n=T.length,ts=T.map(tt).filter(x=>!isNaN(x)),gaps=[];for(let i=1;i<ts.length;i++)gaps.push((ts[i]-ts[i-1])/DAY);
  const avgGap=gaps.length?gaps.reduce((a,x)=>a+x,0)/gaps.length:null,last=ts.length?ts[ts.length-1]:null,first=ts.length?ts[0]:null;
  const m=T.map(mg).filter(x=>x&&x.ok!==false&&x.mar!==undefined);const mar=sum(T,o=>mg(o).mar||0);
  const rip=prodotti.filter(p=>p.ord.size>1).length;
  return{T,prodotti,tot,n,avgGap,last,first,mar,rip,pezzi:sum(prodotti,p=>p.qta)}};
 window.paintTr=function(){const c=editing,w=$('trBody');if(!c||!w)return;w.textContent='';const D=trData(c);
  if(!D.n){w.append(h('div','empty','Nessun acquisto ancora. Qui compaiono le opportunità vinte con i prodotti acquistati.'));return}
  const now=Date.now(),dsince=D.last?Math.floor((now-D.last)/DAY):null,K=h('div','sum');
  K.append(kpi('Totale acquistato',eur(D.tot),D.pezzi+' pezzi · IVA esclusa','Somma dei prodotti delle opportunità vinte, al netto degli sconti e senza IVA.'));
  K.append(kpi('Ordini',String(D.n),'media '+eur(D.tot/D.n)+' ciascuno','Numero di opportunità vinte e valore medio per ordine.'));
  K.append(kpi('Riacquisto medio',D.avgGap===null?'—':Math.round(D.avgGap)+' gg',D.avgGap===null?'serve almeno un secondo ordine':'tra un ordine e il successivo','Giorni medi che passano tra un acquisto e il successivo.'));
  if(D.avgGap!==null&&D.last){const nx=D.last+D.avgGap*DAY,dd=Math.round((nx-now)/DAY);K.append(kpi('Prossimo acquisto',dd>=0?'tra '+dd+' gg':'in ritardo di '+(-dd)+' gg',fmtD(ymd(new Date(nx))),'Stima: ultimo acquisto più l’intervallo medio di riacquisto.'))}
  else K.append(kpi('Ultimo acquisto',dsince===null?'—':dsince===0?'oggi':dsince+' gg fa',D.last?fmtD(ymd(new Date(D.last))):''));
  const pc=D.tot>0?Math.round(D.mar/D.tot*100):0;K.append(kpi('Margine',eur(D.mar),D.tot>0?pc+'% del totale':'','Calcolato solo sui prodotti con costo indicato.'));
  K.append(kpi('Prodotti riacquistati',D.rip+' su '+D.prodotti.length,D.prodotti.length?Math.round(D.rip/D.prodotti.length*100)+'% dei prodotti':'','Quanti prodotti diversi sono stati acquistati in più di un ordine.'));
  w.append(K);
  const meta=h('div','hint');meta.textContent='Cliente dal '+fmtD(ymd(new Date(D.first)))+(dsince!==null?' · ultimo acquisto '+(dsince===0?'oggi':dsince+' giorni fa'):'');w.append(meta);
  const h1=h('div','hh');h1.append(h('span','','Prodotti acquistati'));w.append(h1);
  D.prodotti.forEach(p=>{const pp=prods.find(z=>z.id===p.prodId),r=h('div','qrow');r.style.cursor='default';const t=h('div','tx'),ord=[...p.ord.values()].sort((a,b)=>a-b);let sub=p.qta+(p.unita?' '+p.unita:'')+' · '+p.ord.size+(p.ord.size===1?' ordine':' ordini');
   if(ord.length>1){const g=(ord[ord.length-1]-ord[0])/DAY/(ord.length-1);sub+=' · riacquisto ogni '+Math.round(g)+' gg'}
   t.append(h('b','',p.nome),h('span','',sub),h('span','','Ultimo: '+fmtD(ymd(new Date(ord[ord.length-1])))));const v=h('div','');v.style.cssText='font-weight:700;white-space:nowrap;text-align:right';v.textContent=eur(p.val);r.append(pthumb(pp||{nome:p.nome},true),t,v);w.append(r)});
  const h2=h('div','hh');h2.append(h('span','','Transazioni'));w.append(h2);
  D.T.slice().reverse().forEach(o=>{const r=h('button','qrow');r.type='button';const t=h('div','tx'),v=sum(o.prodotti||[],riga);t.append(h('b','',o.titolo||'Opportunità'),h('span','',fmtD(dOf(o))+' · '+(o.prodotti||[]).length+((o.prodotti||[]).length===1?' prodotto':' prodotti')));const e=h('div','');e.style.cssText='font-weight:700;white-space:nowrap';e.textContent=eur(v);r.append(t,e);r.onclick=()=>openOpp(o);w.append(r)})};
}
/* ===== sblocco dello scorrimento: dopo aver chiuso schermate/finestre il browser (iOS) può lasciare ferma la schermata sotto ===== */
{let t=0;const unstick=()=>{try{document.documentElement.style.overflow='';document.body.style.overflow='';document.querySelectorAll('.sheet:not([hidden])').forEach(el=>{const y=el.scrollTop;el.style.overflowY='hidden';void el.offsetHeight;el.style.overflowY='';el.scrollTop=y});const se=document.scrollingElement;if(se){const y=se.scrollTop;se.scrollTop=y+1;se.scrollTop=y}}catch(e){}};
 new MutationObserver(m=>{if(m.some(r=>r.attributeName==='hidden'&&r.target.matches&&r.target.matches('.sheet,.modal,#amBack,.amenu'))){clearTimeout(t);t=setTimeout(()=>requestAnimationFrame(unstick),60)}}).observe(document.body,{attributes:true,attributeFilter:['hidden'],subtree:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)unstick()});window.addEventListener('pageshow',unstick)}

/* ===== telefono del lead: stesso selettore prefisso del cliente ===== */
{const sel=$('l_paese'),btn=$('l_paeseBtn');[...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).forEach(c=>{const o=document.createElement('option');o.value=c[0];o.textContent=c[1];sel.append(o)});
 const paint=()=>{const c=COUNTRIES.find(x=>x[0]===sel.value)||COUNTRIES[0];btn.textContent='';btn.append(flagEl(c[0]));const n=document.createElement('span');n.className='nm';n.textContent=c[1]+' '+c[2];const ch=document.createElement('span');ch.className='ch';ch.textContent='▾';btn.append(n,ch)};
 window.paintLPaese=paint;const q0=$('pa_q').oninput,x0=$('pa_x').onclick,b0=$('paeseBtn').onclick;
 const list=()=>{const q=nrm($('pa_q').value||'').replace(/^\+/,''),w=$('pa_list');w.textContent='';[...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).filter(c=>!q||nrm(c[1]).includes(q)||c[2].replace('+','').startsWith(q)).forEach(c=>{const b=document.createElement('button');b.type='button';b.className='pa'+(c[0]===sel.value?' on':'');const n=document.createElement('span');n.className='nm';n.textContent=c[1];const x=document.createElement('span');x.className='px';x.textContent=c[2];b.append(flagEl(c[0]),n,x);b.onclick=()=>{sel.value=c[0];paint();$('mPaese').hidden=true};w.append(b)})};
 btn.onclick=()=>{$('pa_q').value='';$('pa_q').oninput=list;list();$('mPaese').hidden=false};
 $('paeseBtn').onclick=()=>{$('pa_q').oninput=q0;b0()};paint()}
/* ===== CPQ: listini, prezzi per nazione, scaglioni e approvazione sconti ===== */
{S.cpq=S.cpq||{listini:[],maxSconto:0};
 const C=()=>(S.cpq=S.cpq&&Array.isArray(S.cpq.listini)?S.cpq:{listini:[],maxSconto:0}),num=v=>{const n=parseFloat(String(v).replace(',','.'));return isNaN(n)?0:n};
 window.cCountry=c=>{if(!c)return'IT';const last=nrm((c.indirizzo||'').split(',').pop().replace(/\(.*?\)/g,'')).trim(),m=COUNTRIES.find(x=>nrm(x[1])===last);return m?m[0]:(c.paese||'IT')};
 /* aggiornamento prezzi sulle opportunità aperte quando cambiano catalogo o listini */
 let PSNAP=null,LSNAP='';const lsig=()=>JSON.stringify(((S.cpq&&S.cpq.listini)||[]).map(l=>[l.id,l.attivo!==false,l.mod,l.paesi,l.scaglioni,l.prezzi,l.nome]));
 const snapP=()=>{PSNAP={};prods.forEach(p=>PSNAP[p.id]={prezzo:+p.prezzo||0,costo:p.costo});LSNAP=lsig()};
 function repriceList(list,cli,ch,all,old){let n=0;(list||[]).forEach(l=>{const pp=l.prodId&&prods.find(z=>z.id===l.prodId);if(!pp)return;
   const legacy=l.auto===undefined&&old&&ch.has(pp.id)&&old[pp.id]&&+l.prezzo===old[pp.id].prezzo;
   if(!(l.auto===true&&(all||ch.has(pp.id)))&&!legacy)return;
   const r=prezzoCPQ(pp,cli,+l.qta||1);let m=0;
   if(+l.prezzo!==r.prezzo){l.prezzo=r.prezzo;m=1}if((+l.sconto||0)!==r.sconto){l.sconto=r.sconto;m=1}
   if(known(pp)&&l.costo!==pp.costo&&(l.auto===true||legacy)){l.costo=pp.costo;m=1}
   l.auto=true;if(m)n++});return n}
 function afterPriceChange(){if(!PSNAP){snapP();return}
   const ch=new Set();prods.forEach(p=>{const o=PSNAP[p.id];if(o&&(o.prezzo!==(+p.prezzo||0)||(known(p)&&o.costo!==p.costo)))ch.add(p.id)});
   const all=lsig()!==LSNAP,old=PSNAP;snapP();if(!ch.size&&!all)return;
   let lines=0,nop=0,qn=0;opps.forEach(o=>{if(o.fase==='vinta'||o.fase==='persa')return;const cli=clients.find(x=>x.id===o.clienteId)||null,k=repriceList(o.prodotti,cli,ch,all,old);(o.preventivi||[]).forEach(q=>{if(q.stato==='bozza'&&repriceList(q.righe,cli,ch,all,old))qn++});if(k){lines+=k;nop++}});
   if(typeof oEd!=='undefined'&&oD&&!$('oSheet').hidden&&oEd&&oEd.fase!=='vinta'&&oEd.fase!=='persa'){const k=repriceList(oD.prodotti,cOf(),ch,all,old);if(k){try{paintProd()}catch(e){}}}
   if(lines||qn){try{persistO()}catch(e){}try{renderO();renderH()}catch(e){}if(lines)toast(lines+(lines===1?' prezzo aggiornato':' prezzi aggiornati')+' in '+nop+(nop===1?' opportunità aperta.':' opportunità aperte.'))}}
 {const _pp=persistP;persistP=function(){const r=_pp.apply(this,arguments);try{afterPriceChange()}catch(e){}return r}
  const _ss=saveS;saveS=function(){const r=_ss.apply(this,arguments);try{afterPriceChange()}catch(e){}return r}
  snapP()}
 window.cOf=()=>clients.find(x=>x.id===(oEd?oEd.clienteId:$('o_cliente').value))||null;
 window.listinoFor=c=>{const L=C().listini.filter(l=>l.attivo!==false),k=cCountry(c);return L.find(l=>(l.paesi||[]).includes(k))||L.find(l=>!(l.paesi||[]).length)||null};
 window.prezzoCPQ=(p,c,q)=>{const L=listinoFor(c);let pr=+p.prezzo||0,sc=0;if(L){const o=L.prezzi&&L.prezzi[p.id];pr=(o!==undefined&&o!=='')?+o:pr*(1+(+L.mod||0)/100);const t=(L.scaglioni||[]).filter(x=>q>=+x.da).sort((a,b)=>b.da-a.da)[0];if(t)sc=+t.pct||0}return{prezzo:Math.round(pr*100)/100,sconto:sc,listino:L?L.nome:''}};
 window.sconMax=()=>+C().maxSconto||0;
 window.oppOver=o=>{const m=sconMax();if(!m)return 0;const x=Math.max(0,...(o.prodotti||[]).map(p=>+p.sconto||0));return x>m?x:0};
 window.paintAppr=()=>{let a=$('o_appr');if(!a){a=h('div');a.id='o_appr';$('o_tot').after(a)}a.textContent='';const L=listinoFor(cOf()),ov=oppOver(oD);
  if(L&&oD.prodotti.length)a.append(h('div','hint','Listino applicato: '+L.nome));
  if(ov){const ok=(oD.apprMax||0)>=ov;a.append(h('div','hint'+(ok?'':' warn'),ok?'Sconto fino al '+ov+'% approvato.':'Sconto del '+ov+'% oltre la soglia ('+sconMax()+'%): serve l’approvazione.'));
   if(!ok){const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS.check+'Approva sconto';b.onclick=()=>askConfirm('Approvare uno sconto fino al '+ov+'% su questa opportunità?','check','Approva',()=>{oD.apprMax=ov;recalc()});a.append(b)}}};
 $('o_cliente').addEventListener('change',()=>{let ch=0;oD.prodotti.forEach(p=>{const pp=prods.find(z=>z.id===p.prodId);if(pp&&p.auto){const r=prezzoCPQ(pp,cOf(),+p.qta||1);p.prezzo=r.prezzo;p.sconto=r.sconto;ch=1}});if(ch)paintProd()});
 const sh=(id,title,z)=>{let s=$(id);if(!s){s=h('div','sheet');s.id=id;document.body.append(s)}s.style.zIndex=z;s.hidden=false;s.textContent='';const w=h('div'),top=h('div','top'),x=h('button','btn ico pk');x.type='button';x.title=x.ariaLabel='Chiudi';x.innerHTML=ICONS.back;x.onclick=()=>{s.hidden=true};top.append(x,h('h2','',title));w.append(top);s.append(w);s.scrollTop=0;return w};
 const fld=(lb,el,hint)=>{const f=h('div','f'),l=h('label','',lb);f.append(l,el);if(hint)f.append(h('div','hint',hint));return f};
 const inp=(v,mode)=>{const i=h('input');i.inputMode=mode||'decimal';i.autocomplete='off';i.value=v;return i};
 window.dirtyBack=(back,sigFn,saveFn,closeFn)=>{const s0=sigFn();back.onclick=()=>{if(sigFn()===s0){closeFn();return}$('mDirty').hidden=false;$('dC').onclick=()=>{$('mDirty').hidden=true};$('dN').onclick=()=>{$('mDirty').hidden=true;closeFn()};$('dY').onclick=()=>{$('mDirty').hidden=true;saveFn()}}};
 qNewClose();
 window.pSec='cat';
 window.paintPSec=()=>{const k=window.pSec,l=k==='lst';$('pCat').hidden=k!=='cat';$('pLst').hidden=!l;$('pMag').hidden=k!=='mag';document.querySelectorAll('#pSeg button').forEach(b=>b.classList.toggle('on',b.dataset.s===k));if(tab==='prod'){const t=l?'Nuovo listino':'Nuovo prodotto';$('addBtn').setAttribute('aria-label',t);$('addBtn').title=t;$('addLbl').textContent=t}if(l)renderCpq();if(k==='mag')renderMag()};
 $('pSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;window.pSec=b.dataset.s;paintPSec()};
 {const _s2=setTab;setTab=function(v){_s2(v);if(v==='prod')paintPSec()}}

 let magF='';window.magFilter=k=>{magF=k};
 {const qf=()=>$('mv_qta').closest('.f');const oo=openMov;openMov=function(t){mvT=t;if(t==='attiva'||t==='scorta'){const a=t==='attiva';$('mvTitle').textContent=(a?'Gestisci a magazzino':'Scorta minima')+' – '+pEd.nome;qf().hidden=!a;$('mv_lbl').textContent='Giacenza iniziale ('+pEd.unita+')';$('mv_qta').value='';$('mv_sc').value=pEd.scorta!=null&&pEd.scorta!==''?pEd.scorta:'';$('mv_scW').hidden=false;$('mv_nota').closest('.f').hidden=true;$('mv_off').hidden=a;setErr('mv_qta','');setErr('mv_sc','');$('mMov').hidden=false;return}qf().hidden=false;$('mv_scW').hidden=true;$('mv_nota').closest('.f').hidden=false;$('mv_off').hidden=true;oo(t)};
  const ok0=$('mv_ok').onclick;$('mv_ok').onclick=()=>{if(mvT!=='attiva'&&mvT!=='scorta'){ok0();return}const sv=num($('mv_sc').value);if($('mv_sc').value.trim()!==''&&!(sv>=0)){setErr('mv_sc','Inserisci un numero (0 o più) oppure lascia vuoto.');return}setErr('mv_sc','');
   if(mvT==='attiva'){const g=num($('mv_qta').value)||0;if(g<0){setErr('mv_qta','Inserisci 0 o più.');return}pEd.mag=true;pEd.scorta=sv;if(g>0)movs.push(stampNew({id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),prodId:pEd.id,data:new Date().toISOString(),tipo:'carico',qta:g,nota:'Giacenza iniziale'}));persistM()}else pEd.scorta=sv;
   persistP();$('mMov').hidden=true;renderMag();renderP();toast(mvT==='attiva'?'Prodotto aggiunto al magazzino.':'Scorta minima salvata.')};
  $('mv_off').onclick=()=>{const p=pEd;askConfirm('Smettere di gestire “'+p.nome+'” a magazzino? I movimenti già registrati restano.','trash','Non gestire',()=>{p.mag=false;persistP();$('mMov').hidden=true;renderMag();renderP()})}}
 window.renderMag=()=>{const w=$('pMag');w.textContent='';window.magV=window.magV||'g';
  {const sg=h('div','seg');[['g','Giacenze','box'],['m','Movimenti','layers']].forEach(([k,l,ic])=>{const b=h('button',window.magV===k?'on':'');b.type='button';const si=h('span');si.innerHTML=ICONS[ic];b.append(si,h('span','lb',l));b.title=b.ariaLabel=l;b.onclick=()=>{window.magV=k;renderMag()};sg.append(b)});sg.style.marginTop='0';w.append(sg);}
  if(window.magV==='m')return renderMov(w);
  const M=prods.filter(p=>p.mag),val=M.reduce((t,p)=>t+Math.max(0,giac(p.id))*(known(p)?+p.costo:0),0),ex=M.filter(p=>disp(p.id)<=0),lo=M.filter(p=>lowOf(p)&&disp(p.id)>0);
  const sm=h('div','sum');[['Valore magazzino (al costo)',eur(val)],['Prodotti gestiti',String(M.length)],['Sotto scorta',String(lo.length)],['Esauriti',String(ex.length)]].forEach(([k,v])=>{const d=h('div','stat');d.append(h('span','',k),h('b','',v));sm.append(d)});w.append(sm);
  const ch=h('div','chips');ch.style.marginBottom='8px';[['','Tutti'],['sc','Sotto scorta'],['es','Esauriti']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.style.background='var(--lilac)';b.classList.toggle('on',magF===k);b.onclick=()=>{magF=k;renderMag()};ch.append(b)});w.append(ch);
  if(!M.length){w.append(h('div','empty','Nessun prodotto con magazzino attivo. Attivalo nella scheda del prodotto, sezione Magazzino.'));return}
  const L=M.filter(p=>magF==='es'?disp(p.id)<=0:magF==='sc'?lowOf(p):true).sort((a,b)=>(lowOf(b)?1:0)-(lowOf(a)?1:0)||a.nome.localeCompare(b.nome,'it'));
  if(!L.length)w.append(h('div','empty','Nessun prodotto in questa condizione.'));
  L.forEach(p=>{const g=giac(p.id),i=impeg(p.id),d=g-i,low=lowOf(p),c=h('div','oc pr'),bd=h('div','pbd');goOn(c,()=>openProd(p));
   const t=h('div','prt');t.append(h('b','',p.nome),h('strong','',g+' '+p.unita));bd.append(t,h('span','',[p.categoria,p.codice].filter(Boolean).join(' · ')||' '),h('span','prs'+(low?' warn':''),(d<=0?'Esaurito':low?'Sotto scorta':'Disponibili')+' · '+d+' '+p.unita+(i?' (impegnati '+i+')':'')));
   const ac=h('div');ac.style.cssText='display:flex;gap:8px;margin-top:6px';[['carico','carico','Carico'],['scarico','scarico','Scarico'],['rettifica','edit','Inventario'],['scorta','alert','Scorta minima']].forEach(([tp,ic,lb])=>{const b=h('button','btn ico');b.type='button';b.style.cssText='width:44px;height:36px';b.innerHTML=ICONS[ic];b.title=lb;b.setAttribute('aria-label',lb+' '+p.nome);b.onclick=e=>{e.stopPropagation();pEd=p;openMov(tp)};ac.append(b)});bd.append(ac);
   c.append(pthumb(p),bd);w.append(c)});
  {const NM=prods.filter(p=>!p.mag&&p.attivo).sort((a,b)=>a.nome.localeCompare(b.nome,'it'));if(NM.length){const hd0=h('div','hh');hd0.append(h('span','','Non ancora a magazzino ('+NM.length+')'));w.append(hd0);
   NM.forEach(p=>{const r=h('div','qrow');r.style.cursor='default';const t=h('div','tx');t.append(h('b','',p.nome),h('span','',[p.categoria,p.codice].filter(Boolean).join(' · ')||p.unita));const b=h('button','btn ico');b.type='button';b.style.cssText='width:44px;height:40px;flex:none';b.innerHTML=ICONS.plus2;b.title='Gestisci a magazzino';b.setAttribute('aria-label','Gestisci a magazzino '+p.nome);b.onclick=()=>{pEd=p;openMov('attiva')};r.append(pthumb(p,true),t,b);w.append(r)})}}
};
 let magMT='',magMP='',magMN=40;
 function renderMov(w){const all=movs.filter(m=>prods.some(p=>p.id===m.prodId)).sort((a,b)=>b.data.localeCompare(a.data));
  const inn=all.filter(m=>m.tipo==='carico').reduce((t,m)=>t+1,0),out=all.filter(m=>m.tipo==='scarico').length,inv=all.filter(m=>m.tipo==='rettifica').length;
  const sm=h('div','sum');[['Movimenti',String(all.length)],['Carichi',String(inn)],['Scarichi',String(out)],['Inventari',String(inv)]].forEach(([k,v])=>{const d=h('div','stat');d.append(h('span','',k),h('b','',v));sm.append(d)});w.append(sm);
  const ch=h('div','chips');ch.style.marginBottom='8px';[['','Tutti'],['carico','Carichi'],['scarico','Scarichi'],['rettifica','Inventari']].forEach(([k,l])=>{const b=h('button','',l);b.type='button';b.style.background='var(--lilac)';b.classList.toggle('on',magMT===k);b.onclick=()=>{magMT=k;magMN=40;renderMag()};ch.append(b)});w.append(ch);
  const ps=prods.filter(p=>movs.some(m=>m.prodId===p.id)).sort((a,b)=>a.nome.localeCompare(b.nome,'it'));
  const sel=h('select');sel.setAttribute('aria-label','Filtra per prodotto');sel.style.cssText='width:100%;min-height:44px;margin:0 0 10px;font:inherit;border:1.5px solid var(--out);border-radius:14px;padding:0 12px;background:var(--surface);color:var(--ink)';
  const o0=h('option','','Tutti i prodotti');o0.value='';sel.append(o0);ps.forEach(p=>{const o=h('option','',p.nome);o.value=p.id;sel.append(o)});sel.value=magMP;sel.onchange=()=>{magMP=sel.value;magMN=40;renderMag()};w.append(sel);
  const L=all.filter(m=>(!magMT||m.tipo===magMT)&&(!magMP||m.prodId===magMP));
  if(!L.length){w.append(h('div','empty','Nessun movimento'+(magMT||magMP?' con questi filtri':' registrato')+'.'));return}
  let day='';const lk=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');const dn=iso=>{const D=new Date(iso),d=lk(D),t=lk(new Date()),y=lk(new Date(Date.now()-864e5));return d===t?'Oggi':d===y?'Ieri':D.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})};
  L.slice(0,magMN).forEach(m=>{const p=prods.find(x=>x.id===m.prodId),dd=dn(m.data);if(dd!==day){day=dd;const g=h('div','hh');g.append(h('span','',dd));w.append(g)}
   const r=h('div','qrow');r.style.cursor='default';const ic=h('span');ic.innerHTML=ICONS[m.tipo==='carico'?'carico':m.tipo==='scarico'?'scarico':'edit'];ic.style.cssText='width:36px;height:36px;flex:none;border-radius:12px;background:var(--lilac);display:grid;place-items:center;padding:8px;box-sizing:border-box';
   const t=h('div','tx');t.append(h('b','',p.nome),h('span','',(stockLbl[m.tipo]||m.tipo)+' · '+new Date(m.data).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+(m.nota?' · '+m.nota:'')));
   const q=h('b','',(m.qta>0?'+':'')+m.qta+' '+p.unita);q.style.cssText='flex:none;color:'+(m.qta<0?'var(--danger,#c0392b)':m.qta>0?'var(--ok,#1f8a5b)':'inherit');r.append(ic,t,q);w.append(r)});
  if(L.length>magMN){const b=h('button','btn lbl','Mostra altri');b.type='button';b.style.margin='10px 0';b.onclick=()=>{magMN+=40;renderMag()};w.append(b)}}
 {const _ok=$('mv_ok').onclick;$('mv_ok').onclick=()=>{_ok();if(window.pSec==='mag'&&tab==='prod')renderMag()}}
 window.openCpq=()=>{window.pSec='lst';if(tab!=='prod')setTab('prod');else paintPSec()};
 window.lstSw=(on,fn,save)=>{const l=h('label','sw'),i=h('input');i.type='checkbox';i.checked=on;i.setAttribute('aria-label','Listino attivo');i.onclick=e=>e.stopPropagation();i.onchange=()=>save?swSave(i,fn,'Listino attivato e salvato.','Listino disattivato e salvato.'):fn(i.checked);l.append(i,h('i'));l.onclick=e=>e.stopPropagation();l.style.marginRight='8px';return l};
 window.renderCpq=()=>{const w=$('pLst');w.textContent='';
  const m=inp(C().maxSconto||'');m.onchange=()=>{C().maxSconto=Math.max(0,Math.min(100,num(m.value)));m.value=C().maxSconto||'';saveS()};
  {const c=h('div','cd');c.append(h('h3','','Approvazione sconti'),fld('Sconto massimo senza approvazione (%)',m,'Oltre questa soglia serve l’approvazione per chiudere come vinta. 0 = nessun controllo.'));w.append(c)}
  const hd=h('div','hh');hd.append(h('span','','Listini'));w.append(hd);
  const sr=h('div','srow');sr.style.margin='0 0 10px';const si=h('input','search');si.type='search';si.placeholder='Cerca listino o paese…';si.setAttribute('aria-label','Cerca listino');si.value=window.lstQ||'';
  const ab=h('button','btn p addIc');ab.type='button';ab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';ab.title='Nuovo listino';ab.setAttribute('aria-label','Nuovo listino');ab.onclick=()=>openLst(null);sr.append(si,ab);w.append(sr);
  const lw=h('div');w.append(lw);
  const paintL=()=>{lw.textContent='';const q=nrm((si.value||'').trim());
   if(!C().listini.length){lw.append(h('div','hint','Nessun listino: si usa il prezzo base del catalogo. Crea un listino per nazione, per fascia di clienti o con sconti a scaglioni.'));return}
   const LL=C().listini.filter(l=>!q||nrm(l.nome+' '+(l.paesi||[]).map(k=>ctName(k)).join(' ')).includes(q));
   if(!LL.length){lw.append(h('div','hint','Nessun listino trovato.'));return}
   LL.forEach(l=>{const r=h('div','qrow');r.style.cursor='pointer';r.tabIndex=0;r.setAttribute('role','button');const on=l.attivo!==false;if(!on)r.style.opacity='.6';const t=h('div','tx'),ps=(l.paesi||[]).map(k=>ctName(k)).join(', ')||'Tutti gli altri clienti',bits=[];
    if(+l.mod)bits.push((l.mod>0?'+':'')+l.mod+'% sul prezzo');if((l.scaglioni||[]).length)bits.push(l.scaglioni.length+(l.scaglioni.length===1?' scaglione':' scaglioni'));const np=Object.keys(l.prezzi||{}).length;if(np)bits.push(np+' prezzi dedicati');
    t.append(h('b','',l.nome),h('span','',ps),h('span','',(on?'':'Disattivo · ')+(bits.join(' · ')||'Prezzo base')));
    const sw=lstSw(on,v=>{l.attivo=v;saveS();paintL()},true);const ic=h('span');ic.innerHTML=ICONS.chevR;ic.style.cssText='width:20px;flex:none';r.append(t,sw,ic);r.onclick=()=>openLst(l);r.onkeydown=e=>{if(e.key==='Enter')openLst(l)};lw.append(r)})};
  si.oninput=()=>{window.lstQ=si.value;paintL()};paintL();
  };
window.openLst=l=>{const L=l?JSON.parse(JSON.stringify(l)):{id:'l'+Date.now().toString(36),nome:'',paesi:[],mod:0,scaglioni:[],prezzi:{}};L.paesi=L.paesi||[];L.scaglioni=L.scaglioni||[];L.prezzi=L.prezzi||{};
  const w=sh('cpqEd',l?l.nome:'Nuovo listino',5);const card=(t,sub)=>{const c=h('div','cd');if(t)c.append(h('h3','',t));if(sub)c.append(h('div','hint',sub));w.append(c);return c};
  const c1=card('Listino'),nome=inp(L.nome,'text');nome.placeholder='Es. Clienti Francia';c1.append(fld('Nome',nome));
  {const r=h('div','qrow');r.style.cssText+='cursor:default;box-shadow:none;margin:0 0 10px';const t=h('div','tx');t.append(h('b','','Listino attivo'),h('span','','Se spento non viene applicato a nessun cliente.'));r.append(t,lstSw(L.attivo!==false,v=>{L.attivo=v}));c1.append(r)}
  const pw=h('div'),paint=()=>{pw.textContent='';if(L.paesi.length){const ch=h('div','chips');L.paesi.forEach(k=>{const b=h('button','on',ctName(k)+' ×');b.type='button';b.onclick=()=>{L.paesi=L.paesi.filter(x=>x!==k);paint()};ch.append(b)});pw.append(ch)}
   const s=h('select');const o0=h('option','',L.paesi.length?'Aggiungi un altro paese…':'Tutti i clienti (scegli per limitare a un paese)');o0.value='';s.append(o0);[...COUNTRIES].sort((a,b)=>a[1].localeCompare(b[1],'it')).filter(c=>!L.paesi.includes(c[0])).forEach(c=>{const o=h('option','',c[1]);o.value=c[0];s.append(o)});s.onchange=()=>{if(s.value){L.paesi.push(s.value);paint()}};pw.append(s)};paint();
  c1.append(fld('A chi si applica',pw));
  const c2=card('Prezzo'),mod=inp(L.mod||'');mod.placeholder='0';c2.append(fld('Variazione sul prezzo di catalogo (%)',mod,'+10 aumenta del 10%, -5 riduce del 5%.'));
  const c3=card('Sconti per quantità'),sw=h('div');c3.append(sw);
  const ps=()=>{sw.textContent='';if(!L.scaglioni.length)sw.append(h('div','hint','Nessuno sconto per quantità.'));L.scaglioni.forEach((t,i)=>{const row=h('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr 44px;gap:8px;align-items:end;margin-bottom:8px';const a=fld('Da quantità',inp(t.da)),b=fld('Sconto %',inp(t.pct));a.style.margin=b.style.margin='0';a.querySelector('input').oninput=e=>t.da=num(e.target.value);b.querySelector('input').oninput=e=>t.pct=num(e.target.value);const x=h('button','btn ico');x.type='button';x.style.cssText='width:44px;height:44px';x.innerHTML=ICONS.x;x.title='Rimuovi scaglione';x.setAttribute('aria-label','Rimuovi scaglione');x.onclick=()=>{L.scaglioni.splice(i,1);ps()};row.append(a,b,x);sw.append(row)})};ps();
  const as=h('button','btn lbl');as.type='button';as.style.cssText='margin:0 0 10px;height:40px';as.innerHTML=ICONS.plus2+'Aggiungi scaglione';as.onclick=()=>{L.scaglioni.push({da:10,pct:5});ps()};c3.append(as);
  const act=prods.filter(p=>p.attivo).sort((a,b)=>a.nome.localeCompare(b.nome,'it')),pi={};
  const c4=card('Prezzi per prodotto');const tg=h('button','btn lbl');tg.type='button';tg.style.cssText='margin:0 0 10px;height:44px';const pl=h('div');pl.hidden=true;
  const cnt=()=>Object.keys(L.prezzi).length;const lbl=()=>{tg.innerHTML=ICONS.tag+(pl.hidden?'Personalizza i prezzi'+(cnt()?' ('+cnt()+')':''):'Nascondi elenco')};lbl();
  act.forEach(p=>{const r=h('div','qrow');r.style.cssText+='cursor:default;box-shadow:none;margin:0 0 8px';const t=h('div','tx');t.append(h('b','',p.nome),h('span','','Catalogo '+eur2(p.prezzo)));const i=inp(L.prezzi[p.id]!==undefined?L.prezzi[p.id]:'');i.placeholder='€';i.style.cssText='width:92px;flex:none;height:44px';i.setAttribute('aria-label','Prezzo dedicato '+p.nome);i.oninput=()=>{const v=i.value.trim();if(v==='')delete L.prezzi[p.id];else L.prezzi[p.id]=num(v)};pi[p.id]=i;r.append(pthumb(p,true),t,i);pl.append(r)});
  tg.onclick=()=>{pl.hidden=!pl.hidden;lbl()};c4.append(h('div','hint','Opzionale: un prezzo fisso per alcuni prodotti, al posto di quello di catalogo.'),tg,pl);
  if(l){const d=h('button','btn lbl d');d.type='button';d.style.cssText='width:100%;height:40px;margin:4px 0 0';d.innerHTML=ICONS.trash+'Elimina listino';d.onclick=()=>askConfirm('Eliminare il listino “'+l.nome+'”? Le opportunità esistenti non cambiano.','trash','Elimina',()=>{C().listini=C().listini.filter(x=>x.id!==l.id);saveS();$('cpqEd').hidden=true;openCpq()});const dw=h('div','delw');dw.style.margin='0 0 8px';dw.append(d);w.append(dw)}
  const sig=()=>JSON.stringify([nome.value,mod.value,L.paesi,L.scaglioni,L.prezzi,L.attivo!==false]);
  const doSave=()=>{const n=nome.value.trim();if(!n){toast('Dai un nome al listino.');nome.focus();return false}L.nome=n;L.mod=num(mod.value);L.scaglioni=L.scaglioni.filter(t=>+t.da>0&&+t.pct>0).sort((a,b)=>a.da-b.da);
   const ix=C().listini.findIndex(x=>x.id===L.id);if(ix>=0)C().listini[ix]=L;else C().listini.push(L);saveS();$('cpqEd').hidden=true;openCpq();toast('Listino salvato.');return true};
  const s0=sig(),back=w.querySelector('.top button');{const sw=h('div','delw');w.append(sw);saveBtn(sw,sig,doSave)}
  back.onclick=()=>{if(sig()===s0){$('cpqEd').hidden=true;return}$('mDirty').hidden=false;$('dC').onclick=()=>{$('mDirty').hidden=true};$('dN').onclick=()=>{$('mDirty').hidden=true;$('cpqEd').hidden=true};$('dY').onclick=()=>{$('mDirty').hidden=true;doSave()}}};
}
setTimeout(()=>{try{if(applyStops())render()}catch(e){}try{runBday()}catch(e){}try{runCons()}catch(e){}try{runJr()}catch(e){}},900);document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>{try{runBday()}catch(e){}try{runCons()}catch(e){}try{runJr()}catch(e){}},1200)});
{const mb=$('menuBtn'),mn=$('appMenu'),bk=$('amBack');const close=()=>{mn.hidden=true;bk.hidden=true;mb.setAttribute('aria-expanded','false')};
 mb.onclick=()=>{const o=mn.hidden;mn.hidden=!o;bk.hidden=!o;mb.setAttribute('aria-expanded',String(o));if(o)mn.querySelector('button').focus()};bk.onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mn.hidden){close();mb.focus()}});
 mn.onclick=e=>{const b=e.target.closest('button');if(!b)return;close();({home:()=>setTab('home'),an:()=>openAn(),prod:()=>setTab('prod'),mkt:()=>setTab('mkt'),set:()=>{openSettings();paintBro()},info:()=>openInfo(),help:()=>openHelp()})[b.dataset.m]()}}


/* ===== password dei backup (cifratura dei file esportati) ===== */
const DKEY='crm-drive-v1';
const DRV={pw:'',rem:false};
try{localStorage.removeItem(DKEY+'-pw')}catch(e){}
const dSave=()=>{try{localStorage.setItem(DKEY,JSON.stringify({rem:DRV.rem}))}catch(e){}};
async function ckey(pw,salt){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function encBytes(u8){if(!DRV.pw)throw {code:'nopw'};const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await ckey(DRV.pw,salt),u8));return {enc:1,alg:'AES-256-GCM/PBKDF2',salt:b64(salt),iv:b64(iv),data:b64(ct)}}
async function decEnv(e){if(!DRV.pw)throw {code:'nopw'};try{return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(e.iv)},await ckey(DRV.pw,fromB64(e.salt)),fromB64(e.data)))}catch(x){throw {code:'badpw'}}}
const LK='crm-lock-v1';
let LOCK=(()=>{try{return JSON.parse(localStorage.getItem(LK)||'null')||{}}catch(e){return {}}})();
const lkSave=()=>{try{localStorage.setItem(LK,JSON.stringify(LOCK))}catch(e){}};
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
async function pinHash(pin,salt,kdf){const te=new TextEncoder();if(kdf==='p2'){const k=await crypto.subtle.importKey('raw',te.encode(pin),'PBKDF2',false,['deriveBits']);return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:te.encode(salt),iterations:310000,hash:'SHA-256'},k,256)))}
 const d=await crypto.subtle.digest('SHA-256',te.encode(salt+':'+pin));return b64(new Uint8Array(d))}
const LT='crm-lock-try';const ltGet=()=>{try{return JSON.parse(localStorage.getItem(LT)||'null')||{n:0,w:0}}catch(e){return {n:0,w:0}}},ltSet=o=>{try{o?localStorage.setItem(LT,JSON.stringify(o)):localStorage.removeItem(LT)}catch(e){}};
async function lkRegister(){if(!navigator.credentials||!window.PublicKeyCredential)throw {code:'nopk'};
  const c=await navigator.credentials.create({publicKey:{challenge:rnd(32),rp:{name:'CRM Clienti'},user:{id:rnd(16),name:'crm-clienti',displayName:'CRM Clienti'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},timeout:60000}});return b64(new Uint8Array(c.rawId))}
async function lkVerify(){if(!navigator.credentials||!LOCK.id)throw {code:'nopk'};await navigator.credentials.get({publicKey:{challenge:rnd(32),allowCredentials:[{type:'public-key',id:fromB64(LOCK.id),transports:['internal','hybrid']}],userVerification:'required',timeout:60000}})}
const lkErr=m=>{const e=$('lkMsg');e.textContent=m;e.hidden=!m};
function lkOpen(){document.documentElement.classList.remove('locked');lkErr('');$('lkPin').value=''}
let lkBusy=false,lkBad=0,lkWait=0,lkHid=0;
async function lkTry(){if(lkBusy)return;lkBusy=true;try{await lkVerify();lkOpen()}catch(e){lkErr(e&&e.code==='nopk'?'La biometria non è disponibile in questa pagina: usa il PIN.':'Riconoscimento non riuscito. Riprova o usa il PIN.')}finally{lkBusy=false}}
function lkLock(){if(!LOCK.on)return;document.documentElement.classList.add('locked');lkErr('');$('lkBio').hidden=!(navigator.credentials&&window.PublicKeyCredential)}
$('lkBio').onclick=lkTry;
$('lkPinGo').onclick=async()=>{const lt=ltGet();if(Date.now()<lt.w){lkErr('Troppi tentativi: riprova tra '+Math.ceil((lt.w-Date.now())/1000)+' secondi.');return}const v=$('lkPin').value.trim();if(!v){lkErr('Inserisci il PIN.');return}
  if(await pinHash(v,LOCK.salt,LOCK.kdf)===LOCK.pin){ltSet(null);if(LOCK.kdf!=='p2'){try{LOCK.salt=b64(rnd(16));LOCK.pin=await pinHash(v,LOCK.salt,'p2');LOCK.kdf='p2';lkSave()}catch(e){}}lkOpen()}else{lt.n++;$('lkPin').value='';if(lt.n%5===0){const ms=Math.min(900000,30000*Math.pow(2,lt.n/5-1));lt.w=Date.now()+ms;lkErr('PIN errato '+lt.n+' volte: attendi '+Math.round(ms/1000)+' secondi.')}else lkErr('PIN errato.');ltSet(lt)}};
$('lkPin').addEventListener('keydown',e=>{if(e.key==='Enter')$('lkPinGo').click()});
document.addEventListener('visibilitychange',()=>{if(!LOCK.on)return;if(document.hidden){lkHid=Date.now();if(+LOCK.delay===0)lkLock()}else if(+LOCK.delay>=0&&lkHid&&Date.now()-lkHid>=+LOCK.delay*60000)lkLock()});
if(LOCK.on){$('lkBio').hidden=!(navigator.credentials&&window.PublicKeyCredential);setTimeout(()=>{if(document.documentElement.classList.contains('locked')&&!$('lkBio').hidden)lkTry()},300)}
function paintLock(){$('sc_off').hidden=!!LOCK.on;$('sc_onw').hidden=!LOCK.on;$('sc_st').textContent=LOCK.on?'Blocco attivo: all’apertura l’app chiede la biometria del dispositivo (Face ID, impronta o riconoscimento del volto). Il PIN è l’alternativa di emergenza.':'Il blocco non è attivo. Attivandolo, l’app chiederà la biometria del dispositivo ogni volta che la apri.';$('sc_delay').value=String(LOCK.delay==null?5:LOCK.delay);setErr('sc_pin','');setErr('sc_pin2','')}
const pinOk=v=>/^\d{4,8}$/.test(v);
$('sc_on').onclick=async()=>{const v=$('sc_pin').value.trim();if(!pinOk(v)){setErr('sc_pin','Scegli un PIN di 4–8 cifre.');return}setErr('sc_pin','');const b=$('sc_on');b.disabled=true;
  try{const id=await lkRegister();const salt=b64(rnd(12));LOCK={on:true,id,salt,pin:await pinHash(v,salt,'p2'),kdf:'p2',delay:5};lkSave();$('sc_pin').value='';paintLock();toast('Blocco biometrico attivato.')}
  catch(e){setErr('sc_pin',e&&e.code==='nopk'?'La biometria non è disponibile in questa pagina o in questo browser.':e&&e.name==='NotAllowedError'?'Operazione annullata o non consentita da questa pagina.':'Non sono riuscito a registrare la biometria.')}finally{b.disabled=false}};
$('sc_delay').onchange=()=>{LOCK.delay=+$('sc_delay').value;lkSave();toast('Impostazione salvata.')};
$('sc_pinok').onclick=async()=>{const v=$('sc_pin2').value.trim();if(!pinOk(v)){setErr('sc_pin2','Scegli un PIN di 4–8 cifre.');return}setErr('sc_pin2','');LOCK.salt=b64(rnd(16));LOCK.pin=await pinHash(v,LOCK.salt,'p2');LOCK.kdf='p2';lkSave();$('sc_pin2').value='';toast('PIN aggiornato.')};
$('sc_test').onclick=async()=>{try{await lkVerify();toast('Biometria riconosciuta.')}catch(e){toast('Riconoscimento non riuscito.')}};
$('sc_dis').onclick=()=>askConfirm('Disattivare il blocco? L’app si aprirà senza biometria.','trash','Disattiva',()=>{LOCK={};lkSave();document.documentElement.classList.remove('locked');paintLock();toast('Blocco disattivato.')});
function paintDrive(){}

const autoReq=r=>{if(Date.now()-(LAST['r'+r.token]||0)<6e4)return;LAST['r'+r.token]=Date.now();checkReplies(r,null,true)};
let autoBusy=false;
async function autoSync(){if(autoBusy||document.hidden)return;autoBusy=true;
  try{const mcp=await gm();if(!mcp||!PV().search)return;
    if(Date.now()-(LAST.scan||0)>6e5)await leadScan();
    for(const l of leads.filter(x=>x.stato==='nuovo'&&x.email&&((x.msgs&&x.msgs.length)||x.inf)).slice(0,8)){if(Date.now()-(LAST['l'+l.id]||0)>6e5)await leadSync(l,true)}
    let k=0;for(const c of clients){for(const r of((c.privacy&&c.privacy.richieste)||[])){if(k>=8)break;if(effSt(r)!=='inviata'||AUTOREP[r.token]||Date.now()-(LAST['r'+r.token]||0)<2e5)continue;LAST['r'+r.token]=Date.now();k++;
      await checkReplies(r,null,true)}}
    renderH();try{renderL()}catch(e){}
  }catch(e){}finally{autoBusy=false}}
setTimeout(autoSync,2500);setInterval(autoSync,24e4);document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(autoSync,800)});
const _setTab=setTab;setTab=function(v){_setTab(v);paintBadges();if(v==='lead'&&Date.now()-(LAST.scan||0)>12e4)leadScan()};
/* in tutte le pagine tranne la Home compare, accanto al menu, la freccia indietro che riporta alla Home */
{const hb=$('homeBk'),mb=$('menuBtn'),paintBk=()=>{const home=tab==='home'&&!($('anSh')&&!$('anSh').hidden);hb.hidden=home;mb.hidden=false};
 hb.onclick=()=>setTab('home');
 const _s3=setTab;setTab=function(v){const r=_s3.apply(this,arguments);paintBk();return r};
 const _oa=window.openAn;if(_oa)window.openAn=function(){const r=_oa.apply(this,arguments);paintBk();return r};
 paintBk()}
render();renderO();renderP();setTab('home');
/* ===== guida di benvenuto: primi passi ===== */
const wState=()=>{let enc=false;try{enc=SB.e2e.state()==='ready'}catch(e){}return[
 {k:'az',ic:'building',t:'Il profilo della tua azienda',d:'Nome, partita IVA e firma delle email',done:!!(S.azienda&&S.azienda.trim())},
 {k:'cl',ic:'users',t:'Il tuo primo cliente',d:'Scrivi i dati o fotografa un biglietto da visita',done:clients.length>0},
 {k:'em',ic:'Scrivi',t:'La posta',d:'Come invii le email ai clienti',done:!!S.mailOk},
 {k:'cr',ic:'shield',t:'La cifratura dei dati',d:'Come proteggiamo ciò che salvi',done:!!S.cryptoOk||enc},
 {k:'sc',ic:'user',t:'L’accesso con biometria',d:'Face ID o impronta per aprire l’app',done:!!(typeof LOCK!=='undefined'&&LOCK.on)}]};
function paintWel(){const w=$('hWel');if(!w)return;w.textContent='';if(S.welcomeOff)return;const st=wState(),n=st.filter(x=>x.done).length;if(n===st.length)return;
  const b=h('button','wcard');b.type='button';const i=h('span','ic');i.innerHTML=ICONS.compass;const tx=h('div','tx');const bar=h('div','wbar'),f=h('i');f.style.width=Math.round(n/st.length*100)+'%';bar.append(f);
  tx.append(h('b','','Primi passi'),h('span','',n+' di '+st.length+' completati'),bar);
  const x=h('span','wx');x.setAttribute('role','button');x.setAttribute('aria-label','Nascondi i primi passi');x.title='Nascondi';x.innerHTML=ICONS.x;x.onclick=e=>{e.stopPropagation();S.welcomeOff=true;saveS();paintWel()};
  b.append(i,tx,x);b.onclick=()=>openWel();w.append(b)}
/* Aiuto: primi passi e, a tendere, manuale interattivo e assistente */
function openHelp(){const M=$('mWel'),B=$('wBody');B.textContent='';M.hidden=false;
  B.append(h('h3','','Aiuto'),h('p','wsub','Come iniziare e dove trovare le risposte.'));
  let n=0,t=5;try{const st=wState();n=st.filter(x=>x.done).length;t=st.length}catch(e){}
  const rows=[
    ['compass','Primi passi',n+' di '+t+' completati',()=>{S.welcomeOff=false;saveS();openWel()}],
    ['doc','Manuale utente','In arrivo: guida interattiva alle funzioni',null],
    ['chat','Assistente','Chiedi come si fa una cosa',()=>{M.hidden=true;openAsk()}]];
  const g=h('div','shg'),l=h('div','sl');
  rows.forEach(([ic,nm,sm,fn])=>{const b=h('button','shr wlr');b.type='button';const i=h('span','ic');i.innerHTML=ICONS[ic]||'';const tx=h('div','tx');tx.append(h('b','',nm),h('span','',sm));b.append(i,tx);
    if(fn){const c=h('span','ch');c.innerHTML=ICONS.chevR;b.append(c);b.onclick=fn}else{b.disabled=true;b.style.opacity='.55'}l.append(b)});
  g.append(l);B.append(g);
  const x=h('button','btn lbl');x.type='button';x.innerHTML=ICONS.x+'<span>Chiudi</span>';x.onclick=()=>{M.hidden=true};B.append(x)}
function openAsk(){if(window.ASK){ASK.open();return}const s=document.createElement('script');s.src='assistente.js?v=1.32.0';s.onload=()=>ASK.open();s.onerror=()=>toast('Assistente non disponibile senza connessione. Riprova.');document.head.append(s)}
function closeWel(){$('mWel').hidden=true;try{paintWel()}catch(e){}}
function openWel(view){const M=$('mWel'),B=$('wBody');B.textContent='';M.hidden=false;
  if(!S.welcomeSeen){S.welcomeSeen=true;saveS()}
  const back=()=>{const b=h('button','btn lbl');b.type='button';b.innerHTML=ICONS.back+'<span>Indietro</span>';b.onclick=()=>openWel();return b};
  if(view==='cl'){
    B.append(h('h3','','Il tuo primo cliente'),h('p','wsub','Scegli come inserirlo: puoi cambiare tutto dopo.'));
    const a=h('button','btn p lbl');a.type='button';a.innerHTML=ICONS.edit+'<span>Scrivo i dati</span>';a.onclick=()=>{closeWel();setTab('clienti');openSheet(null)};
    const c=h('button','btn lbl');c.type='button';c.innerHTML=ICONS.camera+'<span>Fotografo un biglietto da visita</span>';c.onclick=()=>{closeWel();setTab('clienti');CARD.add(false);$('cardFile').click()};
    B.append(a,c,back());return}
  if(view==='cr'){
    let ready=false,can=false;try{ready=SB.e2e.state()==='ready';can=!!(SB.has&&SB.has())}catch(e){}
    B.append(h('h3','','La cifratura dei dati'));
    const p=(t)=>{const d=h('p','wtx');d.innerHTML=t;B.append(d)};
    p('<b>Cosa fa.</b> I tuoi clienti, lead e preventivi vengono cifrati sul tuo telefono prima di essere salvati nel cloud. Nemmeno io posso leggerli.');
    p('<b>Cosa devi fare.</b> Niente: la cifratura usa la password del tuo account e si attiva da sola al primo accesso. Ti verrà mostrata una <b>chiave di recupero</b>: salvala fuori dal telefono, in un gestore di password o su carta.');
    p('<b>Attenzione.</b> Se reimposti la password da un dispositivo nuovo senza la chiave di recupero, i dati nel cloud non si possono recuperare da nessuno.');
    if(ready){const d=h('p','wtx');d.innerHTML='<b>Stato:</b> la cifratura è attiva su questo dispositivo.';B.append(d)}
    const ok=h('button','btn p lbl');ok.type='button';ok.innerHTML=ICONS.check+'<span>Ho capito</span>';ok.onclick=()=>{S.cryptoOk=true;saveS();openWel()};B.append(ok);
    if(!ready&&can){const g=h('button','btn lbl');g.type='button';g.innerHTML=ICONS.shield+'<span>Attiva ora</span>';g.onclick=()=>{S.cryptoOk=true;saveS();closeWel();CLOUD.started=false;cloudGate()};B.append(g)}
    B.append(back());return}
  const st=wState(),n=st.filter(x=>x.done).length;
  B.append(h('h3','','Benvenuto in KRANG CRM'),h('p','wsub',n===st.length?'Hai completato i primi passi.':['','','','Tre','Quattro','Cinque','Sei'][st.length]+' passi per iniziare. Puoi saltarli e tornare qui dal menu, voce Aiuto.'));
  const g=h('div','shg'),l=h('div','sl');
  st.forEach(x=>{const b=h('button','shr wlr');b.type='button';const i=h('span','ic');i.innerHTML=x.done?ICONS.check:ICONS[x.ic];if(x.done)i.classList.add('ok');const tx=h('div','tx');tx.append(h('b','',x.t),h('span','',x.d));const c=h('span','ch');c.innerHTML=ICONS.chevR;b.append(i,tx,c);
    b.onclick=()=>{if(x.k==='az'){closeWel();openSettings();setSp('az')}else if(x.k==='em'){S.mailOk=true;saveS();closeWel();openSettings();setSp('em')}else if(x.k==='sc'){closeWel();openSettings();setSp('sc')}else openWel(x.k)};l.append(b)});
  g.append(l);B.append(g);
  const go=h('button','btn p lbl');go.type='button';go.innerHTML=ICONS.check+'<span>'+(n===st.length?'Inizia':'Più tardi')+'</span>';go.onclick=closeWel;B.append(go)}
(()=>{let k=0;const t=setInterval(()=>{k++;if(k>40||S.welcomeSeen||S.welcomeOff){clearInterval(t);return}
  if(document.documentElement.classList.contains('noauth')||!$('mE2E').hidden||!$('mWel').hidden)return;
  if(clients.length||leads.length||opps.length||(S.azienda&&S.azienda.trim())){S.welcomeSeen=true;saveS();clearInterval(t);return}
  if(CLOUD.on&&!CLOUD.last&&k<15)return;
  clearInterval(t);openWel()},1500)})();


/* diagnostica spazio: chiede archiviazione persistente e avvisa se il browser sta per riempirsi */
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
setTimeout(()=>{try{let n=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);n+=(k.length+(localStorage.getItem(k)||'').length)*2}if(n>3.5e6){toast('Spazio del browser quasi pieno ('+(n/1e6).toFixed(1).replace('.',',')+' MB su circa 5): foto e dati nuovi potrebbero non essere salvati.');clearTimeout(toast.t);toast.t=setTimeout(()=>{$('toast').hidden=true},12000)}}catch(e){}},3000);

/* ===== account e sincronizzazione (Supabase) ===== */
const SB=(()=>{
 const U='https://oebneptbsfxbfwafjhjw.supabase.co',K='sb_publishable_zUOzrWkF4tLoXjR5bsi3xQ_KK9khPrd',SK='crm-sb-v1',UK='crm-sb-uid';
 let ses=null;try{ses=JSON.parse(localStorage.getItem(SK)||'null')}catch(e){}
 const save=()=>{try{ses?localStorage.setItem(SK,JSON.stringify(ses)):localStorage.removeItem(SK)}catch(e){}};
 const mkErr=(r,j)=>{const e=new Error((j&&(j.msg||j.message||j.error_description))||'errore');e.code=(j&&(j.error_code||j.code))||String(r.status);e.status=r.status;return e};
 const setSes=j=>{ses={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:j.expires_at||Math.floor(Date.now()/1000)+(j.expires_in||3600),user:j.user||(ses&&ses.user)};save()};
 async function raw(path,o){o=o||{};const hd=Object.assign({apikey:K},o.headers||{});if(o.auth)hd.Authorization='Bearer '+await token();if(o.json!==undefined)hd['Content-Type']='application/json';
  try{return await fetch(U+path,{method:o.method||'GET',headers:hd,body:o.json!==undefined?JSON.stringify(o.json):o.body})}catch(e){throw Object.assign(new Error('offline'),{code:'offline'})}}
 async function js(path,o){const r=await raw(path,o);let j=null;try{j=await r.json()}catch(e){}if(!r.ok)throw mkErr(r,j);return j}
 async function token(){if(!ses)throw Object.assign(new Error('nessuna sessione'),{code:'revoked'});if(ses.expires_at*1000-Date.now()<60000)await refresh();return ses.access_token}
 let rp=null;const refresh=()=>rp||(rp=(async()=>{try{setSes(await js('/auth/v1/token?grant_type=refresh_token',{method:'POST',json:{refresh_token:ses.refresh_token}}))}catch(e){if(e.status===400||e.status===401){ses=null;save();document.documentElement.classList.add('noauth')}throw e}finally{rp=null}})());
 const uid=()=>ses&&ses.user?ses.user.id:'';
 /* foto: file nell'archivio, riferimento nel record */
 const PH={};const b2d=b=>new Promise((ok,ko)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=ko;f.readAsDataURL(b)});
 const safe=x=>String(x).replace(/[^\w-]/g,'_');
 /* cifratura end-to-end: la chiave dei dati (DK) nasce sul dispositivo e al cloud arriva solo avvolta da passphrase e chiave di recupero */
 const te=new TextEncoder(),td=new TextDecoder(),LK='crm-dk-v1',MG='crm-e2e-mig',IT=600000,RIT=100000,B32='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
 const E={dk:null,raw:null,bundle:null,prep:null};
 const b64=u=>{let t='';for(let i=0;i<u.length;i+=8192)t+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(t)};
 const unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
 const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
 const lockErr=()=>Object.assign(new Error('dati cifrati: serve la passphrase'),{code:'locked'});
 async function kek(secret,salt,it){const m=await crypto.subtle.importKey('raw',te.encode(secret),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:it,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function wrap(raw,key){const iv=rnd(12),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,raw)),o=new Uint8Array(12+ct.length);o.set(iv);o.set(ct,12);return b64(o)}
 async function unwrap(t,key){const u=unb64(t);return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:u.subarray(0,12)},key,u.subarray(12)))}
 const aad=(col,id)=>te.encode(uid()+'|'+col+'|'+id);
 async function encJ(col,id,obj){if(!E.dk)throw lockErr();const iv=rnd(12),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(col,String(id))},E.dk,te.encode(JSON.stringify(obj)));return{_e:1,i:b64(iv),c:b64(new Uint8Array(ct))}}
 async function decJ(col,id,d){if(!E.dk)throw lockErr();return JSON.parse(td.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(d.i),additionalData:aad(col,String(id))},E.dk,unb64(d.c))))}
 const rkNew=()=>{const u=rnd(20);let bits=0,v=0,t='';for(const x of u){v=((v<<8)|x)&0xfffff;bits+=8;while(bits>=5){t+=B32[(v>>>(bits-5))&31];bits-=5}v&=(1<<bits)-1}return t.match(/.{4}/g).join('-')};
 const rkNorm=t=>String(t||'').toUpperCase().replace(/[^A-Z2-7]/g,'');
 async function setDK(raw,keep){E.raw=raw;E.dk=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt','decrypt']);if(keep)try{localStorage.setItem(LK,JSON.stringify({u:uid(),k:b64(raw)}))}catch(e){}}
 async function fetchBundle(){const r=await js('/auth/v1/user',{auth:1}),m=r&&r.user_metadata,b=m&&m.kcrm_e2e;E.bundle=b&&b.v===1?b:null;return E.bundle}
 const putBundle=b=>js('/auth/v1/user',{method:'PUT',auth:1,json:{data:{kcrm_e2e:b}}}).then(()=>{E.bundle=b});
 async function mkBundle(pass,rk,raw){const s=rnd(16),rs=rnd(16);return{v:1,it:IT,s:b64(s),w:await wrap(raw,await kek(pass,s,IT)),ri:RIT,rs:b64(rs),rw:await wrap(raw,await kek(rkNorm(rk),rs,RIT))}}
 async function rawByPass(pass){const b=E.bundle||await fetchBundle();if(!b)throw Object.assign(new Error('nessuna chiave'),{code:'nokey'});try{return await unwrap(b.w,await kek(pass,unb64(b.s),b.it))}catch(e){throw Object.assign(new Error('passphrase errata'),{code:'badpass'})}}
 async function listDel(match){for(const c of ['clienti','prodotti','opportunita','lead','movimenti','config']){const all=[];for(let off=0;off<20000;off+=100){const L=await js('/storage/v1/object/list/media',{method:'POST',auth:1,json:{prefix:uid()+'/'+c,limit:100,offset:off}});if(!L||!L.length)break;L.forEach(x=>{if(x&&x.name&&match(x.name))all.push(uid()+'/'+c+'/'+x.name)});if(L.length<100)break}
   for(let i=0;i<all.length;i+=100)await js('/storage/v1/object/media',{method:'DELETE',auth:1,json:{prefixes:all.slice(i,i+100)}})}}
 const e2e={
  state:()=>E.dk?'ready':'locked',
  async init(){if(E.dk)return 'ready';try{const o=JSON.parse(localStorage.getItem(LK)||'null');if(o&&o.u===uid()&&o.k){await setDK(unb64(o.k),false);return 'ready'}}catch(e){}
   try{return await fetchBundle()?'locked':'none'}catch(e){return e.code==='offline'?'offline':'error'}},
  async setupPrepare(pass){const raw=rnd(32),rk=rkNew();E.prep={raw,rk,b:await mkBundle(pass,rk,raw)};return rk},
  async setupCommit(){if(!E.prep)throw new Error('prep');if(await fetchBundle())throw Object.assign(new Error('esiste'),{code:'exists'});await putBundle(E.prep.b);await setDK(E.prep.raw,true);E.prep=null},
  async unlock(pass){await setDK(await rawByPass(pass),true)},
  async unlockRecovery(rk){const b=E.bundle||await fetchBundle();if(!b)throw Object.assign(new Error('nessuna chiave'),{code:'nokey'});let raw;try{raw=await unwrap(b.rw,await kek(rkNorm(rk),unb64(b.rs),b.ri))}catch(e){throw Object.assign(new Error('chiave errata'),{code:'badkey'})}await setDK(raw,true)},
  async setPass(pass){if(!E.raw)throw lockErr();const b=E.bundle||await fetchBundle(),s=rnd(16);await putBundle(Object.assign({},b,{it:IT,s:b64(s),w:await wrap(E.raw,await kek(pass,s,IT))}))},
  async changePass(cur,nw){await rawByPass(cur);await e2e.setPass(nw)},
  /* a ogni accesso con password: la chiave dei dati è protetta dalla password dell'account, senza che l'utente scelga nulla */
  async auto(pass){const st=await e2e.init();
   if(st==='none'){const rk=await e2e.setupPrepare(pass);await e2e.setupCommit();return{rk}}
   if(st==='ready'){try{await rawByPass(pass)}catch(e){if(e&&e.code==='badpass')await e2e.setPass(pass);else if(e&&e.code!=='nokey')throw e}return{}}
   if(st==='locked'){try{await e2e.unlock(pass);return{}}catch(e){if(e&&e.code==='badpass')return{locked:true};throw e}}
   return{}},
  /* backup: i dati sono cifrati con la chiave dei dati; nel file c'è la chiave avvolta (password dell'account e chiave di recupero) */
  async seal(u8){if(!E.dk)throw lockErr();const b=E.bundle||await fetchBundle();if(!b)throw lockErr();const iv=rnd(12),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},E.dk,u8));return{enc:2,alg:'AES-256-GCM',b,iv:b64(iv),data:b64(ct)}},
  async open(env,ask){const dec=k=>crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(env.iv)},k,unb64(env.data)).then(x=>new Uint8Array(x));
   if(E.dk){try{return await dec(E.dk)}catch(e){}}
   const sec=await ask();if(sec==null)throw Object.assign(new Error('annullato'),{code:'cancel'});const b=env.b||{};let raw=null;
   try{raw=await unwrap(b.w,await kek(sec,unb64(b.s),b.it))}catch(e){try{raw=await unwrap(b.rw,await kek(rkNorm(sec),unb64(b.rs),b.ri))}catch(x){}}
   if(!raw)throw Object.assign(new Error('password errata'),{code:'badpw'});
   try{return await dec(await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']))}catch(e){throw Object.assign(new Error('file danneggiato'),{code:'badpw'})}},
  async newRecovery(cur){if(!E.raw)await rawByPass(cur);const rk=rkNew(),rs=rnd(16),b=E.bundle;await putBundle(Object.assign({},b,{ri:RIT,rs:b64(rs),rw:await wrap(E.raw,await kek(rkNorm(rk),rs,RIT))}));return rk},
  async reset(){await js('/rest/v1/records?user_id=eq.'+uid(),{method:'DELETE',auth:1,headers:{Prefer:'return=minimal'}});try{await listDel(()=>true)}catch(e){}await putBundle(null);E.dk=null;E.raw=null;E.bundle=null;try{localStorage.removeItem(LK)}catch(e){}},
  needMig:()=>{try{return localStorage.getItem(MG)!=='1'}catch(e){return false}},
  setMig:()=>{try{localStorage.setItem(MG,'1')}catch(e){}},
  async cleanup(){/* elimina le vecchie foto in chiaro solo se esiste la copia cifrata della stessa scheda */
   for(const c of ['clienti','prodotti','opportunita','lead','movimenti','config']){const names=[];for(let off=0;off<20000;off+=100){const L=await js('/storage/v1/object/list/media',{method:'POST',auth:1,json:{prefix:uid()+'/'+c,limit:100,offset:off}});if(!L||!L.length)break;L.forEach(x=>{if(x&&x.name)names.push(x.name)});if(L.length<100)break}
    const stem=n=>n.replace(/-[^-]*\.(enc|jpg)$/,''),enc=new Set(names.filter(n=>/\.enc$/.test(n)).map(stem)),old=names.filter(n=>/\.jpg$/.test(n)&&enc.has(stem(n))).map(n=>uid()+'/'+c+'/'+n);
    for(let i=0;i<old.length;i+=100)await js('/storage/v1/object/media',{method:'DELETE',auth:1,json:{prefixes:old.slice(i,i+100)}})}}};
 async function upBlob(p,body){const T=['application/octet-stream','image/jpeg'];for(let i=0;i<T.length;i++){const r=await raw('/storage/v1/object/media/'+p,{method:'POST',auth:1,headers:{'Content-Type':T[i],'x-upsert':'true'},body});if(r.ok)return;let j=null;try{j=await r.json()}catch(e){}const er=mkErr(r,j);if(i===T.length-1||!/mime|type/i.test(er.message||''))throw er}}
 async function upFoto(col,id,du){const hh=hs(du),p=uid()+'/'+col+'/'+safe(id)+'-'+safe(hh)+'.enc';
  if(!PH[p]){if(!E.dk)throw lockErr();const bl=await (await fetch(du)).blob(),iv=rnd(12),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:te.encode(p)},E.dk,await bl.arrayBuffer()));await upBlob(p,new Blob([iv,ct]));PH[p]=du}
  return [p,hh]}
 const okPath=p=>typeof p==='string'&&p.indexOf(uid()+'/')===0&&/^[\w-]+\/[\w-]+\/[\w.-]+$/.test(p)&&p.indexOf('..')<0;
 async function dlFoto(p){if(!okPath(p))return '';if(PH[p])return PH[p];try{const r=await raw('/storage/v1/object/authenticated/media/'+p,{auth:1});if(!r.ok)return '';let bl=await r.blob();if(/\.enc$/.test(p)){if(!E.dk)return '';const u8=new Uint8Array(await bl.arrayBuffer());bl=new Blob([await crypto.subtle.decrypt({name:'AES-GCM',iv:u8.subarray(0,12),additionalData:te.encode(p)},E.dk,u8.subarray(12))],{type:'image/jpeg'})}const u=okImg(await b2d(bl));if(u)PH[p]=u;return u}catch(e){return ''}}
 async function put(col,id,data){const d=Object.assign({},data);delete d._u;delete d._by;
  if(okImg(d.foto)){const [p,hh]=await upFoto(col,id,d.foto);d.fotoPath=p;d.fotoH=hh;delete d.foto}else{delete d.foto;delete d.fotoPath;delete d.fotoH}
  await js('/rest/v1/records?on_conflict=user_id,col,id',{method:'POST',auth:1,headers:{Prefer:'resolution=merge-duplicates,return=minimal'},json:[{user_id:uid(),col,id:String(id),data:await encJ(col,id,d),deleted:false}]})}
 const del=(col,id)=>js('/rest/v1/records?on_conflict=user_id,col,id',{method:'POST',auth:1,headers:{Prefer:'resolution=merge-duplicates,return=minimal'},json:[{user_id:uid(),col,id:String(id),data:{},deleted:true}]});
 async function inflate(row,col){const rd=row.data||{};const d=rd._e===1?await decJ(col,String(row.id),rd):Object.assign({},rd);if(d.fotoPath){const u=await dlFoto(d.fotoPath);delete d.fotoPath;delete d.fotoH;if(u)d.foto=u}return d}
 /* lettura periodica (ogni 15 s e al ritorno sull'app) */
 function watch(col,onRows,onErr){let stop=false,last='1970-01-01T00:00:00+00:00',first=true,busy=false;
  async function pull(){if(stop||busy)return;busy=true;try{let all=[];for(;;){const q='/rest/v1/records?col=eq.'+col+'&updated_at=gt.'+encodeURIComponent(last)+'&order=updated_at.asc&limit=500&select=id,data,deleted,updated_at';const rows=await js(q,{auth:1});all=all.concat(rows);if(rows.length)last=rows[rows.length-1].updated_at;if(rows.length<500)break}
    if(stop)return;if(all.length||first){await onRows(all,first);first=false}}catch(e){if(onErr)onErr(e)}finally{busy=false}}
  pull();const t=setInterval(pull,15000),vis=()=>{if(!document.hidden)pull()};document.addEventListener('visibilitychange',vis);
  return()=>{stop=true;clearInterval(t);document.removeEventListener('visibilitychange',vis)}}
 const db=()=>ses?{
  collection:col=>({
   doc:id=>({set:d=>put(col,id,d),delete:()=>del(col,id)}),
   onSnapshot:(cb,eb)=>watch(col,async(rows,first)=>{const ch=[];for(const r of rows){if(r.deleted)ch.push({type:'removed',doc:{id:String(r.id)}});else{let d;try{d=await inflate(r,col)}catch(e){if(e&&e.code==='locked')throw e;continue}ch.push({type:first?'added':'modified',doc:{id:String(r.id),data:()=>Object.assign({},d)}})}}cb({docChanges:()=>ch})},eb)}),
  doc:path=>{const [col,id]=path.split('/');return{set:d=>put(col,id,d),onSnapshot:(cb,eb)=>watch(col,async(rows,first)=>{const r=rows.filter(x=>String(x.id)===id&&!x.deleted).pop();if(r){let d=null;try{d=await inflate(r,col)}catch(e){if(e&&e.code==='locked')throw e}if(d)cb({exists:true,data:()=>Object.assign({},d)});else if(first)cb({exists:false,data:()=>null})}else if(first)cb({exists:false,data:()=>null})},eb)}}}:null;
 const DK=['crm-clienti-v1','crm-opps-v1','crm-prod-v1','crm-mov-v1','crm-lead-v1'];
 function wipe(){try{Object.keys(localStorage).filter(k=>/^crm-/.test(k)&&!/^crm-(lock|sb)-v1$/.test(k)&&!['crm-sb-uid','crm-did','crm-lk','crm-lal'].includes(k)).forEach(k=>localStorage.removeItem(k));DK.forEach(k=>{localStorage.setItem(k,'[]');localStorage.setItem(k+'-seeded','1')});localStorage.setItem('crm-lead-seeded','1')}catch(e){}}
 const msg=e=>({badpass:'Passphrase errata.',badkey:'Chiave di recupero non valida.',locked:'Dati cifrati: serve la passphrase.',invalid_credentials:'Email o password non corretti.',email_not_confirmed:'Conferma prima l’indirizzo email dal link che ti abbiamo inviato.',user_already_exists:'Esiste già un account con questa email: accedi.',weak_password:'Password troppo debole: usa almeno 8 caratteri.',captcha_failed:'Verifica anti-bot non riuscita: riprova.',over_request_rate_limit:'Troppi tentativi: riprova tra qualche minuto.',over_email_send_rate_limit:'Troppe email inviate: riprova tra qualche minuto.',email_address_invalid:'Indirizzo email non valido.',validation_failed:'Controlla email e password.',offline:'Sei offline: serve la connessione per accedere.',signup_disabled:'Le registrazioni sono disattivate.',otp_expired:'Il link è scaduto o è già stato usato: richiedi una nuova email.',same_password:'La nuova password deve essere diversa dalla precedente.',access_denied:'Il link non è valido: richiedi una nuova email.'})[e&&e.code]||'Operazione non riuscita ('+(e&&(e.code||e.message)||'errore')+').';
 let capTok='';const sec=()=>capTok?{gotrue_meta_security:{captcha_token:capTok}}:{};
 const DVK='crm-did';const did=()=>{let d='';try{d=localStorage.getItem(DVK)||'';if(!/^[0-9a-f]{8,16}$/.test(d)){d=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem(DVK,d)}}catch(e){d=d||'0000000000'}return d};
 const dev=()=>{const u=navigator.userAgent||'';const os=/iPhone/.test(u)?'iPhone':/iPad/.test(u)?'iPad':/Android/.test(u)?'Android':/Macintosh/.test(u)?'Mac':/Windows/.test(u)?'Windows':/Linux/.test(u)?'Linux':'Dispositivo';const br=/Edg\//.test(u)?'Edge':/Firefox|FxiOS/.test(u)?'Firefox':/Chrome|CriOS/.test(u)?'Chrome':/Safari/.test(u)?'Safari':'Browser';return os+' · '+br};
 async function alog(kind){try{if(!ses)return;await js('/rest/v1/access_log',{method:'POST',auth:true,headers:{Prefer:'return=minimal'},json:{device_id:did(),device:dev(),kind,app_ver:((document.querySelector('meta[name=app-version]')||{}).content||'').split('|')[0].slice(0,20)}})}catch(e){}}
 const usage=()=>js('/rest/v1/rpc/my_usage',{method:'POST',auth:true,json:{}});
 /* presenza: ultimo istante in cui l'app era aperta (solo per il monitor del gestore) */
 {const ping=()=>{try{if(!ses||document.hidden||navigator.onLine===false)return;js('/rest/v1/rpc/ping',{method:'POST',auth:true,headers:{Prefer:'return=minimal'},json:{v:((document.querySelector('meta[name=app-version]')||{}).content||'').split('|')[0].slice(0,20)}}).catch(()=>{})}catch(e){}};
  setInterval(ping,12e4);document.addEventListener('visibilitychange',()=>{if(!document.hidden)ping()});setTimeout(ping,6000)}
 /* errori applicativi -> console di audit (solo testo tecnico ripulito, niente dati dei clienti) */
 {const seen=new Map();let sent=0,t0=Date.now();
  const clean=s=>String(s==null?'':s).replace(/[\x00-\x1f]+/g,' ').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g,'[email]').replace(/https?:\/\/[^\s)'"]+/g,u=>{try{const x=new URL(u);return x.origin+x.pathname.replace(/[0-9a-f-]{16,}/gi,'…')}catch(e){return '[url]'}}).replace(/\+?\d[\d\s().-]{6,}\d/g,'[num]').replace(/\s+/g,' ').trim();
  window.logErr=async(kind,msg,src,stack)=>{try{if(!ses)return;const m=clean(msg).slice(0,300);if(!m)return;const key=kind+m;const n=(seen.get(key)||0)+1;seen.set(key,n);if(n>2)return;if(Date.now()-t0>6e5){t0=Date.now();sent=0}if(++sent>8)return;
   await js('/rest/v1/app_errors',{method:'POST',auth:true,headers:{Prefer:'return=minimal'},json:{kind,msg:m,src:clean(src).slice(0,120)||null,stack:clean(stack).slice(0,800)||null,tab:String((document.getElementById('title')||{}).textContent||'').trim().slice(0,30)||null,app_ver:((document.querySelector('meta[name=app-version]')||{}).content||'').split('|')[0].slice(0,20),device:dev()}})}catch(e){}};
  window.addEventListener('error',e=>{if(e.target&&e.target!==window&&(e.target.src||e.target.href))return;logErr('js',e.message,(e.filename||'').split('/').pop()+':'+(e.lineno||0)+':'+(e.colno||0),e.error&&e.error.stack)});
  window.addEventListener('unhandledrejection',e=>{const r=e.reason;const m=r&&r.message?r.message:String(r);logErr(/fetch|network|rete/i.test(m)?'rete':'promise',m,'',r&&r.stack)})}
 const arecent=()=>js('/rest/v1/access_log?select=created_at,device_id,device,kind&order=created_at.desc&limit=20',{auth:true});
 async function logoutAll(){try{if(ses)await raw('/auth/v1/logout?scope=global',{method:'POST',auth:1})}catch(e){}ses=null;save()}
 const ai=body=>js('/functions/v1/assistant-ai',{method:'POST',auth:true,json:body});
 const vies=body=>js('/functions/v1/vies-lookup',{method:'POST',auth:true,json:body});
 const csearch=body=>js('/functions/v1/company-search',{method:'POST',auth:true,json:body});
 async function fb(row){await js('/rest/v1/assistant_feedback',{method:'POST',auth:true,headers:{Prefer:'return=minimal'},json:row})}
 return{db,uid,e2e,fb,ai,vies,csearch,usage,alog,arecent,logoutAll,did,setCap:t=>{capTok=t||''},email:()=>ses&&ses.user?ses.user.email:'',has:()=>!!ses,msg,wipe,
  async signIn(email,password){setSes(await js('/auth/v1/token?grant_type=password',{method:'POST',json:Object.assign({email,password},sec())}))},
  async signUp(email,password){const j=await js('/auth/v1/signup',{method:'POST',json:Object.assign({email,password},sec())});if(j&&j.access_token){setSes(j);return true}return false},
  recover:email=>js('/auth/v1/recover',{method:'POST',json:Object.assign({email},sec())}),
  async logout(){try{if(ses)await raw('/auth/v1/logout?scope=local',{method:'POST',auth:1})}catch(e){}ses=null;save()},
  async removeAccount(){try{for(const c of ['clienti','prodotti','opportunita','lead','movimenti','config']){for(let g=0;g<50;g++){const L=await js('/storage/v1/object/list/media',{method:'POST',auth:1,json:{prefix:uid()+'/'+c,limit:100,offset:0}});if(!L||!L.length)break;await js('/storage/v1/object/media',{method:'DELETE',auth:1,json:{prefixes:L.map(x=>uid()+'/'+c+'/'+x.name)}})}}}catch(e){}
   await js('/rest/v1/rpc/delete_my_account',{method:'POST',auth:1,json:{}});ses=null;save()},
  /* link ricevuti per email (conferma, recupero): il token non resta nell'indirizzo e non apre da solo una sessione */
  link:(()=>{const l=window.__authLink||null;try{delete window.__authLink}catch(e){}return l})(),
  async linkUser(tok){const r=await fetch(U+'/auth/v1/user',{headers:{apikey:K,Authorization:'Bearer '+tok}});if(!r.ok)throw Object.assign(new Error('link'),{code:'otp_expired'});return (await r.json()).email||''},
  async linkPassword(tok,password){const hd={apikey:K,Authorization:'Bearer '+tok,'Content-Type':'application/json'};const r=await fetch(U+'/auth/v1/user',{method:'PUT',headers:hd,body:JSON.stringify({password})});let j=null;try{j=await r.json()}catch(e){}if(!r.ok)throw mkErr(r,j);try{await fetch(U+'/auth/v1/logout?scope=global',{method:'POST',headers:hd})}catch(e){}ses=null;save()},
  /* dopo l'accesso: se cambia utente (o primo accesso) il dispositivo riparte vuoto, poi arriva tutto dal cloud */
  enter(pw){const id=uid();let prev='';try{prev=localStorage.getItem(UK)||''}catch(e){}const fresh=prev!==id;if(fresh){wipe();try{localStorage.setItem(UK,id)}catch(e){}}
   const fin=()=>{if(fresh){location.reload();return}document.documentElement.classList.remove('noauth');CLOUD.on=true;cloudGate()};
   if(!pw){fin();return}
   e2e.auto(pw).then(r=>{r=r||{};
    if(r.locked){E2EUI.open('locked',{pw,done:fin});return}
    if(r.rk){E2EUI.showRk(r.rk,fin);return}
    fin()}).catch(()=>fin())},
  forget(){try{localStorage.removeItem(UK)}catch(e){}}}})();
{ let mode='in',ltok='',lmail='';const $a=id=>document.getElementById(id);
  /* anti-bot (Cloudflare Turnstile): attivo solo se qui c'e' la Site key pubblica */
  const TS_KEY='0x4AAAAAAF8yAH6XoMthksqM';let tsId=null,tsTok='';
  const tsSet=t=>{tsTok=t||'';SB.setCap(tsTok)};
  const tsReset=()=>{tsSet('');try{if(window.turnstile&&tsId!==null)turnstile.reset(tsId)}catch(e){}};
  if(TS_KEY){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=()=>{try{tsId=turnstile.render('#au_ts',{sitekey:TS_KEY,callback:tsSet,'expired-callback':()=>tsSet(''),'error-callback':()=>tsSet('')})}catch(e){}};document.head.append(s)}
  /* limite tentativi: dopo 5 password sbagliate l'attesa raddoppia (30 s, 1 min, 2 min... max 15 min) */
  const LK='crm-lk',lk=()=>{try{return JSON.parse(localStorage.getItem(LK)||'{}')||{}}catch(e){return{}}};
  const lkWait=()=>Math.max(0,(lk().until||0)-Date.now());
  const lkFail=()=>{const n=(lk().n||0)+1,w=n>=5?Math.min(900000,30000*Math.pow(2,n-5)):0;try{localStorage.setItem(LK,JSON.stringify({n,until:w?Date.now()+w:0}))}catch(e){}};
  const lkOk=()=>{try{localStorage.removeItem(LK)}catch(e){}};
  const paintAu=()=>{if(mode==='new'){$a('au_t').textContent='Nuova password';$a('au_h').textContent='Scegli una nuova password per '+lmail+'.';$a('au_gl').textContent='Salva password';$a('au_sw').textContent='Annulla';$a('au_e').hidden=true;$a('au_ck').hidden=true;$a('au_p').autocomplete='new-password';$a('au_fg').hidden=true;return}$a('au_e').hidden=false;$a('au_ck').hidden=mode!=='up';$a('au_t').textContent=mode==='in'?'Accedi':'Crea il tuo account';$a('au_h').textContent=mode==='in'?'Accedi per ritrovare i tuoi dati su ogni dispositivo.':'Con un account i tuoi dati restano al sicuro e sincronizzati tra i tuoi dispositivi.';$a('au_gl').textContent=mode==='in'?'Accedi':'Crea account';$a('au_sw').textContent=mode==='in'?'Crea un account':'Ho già un account';$a('au_p').autocomplete=mode==='in'?'current-password':'new-password';$a('au_fg').hidden=mode!=='in'};
  const say=(t,ok)=>{const m=$a('au_m');m.textContent=t||'';m.hidden=!t;m.style.color=ok?'#8ff0c4':''};
  $a('au_sw').onclick=()=>{if(mode==='new'){ltok='';mode='in';say('');paintAu();if(SB.has())document.documentElement.classList.remove('noauth');return}mode=mode==='in'?'up':'in';say('');paintAu()};
  const go=async()=>{const e=$a('au_e').value.trim().toLowerCase(),p=$a('au_p').value;say('');
   if(mode==='new'){if(p.length<8){say('La password deve avere almeno 8 caratteri.');return}const b=$a('au_go');b.disabled=true;try{await SB.linkPassword(ltok,p);ltok='';$a('au_p').value='';cloudStop();mode='in';paintAu();say('Password aggiornata: ora accedi con la nuova password.',true)}catch(x){say(SB.msg(x))}finally{b.disabled=false}return}
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)){say('Inserisci un’email valida.');return}
   if(p.length<8){say('La password deve avere almeno 8 caratteri.');return}
   {const w=lkWait();if(w>0){say('Troppi tentativi: riprova tra '+(w>60000?Math.ceil(w/60000)+' minuti':Math.ceil(w/1000)+' secondi')+'.');return}}
   if(TS_KEY&&!tsTok){say('Completa la verifica anti-bot qui sopra.');return}
   const b=$a('au_go');b.disabled=true;try{
    if(mode==='up'){if(!$a('au_ok').checked){say('Per creare l’account accetta i Termini d’uso e l’Informativa privacy.');return}const ok=await SB.signUp(e,p);if(!ok){say('Ti abbiamo inviato una email: conferma l’indirizzo dal link, poi accedi.',true);mode='in';paintAu();return}}
    else await SB.signIn(e,p);
    lkOk();$a('au_p').value='';await SB.alog('login');SB.enter(p)}catch(x){if(x&&x.code==='invalid_credentials')lkFail();say(SB.msg(x))}finally{b.disabled=false;if(TS_KEY)tsReset()}};
  $a('au_go').onclick=go;$a('au_p').onkeydown=ev=>{if(ev.key==='Enter')go()};
  $a('au_fg').onclick=async()=>{const e=$a('au_e').value.trim().toLowerCase();if(!e){say('Scrivi qui sopra la tua email, poi tocca di nuovo.');return}if(TS_KEY&&!tsTok){say('Completa la verifica anti-bot qui sopra.');return}try{await SB.recover(e);say('Se l’indirizzo è registrato, riceverai una email per scegliere una nuova password.',true)}catch(x){say(SB.msg(x))}finally{if(TS_KEY)tsReset()}};
  paintAu();
  if(SB.link){const L=SB.link;if(L.error)say(SB.msg({code:L.code||'access_denied'}));else if(L.type==='recovery'&&L.token){document.documentElement.classList.add('noauth');SB.linkUser(L.token).then(m=>{ltok=L.token;lmail=m||'il tuo account';mode='new';paintAu()}).catch(x=>say(SB.msg(x)))}else if(L.token)say('Email confermata: ora puoi accedere.',true)}
  /* pagina Account nelle impostazioni */
  const pg=h('div','sp');pg.dataset.sp='ac';pg.hidden=true;
  const f1=h('div','f');const em=h('div','hint');em.id='ac_em';const st=$('st_cstat');
  const bo=h('button','btn lbl');bo.type='button';bo.innerHTML=ICONS.user+' Esci da questo dispositivo';bo.style.marginTop='10px';
  const bd=h('button','btn lbl');bd.type='button';bd.innerHTML=ICONS.trash+' Elimina il mio account';bd.style.cssText='margin-top:10px;color:var(--danger)';
  const nt=h('div','hint','I dati sono salvati nel tuo account e restano sui tuoi dispositivi. Uscendo, i dati vengono rimossi da questo dispositivo ma restano nel tuo account. Eliminando l’account vengono cancellati per sempre, sul cloud e qui.');nt.style.marginTop='10px';
  const bl=h('button','btn lbl');bl.type='button';bl.innerHTML=ICONS.shield+' Accessi recenti';bl.style.marginTop='10px';
  const ll=h('div','hint');ll.hidden=true;ll.style.cssText='margin-top:8px;display:grid;gap:4px';
  bl.onclick=async()=>{if(!ll.hidden){ll.hidden=true;return}ll.hidden=false;ll.textContent='Carico…';try{const r=await SB.arecent();ll.textContent='';if(!r.length)ll.textContent='Nessun accesso registrato.';const me=SB.did();r.forEach(x=>{const d=new Date(x.created_at);ll.append(h('div','',d.toLocaleString('it-IT',{dateStyle:'short',timeStyle:'short'})+' · '+(x.device||'Dispositivo')+(x.kind==='login'?' · accesso':'')+(x.device_id===me?' · questo dispositivo':'')))});ll.append(h('div','','Se vedi un accesso che non riconosci, tocca «Esci da tutti i dispositivi» e cambia la password.'))}catch(e){ll.textContent='Non disponibile senza connessione.'}};
  const bx=h('button','btn lbl');bx.type='button';bx.innerHTML=ICONS.user+' Esci da tutti i dispositivi';bx.style.marginTop='10px';
  bx.onclick=()=>askConfirm('Uscire da tutti i dispositivi, compreso questo? Ovunque dovrai accedere di nuovo. I dati restano nel tuo account.','user','Esci ovunque',async()=>{try{await Promise.all(Object.keys(CSPEC).map(k=>cloudFlush(k)))}catch(e){}cloudStop();await SB.logoutAll();SB.wipe();SB.forget();location.reload()});
  const ce=h('div','hint');ce.id='ac_ce';ce.style.marginTop='12px';const b1=h('button','btn lbl');b1.type='button';b1.innerHTML=ICONS.shield+' Cambia passphrase';b1.style.marginTop='8px';b1.onclick=()=>E2EUI.show('c1');b1.hidden=true;const b2=h('button','btn lbl');b2.type='button';b2.innerHTML=ICONS.shield+' Nuova chiave di recupero';b2.style.marginTop='8px';b2.onclick=()=>askConfirm('Generare una nuova chiave di recupero? Quella attuale smette di funzionare.','shield','Genera',async()=>{try{E2EUI.showRk(await SB.e2e.newRecovery(),null)}catch(e){toast(SB.msg(e)||'Operazione non riuscita.')}});const b3=h('button','btn lbl p');b3.type='button';b3.innerHTML=ICONS.shield+' Attiva la cifratura';b3.style.marginTop='8px';b3.onclick=()=>{CLOUD.started=false;cloudGate()};
  window.paintE2=()=>{const r=SB.e2e.state()==='ready';ce.textContent=r?'Cifratura end-to-end attiva: i dati vengono cifrati su questo dispositivo con la tua password prima di andare nel cloud. Se la reimposti da un dispositivo nuovo ti serve la chiave di recupero.':'Cifratura non attiva su questo dispositivo: la sincronizzazione col cloud è in pausa. Esci e accedi di nuovo con la tua password per attivarla.';b1.hidden=true;b2.hidden=!r;b3.hidden=r};
  f1.append(h('label','','Account'),em,st,ce,b3,b1,b2,bl,ll,bx,bo,bd,nt);pg.append(f1);
  document.querySelector('#mSet .sp[data-sp=cl]').after(pg);
  SPG[0][1].push(['ac','user','Account',()=>SB.email()||'Non connesso']);SPN.ac='Account';
  /* pagina Utilizzo: quanto spazio sta usando l'utente e quanto ha a disposizione */
  const up=h('div','sp');up.dataset.sp='us';up.hidden=true;const uf=h('div','f');const ub=h('div');ub.style.cssText='display:grid;gap:14px;margin-top:8px';
  const fmt=n=>n>=1048576?(n/1048576).toFixed(n>=104857600?0:1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
  const bar=(t,txt,v,mx)=>{const p=Math.min(100,Math.round(v*100/mx)),d=h('div');const r=h('div','hint',t+' · '+txt);const tr=h('div');tr.style.cssText='height:8px;border-radius:99px;background:var(--line,#e4e8f2);overflow:hidden;margin-top:4px';const fi=h('div');fi.style.cssText='height:100%;border-radius:99px;width:'+Math.max(2,p)+'%;background:'+(p>=90?'var(--danger,#c0392b)':'var(--accent,#a6dcc8)');tr.append(fi);d.append(r,tr);return d};
  const paintUs=async()=>{ub.textContent='';ub.append(h('div','hint','Carico…'));try{const r=await SB.usage();ub.textContent='';
    ub.append(bar('Dati (clienti, lead, preventivi…)',fmt(r.data_bytes)+' di '+fmt(r.data_max),r.data_bytes,r.data_max),bar('Foto e allegati',fmt(r.files_bytes)+' di '+fmt(r.files_max)+' · '+r.files+' file',r.files_bytes,r.files_max),bar('Elementi salvati',r.rows+' di '+r.rows_max,r.rows,r.rows_max));
    ub.append(h('div','hint','Sono i limiti del tuo account nel cloud. Quando ti avvicini al limite, elimina ciò che non ti serve più: lo spazio si libera subito.'))}catch(e){ub.textContent='';ub.append(h('div','hint',e&&e.code==='offline'?'Non disponibile senza connessione.':'Dati di utilizzo non disponibili: accedi e riprova.'))}};
  uf.append(h('label','','Utilizzo'),ub);up.append(uf);pg.after(up);
  SPG[0][1].push(['us','chart','Utilizzo',()=>'Spazio usato e disponibile']);SPN.us='Utilizzo';
  /* pagina Aspetto: modelli di colore */
  const tpg=h('div','sp');tpg.dataset.sp='tp';tpg.hidden=true;const tf=h('div','f');const tl=h('div');tl.style.cssText='display:grid;gap:12px;margin-top:8px';
  const TPL=[['','Standard','Menta e lilla, evidenziature lilla, segue il tema chiaro o scuro del telefono.',['#f3f6fb','#fff','#a6dcc8','#d9d1f3']],['arancio','Classico arancio','Sempre chiaro, con i colori del logo in versione pastello: arancio, azzurro, ciano e viola su fondo bianco.',['#f8fbff','#ffcf9e','#bfe0f8','#dccfff']],['notte','Notte','Blu del logo con evidenziature ciano, sempre scuro.',['#001330','#0a2a52','#4fc3ff','#4fc3ff']],['neon','Neon','Blu notte con aloni di luce e pulsanti arancioni del logo, sempre scuro.',['#001330','#0a2a52','#ffa24d','#ffa24d']],['giorno','Giorno','Azzurro del logo, sempre chiaro.',['#eef4fb','#fff','#4fc3ff','#aadcff']]];
  const TPV=['arancio','notte','neon','giorno'];
  const curTpl=()=>{try{const v=localStorage.getItem('crm-tpl');return TPV.includes(v)?v:''}catch(e){return ''}};
  const setTpl=v=>{try{v?localStorage.setItem('crm-tpl',v):localStorage.removeItem('crm-tpl')}catch(e){}const d=document.documentElement;v?d.setAttribute('data-tpl',v):d.removeAttribute('data-tpl');applyFasi();const m=document.querySelector('meta[name=theme-color]');if(m)m.content=v==='giorno'?'#eef4fb':v==='notte'||v==='neon'?'#001330':v==='arancio'?'#bfe0f8':'#a6dcc8';paintTp()};
  const paintTp=()=>{tl.textContent='';const cur=curTpl();TPL.forEach(t=>{const b=h('button','');b.type='button';b.setAttribute('aria-pressed',String(cur===t[0]));
    b.style.cssText='display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:12px 14px;border-radius:18px;background:var(--surface);color:var(--ink);cursor:pointer;border:2px solid '+(cur===t[0]?'var(--act)':'var(--line)');
    const sw=h('span');sw.style.cssText='flex:none;width:64px;height:64px;border-radius:14px;padding:8px;display:grid;gap:5px;grid-template-rows:1fr 1fr;border:1px solid rgba(0,0,0,.12);background:'+t[3][0];
    const c1=h('span');c1.style.cssText='border-radius:6px;background:'+t[3][1];const c2=h('span');c2.style.cssText='display:flex;gap:5px';const d1=h('span');d1.style.cssText='flex:1;border-radius:6px;background:'+t[3][2];const d2=h('span');d2.style.cssText='flex:1;border-radius:6px;background:'+t[3][3];c2.append(d1,d2);sw.append(c1,c2);
    const tx=h('span');tx.style.cssText='flex:1;min-width:0;display:grid;gap:2px';const n=h('b','',t[1]);n.style.fontSize='16px';const ds=h('span','',t[2]);ds.style.cssText='font-size:13px;color:var(--muted)';tx.append(n,ds);
    b.append(sw,tx);if(cur===t[0]){const ck=h('span');ck.innerHTML=ICONS.check;ck.style.cssText='flex:none;width:26px;height:26px;color:var(--ink)';b.append(ck)}
    b.onclick=()=>setTpl(t[0]);tl.append(b)});tl.append(h('div','hint','La scelta vale solo su questo dispositivo.'))};
  tf.append(h('label','','Aspetto'),tl);tpg.append(tf);up.after(tpg);paintTp();
  SPG[0][1].push(['tp','layers','Aspetto','Modello di colore dell’app']);SPN.tp='Aspetto';
  const em0=setSp;setSp=function(k){if(k==='us')paintUs();if(k==='ac'){em.textContent='Connesso come '+(SB.email()||'—');try{paintE2()}catch(e){}}return em0.apply(this,arguments)};
  bo.onclick=()=>askConfirm('Uscire da questo dispositivo? I dati vengono rimossi da qui ma restano nel tuo account.','user','Esci',async()=>{try{await Promise.all(Object.keys(CSPEC).map(k=>cloudFlush(k)))}catch(e){}cloudStop();await SB.logout();SB.wipe();SB.forget();location.reload()});
  bd.onclick=()=>askConfirm('Eliminare definitivamente il tuo account? Clienti, opportunità, prodotti, foto e tutto il resto vengono cancellati dal cloud e da questo dispositivo. Non si può annullare.','trash','Elimina tutto',async()=>{try{cloudStop();await SB.removeAccount();SB.wipe();SB.forget();location.reload()}catch(e){toast('Eliminazione non riuscita: '+SB.msg(e))}});
  if(SB.has()){setTimeout(()=>{CLOUD.on=true;cloudGate()},600);try{const t=+localStorage.getItem('crm-lal')||0;if(Date.now()-t>432e5){localStorage.setItem('crm-lal',String(Date.now()));SB.alog('avvio')}}catch(e){}}else CLOUD.on=false}

/* ===== cifratura dei dati: schermate di attivazione e sblocco ===== */
const E2EUI=(()=>{
 const M=$('mE2E'),B=$('e2Box');let keys=new Set(),view='',rk='',ctx={},askRes=null;
 const MIN=10;
 const fld=(id,lab,type,ac)=>{const f=h('div','f'),l=h('label','',lab);l.setAttribute('for',id);const i=h('input');i.id=id;i.type=type||'password';i.autocomplete=ac||'off';i.autocapitalize='off';i.spellcheck=false;f.append(l,i);return f};
 const msg=()=>{const m=h('div','hint');m.id='e2m';m.style.cssText='min-height:20px;color:var(--danger);margin:6px 0';return m};
 const say=t=>{const m=$('e2m');if(m)m.textContent=t||''};
 const btn=(txt,ic,cls,fn)=>{const b=h('button','btn lbl'+(cls?' '+cls:''));b.type='button';b.innerHTML=(ic?ICONS[ic]+' ':'')+txt;b.onclick=fn;b.style.marginTop='8px';b.style.width='100%';return b};
 const lnk=(txt,fn)=>{const b=h('button','','');b.type='button';b.textContent=txt;b.style.cssText='background:none;border:0;color:inherit;text-decoration:underline;padding:10px 0 0;font-size:14px;display:block;margin:0 auto';b.onclick=fn;return b};
 const busy=async(b,fn)=>{b.disabled=true;try{await fn()}catch(e){say(SB.msg(e)||'Operazione non riuscita.')}finally{b.disabled=false}};
 const okPass=(p,q)=>{if(p.length<MIN){say('La passphrase deve avere almeno '+MIN+' caratteri.');return false}if(p!==q){say('Le due passphrase non coincidono.');return false}return true};
 function frame(title,txt){B.textContent='';const t=h('h3','',title);t.style.margin='0 0 8px';B.append(t);if(txt){const p=h('p','hint',txt);p.style.margin='0 0 10px';B.append(p)}}
 const fin2=async()=>{if(ctx.pw)await SB.e2e.setPass(ctx.pw);M.hidden=true;const d=ctx.done;ctx={};if(d)d();else{CLOUD.started=false;cloudGate()}};
 function recKey(){const k=h('div','');k.id='e2k';k.textContent=rk.slice(0,19)+'\n'+rk.slice(20);k.style.cssText='white-space:pre;font:600 17px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.04em;text-align:center;padding:14px 8px;border:1px dashed var(--out);border-radius:12px;word-break:break-all;user-select:all;-webkit-user-select:all';B.append(k);
  const go=btn('Fatto, l’ho salvata','check','p',()=>{if(go.disabled)return;try{localStorage.removeItem('crm-rk-pending')}catch(e){}rk='';M.hidden=true;const d=ctx.done;ctx={};if(d)d();else toast('Chiave di recupero salvata.')});
  go.disabled=true;go.style.marginTop='14px';
  const hint=h('div','hint','Per continuare scegli almeno uno dei modi qui sopra per conservarla.');hint.id='e2hint';hint.style.cssText='text-align:center;margin-top:10px';
  const ok=m=>{go.disabled=false;hint.textContent=m;hint.style.color='var(--ok,#1d7a4d)'};
  const row=h('div','two');row.style.marginTop='10px';
  const cp=btn('Copia','clip','',async()=>{try{await navigator.clipboard.writeText(rk);ok('Chiave copiata: incollala in un posto sicuro prima di chiudere.');toast('Chiave copiata.')}catch(e){toast('Copia non riuscita: seleziona e copia a mano, oppure scaricala.')}}),
   dl=btn('Scarica','download','',()=>{try{const a=h('a');a.href=URL.createObjectURL(new Blob(['KRANG CRM - chiave di recupero\n'+SB.email()+'\n\n'+rk+'\n\nConservala in un posto sicuro: se reimposti la password da un dispositivo nuovo, serve per riaprire i dati cifrati.\n'],{type:'text/plain'}));a.download='krang-crm-chiave-recupero.txt';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);ok('File scaricato: conservalo fuori dal telefono.')}catch(e){toast('Download non disponibile: copia la chiave.')}});
  row.style.marginTop='10px';row.append(cp,dl);B.append(row);
  const pm=btn('Salva nel gestore di password','shield','',async()=>{let done=false;
   try{if(window.PasswordCredential&&navigator.credentials&&navigator.credentials.store){await navigator.credentials.store(new PasswordCredential({id:SB.email()||'krang-crm',password:rk,name:'KRANG CRM · chiave di recupero'}));done=true}}catch(e){}
   if(!done){try{/* altri browser: un modulo nascosto che il gestore di password propone di salvare */
    const f=h('form');f.method='post';f.action='about:blank';f.target='e2pmf';f.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';
    let fr=document.getElementById('e2pmf');if(!fr){fr=h('iframe');fr.name=fr.id='e2pmf';fr.style.display='none';document.body.append(fr)}
    const u=h('input');u.type='text';u.name='username';u.autocomplete='username';u.value=(SB.email()||'krang-crm')+' · chiave di recupero KRANG CRM';const p=h('input');p.type='password';p.name='password';p.autocomplete='new-password';p.value=rk;f.append(u,p,Object.assign(h('button'),{type:'submit'}));document.body.append(f);f.requestSubmit?f.requestSubmit():f.submit();setTimeout(()=>f.remove(),1500);done=true}catch(e){}}
   if(done)ok('Se il telefono te lo propone, conferma il salvataggio. Controlla poi di averla trovata nel gestore: altrimenti copiala o scaricala.');else toast('Non disponibile qui: copia o scarica la chiave.')});
  B.append(pm,hint,go)}
 function show(v){view=v;M.hidden=false;
  if(v==='s0'){frame('Proteggi i tuoi dati','Per proteggere i tuoi dati con la cifratura serve la tua password. Esci e accedi di nuovo: la protezione si attiva da sola e non devi scegliere nient’altro. Finché non lo fai, il cloud resta in pausa.');
   const go=btn('Esci e accedi di nuovo','user','p',async()=>{M.hidden=true;cloudStop();try{await SB.logout()}catch(e){}location.reload()});B.append(go,lnk('Più tardi',()=>{M.hidden=true}))}
  else if(v==='r3'){frame('La tua chiave personale','Nessun altro, nemmeno noi, può leggere i tuoi clienti: i tuoi dati sono cifrati e solo tu hai la chiave. Questa chiave di recupero è la tua garanzia: ti permette di riaprire i dati anche se cambi telefono e dimentichi la password. Custodiscila bene: senza di lei, in quel caso, nemmeno noi possiamo aiutarti. Non verrà mostrata di nuovo.');recKey()}
  else if(v==='b1'){frame(ctx.bt||'Backup cifrato',ctx.bx||'');B.append(fld('e2p',ctx.bl||'Password','password','current-password'),msg());
   const fin=v=>{M.hidden=true;const r=askRes;askRes=null;if(r)r(v)};
   const go=btn('Apri','check','p',()=>{const v=$('e2p').value;if(!v){say('Scrivi la password.');return}fin(v)});B.append(go,lnk('Annulla',()=>fin(null)));$('e2p').onkeydown=e=>{if(e.key==='Enter')go.click()}}
  else if(v==='s1'){frame('Proteggi i tuoi dati','I tuoi dati vengono cifrati sul tuo dispositivo prima di andare nel cloud: nessuno, nemmeno chi gestisce l’app, può leggerli. Scegli una passphrase: ti servirà per aprire i dati su un nuovo dispositivo. Se la perdi e non hai la chiave di recupero, i dati nel cloud non si possono recuperare.');
   B.append(fld('e2p','Passphrase (almeno '+MIN+' caratteri)','password','new-password'),fld('e2q','Ripeti la passphrase','password','new-password'),msg());
   const go=btn('Continua','check','p',()=>busy(go,async()=>{const p=$('e2p').value;if(!okPass(p,$('e2q').value))return;say('');rk=await SB.e2e.setupPrepare(p);show('s2')}));B.append(go,lnk('Non ora',()=>{M.hidden=true;toast('Il cloud resta in pausa finché non attivi la cifratura (Impostazioni → Account).')}))}
  else if(v==='s2'||v==='r2'){frame('Chiave di recupero','Salvala in un posto sicuro (gestore password, foglio stampato). È l’unico modo per riavere i dati se dimentichi la passphrase. Non verrà mostrata di nuovo.');
   const k=h('div','');k.id='e2k';k.textContent=rk.slice(0,19)+'\n'+rk.slice(20);k.style.cssText='white-space:pre;font:600 17px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.04em;text-align:center;padding:14px 8px;border:1px dashed var(--out);border-radius:12px;word-break:break-all;user-select:all;-webkit-user-select:all';B.append(k);
   const row=h('div','two');row.style.marginTop='6px';
   const cp=btn('Copia','clip','',async()=>{try{await navigator.clipboard.writeText(rk);toast('Chiave copiata.')}catch(e){toast('Copia non riuscita: seleziona e copia a mano.')}}),dl=btn('Scarica','download','',()=>{try{const a=h('a');a.href=URL.createObjectURL(new Blob(['KRANG CRM - chiave di recupero\n'+SB.email()+'\n\n'+rk+'\n\nConservala in un posto sicuro: senza passphrase e senza questa chiave i dati cifrati non si recuperano.\n'],{type:'text/plain'}));a.download='krang-crm-chiave-recupero.txt';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}catch(e){toast('Download non riuscito.')}});
   row.append(cp,dl);B.append(row);
   const lb=h('label','chk');const ck=h('input');ck.type='checkbox';ck.id='e2ck';lb.append(ck,h('span','','Ho salvato la chiave di recupero in un posto sicuro'));lb.style.cssText='display:flex;gap:10px;align-items:flex-start;margin:12px 0 4px;font-size:14px';B.append(lb,msg());
   const go=btn(v==='s2'?'Attiva la cifratura':'Fatto','check','p',()=>busy(go,async()=>{if(!ck.checked){say('Conferma di aver salvato la chiave.');return}
    if(v==='s2'){try{await SB.e2e.setupCommit()}catch(e){if(e.code==='exists'){rk='';M.hidden=true;CLOUD.started=false;cloudGate();return}throw e}rk='';M.hidden=true;toast('Cifratura attivata: sto cifrando i tuoi dati…');CLOUD.started=false;cloudGate()}else{rk='';M.hidden=true;toast('Nuova chiave di recupero salvata.')}}));B.append(go)}
  else if(v==='u1'){frame('Sblocca i tuoi dati','I dati di questo account sono cifrati con la password che avevi quando li hai creati. Se l’hai reimpostata, inserisci quella di prima oppure usa la chiave di recupero.');
   B.append(fld('e2p','Password precedente','password','current-password'),msg());
   const go=btn('Sblocca','check','p',()=>busy(go,async()=>{await SB.e2e.unlock($('e2p').value);await fin2()}));B.append(go,lnk('Ho la chiave di recupero',()=>show('u2')),lnk('Non ricordo né la password né la chiave',()=>show('u3')));$('e2p').onkeydown=e=>{if(e.key==='Enter')go.click()}}
  else if(v==='u2'){frame('Chiave di recupero','Inserisci la chiave di recupero (32 caratteri a gruppi di 4). Dopo ti farò scegliere una nuova password.');
   B.append(fld('e2p','Chiave di recupero','text','off'),msg());
   const go=btn('Continua','check','p',()=>busy(go,async()=>{await SB.e2e.unlockRecovery($('e2p').value);if(ctx.pw)await fin2();else show('u4')}));B.append(go,lnk('Indietro',()=>show('u1')))}
  else if(v==='u4'){frame('Nuova passphrase','Scegli una nuova passphrase per questo account.');
   B.append(fld('e2p','Nuova passphrase (almeno '+MIN+' caratteri)','password','new-password'),fld('e2q','Ripeti la passphrase','password','new-password'),msg());
   const go=btn('Salva','check','p',()=>busy(go,async()=>{const p=$('e2p').value;if(!okPass(p,$('e2q').value))return;await SB.e2e.setPass(p);M.hidden=true;toast('Passphrase aggiornata.');CLOUD.started=false;cloudGate()}));B.append(go)}
  else if(v==='u3'){frame('Ricominciare da zero','Senza passphrase e senza chiave di recupero i dati nel cloud non si possono leggere. Puoi eliminarli e ricominciare con la cifratura: perdi tutti i dati cloud di questo account (quelli ancora presenti su un dispositivo già sbloccato restano lì). Scrivi ELIMINA per confermare.');
   B.append(fld('e2p','Conferma','text','off'),msg());
   const go=btn('Elimina i dati cloud','trash','',()=>busy(go,async()=>{if($('e2p').value.trim()!=='ELIMINA'){say('Scrivi ELIMINA per confermare.');return}await SB.e2e.reset();show('s1')}));go.style.color='var(--danger)';B.append(go,lnk('Indietro',()=>show('u1')))}
  else if(v==='c1'){frame('Cambia passphrase');
   B.append(fld('e2c','Passphrase attuale','password','current-password'),fld('e2p','Nuova passphrase (almeno '+MIN+' caratteri)','password','new-password'),fld('e2q','Ripeti la nuova passphrase','password','new-password'),msg());
   const go=btn('Salva','check','p',()=>busy(go,async()=>{const p=$('e2p').value;if(!okPass(p,$('e2q').value))return;await SB.e2e.changePass($('e2c').value,p);M.hidden=true;toast('Passphrase aggiornata.')}));B.append(go,lnk('Annulla',()=>{M.hidden=true}))}
  else if(v==='c2'){frame('Nuova chiave di recupero','La chiave attuale smette di funzionare. Inserisci la passphrase per generarne una nuova.');
   B.append(fld('e2c','Passphrase','password','current-password'),msg());
   const go=btn('Genera','check','p',()=>busy(go,async()=>{rk=await SB.e2e.newRecovery($('e2c').value);show('r2')}));B.append(go,lnk('Annulla',()=>{M.hidden=true}))}
  setTimeout(()=>{const f=$('e2p')||$('e2c');if(f&&view!=='s2'&&view!=='r2')try{f.focus()}catch(e){}},50)}
 return{open:(st,c)=>{ctx=c||{};show(st==='none'?'s0':'u1')},showRk:(k,done)=>{rk=k;ctx={done};try{localStorage.setItem('crm-rk-pending','1')}catch(e){}show('r3')},ask:o=>new Promise(r=>{askRes=r;ctx=o||{};show('b1')}),close:()=>{if(view==='s1'||view==='u1'||view==='u2'||view==='u3'||view==='u4')M.hidden=true},show,reset:()=>{keys=new Set()},
  done:k=>{keys.add(k);if(['cl','op','pr','mv','ld','s'].every(x=>keys.has(x))){if(CLOUD.err)return;SB.e2e.setMig();SB.e2e.cleanup().catch(()=>{});toast('I tuoi dati sono cifrati.')}}}})();
/* ===== info e versione ===== */
{const rd=t=>{const m=/name="app-version" content="([^"|]+)\|([^"]+)"/.exec(t);return m?{v:m[1],d:m[2]}:null},cur=rd('<meta name="app-version" content="'+(document.querySelector('meta[name=app-version]')||{content:''}).content+'">')||{v:'?',d:''};
 const dl=d=>{const p=String(d).split('-');return p.length===3?(+p[2])+' '+['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'][+p[1]-1]+' '+p[0]:d};
 const M=$('mInfo');let newer=false;try{$('au_v').textContent='KRANG CRM · versione '+cur.v}catch(e){}
 $('inX').onclick=()=>{M.hidden=true};M.onclick=e=>{if(e.target===M)M.hidden=true};
 $('inU').onclick=async()=>{const b=$('inU');b.disabled=true;try{if(navigator.serviceWorker)for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();if(window.caches)for(const k of await caches.keys())await caches.delete(k)}catch(e){}location.reload()};
 window.openInfo=async()=>{$('inV').textContent='Versione '+cur.v;$('inD').textContent='Aggiornata il '+dl(cur.d);const st=$('inS'),u=$('inU');st.textContent='Controllo aggiornamenti…';u.hidden=true;M.hidden=false;
  try{const r=await fetch(location.href.split('#')[0].split('?')[0]+'?c='+Date.now(),{cache:'no-store'});const n=rd(await r.text());
   if(!n)st.textContent='Non riesco a leggere la versione online.';else if(n.v!==cur.v||n.d!==cur.d){st.textContent='Disponibile la versione '+n.v+' del '+dl(n.d)+'. Tocca Aggiorna per installarla.';u.hidden=false}else st.textContent='Hai l’ultima versione.'}
  catch(e){st.textContent='Controllo non riuscito: sei offline?'}}}

/* ===== note di rilascio (una per ogni major, con le novità di ogni minor) ===== */
window.RELEASES=[{major:1,titolo:'Versione 1',intro:'Dalla prima pubblicazione (1.0) a oggi. Ad ogni nuova major questo elenco viene affiancato da uno nuovo.',minor:[
['1.1','Revisione di sicurezza: protezione dei contenuti, link di accesso, PIN e immagini; nuova icona, nome KRANG CRM e schermata di blocco nello stile dell’accesso.'],
['1.2','Scansione gratuita del biglietto da visita (lettura del testo sul telefono), riconoscimento del cliente già presente, app vergine al primo avvio e dati di esempio più ricchi.'],
['1.3','Biglietto da visita: avviso di salvataggio, lettura in due passaggi, assegnazione dei campi migliorata.'],
['1.4','Biglietto da visita: revisione guidata con trascinamento, due lati e nome più affidabile.'],
['1.5','Pagine Informativa privacy e Termini d’uso, consenso alla registrazione.'],
['1.6','Cifratura end-to-end dei dati (passphrase e chiave di recupero, foto cifrate); invio e lettura Gmail direttamente dal telefono, senza permessi aggiuntivi.'],
['1.7','Posta senza permessi, guida di benvenuto e impostazioni più pulite.'],
['1.8','Registro chiamate per clienti e lead (elenco, registra, richiama), scheda Contatti e menu a icone senza sovrapposizioni.'],
['1.9','Data e utente di creazione e di ultimo aggiornamento di ogni record, inclusi nel backup.'],
['1.10','Brochure e listino nelle email, listino per cliente, salvataggio per voce, guide con icona (i), icona bussola per i Primi passi.'],
['1.11','Sezione Aiuto nel menu con Primi passi e manuale.'],
['1.12','Assistente in chat dentro Aiuto, con risposte dal manuale.'],
['1.13','Pollice su/giù sulle risposte dell’Assistente.'],
['1.14','Feedback dell’Assistente con domanda ripulita da email e numeri.'],
['1.15','Accessi più sicuri: anti-bot, blocco dei tentativi, registro accessi, esci da tutti i dispositivi.'],
['1.16','Sezione Utilizzo con il consumo per utente e tetto di 100 MB sui file.'],
['1.17','Assistente con screenshot dei passaggi e istruzioni per gli Acquisti del cliente.'],
['1.18','Elementi attivi evidenziati con l’arancione del logo.'],
['1.19','Modelli di colore in Impostazioni › Aspetto: Standard (predefinito), Classico arancio (chiaro con colori pastello del logo), Notte, Neon e Giorno.'],
['1.20','Assistente con intelligenza artificiale gratuita (Google Gemini): risponde in base alle guide dell’app, senza vedere i tuoi dati; se non è disponibile usa le guide locali. Badge delle schede attive più leggibili; etichetta Beta su Analytics e Marketing.'],
['1.21','Registro degli errori applicativi per il gestore (solo testo tecnico ripulito, mai dati dei clienti); Privacy e Termini dentro Info; note di rilascio.'],
['1.22','Ricerca online della partita IVA (VIES, servizio gratuito dell’Unione Europea): compila ragione sociale e indirizzo dopo la tua conferma; contatore degli utenti online nel monitor del gestore.'],
['1.23','Suggerimenti per le aziende dal nome: Wikidata e OpenStreetMap e, se non trovano nulla, una ricerca Google. Scegli il risultato e compili sito, telefono, email, indirizzo e partita IVA dopo la tua conferma.'],
['1.24','Tasto Salva in fondo alle schede: compare solo quando il record è nuovo o modificato (clienti, lead, opportunità, prodotti, preventivi, impostazioni e editor di marketing e listini).'],
['1.25','La scheda lead ha gli stessi campi della scheda cliente (partita IVA e PEC per le aziende, ruolo, data di nascita, sito, indirizzo, note) e li porta nel cliente alla conversione.'],
['1.26','Scheda Privacy: in alto lo stato attuale in sola lettura (informativa, consensi, conservazione) e «Dettagli e modifica manuale» sempre chiuso all’apertura.'],
['1.27','«Conserva i dati fino al» si compila da solo con la scadenza delle regole di conservazione (modificabile a mano). Nuova gestione delle richieste di anonimizzazione: registrazione con scadenza di un mese, email di conferma, anonimizzazione con avvisi su opportunità e dati contabili, promemoria e elenco nella Revisione conservazione.']
['1.27.1','Il tasto Salva in fondo ora compare anche nel tab Privacy (e negli altri tab della scheda cliente) quando modifichi qualcosa. La scadenza di conservazione calcolata in automatico non mostra più la spunta verde: è solo una proposta, non un’azione già svolta.'],
['1.28','Cerca azienda online: se il risultato scelto ha un sito web, l’app cerca la partita IVA nelle pagine del sito (home, contatti, privacy) e la controlla con VIES prima di proporla. Se la ragione sociale ufficiale è diversa da quella scelta, ti avvisa.'],
['1.28.1','Cerca azienda online: quando non trova nulla, il messaggio spiega perché (le piccole aziende spesso non sono nelle fonti gratuite) e suggerisce di aggiungere la città.'],
['1.28.2','Ottimizzazioni interne: il controllo del tasto Salva non lascia più timer attivi quando una scheda si chiude, l’aggiornamento dei badge è meno frequente (più leggero con molti clienti) ed è stato tolto del codice non usato.'],
['1.29','Dati di esempio molto più ricchi: tre dimensioni (piccolo, medio e stress test fino a 1.000 clienti e 1.500 opportunità), catalogo di 38 prodotti con magazzino e giacenze, 6 listini per nazione con sconti a scaglioni, lead e messaggi. Le email sono tutte su yopmail.com e non ci sono numeri di telefono.'],
['1.29.1','Dati di esempio: la quantità si sceglie con uno slider (da 100 a 1.500 clienti, a blocchi di 100); lead e opportunità seguono in proporzione.'],
['1.30','Scorri con il dito a destra o a sinistra per passare da un tab all’altro: tra Home, Clienti, Lead e Opportunità, tra le sezioni della scheda cliente e della scheda lead (Dati, Privacy, ecc.) e tra le sezioni dei Prodotti. Non scatta sui campi di testo, sulle liste che scorrono in orizzontale o quando c’è una finestra aperta.'],
['1.30.1','Nella scheda cliente e nella scheda lead, scorrere verso destra dal primo tab equivale alla freccia indietro: se ci sono modifiche l’app chiede se salvarle, scartarle o restare.'],
['1.30.2','Scorrere verso destra in qualsiasi scheda (prodotto, opportunità, listino, impostazioni, ecc.) equivale alla freccia indietro, con la richiesta di salvare se ci sono modifiche.'],
['1.31','Assistente: la freccia per inviare il messaggio è allineata al campo di testo. In tutte le pagine tranne la Home (Clienti, Lead, Opportunità, Prodotti, Marketing, Analytics) compare, accanto al menu, la freccia indietro che riporta alla Home. Anche scorrere verso destra dalla prima sezione di Prodotti, da Marketing e da Analytics riporta alla Home.'],
['1.31.1','Correzioni dopo la revisione. Scorrere una riga di Clienti o Lead per mostrarne le azioni non cambia più scheda. In Marketing scorrere passa tra Segmenti e Campagne. Dopo “Cerca dati online” e Annulla la scheda non risulta più modificata, e i risultati di una ricerca non finiscono su un altro cliente. La finestra “modifiche non salvate” porta il focus sul pulsante e si chiude con Esc. Privacy: testi corretti e avviso se la scadenza di conservazione è già passata. Pulsanti dell’intestazione più grandi. In tutti i campi password e PIN (accesso, passphrase, backup, PIN di emergenza) c’è l’occhietto per mostrare o nascondere quanto scritto. A ogni accesso l’app controlla se esiste una versione più recente e ti avvisa, così puoi aggiornare con un tocco. “Rimuovi esempi” toglie anche le opportunità (e i movimenti di magazzino) che hai creato sui clienti di esempio, e il numero di lead di esempio resta quello annunciato.'],
['1.32','Cifratura dei dati trasparente. I dati nel cloud sono cifrati in automatico con la password del tuo account: niente passphrase da scegliere. Alla creazione dell’account ti viene mostrata una chiave di recupero personale, da conservare subito (copia, scarica o salva nel gestore di password); se chiudi l’app prima, ne viene generata una nuova al prossimo avvio. Puoi rigenerarla da Impostazioni → Account. Se reimposti la password da un dispositivo già collegato, la protezione si aggiorna da sola; da un dispositivo nuovo serve la chiave di recupero. Chi non aveva la cifratura la attiva al prossimo accesso con la password. I backup sono cifrati con la stessa password dell’account: sparisce la password dei backup dedicata. I vecchi backup si riaprono chiedendo la vecchia password.'],
]}];
{let M=null;window.openRel=()=>{if(!M){M=document.createElement('div');M.className='modal';M.id='mRel';document.body.append(M);M.onclick=e=>{if(e.target===M)M.hidden=true}}
 M.textContent='';const bx=h('div','box');bx.style.cssText='max-height:80vh;overflow:auto';bx.append(h('h3','','Note di rilascio'));
 RELEASES.slice().reverse().forEach(r=>{bx.append(h('h4','',r.titolo));bx.append(h('p','hint',r.intro));const ul=h('ul');ul.style.cssText='padding-left:18px;margin:6px 0 12px';r.minor.slice().reverse().forEach(([v,t])=>{const li=h('li');li.style.margin='6px 0';li.append(h('b','',v+' '),document.createTextNode(t));ul.append(li)});bx.append(ul)});
 const c=h('button','btn');c.type='button';c.textContent='Chiudi';c.onclick=()=>{M.hidden=true};bx.append(c);M.append(bx);M.hidden=false}
 const n=$('inN');if(n)n.onclick=()=>{$('mInfo').hidden=true;openRel()}}
/* ===== scansione del biglietto da visita (lettura del testo sul telefono, gratuita) ===== */
const CARD=(()=>{
 const TITLES=/^(dott\.?ssa|dott\.?|dr\.?|ing\.?|avv\.?|arch\.?|geom\.?|rag\.?|prof\.?ssa|prof\.?|sig\.?ra|sig\.?|mr\.?|mrs\.?|ms\.?)\s+/i;
 const ROLE=/\b(ceo|cfo|coo|cto|titolare|direttore|direttrice|responsabile|amministratore|presidente|socio|manager|sales|commerciale|agente|consulente|export|marketing|buyer|owner|founder|director|head of|account|enologo|sommelier|project|general manager|partner|legale rappresentante|ufficio|proprietario|gestore|chef|maitre|maître|rappresentante|promotore|procuratore|avvocato|architetto|ingegnere|geometra|notaio|commercialista|vendite|acquisti|logistica|amministrazione|direzione|area manager|key account|segreteria|assistant|specialist|coordinator|coordinatore|coordinatrice)\b/i;
 const COMP=/(\bs\.?r\.?l\.?s?\b|\bs\.?p\.?a\.?\b|\bs\.?n\.?c\.?\b|\bs\.?a\.?s\.?\b|\bs\.?s\.?\b|societ[àa]|cantina|azienda|ditta|studio|& ?c\.?\b|\bgroup\b|\bltd\b|\bgmbh\b|\binc\b|\bllc\b|\bsrl\b|vini|tenuta|fattoria|consorzio|cooperativa|hotel|albergo|locanda|enoteca|vineria|ristorante|trattoria|osteria|pizzeria|bistrot|agriturismo|resort|boutique|pasticceria|gastronomia|catering|eventi|caff[èe]|\bbar\b|b&b|wine|winery|distribuzione|import|export srl|commerciale s)/i;
 const STREET=/\b(via|viale|v\.le|piazza|p\.zza|corso|c\.so|strada|largo|vicolo|localit[àa]|loc\.|contrada|c\.da|piazzale|lungomare|borgo|vico|salita|str\.)\s/i;
 const PART=['de','di','del','della','dello','dei','degli','dal','dalla','da','la','lo','le','van','von','mc','mac','d\'','dell\''];
 const cap=w=>w.length?w[0].toUpperCase()+w.slice(1).toLowerCase():w;
 const LOWP=['del','della','dello','dei','degli','delle','di','da','de','e','&','and','the'];
 const fixCase=s=>s.split(/\s+/).map((w,i)=>/^[A-ZÀ-Ý'’.-]{2,}$/.test(w)?(i>0&&LOWP.includes(w.toLowerCase())?w.toLowerCase():w.split(/(['’-])/).map(cap).join('')):w).join(' ');
 const lev=(a,b)=>{const m=[];for(let i=0;i<=a.length;i++){m[i]=[i];for(let j=1;j<=b.length;j++)m[i][j]=i?0:j}for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]};
 const FREE=/^(gmail|googlemail|yahoo|hotmail|outlook|libero|virgilio|tiscali|alice|icloud|me|live|msn|aruba|fastweb|tin|email|inwind|iol|yopmail|pec)\./i;
 const fixNum=l=>l.replace(/[\d+(][\dOoIl\s().\/-]{6,}/g,m=>m.replace(/[Oo]/g,'0').replace(/[Il]/g,'1'));
 const grp=n=>{const d=n.replace(/\D/g,'');if(!/^3\d{8,9}$/.test(d))return n;return d.length===10?d.replace(/^(\d{3})(\d{3})(\d{4})$/,'$1 $2 $3'):d.replace(/^(\d{3})(\d{3})(\d{3})$/,'$1 $2 $3')};
 const dialIso=n=>{const m=n.replace(/[^\d+]/g,'');if(!m.startsWith('+'))return null;let best=null;COUNTRIES.forEach(c=>{const d=String(c[2]);if(m.startsWith(d)&&(!best||d.length>String(best[2]).length))best=c});return best};
 function parse(raw){
  const lines=String(raw||'').replace(/\(at\)|\[at\]/gi,'@').replace(/(\w)\s?[©®]\s?(\w)/g,'$1@$2').split(/\r?\n/).map(l=>fixNum(l.replace(/[|¦_•·►▶■□]/g,' ').replace(/\s+/g,' ').trim().replace(/^[^\w\u00C0-\u00FF+(@]+/,''))).filter(l=>l.length>1);
  const used=new Set(),out={},extra=[];let addrSure=false,compSure=false,nameSure=false;
  const text=lines.join('\n');
  // email
  const mails=[...new Set((text.match(/[A-Za-z0-9._%+-]+\s?@\s?[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)||[]).map(m=>m.replace(/\s+/g,'').toLowerCase()))];
  const pec=mails.find(m=>/pec|legalmail/.test(m)),normal=mails.filter(m=>m!==pec);
  if(normal[0])out.email=normal[0];if(pec)out.pec=pec;extra.push(...normal.slice(1));
  lines.forEach((l,i)=>{if(/@/.test(l))used.add(i)});
  // partita iva
  let pi=/(?:p\.?\s?iva|partita\s+iva|vat|p\.?\s?i\.?)\s*[:.]?\s*(?:IT)?\s*(\d[\d\s]{9,13}\d)/i.exec(text);
  if(pi){const d=pi[1].replace(/\s/g,'');if(d.length===11){out.piva=d;lines.forEach((l,i)=>{if(/p\.?\s?iva|partita\s+iva|\bvat\b/i.test(l)&&l.replace(/\D/g,'').includes(d))used.add(i)})}}
  // sito web
  const mailHosts=mails.map(m=>m.split('@')[1]);
  const noMail=text.replace(/[A-Za-z0-9._%+-]+\s?@\s?[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,' ');
  const web=(noMail.match(/\b(?:https?:\/\/)?(?:www\.)[A-Za-z0-9.-]+\.[A-Za-z]{2,}[^\s,;]*|\b[A-Za-z0-9-]+\.(?:it|com|net|org|eu|info|biz|wine|vin)\b(?![A-Za-z0-9@])/gi)||[]).map(w=>w.replace(/[.,;)]+$/,'')).filter(w=>!/^(pec|legalmail)\./i.test(w));
  if(web[0])out.sito=web[0].replace(/^https?:\/\//i,'').toLowerCase();
  lines.forEach((l,i)=>{if(/@/.test(l))return;if(/(?:https?:\/\/|www\.)/i.test(l)||(out.sito&&l.toLowerCase().includes(out.sito.replace(/^www\./,''))))used.add(i)});
  // telefoni
  const phones=[];
  lines.forEach((l,i)=>{if(used.has(i)&&/@/.test(l))return;const lab=/\bfax\b/i.test(l)&&!/\b(tel|t\.|mob|cell|m\.)\b/i.test(l);
   const re=/(?:\+|00)?\s?\(?\d{1,4}\)?[\d\s().\/-]{6,}\d/g;let m;
   while((m=re.exec(l))){let n=m[0].trim();const dg=n.replace(/\D/g,'');if(dg.length<8||dg.length>15)continue;if(out.piva&&dg.includes(out.piva))continue;if(/\b\d{5}\b/.test(n)&&dg.length===5)continue;
    if(out.piva&&dg===out.piva)continue;phones.push({n:n.replace(/^00/,'+').replace(/\s+/g,' '),dg,fax:lab,line:i})}});
  const good=phones.filter(p=>!p.fax);
  const isMob=p=>/^(\+?39)?\s?3\d{8,9}$/.test(p.dg.replace(/^0039/,'39'))||/^\+?39?3\d/.test(p.dg)&&p.dg.replace(/^39/,'').length>=9&&p.dg.replace(/^39/,'')[0]==='3';
  const main=good.find(isMob)||good[0]||phones[0];
  if(main){let n=main.n,iso=null;const c=dialIso(n);if(c){iso=c[0];const d=String(c[2]);n=n.replace(/[^\d+]/g,'').slice(d.length).replace(/^0+(?=\d{6})/,'');if(iso!=='IT')n=n}
   out.telefono=grp(n);if(iso)out.paese=iso;used.add(main.line)}
  phones.filter(p=>p!==main).forEach(p=>extra.push((p.fax?'Fax ':'Tel ')+p.n));
  phones.forEach(p=>used.add(p.line));
  // indirizzo
  const ai=lines.findIndex((l,i)=>STREET.test(l)&&!used.has(i));let addr=[];
  if(ai>=0){addrSure=true;addr.push(lines[ai]);used.add(ai);const nx=lines[ai+1];if(nx&&/\b\d{5}\b/.test(nx)&&!used.has(ai+1)){addr.push(nx);used.add(ai+1)}}
  else{const ci=lines.findIndex((l,i)=>/\b\d{5}\b/.test(l)&&!/\b\d{11}\b/.test(l)&&!used.has(i)&&!/\d{3}[\s.-]\d{3}/.test(l));if(ci>=0){if(ci>0&&!used.has(ci-1)&&/\d/.test(lines[ci-1])&&!ROLE.test(lines[ci-1])){addr.push(lines[ci-1]);used.add(ci-1)}addr.push(lines[ci]);used.add(ci)}}
  if(addr.length)out.indirizzo=addr.join(', ').replace(/\s+,/g,',');
  // ruolo
  const ri=lines.findIndex((l,i)=>!used.has(i)&&ROLE.test(l)&&!/\d{4}/.test(l)&&l.length<60);if(ri>=0){out.ruolo=lines[ri];used.add(ri)}
  // azienda
  let ci=lines.findIndex((l,i)=>!used.has(i)&&COMP.test(l)&&l.length<70);compSure=ci>=0;
  const core=out.email&&!FREE.test(out.email.split('@')[1])?out.email.split('@')[1].split('.')[0].replace(/[^a-z0-9]/g,''):(out.sito&&!FREE.test(out.sito.replace(/^www\./,''))?out.sito.replace(/^www\./,'').split('.')[0].replace(/[^a-z0-9]/g,''):'');
  if(core.length>=4){const dl=lines.findIndex((l,i)=>{if(used.has(i)||i===ri)return false;const t=l.toLowerCase().replace(/[^a-z0-9]/g,'');return t.length>=4&&(t===core||t.includes(core)||core.includes(t))&&!/@|\d{4}/.test(l)&&!STREET.test(l)});if(dl>=0&&(ci<0||dl!==ci)&&!(out.nome&&lines[dl].toLowerCase().includes(out.nome.toLowerCase())&&lines[dl].toLowerCase().includes((out.cognome||'').toLowerCase()))){ci=dl;compSure=true}}
  // nome persona
  const local=(out.email||'').split('@')[0].replace(/[^a-z.\-_]/g,' ').split(/[.\-_ ]+/).filter(x=>x.length>1);
  const okW=x=>/^[A-Za-zÀ-ÿ'’.,-]+$/.test(x);
  const cand=lines.map((l,i)=>({l,i})).filter(({l,i})=>{if(used.has(i)||i===ci)return false;const t=l.replace(TITLES,'');if(/\d|@|www/i.test(t))return false;if(COMP.test(t)||STREET.test(t)||ROLE.test(t))return false;const w=t.split(/\s+/);return w.length>=2&&w.length<=4&&w.every(okW)});
  if(!cand.length){lines.forEach((l,i)=>{if(used.has(i)||i===ci||i===ri)return;const t=l.replace(TITLES,'');if(/@|www|\d{3}/i.test(t)||COMP.test(t)||STREET.test(t)||ROLE.test(t))return;const w=t.split(/\s+/).filter(Boolean),al=t.replace(/[^A-Za-zÀ-ÿ]/g,'').length;if(w.length>=2&&w.length<=4&&al>=t.replace(/\s/g,'').length*.7&&al>=5)cand.push({l:t.replace(/[^A-Za-zÀ-ÿ'’.\s-]/g,' ').replace(/\s+/g,' ').trim(),i})})}
  const score=({l,i})=>{const t=l.replace(TITLES,'').toLowerCase();let s=0;local.forEach(x=>{if(t.includes(x))s+=3});if(ri>=0&&Math.abs(i-ri)<=1)s+=2;if(/^[A-ZÀ-Ý][a-zà-ÿ]+(\s+[A-ZÀ-Ý][a-zà-ÿ]+)+$/.test(l.replace(TITLES,''))||/^[A-ZÀ-Ý' .-]+$/.test(l.replace(TITLES,'')))s+=1;s-=i*.05;return s};
  cand.sort((a,b)=>score(b)-score(a));
  if(cand[0]){nameSure=score(cand[0])>=3||TITLES.test(cand[0].l);const raw0=cand[0].l.replace(TITLES,'').replace(/[.,]+$/,'');const ww=raw0.split(/\s+/),caps=ww.filter(x=>/^[A-ZÀ-Ý'’-]{2,}$/.test(x));let t=fixCase(raw0);used.add(cand[0].i);let w=t.split(/\s+/);
   const lowered=w.map(x=>x.toLowerCase());let k=w.length-1;while(k>1&&PART.includes(lowered[k-1]))k--;
   let nome=w.slice(0,k).join(' '),cogn=w.slice(k).join(' ');
   if(local.length>=2){const a=local[0],b=local[local.length-1],ln=nome.toLowerCase(),lc=cogn.toLowerCase();if(ln.includes(b)&&lc.includes(a)){const x=nome;nome=cogn;cogn=x}}
   if(caps.length===1&&ww.length>=2&&ww.length<=3&&caps.length<ww.length){cogn=fixCase(caps[0]);nome=fixCase(ww.filter(x=>x!==caps[0]).join(' '))}
   out.nome=nome;out.cognome=cogn}
  if(out.email&&(out.nome||out.cognome)){const [lp,dm]=out.email.split('@'),ref=[out.nome,out.cognome].filter(Boolean).join(' ').toLowerCase().split(/\s+/).map(x=>x.replace(/[^a-zà-ÿ]/g,'')).filter(x=>x.length>=5);
   const toks=lp.split(/([._-])/);let ch=false;const nt=toks.map(t=>{if(t.length<5)return t;const r=ref.find(x=>x!==t&&lev(x,t)===1);if(r){ch=true;return r}return t});if(ch)out.email=nt.join('')+'@'+dm}
  if(ci<0){ci=lines.findIndex((l,i)=>!used.has(i)&&!/\d{5}/.test(l)&&l.length>=3&&l.length<60&&!(out.nome&&l.toLowerCase().includes(out.nome.toLowerCase())))}
  if(ci>=0){out.azienda=fixCase(lines[ci]);used.add(ci)}
  if(!out.nome&&!out.cognome&&out.azienda)out.tipo='azienda';
  const rest=lines.filter((l,i)=>!used.has(i)&&!/^[\W\d]*$/.test(l)&&l.length>3);
  const note=['Letto da biglietto da visita il '+new Date().toLocaleDateString('it-IT')+'.'];
  if(extra.length)note.push('Altri recapiti: '+extra.join(' · '));
  if(rest.length)note.push('Testo non assegnato: '+rest.slice(0,6).join(' / '));
  out.note=note.join('\n');
  out._c=['email','pec','piva','telefono'].filter(k=>out[k]);if(out.sito)out._c.push('sito');if(out.ruolo)out._c.push('ruolo');if(nameSure){out._c.push('nome','cognome')}if(compSure&&out.azienda)out._c.push('azienda');if(addrSure&&out.indirizzo)out._c.push('indirizzo');
  out._u=lines.filter((l,i)=>used.has(i));out._l=lines;out._x=extra;return out}
 /* immagine: ridimensiona, scala di grigi; mode 'g' = contrasto, 'b' = binarizzazione adattiva (sfondi/luci irregolari) */
 function prep(file,mode){return new Promise((ok,ko)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{try{const mx=Math.max(img.naturalWidth,img.naturalHeight),s=Math.min(2.5,Math.max(.4,2400/mx)),c=document.createElement('canvas'),W=c.width=Math.round(img.naturalWidth*s),H=c.height=Math.round(img.naturalHeight*s);
   const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(img,0,0,W,H);const d=x.getImageData(0,0,W,H),p=d.data,N=W*H,g=new Uint8Array(N),hist=new Uint32Array(256);let sum=0;
   for(let i=0,j=0;j<N;i+=4,j++){const v=(p[i]*.299+p[i+1]*.587+p[i+2]*.114)|0;g[j]=v;hist[v]++;sum+=v}
   let lo=0,hi=255,a=0;for(let v=0;v<256;v++){a+=hist[v];if(a>N*.01){lo=v;break}}a=0;for(let v=255;v>=0;v--){a+=hist[v];if(a>N*.01){hi=v;break}}
   const k=hi>lo+20?255/(hi-lo):1;let out=new Uint8Array(N);
   for(let j=0;j<N;j++)out[j]=Math.max(0,Math.min(255,((g[j]-lo)*k)|0));
   /* biglietto scuro con testo chiaro: inverto */
   let m2=0;for(let j=0;j<N;j++)m2+=out[j];if(m2/N<105)for(let j=0;j<N;j++)out[j]=255-out[j];
   if(mode==='b'){const R=Math.max(12,(Math.min(W,H)/18)|0),I=new Float64Array((W+1)*(H+1));
    for(let y=0;y<H;y++){let r=0;for(let xx=0;xx<W;xx++){r+=out[y*W+xx];I[(y+1)*(W+1)+xx+1]=I[y*(W+1)+xx+1]+r}}
    const o2=new Uint8Array(N);for(let y=0;y<H;y++){const y0=Math.max(0,y-R),y1=Math.min(H,y+R+1);for(let xx=0;xx<W;xx++){const x0=Math.max(0,xx-R),x1=Math.min(W,xx+R+1),n=(y1-y0)*(x1-x0),mean=(I[y1*(W+1)+x1]-I[y0*(W+1)+x1]-I[y1*(W+1)+x0]+I[y0*(W+1)+x0])/n;o2[y*W+xx]=out[y*W+xx]<mean*.86?0:255}}out=o2}
   for(let i=0,j=0;j<N;i+=4,j++){p[i]=p[i+1]=p[i+2]=out[j]}
   x.putImageData(d,0,0);URL.revokeObjectURL(u);ok(c)}catch(e){URL.revokeObjectURL(u);ko(e)}};
  img.onerror=()=>{URL.revokeObjectURL(u);ko(new Error('img'))};img.src=u})}
 const load=()=>window.Tesseract?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement('script');s.src='ocr/tesseract.min.js?v=5.1.1';s.onload=ok;s.onerror=()=>ko(new Error('motore'));document.head.append(s)});
 const dg=x=>String(x||'').replace(/\D/g,'');
 const FL2=[['nome','Nome'],['cognome','Cognome'],['azienda','Azienda'],['ruolo','Ruolo'],['telefono','Telefono'],['email','Email'],['pec','PEC'],['sito','Sito web'],['piva','Partita IVA'],['indirizzo','Indirizzo']];
 const same=(k,a,b)=>k==='telefono'?(dg(a).slice(-9)===dg(b).slice(-9)&&dg(a).length>0):k==='email'||k==='pec'?String(a).toLowerCase()===String(b).toLowerCase():k==='piva'?dg(a)===dg(b):nrm(String(a).replace(/[.,\s]+/g,' ').trim())===nrm(String(b).replace(/[.,\s]+/g,' ').trim());
 function findDup(d){let best=null;const W={email:5,piva:5,telefono:4,nome:3,azienda:2};
  clients.forEach(c=>{let why=null,w=0;const tryR=(r)=>{if(W[r]>w){w=W[r];why=r}};
   if(d.email&&c.email&&same('email',d.email,c.email))tryR('email');
   if(d.piva&&c.piva&&same('piva',d.piva,c.piva))tryR('piva');
   if(d.telefono&&c.telefono&&same('telefono',d.telefono,c.telefono))tryR('telefono');
   if(d.nome&&d.cognome&&c.nome&&c.cognome&&nrm(d.nome)===nrm(c.nome)&&nrm(d.cognome)===nrm(c.cognome))tryR('nome');
   if(!d.nome&&!d.cognome&&d.azienda&&c.azienda&&same('azienda',d.azienda,c.azienda))tryR('azienda');
   if(why&&(!best||w>best.w))best={c,why,w}});return best}
 const WHY={email:'lo stesso indirizzo email',piva:'la stessa partita IVA',telefono:'lo stesso numero di telefono',nome:'lo stesso nome e cognome',azienda:'lo stesso nome di azienda'};
 function diff(c,d){const ch=[];FL2.forEach(([k,l])=>{const v=d[k];if(!v)return;const o=c[k]||'';if(!o)ch.push({k,l,o:'',v,add:true});else if(!same(k,o,v))ch.push({k,l,o,v})});return ch}
 function fillSheet(d,only){Object.keys(d).forEach(k=>{if(!FIELDS.includes(k)||!d[k]||(only&&!only.includes(k)))return;const e=$(k);if(!e)return;e.value=d[k];e.dispatchEvent(new Event('input',{bubbles:true}));if(k==='paese')e.dispatchEvent(new Event('change',{bubbles:true}))});if(d.tipo&&!only)applyTipo(d.tipo)}
 function startNew(d){closeRev();if(window.holdDirty)window.holdDirty('sheet');openSheet(null);fillSheet(d);showMsg('Dati letti dal biglietto: controllali e correggi se serve prima di salvare.')}
 function askDup(m,d){const M=$('mDup'),L=$('dpL'),c=m.c,ch=diff(c,d);L.textContent='';
  $('dpT').textContent='Cliente già presente';
  $('dpS').textContent='«'+fullName(c)+'» ha '+WHY[m.why]+' di questo biglietto.';
  ch.slice(0,8).forEach(x=>{const li=h('li');li.append(h('b','',x.l+': '),document.createTextNode(x.add?'aggiungo '+x.v:x.o+' → '+x.v));L.append(li)});
  $('dpH').textContent=ch.length?(ch.some(x=>!x.add)?'I valori diversi vengono sostituiti con quelli del biglietto. Potrai controllare e salvare.':'Verranno aggiunti solo dati mancanti. Potrai controllare e salvare.'):'Il biglietto non porta dati nuovi rispetto alla scheda.';
  $('dpU').lastChild.textContent=ch.length?' Aggiorna la scheda':' Apri la scheda';
  $('dpU').onclick=()=>{M.hidden=true;closeRev();if(ch.length&&window.holdDirty)window.holdDirty('sheet');openSheet(c);if(ch.length){const v={};ch.forEach(x=>{v[x.k]=x.v});if(v.telefono&&d.paese)v.paese=d.paese;const nt=d.note?((c.note?c.note+'\n\n':'')+d.note):'';if(nt)v.note=nt;fillSheet(v);showMsg('Dati del biglietto applicati: controllali e torna indietro per salvare.')}};
  $('dpN').onclick=()=>{M.hidden=true;startNew(d)};$('dpX').onclick=()=>{M.hidden=true};M.hidden=false}
 ICONS.cut=svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>');
 const CF=[['nome','Nome'],['cognome','Cognome'],['azienda','Azienda'],['ruolo','Ruolo'],['telefono','Telefono'],['email','Email'],['sito','Sito web'],['indirizzo','Indirizzo'],['piva','Partita IVA'],['pec','PEC'],['note','Note']];
 let R=null,ADD=false;
 const junk=t=>!/[A-Za-zÀ-ÿ0-9]{4,}/.test(t);
 function closeRev(){if(R){R.urls.forEach(u=>{try{URL.revokeObjectURL(u)}catch(e){}})}R=null;$('cardRev').hidden=true}
 function chipsFrom(p,old){const was=new Map((old||[]).map(c=>[c.t,c.used]));return p._l.map(t=>({t,used:p._u.includes(t)||!!was.get(t)}))}
 function ingest(txt,url){
  if(R){R.urls.push(url);R.text+='\n'+txt}
  const p=parse(R?R.text:txt);
  if(!R){R={urls:[url],text:txt,vals:{},chk:new Set(p._c),sel:-1,paese:'',tel0:'',extra:[],chips:[]};CF.forEach(([k])=>{if(k!=='note')R.vals[k]=p[k]||''});R.vals.note=''}
  else CF.forEach(([k])=>{if(k==='note')return;if(!R.vals[k]&&p[k]){R.vals[k]=p[k];if(p._c.includes(k))R.chk.add(k)}});
  R.paese=p.paese||R.paese;R.tel0=p.telefono||R.tel0;R.extra=p._x;R.chips=chipsFrom(p,R.chips);R.sel=-1;renderRev();$('cardRev').hidden=false;$('cardRev').scrollTop=0}
 function assign(i,k){const c=R.chips[i];if(!c)return;const t=c.t;if(k==='note')R.vals.note=(R.vals.note?R.vals.note+'\n':'')+t;else R.vals[k]=t;R.chk.add(k);c.used=true;R.sel=-1;renderRev(true)}
 function renderRev(keep){const top=$('cardRev').scrollTop;
  const ph=$('crPh');ph.textContent='';R.urls.forEach(u=>{const im=h('img','crThumb');im.src=u;im.alt='Biglietto';ph.append(im)});
  $('crBack').lastChild.textContent=R.urls.length>1?' Altra foto':' Aggiungi il retro';
  const F=$('crF');F.textContent='';F.classList.toggle('crSel',R.sel>=0);
  CF.forEach(([k,l])=>{const row=h('div','f crRow'+(R.vals[k]&&!R.chk.has(k)&&k!=='note'?' unk':''));row.dataset.k=k;
   const lb=h('label','',l);lb.setAttribute('for','cr_'+k);const big=k==='indirizzo'||k==='note';const inp=h(big?'textarea':'input');inp.id='cr_'+k;if(big)inp.rows=2;inp.value=R.vals[k]||'';inp.autocomplete='off';
   if(k==='email'||k==='pec'){inp.type='email';inp.autocapitalize='off'}if(k==='telefono')inp.inputMode='tel';
   inp.oninput=()=>{R.vals[k]=inp.value;R.chk.add(k);row.classList.remove('unk')};
   const put=h('button','crPut','Inserisci qui');put.type='button';put.onclick=()=>assign(R.sel,k);
   row.append(lb,inp,put);F.append(row)});
  const P=$('crPool');P.textContent='';
  R.chips.forEach((c,i)=>{const ch=h('div','crChip'+(c.used?' used':'')+(R.sel===i?' sel':''));ch.append(h('span','',c.t));
   if(/\s/.test(c.t)){const cut=h('button','crCut');cut.type='button';cut.setAttribute('aria-label','Dividi in parole');cut.title='Dividi in parole';cut.innerHTML=ICONS.cut;cut.onclick=e=>{e.stopPropagation();const w=c.t.split(/\s+/).filter(Boolean).map(t=>({t,used:false}));R.chips.splice(i,1,...w);R.sel=-1;renderRev(true)};ch.append(cut)}
   dragInit(ch,i);P.append(ch)});
  $('crHint').textContent=R.sel>=0?'Ora tocca il campo in cui inserirlo.':'Trascina una riga sul campo giusto (tieni premuto, poi muovi) oppure toccala e poi tocca il campo. Con le forbici dividi la riga in parole.';
  if(keep)$('cardRev').scrollTop=top}
 function dragInit(chip,i){let drag=false,gh=null,timer=null,sx=0,sy=0,live=false;
  const rowAt=(x,y)=>{const e=document.elementFromPoint(x,y);return e&&e.closest?e.closest('.crRow'):null};
  const hi=r=>{document.querySelectorAll('.crRow.hi').forEach(x=>{if(x!==r)x.classList.remove('hi')});if(r)r.classList.add('hi')};
  let px=0,py=0,au=null;const mv=(x,y)=>{if(!gh)return;px=x;py=y;gh.style.left=x+'px';gh.style.top=y+'px';hi(rowAt(x,y))};
  const auto=()=>{const S=$('cardRev'),H=innerHeight;if(py<110)S.scrollTop-=14;else if(py>H-110)S.scrollTop+=14;else return;hi(rowAt(px,py))};
  const begin=(x,y)=>{drag=true;au=setInterval(auto,30);gh=h('div','crGhost',R.chips[i].t);document.body.append(gh);chip.classList.add('drg');mv(x,y)};
  const end=()=>{live=false;clearTimeout(timer);clearInterval(au);document.removeEventListener('pointermove',onm);document.removeEventListener('pointerup',onu);document.removeEventListener('pointercancel',onc)};
  const onm=e=>{if(!live)return;if(!drag){const dx=e.clientX-sx,dy=e.clientY-sy,far=Math.hypot(dx,dy);if(e.pointerType==='mouse'){if(far>5)begin(e.clientX,e.clientY)}else if(far>10){clearTimeout(timer)}}else mv(e.clientX,e.clientY)};
  const fin=(x,y,ok)=>{const was=drag;end();if(gh){gh.remove();gh=null}chip.classList.remove('drg');hi(null);if(was){if(ok){const r=rowAt(x,y);if(r)assign(i,r.dataset.k)}drag=false;return}
   if(ok&&Math.hypot(x-sx,y-sy)<10){R.sel=R.sel===i?-1:i;renderRev(true)}};
  const onu=e=>fin(e.clientX,e.clientY,true),onc=e=>fin(e.clientX,e.clientY,false);
  chip.addEventListener('pointerdown',e=>{if(e.target.closest('.crCut'))return;sx=e.clientX;sy=e.clientY;drag=false;live=true;document.addEventListener('pointermove',onm);document.addEventListener('pointerup',onu);document.addEventListener('pointercancel',onc);if(e.pointerType!=='mouse')timer=setTimeout(()=>begin(sx,sy),260)});
  chip.addEventListener('touchmove',e=>{if(drag)e.preventDefault()},{passive:false});
  chip.addEventListener('contextmenu',e=>e.preventDefault())}
 function finish(){const v=R.vals,d={};['nome','cognome','azienda','ruolo','telefono','email','sito','indirizzo','piva','pec'].forEach(k=>{const x=(v[k]||'').trim();if(x)d[k]=x});
  if(d.telefono&&R.paese&&d.telefono===R.tel0)d.paese=R.paese;if(!d.nome&&!d.cognome&&d.azienda)d.tipo='azienda';
  const nt=['Letto da biglietto da visita il '+new Date().toLocaleDateString('it-IT')+'.'];if(R.extra.length)nt.push('Altri recapiti: '+R.extra.join(' · '));
  const un=R.chips.filter(c=>!c.used&&!junk(c.t)).map(c=>c.t);if($('crNote').checked&&un.length)nt.push('Testo non assegnato: '+un.slice(0,8).join(' / '));if((v.note||'').trim())nt.push(v.note.trim());
  d.note=nt.join('\n');const m=findDup(d);if(m)askDup(m,d);else startNew(d)}
 $('crOk').onclick=()=>{if(R)finish()};
 $('crBack').onclick=()=>{ADD=true;$('cardFile').click()};
 $('crX').onclick=()=>askConfirm('Scartare i dati letti dal biglietto?','trash','Scarta',()=>closeRev());
 let busy=false,stop=null;
 async function run(file,add){if(busy)return;if(!add&&R)closeRev();busy=true;const M=$('mScan'),T=$('scT'),B=$('scB'),H=$('scH');let worker=null,cancelled=false;
  stop=()=>{cancelled=true;try{worker&&worker.terminate()}catch(e){}};B.style.width='4%';T.textContent='Preparo l’immagine…';H.textContent='';M.hidden=false;
  try{const cv=await prep(file);if(cancelled)return;T.textContent='Carico il lettore di testo…';H.textContent='Solo la prima volta può richiedere qualche istante.';await load();if(cancelled)return;
   const base=new URL('ocr/',location.href).href;
   worker=await Tesseract.createWorker('ita+eng',1,{workerPath:base+'worker.min.js',corePath:base,langPath:base,gzip:false,cacheMethod:'none',logger:m=>{if(cancelled)return;if(m.status==='recognizing text'){T.textContent='Leggo il biglietto…';B.style.width=(15+Math.round(m.progress*80))+'%'}else if(/loading|initializ/.test(m.status||'')){B.style.width=Math.max(6,Math.round(5+(m.progress||0)*10))+'%'}}});
   if(cancelled)return;
   const pass=async(c,psm)=>{await worker.setParameters({tessedit_pageseg_mode:psm,preserve_interword_spaces:'1'});const r=await worker.recognize(c),t=(r&&r.data&&r.data.text)||'',d=parse(t);return{t,d,conf:(r&&r.data&&r.data.confidence)||0}};
   const rate=x=>x.conf+['email','telefono','nome','azienda','indirizzo','piva','sito'].filter(k=>x.d[k]).length*4;
   let best=await pass(cv,'3');
   if(!cancelled&&(best.conf<82||!(best.d.email||best.d.telefono))){T.textContent='Rileggo con più attenzione…';B.style.width='70%';
    const cv2=await prep(file,'b');if(!cancelled){const alt=await pass(cv2,'6');
     const win=rate(alt)>rate(best)?alt:best,los=win===alt?best:alt;
     ['email','pec','telefono','paese','piva','sito'].forEach(k=>{if(!win.d[k]&&los.d[k])win.d[k]=los.d[k]});best=win}}
   await worker.terminate();worker=null;if(cancelled)return;
   const txt=best.t,d=best.d;M.hidden=true;
   if(txt.replace(/\W/g,'').length<8){toast('Non riesco a leggere il biglietto: riprova con più luce e il biglietto dritto.');return}
   ingest(txt,URL.createObjectURL(file))}
  catch(e){M.hidden=true;if(!cancelled)toast('Lettura non riuscita'+(navigator.onLine===false?': sei offline e il lettore non è ancora scaricato.':'. Riprova.'))}
  finally{try{worker&&worker.terminate()}catch(e){}busy=false;stop=null;M.hidden=true}}
 return{parse,run,prep,add:v=>{if(v!==undefined)ADD=v;const a=ADD;ADD=false;return a&&!!R},cancel:()=>stop&&stop()}})();
{const f=$('cardFile');$('cScan').onclick=()=>{CARD.add(false);f.click()};f.onchange=()=>{const x=f.files&&f.files[0],a=CARD.add();f.value='';if(x)CARD.run(x,a)};$('scX').onclick=()=>CARD.cancel()}

if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
try{baselineMods()}catch(e){}

/* guide scritte: i testi statici diventano un'icona (i) che li apre al tocco */
function guideify(root){
  const SKIP='#mWel,#authScr,#lockScr';
  const KEEPID=new Set(['st_provhint','st_aliashint','st_exH','mc_h2']);
  root.querySelectorAll('.hint').forEach(hh=>{if(hh.id&&!KEEPID.has(hh.id))return;
    if(hh.closest(SKIP)||hh.closest('.gtip')||!hh.textContent.trim()||hh.dataset.keep!==undefined)return;
    const par=hh.parentElement;if(!par)return;
    let host=hh.previousElementSibling;
    if(!(host&&((host.tagName==='LABEL'&&!host.querySelector('input'))||(host.tagName==='DIV'&&!host.querySelector('input,select,textarea,button')&&host.textContent.trim()))))host=null;
    if(!host){let q=hh.previousElementSibling,n=0;while(q&&n<2&&!host){const l=q.tagName==='LABEL'?q:[...q.querySelectorAll('label')].filter(x=>!x.querySelector('input')&&!x.classList.contains('chk')).pop();if(l&&!l.querySelector('input'))host=l;q=q.previousElementSibling;n++}}
    if(!host){const l=par.querySelector(':scope > label');if(l&&!l.classList.contains('chk')&&!l.querySelector('input'))host=l}
    if(!host){const p=par.querySelector(':scope > p');if(p&&par.classList.contains('box'))host=p}
    const tip=document.createElement('div');tip.className='gtip';tip.hidden=true;if(hh.id)tip.id=hh.id;tip.innerHTML=hh.innerHTML;
    const b=document.createElement('button');b.type='button';b.className='gi';b.setAttribute('aria-label','Informazioni');b.title='Informazioni';b.setAttribute('aria-expanded','false');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();tip.hidden=!tip.hidden;b.classList.toggle('on',!tip.hidden);b.setAttribute('aria-expanded',String(!tip.hidden))};
    if(host)host.append(b);else{const r=document.createElement('div');r.className='gline';r.append(b);hh.before(r)}
    hh.replaceWith(tip)})}
/* email al cliente: listino e brochure (file o link) sempre disponibili, come nelle risposte ai lead */
{const _oc=openCompose;openCompose=function(c){const r=_oc.apply(this,arguments);try{if(!$('mCompose').hidden&&c&&c.id&&!cmpQ&&!cmpLeadRef)cmpExtras(c)}catch(e){}return r}}
/* ===== scorrimento orizzontale (swipe): tra i tab di pagine e schede; verso destra in qualsiasi scheda = freccia indietro ===== */
{const vis=el=>!!el&&!el.hidden&&el.getClientRects().length>0;
 const btns=sel=>{const bar=document.querySelector(sel);return bar?[...bar.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled&&vis(b)):[]};
 const cur=l=>l.findIndex(b=>b.classList.contains('on'));
 const noSw=t=>{for(let e=t;e&&e!==document.body;e=e.parentElement){if(e.matches&&e.matches('input,textarea,select,[contenteditable="true"],canvas,.nosw,.crChip,.crGhost'))return true;const o=getComputedStyle(e).overflowX;if((o==='auto'||o==='scroll')&&e.scrollWidth>e.clientWidth+2)return true}return false};
 const open=()=>[...document.querySelectorAll('.sheet,.modal')].some(vis)||vis($('appMenu'));
 const where=t=>{ /* quale gruppo di tab governa il punto toccato */
   for(const [id,bar] of [['sheet','#cTabs'],['lSheet','#lTabs']]){const s=$(id);if(vis(s)&&s.contains(t))return bar}
   const sh=t.closest&&t.closest('.sheet');if(vis(sh))return [...document.querySelectorAll('.modal')].some(vis)?null:sh; /* scheda senza tab: lo scorrimento verso destra vale come freccia indietro */
   if(open())return null;
   if(tab==='prod'&&vis($('prodView'))&&$('prodView').contains(t))return '#pSeg';
   if(tab==='mkt'&&vis($('mktView'))&&$('mktView').contains(t)&&$('mSeg'))return '#mSeg';
   return '#tabs'};
 let st=null;
 document.addEventListener('touchstart',e=>{st=null;window.__swDrag=0;if(e.touches.length!==1)return;const t=e.touches[0];if(t.clientX<24||t.clientX>innerWidth-24)return;if(noSw(e.target))return;const w=where(e.target);if(!w)return;st={x:t.clientX,y:t.clientY,t:Date.now(),bar:w}},{passive:true});
 document.addEventListener('touchcancel',()=>{st=null},{passive:true});
 document.addEventListener('touchend',e=>{const s=st;st=null;if(!s||!e.changedTouches.length)return;if(window.__swDrag){window.__swDrag=0;return} /* gesto già usato da una riga a scorrimento */const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;
   if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.8||Date.now()-s.t>700)return;
   try{if(String(getSelection()).length)return}catch(x){}
   if(s.bar instanceof Element){if(dx>0){const bk=(s.bar.querySelector('.top [data-i=back]')||{closest:()=>null}).closest('button')||s.bar.querySelector('.top button');if(bk&&vis(bk))bk.click();else if(!$('homeBk').hidden)$('homeBk').click()}return}
   const l=btns(s.bar),i=cur(l),n=i+(dx<0?1:-1);
   /* sul primo tab di una scheda, scorrere verso il precedente equivale alla freccia indietro (con la richiesta di salvare se ci sono modifiche) */
   if(dx>0&&(s.bar==='#cTabs'||s.bar==='#lTabs')&&i<=0){const bk=$(s.bar==='#cTabs'?'close':'lClose');if(bk&&vis(bk))bk.click();return}
   /* Prodotti (prima sezione) e Marketing non hanno un tab precedente: lo scorrimento verso destra riporta alla Home */
   if(dx>0&&(s.bar==='#pSeg'||s.bar==='#mSeg'||s.bar==='#tabs')&&i<=0&&!$('homeBk').hidden){$('homeBk').click();return}
   if(i<0||n<0||n>=l.length)return;
   l[n].click();
   const v=s.bar==='#tabs'?['homeView','list','leadView','oppView'].map($).find(vis):s.bar==='#pSeg'?$('prodView'):s.bar==='#mSeg'?$('mktView'):null;
   if(v&&!matchMedia('(prefers-reduced-motion:reduce)').matches){v.classList.remove('swl','swr');void v.offsetWidth;v.classList.add(dx<0?'swl':'swr');setTimeout(()=>v.classList.remove('swl','swr'),260)}
 },{passive:true})}

/* ===== occhietto: mostra/nascondi in tutti i campi password (esistenti e creati dopo) ===== */
{const EYE='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  OFF='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  const st=document.createElement('style');st.textContent='.pwv{position:relative;display:block;flex:none}.pwv>input{padding-right:48px!important}.pwe{position:absolute;right:2px;width:44px;display:grid;place-items:center;background:none;border:0;padding:0;color:var(--muted);cursor:pointer;border-radius:12px;-webkit-tap-highlight-color:transparent}.pwe:focus-visible{outline:2px solid var(--ink);outline-offset:-4px}';document.head.append(st);
  const wrap=i=>{if(i.dataset.pwv||i.type!=='password'||!i.parentNode)return;i.dataset.pwv='1';
    const w=document.createElement('span');w.className='pwv';i.parentNode.insertBefore(w,i);w.append(i);
    const cs=getComputedStyle(i),b=document.createElement('button');b.type='button';b.className='pwe';b.style.top=cs.marginTop;b.style.bottom=cs.marginBottom;
    const set=on=>{b.innerHTML=on?OFF:EYE;b.setAttribute('aria-label',on?'Nascondi':'Mostra');b.title=on?'Nascondi':'Mostra';b.setAttribute('aria-pressed',String(on))};set(false);
    b.onpointerdown=e=>e.preventDefault();
    b.onclick=()=>{const show=i.type==='password';i.type=show?'text':'password';set(show);try{i.focus({preventScroll:true})}catch(e){}};
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&i.type==='text'){i.type='password';set(false)}});
    w.append(b)};
  const scan=r=>{try{(r.querySelectorAll?r.querySelectorAll('input[type=password]'):[]).forEach(wrap)}catch(e){}};
  scan(document);new MutationObserver(m=>{for(const x of m)for(const n of x.addedNodes)if(n.nodeType===1){if(n.matches&&n.matches('input[type=password]'))wrap(n);else scan(n)}}).observe(document.body,{childList:true,subtree:true})}

/* ===== nuova versione: controllo a ogni accesso, con avviso per aggiornare ===== */
{const rd=t=>{const m=/name="app-version" content="([^"|]+)\|([^"]+)"/.exec(t);return m?{v:m[1],d:m[2]}:null};
  const cur=rd('<meta name="app-version" content="'+((document.querySelector('meta[name=app-version]')||{}).content||'')+'">');
  let busy=false;
  window.checkUpdate=async()=>{if(busy||!cur||navigator.onLine===false)return;busy=true;
    try{const r=await fetch(location.href.split('#')[0].split('?')[0]+'?c='+Date.now(),{cache:'no-store'});if(!r.ok)return;const n=rd(await r.text());
      if(!n||(n.v===cur.v&&n.d===cur.d))return;
      if(!$('mE2E').hidden||!$('confirm').hidden)return;
      askConfirm('È disponibile la versione '+n.v+' di KRANG CRM. Vuoi aggiornare ora?','reset','Aggiorna',()=>{const u=$('inU');if(u)u.onclick();else location.reload()})
    }catch(e){}finally{busy=false}};
  try{if(typeof SB!=='undefined'&&SB.alog){const a=SB.alog;SB.alog=function(kind){const r=a.apply(this,arguments);if(kind==='login')setTimeout(()=>window.checkUpdate(),2500);return r}}}catch(e){}
  setTimeout(()=>{if(!document.documentElement.classList.contains('noauth'))window.checkUpdate()},4000)}
