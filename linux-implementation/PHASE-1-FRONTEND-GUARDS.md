# Phase 1 - Frontend Guards

## What Was Done

- Added a safe Tauri wrapper layer in `src/shared/utils/tauri.ts`.
- Added safe helpers for `invoke`, `emit`, `listen`, and `getVersion`.
- Hardened startup hooks and UI entry points so the app no longer crashes immediately when the Tauri bridge is missing.
- Converted the most important native call sites to use safe helpers.
- Added browser fallbacks for some native-only behaviors.
- Validated the touched frontend files after the refactor.

## What Is Still Missing

- Review any remaining direct `@tauri-apps/api` imports that might still run on mount or in edge cases.
- Decide which features should be hidden completely in browser-only mode instead of simply no-oping.
- Improve the UX for unsupported actions so users understand why an action is disabled.

## Notes

This phase focused on preventing the app from crashing in browser-like or reduced-runtime environments. It established the safe invocation layer that the rest of the work now builds on.