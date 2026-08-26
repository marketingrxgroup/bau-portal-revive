-- Bauportal schema: machines, dealers (profiles), roles, favorites, brand logos
-- Replaces static mock data with a real database-backed catalog.

-- ===== User roles =====
create type public.app_role as enum ('admin', 'dealer', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Users can read their own roles; admins read all
create policy "users read own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ===== Profiles (dealers / buyers) =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company text,
  city text,
  is_dealer boolean not null default false,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles self read"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "profiles self upsert"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "profiles self update"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ===== Brand logos =====
create table public.brand_logos (
  brand text primary key,
  logo_url text not null
);
grant select on public.brand_logos to anon, authenticated;
grant all on public.brand_logos to service_role;
alter table public.brand_logos enable row level security;
create policy "brand logos public read"
  on public.brand_logos for select to anon, authenticated using (true);

insert into public.brand_logos (brand, logo_url) values
  ('Eurocomach', '/__l5e/assets-v1/f63f295f-c6a0-4cf4-a427-f9afcd911536/tifermec-logo.png'),
  ('Tifermec', '/__l5e/assets-v1/f63f295f-c6a0-4cf4-a427-f9afcd911536/tifermec-logo.png'),
  ('Zoomlion', '/__l5e/assets-v1/f63f295f-c6a0-4cf4-a427-f9afcd911536/tifermec-logo.png');

-- ===== Machines =====
create type public.machine_status as enum ('draft', 'published', 'archived');

create table public.machines (
  id text primary key,
  dealer_id uuid references public.profiles(id) on delete set null,
  title text not null,
  brand text not null,
  model text,
  cat_no text,
  category text not null,
  subcategory text,
  year int,
  hours int not null default 0,
  weight_t numeric not null default 0,
  power_hp int,
  price int,
  original_price int,
  location text,
  condition text not null default 'Втора употреба',
  image text not null,
  images jsonb,
  tags jsonb not null default '[]'::jsonb,
  description text,
  specs jsonb,
  equipment jsonb,
  description_blocks jsonb,
  faq jsonb,
  long_description jsonb,
  basic_description jsonb,
  featured boolean not null default false,
  status machine_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Public catalog: anyone can browse published machines
grant select on public.machines to anon, authenticated;
grant select, insert, update, delete on public.machines to service_role;
alter table public.machines enable row level security;

create policy "machines public read"
  on public.machines for select to anon, authenticated
  using (status = 'published');

-- Dealers manage their own listings; admins manage all
create policy "machines dealer insert"
  on public.machines for insert to authenticated
  with check (public.has_role(auth.uid(), 'dealer') or public.has_role(auth.uid(), 'admin'));

create policy "machines dealer update"
  on public.machines for update to authenticated
  using (dealer_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (dealer_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "machines dealer delete"
  on public.machines for delete to authenticated
  using (dealer_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ===== Favorites =====
create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  machine_id text not null references public.machines(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, machine_id)
);
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;

create policy "favorites self read"
  on public.favorites for select to authenticated using (user_id = auth.uid());
create policy "favorites self insert"
  on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy "favorites self delete"
  on public.favorites for delete to authenticated using (user_id = auth.uid());

-- ===== Inquiries =====
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  machine_id text references public.machines(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete set null,
  dealer_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, insert on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;

create policy "inquiries buyer read own"
  on public.inquiries for select to authenticated
  using (buyer_id = auth.uid() or dealer_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "inquiries insert"
  on public.inquiries for insert to authenticated with check (true);