import {
  HTMLAttributes,
  ReactNode,
  ComponentProps,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import {
  FormControl,
  FormDescription,
  InlineFormErrorMessage,
} from '../FormField'
import { cn } from '@/lib/utils'
import { TooltipLabel } from '../Label'

type ToggleProps = ComponentProps<typeof SwitchPrimitive.Root>
function SwitchToggle({ className, ...props }: ToggleProps) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  )
}
SwitchToggle.displayName = SwitchPrimitive.Root.displayName

function useCheckedState({
  checked,
  defaultChecked,
  onCheckedChange,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [isChecked, setIsChecked] = useState(!!defaultChecked)

  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked)
    }
  }, [checked])

  const onChange = useCallback(
    (checked: boolean) => {
      setIsChecked(checked)
      onCheckedChange?.(checked)
    },
    [setIsChecked, onCheckedChange],
  )
  return useMemo(() => ({ isChecked, onChange }), [isChecked, onChange])
}

type Props = ToggleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    label?: string
    description?: string | ReactNode
    errors?: string[] | null | undefined
    name?: string
    info?: string
    checked?: boolean
    defaultChecked?: boolean
    fullWidth?: boolean
    innerClassName?: string
  }
function SwitchInput({
  className,
  label,
  errors,
  description,
  name,
  checked,
  info,
  defaultChecked,
  fullWidth = true,
  innerClassName,
  ...rest
}: Props) {
  const error = errors?.[0]
  const id = useId()
  const formItemId = `${id}-form-item`
  const formDescriptionId = `${id}-form-item-description`
  const formMessageId = `${id}-form-item-message`
  const { isChecked, onChange } = useCheckedState({
    checked: checked,
    defaultChecked,
    onCheckedChange: rest.onCheckedChange,
  })

  return (
    <div
      className={cn('flex flex-col gap-y-2', className, {
        'w-full': fullWidth,
      })}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
    >
      <div className='flex flex-row items-center gap-x-2 w-full'>
        <FormControl
          error={error}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
        >
          <div className='flex items-center'>
            <input
              type='hidden'
              name={name}
              value={isChecked ? 'true' : 'false'}
            />
            <SwitchToggle
              {...rest}
              checked={isChecked}
              onCheckedChange={onChange}
              className={innerClassName}
            />
          </div>
        </FormControl>
        {label ? (
          <TooltipLabel
            variant={error ? 'destructive' : 'default'}
            htmlFor={formItemId}
            info={info}
          >
            {label}
          </TooltipLabel>
        ) : null}
      </div>
      {description && (
        <FormDescription compactDescription>{description}</FormDescription>
      )}

      <InlineFormErrorMessage error={error} id={formMessageId} />
    </div>
  )
}

export { SwitchInput, SwitchToggle }
