import { getCurrentWindow } from '@tauri-apps/api/window'
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'
import { useUserStore } from '@/shared/stores'
import { canUseNativeWindowControls, invokeSafe } from '@/shared/utils'

export function useTitlebar() {
  const userSettings = useUserStore(state => state.userSettings)

  const windowMinimize = async () => {
    if (!canUseNativeWindowControls()) {
      return
    }

    await getCurrentWindow().minimize()
  }

  const windowToggleMaximize = async () => {
    if (!canUseNativeWindowControls()) {
      return
    }

    await getCurrentWindow().toggleMaximize()
  }

  const windowClose = async () => {
    // If the user has not enabled "close to tray", quit the app
    if (!canUseNativeWindowControls()) {
      return
    }

    if (!userSettings.general.closeToTray) {
      await invokeSafe('quit_app')
      return
    }

    await getCurrentWindow().hide()

    const minToTrayNotified = localStorage.getItem('minToTrayNotified') || 'false'
    let permissionGranted = await isPermissionGranted()
    if (minToTrayNotified !== 'true') {
      if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
      }
      if (permissionGranted) {
        sendNotification({
          title: 'Steam Game Idler will continue to run in the background',
          icon: 'icons/32x32.png',
        })
      }
    }
    localStorage.setItem('minToTrayNotified', 'true')
  }

  return {
    windowMinimize,
    windowToggleMaximize,
    windowClose,
  }
}
