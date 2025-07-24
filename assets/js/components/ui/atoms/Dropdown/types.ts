import { ReactNode } from 'react'
import { DropdownMenuItemProps, LabelProps } from './Primitives'
import { IconProps } from '@/components/ui/atoms/Icon'

type LabelOption = Pick<LabelProps, 'inset' | 'padding'> & {
  type: 'label'
  children: string | ReactNode
  hidden?: boolean
}

type Separator = { type: 'separator'; hidden?: boolean }
export type ItemOption = Pick<
  DropdownMenuItemProps,
  'disabled' | 'inset' | 'variant'
> & {
  type: 'item'
  label: string
  typeaheadText?: string
  shortcut?: string
  icon?: { name: IconProps['name'] }
  hidden?: boolean
  subItems?: ValidItem[]
  onClick?: () => void
  href?: string
  onElementClick?: (e: MouseEvent) => void
}

type ValidItem = ItemOption | Separator
type Group = { type: 'group'; items: ValidItem[]; hidden?: boolean }

export type MenuOption = LabelOption | Group | ItemOption | Separator
