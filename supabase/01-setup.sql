-- CRM: schema per Supabase (multi-utente). Incollalo nel SQL Editor e premi Run.
-- Ogni utente vede e modifica SOLO le proprie righe (row level security).

create table if not exists public.records (
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  col        text not null check (col in ('clienti','opportunita','prodotti','movimenti','lead','config')),
  id         text not null,
  data       jsonb not null default '{}'::jsonb,
  deleted    boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, col, id)
);
create index if not exists records_sync_idx on public.records (user_id, updated_at);

alter table public.records enable row level security;

drop policy if exists "records_select_own" on public.records;
drop policy if exists "records_insert_own" on public.records;
drop policy if exists "records_update_own" on public.records;
drop policy if exists "records_delete_own" on public.records;
create policy "records_select_own" on public.records for select using (user_id = auth.uid());
create policy "records_insert_own" on public.records for insert with check (user_id = auth.uid());
create policy "records_update_own" on public.records for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "records_delete_own" on public.records for delete using (user_id = auth.uid());

-- aggiorna updated_at lato server (non ci si fida dell'orologio del telefono)
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists records_touch on public.records;
create trigger records_touch before insert or update on public.records
  for each row execute function public.touch_updated_at();

-- archivio file privato per foto prodotti/clienti e allegati: ogni utente solo nella propria cartella "<user_id>/..."
insert into storage.buckets (id, name, public) values ('media','media',false) on conflict (id) do nothing;
drop policy if exists "media_own_read"   on storage.objects;
drop policy if exists "media_own_write"  on storage.objects;
drop policy if exists "media_own_update" on storage.objects;
drop policy if exists "media_own_delete" on storage.objects;
create policy "media_own_read"   on storage.objects for select using (bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "media_own_write"  on storage.objects for insert with check (bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "media_own_update" on storage.objects for update using (bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "media_own_delete" on storage.objects for delete using (bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text);

-- cancellazione account richiesta dall'utente (diritto all'oblio): elimina utente, righe e file
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth, storage as $$
begin
  if auth.uid() is null then raise exception 'non autenticato'; end if;
  delete from storage.objects where bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text;
  delete from auth.users where id = auth.uid();   -- le righe di records cadono a cascata
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- aggiornamenti in tempo reale tra i dispositivi dello stesso utente
alter publication supabase_realtime add table public.records;
