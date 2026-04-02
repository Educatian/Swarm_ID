# Swarm ID App Functions

## 1. Product framing

`Swarm ID` is not a generic AI discussion app.
Its purpose is to help students see instructional technology design as a system of competing constraints, stakeholder tensions, and redesign choices.

The benchmark inspiration from MiroFish is the swarm logic itself, but the educational adaptation is different:

- MiroFish asks many agents to surface likely outcomes or consensus.
- Swarm ID asks many perspective-agents to surface hidden tensions, trade-offs, and consequences.
- The goal is not "the right answer."
- The goal is faster lens-shifting, better justification, and deeper redesign.

## 2. Core user jobs

### Student jobs

- Turn a vague instructional design idea into a structured design case.
- See which stakeholder conflicts matter most right now.
- Compare how different agents react to the same idea.
- Collect evidence for redesign, not just feedback snippets.
- Revise the design and explain why specific changes were made.

### Instructor jobs

- Create assignments and provide design prompts.
- Control which perspectives or tensions students must examine.
- Review student reasoning quality, not just final artifacts.
- Compare how teams evolved their designs over time.
- Give feedback on missed perspectives, weak evidence, and shallow trade-off analysis.

### Program or admin jobs

- Reuse templates across courses.
- Track common blind spots across a class.
- Export artifacts for grading, accreditation, or showcase.

## 3. Primary roles

| Role | What they do |
| --- | --- |
| Student | Creates design cases, runs swarms, interprets conflicts, revises proposals |
| Instructor | Creates assignments, configures required lenses, monitors progress, assesses reasoning |
| Teaching assistant | Reviews submissions, annotates conflicts, flags weak assumptions |
| Administrator | Manages org settings, templates, privacy, analytics |
| AI perspective-agent | Simulates a stakeholder, constraint, or theory-based lens |
| AI synthesis-agent | Summarizes patterns, clusters tensions, suggests redesign directions |

## 4. Core domain objects

| Object | Description |
| --- | --- |
| Workspace | Course-level container |
| Assignment | Instructor-defined design challenge |
| Design Case | Student team's proposal and evolving artifact |
| Brief | The original instructional technology idea or scenario |
| Perspective Agent | A stakeholder or analytical lens |
| Swarm Run | One simulation round over a design case |
| Tension | A conflict, trade-off, or risk surfaced by the swarm |
| Evidence Note | A cited rationale, example, or observation |
| Redesign Iteration | A versioned revision of the design case |
| Reflection | Student explanation of why they changed or defended choices |
| Rubric | Instructor criteria for judging the work |

## 5. Functional modules

## 5.1 Authentication and workspace management

- Create account
- Sign in
- Join course workspace
- Invite students or assistants
- Manage roles and permissions
- Switch between courses
- Archive workspace

## 5.2 Assignment and prompt setup

- Create assignment prompt
- Attach learning objectives
- Define available constraints
- Define required stakeholder lenses
- Set submission deadlines
- Choose individual or team mode
- Attach rubric
- Duplicate assignment template

## 5.3 Design case authoring

- Create design case
- Write problem statement
- Add target learners
- Add context and constraints
- Add technology choice
- Add activity flow
- Add feedback plan
- Add assessment plan
- Add accessibility notes
- Add ethics and privacy notes
- Save draft

## 5.4 Input structuring and parsing

- Upload text brief
- Paste idea description
- Extract entities from brief
- Detect missing fields
- Normalize design inputs
- Generate structured summary
- Highlight ambiguous claims

## 5.5 Perspective-agent library

- Browse available agents
- Search agents by role
- Enable or disable agents
- Pin required agents
- Create custom agent persona
- Create theory-based lens
- Save agent sets as presets

## 5.6 Swarm orchestration

- Launch swarm run
- Set run objective
- Choose number of agents
- Select interaction mode
- Select conflict depth
- Set response length
- Run asynchronous multi-agent simulation
- Re-run with revised conditions

## 5.7 Stakeholder reaction generation

- Generate student reaction
- Generate teacher reaction
- Generate administrator reaction
- Generate accessibility advocate reaction
- Generate instructional designer reaction
- Generate ethics reviewer reaction
- Generate parent or community reaction
- Generate skeptical critic reaction

## 5.8 Tension detection and surfacing

- Detect conflicts across agents
- Cluster similar concerns
- Rank tensions by severity
- Rank tensions by recurrence
- Identify high-uncertainty areas
- Identify hidden assumptions
- Highlight direct contradictions
- Generate trade-off statements

## 5.9 Visualization and cognition support

- Show agent map
- Show tension graph
- Show agreement vs disagreement clusters
- Show stakeholder heatmap
- Show design trade-off matrix
- Show iteration timeline
- Show evidence board
- Show "what changed" comparison

## 5.10 Evidence and rationale building

- Save agent response as evidence
- Add manual note
- Tag evidence by category
- Link evidence to tension
- Link evidence to redesign decision
- Mark evidence confidence
- Mark unresolved questions
- Build rationale chain

## 5.11 Redesign workflow

- Convert tension into action item
- Propose redesign options
- Compare redesign alternatives
- Accept or reject recommendation
- Create next iteration
- Annotate what changed
- Explain why change was made
- Preserve version history

## 5.12 Peer and instructor review

- Share design case with peers
- Add inline comments
- Request feedback on a specific lens
- Instructor pinpoints overlooked tension
- Instructor rates reasoning quality
- Instructor approves revision checkpoint

## 5.13 Assessment and analytics

- Score against rubric
- Track number of iterations
- Track diversity of perspectives consulted
- Track unresolved high-risk tensions
- Track evidence quality
- Generate student reflection summary
- Generate instructor dashboard
- Compare team patterns across class

## 5.14 Accessibility, ethics, and governance

- Run accessibility lens check
- Run privacy and ethics lens check
- Flag equity concerns
- Flag workload burden concerns
- Flag automation-overreach concerns
- Log AI-generated content provenance
- Support human override

## 5.15 Export and showcase

- Export report as PDF
- Export design history
- Export tension summary
- Export presentation-ready summary
- Export grading packet
- Publish showcase case study

## 6. High-priority MVP functions

The first build should avoid trying to simulate "everything."
The MVP should prove that swarm-based lens shifting improves instructional design reasoning.

### MVP student flow

1. Student creates a design case from a prompt.
2. Student enters core fields for goal, learners, activity, feedback, constraints, accessibility, and ethics.
3. Student launches a swarm using a fixed starter set of agents.
4. System generates reactions and clusters tensions.
5. System highlights the top 3 to 5 conflicts.
6. Student saves evidence and creates a redesign iteration.
7. Student writes a reflection explaining what changed and why.

### MVP instructor flow

1. Instructor creates assignment.
2. Instructor selects required perspectives.
3. Instructor reviews swarm results and redesign history.
4. Instructor evaluates reasoning with rubric support.

### MVP must-have features

- Authentication
- Workspace and assignment creation
- Structured design case editor
- Fixed perspective-agent library
- Swarm run execution
- Tension clustering
- Evidence board
- Redesign iteration history
- Instructor review dashboard
- Exportable summary

## 7. Suggested function inventory for engineering

## 7.1 Frontend application functions

| Function ID | Purpose |
| --- | --- |
| `createWorkspaceView()` | Workspace landing page |
| `createAssignmentBuilder()` | Instructor assignment setup UI |
| `createDesignCaseEditor()` | Student structured input form |
| `createAgentLibraryPanel()` | Agent selection UI |
| `createSwarmRunPanel()` | Swarm launch and run status UI |
| `createTensionBoard()` | Clustered conflict visualization |
| `createEvidenceBoard()` | Evidence note collection UI |
| `createIterationTimeline()` | Versioned redesign timeline |
| `createReviewPanel()` | Peer and instructor comments UI |
| `createAnalyticsDashboard()` | Course and case analytics UI |

## 7.2 Backend service functions

| Function ID | Purpose |
| --- | --- |
| `createWorkspace()` | Create course workspace |
| `createAssignment()` | Create assignment and rubric shell |
| `createDesignCase()` | Start a student case |
| `updateDesignCase()` | Save structured design data |
| `parseDesignBrief()` | Turn free text into normalized fields |
| `createPerspectiveSet()` | Attach selected agents to a case |
| `launchSwarmRun()` | Start a multi-agent analysis run |
| `generateAgentResponse()` | Produce one agent's reaction |
| `clusterTensions()` | Group similar risks or conflicts |
| `rankTensions()` | Sort tensions by importance |
| `saveEvidenceNote()` | Save evidence linked to a case or tension |
| `createRedesignIteration()` | Version the next revision |
| `compareIterations()` | Show what changed between versions |
| `scoreReasoningQuality()` | Support rubric-based evaluation |
| `generateCaseSummary()` | Produce exportable summary |

## 7.3 Swarm intelligence engine functions

| Function ID | Purpose |
| --- | --- |
| `buildAgentPrompt()` | Construct role-specific context |
| `buildConstraintContext()` | Inject goals, constraints, and rubric criteria |
| `runParallelAgentRound()` | Execute multiple perspective calls |
| `detectCrossAgentConflict()` | Compare contradictions across responses |
| `extractTensionCandidates()` | Pull trade-off statements from text |
| `mergeDuplicateTensions()` | Deduplicate conflict clusters |
| `scoreTensionImportance()` | Estimate urgency and impact |
| `generateRedesignOptions()` | Suggest revision directions |
| `generateReflectionPrompts()` | Help student explain reasoning |
| `traceDecisionCoverage()` | Check which stakeholders were addressed |

## 7.4 Data and admin functions

| Function ID | Purpose |
| --- | --- |
| `listWorkspacesForUser()` | Show course memberships |
| `listAssignmentsForWorkspace()` | Show active assignments |
| `listCasesForAssignment()` | Show student submissions |
| `listSwarmRunsForCase()` | Show run history |
| `setRolePermissions()` | Control role access |
| `archiveAssignment()` | Close a project safely |
| `exportCasePacket()` | Download grading or showcase bundle |
| `auditAIUsage()` | Trace generation provenance |

## 8. Suggested release roadmap

### Phase 1: Prove the learning value

- Structured design case input
- Fixed set of 6 to 8 perspective-agents
- Tension clustering
- Redesign iteration
- Instructor review

### Phase 2: Deepen the swarm

- Custom agent authoring
- Multiple swarm modes
- Advanced tension ranking
- Peer review integration
- Better analytics

### Phase 3: Institutional platform

- Template marketplace
- Cross-course analytics
- LMS integration
- Portfolio and showcase system
- Research export for learning science studies

## 9. Key design principle

The app should never behave like a shortcut machine that replaces student judgment.

Every major function should reinforce one of these outcomes:

- Make hidden conflict visible.
- Make trade-offs discussable.
- Make redesign traceable.
- Make reasoning assessable.

