-- 02_rls_policies.sql
-- Public visitors can read. Any authenticated user can write.

alter table public.admin_users enable row level security;
alter table public.artworks enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admin users can read themselves or admins" on public.admin_users;
drop policy if exists "Authenticated users can read themselves" on public.admin_users;
create policy "Authenticated users can read themselves"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read artworks" on public.artworks;
create policy "Public can read artworks"
on public.artworks
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert artworks" on public.artworks;
drop policy if exists "Admins can update artworks" on public.artworks;
drop policy if exists "Admins can delete artworks" on public.artworks;
drop policy if exists "Authenticated users can insert artworks" on public.artworks;
drop policy if exists "Authenticated users can update artworks" on public.artworks;
drop policy if exists "Authenticated users can delete artworks" on public.artworks;

create policy "Authenticated users can insert artworks"
on public.artworks
for insert
to authenticated
with check (true);

create policy "Authenticated users can update artworks"
on public.artworks
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete artworks"
on public.artworks
for delete
to authenticated
using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
drop policy if exists "Admins can update site settings" on public.site_settings;
drop policy if exists "Authenticated users can insert site settings" on public.site_settings;
drop policy if exists "Authenticated users can update site settings" on public.site_settings;

create policy "Authenticated users can insert site settings"
on public.site_settings
for insert
to authenticated
with check (true);

create policy "Authenticated users can update site settings"
on public.site_settings
for update
to authenticated
using (true)
with check (true);
