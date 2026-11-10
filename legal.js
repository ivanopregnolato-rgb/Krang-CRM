/* Dati del gestore del servizio: modifica solo questi valori, le pagine Privacy e Termini si aggiornano da sole. */
window.LEGAL={
 titolare:'Ivano Pregnolato',
 sede:'Via Medici 13, 38123 Trento (TN)',
 email:'kcrm.privacy@gmail.com',
 regione:'Francia (Parigi), Unione Europea',
 aggiornato:'10 novembre 2026'
};
document.querySelectorAll('[data-l]').forEach(e=>{const v=window.LEGAL[e.dataset.l]||'';e.textContent=v;if(/^\[/.test(v))e.className='ph'});
document.querySelectorAll('a[data-mail]').forEach(a=>{const v=window.LEGAL.email;if(/^[^\s@\[]+@[^\s@]+$/.test(v))a.href='mailto:'+v});
