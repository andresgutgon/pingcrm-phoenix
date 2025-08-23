import { ComponentProps, ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import MainLayout from '@/Layouts/MainLayout'
import Logo from '@/components/Logo'
import { Card } from '@/components/ui/atoms/Card'
import { Text } from '@/components/ui/atoms/Text'
import { signup } from '@/actions/Auth/SignupsController'
import { login } from '@/actions/Auth/SessionsController'
import { useHost } from '@/hooks/useHost'

function AuthLink({ text, href }: { text: string; href: string }) {
  return (
    <Text.H5 asChild underline>
      <Link href={href}>{text}</Link>
    </Text.H5>
  )
}

function FooterLink({ children }: { children: ReactNode }) {
  return (
    <Text.H5 fullWidth align='center' display='block'>
      {children}
    </Text.H5>
  )
}

function AuthLayout({
  title,
  card,
  showToS = false,
  children,
}: {
  title?: string
  card?: {
    title: string
    description: string
    footer?: ReactNode
    variant?: ComponentProps<typeof Card>['variant']
  }
  showToS?: boolean
  children: ReactNode
}) {
  const { buildSiteUrl } = useHost()
  return (
    <MainLayout title={title}>
      <div className='bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
        <div className='flex w-full max-w-sm flex-col gap-6'>
          <a href={buildSiteUrl()} className='flex items-center gap-2 self-center'>
            <div className='text-primary dark:text-foreground'>
              <Logo className='block fill-current w-32' />
            </div>
          </a>
          <div className='flex flex-col gap-6'>
            {card ? (
              <Card
                variant={card.variant || 'primary'}
                headerProps={{ align: 'center' }}
                title={{ content: card.title, size: 'big' }}
                description={card.description}
                footer={card.footer}
              >
                <div className='grid gap-6'>{children}</div>
              </Card>
            ) : (
              children
            )}
            {showToS ? (
              <Text.H6
                align='center'
                textWrap='balance'
                color='foregroundMuted'
              >
                By clicking continue, you agree to our{' '}
                <Text.H6
                  asChild
                  textWrap='balance'
                  color='foregroundMuted'
                  underline
                >
                  <a href='#'>Terms of Service</a>
                </Text.H6>{' '}
                and{' '}
                <Text.H6
                  asChild
                  textWrap='balance'
                  color='foregroundMuted'
                  underline
                >
                  <a href='#'>Privacy Policy</a>
                </Text.H6>
                .{' '}
              </Text.H6>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

AuthLayout.goSignup = () => (
  <FooterLink>
    Don&apos;t have an account?{' '}
    <AuthLink text='Sign up' href={signup.get().url} />
  </FooterLink>
)

AuthLayout.goLogin = () => (
  <FooterLink>
    Already have an account? <AuthLink text='Login' href={login.get().url} />
  </FooterLink>
)

export default AuthLayout
