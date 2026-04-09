# Phase 4 - Feature Parity and UI Cleanup Checklist

## Goal

Remove the remaining UI assumptions that every desktop runtime has the same native capabilities.

## Checklist

- [ ] Hide or disable Windows-only UI actions when the current platform cannot support them.
- [ ] Review each native feature and decide whether it should be hidden, disabled, stubbed, or reimplemented cross-platform.
- [ ] Decide the long-term strategy for features that currently depend on SteamUtility or Win32 APIs.
- [ ] Port the features that are realistic on Linux/macOS.
- [ ] Remove assumptions in the UI that imply every desktop runtime has the same native capabilities.
- [ ] Gate visible UI controls with capability checks.
- [ ] Replace generic error popups with platform-specific explanations.
- [ ] Rework flows that only need browser/network behavior.
- [ ] Revisit Windows-only features one by one and decide their future.
- [ ] Add user-facing wording for actions that remain Windows-only.
- [ ] Verify disabled controls do not still fire native handlers from keyboard or hotkey paths.
- [ ] Confirm browser-only mode still feels coherent instead of half-broken.

## Suggested Order

1. Gate visible UI controls with capability checks.
2. Replace generic error popups with platform-specific explanations.
3. Rework flows that only need browser/network behavior.
4. Revisit Windows-only features one by one and decide their future.

## Notes

This phase is about polish, clarity, and user-facing consistency rather than core runtime survival.