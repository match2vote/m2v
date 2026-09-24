-- Hourly detail for the /usage page. Run in the Supabase SQL editor after
-- 2026-09-18-usage-report.sql. Safe to re-run.
--
-- Adds an hour-of-day view (Eastern time) and returns the last 14 days of it
-- from usage_report(). Still aggregate counts only: how many devices had
-- their first open of the day in each hour. No row-level data leaves the
-- database, and the key rules from 2026-09-18-usage-report.sql are unchanged.

create or replace view public.app_opens_hourly
  with (security_invoker = true) as
  select (created_at at time zone 'America/New_York')::date as day,
         extract(hour from created_at at time zone 'America/New_York')::int as hour,
         platform,
         count(*) as opens,
         count(*) filter (where first_open) as new_devices
  from public.app_opens
  group by 1, 2, 3
  order by 1 desc, 2, 3;

revoke all on public.app_opens_hourly from anon;

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
                     order by day, hour) h)
  );
end
$fn$;

revoke all on function public.usage_report(text) from public;
grant execute on function public.usage_report(text) to anon;
