import { sb, json, preflight } from "../../_lib/supabase.js";

export async function onRequestPost({ request, env }) {
  try {
    const item = await request.json();
    if (!item || !item.id || !item.ptName) {
      return json({ error: "Invalid case data (id, ptName required)" }, 400);
    }
    const { base, headers } = sb(env);

    // Upsert: delete any previous row with the same id, then insert fresh.
    const del = await fetch(`${base}/cases?id=eq.${encodeURIComponent(item.id)}`, {
      method: "DELETE",
      headers,
    });
    if (!del.ok) throw new Error(`Supabase delete error ${del.status}`);

    const insRes = await fetch(`${base}/cases`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify([
        {
          id: item.id,
          pt_name: item.ptName,
          consultant: item.consultant || null,
          status: item.dayOut ? "archived" : "active",
          payload: item,
          updated_at: new Date().toISOString(),
        },
      ]),
    });
    if (!insRes.ok)
      throw new Error(`Supabase insert error ${insRes.status}: ${await insRes.text()}`);

    return json({ ok: true });
  } catch (err) {
    console.error("save-case error:", err);
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return preflight();
}
