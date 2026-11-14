// Invia le notifiche push dei promemoria scaduti. Chiamata ogni 10 minuti da pg_cron.
// Non conosce titoli né clienti: il testo è generico e viaggia cifrato fino al dispositivo.
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const PUB = 'BNutLzHGcx2wCOQTS62VIi7iq4DZjxvZ1PS0WwrWprGEuBbxvVbnleAEIHSB3HM67pwRLFa5IxCHMZpOLSC0kAI';

Deno.serve(async (req) => {
  const key = req.headers.get('x-cron-key') || '';
  const { data: ck } = await sb.rpc('push_secret', { n: 'reminders_cron' });
  if (!ck || key !== ck) return new Response('no', { status: 401 });
  const { data: priv } = await sb.rpc('push_secret', { n: 'vapid_private' });
  if (!priv) return new Response('config', { status: 500 });
  webpush.setVapidDetails('https://ivanopregnolato-rgb.github.io/Krang-CRM/', PUB, priv);

  const { data: due, error } = await sb.rpc('claim_reminders');
  if (error) return new Response(error.message, { status: 500 });
  let sent = 0, gone = 0;
  for (const r of due || []) {
    // Ogni promemoria con titolo cifrato dall'app parte da solo (il server non lo legge: lo decifra il dispositivo).
    // Quelli senza titolo, o oltre i primi 5, vengono riassunti in un avviso generico.
    const blobs: string[] = (r.blobs || []).slice(0, 5);
    const extra = r.n - blobs.length;
    const msgs: { t: string; b: string; e?: string }[] = blobs.map((e) => ({ t: 'KRANG CRM', b: 'Hai un’attività in scadenza.', e }));
    if (extra > 0) msgs.push({ t: 'KRANG CRM', b: blobs.length ? 'Hai altre ' + extra + ' attività in scadenza.' : extra === 1 ? 'Hai un’attività in scadenza.' : 'Hai ' + extra + ' attività in scadenza.' });
    for (const s of r.subs || []) {
      for (const m of msgs) {
        try {
          await webpush.sendNotification({ endpoint: s.e, keys: { p256dh: s.p, auth: s.a } }, JSON.stringify(m), { TTL: 6 * 3600, urgency: 'normal' });
          sent++;
        } catch (e) {
          const c = (e as { statusCode?: number }).statusCode;
          if (c === 404 || c === 410) { await sb.from('push_subs').delete().eq('endpoint', s.e); gone++; break; }
        }
      }
    }
  }
  return new Response(JSON.stringify({ utenti: (due || []).length, sent, gone }), { headers: { 'Content-Type': 'application/json' } });
});
