-- Promemoria delle attività con notifica push (1.42.0).
-- Il server conosce SOLO: l'iscrizione push del dispositivo, un codice opaco per promemoria e l'orario di invio.
-- Titoli, note e clienti restano cifrati e non arrivano mai qui; il testo della notifica è generico.
create extension if not exists pg_net with schema extensions;

create table if not exists public.push_subs(
  endpoint text primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  p256dh text not null, auth text not null, ua text,
  created_at timestamptz not null default now());
create index if not exists push_subs_user on public.push_subs(user_id);
alter table public.push_subs enable row level security;
drop policy if exists push_subs_own on public.push_subs;
create policy push_subs_own on public.push_subs for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

create table if not exists public.reminders(
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  rkey text not null, fire_at timestamptz not null, sent_at timestamptz,
  primary key(user_id,rkey));
create index if not exists reminders_due on public.reminders(fire_at) where sent_at is null;
alter table public.reminders enable row level security;
drop policy if exists reminders_own on public.reminders;
create policy reminders_own on public.reminders for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- l'app sostituisce l'elenco dei propri promemoria in un colpo solo
create or replace function public.set_reminders(p jsonb) returns int language plpgsql security invoker set search_path=public as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if p is null or jsonb_typeof(p)<>'array' or jsonb_array_length(p)>500 then raise exception 'bad'; end if;
  delete from reminders where user_id=auth.uid() and rkey not in (select coalesce(left(x->>'k',64),'') from jsonb_array_elements(p) x);
  insert into reminders(user_id,rkey,fire_at)
    select auth.uid(), left(x->>'k',64), (x->>'t')::timestamptz from jsonb_array_elements(p) x where coalesce(x->>'k','')<>''
  on conflict (user_id,rkey) do update set fire_at=excluded.fire_at,
    sent_at=case when reminders.fire_at=excluded.fire_at then reminders.sent_at else null end;
  get diagnostics n=row_count; return n;
end $$;
revoke all on function public.set_reminders(jsonb) from public, anon;
grant execute on function public.set_reminders(jsonb) to authenticated;

-- uso interno della funzione di invio (solo service_role)
create or replace function public.push_secret(n text) returns text language sql security definer set search_path=public,vault as $$
  select decrypted_secret from vault.decrypted_secrets where name=n $$;
revoke all on function public.push_secret(text) from public, anon, authenticated;
grant execute on function public.push_secret(text) to service_role;

create or replace function public.claim_reminders() returns table(uid uuid, n int, subs jsonb) language sql security definer set search_path=public as $$
  with c as (update reminders set sent_at=now() where sent_at is null and fire_at<=now() returning user_id, fire_at),
  f as (select user_id, (count(*) filter (where fire_at>now()-interval '36 hours'))::int n from c group by user_id),
  d as (delete from reminders where sent_at<now()-interval '7 days' returning 1)
  select f.user_id, f.n, coalesce((select jsonb_agg(jsonb_build_object('e',s.endpoint,'p',s.p256dh,'a',s.auth)) from push_subs s where s.user_id=f.user_id),'[]'::jsonb)
  from f where f.n>0 $$;
revoke all on function public.claim_reminders() from public, anon, authenticated;
grant execute on function public.claim_reminders() to service_role;
