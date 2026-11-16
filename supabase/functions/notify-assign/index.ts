// Notifica push immediata a un collaboratore a cui il titolare ha appena assegnato un cliente, un lead o un task.
// Il server non conosce titoli né dati: il testo è generico. Solo il titolare puo' notificare i propri collaboratori.
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const ORIGINS = ['https://ivanopregnolato-rgb.github.io'];
const PUB = 'BNutLzHGcx2wCOQTS62VIi7iq4DZjxvZ1PS0WwrWprGEuBbxvVbnleAEIHSB3HM67pwRLFa5IxCHMZpOLSC0kAI';
const URL_ = Deno.env.get('SUPABASE_URL')!;
const sb = createClient(URL_, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const TXT: Record<string, string> = {
  cl: 'Ti è stato assegnato un nuovo cliente.',
  ld: 'Ti è stato assegnato un nuovo lead.',
  tk: 'Ti è stato assegnato un nuovo task.',
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hits = new Map<string, number[]>();

function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(o) ? o : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
const out = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== 'POST') return out(req, 405, { error: 'metodo' });
  const auth = req.headers.get('authorization') || '';
  const uc = createClient(URL_, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data: u } = await uc.auth.getUser();
  const me = u?.user?.id;
  if (!me) return out(req, 401, { error: 'auth' });
  let b: { member?: string; kind?: string } = {};
  try { b = await req.json(); } catch { return out(req, 400, { error: 'json' }); }
  const member = String(b.member || ''), kind = String(b.kind || '');
  if (!UUID.test(member) || !TXT[kind]) return out(req, 400, { error: 'dati' });
  // al massimo 20 notifiche al minuto per titolare
  const now = Date.now(), h = (hits.get(me) || []).filter((t) => now - t < 60000);
  if (h.length >= 20) return out(req, 429, { error: 'troppe' });
  h.push(now); hits.set(me, h);
  const { data: tm } = await sb.from('team_members').select('member').eq('owner', me).eq('member', member).maybeSingle();
  if (!tm) return out(req, 403, { error: 'non collaboratore' });
  const { data: priv } = await sb.rpc('push_secret', { n: 'vapid_private' });
  if (!priv) return out(req, 500, { error: 'config' });
  webpush.setVapidDetails('https://ivanopregnolato-rgb.github.io/Krang-CRM/', PUB, priv);
  const { data: subs } = await sb.from('push_subs').select('endpoint,p256dh,auth').eq('user_id', member);
  let sent = 0;
  for (const s of subs || []) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ t: 'KRANG CRM', b: TXT[kind], go: kind }), { TTL: 6 * 3600, urgency: 'normal' });
      sent++;
    } catch (e) {
      const c = (e as { statusCode?: number }).statusCode;
      if (c === 404 || c === 410) await sb.from('push_subs').delete().eq('endpoint', s.endpoint);
    }
  }
  return out(req, 200, { sent });
});
