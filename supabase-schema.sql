create table if not exists public.ghats (
  id text primary key,
  name text not null,
  city text not null,
  district text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  physical_capacity integer not null check (physical_capacity >= 0),
  effective_capacity integer not null check (effective_capacity >= 0),
  general_ticket_price numeric not null default 0 check (general_ticket_price >= 0),
  vip_ticket_price numeric not null default 0 check (vip_ticket_price >= 0),
  has_wheelchair_ramp boolean not null default false,
  has_parking boolean not null default false,
  image text not null,
  description text not null
);

create table if not exists public.crowd_status (
  ghat_id text primary key references public.ghats(id) on delete cascade,
  crowd_percentage numeric not null check (crowd_percentage between 0 and 100),
  active_pilgrims integer not null check (active_pilgrims >= 0),
  entry_throughput integer not null default 0 check (entry_throughput >= 0),
  exit_throughput integer not null default 0 check (exit_throughput >= 0),
  updated_at timestamptz not null default now()
);

alter table public.ghats enable row level security;
alter table public.crowd_status enable row level security;

create policy "Ghats are publicly readable"
  on public.ghats for select using (true);

create policy "Crowd status is publicly readable"
  on public.crowd_status for select using (true);
