import { FormEvent } from 'react'
import { Head, useForm } from '@inertiajs/react'
import Logo from '@/components/Logo'
import LoadingButton from '@/components/Button/LoadingButton'
import FlashedMessages from '@/components/Messages/FlashMessages'
import { confirmUser } from '@/actions/Auth/ConfirmationsController'

export default function ConfirmationPage({ token }: { token: string }) {
  const form = useForm()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(confirmUser(token), { preserveScroll: true })
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
          action={confirmUser(token).url}
          onSubmit={handleSubmit}
          className='overflow-hidden bg-white rounded-lg shadow-xl '
        >
          <div className='px-10 py-12'>
            <h1 className='text-3xl font-bold text-center'>
              Confirm your account
            </h1>
            <div className='w-24 mx-auto mt-6 mb-10 border-b-2' />
          </div>
          <div className='flex flex-col gap-y-2 items-center justify-end px-10 py-4 bg-gray-100'>
            <LoadingButton
              type='submit'
              loading={form.processing}
              className='btn-indigo'
            >
              Confirm
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
