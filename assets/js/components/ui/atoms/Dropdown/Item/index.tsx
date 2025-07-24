import { KeyboardShortcut } from '@/components/ui/atoms/KeyboardShortcut'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from '../Primitives'
import { MenuOption, ItemOption } from '../types'
import { useCallback } from 'react'
import { Icon } from '@/components/ui/atoms/Icon'
import { Text } from '@/components/ui/atoms/Text'
import { useTheme } from 'next-themes'
import { ThemeValue } from '@/components/ui/molecules/TrippleThemeToggle'

type InternalItemProps = {
  closeDropdown?: () => void
}

function RealItem({
  disabled,
  onClick,
  closeDropdown,
  icon,
  label,
  ...props
}: ItemOption & InternalItemProps) {
  const onSelect = useCallback(() => {
    if (disabled) return

    onClick?.()
    closeDropdown?.()
  }, [disabled, onClick, closeDropdown])
  const { theme } = useTheme()

  return (
    <DropdownMenuItem {...props} onSelect={onSelect}>
      {icon ? (
        <Icon
          name={icon.name}
          className='shrink-0'
          color={props.variant === 'destructive' ? 'destructive' : 'foreground'}
          darkColor='foreground'
        />
      ) : null}
      <Text.H5
        color={props.variant === 'destructive' ? 'destructive' : 'foreground'}
        darkColor='foreground'
        theme={theme as ThemeValue}
      >
        {label}
      </Text.H5>
    </DropdownMenuItem>
  )
}

export function DropdownItem({
  closeDropdown,
  ...option
}: MenuOption & InternalItemProps) {
  if (option.type === 'label') {
    return <DropdownMenuLabel {...option}>{option.children}</DropdownMenuLabel>
  }

  if (option.type === 'group') {
    return (
      <DropdownMenuGroup>
        {option.items.map((item, index) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={index} />
          }
          return (
            <RealItem {...item} closeDropdown={closeDropdown} key={index} />
          )
        })}
      </DropdownMenuGroup>
    )
  }

  if (option.type === 'separator') {
    return <DropdownMenuSeparator />
  }

  if (option.type === 'item' && option.subItems) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          inset={option.inset}
          disabled={option.disabled}
          textValue={option.typeaheadText}
        >
          {option.label}
          {option.shortcut ? (
            <KeyboardShortcut shortcut={option.shortcut} />
          ) : null}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {option.subItems.map((subItem, index) => {
              if (subItem.type === 'separator') {
                return <DropdownMenuSeparator key={index} />
              }
              return (
                <RealItem
                  {...subItem}
                  onClick={option.onClick}
                  closeDropdown={closeDropdown}
                  key={index}
                />
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    )
  }

  return (
    <RealItem
      {...option}
      closeDropdown={closeDropdown}
      onClick={option.onClick}
    />
  )
}
