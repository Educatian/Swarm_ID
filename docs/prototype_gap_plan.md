# Design Tension Studio

## Current Prototype vs Target Product

### What the prototype already does well

- Instructors and students already enter through different flows.
- Instructors can create a case from text, keep it as draft, and publish it.
- Students can join with a course `join_code` in the local demo flow.
- Students see a published instructor case as the starting point.
- Students can add `agenda_nodes`.
- The app already generates `ai_generated_nodes` from those student nodes.
- The D3 case map already reflects instructor case structure plus learner-added nodes.
- Instructor and learner data are separated through `cases` and `learner_runs`.
- Report and reflection views already exist as downstream surfaces.

### Where the prototype is still behind the target plan

#### 1. Landing page is still a little too app-like

- The target is a very simple landing page:
  - instructor sign in
  - student join with passcode
  - short explanation
  - short guide
- The current landing is much closer than before, but it still mixes auth and demo/testing controls in one area.

#### 2. Instructor board generation is still too light

- The target instructor flow is:
  - create board
  - define agenda
  - define timing/deadline
  - define node limit
  - define AI expansion limit
  - define D3 pattern/layout
- The current prototype only supports:
  - upload text
  - create case
  - publish / unpublish
- Missing board settings:
  - agenda window / deadline
  - learner node cap
  - AI expansion cap
  - D3 layout option
  - share mode

#### 3. Student interaction is still additive, not annotative enough

- The target student flow is:
  - enter with passcode
  - inspect default tension map
  - hover nodes and links
  - add comments, annotations, and new links from their own perspective
- The prototype currently supports:
  - hover for issue details
  - add learner agenda nodes
  - auto-generated AI-related nodes
- Missing:
  - link-level annotations
  - freeform node notes
  - per-node or per-link comment threads
  - visible "my layer vs base layer"

#### 4. Cohort intelligence is not modeled yet

- This is the biggest gap.
- Right now the app has:
  - instructor base case
  - student private run
- But it does not yet have:
  - peer sharing
  - small-group layer
  - cohort graph layer
  - AI clustering of repeated student tensions

#### 5. Supabase schema supports the MVP, not the full collaboration model

- Existing schema supports:
  - institutions
  - courses
  - memberships
  - cases
  - documents
  - learner_runs
- Missing schema for the target model:
  - board settings
  - learner annotations
  - learner-created links
  - shared group layer
  - cohort snapshots
  - passcode join workflow with controlled enrollment

## Recommended Product Model

Use a 3-layer graph model.

### Layer 1. Instructor Base Map

- The official course board
- Read-only for students
- Contains:
  - core agenda
  - base stakeholders
  - base tensions
  - base evidence
  - instructor settings

### Layer 2. Learner Layer

- Private student workspace
- Student can:
  - add node
  - add note
  - add annotation
  - add possible relationship
- AI can expand student additions into related nodes

### Layer 3. Cohort Layer

- AI-composed shared view across students
- Not a raw merge of all student edits
- Instead:
  - cluster repeated tensions
  - merge similar annotations
  - calculate frequency
  - show bridge issues across the class

## Recommended Next Build Order

### Phase 1. Stabilize the board model

- Add `board_settings` to each case
- Add fields for:
  - `agenda_prompt`
  - `submission_deadline`
  - `max_learner_nodes`
  - `max_ai_expansions_per_node`
  - `layout_mode`
  - `sharing_mode`

### Phase 2. Improve student graph interaction

- Add learner annotation records:
  - node note
  - link note
  - highlight
  - agreement / disagreement marker
- Visually distinguish:
  - instructor base nodes
  - learner nodes
  - AI-added nodes

### Phase 3. Add group and cohort graph layers

- Add:
  - `group_shared_nodes`
  - `group_shared_links`
  - `cohort_graph_snapshots`
- Build three student viewing modes:
  - `Base Map`
  - `My View`
  - `Class View`

### Phase 4. Move AI from toy expansion to real orchestration

- Current AI expansion is rule-based
- Replace with structured generation:
  - suggested related tensions
  - suggested stakeholders
  - suggested links
  - suggested evidence prompts

## Concrete Schema Additions Recommended

### Add to `cases`

- `board_settings jsonb`
- `agenda_prompt text`
- `submission_deadline timestamptz`

### Add new table `learner_annotations`

- `id`
- `learner_run_id`
- `target_type` (`node`, `link`)
- `target_id`
- `annotation_type` (`note`, `question`, `claim`, `concern`)
- `body`
- `created_at`

### Add new table `cohort_graph_snapshots`

- `id`
- `case_id`
- `snapshot_type` (`group`, `cohort`)
- `nodes jsonb`
- `links jsonb`
- `summary jsonb`
- `created_at`

## Short Conclusion

The prototype is already aligned with the core idea better than it may look:

- instructor base case
- student private layer
- AI expansion from student-added node
- D3 map as the main learning surface

The major missing piece is not the individual learner experience.
It is the shared intelligence layer across students.

So the best next move is:

1. formalize instructor board settings
2. add learner annotations
3. build cohort graph snapshots instead of letting students directly co-edit one giant graph
