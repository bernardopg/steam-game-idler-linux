# Phase 2 - Backend Portability

## What Was Done

- Isolated the Windows-only Rust modules behind `cfg(windows)`.
- Added non-Windows stubs for:
  - achievement management
  - idling / farming
  - process management
- Removed Windows-only `CommandExt` usage from shared code paths where possible.
- Added explicit non-Windows error responses for Windows-only native actions.
- Kept the public command names stable so the frontend invoke surface does not break.
- Confirmed the `src-tauri` crate builds with `cargo check`.

## What Is Still Missing

- Audit whether any remaining Rust commands should be split into separate platform modules.
- Verify the Windows-only stubs return messages that are consistent with the frontend UX.
- Check whether any future macOS/Linux implementation should replace a stub with a real native implementation.
- Add documentation for platform-specific limitations in the user-facing docs if needed.

## Notes

This phase made the Rust backend compile-friendly on Linux while preserving the command surface expected by the frontend.