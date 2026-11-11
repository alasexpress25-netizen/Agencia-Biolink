-- =====================================================================
--  BioLink multi-cliente — esquema de Supabase (proyecto compartido)
--  Ejecutar completo en: Supabase → SQL Editor → New query → Run
--  Es seguro volver a ejecutarlo (usa IF NOT EXISTS / OR REPLACE).
-- =====================================================================

-- 1) Un registro por cliente (sitio) -----------------------------------
create table if not exists public.sites (
  site_id    text primary key check (site_id ~ '^[a-z0-9-]{2,40}$'),
  owner_id   uuid references auth.users(id) on delete set null,
  config     jsonb not null default '{}'::jsonb,   -- profile, services, links, theme
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Eventos reales (visitas y clics) ----------------------------------
create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  site_id    text not null references public.sites(site_id) on delete cascade,
  kind       text not null check (kind in ('visit', 'click')),
  link_id    text,
  link_title text,
  device     text check (device in ('mobile', 'tablet', 'desktop')),
  referrer   text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_site_time_idx on public.analytics_events (site_id, created_at desc);
create index if not exists analytics_events_site_kind_link_idx on public.analytics_events (site_id, kind, link_id);

-- 3) Seguridad (RLS) -----------------------------------------------------
alter table public.sites enable row level security;
alter table public.analytics_events enable row level security;

-- Cualquiera puede LEER la configuración publicada (no incluye owner_id)
revoke all on public.sites from anon, authenticated;
grant select (site_id, config, updated_at) on public.sites to anon, authenticated;
grant update (config, updated_at)          on public.sites to authenticated;

drop policy if exists sites_public_read on public.sites;
create policy sites_public_read on public.sites
  for select to anon, authenticated using (true);

-- Solo el dueño puede MODIFICAR su sitio
drop policy if exists sites_owner_update on public.sites;
create policy sites_owner_update on public.sites
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- analytics_events: sin políticas ni permisos directos (solo vía funciones)
revoke all on public.analytics_events from anon, authenticated;

-- updated_at automático
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists sites_touch_updated_at on public.sites;
create trigger sites_touch_updated_at before update on public.sites
  for each row execute function public.touch_updated_at();

-- 4) Registrar visita / clic (lo llaman los visitantes, sin login) -------
create or replace function public.track_event(
  p_site_id    text,
  p_kind       text,
  p_link_id    text default null,
  p_link_title text default null,
  p_device     text default 'desktop',
  p_referrer   text default 'Directo'
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_kind not in ('visit', 'click') then return; end if;
  if not exists (select 1 from public.sites where site_id = p_site_id) then return; end if;

  insert into public.analytics_events (site_id, kind, link_id, link_title, device, referrer)
  values (
    p_site_id,
    p_kind,
    left(p_link_id, 80),
    left(p_link_title, 120),
    case when p_device in ('mobile', 'tablet', 'desktop') then p_device else 'desktop' end,
    left(coalesce(nullif(p_referrer, ''), 'Directo'), 40)
  );
end $$;

revoke all on function public.track_event(text, text, text, text, text, text) from public;
grant execute on function public.track_event(text, text, text, text, text, text) to anon, authenticated;

-- 5) Leer métricas (solo el dueño del sitio) ------------------------------
create or replace function public.get_analytics(p_site_id text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  result jsonb;
begin
  if not exists (select 1 from public.sites where site_id = p_site_id and owner_id = auth.uid()) then
    raise exception 'No autorizado';
  end if;

  select jsonb_build_object(
    'totalVisits', count(*) filter (where kind = 'visit'),
    'totalClicks', count(*) filter (where kind = 'click')
  ) into result
  from public.analytics_events where site_id = p_site_id;

  result := result || jsonb_build_object(
    'clicksByLink', coalesce((
      select jsonb_object_agg(link_id, n) from (
        select link_id, count(*) as n from public.analytics_events
        where site_id = p_site_id and kind = 'click' and link_id is not null
        group by link_id
      ) t), '{}'::jsonb),
    'deviceCounts', coalesce((
      select jsonb_object_agg(device, n) from (
        select device, count(*) as n from public.analytics_events
        where site_id = p_site_id and kind = 'click' and device is not null
        group by device
      ) t), '{}'::jsonb),
    'referrerCounts', coalesce((
      select jsonb_object_agg(referrer, n) from (
        select referrer, count(*) as n from public.analytics_events
        where site_id = p_site_id and kind = 'click' and referrer is not null
        group by referrer
      ) t), '{}'::jsonb),
    'recentEvents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'ev-' || id,
        'linkId', link_id,
        'linkTitle', link_title,
        'timestamp', (extract(epoch from created_at) * 1000)::bigint,
        'device', device,
        'referrer', referrer
      ) order by created_at desc) from (
        select * from public.analytics_events
        where site_id = p_site_id and kind = 'click'
        order by created_at desc limit 30
      ) t), '[]'::jsonb)
  );

  return result;
end $$;

revoke all on function public.get_analytics(text) from public;
grant execute on function public.get_analytics(text) to authenticated;

-- 6) Reiniciar métricas (solo el dueño) ----------------------------------
create or replace function public.reset_analytics(p_site_id text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.sites where site_id = p_site_id and owner_id = auth.uid()) then
    raise exception 'No autorizado';
  end if;
  delete from public.analytics_events where site_id = p_site_id;
end $$;

revoke all on function public.reset_analytics(text) from public;
grant execute on function public.reset_analytics(text) to authenticated;

-- 7) Alta de un cliente nuevo (SOLO tú, desde el SQL Editor) --------------
--   Paso 1: Authentication → Users → Add user (email + clave, "Auto confirm")
--   Paso 2: select public.create_site('thays', 'correo-del-cliente@gmail.com');
create or replace function public.create_site(p_site_id text, p_owner_email text)
returns text
language plpgsql security definer set search_path = public, auth as $$
declare
  v_uid uuid;
begin
  select id into v_uid from auth.users where lower(email) = lower(p_owner_email);
  if v_uid is null then
    raise exception 'Primero crea el usuario % en Authentication → Users', p_owner_email;
  end if;

  insert into public.sites (site_id, owner_id) values (p_site_id, v_uid)
  on conflict (site_id) do update set owner_id = excluded.owner_id;

  return 'Sitio ' || p_site_id || ' asignado a ' || p_owner_email;
end $$;

revoke all on function public.create_site(text, text) from public, anon, authenticated;

-- 8) Alta AUTOMÁTICA al crear un usuario en Authentication ----------------
--   Al crear el usuario se crea su sitio con  site_id = uid del usuario.
--   Ese uid (Authentication → Users → columna "User UID") es el VITE_SITE_ID del repo.
--   Compatibilidad: si ya existe un sitio SIN dueño con el nombre del correo
--   (ej. "thays" para thays@...), el usuario lo toma en vez de crear uno nuevo.
create or replace function public.handle_new_user_site()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
begin
  base := lower(regexp_replace(split_part(coalesce(new.email, ''), '@', 1), '[^a-zA-Z0-9]+', '-', 'g'));
  base := trim(both '-' from left(base, 34));
  if length(base) >= 2 then
    update public.sites set owner_id = new.id where site_id = base and owner_id is null;
    if found then
      return new;
    end if;
  end if;

  insert into public.sites (site_id, owner_id)
  values (new.id::text, new.id)
  on conflict (site_id) do nothing;

  return new;
end $$;

revoke all on function public.handle_new_user_site() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_site on auth.users;
create trigger on_auth_user_created_site
  after insert on auth.users
  for each row execute function public.handle_new_user_site();
