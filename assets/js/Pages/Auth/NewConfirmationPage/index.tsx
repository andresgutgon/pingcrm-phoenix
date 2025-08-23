import { FormEvent, ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { resendConfirmation } from '@/actions/Auth/ConfirmationsController'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'

function NewConfirmationPage() {
  const { data, setData, errors, post, processing } = useForm<{
    email: string
  }>({
    email: '',
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    post(resendConfirmation().url, { preserveScroll: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label='Email'
        name='email'
        type='email'
        placeholder='Email'
        value={data.email}
        error={errors.email}
        onChange={(e) => setData('email', e.target.value)}
      />
      <Button fullWidth type='submit' loading={processing}>
        Resend confirmation
      </Button>
    </Form>
  )
}

NewConfirmationPage.layout = (children: ReactNode) => (
  <AuthLayout
    title='Confirm your account'
    card={{
      title: 'No confirmation?',
      description:
        'Please enter your email below to resend the confirmation instructions.',
      footer: AuthLayout.goSignup(),
    }}
  >
    {children}
  </AuthLayout>
)

export default NewConfirmationPage
