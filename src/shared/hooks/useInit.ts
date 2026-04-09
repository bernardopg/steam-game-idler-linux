import type { UserSummary } from '@/shared/types'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderStore, useStateStore, useUserStore } from '@/shared/stores'
import { canUseNativeBridge, emitSafe, invokeSafe } from '@/shared/utils'

export function useInit() {
  const setLoadingUserSummary = useStateStore(state => state.setLoadingUserSummary)
  const setUserSummary = useUserStore(state => state.setUserSummary)
  const { hideLoader } = useLoaderStore()
  const { t, i18n } = useTranslation()

  console.debug('Monitor for rerenders')

  useEffect(() => {
    // Emit ready event to backend
    void emitSafe('ready')
    // Start the Steam status monitor once globally
    void invokeSafe('start_steam_status_monitor')
    // Start the processes monitor once globally
    void invokeSafe('start_processes_monitor')
  }, [])

  useEffect(() => {
    void invokeSafe('update_tray_menu', {
      show: t('tray.show'),
      update: t('tray.update'),
      quit: t('tray.quit'),
    })
  }, [t, i18n.language])

  useEffect(() => {
    // Set user summary data
    const userSummary = JSON.parse(localStorage.getItem('userSummary') || '{}') as UserSummary

    if (userSummary?.steamId) {
      setUserSummary(userSummary)
    }

    setTimeout(() => {
      hideLoader()
      setTimeout(() => {
        setLoadingUserSummary(false)
      }, 250)
    }, 1500)
  }, [setUserSummary, setLoadingUserSummary, hideLoader])

  useEffect(() => {
    const closeWebview = async () => {
      try {
        if (!canUseNativeBridge()) {
          return
        }

        const webview = await WebviewWindow.getByLabel('webview')
        setTimeout(async () => {
          await webview?.close()
        }, 5000)
      } catch (error) {
        console.error('Error in (closeWebview):', error)
      }
    }
    closeWebview()
  }, [])
}
