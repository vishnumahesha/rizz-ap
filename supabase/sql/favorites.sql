create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_id text not null,
  label text not null,
  text text not null,
  risk text not null check (risk in ('low', 'medium', 'high')),
  why text not null
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);
