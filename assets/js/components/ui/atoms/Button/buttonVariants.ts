import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { font } from '@/components/ui/tokens/fonts'

export const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded',
    'transition-all disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    'outline-none focus-visible:border-ring focus-visible:ring-ring/50',
    'focus-visible:ring-[3px]',
    font.size.h5,
    font.weight.medium,
  ),
  {
    variants: {
      variant: {
        default:
          'from-primary/85 to-primary text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-primary/35 shadow-md shadow-primary/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-primary/50',

        destructive:
          'from-destructive-foreground/85 to-destructive-foreground text-white/90 inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-destructive/75 dark:to-destructive dark:bg-linear-to-t border border-destructive/35 shadow-md shadow-destructive/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:border-0 dark:border-destructive/50',

        warning:
          'from-warning-foreground/85 to-warning-foreground text-warning inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-warning/75 dark:to-warning dark:bg-linear-to-t dark:text-warning-foreground border border-warning/35 shadow-md shadow-warning/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-warning/50',

        success:
          'from-success-foreground/70 to-success-foreground/90 text-success inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-success/70 dark:to-success/90 dark:bg-linear-to-t dark:text-success-foreground border border-success/40 shadow-md shadow-success/25 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-success/50',

        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        nope: 'bg-transparent text-primary-foreground group-hover:bg-transparent',
      },
      size: {
        sm: 'h-6 rounded gap-1.5 px-2 has-[>svg]:px-1.5',
        default: 'h-8 px-2.5 py-2 has-[>svg]:px-2',
        lg: 'h-10 rounded px-3 has-[>svg]:px-2.5',
        icon: 'size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
    compoundVariants: [
      {
        variant: 'nope',
        className: 'p-0',
      },
    ],
  },
)
