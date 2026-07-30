import { sb, json, preflight } from "../../_lib/supabase.js";

export async function onRequestPost({ request, env }) {
  try {
    const { id } = await request.json();
    if (id === undefined || id === null) {
      return json({ error: "Missing id" }, 400);
    }
    const { base, headers } = sb(env);
    const r = await fetch(`${base}/cases?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
    });
    if (!r.ok) throw new Error(`Supabase delete error ${r.status}: ${await r.text()}`);
    return json({ ok: true });
  } catch (err) {
    console.error("delete-case error:", err);
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return preflight();
}
