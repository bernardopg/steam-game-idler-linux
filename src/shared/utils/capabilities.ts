import { hasTauriInvoke } from './tauri'

export interface RuntimeCapabilities {
  isBrowserOnly: boolean
  hasNativeBridge: boolean
  canInvokeNativeCommands: boolean
  canEmitNativeEvents: boolean
  canUseUpdater: boolean
  canUseTray: boolean
  canUseNotifications: boolean
  canOpenExternalLinks: boolean
  canUseNativeWindowControls: boolean
}

export function getRuntimeCapabilities(): RuntimeCapabilities {
  const hasNativeBridge = hasTauriInvoke()

  return {
    isBrowserOnly: !hasNativeBridge,
    hasNativeBridge,
    canInvokeNativeCommands: hasNativeBridge,
    canEmitNativeEvents: hasNativeBridge,
    canUseUpdater: hasNativeBridge,
    canUseTray: hasNativeBridge,
    canUseNotifications: hasNativeBridge,
    canOpenExternalLinks: hasNativeBridge,
    canUseNativeWindowControls: hasNativeBridge,
  }
}

export function canUseNativeBridge() {
  return getRuntimeCapabilities().hasNativeBridge
}

export function canInvokeNativeCommands() {
  return getRuntimeCapabilities().canInvokeNativeCommands
}

export function canEmitNativeEvents() {
  return getRuntimeCapabilities().canEmitNativeEvents
}

export function canUseUpdater() {
  return getRuntimeCapabilities().canUseUpdater
}

export function canUseTray() {
  return getRuntimeCapabilities().canUseTray
}

export function canUseNotifications() {
  return getRuntimeCapabilities().canUseNotifications
}

export function canOpenExternalLinks() {
  return getRuntimeCapabilities().canOpenExternalLinks
}

export function canUseNativeWindowControls() {
  return getRuntimeCapabilities().canUseNativeWindowControls
}
