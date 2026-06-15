-- 04_add_first_admin.sql
-- Run this AFTER you create the admin user in Authentication > Users.
-- Replace the email below with your real admin email.

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (user_id) do update
set email = excluded.email;

select *
from public.admin_users;
