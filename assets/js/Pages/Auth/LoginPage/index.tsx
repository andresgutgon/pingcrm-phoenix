import { FormEvent } from 'react'
import { Head } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import Logo from '@/components/Logo'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import { CheckboxInput } from '@/components/Form/CheckboxInput'
import Routes from '@/routes/routes'

export default function LoginPage() {
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

    post(Routes.path('login.create'))
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-6 bg-indigo-800'>
      <Head title='Login' />

      <div className='w-full max-w-md'>
        <Logo
          className='block w-full max-w-xs mx-auto text-white fill-current'
          height={50}
        />
        <form
          onSubmit={handleSubmit}
          className='mt-8 overflow-hidden bg-white rounded-lg shadow-xl'
        >
          <div className='px-10 py-12'>
            <h1 className='text-3xl font-bold text-center'>Welcome Back!</h1>
            <div className='w-24 mx-auto mt-6 mb-10 border-b-2' />
            <div className='grid gap-6'>
              <FieldGroup label='Email' name='email' error={errors.email}>
                <TextInput
                  name='email'
                  type='email'
                  error={errors.email}
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup
                label='Password'
                name='password'
                error={errors.password}
              >
                <TextInput
                  autoComplete='off'
                  name='password'
                  type='password'
                  error={errors.password}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <CheckboxInput
                  label='Remember Me'
                  name='remember_me'
                  id='remember'
                  checked={data.remember_me}
                  onChange={(e) => setData('remember_me', e.target.checked)}
                />
              </FieldGroup>
            </div>
          </div>
          <div className='flex items-center justify-end px-10 py-4 bg-gray-100'>
            <LoadingButton
              type='submit'
              loading={processing}
              className='btn-indigo'
            >
              Login
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
