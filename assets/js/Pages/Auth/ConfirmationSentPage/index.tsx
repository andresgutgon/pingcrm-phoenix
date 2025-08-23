import { ReactNode } from 'react'
import AuthLayout from '@/Layouts/AuthLayout'
import { Text } from '@/components/ui/atoms/Text'

function ConfirmationSentPage({ email }: { email: string }) {
  return (
    <Text.H5 align='center'>
      We sent you a confirmation email to <strong>{email}</strong>. Please check
      your inbox and click on the confirmation link to activate your account.
    </Text.H5>
  )
}

ConfirmationSentPage.layout = (children: ReactNode) => (
  <AuthLayout
    title='Confirmation Sent'
    card={{
      variant: 'default',
      title: 'Confirmation Sent',
      description: 'Please check your email',
    }}
  >
    {children}
  </AuthLayout>
)

export default ConfirmationSentPage
