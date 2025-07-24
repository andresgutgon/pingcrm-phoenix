import { FormEvent, ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { update } from '@/actions/Auth/ResetPasswordController'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'

function ChangePasswordPage({ token }: { token: string }) {
  const form = useForm<{
    password: string
    password_confirmation: string
  }>({
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(update(token), { preserveScroll: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type='password'
        label='Password'
        name='password'
        error={form.errors.password}
        placeholder='Password'
        value={form.data.password}
        onChange={(e) => form.setData('password', e.target.value)}
      />
      <Input
        type='password'
        label='Confirm Password'
        name='password_confirmation'
        error={form.errors.password_confirmation}
        placeholder='Confirm Password'
        value={form.data.password_confirmation}
        onChange={(e) => form.setData('password_confirmation', e.target.value)}
      />
      <Button
        type='submit'
        loading={form.processing}
        className='w-full btn-indigo'
      >
        Reset Password
      </Button>
    </Form>
  )
}

ChangePasswordPage.layout = (children: ReactNode) => (
  <AuthLayout
    showToS
    title='Change your passowrd'
    card={{
      title: 'Change your password',
      description: 'Please enter your new password below.',
      footer: AuthLayout.goSignup(),
    }}
  >
    {children}
  </AuthLayout>
)

export default ChangePasswordPage
