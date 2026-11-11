-- KRANG CRM 1.15.0: registro degli accessi (data e tipo di dispositivo, mai l'indirizzo IP).
-- Ogni utente puo' solo aggiungere e leggere i propri accessi; non puo' modificarli ne' cancellarli.
create table if not exists public.access_log(
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  device_id text not null check (device_id ~ '^[0-9a-f]{8,16}$'),
  device text check (char_length(device)<=60 and device !~ '[\x00-\x1f]'),
  kind text not null check (kind in ('login','avvio')),
  app_ver text check (char_length(app_ver)<=20)
);
create index if not exists access_log_user_idx on public.access_log(user_id, created_at desc);
alter table public.access_log enable row level security;
revoke all on public.access_log from anon, authenticated;
grant select on public.access_log to authenticated;
grant insert (device_id,device,kind,app_ver) on public.access_log to authenticated;
drop policy if exists al_select on public.access_log;
create policy al_select on public.access_log for select to authenticated using (user_id=auth.uid());
drop policy if exists al_insert on public.access_log;
create policy al_insert on public.access_log for insert to authenticated with check (user_id=auth.uid());
-- Limiti: massimo 200 accessi al giorno per utente; si conservano solo gli ultimi 100.
create or replace function public.al_limit() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if (select count(*) from public.access_log where user_id=new.user_id and created_at>now()-interval '1 day')>=200 then
    raise exception 'troppi accessi oggi';
  end if;
  delete from public.access_log where user_id=new.user_id and id in
    (select id from public.access_log where user_id=new.user_id order by created_at desc, id desc offset 99);
  return new;
end $$;
revoke execute on function public.al_limit() from public, anon, authenticated;
drop trigger if exists al_limit on public.access_log;
create trigger al_limit before insert on public.access_log for each row execute function public.al_limit();
