import { FormEvent } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/atoms/Button'
import { updateEmail } from '@/actions/Profile/ProfileController'
import { PageProps } from '@/types'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'
import { Toast } from '@/components/ui/atoms/Toast/Primitives'

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
    <Form onSubmit={handleSubmit}>
      {user.email_changed ? (
        <Toast
          id='email-change-pending'
          variant='warning'
          title='Email change pending'
          description={`New email will be ${user.email_changed}.`}
        />
      ) : null}
      <Input
        label='Email'
        type='email'
        name='email'
        value={form.data.email_changed}
        error={form.errors.email_changed}
        onChange={(e) => form.setData('email_changed', e.target.value)}
        description='Changing your email will require you to confirm the new email address. Please check your inbox for a confirmation link after submitting the form.'
      />
      <Button type='submit' loading={form.processing}>
        Change email
      </Button>
    </Form>
  )
}
