create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions (id) on delete cascade,
  code text not null,
  join_code text unique,
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.course_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  institution_id uuid not null references public.institutions (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  role text not null check (role in ('admin', 'user')),
  display_name text,
  title text,
  focus text,
  section text,
  is_primary boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create unique index if not exists course_memberships_one_active_student_per_user
on public.course_memberships (user_id)
where role = 'user' and status = 'active';

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  summary text,
  prompt text,
  agenda_prompt text,
  submission_deadline timestamptz,
  learning_goals jsonb not null default '[]'::jsonb,
  constraints jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  chat jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  stakeholder_profiles jsonb not null default '{}'::jsonb,
  matrix_insights jsonb not null default '[]'::jsonb,
  sandbox_feed jsonb not null default '[]'::jsonb,
  reflection_prompts jsonb not null default '[]'::jsonb,
  network_meta jsonb not null default '[]'::jsonb,
  ui_copy jsonb not null default '{}'::jsonb,
  board_settings jsonb not null default '{}'::jsonb,
  pipeline jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  title text not null,
  kind text not null default 'uploaded-brief',
  text text not null,
  published boolean not null default false,
  uploaded_at date not null default current_date
);

create table if not exists public.learner_runs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  learner_name text,
  learner_focus text,
  status text not null default 'Learner workspace updated',
  metrics jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  chat jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  agenda_nodes jsonb not null default '[]'::jsonb,
  ai_generated_nodes jsonb not null default '[]'::jsonb,
  annotations jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (case_id, learner_id)
);

create table if not exists public.cohort_graph_snapshots (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  snapshot_type text not null default 'cohort' check (snapshot_type in ('group', 'cohort')),
  nodes jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.institutions enable row level security;
alter table public.courses enable row level security;
alter table public.course_memberships enable row level security;
alter table public.cases enable row level security;
alter table public.documents enable row level security;
alter table public.learner_runs enable row level security;
alter table public.cohort_graph_snapshots enable row level security;

create policy "profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;

create policy "users can insert own profile"
on public.profiles
for insert
with check (
  auth.uid() = id
);

create policy "users can update own profile"
on public.profiles
for update
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);

create policy "members can read institutions"
on public.institutions
for select
using (
  (auth.jwt() ->> 'email') = 'admin@swarm.io'
  or exists (
    select 1
    from public.course_memberships m
    where m.institution_id = institutions.id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

create policy "members can read courses"
on public.courses
for select
using (
  (auth.jwt() ->> 'email') = 'admin@swarm.io'
  or exists (
    select 1
    from public.course_memberships m
    where m.course_id = courses.id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists "members can read same-course memberships" on public.course_memberships;
drop policy if exists "platform admin can create institutions" on public.institutions;
drop policy if exists "platform admin can create courses" on public.courses;
drop policy if exists "platform admin can create memberships" on public.course_memberships;
drop policy if exists "authenticated users can read joinable courses" on public.courses;
drop policy if exists "students can join a course by code" on public.course_memberships;

create policy "users can read own memberships"
on public.course_memberships
for select
using (
  user_id = auth.uid()
);

create policy "platform admin can create institutions"
on public.institutions
for insert
with check (
  (auth.jwt() ->> 'email') = 'admin@swarm.io'
);

create policy "platform admin can create courses"
on public.courses
for insert
with check (
  (auth.jwt() ->> 'email') = 'admin@swarm.io'
);

create policy "platform admin can create memberships"
on public.course_memberships
for insert
with check (
  (auth.jwt() ->> 'email') = 'admin@swarm.io'
);

create policy "authenticated users can read joinable courses"
on public.courses
for select
using (
  auth.role() = 'authenticated'
  and join_code is not null
);

create policy "students can join a course by code"
on public.course_memberships
for insert
with check (
  user_id = auth.uid()
  and role = 'user'
  and status = 'active'
  and exists (
    select 1
    from public.courses c
    where c.id = course_memberships.course_id
      and c.institution_id = course_memberships.institution_id
      and c.join_code is not null
  )
);

create policy "students can read published cases and instructors can read all cases"
on public.cases
for select
using (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = cases.course_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and (m.role = 'admin' or cases.published = true)
  )
);

drop policy if exists "admins can insert cases" on public.cases;
drop policy if exists "admins can update cases" on public.cases;

create policy "admins can insert cases"
on public.cases
for insert
with check (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = cases.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

create policy "admins can update cases"
on public.cases
for update
using (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = cases.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
)
with check (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = cases.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

create policy "students can read published documents and instructors can read all documents"
on public.documents
for select
using (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = documents.course_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and (m.role = 'admin' or documents.published = true)
  )
);

drop policy if exists "admins can insert documents" on public.documents;
drop policy if exists "admins can update documents" on public.documents;

create policy "admins can insert documents"
on public.documents
for insert
with check (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = documents.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

create policy "admins can update documents"
on public.documents
for update
using (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = documents.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
)
with check (
  exists (
    select 1
    from public.course_memberships m
    where m.course_id = documents.course_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

create policy "learners can read own runs and instructors can read course runs"
on public.learner_runs
for select
using (
  learner_id = auth.uid()
  or exists (
    select 1
    from public.cases c
    join public.course_memberships m on m.course_id = c.course_id
    where c.id = learner_runs.case_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

drop policy if exists "learners can insert own runs" on public.learner_runs;
drop policy if exists "learners can update own runs and instructors can update course runs" on public.learner_runs;

create policy "learners can insert own runs"
on public.learner_runs
for insert
with check (
  learner_id = auth.uid()
);

create policy "learners can update own runs and instructors can update course runs"
on public.learner_runs
for update
using (
  learner_id = auth.uid()
  or exists (
    select 1
    from public.cases c
    join public.course_memberships m on m.course_id = c.course_id
    where c.id = learner_runs.case_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
)
with check (
  learner_id = auth.uid()
  or exists (
    select 1
    from public.cases c
    join public.course_memberships m on m.course_id = c.course_id
    where c.id = learner_runs.case_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
      and m.status = 'active'
  )
);

create policy "members can read cohort snapshots for their course"
on public.cohort_graph_snapshots
for select
using (
  exists (
    select 1
    from public.cases c
    join public.course_memberships m on m.course_id = c.course_id
    where c.id = cohort_graph_snapshots.case_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);
