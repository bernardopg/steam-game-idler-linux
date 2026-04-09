import type { InvokeSettings } from '@/shared/types'
import { useEffect } from 'react'
import { useUserStore } from '@/shared/stores'
import { canUseNativeBridge, invokeSafe } from '@/shared/utils'

export function useInitSettings() {
  const userSummary = useUserStore(state => state.userSummary)
  const setUserSettings = useUserStore(state => state.setUserSettings)

  useEffect(() => {
    const getAndSetUserSettings = async () => {
      if (userSummary && canUseNativeBridge()) {
        const response = await invokeSafe<InvokeSettings>('get_user_settings', {
          steamId: userSummary.steamId,
        })

        if (response) {
          setUserSettings(response.settings)
        }
      }
    }
    getAndSetUserSettings()
  }, [userSummary, setUserSettings])
}
