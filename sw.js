const V='crm-v1.42.0',F=['./','index.html','app.js?v=1.42.0','boot.js?v=1.42.0','manifest.webmanifest','privacy.html','termini.html','legal.js','assistente.js?v=1.42.0','legal.css','consensi.html','consensi.js','consensi.css','kcrm-180.png','kcrm-192.png','kcrm-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(f=>c.add(f).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* solo file dell'app (stessa origine, GET, risposta "basic"): mai dati degli utenti, mai risposte di altri siti */
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL('./',location.href).pathname))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});

/* promemoria push: il testo è generico (arriva cifrato dal server); un tocco apre l'elenco delle attività */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
 const show=(b)=>self.registration.showNotification(d.t||'KRANG CRM',{body:b,icon:'kcrm-192.png',badge:'kcrm-192.png',tag:'krang-tk-'+(d.e?String(d.e).slice(-12):'g'),data:{go:'tk'}});
 e.waitUntil((async()=>{let b=d.b||'Hai attività in scadenza.';
  if(d.e){try{const kb=await new Promise((ok,ko)=>{const q=indexedDB.open('krang-push',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onerror=()=>ko();q.onsuccess=()=>{const r=q.result.transaction('k').objectStore('k').get('nk');r.onsuccess=()=>ok(r.result);r.onerror=()=>ko()}});
   if(kb){let J;const u=s=>Uint8Array.from(atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)),o=u(d.e),k=await crypto.subtle.importKey('raw',u(kb),'AES-GCM',false,['decrypt']),t=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:o.slice(0,12)},k,o.slice(12))));if(t.t)b=t.t+(t.r?'\n'+t.r:'')}}catch(x){}}
  return show(b)})())});
self.addEventListener('notificationclick',e=>{e.notification.close();
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){try{c.postMessage({go:'tk'})}catch(x){}return c.focus()}}return self.clients.openWindow('./?go=tk')}))});
