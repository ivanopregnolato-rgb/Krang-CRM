// KRANG CRM - Ricerca partita IVA (VIES, servizio gratuito dell'Unione Europea).
// Riceve paese e partita IVA, verifica l'utente, applica il tetto giornaliero e restituisce validita', nome e indirizzo (se il paese li fornisce).
// Non riceve ne' salva dati dei clienti oltre alla partita IVA digitata.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ORIGINS = ["https://ivanopregnolato-rgb.github.io"];
const USER_LIM = 40;
const EU = new Set(["AT","BE","BG","CY","CZ","DE","DK","EE","EL","ES","FI","FR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK","XI"]);

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
const out = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const clean = (s: unknown, n: number) =>
  String(s ?? "").replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/g, " ").slice(0, n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return out(req, { err: "method" }, 405);
  let b: any;
  try { b = await req.json(); } catch { return out(req, { err: "bad" }, 400); }
  let cc = String(b?.paese ?? "").toUpperCase().trim();
  if (cc === "GR") cc = "EL";
  const vat = String(b?.piva ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!EU.has(cc) || vat.length < 4 || vat.length > 14) return out(req, { err: "paese" }, 400);

  const url = Deno.env.get("SUPABASE_URL")!, anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  let take = "user";
  try {
    const r = await fetch(`${url}/rest/v1/rpc/vies_take`, {
      method: "POST",
      headers: { apikey: anon, Authorization: req.headers.get("authorization") || "", "Content-Type": "application/json" },
      body: JSON.stringify({ user_lim: USER_LIM }),
    });
    if (r.ok) take = String(await r.json());
  } catch { /* quota non raggiungibile: si nega */ }
  if (take !== "ok") return out(req, { err: "user" }, 429);

  try {
    const v = await fetch(`https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${cc}/vat/${encodeURIComponent(vat)}`, {
      headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000),
    });
    if (!v.ok) return out(req, { err: "vies" }, 502);
    const j = await v.json();
    if (j?.userError && j.userError !== "VALID" && j.userError !== "INVALID") return out(req, { err: "vies" }, 502);
    const name = clean(j?.name, 160).trim(), address = clean(j?.address, 240).trim();
    return out(req, {
      valid: j?.isValid === true,
      name: name === "---" ? "" : name,
      address: address === "---" ? "" : address,
    });
  } catch {
    return out(req, { err: "vies" }, 502);
  }
});
