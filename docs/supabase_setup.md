# Supabase Setup

1. Put your project URL and anon key in [supabase-config.js](C:\Users\jewoo\Desktop\Swarm_ID\supabase-config.js).
2. Run the SQL in [supabase_schema.sql](C:\Users\jewoo\Desktop\Swarm_ID\docs\supabase_schema.sql) in the Supabase SQL editor.
3. Create Auth users in Supabase Auth.
4. Insert matching rows into `profiles`, `institutions`, `courses`, and `course_memberships`.
5. Put a shareable `join_code` on each course if students should be able to join by code.
6. Add `cases`, `documents`, and optional `learner_runs` for each course.

The landing page then authenticates with email/password, reads the logged-in user's active course memberships, and opens the linked instructor or student workspace automatically.

For the learner-run model, keep the instructor case canonical and store student exploration in `learner_runs`. The `agenda_nodes` field should hold the student's own added issue nodes, and `ai_generated_nodes` should hold related nodes suggested by the AI after expansion.

For board governance, use `cases.board_settings`, `cases.agenda_prompt`, and `cases.submission_deadline`. These fields drive:
- how many student nodes are allowed
- how many AI expansions are created per student node
- whether class view is enabled
- which D3 layout mode the board uses

For student notes, store node or link annotations in `learner_runs.annotations`.

If you want to persist a class-level synthesized graph instead of computing it on the fly, write snapshots into `cohort_graph_snapshots`.

Optional case-level text can now come from the database too. Put values into `cases.stakeholder_profiles`, `cases.matrix_insights`, `cases.sandbox_feed`, `cases.reflection_prompts`, `cases.network_meta`, and `cases.ui_copy` if you want the visible copy blocks to render from incoming data instead of the built-in fallback text.
