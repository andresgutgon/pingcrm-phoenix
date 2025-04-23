import { useState, useEffect, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import Alert, { type AlertProps } from '@/components/Alert'

type Errors = ReturnType<typeof usePage>['props']['errors']
function getAlert({
  flash,
  errors,
}: {
  flash: PageProps['flash']
  errors: Errors
}): { message: string; variant: AlertProps['variant'] } | null {
  const formErrors = Object.keys(errors).length
  const errorMessage =
    formErrors > 0 ? `There are ${formErrors} form errors.'` : null
  const message = flash.info || flash.error || flash.success || flash.warning

  if (!message) return null

  return {
    message,
    variant: flash.info
      ? 'success'
      : flash.error || errorMessage
        ? 'error'
        : flash.success
          ? 'success'
          : flash.warning
            ? 'warning'
            : undefined,
  }
}

export default function FlashedMessages() {
  const [visible, setVisible] = useState(true)
  const { flash, errors } = usePage<PageProps>().props
  const alert = useMemo(() => getAlert({ flash, errors }), [flash, errors])

  useEffect(() => {
    setVisible(true)
  }, [flash, errors])

  if (!alert || !visible) return null

  return (
    <Alert
      dataTestRef='flash-message'
      variant={alert.variant}
      message={alert.message}
      onClose={() => setVisible(false)}
    />
  )
}
