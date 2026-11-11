/* avvio: eseguito prima del disegno della pagina */
(function(){var d=document.documentElement;
 /* modello di colore scelto dall'utente */
 try{var tp=localStorage.getItem('crm-tpl');if(tp==='arancio'||tp==='notte'||tp==='neon'||tp==='giorno'){d.setAttribute('data-tpl',tp);var tm=document.querySelector('meta[name=theme-color]');if(tm)tm.content=tp==='giorno'?'#eef4fb':tp==='arancio'?'#bfe0f8':'#001330'}}catch(e){}
 /* anti-clickjacking: l'app non deve girare dentro la pagina di qualcun altro */
 try{if(window.top!==window.self){d.style.display='none';return}}catch(e){d.style.display='none';return}
 /* link di conferma/recupero: i token vengono tolti subito dall'indirizzo (cronologia, referrer, schermate) */
 try{var hh=location.hash||'';if(/(^|[#&])(access_token|error|error_code)=/.test(hh)){var q=new URLSearchParams(hh.slice(1));window.__authLink={token:q.get('access_token')||'',type:q.get('type')||'',error:q.get('error')||'',code:q.get('error_code')||''};history.replaceState(null,'',location.pathname+location.search)}}catch(e){}
 try{if(!localStorage.getItem('crm-sb-v1'))d.classList.add('noauth')}catch(e){d.classList.add('noauth')}
 try{var _l=JSON.parse(localStorage.getItem('crm-lock-v1')||'{}');if(_l.on)d.classList.add('locked')}catch(e){}
 /* font: caricato senza bloccare la pagina (niente gestori inline) */
 var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap';document.head.appendChild(l);
})();
