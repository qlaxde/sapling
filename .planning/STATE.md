# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-02)

**Core value:** The UI should feel polished and effortless — you focus on the code, not fighting the interface.
**Current focus:** v1.2 PR Review View (Phase 10: Inline Comments + Threading)

## Current Position

Phase: 11 of 14 (Review Submission)
Plan: 01 of 04
Status: In progress
Last activity: 2026-02-02 - Completed 11-01-PLAN.md

Progress: [█████████░] 71% (10 of 14 phases complete)

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
- Plans completed: 10 (09-01, 09-02, 09-03, 09-04, 10-01, 10-02, 10-03, 10-04, 10-05, 11-01)
- Phases: 9-14 (6 phases)
- Phase 10 complete, Phase 11 in progress
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

### Pending Todos

None - Phase 11-01 complete. Continue with Phase 11-02.

### Blockers/Concerns

None - node IDs ready for review submission mutation.

## Session Continuity

Last session: 2026-02-02
Stopped at: Completed 11-01-PLAN.md
Resume file: None - Continue with Phase 11-02
