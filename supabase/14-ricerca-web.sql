-- KRANG CRM 1.29.0: quota della ricerca web (Tavily, piano gratuito 1000 ricerche al mese). Contatore separato dall'Assistente.
create table if not exists public.web_usage(
  day date not null default (now() at time zone 'utc')::date,
  user_id uuid not null,
  n int not null default 0,
  primary key (day,user_id)
);
alter table public.web_usage enable row level security;
revoke all on public.web_usage from anon, authenticated;
-- 'ok' (conta), 'user' (tetto personale) o 'global' (tetto di tutti, giornaliero)
create or replace function public.web_take(user_lim int default 10, global_lim int default 30) returns text
language plpgsql security definer set search_path=public as $$
declare d date:=(now() at time zone 'utc')::date; u uuid:=auth.uid(); mine int; tot int;
begin
  if u is null then return 'user'; end if;
  user_lim:=least(coalesce(user_lim,10),50); global_lim:=least(coalesce(global_lim,30),100);
  select coalesce(sum(n),0) into tot from public.web_usage where day=d;
  if tot>=global_lim then return 'global'; end if;
  insert into public.web_usage(day,user_id,n) values(d,u,0) on conflict do nothing;
  select n into mine from public.web_usage where day=d and user_id=u for update;
  if mine>=user_lim then return 'user'; end if;
  update public.web_usage set n=n+1 where day=d and user_id=u;
  return 'ok';
end $$;
revoke all on function public.web_take(int,int) from public, anon;
grant execute on function public.web_take(int,int) to authenticated;
