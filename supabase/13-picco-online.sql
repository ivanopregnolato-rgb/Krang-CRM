-- KRANG CRM 1.28.0: picco giornaliero di utenti distinti online (per il monitor del gestore). Nessun dato personale: solo giorno e numero.
create table if not exists public.presence_peak(
  day date primary key,
  peak int not null default 0
);
alter table public.presence_peak enable row level security;
revoke all on public.presence_peak from anon, authenticated;
create or replace function public.ping(v text default null) returns void
language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid();
begin
  if u is null then return; end if;
  insert into public.presence(user_id,seen_at,app_ver) values(u,now(),left(coalesce(v,''),20))
  on conflict (user_id) do update set seen_at=now(),app_ver=left(coalesce(v,''),20)
  where public.presence.seen_at<now()-interval '50 seconds';
  insert into public.presence_peak(day,peak)
  select (now() at time zone 'utc')::date, count(*)::int from public.presence where seen_at>now()-interval '5 minutes'
  on conflict (day) do update set peak=greatest(public.presence_peak.peak,excluded.peak);
end $$;
revoke all on function public.ping(text) from public, anon;
grant execute on function public.ping(text) to authenticated;
-- Pulizia ogni tanto: delete from public.presence_peak where day<current_date-90;
