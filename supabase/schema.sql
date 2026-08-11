-- M2V production schema. Run once in Supabase SQL editor (or via psql).
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.

create table if not exists public.candidates (
  id text primary key,
  state text not null,
  office text not null,
  district text,
  name text not null,
  party text,
  incumbent boolean default false,
  tier text not null default 'fec',
  ballot_status text,
  background text,
  positions jsonb,
  position_sources jsonb,
  sources jsonb,
  funding jsonb,
  updated_at timestamptz default now()
);
create index if not exists candidates_state_idx on public.candidates(state);

create table if not exists public.race_meta (
  race_id text primary key,
  state text not null,
  status text,
  status_note text,
  advancing jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.meta (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

alter table public.candidates enable row level security;
alter table public.race_meta enable row level security;
alter table public.meta enable row level security;

drop policy if exists read_candidates on public.candidates;
drop policy if exists read_race_meta on public.race_meta;
drop policy if exists read_meta on public.meta;
create policy read_candidates on public.candidates for select using (true);
create policy read_race_meta on public.race_meta for select using (true);
create policy read_meta on public.meta for select using (true);

-- HARD RULE, enforced at the database: a scored position without a source
-- cannot exist, no matter what client wrote it.
create or replace function public.check_position_sources() returns trigger
language plpgsql as $fn$
declare k text;
begin
  if new.positions is not null then
    for k in select jsonb_object_keys(new.positions) loop
      if new.positions->>k is not null
         and (new.position_sources is null or new.position_sources->k is null) then
        raise exception 'HARD RULE: position "%" on candidate % has no source URL', k, new.id;
      end if;
    end loop;
  end if;
  return new;
end $fn$;

drop trigger if exists positions_require_sources on public.candidates;
create trigger positions_require_sources
  before insert or update on public.candidates
  for each row execute function public.check_position_sources();
