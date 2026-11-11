/* Assistente: risponde nella chat usando solo il manuale, sul telefono.
   I dati dei clienti non lasciano mai il dispositivo. La domanda parte solo se l'utente preme
   «non utile» o «Segnala», dopo averla vista, ripulita da email/numeri/codici (cleanQ).
   Tutto il testo in uscita usa textContent: nessun HTML dell'utente viene interpretato.
   ASK.remote (facoltativo) e' il punto di innesto per un'IA: riceve solo il testo della domanda. */
(function(){
const KB=[
{t:'Installare l’app sull’iPhone',k:'installare installazione aggiungere schermata home icona safari condividi scaricare app store iphone',
 a:'KRANG CRM non si scarica dall’App Store: si aggiunge alla schermata Home da Safari e funziona a schermo intero.',
 s:['Apri l’indirizzo dell’app con Safari.','Tocca il tasto Condividi.','Scegli «Aggiungi alla schermata Home» e conferma.','Apri KRANG CRM dall’icona appena creata.']},
{t:'Primi passi',i:['02-primi-passi'],k:'primi passi iniziare cominciare benvenuto checklist guida iniziale scheda home bussola nascondere riaprire',
 a:'I Primi passi sono cinque: profilo dell’azienda, primo cliente, posta, cifratura dei dati e accesso con biometria. La scheda sta in Home; se l’hai nascosta la riapri dal menu, voce Aiuto → Primi passi.',
 go:['Apri Primi passi','help']},
{t:'Provare l’app con dati di esempio',k:'esempi esempio prova provare demo dati finti fittizi aggiungere rimuovere togliere',
 a:'Puoi aggiungere 16 clienti, 10 lead e 56 opportunità di prova (email fittizie) e toglierli quando vuoi, senza toccare i tuoi dati veri.',
 s:['Menu → Impostazioni → Backup, accessi ed esempi.','Tocca «Aggiungi esempi».','Quando hai finito tocca «Rimuovi esempi».'],go:['Vai a Backup ed esempi','set:bk']},
{t:'Profilo dell’azienda',i:['30-set-az'],k:'profilo azienda nome partita iva sede indirizzo telefono sito dati azienda intestazione pdf',
 a:'Nome, partita IVA, sede, telefono e sito dell’azienda compaiono in firma, nei PDF di preventivi e listino e come titolare nell’informativa privacy.',
 s:['Menu → Impostazioni → Profilo azienda.','Compila i campi e tocca Salva.'],go:['Vai a Profilo azienda','set:az']},
{t:'Cambiare tema e colori dell’app',k:'tema temi cambiare tema colori colore aspetto modello layout stile grafica scuro chiaro notte neon arancio giorno standard personalizzare sfondo',
 a:'Il tema si sceglie in Impostazioni → Aspetto: Standard (predefinito), Classico arancio, Notte, Neon e Giorno. La scelta vale su questo telefono e resta salvata anche dopo la chiusura dell’app.',
 s:['Menu → Impostazioni → Aspetto.','Tocca il modello che preferisci: cambia subito.','Per tornare com’era scegli Standard.'],go:['Vai a Aspetto','set:tp']},
{t:'Modificare i dati del titolare nell’informativa privacy',k:'modificare cambiare dinamica dinamico riferimenti dati titolare informativa privacy nome azienda partita iva sede indirizzo di risposta contatti aggiornare automatico testo informativa',
 a:'I riferimenti del titolare nell’informativa (nome azienda, partita IVA, sede e indirizzo di risposta) non si scrivono a mano: si aggiornano da soli quando li modifichi in Profilo azienda e in Posta. Il testo dell’informativa invece è fisso e non si cambia dall’app.',
 s:['Menu → Impostazioni → Profilo azienda: modifica nome, partita IVA e sede, poi Salva.','Menu → Impostazioni → Posta: modifica l’indirizzo di risposta.','Le prossime informative inviate useranno i dati nuovi.'],go:['Vai a Profilo azienda','set:az']},
{t:'Come inviare le email',i:['30-set-em', '12-compose-email'],k:'posta email mail inviare ricevere programma di posta apri posta segna come inviata servizio configurare impostare',
 a:'Le email partono dal programma di posta del tuo telefono: scrivi l’email nell’app, la invii con «Apri posta» (o «Condividi con allegati» se ci sono PDF) e poi tocchi «Segna come inviata». Le risposte dei clienti si registrano a mano. In Impostazioni → Posta imposti indirizzo di risposta, nome del mittente e firma.',
 s:['Menu → Impostazioni → Posta.','Compila indirizzo di risposta, nome del mittente e firma.','Torna indietro e salva.'],go:['Vai a Posta','set:em']},
{t:'Firma e nome del mittente',k:'firma mittente alias nome mittente segnaposto risposta indirizzo di risposta email firma',
 a:'Nome del mittente, indirizzo di risposta e firma si impostano in Posta. Nella firma puoi usare i segnaposto {azienda} e {mittente}.',go:['Vai a Posta','set:em']},
{t:'Messaggi rapidi di WhatsApp',i:['30-set-wa'],k:'whatsapp messaggi rapidi modelli template risposte veloci nome prefisso paese numeri informativa lead',
 a:'In Impostazioni → WhatsApp trovi il prefisso predefinito dei numeri, l’informativa nei messaggi ai lead e i messaggi rapidi: usa {nome} per inserire il nome del cliente. Compaiono come pulsanti quando scrivi.',go:['Vai a WhatsApp','set:wa']},
{t:'Brochure da allegare',i:['30-set-al'],k:'brochure allegare allegato pdf link file caricare opuscolo catalogo google drive dropbox onedrive',
 a:'La brochure può essere un file PDF (massimo 700 KB, oltre viene compresso in zip) oppure un link a un PDF raggiungibile da chiunque. Nelle email va come file, su WhatsApp come link.',
 s:['Menu → Impostazioni → Allegati e brochure.','Scegli File e carica il PDF, oppure Link e incolla l’indirizzo.','Per Drive, Dropbox o OneDrive: condividi con «Chiunque abbia il link» e incolla il link.'],go:['Vai ad Allegati e brochure','set:al']},
{t:'Allegare il listino prezzi',k:'allegare listino prezzi pdf cliente mandare inviare listino costi catalogo riserva',
 a:'Nell’email al cliente scegli l’allegato «Listino prezzi»: l’app genera un PDF con i prezzi validi per quel cliente (listino attivo, altrimenti catalogo). I costi non compaiono mai.'},
{t:'Validità e condizioni dei preventivi',i:['30-set-pr'],k:'validita condizioni predefinite preventivi giorni scadenza impostazioni preventivo',
 a:'In Impostazioni → Preventivi imposti validità (giorni) e condizioni predefinite. Valgono per i nuovi preventivi: quelli già creati non cambiano.',go:['Vai a Preventivi','set:pr']},
{t:'Creare un cliente',i:['04-clienti', '13-nuova-anagrafica'],k:'nuovo cliente creare aggiungere anagrafica inserire cliente salvare persona azienda',
 a:'Dalla scheda Clienti tocca il tasto verde +, scegli Persona o Azienda e compila i dati. Nella scheda Privacy indica come hai raccolto i dati e se hai fornito l’informativa, poi salva.',
 s:['Clienti → tasto verde +.','Scegli Persona o Azienda e compila i dati.','Scheda Privacy: indica la fonte e spunta «Informativa privacy fornita» (oppure «Invierò l’informativa più tardi»).','Salva con il tasto verde con la spunta.'],go:['Vai a Clienti','clienti']},
{t:'Creare un cliente da un biglietto da visita',k:'biglietto visita foto fotografare scansione scanner fotocamera carta leggere dati',
 a:'Puoi fotografare un biglietto da visita: l’app ricava i dati e li propone nella scheda, che poi controlli e salvi.',
 s:['Nell’elenco Clienti tocca il tasto con la fotocamera accanto alla ricerca (oppure «Fotografo un biglietto da visita» dai Primi passi).','Scatta o scegli la foto.','Controlla i dati, completa la Privacy e salva.'],go:['Vai a Clienti','clienti']},
{t:'Informativa privacy e consensi',i:['06-cliente-privacy', '30-set-pv'],k:'informativa privacy consensi consenso marketing gdpr base giuridica fonte dati fornita inviare richiesta risposta pulsanti',
 a:'Nella scheda Privacy del cliente registri fonte dei dati, base giuridica, informativa fornita (modalità e data) e i consensi facoltativi. Puoi inviare l’informativa per email o WhatsApp: il cliente risponde con i pulsanti dei consensi e tu registri la risposta nella scheda Privacy.',
 s:['Apri il cliente → Privacy.','Invia l’informativa per email.','Il cliente risponde con i pulsanti dell’email.','Registra la risposta nella scheda Privacy.'],go:['Vai a Privacy e conservazione','set:pv']},
{t:'Diritti dell’interessato: copiare o cancellare i dati',k:'diritti interessato copia dati portabilita accesso cancellare eliminare cancellazione cliente cestino registro modifiche',
 a:'Nella scheda Privacy del cliente puoi copiare i suoi dati (accesso e portabilità). Per cancellarlo usa il cestino nella scheda Dati. Le operazioni sulla privacy finiscono nel registro delle modifiche.'},
{t:'Clienti duplicati',k:'duplicato duplicati duplicata email telefono gia usato esiste univocita errore salvare',
 a:'Se email o telefono coincidono con un altro cliente, l’app avvisa del duplicato. L’anagrafica che stai salvando non viene mai confrontata con se stessa.'},
{t:'Preferiti',k:'preferiti preferito stella segnare importanti',
 a:'La stella in alto nella scheda del cliente lo segna come preferito. I preferiti sono anche un segmento pronto in Marketing.'},
{t:'Cercare un cliente, un lead o un prodotto',i:['04-clienti'],k:'cercare ricerca trovare cerca filtro nome telefono azienda codice',
 a:'In ogni elenco c’è la barra «Cerca»: nei clienti cerca per nome, azienda e telefono; nei lead per nome, email e telefono; nei prodotti per codice o nome; nelle opportunità per titolo o cliente.'},
{t:'Registrare un lead da un modulo',i:['15-lead-lista', '41-nuovo-lead'],k:'nuovo lead creare registrare modulo form sito incollare ricava dati richiesta',
 a:'Nella scheda Lead tocca «Nuovo lead», incolla l’email o il messaggio del modulo e tocca «Ricava i dati»: nome, email, telefono e richiesta vengono compilati. Poi scegli Persona o Azienda e salva.',
 s:['Lead → Nuovo lead.','Incolla il messaggio e tocca «Ricava i dati».','Controlla e salva.'],go:['Vai a Lead','lead']},
{t:'Rispondere a un lead',i:['17-lead-contatti'],k:'rispondere lead risposta scrivere lead contattare informativa brochure allegati',
 a:'Apri il lead → Contatti e scrivi un’email o un messaggio WhatsApp. Puoi includere l’informativa privacy (testo completo o versione breve) e allegare brochure e listino. I messaggi restano nella scheda del lead.',go:['Vai a Lead','lead']},
{t:'Trasformare un lead in cliente',i:['42-converti-lead'],k:'convertire conversione lead cliente prospect trasformare promuovere',
 a:'Apri il lead e scegli «Converti in prospect», poi indica se è Persona fisica o Azienda. Il lead diventa un’anagrafica in Clienti con la sua storia di contatti.',go:['Vai a Lead','lead']},
{t:'Pulizia automatica dei lead',i:['30-set-ld'],k:'lead scartati eliminare automatica pulizia giorni mesi nuovi cancellazione automatica',
 a:'In Impostazioni → Lead decidi dopo quanti giorni vengono eliminati i lead scartati e dopo quanti mesi quelli nuovi mai lavorati.',go:['Vai a Impostazioni Lead','set:ld']},
{t:'Creare un’opportunità',i:['43-nuova-opportunita'],k:'nuova opportunita creare aprire trattativa vendita affare deal titolo valore probabilita prodotti',
 a:'Dalla scheda Opportunità (o dalla scheda Opportunità del cliente) tocca «Nuova opportunità»: scrivi il titolo, scegli cliente e fase, aggiungi i prodotti (il valore si calcola con il listino del cliente) e salva.',go:['Vai a Opportunità','opp']},
{t:'Le fasi e il kanban',i:['19-opp-kanban', '18-opp-lista'],k:'fasi fase kanban pipeline avanzare spostare nuova qualificata negoziazione vinta persa probabilita colonne elenco vista',
 a:'Le fasi sono Nuova (10%), Qualificata (25%), Negoziazione (50%), Vinta (100%) e Persa (0%). Puoi vedere le opportunità in elenco o in kanban; nel kanban usi le frecce «Fase precedente» e «Fase successiva» sulla scheda, oppure apri l’opportunità e cambi la Fase.',go:['Vai a Opportunità','opp']},
{t:'Creare e inviare un preventivo',i:['20-opp-scheda', '36-preventivo'],k:'preventivo preventivi offerta cliente mandare creare nuovo inviare pdf numero bozza stato accettato rifiutato scaduto validita condizioni',
 a:'Nell’opportunità, con almeno un prodotto, tocca «Nuovo preventivo»: nasce con numero progressivo annuale (es. 2026-001). Controlla righe, validità e condizioni, imposta lo stato (Bozza, Inviato, Accettato, Rifiutato) e invia il PDF per email o WhatsApp.',
 s:['Apri l’opportunità e aggiungi i prodotti.','Tocca «Nuovo preventivo».','Controlla righe, validità e condizioni.','Imposta lo stato e invia il PDF.'],go:['Vai a Opportunità','opp']},
{t:'Prezzi non aggiornati sul preventivo',k:'prezzi non aggiornati preventivo inviato listino cambiato sconto riallineare ricalcolo automatico',
 a:'Finché è in bozza il preventivo segue listini e sconti correnti. Un preventivo inviato non cambia da solo: se i prezzi sono rimasti indietro l’app lo segnala con «Prezzi non aggiornati».'},
{t:'Il margine',k:'margine costo guadagno ricavo utile percentuale vedere cliente',
 a:'Il margine (prezzo meno costo) è visibile solo a te: non compare mai nel preventivo né negli allegati. Il costo si imposta nella scheda prodotto.'},
{t:'Registrare una chiamata',i:['08-cliente-chiamate', '14-foglio-chiamata'],k:'chiamata chiamare telefonare registrare esito durata nota richiamare telefono pulsante come e andata',
 a:'Tocca il pulsante rotondo del telefono nella scheda del cliente (o «Chiama» in Contatti → Chiamate). Al ritorno nell’app compare «Com’è andata la chiamata?»: scegli l’esito (Ha risposto, Non risponde, Occupato, Segreteria, Numero errato), correggi la durata, scrivi una nota e, se vuoi, imposta «Richiama il».',
 s:['Apri il cliente e tocca il telefono.','Al ritorno scegli l’esito.','Correggi durata e nota.','Facoltativo: «Richiama il».','Conferma.'],go:['Vai a Clienti','clienti']},
{t:'Aggiungere una chiamata a mano',i:['46-chiamata-manuale'],k:'chiamata manuale aggiungere dopo gia fatta data ora registrare a posteriori',
 a:'In Contatti → Chiamate tocca «Registra»: inserisci data e ora, esito, durata e nota.'},
{t:'Da fare e richiami',i:['01-home'],k:'da fare richiamare richiamo promemoria scadenze azioni compleanno cose to do attivita oggi',
 a:'In Home il riquadro «Da fare» raccoglie i richiami impostati, i compleanni dei prossimi 7 giorni, le informative da inviare, le richieste di consenso scadute, i lead da valutare, le chiusure previste scadute e i preventivi da creare, sollecitare o aggiornare.',go:['Vai alla Home','home']},
{t:'Scrivere un’email o un WhatsApp a un cliente',i:['07-cliente-contatti'],k:'scrivere email mail whatsapp messaggio cliente inviare comporre contatti allegati brochure',
 a:'Dalla scheda Contatti del cliente tocchi «Email» o «WhatsApp». Per l’email puoi partire da un modello pronto e scegliere in fondo gli allegati (listino, brochure, informativa); con il programma di posta del telefono la invii con «Apri posta» e poi tocchi «Segna come inviata». Per WhatsApp tocchi un messaggio rapido e poi «Apri WhatsApp e registra». I messaggi restano registrati nella scheda.'},
{t:'La Storia del cliente',i:['10-cliente-storia'],k:'storia cronologia timeline eventi cliente cosa e successo contatti passati',
 a:'La scheda Storia riunisce in un’unica cronologia email, WhatsApp, chiamate e altri eventi del cliente o del lead.'},
{t:'Gli Acquisti del cliente',i:['11-cliente-acquisti'],k:'acquisti acquistato comprato ordini riacquisto totale prossimo acquisto prodotti riacquistati cliente storico',
 a:'Per vedere cosa ha acquistato un cliente apri la sua scheda e tocca Acquisti: calcola sulle opportunità vinte il totale acquistato, gli ordini, il riacquisto medio con la stima del prossimo acquisto, il margine e i prodotti riacquistati.',
 s:['Tocca Clienti e apri il cliente.','Nella barra in alto della scheda tocca Acquisti.','Leggi totale, ordini e prossimo acquisto; più in basso trovi l’elenco dei prodotti acquistati e delle transazioni.'],go:['Vai a Clienti','clienti']},
{t:'Inserire un prodotto',i:['21-prodotti', '22-scheda-prodotto'],k:'prodotto nuovo inserire aggiungere catalogo articolo prezzo costo iva unita categoria codice',
 a:'Menu → Prodotti → Catalogo: aggiungi il prodotto con nome, categoria, prezzo, costo (solo per te), IVA e unità, poi salva.',go:['Vai al Catalogo','prod:cat']},
{t:'Creare un listino',i:['23-prodotti-listini', '44-listino-modifica'],k:'listino listini creare nuovo sconto percentuale paesi scaglioni quantita ristorazione attivare prezzi cliente',
 a:'Un listino ha un nome, uno stato attivo, i paesi a cui si applica (vuoto = generale), una variazione percentuale sul catalogo e sconti a scaglioni per quantità. Il catalogo fa da riserva solo se per quel cliente non c’è un listino attivo.',
 s:['Prodotti → Listini → aggiungi.','Dai un nome e imposta variazione e scaglioni.','Lascia i paesi vuoti per applicarlo a tutti.','Attivalo.'],go:['Vai ai Listini','prod:lst']},
{t:'Sconto massimo',k:'sconto massimo limite sconti tetto massimo percentuale consentito',
 a:'Nella pagina Listini imposti lo «Sconto massimo senza approvazione»: oltre quella soglia serve l’approvazione per chiudere un’opportunità come vinta; con 0 non c’è controllo.',go:['Vai ai Listini','prod:lst']},
{t:'Magazzino e giacenze',i:['24-prodotti-magazzino'],k:'magazzino giacenze scorta movimenti carico scarico quantita disponibile inventario',
 a:'Menu → Prodotti → Magazzino: Giacenze mostra la scorta per prodotto, con i tasti per carico, scarico, inventario e scorta minima; Movimenti mostra lo storico. Dopo un’opportunità vinta, in Home compare «Scarica il magazzino».',go:['Vai al Magazzino','prod:mag']},
{t:'Analytics',i:['27-analytics-funnel'],k:'analytics statistiche report funnel engagement conversione lead cliente opportunita vinte perse ciclo medio consensi riattivare',
 a:'Menu → Analytics ha due viste. Funnel: lead diventati clienti per fonte e tasso delle opportunità (create, aperte, vinte, perse, ciclo medio). Engagement: clienti attivi o fermi, messaggi del periodo, consensi ed elenco «Da riattivare». Ogni riquadro ha la (i) con la spiegazione.',go:['Apri Analytics','an']},
{t:'Marketing: segmenti e campagne',i:['25-marketing-segmenti', '26-marketing-campagne'],k:'marketing segmenti segmento campagne campagna compleanno auguri richiesta consensi stop gruppi clienti fermi riattivare',
 a:'Menu → Marketing: i Segmenti sono gruppi di clienti definiti da condizioni (ce ne sono di pronti, e puoi crearne di tuoi con «Nuovo segmento»). Le Campagne sono azioni automatiche con interruttore, come gli auguri di compleanno e la richiesta consensi. Chi risponde STOP perde subito il consenso al marketing.',go:['Apri Marketing','mkt']},
{t:'Home e totali',i:['01-home'],k:'home cruscotto totali aperte ponderato pipeline vinte periodo 30 giorni 90 giorni margine',
 a:'La Home mostra i contatori, i totali Aperte e Ponderato (valore × probabilità), la Pipeline per fase, le Vinte con filtro 30 giorni / 90 giorni / 12 mesi / Sempre e l’elenco «Da fare».',go:['Vai alla Home','home']},
{t:'Blocco con Face ID, impronta o PIN',i:['30-set-sc'],k:'face id biometria impronta pin blocco bloccare app sicurezza sblocco accesso emergenza touch id',
 a:'Impostazioni → Accesso e sicurezza: scegli un PIN di emergenza (4–8 cifre), tocca «Attiva con biometria» e scegli quando bloccare l’app (all’apertura, appena esci, dopo 1, 5 o 15 minuti). Il blocco protegge l’apertura dell’app, non i dati salvati.',go:['Vai ad Accesso e sicurezza','set:sc']},
{t:'PIN dimenticato',k:'pin dimenticato dimenticato recuperare reset emergenza non ricordo',
 a:'Il PIN di emergenza non si può recuperare: se lo dimentichi dovrai cancellare i dati del sito. Per questo conviene avere un backup recente.',go:['Vai a Backup','set:bk']},
{t:'Cifratura dei dati e chiave di recupero',i:['30-set-cl'],k:'cifratura cifrare passphrase chiave recupero cloud sincronizzazione sicurezza dati crittografia password persa',
 a:'I dati nel cloud vengono cifrati sul telefono prima dell’invio. Scegli una passphrase di almeno 10 caratteri e conserva la chiave di recupero fuori dal telefono (gestore di password o carta). Se perdi sia la passphrase sia la chiave, i dati cifrati non si possono recuperare da nessuno.',go:['Vai ad Account','set:cl']},
{t:'Fare un backup',i:['34-impostazioni-backup'],k:'backup esportare esporta salvare copia file password backup cifrato',
 a:'Impostazioni → Backup, accessi ed esempi: imposta la password dei backup (AES-256), conservala in un gestore di password e tocca «Esporta». Il file è cifrato e conserva anche data e utente di creazione e modifica di ogni record.',
 s:['Imposta la password dei backup.','Tocca «Esporta».','Conserva il file e la password.'],go:['Vai a Backup','set:bk']},
{t:'Ripristinare un backup',k:'ripristinare ripristino importare importa backup recuperare dati file password unire',
 a:'In Backup, accessi ed esempi tocca «Importa», scegli il file e inserisci la password. I record si uniscono per identificativo: se esiste già un record uguale vince quello del file.',go:['Vai a Backup','set:bk']},
{t:'Data e utente di creazione e modifica',k:'data creazione modifica utente chi ha creato ultimo aggiornamento aggiornato creato da record',
 a:'Ogni record porta data e utente di creazione e di ultima modifica. Restano anche dopo un export e re-import del backup.'},
{t:'Conservazione dei dati',k:'conservazione dati mesi durata cancellare automaticamente privacy retention fiscali contrattuali profilazione messaggi',
 a:'In Impostazioni → Privacy e conservazione imposti i mesi di conservazione per categoria (dati contrattuali e fiscali, contatti senza contratto, consensi di marketing, profilazione, messaggi registrati). Sono valori indicativi: fai verificare a un consulente o al DPO.',go:['Vai a Privacy e conservazione','set:pv']},
{t:'Versione e aggiornamenti',i:['32-info'],k:'versione aggiornare aggiornamento info novita ultima versione app aggiornata',
 a:'L’app si aggiorna da sola quando la riapri con connessione. La versione installata si legge in Menu → Info.',go:['Apri Info','info']}
];
const STOP=new Set('il lo la i gli le un uno una di a da in con su per tra fra e o ma che chi come posso puoi si mi ti ci ho hai devo del dello della dei degli delle dal dalla dai dalle al allo alla ai agli alle nel nella nei nelle sul sulla sui non e è cosa quale quali quando dove perche mio mia miei mie tuo tua anche piu più molto poi solo se ora qui qua c l d è sono vorrei voglio vuole puo può possibile modo dove-si cosi'.split(' '));
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ');
const SYN={mando:'invio',mandare:'invio',manda:'invio',mandi:'invio',inviare:'invio',invia:'invio',inviarlo:'invio',spedire:'invio',spedisco:'invio',creo:'creare',crea:'creare',creiamo:'creare',faccio:'fare',fai:'fare',facciamo:'fare',aggiungo:'aggiungere',inserisco:'inserire',cancello:'eliminare',cancellare:'eliminare',elimino:'eliminare',telefonata:'chiamata',telefonate:'chiamata',contatto:'cliente',contatti:'contatti'};
const stem=w=>w.length>6?w.slice(0,6):w.length>4?w.slice(0,5):w;
const toks=s=>norm(s).split(/\s+/).filter(w=>w&&!STOP.has(w)&&(w.length>2||/^\d+$/.test(w))).map(w=>stem(SYN[w]||w));
const DOC=KB.map(e=>({t:new Set(toks(e.t)),k:new Set(toks(e.k)),b:new Set(toks(e.a+' '+(e.s||[]).join(' ')))}));
const DF={};DOC.forEach(d=>new Set([...d.t,...d.k,...d.b]).forEach(w=>DF[w]=(DF[w]||0)+1));
const idf=w=>Math.log(1+KB.length/(DF[w]||1));
function rank(q){const qt=[...new Set(toks(q))];if(!qt.length)return[];
 return KB.map((e,i)=>{const d=DOC[i];let s=0,hit=0;qt.forEach(w=>{let x=0;if(d.t.has(w))x=3;else if(d.k.has(w))x=2.4;else if(d.b.has(w))x=1;if(x){hit++;s+=x*idf(w)}});
   const cov=hit/qt.length;return{e,i,s:s*(0.4+0.6*cov),hit}}).filter(r=>r.hit>0).sort((a,b)=>b.s-a.s)}
function local(q){const r=rank(q);if(!r.length||r[0].s<2.2)return null;
 const top=r[0],more=r.slice(1,4).filter(x=>x.s>=top.s*.55&&x.s>=2.2).slice(0,2);
 return{e:top.e,more:more.map(x=>x.e)}}
const GO={home:()=>setTab('home'),clienti:()=>setTab('clienti'),lead:()=>setTab('lead'),opp:()=>setTab('opp'),mkt:()=>setTab('mkt'),an:()=>openAn(),info:()=>openInfo(),help:()=>openHelp(),
 'prod:cat':()=>{setTab('prod');window.pSec='cat';paintPSec()},'prod:lst':()=>{setTab('prod');window.pSec='lst';paintPSec()},'prod:mag':()=>{setTab('prod');window.pSec='mag';paintPSec()}};
['az','cl','em','wa','al','pr','ld','pv','sc','bk'].forEach(k=>GO['set:'+k]=()=>{openSettings();setSp(k)});
const STARTERS=['Come creo un cliente?','Come mando un preventivo?','Come faccio il backup?','Come invio un’email?','Come registro una chiamata?'];
let M=null,box=null,inp=null,started=false;
function bubble(cls){const d=h('div','ab '+cls);box.append(d);return d}
function scroll(){box.scrollTop=box.scrollHeight}
function userMsg(t){bubble('u').textContent=t;scroll()}
function say(res,q){const d=bubble('a');
 if(!res){d.append(h('p','','Non ho trovato una risposta a questa domanda nel manuale. Prova con altre parole, oppure scegli un argomento:'));
  const c=h('div','ach');['Clienti','Lead','Opportunità','Preventivi','Listini','Backup','Posta','Sicurezza'].forEach(w=>{const b=h('button','chip',w);b.type='button';b.onclick=()=>ask(w);c.append(b)});d.append(c);const rp=h('button','chip','Segnala questa domanda');rp.type='button';rp.onclick=()=>{const w=h('div','afb');const ok=h('button','btn lbl');ok.type='button';ok.textContent='Invia';ok.onclick=async()=>{ok.disabled=true;const r=await sendFb({kb:'(nessuna risposta)',rating:'down',q:cleanQ(q),nores:true});w.innerHTML='';w.append(h('span','afs',r?'Grazie, preparerò una guida.':'Non inviato: serve connessione e account attivo.'))};w.append(qNote(q),ok);rp.replaceWith(w);scroll()};d.append(rp);scroll();return}
 const e=res.e;d.append(h('b','',e.t));{let ol=null;String(e.a).split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(l=>{const m=l.match(/^\d+[.)]\s+(.*)$/);if(m){if(!ol){ol=h('ol');d.append(ol)}ol.append(h('li','',m[1]))}else{ol=null;d.append(h('p','',l))}})}
 if(e.s){const ol=h('ol');e.s.forEach(x=>ol.append(h('li','',x)));d.append(ol)}
 if(e.i&&e.i.length){const g=h('div','aim');e.i.slice(0,2).forEach(n=>{const im=h('img');im.src='guida/'+n+'.webp';im.alt='Schermata: '+e.t;im.loading='lazy';im.onload=scroll;im.onerror=()=>g.contains(im)&&im.remove();im.onclick=()=>zoom(im.src,im.alt);g.append(im)});d.append(g)}
 if(e.go){const b=h('button','btn lbl ago');b.type='button';b.innerHTML=ICONS.chevR+'<span>'+e.go[0]+'</span>';b.onclick=()=>{close();GO[e.go[1]]&&GO[e.go[1]]()};d.append(b)}
 if(res.more&&res.more.length){d.append(h('span','asee','Vedi anche'));const c=h('div','ach');res.more.forEach(m=>{const b=h('button','chip',m.t);b.type='button';b.onclick=()=>show(m);c.append(b)});d.append(c)}
 if(e.ai)d.append(h('p','afn','Risposta generata con l’IA dal manuale di KRANG CRM. Se qualcosa non torna, usa il pollice in giù.'));
 else if(aiNote){d.append(h('p','afn',aiNote));aiNote=''}
 fbBar(d,e,q);scroll()}
function cleanQ(q){return String(q||'').normalize('NFKC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g,' ').replace(/https?:\/\/\S+|www\.\S+/gi,'[link]').replace(/[\w.+-]{1,64}@[\w-]{1,63}(?:\.[\w-]{1,63}){1,5}/g,'[email]').replace(/\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi,'[codice]').replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/gi,'[codice]').replace(/\+?\d[\d\s().\/-]{4,}\d/g,'[numero]').replace(/\s+/g,' ').trim().slice(0,200)}
async function sendFb(row){row.app_ver=((document.querySelector('meta[name=app-version]')||{}).content||'').split('|')[0].slice(0,20);try{if(typeof SB==='undefined'||!SB.has()||!SB.fb)throw 0;await SB.fb(row);return true}catch(x){return false}}
function qNote(q){return h('p','afn','Verrà inviata anche la tua domanda: «'+cleanQ(q)+'». Numeri ed email sono nascosti; non scrivere nomi di clienti.')}
function fbBar(d,e,q){const w=h('div','afb');const R=[['off','Non coerente con la domanda'],['err','Guida errata'],['nofunz','Non funziona come descritto'],['inc','Incompleta o poco chiara'],['alt','Altro']];
 const TH='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v9H4v-9h3zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.7 9H19a1.5 1.5 0 0 1 1.5 1.8l-1.3 7A2 2 0 0 1 17.2 19.500H7"/></svg>';
 const send=(r,why)=>{const row={kb:(e.kb||e.t).slice(0,120),rating:r};if(why){row.reason=why;row.q=cleanQ(q)}return sendFb(row)};
 const done=t=>{w.innerHTML='';w.append(h('span','afs',t))};
 const mk=(l,c)=>{const b=h('button','afb1'+(c?' dn':''));b.type='button';b.setAttribute('aria-label',l);b.innerHTML=TH;return b};
 const up=mk('Risposta utile'),dn=mk('Risposta non utile',1);
 up.onclick=()=>{done('Grazie!');send('up')};
 dn.onclick=()=>{w.innerHTML='';const sel=h('select','afsel');const o0=h('option','','Cosa non va? (facoltativo)');o0.value='';sel.append(o0);R.forEach(r=>{const o=h('option','',r[1]);o.value=r[0];sel.append(o)});
  const b=h('button','btn lbl');b.type='button';b.textContent='Invia';b.onclick=async()=>{b.disabled=true;const ok=await send('down',sel.value);done(ok?'Grazie, miglioreremo la guida.':'Non inviato: serve connessione e account attivo.')};w.append(sel,qNote(q),b);scroll()};
 w.append(up,dn);d.append(w)}
function zoom(src,alt){const z=h('div','azoom');const im=h('img');im.src=src;im.alt=alt;const x=h('button','btn ic');x.type='button';x.setAttribute('aria-label','Chiudi immagine');x.innerHTML=ICONS.x;z.onclick=()=>z.remove();z.append(im,x);M.append(z)}
function show(e){userMsg(e.t);say({e:e,more:[]})}
let aiOff=false,aiNote='';
const AIMSG={limit:'Hai usato le domande con IA di oggi: continuo a rispondere dal manuale.'};
async function viaAI(q){
 if(aiOff||typeof SB==='undefined'||!SB.has()||!SB.ai||navigator.onLine===false)return null;
 const c=rank(q).slice(0,4);if(!c.length)return null;
 try{
  const r=await SB.ai({q:cleanQ(q),ctx:c.map(x=>({t:x.e.t,a:x.e.a,s:x.e.s||[]}))});
  if(!r||typeof r.answer!=='string'||!r.answer.trim())return null;
  const u=Number.isInteger(r.used)&&r.used>=0&&r.used<c.length?c[r.used].e:null;
  if(!u)return null;
  const more=c.map(x=>x.e).filter(e=>e!==u).slice(0,2);
  return{e:{t:u.t,a:r.answer.trim(),i:u.i,go:u.go,ai:true,kb:'IA: '+u.t},more}
 }catch(x){
  if(x&&(x.status===429)){aiOff=true;aiNote=AIMSG.limit}
  else if(x&&(x.status===503||x.status===401||x.status===404||x.code==='offline'))aiOff=true;
  return null}}
async function answer(q){if(ASK.remote){try{const r=await ASK.remote(q);if(r&&r.e)return r}catch(x){}}
 const a=await viaAI(q);if(a)return a;return local(q)}
async function ask(q){q=String(q||'').trim().slice(0,300);if(!q)return;inp.value='';userMsg(q);const w=bubble('a');w.textContent='…';scroll();const r=await answer(q);w.remove();say(r,q)}
function close(){if(M)M.hidden=true}
function open(){
 if(!M){M=document.createElement('div');M.className='modal';M.id='mAsk';M.hidden=true;
  const bx=h('div','box askbox');bx.setAttribute('role','dialog');bx.setAttribute('aria-label','Assistente');
  const top=h('div','atop'),bk=h('button','btn ic');bk.type='button';bk.setAttribute('aria-label','Chiudi');bk.innerHTML=ICONS.back;bk.onclick=()=>{close();openHelp()};
  top.append(bk,h('b','','Assistente'));
  box=h('div','achat');
  const bar=h('form','abar');inp=h('input','search');inp.type='text';inp.maxLength=300;inp.placeholder='Chiedi come si fa una cosa…';inp.setAttribute('aria-label','Domanda');inp.autocomplete='off';
  const sb=h('button','btn p ic');sb.type='submit';sb.setAttribute('aria-label','Invia');sb.innerHTML=ICONS.chevR;bar.append(inp,sb);bar.onsubmit=e=>{e.preventDefault();ask(inp.value)};
  bx.append(top,box,bar);M.append(bx);document.body.append(M);
  if(!document.getElementById('askCss')){const st=document.createElement('style');st.id='askCss';st.textContent='#mAsk{z-index:26;padding:0;place-items:stretch;grid-template-rows:minmax(0,1fr)}#mAsk .afb{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}#mAsk .afb1{background:none;border:0;color:inherit;opacity:.55;padding:6px;display:grid;place-items:center}#mAsk .afb1.dn svg{transform:rotate(180deg)}#mAsk .afsel{flex:1 1 100%;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--line,#ddd);background:transparent;color:inherit}#mAsk .afta{flex:1 1 100%;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--line,#ddd)}#mAsk .afn{flex:1 1 100%;margin:0;font-size:12px;opacity:.75}#mAsk .aim{display:flex;gap:8px;margin-top:10px;overflow-x:auto}#mAsk .aim img{height:220px;width:auto;border-radius:12px;border:1px solid var(--line,#e4e8f2);flex:none;cursor:zoom-in}#mAsk .azoom{position:fixed;inset:0;z-index:30;background:rgba(0,20,40,.88);overflow:auto;display:grid;place-items:start center;padding:56px 12px 24px}#mAsk .azoom img{width:min(100%,480px);height:auto;border-radius:14px}#mAsk .azoom .btn{position:fixed;top:12px;right:12px}#mAsk .afs{font-size:13px;opacity:.7}#mAsk .askbox{max-width:440px;width:100%;margin:0 auto;height:100%;min-height:0;overflow:hidden;display:flex;flex-direction:column;border-radius:0;padding:12px 14px;background:var(--bg)}#mAsk .atop{display:flex;align-items:center;gap:12px;padding:4px 0 10px;font-size:18px}#mAsk .btn.ic{padding:10px;width:44px;height:44px}#mAsk .achat{flex:1;overflow:auto;display:flex;flex-direction:column;gap:10px;padding:4px 0 10px}#mAsk .ab{max-width:88%;padding:10px 13px;border-radius:16px;font-size:15px;line-height:1.4;box-shadow:var(--sh)}#mAsk .ab p{margin:4px 0}#mAsk .ab ol{margin:6px 0 4px;padding-left:20px}#mAsk .ab.u{align-self:flex-end;background:var(--accent)}#mAsk .ab.a{align-self:flex-start;background:var(--surface)}#mAsk .ago{margin-top:8px;display:flex;gap:6px;align-items:center;justify-content:center;padding:10px 14px}#mAsk .ago svg{width:18px;height:18px}#mAsk .asee{display:block;margin:10px 0 4px;font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em}#mAsk .ach{display:flex;flex-wrap:wrap;gap:6px}#mAsk .chip{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:999px;padding:7px 12px;font-size:13px;font-weight:600;cursor:pointer}#mAsk .abar{display:flex;gap:8px;padding-top:8px}#mAsk .abar input{flex:1;min-width:0}#mAsk .anote{font-size:12px;color:var(--muted);margin:2px 2px 6px}';document.head.append(st)}}
 M.hidden=false;
 if(!started){started=true;const d=bubble('a');d.append(h('b','','Ciao! Chiedimi come si fa una cosa.'),h('p','','Rispondo dal manuale di KRANG CRM. Le risposte vengono formulate da un’IA che riceve solo la tua domanda (senza numeri ed email) e le guide dell’app: non vede i dati dei tuoi clienti.'));
  const c=h('div','ach');STARTERS.forEach(w=>{const b=h('button','chip',w);b.type='button';b.onclick=()=>ask(w);c.append(b)});d.append(c)}
 setTimeout(()=>{try{inp.focus()}catch(x){}},50)}
window.ASK={open,answer:local,rank,remote:null,size:KB.length};
})();
