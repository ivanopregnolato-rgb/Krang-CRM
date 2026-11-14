-- Attività (task): nuova collezione cifrata come le altre.
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check check (col in ('clienti','opportunita','prodotti','movimenti','lead','config','attivita'));
