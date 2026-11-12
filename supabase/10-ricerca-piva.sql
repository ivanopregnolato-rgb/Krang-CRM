-- KRANG CRM 1.22.0: quota delle ricerche della partita IVA (servizio VIES, gratuito). Tetto personale giornaliero.
create table if not exists public.lookup_usage(
  day date not null default (now() at time zone 'utc')::date,
  user_id uuid not null,
  n int not null default 0,
  primary key (day,user_id)
);
alter table public.lookup_usage enable row level security;
revoke all on public.lookup_usage from anon, authenticated;
create or replace function public.vies_take(user_lim int default 40) returns text
language plpgsql security definer set search_path=public as $$
declare d date:=(now() at time zone 'utc')::date; u uuid:=auth.uid(); mine int;
begin
  if u is null then return 'user'; end if;
  user_lim:=least(coalesce(user_lim,40),100);
  insert into public.lookup_usage(day,user_id,n) values(d,u,0) on conflict do nothing;
  select n into mine from public.lookup_usage where day=d and user_id=u for update;
  if mine>=user_lim then return 'user'; end if;
  update public.lookup_usage set n=n+1 where day=d and user_id=u;
  return 'ok';
end $$;
revoke all on function public.vies_take(int) from public, anon;
grant execute on function public.vies_take(int) to authenticated;
-- Pulizia ogni tanto: delete from public.lookup_usage where day<current_date-30;
