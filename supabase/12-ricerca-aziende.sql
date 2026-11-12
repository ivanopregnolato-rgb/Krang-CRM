-- KRANG CRM 1.23.0: quota delle ricerche aziende (Wikidata, OpenStreetMap, ricerca Google). Tetto personale giornaliero.
create table if not exists public.search_usage(
  day date not null default (now() at time zone 'utc')::date,
  user_id uuid not null,
  n int not null default 0,
  primary key (day,user_id)
);
alter table public.search_usage enable row level security;
revoke all on public.search_usage from anon, authenticated;
create or replace function public.search_take(user_lim int default 30) returns text
language plpgsql security definer set search_path=public as $$
declare d date:=(now() at time zone 'utc')::date; u uuid:=auth.uid(); mine int;
begin
  if u is null then return 'user'; end if;
  user_lim:=least(coalesce(user_lim,30),100);
  insert into public.search_usage(day,user_id,n) values(d,u,0) on conflict do nothing;
  select n into mine from public.search_usage where day=d and user_id=u for update;
  if mine>=user_lim then return 'user'; end if;
  update public.search_usage set n=n+1 where day=d and user_id=u;
  return 'ok';
end $$;
revoke all on function public.search_take(int) from public, anon;
grant execute on function public.search_take(int) to authenticated;
-- Pulizia ogni tanto: delete from public.search_usage where day<current_date-30;
