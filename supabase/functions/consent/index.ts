// KRANG CRM - Pagina pubblica dei consensi.
// Il cliente apre il link personale ricevuto per email: GET restituisce i testi pubblici del titolare (nome, informativa, voci);
// POST registra le scelte (sì/no per voce). Il server conosce solo l'impronta SHA-256 del codice del link: mai nome o email del cliente.
// Nessun accesso con login: la funzione usa la chiave di servizio e applica da sola tetti e controlli.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ORIGINS = ["https://ivanopregnolato-rgb.github.io"];
const KEYS = ["mkEmail", "mkTel", "profilazione", "terzi"];
const KINDS = ["portabilita", "anonimizzazione"];
const PER_LINK_DAY = 20, PER_IP_HOUR = 60;

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
}
const out = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json", "Cache-Control": "no-store" } });
const hex = async (s: string) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, "0")).join("");

const URL_ = Deno.env.get("SUPABASE_URL")!, SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const H = { apikey: SK, Authorization: `Bearer ${SK}`, "Content-Type": "application/json" };
const rest = (path: string, init: RequestInit = {}) => fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  let k = "", choices: Record<string, boolean> = {}, kind = "consensi";
  if (req.method === "GET") k = new URL(req.url).searchParams.get("k") || "";
  else if (req.method === "POST") {
    try {
      const b = await req.json();
      k = String(b?.k ?? "");
      if (KINDS.includes(b?.r)) kind = b.r;
      for (const key of KEYS) if (typeof b?.c?.[key] === "boolean") choices[key] = b.c[key];
    } catch { return out(req, { err: "bad" }, 400); }
  } else return out(req, { err: "method" }, 405);
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(k)) return out(req, { err: "link" }, 404);
  const h = await hex(k);

  const l = await rest(`consent_links?h=eq.${h}&select=owner,state`);
  const lj = l.ok ? await l.json() : [];
  if (!lj.length) return out(req, { err: "link" }, 404);
  const owner = lj[0].owner as string;
  const state = (lj[0].state && typeof lj[0].state === "object") ? lj[0].state : {};
  const p = await rest(`consent_pub?owner=eq.${owner}&select=az,info,ver,vfrom,cons`);
  const pj = p.ok ? await p.json() : [];
  if (!pj.length) return out(req, { err: "link" }, 404);
  const pub = pj[0];

  if (req.method === "GET") return out(req, { az: pub.az, info: pub.info, ver: pub.ver, vfrom: pub.vfrom, cons: pub.cons, state });

  const keys = new Set((pub.cons as { k: string }[]).map((x) => x.k));
  for (const key of Object.keys(choices)) if (!keys.has(key)) delete choices[key];
  if (kind === "consensi" && !Object.keys(choices).length) return out(req, { err: "vuoto" }, 400);
  if (kind !== "consensi") {
    // Una sola richiesta aperta per tipo: se e' gia' in corso non se ne aggiungono altre.
    const rq = (state.rq && typeof state.rq === "object") ? state.rq : {};
    if (rq[kind] === "aperta") return out(req, { ok: true, dup: true });
    const o = await rest(`consent_resp?h=eq.${h}&kind=eq.${kind}&select=id`, { headers: { Range: "0-0" } });
    if (o.ok && (await o.json()).length) return out(req, { ok: true, dup: true });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";
  const ipx = (await hex("kcrm-consent|" + ip)).slice(0, 24);
  const day = new Date(Date.now() - 864e5).toISOString(), hr = new Date(Date.now() - 36e5).toISOString();
  const [a, b] = await Promise.all([
    rest(`consent_resp?h=eq.${h}&at=gte.${day}&select=id`, { headers: { Prefer: "count=exact", Range: "0-0" } }),
    rest(`consent_resp?ipx=eq.${ipx}&at=gte.${hr}&select=id`, { headers: { Prefer: "count=exact", Range: "0-0" } }),
  ]);
  const n = (r: Response) => parseInt((r.headers.get("content-range") || "0/0").split("/")[1] || "0", 10) || 0;
  if (n(a) >= PER_LINK_DAY || n(b) >= PER_IP_HOUR) return out(req, { err: "tetto" }, 429);

  const ins = await rest("consent_resp", {
    method: "POST", headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ h, owner, choices, kind, ver: String(pub.ver || "1.0").slice(0, 12), ipx }),
  });
  if (!ins.ok) return out(req, { err: "salva" }, 500);
  // La pagina mostra subito l'esito; l'app lo riallinea quando ritira la risposta.
  const today = new Date().toISOString().slice(0, 10);
  const ns: Record<string, unknown> = { ...state };
  if (kind === "consensi") {
    const c = { ...((state.c && typeof state.c === "object") ? state.c as Record<string, unknown> : {}) };
    for (const [key, v] of Object.entries(choices)) c[key] = { v, d: today };
    ns.c = c;
  } else {
    ns.rq = { ...((state.rq && typeof state.rq === "object") ? state.rq as Record<string, unknown> : {}), [kind]: "aperta" };
  }
  await rest(`consent_links?h=eq.${h}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ state: ns }) }).catch(() => {});
  // Pulizia: risposte mai ritirate dall'app da piu' di 180 giorni.
  rest(`consent_resp?at=lt.${new Date(Date.now() - 180 * 864e5).toISOString()}`, { method: "DELETE" }).catch(() => {});
  return out(req, { ok: true });
});
