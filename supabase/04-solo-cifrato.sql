-- KRANG CRM: da eseguire SOLO quando tutti i tuoi dispositivi hanno la versione 1.6.0 o successiva
-- e hai attivato la cifratura. Da quel momento il database rifiuta qualsiasi dato non cifrato.
-- Prima verifica che non restino righe in chiaro (deve restituire 0):
--   select count(*) from public.records where not deleted and not (data ? '_e');
alter table public.records drop constraint if exists records_solo_cifrato;
alter table public.records add constraint records_solo_cifrato check (deleted or data ? '_e') not valid;
-- "not valid": le righe vecchie non vengono controllate, quelle nuove o modificate si'.
