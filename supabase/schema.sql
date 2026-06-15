-- Paniz Borna portfolio schema
-- Legacy all-in-one file. Prefer running files in supabase/sql/ in order:
-- 01_tables.sql
-- 02_rls_policies.sql
-- 03_storage.sql
-- 04_add_first_admin.sql
-- 05_seed_demo_artworks_optional.sql

create table if not exists public.artworks (
  id text primary key,
  title text not null,
  year text not null,
  medium text not null,
  dimensions text default '',
  status text default '',
  image text default '',
  images text[] default '{}',
  description text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  home_title text default 'portfolio',
  artist_name text default 'paniz borna',
  home_subtitle text default 'Ceramic sculpture / drawing / material studies',
  intro_text text default 'A quiet archive of ceramic sculptures, drawings, and selected material studies organized by year.',
  intro_image text default '',
  feature_title text default 'selected study',
  feature_text text default 'Forms are collected as fragments: bodies, vessels, surfaces, and quiet objects shaped by hand.',
  feature_image text default '',
  about_heading text default 'about',
  about_text text default 'Paniz Borna works across ceramic sculpture and drawing, focusing on tactile forms, surface, memory, and the slow language of material.',
  artist_image text default '',
  email text default '',
  phone text default '',
  updated_at timestamptz default now()
);

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

alter table public.artworks enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read artworks" on public.artworks;
create policy "Public can read artworks"
on public.artworks
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage artworks" on public.artworks;
create policy "Authenticated users can manage artworks"
on public.artworks
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage site settings" on public.site_settings;
create policy "Authenticated users can manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio files" on storage.objects;
create policy "Public can read portfolio files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can upload portfolio files" on storage.objects;
create policy "Authenticated users can upload portfolio files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can update portfolio files" on storage.objects;
create policy "Authenticated users can update portfolio files"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can delete portfolio files" on storage.objects;
create policy "Authenticated users can delete portfolio files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio');
