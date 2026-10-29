# Persona journey rounds — 2026-10-29

Harness: `node scripts/persona-journeys.mjs R<n>` (no-login preview, synthetic data). It writes screenshots, metrics and journey.json under `output/persona-rounds/R<n>/`. After each round, a fresh-context review agent role-plays the five personas from the screenshots and metrics, then sorts the issues into P0/P1/P2. These are simulated personas, not real-user testing; every finding is grounded in a screenshot or a metric.

| Persona | Environment | Journey |
| --- | --- | --- |
| p1 민지 | First-year undergraduate, 1366×768 laptop | Landing → sample → home → map → select a node → switch lens → ask a question → discussion cues → reflection |
| p2 서준 | iPad (touch), 1024×768 | Map → tap a node → drawer → list view → class layer |
| p3 지아 | Phone, 390×844 | Map → tap a node → switch lens → reflection |
| p4 장 교수 | Instructor, 1440×900 | Map → class layer → discussion cues → highlight a cue |
| p5 Alex | English, keyboard only, 1280×800 | Tab navigation → map → compare layer |

## Round results

| Round | Failed steps | JS errors | Map share of screen (worst, p1/p2/p3/p4/p5) | Main fixes |
| --- | --- | --- | --- | --- |
| R1 (baseline) | 4 | 2 | –/.32/.37/.54/.18 | — |
| R2 | 2 | 0 | –/.56/.50/.69/.48 | Fixed a crash on node click; one-row topbar; compressed task banner; map-reading guide moved into the map; viewport-fitted stage; fit-to-view; drawers kept inside the map; single-line hint for compare |
| R3 | 2 | 0 | .51/.51/.50/.64/.49 | Fixed the stale viewBox in a hidden stage; faster layout settling; camera kept on lens switch |
| R4 | 0 | 0 | .51/.51/.50/.64/.45 | Discussion cues panel; issue-text labels; counter-scaled labels with halos; default origin badge removed; phone bottom sheet; device-neutral copy; sample data corrected |
| R5 | 0 | 0 | .51/.51/.50/.64/.55 | Label declutter (keeps the more-connected node); labels drawn above satellites; lens bar shifts out of the drawer's way; one "start here" cue; balance shown first; terminology unified |
| R6 | 0 | 0 | .51/.51/.50/.64/.55 | Fixed R5 regression (compare card covered the map and intercepted list clicks; smoke gate failed) by turning it into a one-line band; phone sheet width cap removed; GOAL localized |
| R7 | 0 | 0 | .51/.51/.44/.64/.55 | Fixed R6 regressions: drawer scrolls to the selected node and the map refits into the space left; layout precomputed before first paint; phone stage sized to the viewport; case-issue and cue labels never decluttered |

| R8 | 0 | 0 | .51/.51/.44/.64/.55 | Fixed R7 issues. Map was not resized on the home → map transition (`setView` does not re-render), so the viewport fit and framing now run when the map becomes visible. No pinned hover card on touch in simple mode; lens/layer switches force-close any card. Must-keep labels (hub, case issues, own/compare, cued, top 3 by class count) are never hidden: on collision they move above their node. Cue focus uses a solid primary ring and dashed rings for related nodes |

| R9 | 0 | 0 | .51/.51/.44/.64/.55 | Fixed R8 issues. Clicking an issue node no longer changes the lens; only stakeholder nodes do, matching the legend (see analytics_ecd_schema.md for the change note). Label placement now treats other labels and node circles as obstacles and tries four positions (below → above → right → left). Fixed a race where the end-of-layout fit overrode the cue zoom. Compare badges are now coloured dots that match the band's chips. The labelOverlaps metric now counts only visible labels |

| R10 | 0 | 0 | .51/.51/.44/.64/.55 | **R9 P0 fixed:** a lens click with the drawer open was lost, because pressing anything inside the stage closed the drawer and the lens bar re-centred before the click landed. Pressing floating controls no longer closes the drawer, and the harness now checks the actual lens state after a switch. The cues pill now sits beside the open drawer instead of being hidden. Label obstacles now use the halo ring + 4px, treat label + sub-label as one box, and penalise leaving the stage. Added the labelOnNode metric. Toolbar focus rings unified |

| R11 | 0 | 0 | .51/.51/.44/.64/.55 | Fixed the R10 regression where the dock button closed an already-open drawer and the harness passed it silently. The button is now an explicit toggle (aria-pressed plus a "…닫기" label), and the harness checks the drawer's open state. Floating controls are now label obstacles. A non-essential label hides when overlap exceeds 20%. New node sets converge before the first frame with no reheat, removing ~2s of transient label overlap after a layer switch. The class layer re-frames the map after the cues panel auto-opens. The toolbar focus ring is drawn inside the button. **From R11, nodes under controls, nodes outside the map, label overlaps and labels on nodes are all 0 at every step for every persona** (except the hidden map in list view and the intentional cue zoom) |

| R12 | 0 | 0 | .51/.51/.44/.64/.55 | **Fixed R11 regression (a node hidden under the compare band):** the map was framed inside renderGraph before that render's floating UI existed, so it now re-frames whenever the compare band, cues panel, drawer or layer changes. Labels need a 4/2px gap to count as clear (catching run-ons on the same baseline); long labels are shortened before being hidden; lens switches no longer reheat the layout; phone labels hold ~11px. The tooltip shown on pointerdown now refreshes after the click (root cause of the stale "목록으로 보기"). List cards drop duplicate descriptions; the 동료 badge passes AA. Harness: compare band, cues pill and help chip added as occluders; overlap requires a 3px gap |

| R13 | 0 | 0 | .51/.51/.44/.64/.55 | **R12 label collisions on phone — root cause:** labels were counter-scaled to ~11px, but their offsets and tap areas stayed in graph units. At zoom k=0.25 each label sat 6–17px over its own node, and tap targets were 10–17px. Offsets and hit areas now scale with 1/k (tap targets 28–34px). The panel's hypothesis that collision boxes were in graph units was rejected, since the code measures screen px. On desktop, the cues panel and drawer are exclusive. Compare/peer labels are never truncated. List cards show the full title. The 동료 badge text is white (an old rule forced dark text, ~3:1) |

| R14 (final check) | 0 | 0 | .51/.51/.44/.64/.55 | After the R13 panel's verdict (**no P0/P1 remaining**), two cheap P2s were cleaned up: the drawer no longer repeats a shortened title, and the cues panel shows a scroll shadow. All gates pass |

**Final verdict (R13 panel):** no P0/P1. Remaining P2 items:
- A long compare-mode label can touch a neighbouring node.
- On tablet, one count-1 peer label is hidden by declutter.
- On iPad the drawer narrows the map.
- The badge and label start can touch.
- The "More ways to explore" focus ring has square corners.

From R8, map-stage bottom (`mapBottomPx`) is within the viewport at every step for all personas. Nodes covered by controls / outside the map are 0/0 at every step, except the list view, where the map is hidden.

The R7 phone map share dropped (.50 → .44) on purpose: before, the stage ran past the screen, so the bottom of the map was out of view.

"–" means a metric bug: the first step on the landing page was counted as the map. Fixed from R3 on.

## Root causes found and fixed

1. **JS crash on node click.** D3 nodes carry `data-graph-node` but no `data-focus`. The document click handler called `setStakeholder(undefined)`, so the active lens became `undefined` and `getCaseStakeholderMeta` crashed. Rejected hypotheses: missing `node.stakeholder` (the D3 handler has a guard), and the pill handler (the stack trace ran through the document handler).
2. **Graph drawn tiny in the top-left corner.** When the map rendered in a hidden view, `resizeGraphRenderer` set the viewBox to the 0×0 fallback (320×420), and it was never measured again once the view became visible. The fit then computed a 0.245 ratio, so the zoom scale stayed pinned at its minimum.
3. **Clicking a node failed.** Every re-render restarted the simulation at alpha 0.85, so nodes kept moving for about 5 seconds. Re-renders with the same node set now use alpha 0.12, and alphaDecay is 0.045.
4. **Map overran the screen height.** `renderMapViewportControls` ran before `renderTaskBanner`, so it measured the stage top before the banner existed.
5. **"FIT_SCREEN" shown as text.** `fit_screen` is not in the subset icon font. Replaced with `target`, which the subset contains.
6. **R5 regression: map hidden in compare mode.** The compare card floating mid-map covered nodes and intercepted clicks on list rows, so the smoke gate failed. It is now a single-row band under the lens bar, included in the fit inset and hidden in list view.
7. **R6 regression: selected node out of view.** The drawer opened at its top (the lens summary), and the phone sheet covered the map. The drawer now scrolls to the "selected node" section with a sticky close button, and the map refits into the area the drawer leaves.

8. **R7 regression: first screen ran past the viewport (only on the landing → sample → home → map route).** Hypotheses: (H1) non-simple density cleared the height, (H2) the stage was hidden and the function returned early, (H3) the call came before the view switched. The instrumented trace showed none of them: the sizing function was never called at all. `setView()` only calls `renderNavigation()`, and the last `renderAll()` ran on the home screen while the map was hidden. Opening `preview.html` directly happened to trigger a later render, which is why it did not reproduce there.

## Verification gates (after R8)

verify-all 5/5 (build freshness, usability smoke 24/24, contrast in both themes, render structure, telemetry envelope) · verify-beginner-ux 39/39 · verify-ui-motion 0 failures · verify-tutorial-content 144 · cues panel text contrast in both themes: 0 failures.
