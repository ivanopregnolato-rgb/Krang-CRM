-- KRANG CRM 1.16.0: consumo per utente (sezione "Utilizzo" nelle impostazioni) e tetto sui file.
-- Limiti per utente (modificabili qui): file 100 MB in totale (3 MB a file, gia' imposto dal bucket), dati 30 MB consigliati, 50000 righe.
create or replace function public.files_used(uid uuid) returns bigint
language sql stable security definer set search_path = public, storage as $$
  select coalesce(sum((metadata->>'size')::bigint),0)::bigint from storage.objects
  where bucket_id='media' and (storage.foldername(name))[1]=uid::text
$$;
revoke all on function public.files_used(uuid) from public, anon;
grant execute on function public.files_used(uuid) to authenticated;

create or replace function public.my_usage() returns json
language plpgsql stable security definer set search_path = public, storage as $$
declare u uuid:=auth.uid(); rc bigint; rb bigint; fc bigint; fb bigint;
begin
  if u is null then raise exception 'non autorizzato'; end if;
  select count(*), coalesce(sum(octet_length(data::text)),0) into rc, rb from public.records where user_id=u and not deleted;
  select count(*), coalesce(sum((metadata->>'size')::bigint),0) into fc, fb from storage.objects
    where bucket_id='media' and (storage.foldername(name))[1]=u::text;
  return json_build_object('rows',rc,'rows_max',50000,'data_bytes',rb,'data_max',31457280,'files',fc,'files_bytes',fb,'files_max',104857600);
end $$;
revoke all on function public.my_usage() from public, anon;
grant execute on function public.my_usage() to authenticated;

-- Tetto sui file: si blocca il caricamento quando l'utente ha gia' raggiunto 100 MB.
drop policy if exists "media_own_write" on storage.objects;
create policy "media_own_write" on storage.objects for insert
  with check (bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text and public.files_used(auth.uid()) < 104857600);
