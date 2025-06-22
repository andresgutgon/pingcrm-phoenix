import { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Logo from '@/components/Logo'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import FlashedMessages from '@/components/Messages/FlashMessages'
import { update } from '@/actions/Auth/ResetPasswordController'
import { signup } from '@/actions/Auth/SignupsController'
import { login } from '@/actions/Auth/SessionsController'

export default function ChangePasswordPage({ token }: { token: string }) {
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
    <div className='flex items-center justify-center min-h-screen p-6 bg-indigo-800'>
      <Head title='Resend confirmation' />
      <div className='w-full max-w-sm flex flex-col gap-y-8'>
        <Logo
          className='block w-full max-w-xs mx-auto text-white fill-current'
          height={50}
        />
        <FlashedMessages />
        <form
          onSubmit={handleSubmit}
          className='overflow-hidden bg-white rounded-lg shadow-xl '
        >
          <div className='px-10 py-12'>
            <h1 className='text-3xl font-bold text-center'>Reset password</h1>
            <div className='w-24 mx-auto mt-6 mb-10 border-b-2' />
            <div className='grid gap-6'>
              <FieldGroup
                label='Password'
                name='password'
                error={form.errors.password}
              >
                <TextInput
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={form.data.password}
                  error={form.errors.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Confirm Password'
                name='password_confirmation'
                error={form.errors.password_confirmation}
              >
                <TextInput
                  name='password_confirmation'
                  type='password'
                  placeholder='Confirm Password'
                  value={form.data.password_confirmation}
                  error={form.errors.password_confirmation}
                  onChange={(e) =>
                    form.setData('password_confirmation', e.target.value)
                  }
                />
              </FieldGroup>
            </div>
          </div>
          <div className='flex flex-col gap-y-2 items-center justify-end px-10 py-4 bg-gray-100'>
            <LoadingButton
              type='submit'
              loading={form.processing}
              className='w-full btn-indigo'
            >
              Reset Password
            </LoadingButton>
            <div className='px-8 pb-6'>
              <Link
                href={signup.get().url}
                className='text-indigo-700 hover:underline'
              >
                Register
              </Link>{' '}
              |{' '}
              <Link
                href={login.get().url}
                className='text-indigo-700 hover:underline'
              >
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
