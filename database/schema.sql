-- DecisionHub Database Schema

-- 1. Create 'decisions' table
-- Stores the main decision topics initiated by users
create table public.decisions (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  title text not null,
  description text null,
  stage text not null default 'explore', -- 'explore' or 'vote'
  status text not null default 'active', -- 'active' or 'closed'
  "creatorId" uuid not null references auth.users(id)
);

-- 2. Create 'options' table
-- Stores candidate options for each decision
create table public.options (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  title text not null,
  description text null,
  "decisionId" uuid not null references public.decisions(id) on delete cascade,
  "proposedBy" uuid not null references auth.users(id)
);

-- 3. Create 'votes' table
-- Stores user votes for specific options
create table public.votes (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  "userId" uuid not null references auth.users(id),
  "optionId" uuid not null references public.options(id) on delete cascade,
  "decisionId" uuid not null references public.decisions(id) on delete cascade
);

-- 4. Create 'reactions' table
-- Stores emoji-like reactions (like, question, concern)
create table public.reactions (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  type text not null,
  "userId" uuid not null references auth.users(id),
  "optionId" uuid not null references public.options(id) on delete cascade,
  "decisionId" uuid not null references public.decisions(id) on delete cascade
);

-- 5. Create 'comments' table
-- Stores discussion comments
create table public.comments (
  id uuid not null default gen_random_uuid() primary key,
  "createdAt" timestamptz not null default now(),
  content text not null,
  "userId" uuid not null references auth.users(id),
  "decisionId" uuid not null references public.decisions(id) on delete cascade,
  "optionId" uuid null references public.options(id) on delete set null
);

-- 6. Create 'profiles' table (Optional but recommended for displaying user names)
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  name text,
  avatar text
);

-- 7. Enable Row Level Security (RLS)
alter table public.decisions enable row level security;
alter table public.options enable row level security;
alter table public.votes enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;
alter table public.profiles enable row level security;

-- 8. Create Security Policies
-- (Allows authenticated users to read/write data for demonstration purposes)
create policy "Allow all for authenticated" on public.decisions for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.options for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.votes for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.reactions for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on public.comments for all to authenticated using (true) with check (true);
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- 9. Setup Profile Auto-Creation Trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar)
  values (new.id, new.raw_user_meta_data->>'name', '👤');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();