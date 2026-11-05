-- Quita UPDATE al rol anon en las demos.
-- SELECT público se mantiene. Escritura solo para admin autenticado.
-- Se puede volver a correr.

begin;

revoke update on public.demo_notifications from anon;
revoke update on public.demo_conversations from anon;

drop policy if exists demo_notifications_update on public.demo_notifications;
drop policy if exists demo_conversations_update on public.demo_conversations;

create policy demo_notifications_update on public.demo_notifications
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy demo_conversations_update on public.demo_conversations
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

commit;
