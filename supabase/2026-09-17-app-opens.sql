-- Usage counter: one row per device per day. Run in the Supabase SQL editor.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.
--
-- PRIVACY DESIGN (kiki, Sep 17): same rules as state_interest. Each row is a
-- platform label ('web', 'android', 'ios'), a yes/no for "this device had
-- never been counted before", and a server-side timestamp. No IP, no device
-- id, no user id, no session id, no user agent, no page, no state, no cookie.
-- Nothing here can be joined back to a person. The app sends at most one row
-- per device per local calendar day (remembered on the device, see
-- recordAppOpen in apps/mobile/src/api.js). The privacy policy ("How we count
-- use") describes exactly this; if you add a column here, update the policy
-- in the same commit.
--
-- As of Sep 17 only the WEB build sends rows. The Android build is unchanged
-- so the Play listing ("No analytics") and Data safety form stay accurate.
--
-- HOW TO READ THE NUMBERS (Eastern time days):
--   select * from public.app_opens_totals;   -- one row per platform: today,
--                                            -- yesterday, 7 days, 30 days,
--                                            -- all time, devices reached
--   select * from public.app_opens_daily;    -- one row per day per platform
-- "opens" = devices that opened the app that day (one row per device per day).
-- "new_devices" = devices counted for the first time that day. A device that
-- clears its browser storage counts as new again, so treat "devices reached"
-- as a ceiling, not an exact figure.

create table if not exists public.app_opens (
  id bigint generated always as identity primary key,
  platform text not null check (platform in ('web', 'android', 'ios')),
  first_open boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.app_opens add column if not exists first_open boolean not null default false;
create index if not exists app_opens_created_idx on public.app_opens (created_at);

alter table public.app_opens enable row level security;

-- INSERT-ONLY for the publishable (anon) key. No select/update/delete policy
-- exists, so the key that ships in the app cannot read the table.
drop policy if exists insert_app_opens on public.app_opens;
create policy insert_app_opens on public.app_opens
  for insert to anon with check (true);

revoke all on public.app_opens from anon;
grant insert on public.app_opens to anon;

-- Anti-stuffing throttle. Per-person limits are impossible by design (no
-- identifier), so cap the global insert rate per platform: more than 1,000
-- rows for one platform inside 60 seconds is a script, not voters. That is
-- about 1.4 million opens a day before anything is dropped.
create or replace function public.throttle_app_opens() returns trigger
language plpgsql security definer as $fn$
begin
  if (select count(*) from public.app_opens
      where platform = new.platform and created_at > now() - interval '60 seconds') >= 1000 then
    raise exception 'rate limited';
  end if;
  return new;
end $fn$;

drop trigger if exists app_opens_throttle on public.app_opens;
create trigger app_opens_throttle
  before insert on public.app_opens
  for each row execute function public.throttle_app_opens();

-- Read views for kiki. Not exposed to anon; query them from the SQL editor
-- (saved snippets "M2V usage: totals" and "M2V usage: daily") or the table
-- editor. Days are Eastern time.
drop view if exists public.app_opens_daily;
create view public.app_opens_daily
  with (security_invoker = true) as
  select (created_at at time zone 'America/New_York')::date as day,
         platform,
         count(*) as opens,
         count(*) filter (where first_open) as new_devices
  from public.app_opens
  group by 1, 2
  order by 1 desc, 2;

drop view if exists public.app_opens_totals;
create view public.app_opens_totals
  with (security_invoker = true) as
  with local as (
    select platform, first_open,
           (created_at at time zone 'America/New_York')::date as day,
           created_at
    from public.app_opens
  ), today as (
    select (now() at time zone 'America/New_York')::date as d
  )
  select platform,
         count(*) filter (where day = (select d from today)) as today,
         count(*) filter (where day = (select d from today) - 1) as yesterday,
         count(*) filter (where created_at > now() - interval '7 days') as last_7_days,
         count(*) filter (where created_at > now() - interval '30 days') as last_30_days,
         count(*) as all_time,
         count(*) filter (where first_open) as devices_reached,
         min(created_at) as first_open_at,
         max(created_at) as latest_open_at
  from local
  group by platform
  order by platform;

revoke all on public.app_opens_daily from anon;
revoke all on public.app_opens_totals from anon;
