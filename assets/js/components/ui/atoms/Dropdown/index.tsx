import { ReactNode, useCallback, useState } from 'react'
import {
  ContentProps,
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/atoms/Dropdown/Primitives'
import { Button, ButtonProps } from '@/components/ui/atoms/Button/index'
import { cn } from '@/lib/utils'
import { DropdownMenuContent } from './Primitives'
import { MenuOption } from './types'
import { DropdownItem } from '@/components/ui/atoms/Dropdown/Item'

export type TriggerButtonProps = Omit<ButtonProps, 'children'> & {
  label?: string
}
export const TriggerButton = ({
  label,
  variant = 'outline',
  iconProps = { name: 'ellipsis', color: 'foregroundMuted' },
  ...buttonProps
}: TriggerButtonProps) => {
  return (
    <DropdownMenuTrigger
      asChild
      className='flex focus:outline-none cursor-pointer'
    >
      <Button
        asChild
        fullWidth={false}
        variant={variant}
        iconProps={iconProps}
        {...buttonProps}
      >
        {label ? <div>{label}</div> : null}
      </Button>
    </DropdownMenuTrigger>
  )
}

type RenderTriggerProps = { open: boolean; setOpen: (open: boolean) => void }
type TriggerButtonPropsFn = (open: boolean) => TriggerButtonProps
type Props = Omit<ContentProps, 'className'> & {
  triggerButtonProps?: TriggerButtonProps | TriggerButtonPropsFn
  trigger?: ((renderTriggerProps: RenderTriggerProps) => ReactNode) | ReactNode
  title?: string
  width?: 'normal' | 'wide' | 'extraWide' | 'auto'
  options: MenuOption[]
  onOpenChange?: (open: boolean) => void
  controlledOpen?: boolean
  readOnly?: boolean
}

function Dropdown({
  triggerButtonProps,
  trigger,
  onOpenChange,
  controlledOpen,
  side,
  sideOffset,
  align,
  alignOffset,
  width = 'normal',
  options,
  readOnly = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const triggerProps =
    typeof triggerButtonProps === 'function'
      ? triggerButtonProps(open)
      : triggerButtonProps
  const closeDropdown = useCallback(() => {
    setOpen(false)
  }, [])
  return (
    <DropdownMenu
      open={controlledOpen !== undefined ? controlledOpen : open}
      onOpenChange={(newOpen: boolean) => {
        onOpenChange?.(newOpen)
        setOpen(newOpen)
      }}
    >
      {triggerProps ? (
        <TriggerButton
          {...triggerProps}
          className={cn(triggerProps.className, {
            'pointer-events-none': readOnly,
          })}
        />
      ) : trigger ? (
        typeof trigger === 'function' ? (
          trigger({ open, setOpen })
        ) : (
          trigger
        )
      ) : (
        <TriggerButton />
      )}
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn({
          'w-52': width === 'normal',
          'w-72': width === 'wide',
          'w-96': width === 'extraWide',
          'w-(--radix-dropdown-menu-trigger-width) min-w-56': width === 'auto',
        })}
      >
        {options
          .filter((option) => !option.hidden)
          .map((option, index) => (
            <DropdownItem
              key={index}
              {...option}
              closeDropdown={closeDropdown}
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Dropdown, DropdownMenuTrigger }
