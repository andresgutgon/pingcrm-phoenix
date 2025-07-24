import { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'
import { Text } from '@/components/ui/atoms/Text'
import { Icon, IconProps } from '@/components/ui/atoms/Icon'
import { KeyboardShortcut } from '@/components/ui/atoms/KeyboardShortcut'

type PropviderProps = ComponentPropsWithoutRef<typeof TooltipProvider>
type RootProps = ComponentPropsWithoutRef<typeof TooltipRoot>
type ContentProps = ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> & {
  maxWidth?: string
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const TooltipRoot = TooltipPrimitive.Root

function TooltipTrigger({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
}

function TooltipContent({
  className,
  maxWidth = 'max-w-52',
  children,
  ...props
}: ContentProps) {
  return (
    <TooltipPrimitive.Content
      data-slot='tooltip-content'
      className={cn(
        'bg-foreground text-background-gray animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
        maxWidth,
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className='bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]' />
    </TooltipPrimitive.Content>
  )
}

type Props = PropviderProps &
  RootProps &
  ContentProps & {
    trigger?: ReactNode
    children?: ReactNode
    triggerIcon?: IconProps
    keyboardShortcut?: string
  }
function Tooltip({
  children,
  trigger,
  // Provider
  delayDuration = 200,
  disableHoverableContent,

  // Root
  open,
  defaultOpen,
  onOpenChange,

  // Content
  // Black tooltip by defaul. In dark mode, it will be white
  side,
  align,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  sticky,
  hideWhenDetached,
  updatePositionStrategy,
  maxWidth,
  asChild = false,
  triggerIcon,
  keyboardShortcut,
}: Props) {
  const isChildrenString = typeof children === 'string'
  return (
    <TooltipRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {!triggerIcon ? (
        <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      ) : (
        <TooltipTrigger asChild={asChild} className='flex items-center gap-x-2'>
          {trigger}
          {triggerIcon ? <Icon {...triggerIcon} /> : null}
        </TooltipTrigger>
      )}
      <TooltipPrimitive.Portal>
        <TooltipContent
          maxWidth={maxWidth}
          side={side}
          align={align}
          avoidCollisions={avoidCollisions}
          collisionBoundary={collisionBoundary}
          collisionPadding={collisionPadding}
          sticky={sticky}
          hideWhenDetached={hideWhenDetached}
          updatePositionStrategy={updatePositionStrategy}
        >
          {isChildrenString ? (
            <div className='inline-flex items-center gap-x-2'>
              <Text.H6 color='background'>{children}</Text.H6>
              {keyboardShortcut ? (
                <KeyboardShortcut shortcut={keyboardShortcut} inline={true} />
              ) : null}
            </div>
          ) : (
            children
          )}
        </TooltipContent>
      </TooltipPrimitive.Portal>
    </TooltipRoot>
  )
}

export { Tooltip, TooltipProvider }
