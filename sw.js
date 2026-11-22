const V='crm-v1.71.0',F=['./','index.html','app.js?v=1.71.0','boot.js?v=1.71.0','manifest.webmanifest','privacy.html','termini.html','legal.js','assistente.js?v=1.71.0','setup.js?v=1.71.0','legal.css','consensi.html','consensi.js','consensi.css','kcrm-180.png','kcrm-192.png','kcrm-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map((f,i)=>i<4?c.add(f):c.add(f).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* solo file dell'app (stessa origine, GET, risposta "basic"): mai dati degli utenti, mai risposte di altri siti */
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL('./',location.href).pathname))return;
 const nav=e.request.mode==='navigate',st=()=>caches.open(V);
 /* dalla copia salvata: i file dell'app, anche con indirizzo diverso (es. ?go=tk) e, per l'avvio, la pagina principale */
 const hit=()=>caches.match(e.request,{ignoreSearch:nav,ignoreVary:true}).then(r=>r||(nav?(caches.match('index.html',{ignoreSearch:true,ignoreVary:true})).then(x=>x||caches.match('./',{ignoreSearch:true,ignoreVary:true})):undefined));
 const net=()=>fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const c=r.clone();st().then(x=>x.put(e.request,c))}return r});
 /* rete con tempo massimo: senza connessione (o rete finta) si parte subito dalla copia salvata */
 e.respondWith(new Promise(ok=>{let done=false;const fin=r=>{if(!done){done=true;ok(r)}};
  const t=setTimeout(()=>hit().then(r=>{if(r)fin(r)}),nav?1500:4000);
  net().then(r=>{clearTimeout(t);fin(r)},()=>{clearTimeout(t);hit().then(r=>fin(r||new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><body style="font:16px system-ui;padding:32px;background:#111;color:#eee"><h3>KRANG CRM</h3><p>Sei offline e l’app non è ancora salvata su questo dispositivo. Riapri l’app quando c’è connessione.</p>',{status:503,headers:{'Content-Type':'text/html;charset=utf-8'}})))})}))});

/* promemoria push: il testo è generico (arriva cifrato dal server); un tocco apre l'elenco delle attività */
const kdb=()=>new Promise((ok,ko)=>{const q=indexedDB.open('krang-push',2);q.onupgradeneeded=()=>{const d=q.result;if(!d.objectStoreNames.contains('k'))d.createObjectStore('k');if(!d.objectStoreNames.contains('log'))d.createObjectStore('log')};q.onerror=()=>ko(q.error);q.onsuccess=()=>ok(q.result)});
const kget=async(s,k)=>{const d=await kdb();return new Promise((ok,ko)=>{const r=d.transaction(s).objectStore(s).get(k);r.onsuccess=()=>{d.close();ok(r.result)};r.onerror=()=>{d.close();ko()}})};
const kput=async(s,k,v)=>{const d=await kdb();return new Promise(ok=>{const t=d.transaction(s,'readwrite');t.objectStore(s).put(v,k);t.oncomplete=()=>{d.close();ok()};t.onerror=()=>{d.close();ok()}})};
self.addEventListener('push',e=>{const L={t:Date.now(),dati:!!e.data,dec:'-',mostra:'in corso'};let d={};try{d=e.data?e.data.json():{}}catch(x){L.dati='illeggibili'}
 const show=(b)=>self.registration.showNotification(d.t||'KRANG CRM',{body:b,icon:'kcrm-192.png',badge:'kcrm-192.png',tag:'krang-tk-'+(d.e?String(d.e).slice(-12):'g'+Date.now()),data:{go:d.go||'tk'}});
 e.waitUntil((async()=>{let b=d.b||'Hai attività in scadenza.';
  try{await kput('log','last',L)}catch(x){}
  if(d.e){try{const kb=await kget('k','nk');
   if(kb){const u=s=>Uint8Array.from(atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)),o=u(d.e),k=await crypto.subtle.importKey('raw',u(kb),'AES-GCM',false,['decrypt']),t=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:o.slice(0,12)},k,o.slice(12))));if(t.t){b=t.t+(t.r?'\n'+t.r:'');L.dec='ok'}}else L.dec='senza chiave'}catch(x){L.dec='non decifrato'}}
  try{await show(b)}catch(x){L.mostra='errore: '+((x&&x.message)||x);try{await kput('log','last',L)}catch(y){}return}
  L.mostra='ok';try{await kput('log','last',L)}catch(x){}})())});
self.addEventListener('notificationclick',e=>{e.notification.close();const g=(e.notification.data&&e.notification.data.go)||'tk';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){try{c.postMessage({go:g})}catch(x){}return c.focus()}}return self.clients.openWindow('./?go='+g)}))});
