alter table public.families
  add column if not exists hub_visibility text not null default 'private',
  add column if not exists public_join_mode text not null default 'invite',
  add column if not exists public_password_hash text,
  add column if not exists location_label text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists location_accuracy_meters double precision,
  add column if not exists location_captured_at timestamptz;

alter table public.families
  drop constraint if exists families_hub_visibility_check;

alter table public.families
  add constraint families_hub_visibility_check check (
    hub_visibility in ('private', 'public')
  );

alter table public.families
  drop constraint if exists families_public_join_mode_check;

alter table public.families
  add constraint families_public_join_mode_check check (
    public_join_mode in ('invite', 'open', 'password')
  );

alter table public.families
  drop constraint if exists families_location_latitude_check;

alter table public.families
  add constraint families_location_latitude_check check (
    latitude is null or (latitude >= -90 and latitude <= 90)
  );

alter table public.families
  drop constraint if exists families_location_longitude_check;

alter table public.families
  add constraint families_location_longitude_check check (
    longitude is null or (longitude >= -180 and longitude <= 180)
  );

create index if not exists families_public_location_idx
  on public.families (hub_visibility, latitude, longitude)
  where hub_visibility = 'public' and latitude is not null and longitude is not null;

create or replace function public.search_public_hubs_nearby(
  _latitude double precision,
  _longitude double precision,
  _radius_km double precision default 25,
  _limit integer default 24
)
returns table (
  id uuid,
  name text,
  description text,
  hub_type text,
  public_join_mode text,
  location_label text,
  latitude double precision,
  longitude double precision,
  distance_km double precision,
  password_required boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with nearby as (
    select
      f.id,
      f.name,
      f.description,
      f.hub_type,
      f.public_join_mode,
      f.location_label,
      f.latitude,
      f.longitude,
      (
        6371 * acos(
          least(
            1,
            greatest(
              -1,
              cos(radians(_latitude))
              * cos(radians(f.latitude))
              * cos(radians(f.longitude) - radians(_longitude))
              + sin(radians(_latitude))
              * sin(radians(f.latitude))
            )
          )
        )
      ) as distance_km,
      f.public_join_mode = 'password' as password_required
    from public.families f
    where f.hub_visibility = 'public'
      and f.latitude is not null
      and f.longitude is not null
      and _latitude between -90 and 90
      and _longitude between -180 and 180
      and _radius_km > 0
  )
  select *
  from nearby
  where distance_km <= _radius_km
  order by distance_km asc, name asc
  limit least(greatest(_limit, 1), 100);
$$;

grant execute on function public.search_public_hubs_nearby(
  double precision,
  double precision,
  double precision,
  integer
) to authenticated;
