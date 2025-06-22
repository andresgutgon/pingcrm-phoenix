import { FormEvent } from 'react'
import { Head } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import Logo from '@/components/Logo'
import LoadingButton from '@/components/Button/LoadingButton'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import FlashedMessages from '@/components/Messages/FlashMessages'
import { signupCreate } from '@/actions/Auth/SignupsController'

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

export default function SignupPage() {
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
    <div className='flex items-center justify-center min-h-screen p-6 bg-indigo-800'>
      <Head title='Signup' />

      <div className='w-full max-w-md flex flex-col gap-y-8'>
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
            <h1 className='text-3xl font-bold text-center'>
              Create your account
            </h1>
            <div className='w-24 mx-auto mt-6 mb-10 border-b-2' />
            <div className='grid gap-6'>
              <FieldGroup
                label='Account'
                name='account.name'
                error={errors['account.name']}
              >
                <TextInput
                  name='account.name'
                  type='text'
                  error={errors['account.name']}
                  value={data.account.name}
                  onChange={(e) => setData('account.name', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Your Email'
                name='user.email'
                error={errors['user.email']}
              >
                <TextInput
                  name='user.email'
                  type='text'
                  error={errors['user.email']}
                  value={data.user.email}
                  onChange={(e) => setData('user.email', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Your Name'
                name='user.first_name'
                error={errors['user.first_name']}
              >
                <TextInput
                  name='user.first_name'
                  type='text'
                  error={errors['user.first_name']}
                  value={data.user.first_name}
                  onChange={(e) => setData('user.first_name', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Your Last Name'
                name='user.last_name'
                error={errors['user.last_name']}
              >
                <TextInput
                  name='user.last_name'
                  type='text'
                  error={errors['user.last_name']}
                  value={data.user.last_name}
                  onChange={(e) => setData('user.last_name', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Password'
                name='user.password'
                error={errors['user.password']}
              >
                <TextInput
                  name='user.password'
                  type='password'
                  error={errors['user.password']}
                  value={data.user.password}
                  onChange={(e) => setData('user.password', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup
                label='Confirm Password'
                name='user.password_confirmation'
                error={errors['user.password_confirmation']}
              >
                <TextInput
                  name='user.password_confirmation'
                  type='password'
                  error={errors['user.password_confirmation']}
                  value={data.user.password_confirmation}
                  onChange={(e) =>
                    setData('user.password_confirmation', e.target.value)
                  }
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
              Create Account
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
