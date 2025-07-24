import { useEffect, useRef } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { ToastProps } from '@/components/ui/atoms/Toast/Primitives'
import { showToast } from '@/components/ui/atoms/Toast'

function getFlashVariant(
  flash?: PageProps['flash'],
): ToastProps['variant'] | null {
  if (!flash) return null
  const type = (Object.keys(flash) as Array<keyof typeof flash>).find(
    (key) => flash[key] != null,
  )
  switch (type) {
    case 'error':
      return 'destructive'
    case 'warning':
      return 'warning'
    case 'info':
      return 'default'
    case 'success':
      return 'success'
    default:
      return null
  }
}

export function FlashMessage({ durationMs }: { durationMs: number }) {
  const { flash: flashMessage } = usePage<PageProps>().props
  const lastFlashRef = useRef<PageProps['flash'] | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const message =
      flashMessage.error ||
      flashMessage.warning ||
      flashMessage.success ||
      flashMessage.info
    const variant = getFlashVariant(flashMessage)

    // Only show toast if the flash object reference has changed and we have a message
    if (
      flashMessage &&
      flashMessage !== lastFlashRef.current &&
      message &&
      variant
    ) {
      showToast({
        title: 'Notification',
        variant,
        description: message,
      })
      lastFlashRef.current = flashMessage

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        lastFlashRef.current = null
        timeoutRef.current = null
      }, durationMs)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [flashMessage, durationMs])

  return null
}
