import { FormEvent, MouseEvent, useCallback } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import {
  updateProfile,
  deleteAvatar,
} from '@/actions/Profile/ProfileController'
import { Button } from '@/components/ui/atoms/Button'
import { AvailableUploaders, PageProps } from '@/types'
import {
  Form,
  FORM_WRAPPER_VERTICAL_SPACE_CLASS,
} from '@/components/ui/atoms/Form'
import { Input } from '@/components/ui/atoms/Input'
import { Text } from '@/components/ui/atoms/Text'
import { Avatar } from '@/components/ui/atoms/Avatar'
import { DropzoneInput } from '@/components/ui/atoms/DropzoneInput'
import { cn } from '@/lib/utils'
import { useUpload } from '@/hooks/storage/useUpload'
import { sign, store } from '@/actions/DirectUploadsController'
import { showToast } from '@/components/ui/atoms/Toast'
import { AvatarRoot } from '@/components/ui/atoms/Avatar/Primitives'
import { Icon } from '@/components/ui/atoms/Icon'

function AvatartPreview({
  src,
  initials,
  alt,
  isUploading,
  progress,
}: {
  src?: string
  initials: string
  alt: string
  isUploading?: boolean
  progress?: number
}) {
  return (
    <Avatar
      borderColor='foreground'
      size='preview'
      rounded='full'
      src={src}
      altText={alt}
      isUploading={isUploading}
      progress={progress}
      fallback={{
        text: initials,
        bgColor: 'backgroundMuted',
        color: 'foreground',
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

  const profileForm = useForm<UpdateProfileInput>({
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar ?? '',
  })

  // TODO: Revert to mutlipart_form when
  // when direct upload is implemented for company logo
  // const { setPreview, preview, handleUpload } = useUpload({
  //   mode: 'multipart_form',
  //   form: profileForm, // If avatar was uploaded in a multipart_form
  //   field: 'avatar',
  //   onRemoveAttachment: () => {
  //     form.submit(deleteAvatar(), {
  //       preserveScroll: true,
  //     })
  //   },
  // })

  const {
    progress,
    isPending,
    uploadStatus,
    setPreview,
    preview,
    handleUpload,
    handleRemove,
    cancelUpload,
  } = useUpload<UpdateProfileInput, 'avatar', AvailableUploaders>({
    mode: 'direct_upload',
    form: profileForm,
    field: 'avatar',
    uploaderArgs: {
      uploader: 'avatar',
      entity_id: user.id,
    },
    signUrlBuilder: sign,
    storeUrlBuilder: store,
    onRemoveAttachment: () => {
      // TODO: Make a custom avatar form
      profileForm.submit(deleteAvatar(), {
        preserveScroll: true,
      })
    },
    onUploadError: (error) => {
      showToast({
        title: 'Error uploading avatar',
        variant: 'destructive',
        description: error.message,
      })
    },
  })

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      profileForm.submit(updateProfile(), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: (newPage) => {
          const newUser = (newPage.props as PageProps).auth.user
          setPreview(newUser.avatar ?? undefined)
        },
      })
    },
    [profileForm, setPreview],
  )
  const onCancelUpload = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      cancelUpload()
    },
    [cancelUpload],
  )

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
            value={profileForm.data.first_name}
            error={profileForm.errors.first_name}
            onChange={(e) => profileForm.setData('first_name', e.target.value)}
          />
          <Input
            label='Last Name'
            name='last_name'
            description='Your last name, if you have one. This is optional.'
            placeholder='Write your last name here'
            error={profileForm.errors.last_name}
            value={profileForm.data.last_name}
            onChange={(e) => profileForm.setData('last_name', e.target.value)}
          />
        </div>

        <div className='order-1 @xl/tab-content:order-2 flex items-center justify-center'>
          <DropzoneInput
            name='avatar'
            defaultFilename={
              typeof profileForm.data.avatar === 'string'
                ? profileForm.data.avatar
                : undefined
            }
            error={profileForm.errors.avatar}
            accept='.jpg,.jpeg,.png,.webp'
            multiple={false}
            placeholder='Click or drag and drop your avatar here'
            onChange={handleUpload}
            onRemove={handleRemove}
          >
            {({ placeholder, isDragging }) => (
              <div className='relative min-h-52 flex items-center justify-center w-full'>
                {preview ? (
                  <>
                    <AvatartPreview
                      src={preview}
                      initials={user.initials}
                      alt={`${user.name} avatar`}
                      isUploading={uploadStatus === 'uploading'}
                      progress={progress}
                    />
                  </>
                ) : (
                  <div className='max-w-52 flex flex-col items-center gap-y-2'>
                    <AvatarRoot
                      borderColor='foreground'
                      size='preview'
                      rounded='full'
                    >
                      <div className='flex size-full items-center justify-center'>
                        <Icon
                          name='camera'
                          size='xlarge'
                          color='foregroundMuted'
                        />
                      </div>
                    </AvatarRoot>
                  </div>
                )}
                <div
                  className={cn(
                    'absolute inset-0 flex items-end justify-center',
                    {
                      hidden: preview !== undefined && !isPending,
                    },
                  )}
                >
                  <Text.H5
                    align='center'
                    display='block'
                    color={isDragging ? 'foreground' : 'foregroundMuted'}
                  >
                    {isPending && progress > 0 ? (
                      <div className='inline-flex items-center gap-x-2'>
                        <span>Uploading...</span>
                        <button
                          className='underline text-foreground'
                          onClick={onCancelUpload}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      placeholder
                    )}
                  </Text.H5>
                </div>
              </div>
            )}
          </DropzoneInput>
        </div>
      </div>

      <Button type='submit' loading={profileForm.processing}>
        Update profile
      </Button>
    </Form>
  )
}
