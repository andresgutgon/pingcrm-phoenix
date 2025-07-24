import { ComponentProps } from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '@/lib/utils'

type CollapsibleRootProps = ComponentProps<typeof CollapsiblePrimitive.Root>
function CollapsibleRoot(props: CollapsibleRootProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot='collapsible'
      className='group/collapsible'
      {...props}
    />
  )
}

function CollapsibleTrigger(
  props: ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>,
) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot='collapsible-trigger'
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot='collapsible-content'
      className={cn(
        'overflow-hidden duration-75',
        'data-[state=open]:animate-collapsible-down',
        'data-[state=closed]:animate-collapsible-up',
      )}
      {...props}
    />
  )
}

export {
  CollapsibleRoot,
  type CollapsibleRootProps,
  CollapsibleTrigger,
  CollapsibleContent,
}
