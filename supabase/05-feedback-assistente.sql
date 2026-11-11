-- KRANG CRM: feedback sulle risposte dell'Assistente (pollice su / giu').
-- Gli utenti possono SOLO inserire; leggere la tabella puo' solo chi ha accesso al progetto Supabase.
create table if not exists public.assistant_feedback(
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  app_ver text check (char_length(app_ver)<=20),
  kb text check (char_length(kb)<=120),
  rating text not null check (rating in ('up','down')),
  reason text check (reason in ('off','err','nofunz','inc','alt')),
  handled boolean not null default false,
  handled_at timestamptz,
  handled_note text
);
alter table public.assistant_feedback enable row level security;
revoke all on public.assistant_feedback from anon, authenticated;
grant insert (app_ver,kb,rating,reason) on public.assistant_feedback to authenticated;
drop policy if exists fb_insert on public.assistant_feedback;
create policy fb_insert on public.assistant_feedback for insert to authenticated with check (user_id=auth.uid());
-- Limite: massimo 100 feedback al giorno per utente
create or replace function public.fb_quota() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if (select count(*) from public.assistant_feedback where user_id=new.user_id and created_at>now()-interval '1 day')>=100 then
    raise exception 'troppi feedback oggi';
  end if;
  return new;
end $$;
drop trigger if exists fb_quota on public.assistant_feedback;
create trigger fb_quota before insert on public.assistant_feedback for each row execute function public.fb_quota();

-- Aggiunta 1.14.0: domanda dell'utente (ripulita da email/numeri nell'app, max 200 caratteri) solo con pollice giu' o "Segnala"
alter table public.assistant_feedback add column if not exists q text check (char_length(q)<=200);
alter table public.assistant_feedback add column if not exists nores boolean not null default false;
grant insert (q,nores) on public.assistant_feedback to authenticated;

-- Audit 1.14.1: indurimento (gia' applicato)
revoke execute on function public.fb_quota() from public, anon, authenticated;
alter function public.touch_updated_at() set search_path = public;
alter policy records_delete_own on public.records to authenticated;
alter policy records_insert_own on public.records to authenticated;
alter policy records_select_own on public.records to authenticated;
alter policy records_update_own on public.records to authenticated;
alter table public.assistant_feedback drop constraint if exists fb_q_pulita;
alter table public.assistant_feedback add constraint fb_q_pulita check (q is null or q !~ '[\x00-\x08\x0b\x0c\x0e-\x1f]');
alter table public.assistant_feedback drop constraint if exists fb_kb_pulita;
alter table public.assistant_feedback add constraint fb_kb_pulita check (kb is null or kb !~ '[\x00-\x08\x0b\x0c\x0e-\x1f]');
