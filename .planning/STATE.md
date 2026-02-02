# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-02)

**Core value:** The UI should feel polished and effortless — you focus on the code, not fighting the interface.
**Current focus:** v1.2 PR Review View (Phase 12: Merge + CI Status - In Progress)

## Current Position

Phase: 12 of 14 (Merge + CI Status)
Plan: 02 of 04
Status: In progress
Last activity: 2026-02-02 - Completed 12-02-PLAN.md

Progress: [███████████░] 80% (11 of 14 phases complete, 12-01 and 12-02 done)

## Performance Metrics

**v1.0 Milestone:**
- Total plans completed: 11
- Average duration: ~3.2 min/plan
- Total execution time: ~35 min
- Git range: feat(01-02) -> style(05-01)

**v1.1 Milestone:**
- Total plans completed: 4
- Phases: 6-8
- Shipped: 2026-02-02

**v1.2 Milestone:**
- Plans completed: 14 (09-01, 09-02, 09-03, 09-04, 10-01, 10-02, 10-03, 10-04, 10-05, 11-01, 11-03, 11-04, 12-01, 12-02)
- Phases: 9-14 (6 phases)
- Phases 9-11 complete, Phase 12 in progress (2/4 plans done)
- Coverage: 23/23 requirements mapped

## Accumulated Context

### Decisions

Key decisions from v1.0/v1.1 are logged in PROJECT.md. Summary:
- Deep navy #1a1f36 as primary background
- Soft blue #4a90e2 as accent color
- Single-click checkout on PR rows
- 12-color avatar palette with deterministic hash
- Soft cyan-blue additions, salmon deletions for diffs
- TopBar reduced opacity (0.7 default, 1.0 on hover)
- +X/-Y line count format for file changes

**v1.2 architectural decisions:**
- Extend ComparisonView, don't build parallel review mode
- Reuse existing `reviewedFilesAtom` for file tracking
- Use Jotai atomFamily for per-PR state management
- Leverage gh CLI via serverAPI for GitHub operations

**Phase 9 decisions:**
- prNumber stored as string (DiffId type) to match GitHub PR number type
- Review mode uses showComparison with ComparisonType.Committed for PR's head hash
- PR file key format: `pr:{prNumber}:{headHash}:{filePath}`
- headHash in key auto-invalidates viewed status on PR updates
- pr: prefix distinguishes from regular comparison keys
- Navigation controls only shown in review mode with >1 file
- Arrow-up/arrow-down icons for prev/next file navigation
- useMemo for stable key generation in ComparisonViewFile

**Phase 10 decisions (10-01):**
- Use randomId() from shared/utils instead of crypto.randomUUID() for test compatibility
- Single-line comments only (no startLine/startSide) per research recommendation
- 7-day expiry for pending comments localStorage persistence

**Phase 10 decisions (10-02):**
- Comment click takes priority over file open when onCommentClick is provided
- Keyboard shortcuts: Cmd/Ctrl+Enter to submit, Escape to cancel
- Plus icon appears on hover for commentable lines (visual affordance)

**Phase 10 decisions (10-03):**
- Thread matching by path:line key (threadId not directly on review comments)
- Immediate submission for replies (not batched like new comments)
- Separate fetchThreadInfo query to get thread IDs from reviewThreads

**Phase 10 decisions (10-04):**
- Resolved threads start collapsed by default (focus on outstanding issues)
- Optimistic UI with local resolution state for immediate feedback
- Auto-collapse 500ms after resolution for smooth transition
- Grey border for resolved threads (colors.grey token)

**Phase 10 decisions (10-05):**
- Pending comments displayed at file level (simpler than inline in diff rows)
- Review mode toolbar shows badge, PR comment button, and info text
- onFileCommentClick callback in Context for file-level comments

**Phase 11 decisions (11-01):**
- nodeId positioned immediately after number field for logical grouping
- Inline documentation that nodeId is required for mutation APIs

**Phase 11 decisions (11-03):**
- Button component only supports 'primary' and 'icon' kinds, no 'destructive' option
- TextArea uses e.currentTarget.value instead of e.target.value for TypeScript compatibility

**Phase 11 decisions (11-04):**
- useSubmitReview in .tsx file (contains inline JSX for modal)
- Import from module (reviewSubmission) not direct file path
- nodeId from allDiffSummaries using reviewMode.prNumber lookup
- Pending badge with inverted button colors for high contrast

**Phase 12 decisions (12-01):**
- Use any type for extractCIChecks parameter due to complex generated GraphQL types
- Extract both CheckRun (GitHub Checks API) and StatusContext (legacy status API)
- Map legacy StatusContext state to CheckRun conclusion for unified format
- Optional fields with undefined fallback for new PR data fields

**Phase 12 decisions (12-02):**
- Handle land-cancelled status in addition to core pass/fail/running/warning states
- reviewMode/ directory for UI components, reviewMode.ts for state (separated concerns)
- Expandable details on click rather than always visible (reduces clutter)

### Pending Todos

Continue Phase 12 with 12-03 (CI Status Display), 12-04 (Integration).

### Blockers/Concerns

None - CIStatusBadge component ready for integration in merge controls.

## Session Continuity

Last session: 2026-02-02
Stopped at: Completed 12-02-PLAN.md
Resume file: None - Continue with Phase 12-03 (CI Status Display)
