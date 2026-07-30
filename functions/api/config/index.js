import { sb, json, preflight } from "../../_lib/supabase.js";

const DEFAULTS = {
  consultants: [
    "Dr. Ahmed Hassan","Dr. Mohamed Ali","Dr. Sara Youssef","Dr. Khaled Mostafa",
    "Dr. Omar Fathy","Dr. Nour ElDin","Dr. Amr Sami","Dr. Laila Adel"
  ],
  departments: ["Surgery A","Surgery B","ICU 6th Floor"],
};

export async function onRequestGet({ env }) {
  try {
    const { base, headers } = sb(env);
    const r = await fetch(`${base}/app_config?select=key,value`, { headers });
    if (!r.ok) throw new Error(`Supabase error ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    const out = { ...DEFAULTS };
    for (const row of rows) out[row.key] = row.value;
    return json(out);
  } catch (err) {
    console.error("get-config error:", err);
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return preflight();
}
