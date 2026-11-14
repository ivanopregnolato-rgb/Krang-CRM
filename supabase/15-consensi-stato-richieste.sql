-- KRANG CRM 1.34.0: la pagina dei consensi mostra lo stato attuale e permette di chiedere portabilita' e anonimizzazione.
-- Lo stato (sì/no e data per ogni consenso, stato delle richieste) e' legato solo all'impronta del link: mai nome o email.
alter table public.consent_links add column if not exists state jsonb not null default '{}';
alter table public.consent_pub add column if not exists vfrom text not null default '';
alter table public.consent_resp add column if not exists kind text not null default 'consensi' check (kind in ('consensi','portabilita','anonimizzazione'));
grant update (state) on public.consent_links to authenticated;
