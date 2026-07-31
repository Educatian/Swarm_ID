-- DTS research-operations extension.
-- Run after docs/supabase_schema.sql in the Supabase SQL editor.
-- Auth account creation stays in an Edge Function; the browser never receives service_role.

create table if not exists public.course_invites (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  email text not null,
  display_name text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  auth_user_id uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  last_sent_at timestamptz,
  accepted_at timestamptz,
  revoked_at timestamptz,
  unique(course_id, email)
);

create table if not exists public.facilitator_actions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  instructor_id uuid not null references public.profiles(id) on delete restrict,
  action_type text not null check (action_type in ('topic_candidate', 'mediator_move', 'open_question')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'published', 'dismissed')),
  content jsonb not null default '{}'::jsonb,
  target_audience text not null default 'course',
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz
);

create table if not exists public.research_consents (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  consent_version text not null,
  granted boolean not null default false,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  primary key (user_id, course_id, consent_version)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  role text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  session_id uuid,
  seq integer,
  client_ts timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_course_created_idx
  on public.analytics_events(course_id, created_at desc);
create index if not exists analytics_events_session_seq_idx
  on public.analytics_events(session_id, seq);

alter table public.course_invites enable row level security;
alter table public.facilitator_actions enable row level security;
alter table public.research_consents enable row level security;
alter table public.analytics_events enable row level security;

create policy "course admins can read invites"
on public.course_invites for select to authenticated
using (exists (
  select 1 from public.course_memberships m
  where m.course_id = course_invites.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
));

create policy "course admins can manage invites"
on public.course_invites for all to authenticated
using (exists (
  select 1 from public.course_memberships m
  where m.course_id = course_invites.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
))
with check (exists (
  select 1 from public.course_memberships m
  where m.course_id = course_invites.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
));

create policy "instructors can manage facilitator actions"
on public.facilitator_actions for all to authenticated
using (instructor_id = (select auth.uid()) and exists (
  select 1 from public.course_memberships m
  where m.course_id = facilitator_actions.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
))
with check (instructor_id = (select auth.uid()) and exists (
  select 1 from public.course_memberships m
  where m.course_id = facilitator_actions.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
));

create policy "learners can read published facilitator actions"
on public.facilitator_actions for select to authenticated
using (status = 'published' and exists (
  select 1 from public.course_memberships m
  where m.course_id = facilitator_actions.course_id
    and m.user_id = (select auth.uid()) and m.status = 'active'
));

create policy "users manage own research consent"
on public.research_consents for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "users insert own analytics"
on public.analytics_events for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "course admins read course analytics"
on public.analytics_events for select to authenticated
using (exists (
  select 1 from public.course_memberships m
  where m.course_id = analytics_events.course_id
    and m.user_id = (select auth.uid())
    and m.role = 'admin' and m.status = 'active'
));

create policy "users can delete own learner runs"
on public.learner_runs for delete to authenticated
using (learner_id = (select auth.uid()));

create policy "users can delete own analytics"
on public.analytics_events for delete to authenticated
using (user_id = (select auth.uid()));

-- Existing logEvent rows remain compatible; these columns are additive.
alter table public.analytics_events add column if not exists session_id uuid;
alter table public.analytics_events add column if not exists seq integer;

-- Course-code RPCs are called only after the landing flow authenticates.
-- Keep the SECURITY DEFINER implementation for RLS-safe self-enrollment, but
-- remove the default PUBLIC/anon execute grant.
revoke execute on function public.lookup_course_by_join_code(text) from public;
grant execute on function public.lookup_course_by_join_code(text) to authenticated;
revoke execute on function public.enroll_in_course_by_code(text,text,text) from public;
grant execute on function public.enroll_in_course_by_code(text,text,text) to authenticated;
revoke execute on function public.is_course_admin(uuid) from public;
grant execute on function public.is_course_admin(uuid) to authenticated;
