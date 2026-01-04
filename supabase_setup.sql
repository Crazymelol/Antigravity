-- Create the scores table
create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  email text,
  name text not null,
  score bigint not null,
  mode text not null
);

-- Create Profiles Table (Economy & Pro Status)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  real_cash numeric default 0,
  bonus_cash numeric default 0.00,
  is_pro boolean default false,
  updated_at timestamp with time zone
);

-- Create Matches Table (Multiplayer)
create table if not exists public.matches (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    player1_id uuid references auth.users,
    player2_id uuid references auth.users,
    status text default 'searching', -- searching, active, finished
    winner_id uuid references auth.users,
    wager numeric default 0,
    p1_score int default 0,
    p2_score int default 0
);

-- RLS
alter table public.scores enable row level security;
alter table public.profiles enable row level security;
alter table public.matches enable row level security;

-- Policies
create policy "Public Read Scores" on public.scores for select using (true);
create policy "Insert Own Score" on public.scores for insert with check (auth.uid() = user_id);

create policy "Public Read Profiles" on public.profiles for select using (true);
create policy "Update Own Profile" on public.profiles for update using (auth.uid() = id);
create policy "Insert Own Profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Matches Select" on public.matches for select using (true);
create policy "Matches Insert" on public.matches for insert with check (auth.uid() = player1_id);
create policy "Matches Update" on public.matches for update using (auth.uid() in (player1_id, player2_id));

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, real_cash, bonus_cash)
  values (new.id, new.raw_user_meta_data->>'name', 0, 0.50); -- 0.50 Sign up bonus
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for Matches (Required for Live 1v1)
alter publication supabase_realtime add table matches;
