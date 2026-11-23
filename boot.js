/* avvio: eseguito prima del disegno della pagina */
(function(){var d=document.documentElement;
 /* modello di colore scelto dall'utente */
 try{var tp=localStorage.getItem('crm-tpl');if(!tp)tp='neon';if(tp==='arancio'||tp==='notte'||tp==='neon'||tp==='giorno'){d.setAttribute('data-tpl',tp);var tm=document.querySelector('meta[name=theme-color]');if(tm)tm.content=tp==='giorno'?'#eef4fb':tp==='arancio'?'#bfe0f8':'#001330'}}catch(e){}
 /* anti-clickjacking: l'app non deve girare dentro la pagina di qualcun altro */
 try{if(window.top!==window.self){d.style.display='none';return}}catch(e){d.style.display='none';return}
 /* link di conferma/recupero: i token vengono tolti subito dall'indirizzo (cronologia, referrer, schermate) */
 try{var hh=location.hash||'';if(/(^|[#&])(access_token|error|error_code)=/.test(hh)){var q=new URLSearchParams(hh.slice(1));window.__authLink={token:q.get('access_token')||'',type:q.get('type')||'',error:q.get('error')||'',code:q.get('error_code')||''};history.replaceState(null,'',location.pathname+location.search)}}catch(e){}
 try{if(!localStorage.getItem('crm-sb-v1'))d.classList.add('noauth')}catch(e){d.classList.add('noauth')}
 try{var _l=JSON.parse(localStorage.getItem('crm-lock-v1')||'{}');if(_l.on)d.classList.add('locked')}catch(e){}
 /* font: caricato senza bloccare la pagina (niente gestori inline) */
 /* media=print: il foglio di stile non può bloccare il disegno della pagina (senza rete, all'avvio, restava la schermata bianca); a caricamento finito diventa attivo */
 var l=document.createElement('link');l.rel='stylesheet';l.media='print';l.href='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap';l.addEventListener('load',function(){l.media='all'});document.head.appendChild(l);
})();
try{if(localStorage.getItem('crm-lay')!=='a')document.documentElement.setAttribute('data-lay','b')}catch(e){document.documentElement.setAttribute('data-lay','b')}

/* rete di sicurezza: se lo script non segnala di aver finito, dopo 4 secondi la pagina si mostra comunque */
setTimeout(function(){document.documentElement.classList.add('rdy')},4000);

/* se dopo qualche secondo l'app non è partita (file non caricati, tipicamente senza rete e senza copia salvata) lo dice invece di restare bianca */
setTimeout(function(){try{if(typeof window.persist==='function'||document.getElementById('offDiag'))return;var d=document.createElement('div');d.id='offDiag';d.style.cssText='position:fixed;inset:0;z-index:99999;background:#0b1020;color:#eef4ff;font:16px/1.5 system-ui,sans-serif;padding:calc(env(safe-area-inset-top,0px) + 40px) 24px 24px;visibility:visible';
 var p=document.createElement('p');p.textContent='KRANG CRM non è riuscito ad avviarsi. Chiudi l’app e riaprila: se sei senza rete, riprova quando torna la connessione.';d.appendChild(p);var q=document.createElement('p');q.style.opacity='.6';q.style.fontSize='13px';q.textContent='Dettaglio: app non caricata';d.appendChild(q);document.body.appendChild(d);
 if(window.caches)caches.keys().then(function(k){return Promise.all(k.map(function(n){return caches.open(n).then(function(c){return c.keys().then(function(l){return n+': '+l.length+' file'})})}))}).then(function(r){q.textContent='Dettaglio: app non caricata · '+(r.join(', ')||'nessuna copia salvata')}).catch(function(){})}catch(e){}},6000);
