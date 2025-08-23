import { FormEvent, ReactNode } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { confirmEmailChange } from '@/actions/Auth/ConfirmEmailController'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'
import { Form } from '@/components/ui/atoms/Form'
import { Text } from '@/components/ui/atoms/Text'

function ConfirmEmailPage({ token }: { token: string }) {
  const {
    auth: { user },
  } = usePage<PageProps>().props
  const form = useForm()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(confirmEmailChange(token), { preserveScroll: true })
  }

  return (
    <Form action={confirmEmailChange(token).url} onSubmit={handleSubmit}>
      <Text.H5 asChild display='block'>
        <p>
          Your current email <strong>{user.email}</strong> will be changed to{' '}
          <strong>{user.email_changed}</strong>.
        </p>
      </Text.H5>
      <Button fullWidth type='submit' loading={form.processing}>
        Confirm
      </Button>
    </Form>
  )
}

ConfirmEmailPage.layout = (children: ReactNode) => (
  <AuthLayout
    showToS
    title='Confirm your email change'
    card={{
      title: 'Confirm your email change',
      description:
        'Please confirm your email change to continue using our services.',
    }}
  >
    {children}
  </AuthLayout>
)

export default ConfirmEmailPage
