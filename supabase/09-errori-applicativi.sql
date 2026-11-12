-- KRANG CRM 1.21.0: console di audit degli errori applicativi.
-- L'app registra solo tipo, messaggio tecnico ripulito (niente email, numeri lunghi, link con dati), pagina, versione e dispositivo.
-- Gli utenti possono SOLO aggiungere righe: non le leggono, non le modificano, non le cancellano. Si leggono dal pannello SQL / connettore.
create table if not exists public.app_errors(
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('js','promise','rete','ai','sync','altro')),
  msg text not null check (char_length(msg)<=300 and msg !~ '[\x00-\x08\x0b-\x1f]'),
  src text check (char_length(src)<=120),
  stack text check (char_length(stack)<=800),
  tab text check (char_length(tab)<=30),
  app_ver text check (char_length(app_ver)<=20),
  device text check (char_length(device)<=60),
  handled boolean not null default false,
  note text check (char_length(note)<=300)
);
create index if not exists app_errors_time_idx on public.app_errors(created_at desc);
create index if not exists app_errors_user_idx on public.app_errors(user_id, created_at desc);
alter table public.app_errors enable row level security;
revoke all on public.app_errors from anon, authenticated;
grant insert (kind,msg,src,stack,tab,app_ver,device) on public.app_errors to authenticated;
drop policy if exists ae_insert on public.app_errors;
create policy ae_insert on public.app_errors for insert to authenticated with check (user_id=auth.uid());
-- Limiti: 40 errori al giorno per utente, 3000 in tutto; si cancellano quelli oltre 90 giorni.
create or replace function public.ae_limit() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if (select count(*) from public.app_errors where user_id=new.user_id and created_at>now()-interval '1 day')>=40 then
    return null;
  end if;
  delete from public.app_errors where created_at<now()-interval '90 days' or id in
    (select id from public.app_errors order by id desc offset 2999);
  return new;
end $$;
revoke execute on function public.ae_limit() from public, anon, authenticated;
drop trigger if exists ae_limit on public.app_errors;
create trigger ae_limit before insert on public.app_errors for each row execute function public.ae_limit();
