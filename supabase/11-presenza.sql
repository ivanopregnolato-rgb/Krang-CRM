-- KRANG CRM 1.22.0: utenti online (per il monitor del gestore). Si salva solo l'ultimo istante in cui l'app era aperta, senza altri dati.
-- Nessun utente puo' leggere o scrivere la tabella: si passa solo da ping(), al massimo una volta al minuto.
create table if not exists public.presence(
  user_id uuid primary key,
  seen_at timestamptz not null default now(),
  app_ver text check (char_length(app_ver)<=20)
);
alter table public.presence enable row level security;
revoke all on public.presence from anon, authenticated;
create or replace function public.ping(v text default null) returns void
language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid();
begin
  if u is null then return; end if;
  insert into public.presence(user_id,seen_at,app_ver) values(u,now(),left(coalesce(v,''),20))
  on conflict (user_id) do update set seen_at=now(),app_ver=left(coalesce(v,''),20)
  where public.presence.seen_at<now()-interval '50 seconds';
end $$;
revoke all on function public.ping(text) from public, anon;
grant execute on function public.ping(text) to authenticated;
