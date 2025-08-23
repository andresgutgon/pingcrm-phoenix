import { type FormEvent, ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'

import { login } from '@/actions/Auth/SessionsController'
import { forgotPassword } from '@/actions/Auth/ResetPasswordController'
import { Button } from '@/components/ui/atoms/Button'
import AuthLayout from '@/Layouts/AuthLayout'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'
import { Checkbox } from '@/components/ui/atoms/Checkbox'
import { FormSeparator } from '@/components/ui/atoms/FormSeparator'
import { Tabs } from '@/components/ui/atoms/Tabs'

const TABS = {
  password: 'password',
  magicLink: 'magicLink',
}
const EMAIL_OPTIONS = [
  {
    label: 'Password',
    value: TABS.password,
  },
  {
    label: 'Magic Link',
    value: TABS.magicLink,
  },
]
type TabValue = (typeof TABS)[keyof typeof TABS]

function LoginWithPassword() {
  const { data, setData, errors, post, processing } = useForm<{
    email: string
    password: string
    remember_me: boolean
  }>({
    email: 'johndoe@example.com',
    password: 'secret',
    remember_me: true,
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    post(login().url)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        autoFocus
        label='Email'
        name='email'
        placeholder='Insert your email here'
        type='email'
        error={errors.email}
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
      />
      <div className='grid gap-y-2'>
        <Link
          href={forgotPassword.get({ query: { email: data.email } }).url}
          className='ml-auto text-sm underline-offset-4 hover:underline'
        >
          Forgot your password?
        </Link>
        <Input
          autoComplete='off'
          label='Password'
          name='password'
          type='password'
          placeholder='Insert your password here'
          error={errors.password}
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
        />
      </div>

      <Checkbox
        label='Remember Me'
        name='remember_me'
        description='Keep me logged in on this browser'
        compactDescription
        checked={data.remember_me}
        onCheckedChange={(checked) => setData('remember_me', checked === true)}
      />
      <Button fullWidth type='submit' loading={processing}>
        Login
      </Button>
    </Form>
  )
}

function LoginPage() {
  return (
    <>
      <Button
        variant='outline'
        iconProps={{ name: 'google', color: 'foregroundMuted' }}
      >
        Login with Google
      </Button>
      <FormSeparator label='Or continue with' background='card' />
      <Tabs<TabValue> fullWidth options={EMAIL_OPTIONS} defaultValue='password'>
        <Tabs.Content value='password'>
          <LoginWithPassword />
        </Tabs.Content>
        <Tabs.Content value='magicLink'>
          <form className='grid gap-4'>
            <div className='grid gap-2'>
              <Input
                label='Email'
                type='email'
                placeholder='m@example.com'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Send Magic Link
            </Button>
          </form>
        </Tabs.Content>
      </Tabs>
    </>
  )
}

LoginPage.layout = (children: ReactNode) => (
  <AuthLayout
    showToS
    title='Login'
    card={{
      title: 'Welcome Back!',
      description: 'Login with your Google account',
      footer: AuthLayout.goSignup(),
    }}
  >
    {children}
  </AuthLayout>
)

export default LoginPage
