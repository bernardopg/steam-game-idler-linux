# Linux / Multi-Platform TODO

This file tracks what has already been completed and what remains for each phase of the Linux / multi-platform effort.

## Current Status

- Phase 1: Frontend guards for missing Tauri APIs - done
- Phase 2: Backend portability and Windows-only isolation - done for the core blockers
- Phase 3: Central capability map - done
- Phase 4: Feature parity and platform-specific UI cleanup - pending
- Phase 5: Validation, smoke tests, and regression checks - pending

## Phase 1 - Frontend Guards

### Done

- Added a safe Tauri wrapper layer in `src/shared/utils/tauri.ts`.
- Added safe helpers for `invoke`, `emit`, `listen`, and `getVersion`.
- Hardened startup hooks and UI entry points so the app no longer crashes immediately when the Tauri bridge is missing.
- Converted the most important native call sites to use safe helpers.
- Added browser fallbacks for some native-only behaviors.
- Validated the touched frontend files after the refactor.

### Still Missing

- Review any remaining direct `@tauri-apps/api` imports that might still run on mount or in edge cases.
- Decide which features should be hidden completely in browser-only mode instead of simply no-oping.
- Improve the UX for unsupported actions so users understand why an action is disabled.

## Phase 2 - Backend Portability

### Done

- Isolated the Windows-only Rust modules behind `cfg(windows)`.
- Added non-Windows stubs for:
  - achievement management
  - idling / farming
  - process management
- Removed Windows-only `CommandExt` usage from shared code paths where possible.
- Added explicit non-Windows error responses for Windows-only native actions.
- Kept the public command names stable so the frontend invoke surface does not break.
- Confirmed the `src-tauri` crate builds with `cargo check`.

### Still Missing

- Audit whether any remaining Rust commands should be split into separate platform modules.
- Verify the Windows-only stubs return messages that are consistent with the frontend UX.
- Check whether any future macOS/Linux implementation should replace a stub with a real native implementation.
- Add documentation for platform-specific limitations in the user-facing docs if needed.

## Phase 3 - Capability Map

### Done

- Added `src/shared/utils/capabilities.ts`.
- Centralized runtime capability checks instead of scattering raw `hasTauriInvoke` checks everywhere.
- Exposed capability helpers through `src/shared/utils/index.ts`.
- Migrated update-related and bridge-related flows to use the new capability layer.
- Updated update checks, titlebar actions, context menu, sign-in, games list loading, and native-window flows to use the capability API.

### Still Missing

- Expand the capability map if new platform-dependent features appear.
- Consider storing capability results in a small state store if repeated checks become noisy.
- Use capabilities to drive actual UI disable/hidden states, not only control-flow guards.

## Phase 4 - Feature Parity and UI Cleanup

### Pending Work

- Hide or disable Windows-only UI actions when the current platform cannot support them.
- Review each native feature and decide whether it should be:
  - hidden
  - disabled
  - stubbed
  - reimplemented cross-platform
- Decide the long-term strategy for features that currently depend on SteamUtility or Win32 APIs.
- Port the features that are realistic on Linux/macOS.
- Remove assumptions in the UI that imply every desktop runtime has the same native capabilities.

### Suggested Order

1. Gate visible UI controls with capability checks.
2. Replace generic error popups with platform-specific explanations.
3. Rework flows that only need browser/network behavior.
4. Revisit Windows-only features one by one and decide their future.

## Phase 5 - Validation and Regression Checks

### Pending Work

- Run and verify the app on Linux desktop.
- Run and verify the app on Windows desktop.
- Verify the browser / reduced-runtime shell still loads without crashing.
- Test startup, settings, navigation, login, update checks, and games list loading.
- Confirm unsupported actions fail gracefully instead of throwing runtime errors.
- Add regression checks for the areas that were previously crashing.

### Suggested Test Matrix

- Linux desktop: startup, sign-in, games list, settings, update guard rails.
- Windows desktop: current full feature set.
- Browser-only: no crash on mount, safe fallbacks, no broken native calls.

## Remaining High-Priority Tasks

- Finish hiding or disabling unsupported UI controls.
- Review any remaining direct Tauri usage that still relies on runtime assumptions.
- Decide whether any phase 4 work should be scheduled before broader Linux testing.
- Add a short user-facing note explaining that some features are intentionally Windows-only for now.

## Working Notes

- Keep public command names stable whenever possible.
- Prefer explicit platform errors over silent failures for unsupported native actions.
- Prefer capability checks over repeated ad hoc runtime heuristics.
- Keep Linux support incremental: compile first, then polish behavior, then expand parity.
