import { ComponentProps } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'
import { font } from '@/components/ui/tokens/fonts'
import { whiteSpace } from '@/components/ui/tokens/whiteSpace'

function Tabs({
  className,
  fullWidth = false,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root> & {
  fullWidth?: boolean
}) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex flex-col gap-4', className, {
        'w-full': fullWidth,
      })}
      {...props}
    />
  )
}

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List> & {
  fullWidth?: boolean
  size?: 'normal' | 'small'
}

function TabsList({
  className,
  size = 'normal',
  fullWidth = false,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      className={cn(
        'bg-muted flex items-center justify-center ',
        'relative',
        className,
        {
          'px-0.5 rounded-md': size === 'small',
          'p-1 rounded-lg': size === 'normal',
          'w-full': fullWidth,
        },
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  ref,
  className,
  size = 'normal',
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> & {
  size?: TabsListProps['size']
}) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot='tabs-trigger'
      className={cn(
        font.size.h5,
        font.weight.medium,
        whiteSpace.nowrap,
        'truncate',
        'data-[state=active]:text-foreground text-muted-foreground',
        'cursor-pointer data-[state=active]:cursor-default',
        'flex-1 items-center justify-center gap-1.5',
        'transition-color select-none',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-4",
        className,
        {
          'px-2 py-1 rounded-sm': size === 'small',
          'py-1.5 px-3 rounded-md': size === 'normal',
        },
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn(
        '@container/tab-content flex-1 outline-none flex flex-col gap-y-8',
        className,
      )}
      {...props}
    />
  )
}

export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>
export { Tabs, TabsList, TabsTrigger, TabsContent }
