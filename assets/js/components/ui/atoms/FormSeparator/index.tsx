import { Text } from '@/components/ui/atoms/Text'
import { BackgroundColor, colors } from '@/components/ui/tokens/colors'
import { cn } from '@/lib/utils'

export function FormSeparator({
  label,
  background = 'background',
}: {
  label?: string
  background?: BackgroundColor
}) {
  return (
    <div className='relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
      {label ? (
        <span
          className={cn('relative z-10 px-2', colors.backgrounds[background])}
        >
          <Text.H5 centered color='foregroundMuted'>
            {label}
          </Text.H5>
        </span>
      ) : null}
    </div>
  )
}
