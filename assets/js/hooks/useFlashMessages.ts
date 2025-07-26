import { useEffect, useMemo, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

function getFlashVariant(flash?: PageProps['flash']) {
  if (!flash) return 'info'

  const type = (Object.keys(flash) as Array<keyof typeof flash>).find(
    (key) => flash[key] != null,
  )
  if (!type) return 'info'
  switch (type) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'success':
      return 'success'
  }
}

type FlashVariant = ReturnType<typeof getFlashVariant>

function getFlash({
  flashMessage,
  errors,
}: {
  flashMessage: PageProps['flash']
  errors: PageProps['errors']
}): { message: string; variant: FlashVariant } | null {
  const formErrors = Object.keys(errors).length
  const errorMessage =
    formErrors > 0 ? `There are ${formErrors} form errors.'` : null
  const message =
    flashMessage.info ||
    flashMessage.error ||
    flashMessage.success ||
    flashMessage.warning

  if (!message) return null

  return {
    message,
    variant: errorMessage ? 'error' : getFlashVariant(flashMessage),
  }
}

export function useFlashMessages() {
  const [visible, setVisible] = useState(true)
  const { flash: flashMessage, errors } = usePage<PageProps>().props

  const flash = useMemo(
    () => getFlash({ flashMessage, errors }),
    [flashMessage, errors],
  )
  useEffect(() => {
    setVisible(true)
  }, [flash, errors])

  if (!alert || !visible) return null

}
