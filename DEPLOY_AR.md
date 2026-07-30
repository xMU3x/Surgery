# 🏥 Surgery Department Cases - Cloudflare Pages + Supabase Setup

## 1) Create the Supabase database
1. Go to https://supabase.com and sign in / sign up.
2. Create a new project.
3. Open **SQL Editor** from the left menu.
4. Paste the content of `supabase-schema.sql` (included in this folder) and click **Run** (once only).
5. From **Project Settings -> API** you'll find:
   - **Project URL** (this is `SUPABASE_URL`)
   - **service_role key** or **secret key** (this is `SUPABASE_SERVICE_ROLE_KEY`) — keep this private, never share it or put it in client-side code.

## 2) Deploy to Cloudflare Pages
1. Create an account at https://dash.cloudflare.com if you don't have one.
2. From the sidebar: **Workers & Pages -> Create -> Pages**.
3. Choose **"Upload assets"** (direct upload) or connect a GitHub repo containing all these files.
4. If uploading manually, drag in every file and folder in this project (including the `functions` folder).

## 3) Add environment variables
Inside your Cloudflare Pages project:
1. Go to **Settings -> Environment variables**.
2. Add these two for both Production and Preview:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = the service_role / secret key from Supabase
3. Save, then **Redeploy** the project so the variables take effect.

## 4) Test the site
- Open the URL Cloudflare gives you (e.g. `surgery-cases.pages.dev`).
- Go to **Settings** in the app and set up your consultants (up to 8) and departments.
- Add a new case and confirm it saves (refresh and check it's still there).
- Set a "Day out" date on a case — it should disappear from the Active Cases table and appear under the Archive tab.

## Data fields per case
Pt. Name, Consultant, Department, Age, Diagnosis, Day/Admission, Vitality, Feeding, Drain, Investigation, Labs, Rads, Day out, Notes.

## How the lists work
- **Consultants** and **Departments** are fully customizable from the in-app Settings screen — no code changes needed.
- Consultants list is capped at 8 entries; Departments has no fixed limit.
- Both lists are stored in the `app_config` table in Supabase and shared by everyone using the app.

## Security notes
- The `cases` and `app_config` tables have Row Level Security enabled with no public policies. The only access path is through the Cloudflare Functions using the service_role key from the server — never directly from the browser.
- You can add authentication later if you want to restrict who can add/edit data.
