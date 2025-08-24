import { FormEvent } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { updateProfile } from '@/actions/Profile/ProfileController'
import { Button } from '@/components/ui/atoms/Button'
import { PageProps } from '@/types'
import {
  Form,
  FORM_WRAPPER_VERTICAL_SPACE_CLASS,
} from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'
import { Text } from '@/components/ui/atoms/Text'
import { Avatar } from '@/components/ui/atoms/Avatar'
import { DropzoneInput } from '@/components/ui/atoms/DropzoneInput'
import { cn } from '@/lib/utils'

function AvatartPreview({
  avatar,
  initials,
  alt,
}: {
  avatar: string | File
  initials: string
  alt: string
}) {
  const src = avatar
    ? typeof avatar === 'string'
      ? avatar
      : URL.createObjectURL(avatar)
    : undefined

  return (
    <Avatar
      borderColor='primary'
      size='preview'
      rounded='full'
      src={src}
      altText={alt}
      fallback={{
        text: initials,
        bgColor: 'primary',
        color: 'white',
      }}
    />
  )
}

type UpdateProfileInput = {
  first_name: string
  last_name: string
  avatar?: string | File
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
      <div className='grid gap-6 @xl/tab-content:grid-cols-2 @xl/tab-content:items-start'>
        <div
          className={cn(
            FORM_WRAPPER_VERTICAL_SPACE_CLASS,
            'order-2 @xl/tab-content:order-1',
          )}
        >
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
        </div>
        <div className='order-1 @xl/tab-content:order-2 flex items-center justify-center'>
          <DropzoneInput
            name='avatar'
            description='It will be displayed on your profile page and in the sidebar.'
            defaultFilename={user.avatar}
            error={form.errors.avatar}
            accept='.jpg,.jpeg,.png,.webp'
            multiple={false}
            placeholder='Drag and drop your avatar here, or click to select a file'
            onChange={(files) => {
              const avatarFile = files?.[0]
              form.setData('avatar', avatarFile)
            }}
          >
            {({ placeholder, isDragging }) => (
              <div className='min-h-44 flex items-center justify-center w-full'>
                {form.data.avatar ? (
                  <AvatartPreview
                    avatar={form.data.avatar}
                    initials={user.initials}
                    alt={`${user.name} avatar`}
                  />
                ) : (
                  <div className='max-w-52'>
                    <Text.H5
                      align='center'
                      display='block'
                      color={isDragging ? 'foreground' : 'foregroundMuted'}
                    >
                      {placeholder}
                    </Text.H5>
                  </div>
                )}
              </div>
            )}
          </DropzoneInput>
        </div>
      </div>

      <Button type='submit' loading={form.processing}>
        Update profile
      </Button>
    </Form>
  )
}
