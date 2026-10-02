-- Notes for the /usage page. Run in the Supabase SQL editor after
-- 2026-09-23-usage-hourly.sql. Safe to re-run.
--
-- A note is a dated label kiki writes herself ("press day", "ads live") so
-- the daily chart stays readable months later. Notes are about M2V's own
-- calendar, never about users; nothing the app sends changes. The usage page
-- reads and writes them through two functions guarded by the report key.

create table if not exists public.usage_notes (
  day date primary key,
  note text not null,
  updated_at timestamptz not null default now()
);
alter table public.usage_notes enable row level security;
revoke all on public.usage_notes from anon, authenticated;

-- Set, replace, or (with an empty note) delete the note for one day.
create or replace function public.usage_note_set(report_key text, note_day date, note_text text)
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
  if note_text is null or btrim(note_text) = '' then
    delete from public.usage_notes where day = note_day;
  else
    insert into public.usage_notes (day, note) values (note_day, left(btrim(note_text), 120))
    on conflict (day) do update set note = excluded.note, updated_at = now();
  end if;
  return (select coalesce(json_agg(n order by n.day), '[]'::json)
          from (select u.day, u.note from public.usage_notes u) n);
end
$fn$;
revoke all on function public.usage_note_set(text, date, text) from public;
grant execute on function public.usage_note_set(text, date, text) to anon;

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
               from (select day, note from public.usage_notes order by day) n)
  );
end
$fn$;
revoke all on function public.usage_report(text) from public;
grant execute on function public.usage_report(text) to anon;
