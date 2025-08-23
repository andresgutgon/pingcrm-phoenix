import { FormEvent, ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { signupCreate } from '@/actions/Auth/SignupsController'
import { Button } from '@/components/ui/atoms/Button'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'
import AuthLayout from '@/Layouts/AuthLayout'

type SignupFormData = {
  account: {
    name: string
  }
  user: {
    email: string
    first_name: string
    last_name: string
    password: string
    password_confirmation: string
  }
}

function SignupPage() {
  const { data, setData, errors, post, processing } = useForm<SignupFormData>({
    account: { name: '' },
    user: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirmation: '',
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    post(signupCreate().url, { preserveScroll: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label='Company Name'
        name='account.name'
        placeholder='Your company name'
        error={errors['account.name']}
        value={data.account.name}
        onChange={(e) => setData('account.name', e.target.value)}
      />
      <Input
        type='text'
        label='Your Email'
        name='user.email'
        placeholder='Insert your email here'
        error={errors['user.email']}
        value={data.user.email}
        onChange={(e) => setData('user.email', e.target.value)}
      />
      <Input
        type='text'
        label='Your Name'
        name='user.first_name'
        placeholder='Insert your first name here'
        error={errors['user.first_name']}
        value={data.user.first_name}
        onChange={(e) => setData('user.first_name', e.target.value)}
      />
      <Input
        type='text'
        label='Your Last Name'
        name='user.last_name'
        placeholder='Insert your last name here'
        error={errors['user.last_name']}
        value={data.user.last_name}
        onChange={(e) => setData('user.last_name', e.target.value)}
      />
      <Input
        label='Password'
        name='user.password'
        type='password'
        placeholder='Use a secure password'
        description='Your password must be at least 8 characters long.'
        error={errors['user.password']}
        value={data.user.password}
        onChange={(e) => setData('user.password', e.target.value)}
      />
      <Input
        label='Confirm Password'
        name='user.password_confirmation'
        placeholder='Re-enter your password'
        type='password'
        error={errors['user.password_confirmation']}
        value={data.user.password_confirmation}
        onChange={(e) => setData('user.password_confirmation', e.target.value)}
      />
      <Button
        fullWidth
        type='submit'
        loading={processing}
        className='btn-indigo'
      >
        Create Account
      </Button>
    </Form>
  )
}

SignupPage.layout = (children: ReactNode) => (
  <AuthLayout
    showToS
    title='Signup'
    card={{
      title: 'Create your account',
      description: 'Join us today!',
      footer: AuthLayout.goLogin(),
    }}
  >
    {children}
  </AuthLayout>
)

export default SignupPage
