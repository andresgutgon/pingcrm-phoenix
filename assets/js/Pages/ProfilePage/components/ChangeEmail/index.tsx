import { FormEvent } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import { updateEmail } from '@/actions/ProfileController'
import { PageProps } from '@/types'
import Alert from '@/components/Alert'

export default function ChangeEmail() {
  const {
    auth: { user },
  } = usePage<PageProps>().props
  const form = useForm<{ email_changed: string }>({ email_changed: user.email })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(updateEmail(), {
      preserveScroll: true,
      onSuccess: () => {
        form.setData('email_changed', user.email)
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg border border-gray-200 p-2 space-y-3'
    >
      {user.email_changed ? (
        <Alert
          variant='warning'
          message={`Pending email change to ${user.email_changed}.`}
        />
      ) : null}
      <div className='grid gap-6'>
        <FieldGroup
          label='Email'
          name='email'
          error={form.errors.email_changed}
          description='Changing your email will require you to confirm the new email address. Please check your inbox for a confirmation link after submitting the form.'
        >
          <TextInput
            name='email'
            type='email'
            placeholder='Your email address'
            value={form.data.email_changed}
            error={form.errors.email_changed}
            onChange={(e) => form.setData('email_changed', e.target.value)}
          />
        </FieldGroup>
      </div>
      <LoadingButton
        type='submit'
        loading={form.processing}
        className='w-full btn-indigo'
      >
        Change email
      </LoadingButton>
    </form>
  )
}
