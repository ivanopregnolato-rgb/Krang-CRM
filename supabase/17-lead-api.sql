-- 1.36.0 · endpoint lead-in: chiavi per sorgente, chiave pubblica del titolare, coda cifrata
create table if not exists public.lead_keys(h text primary key, owner uuid not null, label text not null check(char_length(label) between 1 and 60), created timestamptz not null default now(), last_used timestamptz, n integer not null default 0);
create table if not exists public.lead_pub(owner uuid primary key, jwk jsonb not null, upd timestamptz not null default now());
create table if not exists public.lead_inbox(id bigserial primary key, owner uuid not null, kh text not null, blob jsonb not null, at timestamptz not null default now());
create index if not exists lead_keys_owner_idx on public.lead_keys(owner);
create index if not exists lead_inbox_owner_idx on public.lead_inbox(owner, id);
alter table public.lead_keys enable row level security;
alter table public.lead_pub enable row level security;
alter table public.lead_inbox enable row level security;
create policy lead_keys_own on public.lead_keys for all to authenticated using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
create policy lead_pub_own on public.lead_pub for all to authenticated using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
create policy lead_inbox_own_r on public.lead_inbox for select to authenticated using (owner=(select auth.uid()));
create policy lead_inbox_own_d on public.lead_inbox for delete to authenticated using (owner=(select auth.uid()));
-- tetto: massimo 20 chiavi per titolare
create or replace function public.lead_keys_cap() returns trigger language plpgsql security definer set search_path=public as $$
begin if (select count(*) from public.lead_keys where owner=new.owner)>=20 then raise exception 'limite chiavi'; end if; return new; end $$;
revoke all on function public.lead_keys_cap() from public, anon, authenticated;
drop trigger if exists lead_keys_cap_t on public.lead_keys;
create trigger lead_keys_cap_t before insert on public.lead_keys for each row execute function public.lead_keys_cap();
-- pulizia: coda oltre 30 giorni (aggiunta a purge_old)
create or replace function public.purge_old() returns void language sql security definer set search_path=public as $$
  delete from public.ai_usage where day < current_date-90;
  delete from public.lookup_usage where day < current_date-90;
  delete from public.search_usage where day < current_date-90;
  delete from public.presence_peak where day < current_date-400;
  delete from public.presence where seen_at < now()-interval '2 days';
  delete from public.consent_resp where at < now()-interval '180 days';
  delete from public.lead_inbox where at < now()-interval '30 days';
  delete from public.records where deleted and updated_at < now()-interval '12 months';
$$;
revoke all on function public.purge_old() from public, anon, authenticated;
