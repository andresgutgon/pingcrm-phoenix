import { ReactNode } from 'react'
import {
  CollapsibleRoot,
  CollapsibleRootProps,
  CollapsibleTrigger,
  CollapsibleContent,
} from './Primitives'

export function Collapsible({
  children,
  trigger,
  asChild = false,
  ...props
}: CollapsibleRootProps & {
  trigger: ReactNode
  asChild?: boolean
}) {
  return (
    <CollapsibleRoot {...props}>
      <CollapsibleTrigger asChild={asChild}>{trigger}</CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </CollapsibleRoot>
  )
}
