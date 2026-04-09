# Phase 3 - Capability Map

## What Was Done

- Added `src/shared/utils/capabilities.ts`.
- Centralized runtime capability checks instead of scattering raw `hasTauriInvoke` checks everywhere.
- Exposed capability helpers through `src/shared/utils/index.ts`.
- Migrated update-related and bridge-related flows to use the new capability layer.
- Updated update checks, titlebar actions, context menu, sign-in, games list loading, and native-window flows to use the capability API.

## What Is Still Missing

- Expand the capability map if new platform-dependent features appear.
- Consider storing capability results in a small state store if repeated checks become noisy.
- Use capabilities to drive actual UI disable/hidden states, not only control-flow guards.

## Notes

This phase established the single source of truth for runtime capability decisions.