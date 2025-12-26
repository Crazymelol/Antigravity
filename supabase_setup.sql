-- Create the scores table
create table public.scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  email text,
  name text not null,
  score bigint not null,
  mode text not null
);

-- Enable Row Level Security (RLS)
alter table public.scores enable row level security;

-- Policy: Allow anyone (authenticated) to insert their own score
create policy "Users can insert their own scores"
on public.scores for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Allow everyone (even anon if you want, but code requires auth) to read scores (for leaderboard)
create policy "Anyone can read scores"
on public.scores for select
to authenticated, anon
using (true);

-- Optional: Create a view or index for faster leaderboard queries
create index scores_score_idx on public.scores (score desc);
