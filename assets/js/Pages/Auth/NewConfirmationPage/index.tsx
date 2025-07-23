import { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Logo from '@/components/Logo'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import FlashedMessages from '@/components/Messages/FlashMessages'
import { resendConfirmation } from '@/actions/Auth/ConfirmationsController'
import { signup } from '@/actions/Auth/SignupsController'
import { login } from '@/actions/Auth/SessionsController'

export default function NewConfirmationPage() {
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
            <h1 className='text-3xl font-bold text-center'>No confirmation?</h1>
            <p className='text-gray-500 text-center mt-2 mb-8'>
              We'll send a new email
            </p>
            <div className='w-24 mx-auto mt-6 mb-10 border-b-2' />
            <div className='grid gap-6'>
              <FieldGroup label='Email' name='email' error={errors.email}>
                <TextInput
                  name='email'
                  type='email'
                  placeholder='Email'
                  value={data.email}
                  error={errors.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
              </FieldGroup>
            </div>
          </div>
          <div className='flex flex-col gap-y-2 items-center justify-end px-10 py-4 bg-gray-100'>
            <LoadingButton
              type='submit'
              loading={processing}
              className='w-full btn-indigo'
            >
              Resend confirmation instructions
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
