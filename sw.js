const V='crm-v1.25.0',F=['./','index.html','app.js?v=1.25.0','gmail.js?v=1.25.0','boot.js?v=1.25.0','manifest.webmanifest','privacy.html','termini.html','legal.js','assistente.js?v=1.25.0','legal.css','kcrm-180.png','kcrm-192.png','kcrm-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(f=>c.add(f).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* solo file dell'app (stessa origine, GET, risposta "basic"): mai dati degli utenti, mai risposte di altri siti */
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL('./',location.href).pathname))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
