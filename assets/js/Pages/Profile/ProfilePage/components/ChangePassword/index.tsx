import { FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/atoms/Button'
import { updatePassword } from '@/actions/Profile/ProfileController'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'

const EMPTY_FORM = {
  current_password: '',
  password: '',
  password_confirmation: '',
}
export default function ChangePassword() {
  const form = useForm<{
    current_password: string
    password: string
    password_confirmation: string
  }>(EMPTY_FORM)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(updatePassword(), {
      preserveScroll: true,
      onSuccess: () => {
        form.setDefaults(EMPTY_FORM)
        form.reset()
      },
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label='Current Password'
        type='password'
        name='current_password'
        placeholder='Your current password'
        value={form.data.current_password}
        error={form.errors.current_password}
        onChange={(e) => form.setData('current_password', e.target.value)}
      />
      <Input
        label='New Password'
        name='password'
        type='password'
        placeholder='Password'
        value={form.data.password}
        error={form.errors.password}
        onChange={(e) => form.setData('password', e.target.value)}
      />
      <Input
        label='Confirm Password'
        name='password_confirmation'
        type='password'
        placeholder='Confirm Password'
        value={form.data.password_confirmation}
        error={form.errors.password_confirmation}
        onChange={(e) => form.setData('password_confirmation', e.target.value)}
      />
      <Button type='submit' loading={form.processing}>
        Change Password
      </Button>
    </Form>
  )
}
