-- CRM: rinforzo di sicurezza del database (da eseguire una volta nel SQL Editor, dopo supabase-setup).
-- Si puo' rieseguire senza danni.

-- 1) Nessun permesso al ruolo anonimo sulla tabella: serve sempre un accesso.
revoke all on public.records from anon;
grant select, insert, update, delete on public.records to authenticated;

-- 2) Limiti di dimensione: un record non puo' superare ~1 MB, un id 120 caratteri.
alter table public.records drop constraint if exists records_data_size;
alter table public.records add  constraint records_data_size check (octet_length(data::text) <= 1000000);
alter table public.records drop constraint if exists records_id_len;
alter table public.records add  constraint records_id_len check (char_length(id) between 1 and 120);

-- 3) Tetto di righe per utente (evita che un account riempia il database).
create or replace function public.records_quota() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.records where user_id = new.user_id and col = new.col and id = new.id)
     and (select count(*) from public.records where user_id = new.user_id) >= 50000 then
    raise exception 'limite di righe raggiunto' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists records_quota on public.records;
create trigger records_quota before insert on public.records
  for each row execute function public.records_quota();
revoke all on function public.records_quota() from public, anon, authenticated;

-- 4) Archivio file: solo immagini, massimo 2 MB per file.
update storage.buckets
   set public = false,
       file_size_limit = 2097152,
       allowed_mime_types = array['image/jpeg','image/png','image/webp']
 where id = 'media';

-- 5) Eliminazione account: tollerante se l'archivio rifiuta la cancellazione diretta
--    (i file vengono gia' rimossi dall'app tramite l'API prima di chiamare questa funzione).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth, storage as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'non autenticato'; end if;
  begin
    perform set_config('storage.allow_delete_query', 'true', true);
    delete from storage.objects where bucket_id = 'media' and (storage.foldername(name))[1] = uid::text;
  exception when others then null;
  end;
  delete from public.records where user_id = uid;
  delete from auth.users where id = uid;
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- 6) Le funzioni di servizio non devono essere richiamabili dall'esterno.
revoke all on function public.touch_updated_at() from public, anon, authenticated;

-- 7) L'app legge a intervalli: il canale in tempo reale non serve, lo chiudo.
do $$ begin
  alter publication supabase_realtime drop table public.records;
exception when others then null; end $$;
