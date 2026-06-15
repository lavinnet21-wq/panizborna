-- 01_tables.sql
-- Creates the portfolio database tables and helper functions.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

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

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_artworks_updated_at on public.artworks;
create trigger set_artworks_updated_at
before update on public.artworks
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();
