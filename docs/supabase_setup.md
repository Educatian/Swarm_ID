# Supabase Setup

1. Put your project URL and anon key in [supabase-config.js](C:\Users\jewoo\Desktop\Swarm_ID\supabase-config.js).
2. Run the SQL in [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql) in the Supabase SQL editor.
3. Create Auth users in Supabase Auth.
4. Insert your own rows into `profiles`, `institutions`, `courses`, and `course_memberships`.
5. Put a shareable `join_code` on each course if students should be able to join by code.
6. Add `cases`, `documents`, optional `learner_runs`, and optional `cohort_graph_snapshots` for each course.
7. If you want live AI generation in local browser testing, put a Gemini key in `gemini-config.js`.
8. If you want live AI generation on Vercel, add `GEMINI_API_KEY` to the project environment variables. The app will call `/api/gemini` when no browser-side key is present.

If you want one root admin to create the first institution and course from inside the app, create that Auth user as `admin@swarm.io` and apply the root-admin insert policies from [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql). That account can bootstrap institutions, courses, and its own memberships before any regular course memberships exist.

The app now also upserts the signed-in user's `profiles` row automatically on login. Apply the `profiles` insert/update policies from [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql) so first-time accounts can complete that step without manual SQL.

If instructors should create or publish cases from the app UI, make sure the insert/update policies from [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql) are applied for `cases` and `documents`. Without those policies, the app can read course data but cannot save new cases back to Supabase.

If students should add agenda nodes, annotations, and learner-side reflections from the app UI, also apply the `learner_runs` insert/update policies from [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql). Without those policies, learner activity will stay local and disappear when the remote course data reloads.

The landing page then authenticates with email/password, reads the logged-in user's active course memberships, and opens the linked instructor or student workspace automatically.

For the learner-run model, keep the instructor case canonical and store student exploration in `learner_runs`. The `agenda_nodes` field should hold the student's own added issue nodes, and `ai_generated_nodes` should hold related nodes suggested by the AI after expansion.

For board governance, use `cases.board_settings`, `cases.agenda_prompt`, and `cases.submission_deadline`. These fields drive:
- how many student nodes are allowed
- how many AI expansions are created per student node
- whether class view is enabled
- which D3 layout mode the board uses

For student notes, store node or link annotations in `learner_runs.annotations`.

If you want to persist a class-level synthesized graph instead of computing it on the fly, write snapshots into `cohort_graph_snapshots`.

The schema also includes a partial unique index so a learner account can have only one `active` membership at a time. Instructors can still belong to multiple courses, but a student account cannot be attached to multiple active courses at once.

Optional case-level text can now come from the database too. Put values into `cases.stakeholder_profiles`, `cases.matrix_insights`, `cases.sandbox_feed`, `cases.reflection_prompts`, `cases.network_meta`, and `cases.ui_copy` if you want the visible copy blocks to render from incoming data instead of the built-in fallback text.

When `gemini-config.js` is present, the app uses Gemini for:
- uploaded document to structured case conversion
- learner agenda node to related issue expansion
- stakeholder question responses

If Gemini is not configured or a request fails, the app falls back to the built-in local generation logic.
