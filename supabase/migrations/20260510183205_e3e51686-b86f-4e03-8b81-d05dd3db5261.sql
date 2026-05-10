
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  email text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- FAMILIES
create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.families enable row level security;

create trigger families_updated_at
  before update on public.families
  for each row execute function public.set_updated_at();

-- FAMILY MEMBERS
create table public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

alter table public.family_members enable row level security;

-- Security definer helper to avoid RLS recursion
create or replace function public.is_family_member(_family_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = _family_id and user_id = _user_id
  );
$$;

-- families policies (use helper)
create policy "Members can view their families"
  on public.families for select
  using (public.is_family_member(id, auth.uid()));

create policy "Authenticated users can create a family"
  on public.families for insert
  with check (auth.uid() = created_by);

create policy "Members can update their families"
  on public.families for update
  using (public.is_family_member(id, auth.uid()));

-- family_members policies
create policy "Members can view their family's members"
  on public.family_members for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can join as themselves"
  on public.family_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave (delete own membership)"
  on public.family_members for delete
  using (auth.uid() = user_id);

-- Auto-add creator as a member when family is created
create or replace function public.add_creator_as_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.family_members (family_id, user_id)
  values (new.id, new.created_by)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_family_created
  after insert on public.families
  for each row execute function public.add_creator_as_member();

-- INVITES
create table public.family_invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(18), 'base64'),
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '14 days'),
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index family_invites_token_idx on public.family_invites(token);

alter table public.family_invites enable row level security;

-- Members of the family can view/create invites
create policy "Members can view family invites"
  on public.family_invites for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Members can create invites"
  on public.family_invites for insert
  with check (
    public.is_family_member(family_id, auth.uid())
    and auth.uid() = created_by
  );

create policy "Members can revoke invites"
  on public.family_invites for delete
  using (public.is_family_member(family_id, auth.uid()));

-- RPC to look up an invite by token (bypasses RLS so a non-member can preview)
create or replace function public.get_invite_by_token(_token text)
returns table (id uuid, family_id uuid, family_name text, expires_at timestamptz, used_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select i.id, i.family_id, f.name as family_name, i.expires_at, i.used_at
  from public.family_invites i
  join public.families f on f.id = i.family_id
  where i.token = _token
  limit 1;
$$;

-- RPC to accept an invite atomically
create or replace function public.accept_family_invite(_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite record;
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_invite
  from public.family_invites
  where token = _token
  limit 1;

  if v_invite is null then
    raise exception 'Invite not found';
  end if;

  if v_invite.expires_at < now() then
    raise exception 'Invite expired';
  end if;

  insert into public.family_members (family_id, user_id)
  values (v_invite.family_id, v_user)
  on conflict do nothing;

  update public.family_invites
  set used_at = coalesce(used_at, now()), used_by = coalesce(used_by, v_user)
  where id = v_invite.id;

  return v_invite.family_id;
end;
$$;
