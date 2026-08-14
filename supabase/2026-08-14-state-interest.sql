-- One-tap "cover my state" interest signal. Run in the Supabase SQL editor.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.
--
-- PRIVACY DESIGN (kiki, Aug 14): this table stores the absolute minimum,
-- a two-letter state code and a server-side timestamp. No IP, no device id,
-- no user id, no session id, no user agent. Nothing in this schema can be
-- joined back to a person. The app's privacy policy documents exactly this;
-- if you add a column here, update the policy in the same commit.

create table if not exists public.state_interest (
  id bigint generated always as identity primary key,
  state text not null check (state in (
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
    'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
    'VA','WA','WV','WI','WY','DC'
  )),
  created_at timestamptz not null default now()
);

alter table public.state_interest enable row level security;

-- INSERT-ONLY for the publishable (anon) key. No select/update/delete policy
-- exists, so PostgREST returns an error or empty for reads with that key.
drop policy if exists insert_state_interest on public.state_interest;
create policy insert_state_interest on public.state_interest
  for insert to anon with check (true);

-- Belt and braces: revoke everything except insert from the anon role, and
-- block PostgREST from returning the inserted row (the app posts with
-- Prefer: return=minimal anyway).
revoke all on public.state_interest from anon;
grant insert on public.state_interest to anon;

-- Crude anti-stuffing throttle. Per-person rate limiting is impossible by
-- design (we refuse to store any identifier), so instead cap the global
-- insert rate per state: more than 30 rows for one state inside 60 seconds
-- is scripted traffic, not voters. The app itself sends at most one row per
-- device per state (persisted locally).
create or replace function public.throttle_state_interest() returns trigger
language plpgsql security definer as $fn$
begin
  if (select count(*) from public.state_interest
      where state = new.state and created_at > now() - interval '60 seconds') >= 30 then
    raise exception 'rate limited';
  end if;
  return new;
end $fn$;

drop trigger if exists state_interest_throttle on public.state_interest;
create trigger state_interest_throttle
  before insert on public.state_interest
  for each row execute function public.throttle_state_interest();

-- Read view for the dashboard (kiki): interest counts by state, sorted.
-- Not exposed to anon; query it from the SQL editor or the table editor:
--   select * from public.state_interest_counts;
create or replace view public.state_interest_counts
  with (security_invoker = true) as
  select state, count(*) as taps,
         min(created_at) as first_tap, max(created_at) as latest_tap
  from public.state_interest
  group by state
  order by taps desc, state;

revoke all on public.state_interest_counts from anon;
