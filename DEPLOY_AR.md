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
- Open **Settings** (default password: `1234`) and set up your consultants and departments.
- Add a new case, attach a photo/file, and confirm it saves (refresh and check it's still there).
- Set a "Day out" date on a case — it should disappear from the Active Cases view and appear under the Archive tab.

## Data fields per case
Pt. Name, Consultant, Department, Age, Diagnosis, Day/Admission, Vitality, Feeding, Drain, Investigation, Labs, Rads, Day out, Notes, Attachments (photos/files).

## How the lists work
- **Consultants** and **Departments** are fully customizable from the in-app Settings screen — no code changes needed, and there's no limit on how many you add.
- Both lists are stored in the `app_config` table in Supabase and shared by everyone using the app.
- Cases are grouped and color-coded by department on the main screen, and each consultant gets a consistent color badge.

## Password protection
- Opening **Settings** and **deleting a case** both require a password.
- The default password is `1234` (seeded by `supabase-schema.sql`). Change it any time from inside Settings → Security (leave the field blank to keep the current password).
- This is an in-app password check, not full user authentication — anyone with the password (or who edits the page source) can bypass it, so don't rely on it as your only layer of protection for sensitive data.

## Attachments
- Each case can have photos or files attached (X-rays, lab reports, etc.). They're stored as part of the case record itself (base64-encoded) in the `payload` column, so no extra storage bucket is required.
- Individual files are capped at 8MB in the app to keep things responsive on mobile — adjust `MAX_FILE_MB` in `index.html` if you need a different limit.

## Security notes
- The `cases` and `app_config` tables have Row Level Security enabled with no public policies. The only access path is through the Cloudflare Functions using the service_role key from the server — never directly from the browser.
- You can add authentication later if you want to restrict who can add/edit data.
