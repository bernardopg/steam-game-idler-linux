# Multi-Platform Support Plan

## Goal

Make Steam Game Idler easier to run and maintain on multiple operating systems, starting with Linux support and then improving the separation between platform-agnostic UI code and Windows-specific native features.

## Current Situation

The project is currently built around a Tauri desktop runtime and assumes that native bridge APIs are available during startup. That works well in the desktop app, but it makes the codebase tightly coupled to the current runtime and to Windows-specific implementation details.

The main areas that need attention are:

- Frontend hooks and components that call `invoke` during mount without checking whether the Tauri bridge exists.
- Rust backend commands that are Windows-only because they depend on `cmd`, `taskkill`, `explorer`, `SteamUtility.exe`, or the `windows` crate.
- Shared logic that mixes UI state, native process control, Steam integration, and update behavior in the same runtime path.

## Recommended Approach

The best way to approach multi-platform support is to split the work into layers instead of trying to port everything at once.

### 1. Protect the frontend from missing Tauri APIs

The browser-like frontend should not assume that `@tauri-apps/api` is always available. Several hooks currently call native commands as soon as the app renders.

The first step is to introduce safe wrappers around Tauri calls and use them everywhere the UI can mount without the native bridge.

Good candidates for this phase include:

- startup hooks
- portable-mode checks
- update checks
- games list loading
- titlebar helpers
- helpdesk and notification helpers

Expected result:

- the UI can render without crashing when the native bridge is missing
- non-native parts of the app can still be tested in a plain browser or in a reduced runtime
- native-only features can fail gracefully with clear fallbacks

### 2. Separate platform-specific Rust code

The Rust side should be split so that Linux and macOS builds do not need to compile or execute Windows-only code paths.

Windows-specific items should be isolated behind `cfg(windows)` or moved into separate modules/files.

Examples of code that should be isolated:

- `taskkill` and `tasklist` calls
- `cmd /C start` usage
- `explorer /select` usage
- direct references to `SteamUtility.exe`
- `windows` crate imports and Win32 process/window APIs

Expected result:

- Linux/macOS builds can compile cleanly
- platform-specific functionality becomes easier to reason about
- unsupported features can return a structured "not available on this platform" response instead of failing at runtime

### 3. Introduce capability-based behavior

Instead of checking only whether the app is "desktop" or "web", the app should ask whether a specific capability exists.

Examples:

- native bridge available
- updater available
- tray icon available
- Steam process monitoring available
- Windows-only helper available

This keeps the UI honest about what can run on the current platform and avoids hidden assumptions.

### 4. Add graceful fallbacks

Not every feature has to work on every platform from day one.

A practical multi-platform plan should allow these behaviors:

- show a disabled state for unsupported actions
- hide Windows-only controls when they are not relevant
- use local state or cached data when native calls are unavailable
- show a clear explanation instead of failing with a stack trace

### 5. Verify with platform-specific smoke tests

Once the separation is in place, verify the app in three ways:

- Linux desktop build
- Windows desktop build
- browser/reduced-runtime smoke test for the frontend shell

## Suggested Implementation Order

### Phase 1: Frontend guards

Start by making the UI tolerant of missing Tauri APIs.

Target files are the ones that currently trigger native calls during mount or startup.

### Phase 2: Backend portability

Move Windows-only Rust logic behind conditional compilation and add platform-aware command implementations.

### Phase 3: Feature capability map

Create a small central layer that defines which features are available on the current platform.

### Phase 4: Feature parity work

Port or replace the features that can realistically work on Linux and macOS.

### Phase 5: Validation and regression checks

Run the app on each supported platform and confirm that startup, settings, and core navigation work without runtime errors.

## What Can Stay Windows-Only For Now

Some features are naturally tied to the current Windows implementation and may remain Windows-only until there is a native replacement.

Examples include:

- SteamUtility process control
- Win32 window and process inspection
- shell integrations that depend on Windows commands

That is acceptable as long as the app communicates the limitation clearly and does not crash on other platforms.

## Definition of Done For the First Milestone

The first milestone should be considered complete when:

- the app no longer crashes when Tauri APIs are unavailable
- Linux builds compile successfully
- unsupported actions are handled with graceful fallbacks
- Windows-only code is isolated enough that future platform work is straightforward

## Notes

This plan intentionally avoids rewriting the app architecture all at once. The safest approach is to reduce runtime coupling first, then expand platform coverage feature by feature.
