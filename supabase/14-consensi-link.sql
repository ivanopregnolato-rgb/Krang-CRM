-- KRANG CRM 1.33.0: pagina pubblica per i consensi dei clienti (link personale, sempre valido).
-- Il server non conosce nome ed email del cliente: vede solo l'impronta (SHA-256) del codice nel link e le scelte sì/no.
-- Le risposte restano qui finché l'app dell'utente non le ritira (poi vengono cancellate).
create table if not exists public.consent_pub(
  owner uuid primary key references auth.users(id) on delete cascade,
  az text not null default '',
  info text not null default '',
  ver text not null default '1.0',
  cons jsonb not null default '[]',
  upd timestamptz not null default now()
);
create table if not exists public.consent_links(
  h text primary key check (h ~ '^[0-9a-f]{64}$'),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created timestamptz not null default now()
);
create table if not exists public.consent_resp(
  id bigint generated always as identity primary key,
  h text not null references public.consent_links(h) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  choices jsonb not null,
  ver text not null default '1.0',
  at timestamptz not null default now(),
  ipx text not null default ''
);
create index if not exists consent_resp_owner on public.consent_resp(owner,id);
create index if not exists consent_resp_h on public.consent_resp(h,at);
alter table public.consent_pub enable row level security;
alter table public.consent_links enable row level security;
alter table public.consent_resp enable row level security;
revoke all on public.consent_pub, public.consent_links, public.consent_resp from anon, authenticated;
grant select, insert, update, delete on public.consent_pub to authenticated;
grant select, insert, delete on public.consent_links to authenticated;
grant select, delete on public.consent_resp to authenticated;
create policy consent_pub_own on public.consent_pub for all to authenticated using (owner=auth.uid()) with check (owner=auth.uid());
create policy consent_links_own on public.consent_links for all to authenticated using (owner=auth.uid()) with check (owner=auth.uid());
create policy consent_resp_own_r on public.consent_resp for select to authenticated using (owner=auth.uid());
create policy consent_resp_own_d on public.consent_resp for delete to authenticated using (owner=auth.uid());
-- Tetti: al massimo 5000 link per utente.
create or replace function public.consent_links_cap() returns trigger language plpgsql security definer set search_path=public as $$
begin if (select count(*) from public.consent_links where owner=new.owner)>=5000 then raise exception 'limite link'; end if; return new; end $$;
drop trigger if exists consent_links_cap on public.consent_links;
create trigger consent_links_cap before insert on public.consent_links for each row execute function public.consent_links_cap();
-- Pulizia ogni tanto (risposte mai ritirate da 180 giorni): delete from public.consent_resp where at<now()-interval '180 days';
revoke all on function public.consent_links_cap() from public, anon, authenticated;
