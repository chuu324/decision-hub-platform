-- DecisionHub Database Schema
-- Track 1: Database Application Development

-- 1. Create 'decisions' table
create table public.decisions (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  title text not null,
  description text null,
  stage text not null default 'explore',
  status text not null default 'active',
  "creatorId" uuid not null references auth.users(id)
);

-- 2. Create 'options' table
create table public.options (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  title text not null,
  description text null,
  "decisionId" uuid not null references public.decisions(id) on delete cascade,
  "proposedBy" uuid not null references auth.users(id)
);

-- 3. Create 'votes' table
create table public.votes (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  "userId" uuid not null references auth.users(id),
  "optionId" uuid not null references public.options(id) on delete cascade,
  "decisionId" uuid not null references public.decisions(id) on delete cascade
);

-- 4. Create 'reactions' table
create table public.reactions (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  type text not null,
  "userId" uuid not null references auth.users(id),
  "optionId" uuid not null references public.options(id) on delete cascade,
  "decisionId" uuid not null references public.decisions(id) on delete cascade
);

-- 5. Create 'comments' table
create table public.comments (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  content text not null,
  "userId" uuid not null references auth.users(id),
  "decisionId" uuid not null references public.decisions(id) on delete cascade,
  "optionId" uuid null references public.options(id) on delete set null
);

-- 6. Enable Row Level Security (RLS)
alter table public.decisions enable row level security;
alter table public.options enable row level security;
alter table public.votes enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;

-- 7. Create security policies
-- (Allows authenticated users to access data for demonstration purposes)
create policy "Allow all for authenticated" on public.decisions for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.options for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.votes for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.reactions for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.comments for all to authenticated using (true) with check (true);