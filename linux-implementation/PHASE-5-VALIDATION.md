# Phase 5 - Validation and Regression Checks

## Pending Work

- Run and verify the app on Linux desktop.
- Run and verify the app on Windows desktop.
- Verify the browser / reduced-runtime shell still loads without crashing.
- Test startup, settings, navigation, login, update checks, and games list loading.
- Confirm unsupported actions fail gracefully instead of throwing runtime errors.
- Add regression checks for the areas that were previously crashing.

## Suggested Test Matrix

- Linux desktop: startup, sign-in, games list, settings, update guard rails.
- Windows desktop: current full feature set.
- Browser-only: no crash on mount, safe fallbacks, no broken native calls.

## Validation Notes

- Re-run targeted checks after any phase 4 UI gating change.
- Re-run `cargo check` after any Rust-side platform split adjustment.
- Keep a note of any unsupported features that still need a user-facing explanation.

## Definition of Done

- The app no longer crashes when Tauri APIs are unavailable.
- Linux builds compile successfully.
- Unsupported actions are handled with graceful fallbacks.
- Windows-only code is isolated enough that future platform work is straightforward.