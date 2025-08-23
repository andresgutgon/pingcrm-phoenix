'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  type TabsListProps,
  TabsProps,
  Tabs as TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/atoms/Tabs/Primitives'
import { cn } from '@/lib/utils'

export type TabSelectorOption<T> = {
  label: ReactNode | string
  value: T
  route?: string
  disabled?: boolean
}

type Props<T extends string> = TabsProps & {
  children: ReactNode
  options: TabSelectorOption<T>[]
  size?: TabsListProps['size']
  fullWidth?: boolean
}

const Tabs = <T extends string>({
  children,
  value: controlledValue,
  options,
  defaultValue,
  size = 'normal',
  fullWidth = false,
  onValueChange,
  ...rest
}: Props<T>) => {
  const [selected, setSelected] = useState<T | undefined>(
    (controlledValue as T) ?? (defaultValue as T),
  )

  useEffect(() => {
    if (controlledValue !== undefined) setSelected(controlledValue as T)
  }, [controlledValue])

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const backgroundRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = selected ? triggerRefs.current[selected] : null
    const pill = backgroundRef.current
    const list = listRef.current
    if (!pill || !current || !list) {
      if (pill) pill.style.display = 'none'
      return
    }

    const update = () => {
      const listRect = list.getBoundingClientRect()
      const btnRect = current.getBoundingClientRect()
      pill.style.display = 'block'
      pill.style.left = `${btnRect.left - listRect.left}px`
      pill.style.top = `${btnRect.top - listRect.top}px`
      pill.style.width = `${btnRect.width}px`
      pill.style.height = `${btnRect.height}px`
    }

    update()
    // Observe changes
    const ro = new window.ResizeObserver(update)
    ro.observe(current)
    ro.observe(list)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [selected, options])

  return (
    <TabsRoot
      value={selected}
      fullWidth={fullWidth}
      defaultValue={defaultValue}
      onValueChange={(val: string) => {
        setSelected(val as T)
        onValueChange?.(val)
      }}
      {...rest}
    >
      <TabsList
        size={size}
        fullWidth={fullWidth}
        ref={listRef}
        className='relative'
      >
        {/* Animated pill */}
        <div
          ref={backgroundRef}
          className={cn(
            'absolute z-0',
            'bg-background rounded-sm shadow-sm',
            'z-0 transition-all duration-200 ease-in-out',
            'hidden pointer-events-none min-w-0',
          )}
        />
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            ref={(el) => {
              triggerRefs.current[option.value] = el
            }}
            value={option.value}
            disabled={option.disabled}
            className='relative z-10'
            size={size}
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
