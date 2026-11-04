-- Portafolio: lectura pública con la anon key y escritura solo del admin.
-- Ejecutar una vez en Supabase → SQL Editor. Se puede volver a correr.
-- El rol postgres (Laravel en Railway) sigue saltándose RLS hasta que apagues Railway.
-- No pegues aquí la service role key ni la contraseña de la base.

begin;

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Usuarios de Supabase Auth que pueden editar el portafolio. El alta se hace a mano en el SQL Editor.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Cierra todas las tablas públicas y luego vuelve a abrir solo lo necesario.
-- Así users, sessions, jobs y cache no quedan legibles con la anon key.
do $$
declare
  rec record;
begin
  for rec in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', rec.tablename);
    execute format(
      'revoke all on table public.%I from public, anon, authenticated',
      rec.tablename
    );
  end loop;
end $$;

grant usage on schema public to anon, authenticated, service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
revoke all on all sequences in schema public from public, anon, authenticated;
grant usage, select on all sequences in schema public to authenticated, service_role;

grant select on public.admins to authenticated;

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

grant select on public.technologies to anon, authenticated;
grant insert, update, delete on public.technologies to authenticated;

grant select on public.project_technology to anon, authenticated;
grant insert, update, delete on public.project_technology to authenticated;

grant select on public.project_images to anon, authenticated;
grant insert, update, delete on public.project_images to authenticated;

grant select on public.certifications to anon, authenticated;
grant insert, update, delete on public.certifications to authenticated;

grant select (id, name, email, subject, message, status, created_at)
  on public.contact_messages to authenticated;
grant update (status) on public.contact_messages to authenticated;

grant select on public.demo_shipments to anon, authenticated;
grant select on public.demo_messages to anon, authenticated;
grant select on public.demo_notifications to anon, authenticated;
grant update (status, sent_at) on public.demo_notifications to anon, authenticated;
grant select on public.demo_conversations to anon, authenticated;
grant update (status) on public.demo_conversations to anon, authenticated;

alter table public.contact_messages drop constraint if exists contact_messages_status_check;
alter table public.contact_messages
  add constraint contact_messages_status_check
  check (status in ('new', 'read', 'archived'));

drop policy if exists projects_select on public.projects;
drop policy if exists projects_insert on public.projects;
drop policy if exists projects_update on public.projects;
drop policy if exists projects_delete on public.projects;
create policy projects_select on public.projects
  for select to anon, authenticated
  using (is_published or public.is_admin());
create policy projects_insert on public.projects
  for insert to authenticated
  with check (public.is_admin());
create policy projects_update on public.projects
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
create policy projects_delete on public.projects
  for delete to authenticated
  using (public.is_admin());

drop policy if exists technologies_select on public.technologies;
drop policy if exists technologies_insert on public.technologies;
drop policy if exists technologies_update on public.technologies;
drop policy if exists technologies_delete on public.technologies;
create policy technologies_select on public.technologies
  for select to anon, authenticated
  using (true);
create policy technologies_insert on public.technologies
  for insert to authenticated
  with check (public.is_admin());
create policy technologies_update on public.technologies
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
create policy technologies_delete on public.technologies
  for delete to authenticated
  using (public.is_admin());

drop policy if exists project_technology_select on public.project_technology;
drop policy if exists project_technology_insert on public.project_technology;
drop policy if exists project_technology_update on public.project_technology;
drop policy if exists project_technology_delete on public.project_technology;
create policy project_technology_select on public.project_technology
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.projects
      where projects.id = project_technology.project_id
        and projects.is_published
    )
  );
create policy project_technology_insert on public.project_technology
  for insert to authenticated
  with check (public.is_admin());
create policy project_technology_update on public.project_technology
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
create policy project_technology_delete on public.project_technology
  for delete to authenticated
  using (public.is_admin());

drop policy if exists project_images_select on public.project_images;
drop policy if exists project_images_insert on public.project_images;
drop policy if exists project_images_update on public.project_images;
drop policy if exists project_images_delete on public.project_images;
create policy project_images_select on public.project_images
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.projects
      where projects.id = project_images.project_id
        and projects.is_published
    )
  );
create policy project_images_insert on public.project_images
  for insert to authenticated
  with check (public.is_admin());
create policy project_images_update on public.project_images
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
create policy project_images_delete on public.project_images
  for delete to authenticated
  using (public.is_admin());

drop policy if exists certifications_select on public.certifications;
drop policy if exists certifications_insert on public.certifications;
drop policy if exists certifications_update on public.certifications;
drop policy if exists certifications_delete on public.certifications;
create policy certifications_select on public.certifications
  for select to anon, authenticated
  using (is_published or public.is_admin());
create policy certifications_insert on public.certifications
  for insert to authenticated
  with check (public.is_admin());
create policy certifications_update on public.certifications
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
create policy certifications_delete on public.certifications
  for delete to authenticated
  using (public.is_admin());

drop policy if exists admins_select_self on public.admins;
create policy admins_select_self on public.admins
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists contact_messages_select on public.contact_messages;
drop policy if exists contact_messages_update on public.contact_messages;
create policy contact_messages_select on public.contact_messages
  for select to authenticated
  using (public.is_admin());
create policy contact_messages_update on public.contact_messages
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin() and status in ('new', 'read', 'archived'));

drop policy if exists demo_shipments_select on public.demo_shipments;
create policy demo_shipments_select on public.demo_shipments
  for select to anon, authenticated
  using (true);

drop policy if exists demo_messages_select on public.demo_messages;
create policy demo_messages_select on public.demo_messages
  for select to anon, authenticated
  using (true);

drop policy if exists demo_notifications_select on public.demo_notifications;
drop policy if exists demo_notifications_update on public.demo_notifications;
create policy demo_notifications_select on public.demo_notifications
  for select to anon, authenticated
  using (true);
create policy demo_notifications_update on public.demo_notifications
  for update to anon, authenticated
  using (true)
  with check (status = 'sent');

drop policy if exists demo_conversations_select on public.demo_conversations;
drop policy if exists demo_conversations_update on public.demo_conversations;
create policy demo_conversations_select on public.demo_conversations
  for select to anon, authenticated
  using (true);
create policy demo_conversations_update on public.demo_conversations
  for update to anon, authenticated
  using (true)
  with check (status in ('open', 'pending', 'closed'));

create or replace function public.enforce_single_project_cover()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.is_cover then
    update public.project_images
      set is_cover = false
      where project_id = new.project_id
        and is_cover
        and id is distinct from new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists project_images_single_cover on public.project_images;
create trigger project_images_single_cover
  before insert or update of is_cover on public.project_images
  for each row
  execute function public.enforce_single_project_cover();

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id = 'portfolio';

drop policy if exists portfolio_public_read on storage.objects;
drop policy if exists portfolio_admin_insert on storage.objects;
drop policy if exists portfolio_admin_update on storage.objects;
drop policy if exists portfolio_admin_delete on storage.objects;

create policy portfolio_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio');

create policy portfolio_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy portfolio_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy portfolio_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

commit;

-- Después de crear el usuario en Authentication → Users (Auto Confirm):
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'tu-correo'
-- on conflict (user_id) do nothing;
