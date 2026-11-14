// KRANG CRM - Endpoint lead-in: riceve lead da fonti esterne (moduli, Zapier, Make, curl...).
// POST con "Authorization: Bearer <chiave>" e un JSON. Il server conosce solo l'impronta SHA-256 della chiave.
// Il lead viene cifrato subito con la chiave pubblica del titolare (AES-GCM + RSA-OAEP): in coda non è leggibile dal server.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MAXBODY = 8192, INBOX_CAP = 200;
const FIELDS: Record<string, number> = { nome: 80, cognome: 80, azienda: 120, email: 120, telefono: 40, richiesta: 1500, note: 1500, ruolo: 80, sito: 160, indirizzo: 200, piva: 20, pec: 120 };
const H = { "Content-Type": "application/json", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, authorization, x-api-key", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: H });
const hex = async (s: string) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, "0")).join("");
const b64 = (u: Uint8Array) => { let s = ""; u.forEach((x) => s += String.fromCharCode(x)); return btoa(s); };
const URL_ = Deno.env.get("SUPABASE_URL")!, SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SH = { apikey: SK, Authorization: `Bearer ${SK}`, "Content-Type": "application/json" };
const rest = (p: string, i: RequestInit = {}) => fetch(`${URL_}/rest/v1/${p}`, { ...i, headers: { ...SH, ...(i.headers || {}) } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  if (req.method !== "POST") return out({ err: "method" }, 405);
  const auth = req.headers.get("authorization") || "", xk = req.headers.get("x-api-key") || "";
  const m = /^Bearer\s+(\S+)$/i.exec(auth);
  // la chiave può stare in x-api-key (Authorization è riservata alla piattaforma quando serve un JWT)
  const key = xk || (m ? m[1] : "");
  if (!/^kl_[A-Za-z0-9_-]{30,64}$/.test(key)) return out({ err: "chiave" }, 401);
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAXBODY) return out({ err: "troppo grande" }, 413);
  let b: Record<string, unknown>;
  try { const t = await req.text(); if (t.length > MAXBODY) return out({ err: "troppo grande" }, 413); b = JSON.parse(t); } catch { return out({ err: "json" }, 400); }
  if (!b || typeof b !== "object" || Array.isArray(b)) return out({ err: "json" }, 400);

  const kh = await hex(key);
  const k = await rest(`lead_keys?h=eq.${kh}&select=owner,label,n`);
  const kj = k.ok ? await k.json() : [];
  if (!kj.length) return out({ err: "chiave" }, 401);
  const owner = kj[0].owner as string, label = kj[0].label as string;

  const lead: Record<string, string> = {};
  for (const [f, mx] of Object.entries(FIELDS)) {
    const v = b[f];
    if (typeof v === "string" || typeof v === "number") { const s = String(v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, mx); if (s) lead[f] = s; }
  }
  if (!lead.nome && !lead.cognome && !lead.email && !lead.telefono && !lead.azienda) return out({ err: "dati mancanti: serve almeno nome, email, telefono o azienda" }, 422);
  if (lead.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(lead.email)) return out({ err: "email non valida" }, 422);

  const c = await rest(`lead_inbox?owner=eq.${owner}&select=id&limit=${INBOX_CAP}`);
  const cj = c.ok ? await c.json() : [];
  if (cj.length >= INBOX_CAP) return out({ err: "coda piena, riprova più tardi" }, 429);

  const p = await rest(`lead_pub?owner=eq.${owner}&select=jwk`);
  const pj = p.ok ? await p.json() : [];
  if (!pj.length) return out({ err: "il titolare deve aprire l'app almeno una volta per attivare la ricezione" }, 409);

  try {
    const pub = await crypto.subtle.importKey("jwk", pj[0].jwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
    const ak = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(JSON.stringify({ ...lead, src: label, at: new Date().toISOString() }));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, ak, data));
    const wk = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, pub, await crypto.subtle.exportKey("raw", ak)));
    const ins = await rest("lead_inbox", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ owner, kh, blob: { k: b64(wk), iv: b64(iv), c: b64(ct) } }) });
    if (!ins.ok) return out({ err: "errore" }, 500);
  } catch { return out({ err: "errore" }, 500); }
  rest(`lead_keys?h=eq.${kh}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_used: new Date().toISOString(), n: (kj[0].n || 0) + 1 }) }).catch(() => {});
  return out({ ok: true }, 201);
});
