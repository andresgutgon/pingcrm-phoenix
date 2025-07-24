import { FormEvent, ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { sendResetPasswordInstructions } from '@/actions/Auth/ResetPasswordController'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'

function ResetPasswordPage({ email }: { email?: string }) {
  const form = useForm<{
    email: string
  }>({
    email: email || '',
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(sendResetPasswordInstructions(), { preserveScroll: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label='Email'
        name='email'
        type='email'
        placeholder='Email'
        value={form.data.email}
        error={form.errors.email}
        onChange={(e) => form.setData('email', e.target.value)}
      />
      <Button fullWidth type='submit' loading={form.processing}>
        Send reset password
      </Button>
    </Form>
  )
}

ResetPasswordPage.layout = (children: ReactNode) => (
  <AuthLayout
    title='Resend confirmation'
    card={{
      title: 'Forgot your password?',
      description: "We'll send a password reset link to your inbox",
      footer: AuthLayout.goLogin(),
    }}
  >
    {children}
  </AuthLayout>
)

export default ResetPasswordPage
