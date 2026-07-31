import { sb, json, preflight } from "../../_lib/supabase.js";

// GET /api/cases/get?id=123 -> the single case's full payload, attachments included.
// Kept separate from the list endpoint so opening one case never has to pull
// every other case's photos/files along with it.
export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, 400);

    const { base, headers } = sb(env);
    const r = await fetch(
      `${base}/cases?id=eq.${encodeURIComponent(id)}&select=payload`,
      { headers }
    );
    if (!r.ok) throw new Error(`Supabase error ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    if (!rows.length) return json({ error: "Case not found" }, 404);

    return json(rows[0].payload);
  } catch (err) {
    console.error("get-case error:", err);
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return preflight();
}
