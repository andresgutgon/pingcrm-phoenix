import { ChangeEventHandler, useCallback } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { setDefaultAccount } from '@/actions/ProfileController'
import { PageProps } from '@/types'

export function DefaultAccountToggle() {
  const { auth } = usePage<PageProps>().props
  const form = useForm()

  const isDefault = auth.user.default_account_id === auth.account.id

  const accountId = auth.account.id
  const onToggleDefault: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      form.submit(setDefaultAccount(accountId), {
        preserveScroll: true,
      })
    }, [form, accountId])

  if (isDefault) {
    return (
      <span className='text-xs text-green-600 font-medium'>
        Default account
      </span>
    )
  }

  return (
    <label className='flex items-center gap-2 text-sm'>
      <input
        type='checkbox'
        checked={false}
        onChange={onToggleDefault}
        className='rounded'
      />
      <span>Set as default</span>
    </label>
  )
}
