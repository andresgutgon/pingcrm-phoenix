import { FormEvent } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { updateProfile } from '@/actions/Profile/ProfileController'
import { Button } from '@/components/ui/atoms/Button'
import { PageProps } from '@/types'
import { Form } from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'

type UpdateProfileInput = {
  first_name: string
  last_name: string
  avatar?: string
}
export default function EditProfile() {
  const {
    auth: { user },
  } = usePage<PageProps>().props
  const form = useForm<UpdateProfileInput>({
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(updateProfile(), {
      preserveScroll: true,
      forceFormData: true,
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name='name'
        label='Your name'
        type='text'
        info='Just your name'
        placeholder='Write your name here'
        value={form.data.first_name}
        error={form.errors.first_name}
        onChange={(e) => form.setData('first_name', e.target.value)}
      />
      <Input
        label='Last Name'
        name='last_name'
        description='Your last name, if you have one. This is optional.'
        placeholder='Write your last name here'
        error={form.errors.last_name}
        value={form.data.last_name}
        onChange={(e) => form.setData('last_name', e.target.value)}
      />
      <Button type='submit' loading={form.processing}>
        Update profile
      </Button>
    </Form>
  )
}
