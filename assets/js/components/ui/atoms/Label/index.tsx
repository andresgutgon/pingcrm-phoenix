import { CustomComponentPropsWithRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'
import { font } from '@/components/ui/tokens/fonts'
import { Tooltip } from '@/components/ui/atoms/Tooltip'
import { FormError } from '@/components/ui/atoms/FormField'

const labelVariants = cva(
  cn(
    'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    font.size.h5,
    font.weight.medium,
  ),
  {
    variants: {
      variant: {
        default: 'text-foreground',
        destructive: 'text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type LabelProps = CustomComponentPropsWithRef<
  typeof LabelPrimitive.Root
> &
  VariantProps<typeof labelVariants>
const Label = ({ ref, className, variant, ...props }: LabelProps) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  )
}

type TooltipLabelProps = LabelProps & {
  info?: string
  error?: FormError
  inline?: boolean
}
export function TooltipLabel({
  info,
  error,
  children,
  ...rest
}: TooltipLabelProps) {
  return (
    <div className='flex flex-row gap-1 items-center'>
      <Label variant={error ? 'destructive' : 'default'} {...rest}>
        {children}
      </Label>

      {info ? (
        <Tooltip
          side='top'
          triggerIcon={{
            name: 'info',
            color: error ? 'destructive' : 'foregroundMuted',
          }}
        >
          {info}
        </Tooltip>
      ) : null}
    </div>
  )
}

export { Label }
