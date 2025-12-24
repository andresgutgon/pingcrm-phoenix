import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { Dropzone, type DropzoneProps } from '@/components/ui/atoms/Dropzone'
import { FormField, type FormFieldProps } from '@/components/ui/atoms/FormField'
import { Icon, IconName } from '@/components/ui/atoms/Icon/'
import { Text } from '@/components/ui/atoms/Text'
import { Button } from '@/components/ui/atoms/Button'

type OnFileSizeErrorArgs = {
  name: string
  sizeInMB: string
  maxSizeInMB: string
}

type Props = Omit<DropzoneProps, 'children'> &
  Omit<FormFieldProps, 'children'> & {
    defaultFilename?: string
    placeholder: string
    icon?: IconName
    inputSize?: 'small' | 'normal'
    maxFileSize?: number
    onOptimisticFileSizeError?: (_args: OnFileSizeErrorArgs) => void
    onChange?: (files: FileList | null) => void
    onRemove?: () => void
    children?({
      isDragging,
      placeholder,
    }: {
      isDragging: boolean
      placeholder: string
    }): ReactNode
  }

export function DropzoneInput({
  label,
  description,
  error,
  placeholder,
  accept,
  multiple,
  defaultFilename,
  icon = 'fileUp',
  inputSize = 'normal',
  maxFileSize,
  onOptimisticFileSizeError,
  onChange,
  onRemove,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState<string | undefined>(defaultFilename)
  useEffect(() => setFilename(defaultFilename), [defaultFilename])

  const onClickZone = useCallback(() => {
    if (!ref.current) return
    ref.current.click()
  }, [ref])

  const onFileChange = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return

      // TODO: Optimistic file size check. Pass from the backend.
      if (maxFileSize && file.size > maxFileSize) {
        if (ref.current) ref.current.value = ''
        onOptimisticFileSizeError?.({
          name: file.name,
          sizeInMB: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          maxSizeInMB: `${(maxFileSize / 1024 / 1024).toFixed(2)}MB`,
        })
        return
      }

      setFilename(file.name)
      onChange?.(files)
    },
    [setFilename, onChange, maxFileSize, onOptimisticFileSizeError],
  )

  const onClearFile = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      if (ref.current) {
        ref.current.value = ''
      }

      setFilename(undefined)
      onRemove?.()
    },
    [ref, setFilename, onRemove],
  )

  return (
    <div onClick={onClickZone} className='w-full'>
      <FormField label={label} description={description} error={error}>
        <Dropzone
          ref={ref}
          onChange={onFileChange}
          accept={accept}
          multiple={multiple}
          {...rest}
        >
          {({ isDragging }) => (
            <div
              className={cn(
                'bg-sidebar cursor-pointer flex min-w-0 border-2 border-dashed relative',
                'rounded-md gap-x-2 flex items-center justify-center',
                {
                  'border-input': !isDragging,
                  'border-foreground': isDragging,
                  'p-5': inputSize === 'normal',
                  'px-2 py-1': inputSize === 'small',
                },
              )}
            >
              {!children ? (
                <Icon
                  name={icon}
                  color='foreground'
                  size='normal'
                  className='shrink-0'
                />
              ) : null}
              <div className='flex-grow flex-shrink truncate flex items-center justify-between gap-x-2'>
                {children ? (
                  children({ isDragging, placeholder })
                ) : (
                  <Text.H5 ellipsis noWrap color='foreground'>
                    {filename ? filename : placeholder}
                  </Text.H5>
                )}
              </div>
              {filename ? (
                <div className='absolute right-2 top-2 flex items-center justify-center'>
                  <Button
                    variant='ghost'
                    iconProps={{
                      name: 'x',
                      color: 'foregroundMuted',
                      size: 'normal',
                    }}
                    onClick={onClearFile}
                  />
                </div>
              ) : null}
            </div>
          )}
        </Dropzone>
      </FormField>
    </div>
  )
}
