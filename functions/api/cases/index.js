import { sb, json, preflight } from "../../_lib/supabase.js";

// GET /api/cases            -> active cases only
// GET /api/cases?all=1      -> everything
// GET /api/cases?archived=1 -> archived cases only
export async function onRequestGet({ request, env }) {
  try {
    const { base, headers } = sb(env);
    const url = new URL(request.url);
    let filter = "status=eq.active";
    if (url.searchParams.get("all")) filter = "";
    else if (url.searchParams.get("archived")) filter = "status=eq.archived";

    const qs = filter ? `${filter}&` : "";
    const r = await fetch(
      `${base}/cases?${qs}select=payload&order=created_at.desc`,
      { headers }
    );
    if (!r.ok) throw new Error(`Supabase error ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    return json(rows.map((row) => row.payload));
  } catch (err) {
    console.error("get-cases error:", err);
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return preflight();
}
