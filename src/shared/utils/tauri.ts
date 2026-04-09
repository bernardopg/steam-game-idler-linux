import type { UnlistenFn } from '@tauri-apps/api/event'
import { getVersion } from '@tauri-apps/api/app'
import { invoke } from '@tauri-apps/api/core'
import { emit, listen } from '@tauri-apps/api/event'

interface TauriGlobals {
  __TAURI_INTERNALS__?: {
    invoke?: unknown
  }
  __TAURI__?: {
    invoke?: unknown
  }
}

function getGlobalTauriState() {
  return globalThis as typeof globalThis & TauriGlobals
}

export function hasTauriInvoke() {
  const tauriGlobals = getGlobalTauriState()

  return (
    typeof tauriGlobals.__TAURI_INTERNALS__?.invoke === 'function' ||
    typeof tauriGlobals.__TAURI__?.invoke === 'function'
  )
}

export function isMissingTauriInvokeError(error: unknown) {
  const message = String(error)

  return (
    message.includes("reading 'invoke'") ||
    message.includes('transformCallback') ||
    message.includes('Cannot read properties of undefined')
  )
}

export async function invokeSafe<T>(command: string, args?: Record<string, unknown>, fallback?: T) {
  if (!hasTauriInvoke()) {
    return fallback
  }

  try {
    return await invoke<T>(command, args as never)
  } catch (error) {
    if (isMissingTauriInvokeError(error)) {
      return fallback
    }

    throw error
  }
}

export async function getVersionSafe() {
  if (!hasTauriInvoke()) {
    return undefined
  }

  try {
    return await getVersion()
  } catch (error) {
    if (isMissingTauriInvokeError(error)) {
      return undefined
    }

    throw error
  }
}

export async function emitSafe(event: string, payload?: unknown) {
  if (!hasTauriInvoke()) {
    return
  }

  try {
    await emit(event, payload)
  } catch (error) {
    if (!isMissingTauriInvokeError(error)) {
      throw error
    }
  }
}

export async function listenSafe<T>(event: string, handler: Parameters<typeof listen<T>>[1]) {
  if (!hasTauriInvoke()) {
    return null
  }

  try {
    return await listen<T>(event, handler)
  } catch (error) {
    if (isMissingTauriInvokeError(error)) {
      return null
    }

    throw error
  }
}

export type { UnlistenFn }
