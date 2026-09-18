-- Usage report for the /usage page. Run in the Supabase SQL editor.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.
--
-- WHY: app_opens is insert-only for the publishable key, so nothing that
-- ships in a browser can read it. The usage page at app.match2vote.org/usage
-- still needs the aggregate numbers, so it calls this one function with a
-- report key. The function returns ONLY the two aggregate views (per-day and
-- per-platform counts). It never returns rows, timestamps of individual
-- opens, or anything else. Without a valid key it returns an error. The
-- publishable key alone still cannot read the table, so the privacy page's
-- sentence ("the write-only key the app uses cannot read the table back")
-- stays true.
--
-- To revoke a leaked key: delete its row from report_keys and insert a new
-- one; the usage page asks for the new key on next open.

create table if not exists public.report_keys (
  key text primary key,
  label text not null,
  created_at timestamptz not null default now()
);
alter table public.report_keys enable row level security;
-- No policies: nothing but the SQL editor (postgres) can read this table.
revoke all on public.report_keys from anon, authenticated;

insert into public.report_keys (key, label)
-- Replace <REPORT_KEY> with a long random string before running.
values ('<REPORT_KEY>', 'usage page, created Sep 18, 2026')
on conflict (key) do nothing;

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
                     from public.app_opens_daily order by day) d)
  );
end
$fn$;

revoke all on function public.usage_report(text) from public;
grant execute on function public.usage_report(text) to anon;
