/* Dati del gestore del servizio: modifica solo questi valori, le pagine Privacy e Termini si aggiornano da sole. */
window.LEGAL={
 titolare:'[Nome e cognome / ragione sociale del titolare]',
 sede:'[Indirizzo della sede, CAP, città (provincia)]',
 email:'[indirizzo email per la privacy]',
 regione:'Francia (Parigi), Unione Europea',
 aggiornato:'14 novembre 2026'
};
document.querySelectorAll('[data-l]').forEach(e=>{const v=window.LEGAL[e.dataset.l]||'';e.textContent=v;if(/^\[/.test(v))e.className='ph'});
document.querySelectorAll('a[data-mail]').forEach(a=>{const v=window.LEGAL.email;if(/^[^\s@\[]+@[^\s@]+$/.test(v))a.href='mailto:'+v});

/* «Torna all'app» senza ricaricare: si torna alla pagina da cui si e' arrivati (l'app resta com'era, anche con l'accesso gia' fatto) */
(function(){try{
  var same=function(){try{return history.length>1}catch(e){return false}};
  document.querySelectorAll('a.bk').forEach(function(a){a.addEventListener('click',function(e){if(same()){e.preventDefault();history.back()}})});
  document.querySelectorAll('a[href="termini.html"],a[href="privacy.html"]').forEach(function(a){a.addEventListener('click',function(e){if(same()){e.preventDefault();location.replace(a.href)}})});
}catch(e){}})();
