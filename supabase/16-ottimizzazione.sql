-- 1.35.1 · ottimizzazione: regole RLS con (select auth.uid()), indice, pulizia periodica
-- 1) regole: auth.uid() valutato una sola volta per query, non per riga
drop policy if exists records_select_own on public.records;
drop policy if exists records_insert_own on public.records;
drop policy if exists records_update_own on public.records;
drop policy if exists records_delete_own on public.records;
create policy records_select_own on public.records for select using (user_id=(select auth.uid()));
create policy records_insert_own on public.records for insert with check (user_id=(select auth.uid()));
create policy records_update_own on public.records for update using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy records_delete_own on public.records for delete using (user_id=(select auth.uid()));
drop policy if exists al_select on public.access_log; drop policy if exists al_insert on public.access_log;
create policy al_select on public.access_log for select to authenticated using (user_id=(select auth.uid()));
create policy al_insert on public.access_log for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists ae_insert on public.app_errors;
create policy ae_insert on public.app_errors for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists fb_insert on public.assistant_feedback;
create policy fb_insert on public.assistant_feedback for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists consent_pub_own on public.consent_pub; drop policy if exists consent_links_own on public.consent_links;
drop policy if exists consent_resp_own_r on public.consent_resp; drop policy if exists consent_resp_own_d on public.consent_resp;
create policy consent_pub_own on public.consent_pub for all to authenticated using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
create policy consent_links_own on public.consent_links for all to authenticated using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
create policy consent_resp_own_r on public.consent_resp for select to authenticated using (owner=(select auth.uid()));
create policy consent_resp_own_d on public.consent_resp for delete to authenticated using (owner=(select auth.uid()));
-- 2) indici
create index if not exists consent_links_owner_idx on public.consent_links(owner);
drop index if exists public.app_errors_user_idx;
-- 3) pulizia periodica
create or replace function public.purge_old() returns void language sql security definer set search_path=public as $$
  delete from public.ai_usage where day < current_date-90;
  delete from public.lookup_usage where day < current_date-90;
  delete from public.search_usage where day < current_date-90;
  delete from public.presence_peak where day < current_date-400;
  delete from public.presence where seen_at < now()-interval '2 days';
  delete from public.consent_resp where at < now()-interval '180 days';
  delete from public.records where deleted and updated_at < now()-interval '12 months';
$$;
revoke all on function public.purge_old() from public, anon, authenticated;
create extension if not exists pg_cron;
select cron.schedule('krang-purge','17 3 * * 0','select public.purge_old()');
