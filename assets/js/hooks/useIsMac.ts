import { useEffect, useState } from 'react'

export function useIsMac() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    if ('userAgentData' in navigator) {
      // Modern API
      // brands list is more about the browser, so we use platform
      // Note: platform is only available in secure contexts (https)
      // and might be hidden depending on user privacy settings
      // e.g. "macOS"
      // @ts-expect-error platform is not fully typed everywhere yet
      setIsMac(navigator.userAgentData.platform === 'macOS')
    } else {
      // Fallback for older browsers
      setIsMac(/Mac/i.test(navigator.userAgent))
    }
  }, [])

  return isMac
}
