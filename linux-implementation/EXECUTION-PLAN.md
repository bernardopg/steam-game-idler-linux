# Execution Plan

This is the operational order for finishing Linux support and polishing the multi-platform behavior. The list is organized as commit-sized batches so the work can move in small, reviewable steps.

## Commit Batch 1 - UI Capability Gating

### Scope

- Hide or disable unsupported controls.
- Replace generic error popups with capability-aware messages.
- Make browser-only mode coherent.
- Remove any remaining UI assumptions that every desktop runtime has the same native capabilities.

### Files to Expect

- `src/shared/components/**`
- `src/shared/hooks/**`
- `src/features/**` where UI visibility depends on native support

### Checkpoint

- Browser-only startup still works.
- Unsupported UI actions are visibly disabled or hidden.
- No new mount-time crashes appear in the frontend.

## Commit Batch 2 - Remaining Native Entry Points

### Scope

- Audit any remaining direct Tauri usage.
- Check hotkeys, menu actions, and window controls for assumptions.
- Confirm no mount-time code still depends on native APIs without guards.
- Tighten any fallback paths that still rely on incidental behavior.

### Files to Expect

- `src/shared/utils/**`
- `src/shared/hooks/**`
- `src/shared/components/**`

### Checkpoint

- Direct `invoke` / event usage is only present where the capability layer permits it.
- Native entry points fail with explicit, understandable messages on unsupported platforms.
- `cargo check` still passes for `src-tauri`.

## Commit Batch 3 - Windows-Only Behaviors and Copy

### Scope

- Decide which Windows-only features should stay stubbed.
- Decide which features should be reimplemented later.
- Update user-facing copy where necessary.
- Add short explanations for unsupported actions.

### Files to Expect

- `linux-implementation/**`
- user-facing text in `src/shared/components/**` and related copy locations
- docs if a limitation needs to be surfaced to users

### Checkpoint

- Windows-only features are clearly identified in the UI or docs.
- Unsupported flows no longer feel like silent failures.
- The project has one clear answer for each feature: hidden, disabled, stubbed, or cross-platform.

## Commit Batch 4 - Real Platform Validation

### Scope

- Linux desktop smoke test.
- Windows desktop smoke test.
- Browser / reduced-runtime smoke test.
- Confirm startup, settings, navigation, login, update checks, and games list loading.

### Files to Expect

- validation notes in `linux-implementation/**`
- any minimal test scaffolding needed to reproduce platform issues

### Checkpoint

- Linux builds compile successfully.
- Windows still behaves as expected.
- Browser-only mode stays stable across reloads.
- Unsupported actions fail gracefully instead of throwing runtime errors.

## Commit Batch 5 - Follow-Up Notes and Cleanup

### Scope

- Document any stubborn limitations.
- Record any commands or modules that still need platform-specific work.
- Keep the Linux effort incremental and easy to resume.
- Add a short summary of what remains intentionally Windows-only.

### Files to Expect

- `linux-implementation/**`
- top-level docs only if user-facing limitations need a broader mention

### Checkpoint

- The next person can resume the work without rediscovering the same decisions.
- Remaining platform gaps are explicitly documented.

## Decision Gates

### Gate 1 - Before Batch 2

- Batch 1 must prove the frontend can survive without the native bridge.

### Gate 2 - Before Batch 3

- Batch 2 must prove the backend still compiles and the public command surface stayed stable.

### Gate 3 - Before Batch 4

- Batch 3 must leave the app in a state where unsupported features are clearly communicated.

### Gate 4 - Before Finishing

- Batch 4 must confirm the app behaves predictably on the intended platforms.

## Working Rule

Keep public command names stable whenever possible, prefer explicit platform errors over silent failure, and keep each batch small enough to validate before moving on.