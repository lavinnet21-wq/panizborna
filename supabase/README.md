# Supabase Backend Setup

Run these files in Supabase SQL Editor in this exact order:

1. `sql/01_tables.sql`
2. `sql/02_rls_policies.sql`
3. `sql/03_storage.sql`
4. Create your admin user in `Authentication > Users`
5. `sql/04_add_first_admin.sql`
6. Optional: `sql/05_seed_demo_artworks_optional.sql`

What each file does:

- `01_tables.sql`
  Creates `admin_users`, `artworks`, and `site_settings`.
  Also creates helper functions and update triggers.

- `02_rls_policies.sql`
  Turns on Row Level Security and allows:
  public read access,
  admin-only write access.

- `03_storage.sql`
  Creates the `portfolio` storage bucket and admin-only upload/update/delete access.

- `04_add_first_admin.sql`
  Links your Supabase auth user to the `admin_users` table.
  Replace `YOUR_ADMIN_EMAIL@example.com` with your real admin email before running it.

- `05_seed_demo_artworks_optional.sql`
  Inserts a few sample artworks if you want starter content.

Local env file used by Nuxt:

- `.env`

Required variables:

- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
