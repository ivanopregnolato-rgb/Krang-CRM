/* Dati del gestore del servizio: modifica solo questi valori, le pagine Privacy e Termini si aggiornano da sole. */
window.LEGAL={
 titolare:'[Nome e cognome o ragione sociale del gestore]',
 sede:'[Indirizzo / sede del gestore]',
 email:'[Email di contatto per la privacy]',
 regione:'[Regione dei server dati: da verificare in Supabase]',
 aggiornato:'10 novembre 2026'
};
document.querySelectorAll('[data-l]').forEach(e=>{const v=window.LEGAL[e.dataset.l]||'';e.textContent=v;if(/^\[/.test(v))e.className='ph'});
document.querySelectorAll('a[data-mail]').forEach(a=>{const v=window.LEGAL.email;if(/^[^\s@\[]+@[^\s@]+$/.test(v))a.href='mailto:'+v});
