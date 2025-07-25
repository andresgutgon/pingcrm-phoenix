import {
  TabsProps,
  Tabs as TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/atoms/Tabs/Primitives'
import { ReactNode } from 'react'

export type TabSelectorOption<T> = {
  label: ReactNode | string
  value: T
  route?: string
  disabled?: boolean
}

type Props<T extends string> = TabsProps & {
  children: ReactNode
  options: TabSelectorOption<T>[]
}
const Tabs = <T extends string>({
  children,
  value,
  options,
  defaultValue,
  onValueChange,
}: Props<T>) => {
  return (
    <TabsRoot
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      value={value}
    >
      <TabsList>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </TabsRoot>
  )
}

Tabs.Content = TabsContent

export { Tabs }
