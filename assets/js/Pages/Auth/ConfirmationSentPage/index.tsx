import { Head } from '@inertiajs/react'
import Logo from '@/components/Logo'

export default function ConfirmationSentPage({ email }: { email: string }) {
  return (
    <div className='flex items-center justify-center min-h-screen p-6 bg-indigo-800'>
      <Head title='Confirmation Sent' />

      <div className='w-full max-w-md flex flex-col gap-y-8 text-white'>
        <Logo
          className='block w-full max-w-xs mx-auto text-white fill-current'
          height={50}
        />
        <h1 className='text-2xl font-bold text-center'>Confirmation Sent</h1>
        <p className='text-center'>{`Email sent to ${email}`}</p>
        <p className='text-center'>
          Please check your email for a confirmation link to complete your
          registration.
        </p>
      </div>
    </div>
  )
}
