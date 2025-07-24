import { Slot } from '@radix-ui/react-slot'
import { ComponentPropsWithRef, HTMLAttributes, ReactNode, useId } from 'react'

import { cn } from '@/lib/utils'
import { Text } from '@/components/ui/atoms/Text'
import { TooltipLabel } from '@/components/ui/atoms/Label'

export type FormError = string | null | undefined

export function FormDescription({
  children,
  compactDescription,
}: {
  children: string | ReactNode
  compactDescription: boolean
}) {
  if (typeof children !== 'string') return children

  return (
    <Text.H6
      color='foregroundMuted'
      display='block'
      overrideLineHeight={compactDescription ? 'none' : undefined}
    >
      {children}
    </Text.H6>
  )
}

export function InlineFormErrorMessage({
  error,
  id,
}: {
  id: string
  error: FormError
}) {
  if (!error) return null

  return (
    <Text.H5 asChild id={id} color='destructive' overrideLineHeight='none'>
      <p id={id}>{error}</p>
    </Text.H5>
  )
}

export const FormControl = ({
  error,
  formItemId,
  formMessageId,
  formDescriptionId,
  ...props
}: ComponentPropsWithRef<typeof Slot> & {
  error: FormError
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}) => {
  return (
    <Slot
      ref={props.ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function DescriptionAndError({
  description,
  compactDescription,
  error,
  formMessageId,
}: {
  description: ReactNode | string | undefined
  compactDescription: boolean
  error: FormError
  formMessageId: string
}) {
  return (
    <>
      {description && (
        <FormDescription compactDescription={compactDescription}>
          {description}
        </FormDescription>
      )}
      <InlineFormErrorMessage error={error} id={formMessageId} />
    </>
  )
}

type InputWrapperProps = {
  children: ReactNode
  description: ReactNode | string | undefined
  compactDescription: boolean
  error: FormError
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  label?: string | ReactNode
  info?: string
}

/**
 * Used for checkbox and radio buttons
 * where label is inline with the form input element.
 */
function InlineInput({
  children,
  label,
  formItemId,
  info,
  error,
  description,
  compactDescription,
  formDescriptionId,
  formMessageId,
}: InputWrapperProps) {
  if (!label) {
    return (
      <div className='flex flex-row gap-2 items-center'>
        <FormControl
          error={error}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
        >
          {children}
        </FormControl>
        <DescriptionAndError
          description={description}
          compactDescription={compactDescription}
          error={error}
          formMessageId={formMessageId}
        />
      </div>
    )
  }

  const hasErrorOrDescription = !!error || !!description
  return (
    <TooltipLabel htmlFor={formItemId} info={info} error={error}>
      <div
        className={cn('flex gap-x-3', {
          'items-center': label && !hasErrorOrDescription,
          'items-start': hasErrorOrDescription,
        })}
      >
        <FormControl
          error={error}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
        >
          {children}
        </FormControl>
        <div className='grid gap-1.5'>
          <Text.H5M
            display='block'
            overrideLineHeight={hasErrorOrDescription ? 'none' : undefined}
          >
            {label}
          </Text.H5M>
          <DescriptionAndError
            description={description}
            compactDescription={compactDescription}
            error={error}
            formMessageId={formMessageId}
          />
        </div>
      </div>
    </TooltipLabel>
  )
}

function StackInput({
  children,
  label,
  formItemId,
  info,
  error,
  formDescriptionId,
  formMessageId,
  description,
  compactDescription,
}: InputWrapperProps) {
  return (
    <div className='flex flex-col gap-y-2'>
      {label ? (
        <TooltipLabel htmlFor={formItemId} info={info} error={error}>
          {label}
        </TooltipLabel>
      ) : null}
      <div className='flex flex-col gap-y-1'>
        <FormControl
          error={error}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
        >
          {children}
        </FormControl>
        <DescriptionAndError
          description={description}
          compactDescription={compactDescription}
          error={error}
          formMessageId={formMessageId}
        />
      </div>
    </div>
  )
}

export type FormFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> & {
  children: ReactNode
  label?: string | ReactNode
  hidden?: boolean
  description?: string | ReactNode
  compactDescription?: boolean
  info?: string
  inline?: boolean
  error?: string | null | undefined
  autoGrow?: boolean
  fullWidth?: boolean
}

function FormField({
  children,
  label,
  description,
  className,
  error,
  info,
  compactDescription = false,
  autoGrow = false,
  fullWidth = true,
  hidden = false,
  inline = false,
}: FormFieldProps) {
  const id = useId()

  if (hidden) return children

  const formItemId = `${id}-form-item`
  const formDescriptionId = `${id}-form-item-description`
  const formMessageId = `${id}-form-item-message`
  const InputCmp = inline ? InlineInput : StackInput
  return (
    <div
      className={cn(
        'space-y-2',
        {
          'h-full': autoGrow,
          'w-full': fullWidth,
        },
        className,
      )}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
    >
      <InputCmp
        label={label}
        formItemId={formItemId}
        info={info}
        error={error}
        description={description}
        compactDescription={compactDescription}
        formDescriptionId={formDescriptionId}
        formMessageId={formMessageId}
      >
        {children}
      </InputCmp>
    </div>
  )
}

export { FormField }
