import { FormEvent } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import TextInput from '@/components/Form/TextInput'
import FieldGroup from '@/components/Form/FieldGroup'
import { updateProfile } from '@/actions/ProfileController'
import { Button } from '@/components/ui/atoms/Button'
import { PageProps } from '@/types'

export default function EditProfile() {
  const {
    auth: { user },
  } = usePage<PageProps>().props
  const form = useForm<{ first_name: string; last_name: string }>({
    first_name: user.first_name,
    last_name: user.last_name,
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.submit(updateProfile(), {
      preserveScroll: true,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg border border-gray-200 p-2 space-y-3'
    >
      <div className='grid gap-6'>
        <FieldGroup label='Name' name='name' error={form.errors.first_name}>
          <TextInput
            name='name'
            type='text'
            placeholder='Your name'
            value={form.data.first_name}
            error={form.errors.first_name}
            onChange={(e) => form.setData('first_name', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup
          label='Last Name'
          name='last_name'
          error={form.errors.last_name}
        >
          <TextInput
            name='last_name'
            type='text'
            placeholder='Your name'
            value={form.data.last_name}
            error={form.errors.first_name}
            onChange={(e) => form.setData('last_name', e.target.value)}
          />
        </FieldGroup>
      </div>
      <Button type='submit' loading={form.processing}>
        Update profile
      </Button>
    </form>
  )
}
