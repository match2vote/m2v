-- Link sources and "finished the quiz" for the /usage page. Run in the
-- Supabase SQL editor after 2026-10-02-usage-notes.sql. Safe to re-run.
--
-- PRIVACY DESIGN (kiki, Oct 2): two additions, same rules as app_opens.
--  1. app_opens.source: which of M2V's OWN tagged links brought the device
--     (qr, site, press, ads, social), or null. The app only records a tag
--     from this fixed list; anything else in the URL is ignored. No referrer,
--     no page, no identifier.
--  2. app_quiz_done: one row per device per local day when a device finishes
--     the quiz. Platform label and server time only. No answers, no matches,
--     no state. Answers never leave the device.
-- Web only, same gate as app_opens. The privacy policy must describe both
-- before (or in the same release as) the web build that sends them.

-- 1. Source tag on the daily open row.
alter table public.app_opens
  add column if not exists source text
  check (source is null or source in ('qr', 'site', 'press', 'ads', 'social'));

-- 2. Finished-the-quiz rows.
create table if not exists public.app_quiz_done (
  id bigint generated always as identity primary key,
  platform text not null check (platform in ('web', 'android', 'ios')),
  created_at timestamptz not null default now()
);
create index if not exists app_quiz_done_created_idx on public.app_quiz_done (created_at);
alter table public.app_quiz_done enable row level security;
drop policy if exists insert_app_quiz_done on public.app_quiz_done;
create policy insert_app_quiz_done on public.app_quiz_done
  for insert to anon with check (true);
revoke all on public.app_quiz_done from anon;
grant insert on public.app_quiz_done to anon;

create or replace function public.throttle_app_quiz_done() returns trigger
language plpgsql security definer as $fn$
begin
  if (select count(*) from public.app_quiz_done
      where platform = new.platform and created_at > now() - interval '60 seconds') >= 1000 then
    raise exception 'rate limited';
  end if;
  return new;
end $fn$;
drop trigger if exists app_quiz_done_throttle on public.app_quiz_done;
create trigger app_quiz_done_throttle
  before insert on public.app_quiz_done
  for each row execute function public.throttle_app_quiz_done();

-- Read views (not exposed to anon). Days are Eastern time.
create or replace view public.app_opens_sources
  with (security_invoker = true) as
  select (created_at at time zone 'America/New_York')::date as day,
         coalesce(source, 'untagged') as source,
         count(*) as opens
  from public.app_opens
  group by 1, 2
  order by 1 desc, 2;
revoke all on public.app_opens_sources from anon;

create or replace view public.app_quiz_daily
  with (security_invoker = true) as
  select (created_at at time zone 'America/New_York')::date as day,
         platform,
         count(*) as done
  from public.app_quiz_done
  group by 1, 2
  order by 1 desc, 2;
revoke all on public.app_quiz_daily from anon;

-- Report: adds sources (per day) and quiz (per day).
create or replace function public.usage_report(report_key text)
returns json
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if report_key is null
     or not exists (select 1 from public.report_keys k where k.key = report_key) then
    raise exception 'invalid report key' using errcode = '28000';
  end if;
  return json_build_object(
    'generated_at', now(),
    'totals', (select coalesce(json_agg(t), '[]'::json) from public.app_opens_totals t),
    'daily',  (select coalesce(json_agg(d), '[]'::json)
               from (select day, platform, opens, new_devices
                     from public.app_opens_daily order by day) d),
    'hourly', (select coalesce(json_agg(h), '[]'::json)
               from (select day, hour, platform, opens, new_devices
                     from public.app_opens_hourly
                     where day >= (now() at time zone 'America/New_York')::date - 13
                     order by day, hour) h),
    'notes',  (select coalesce(json_agg(n), '[]'::json)
               from (select day, note from public.usage_notes order by day) n),
    'sources', (select coalesce(json_agg(s), '[]'::json)
                from (select day, source, opens from public.app_opens_sources order by day) s),
    'quiz',   (select coalesce(json_agg(q), '[]'::json)
               from (select day, platform, done from public.app_quiz_daily order by day) q)
  );
end
$fn$;
revoke all on function public.usage_report(text) from public;
grant execute on function public.usage_report(text) to anon;
