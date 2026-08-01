# AI-Assisted Feedback Instrumentation — Event Dictionary & Mining Kit

All events live in `public.analytics_events` (append-only; students can only read
their own rows — cross-student mining requires the instructor admin account or
service_role). Order within a session by `(payload->>'session_id'),
(payload->>'seq')::int`; across sessions by `created_at`.

Always exclude test noise:

```sql
where event_type <> '__smoke_test__'
  and (payload->>'__transient_test') is distinct from 'true'
```

## Event dictionary

### `feedback.requested` — student asks the swarm to critique a reflection draft
| payload key | meaning |
|---|---|
| `prompt_index` | which reflection prompt |
| `draft` | draft snapshot at request time (first 1000 chars) |
| `draft_length` | full character count |
| `anchors_cited` | how many map-node labels the draft quotes |
| `anchor_labels` | up to 10 matched node labels |

### `feedback.shown` — the five critiques were displayed
| payload key | meaning |
|---|---|
| `prompt_index` | which prompt |
| `anchors_cited` | anchor count at exposure |
| `responses[]` | `{stakeholder, source: "ai"\|"fallback", text(400)}` per lens |

### `reflection.submit` — final answer (extended fields)
| payload key | meaning |
|---|---|
| `answer` | submitted text (2000 chars) |
| `had_feedback` | did a critique round precede this submit |
| `revised_after_feedback` | submitted text differs from the draft snapshot |
| `draft_at_feedback` | draft at critique time (1000 chars) — edit-distance base |
| `feedback_age_ms` | ms between critique and submit |
| `anchors_at_feedback` / `anchors_at_submit` | evidence anchors before/after |

### `jol.predict` / `jol.outcome` — calibration hook
| payload key | meaning |
|---|---|
| `prediction` | `split` \| `agree` \| `skip` |
| `disagreements` | classified disagree edges in that round (`null` = unclassified) |
| `correct` | prediction matched outcome (`null` = skip/unclassified) |

Related context events: `question.ask` (student question text),
`question.answer` (full AI turn: question + 5 agent outputs verbatim +
`duration_ms` round latency), `node.add`, `annotation.add`, `lens.change`.

> `lens.change` counts every stakeholder switch, including the ones where the
> lens merely followed a map click. Prefer `perspective_switched` filtered to
> `payload->>'source' = 'pill'` when the question is about deliberate
> perspective taking. See docs/analytics_ecd_schema.md §2.7.

### Spatial / social / temporal telemetry (added 2026-06-11)

| event | payload | enables |
|---|---|---|
| `node.select` | node_id, label, kind, stakeholder, issue_type, origin, via(map\|list) | reading paths, per-issue attention, student×issue ENA |
| `layer.change` | from, to (base\|personal\|cohort\|compare) | social-comparison view usage |
| `peer.exposure` | peer_run_id, peer_name, peer_agenda_count, event, presence_count, signal, visibility | social influence treatment variable — **notification received, not read**; fires with the tab hidden, so filter `payload->>'visibility' = 'visible'` |
| `visibility.change` | visibility (visible\|hidden), view | separates tab-hidden gaps from visible idle |
| `session.heartbeat` | view, map_layer, stakeholder (60s, visible-only) | bounded dwell / time-on-task |
| `drawer.open` | drawer (intake\|insight) | help-seeking / panel usage |

Time-on-task recipe: within a `session_id`, sum gaps between consecutive
events capped at 90s, excluding spans between `visibility.change:hidden` and
the next `visible`. Heartbeats guarantee a visible-but-idle student still
emits a bounded signal.

## Mining queries

### 1. Feedback → revision chain (per student, per prompt)

```sql
select user_id,
       payload->>'prompt_index'                       as prompt,
       (payload->>'had_feedback')::boolean            as had_feedback,
       (payload->>'revised_after_feedback')::boolean  as revised,
       (payload->>'anchors_at_feedback')::int         as anchors_before,
       (payload->>'anchors_at_submit')::int           as anchors_after,
       (payload->>'feedback_age_ms')::bigint / 1000   as secs_to_submit,
       payload->>'draft_at_feedback'                  as draft_before,
       payload->>'answer'                             as answer_after
from analytics_events
where event_type = 'reflection.submit'
  and event_type <> '__smoke_test__'
  and (payload->>'__transient_test') is distinct from 'true'
order by user_id, created_at;
```

`anchors_after - anchors_before > 0` = the evidence-anchor nudge worked.
True edit-distance: export `draft_before`/`answer_after` and run offline:

```python
import difflib
similarity = difflib.SequenceMatcher(None, draft_before, answer_after).ratio()
revision_magnitude = 1 - similarity   # 0 = unchanged, 1 = fully rewritten
```

### 2. Which lens's challenge precedes revision (polyvocal attribution)

```sql
select e.user_id, r.value->>'stakeholder' as lens, r.value->>'source' as source,
       count(*) as exposures
from analytics_events e,
     jsonb_array_elements(e.payload->'responses') r
where e.event_type = 'feedback.shown'
group by 1, 2, 3;
```

Join to query 1 by `(user_id, prompt_index, session)` for per-lens revision rates.

### 3. JOL calibration accuracy

```sql
select user_id,
       count(*) filter (where payload->>'correct' = 'true')  as hits,
       count(*) filter (where payload->>'correct' = 'false') as misses,
       count(*) filter (where payload->>'prediction' = 'agree'
                          and (payload->>'disagreements')::int > 0) as overconfident_agree
from analytics_events
where event_type = 'jol.outcome'
group by user_id;
```

`overconfident_agree` = predicted consensus where the swarm actually split —
the fluency-trap-adjacent signal.

### 4. Did feedback exposure change downstream map behavior?

Lag-sequential style: events after `feedback.shown` within the same
`session_id`, ordered by `seq` — count `lens.change` / `node.add` /
`question.ask` in the 10 events following exposure vs the 10 before.

For the deliberate-switch version of this, swap `lens.change` for
`perspective_switched` with `payload->>'source' = 'pill'`.

```sql
with seq_events as (
  select user_id, event_type,
         payload->>'session_id' as sid, (payload->>'seq')::int as seq
  from analytics_events
)
select f.user_id, e.event_type, count(*)
from seq_events f
join seq_events e
  on e.user_id = f.user_id and e.sid = f.sid
 and e.seq between f.seq + 1 and f.seq + 10
where f.event_type = 'feedback.shown'
group by 1, 2;
```

## Known caveats

- `feedback.shown.responses[].source = "fallback"` rows are deterministic
  templates, not LLM output — analyze separately or filter.
- `jol.outcome.correct` is null when edge classification could not run
  (no Gemini key / <2 AI responses); these are unscorable, not wrong.
- Reflection drafts persist in-memory only; a page reload between feedback and
  submit breaks the chain (had_feedback=false on the eventual submit). The
  `feedback.requested` row still marks the exposure.
