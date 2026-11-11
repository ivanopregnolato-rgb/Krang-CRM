-- KRANG CRM: quota delle domande all'Assistente con IA (gratis: tetto per utente e tetto globale giornaliero).
-- La tabella non e' leggibile ne' scrivibile dagli utenti: si passa solo da ai_take().
create table if not exists public.ai_usage(
  day date not null default (now() at time zone 'utc')::date,
  user_id uuid not null,
  n int not null default 0,
  primary key (day,user_id)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;

-- Restituisce 'ok' (e conta la domanda), 'user' (tetto personale raggiunto) o 'global' (tetto di tutti raggiunto).
create or replace function public.ai_take(user_lim int default 15, global_lim int default 400) returns text
language plpgsql security definer set search_path=public as $$
declare d date:=(now() at time zone 'utc')::date; u uuid:=auth.uid(); mine int; tot int;
begin
  if u is null then return 'user'; end if;
  user_lim:=least(coalesce(user_lim,15),50); global_lim:=least(coalesce(global_lim,400),450);
  select coalesce(sum(n),0) into tot from public.ai_usage where day=d;
  if tot>=global_lim then return 'global'; end if;
  insert into public.ai_usage(day,user_id,n) values(d,u,0) on conflict do nothing;
  select n into mine from public.ai_usage where day=d and user_id=u for update;
  if mine>=user_lim then return 'user'; end if;
  update public.ai_usage set n=n+1 where day=d and user_id=u;
  return 'ok';
end $$;
revoke all on function public.ai_take(int,int) from public, anon;
grant execute on function public.ai_take(int,int) to authenticated;

-- Quante domande restano oggi (per mostrarlo all'utente)
create or replace function public.ai_left(user_lim int default 15) returns int
language sql security definer set search_path=public stable as $$
  select greatest(0,least(coalesce(user_lim,15),50)-coalesce((select n from public.ai_usage where day=(now() at time zone 'utc')::date and user_id=auth.uid()),0))
$$;
revoke all on function public.ai_left(int) from public, anon;
grant execute on function public.ai_left(int) to authenticated;
-- Pulizia: righe piu' vecchie di 30 giorni (eseguila ogni tanto: delete from public.ai_usage where day<current_date-30;)
