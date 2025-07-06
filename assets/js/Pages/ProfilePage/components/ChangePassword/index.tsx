import { FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import { updatePassword } from '@/actions/ProfileController'

const EMPTY_FORM = {
  current_password: '',
  password: '',
  password_confirmation: '',
}
export default function ChangePassword() {
  const form = useForm<{
    current_password: string
    password: string
    password_confirmation: string
  }>(EMPTY_FORM)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(updatePassword(), {
      preserveScroll: true,
      onSuccess: () => {
        form.setDefaults(EMPTY_FORM)
        form.reset()
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg border border-gray-200 p-2 space-y-3'
    >
      <h3 className='text-xl'>Password</h3>
      <div className='grid gap-6'>
        <FieldGroup
          label='Current Password'
          name='current_password'
          error={form.errors.current_password}
        >
          <TextInput
            name='current_password'
            type='password'
            placeholder='Your current password'
            value={form.data.current_password}
            error={form.errors.current_password}
            onChange={(e) => form.setData('current_password', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup
          label='Password'
          name='password'
          error={form.errors.password}
        >
          <TextInput
            name='password'
            type='password'
            placeholder='Password'
            value={form.data.password}
            error={form.errors.password}
            onChange={(e) => form.setData('password', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup
          label='Confirm Password'
          name='password_confirmation'
          error={form.errors.password_confirmation}
        >
          <TextInput
            name='password_confirmation'
            type='password'
            placeholder='Confirm Password'
            value={form.data.password_confirmation}
            error={form.errors.password_confirmation}
            onChange={(e) =>
              form.setData('password_confirmation', e.target.value)
            }
          />
        </FieldGroup>
      </div>
      <LoadingButton
        type='submit'
        loading={form.processing}
        className='w-full btn-indigo'
      >
        Change Password
      </LoadingButton>
    </form>
  )
}
