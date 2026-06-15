-- 03_storage.sql
-- Creates the public portfolio bucket and storage policies.

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio files" on storage.objects;
drop policy if exists "Admins can upload portfolio files" on storage.objects;
drop policy if exists "Admins can update portfolio files" on storage.objects;
drop policy if exists "Admins can delete portfolio files" on storage.objects;
drop policy if exists "Authenticated users can upload portfolio files" on storage.objects;
drop policy if exists "Authenticated users can update portfolio files" on storage.objects;
drop policy if exists "Authenticated users can delete portfolio files" on storage.objects;

create policy "Authenticated users can upload portfolio files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio');

create policy "Authenticated users can update portfolio files"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');

create policy "Authenticated users can delete portfolio files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio');
