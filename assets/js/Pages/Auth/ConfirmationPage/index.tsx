import { FormEvent, ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { confirmUser } from '@/actions/Auth/ConfirmationsController'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'

function ConfirmationPage({ token }: { token: string }) {
  const form = useForm()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(confirmUser(token), { preserveScroll: true })
  }

  return (
    <form action={confirmUser(token).url} onSubmit={handleSubmit}>
      <Button fullWidth type='submit' loading={form.processing}>
        Confirm
      </Button>
    </form>
  )
}

ConfirmationPage.layout = (children: ReactNode) => (
  <AuthLayout
    showToS
    title='Confirm your account'
    card={{
      title: 'Confirm your account',
      description:
        'Please confirm your account to continue using our services.',
    }}
  >
    {children}
  </AuthLayout>
)

export default ConfirmationPage
