import { Children, ComponentPropsWithRef, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { ExtendsUnion } from '@/types'
import { ThemeValue } from '@/components/ui/molecules/TrippleThemeToggle'
import { opacity, Opacity } from '@/components/ui/tokens/opacity'
import {
  font,
  FontSize,
  TextWrap,
  FontWeight,
  FontSpacing,
  TextAlign,
  LineHeight,
  Tracking,
} from '@/components/ui/tokens/fonts'
import {
  whiteSpace as whiteSpaceOptions,
  type WhiteSpace,
} from '@/components/ui/tokens/whiteSpace'
import {
  WordBreak,
  wordBreak as wordBreakOptions,
} from '@/components/ui/tokens/wordBreak'
import { colors, TextColor } from '@/components/ui/tokens/colors'
import {
  Overflow,
  overflow as overflowOptions,
} from '@/components/ui/tokens/overflow'

type Display = 'inline' | 'inline-block' | 'block'

export type Common = {
  children: ReactNode
  theme?: ThemeValue
  color?: TextColor
  textOpacity?: Opacity
  darkColor?: TextColor
  align?: TextAlign
  capitalize?: boolean
  uppercase?: boolean
  textWrap?: TextWrap
  tracking?: Tracking
  wordBreak?: WordBreak
  whiteSpace?: WhiteSpace
  ellipsis?: boolean
  lineClamp?: number
  display?: Display
  userSelect?: boolean
  noWrap?: boolean
  underline?: boolean
  lineThrough?: boolean
  weight?: FontWeight
  asChild?: boolean
  monospace?: boolean
  centered?: boolean
  isItalic?: boolean
  overrideLineHeight?: LineHeight
  underlineHover?: boolean
  fullWidth?: boolean
}

export type TextProps = {
  size?: FontSize
  weight?: FontWeight
  spacing?: FontSpacing
  capitalize?: boolean
  wordBreak?: WordBreak
  uppercase?: boolean
  userSelect?: boolean
}

type AllTextProps = ComponentPropsWithRef<'span'> & TextProps & Common

const TextAtom = ({
  ref,
  children,
  size = 'h4',
  color = 'foreground',
  textOpacity,
  darkColor,
  theme,
  overrideLineHeight,
  spacing = 'normal',
  weight = 'normal',
  display = 'inline',
  uppercase = false,
  align = 'left',
  capitalize = false,
  whiteSpace = 'normal',
  wordBreak = 'normal',
  textWrap = 'wrap',
  ellipsis = false,
  lineClamp = undefined,
  userSelect = true,
  noWrap = false,
  underline = false,
  lineThrough = false,
  asChild = false,
  isItalic = false,
  monospace = false,
  centered = false,
  underlineHover = false,
  fullWidth = false,
  tracking,
}: AllTextProps) => {
  const Comp = asChild ? Slot : 'span'
  const isDark = theme === 'dark'
  const colorClass = colors.textColors[isDark && darkColor ? darkColor : color]
  const sizeClass = overrideLineHeight
    ? `${font.textSize[size]} ${font.leading[overrideLineHeight]}`
    : font.size[size]
  const alignClass = font.align[align]
  return (
    <Comp
      ref={ref}
      title={ellipsis && typeof children === 'string' ? children : ''}
      data-text-atom={true}
      className={cn(
        'underline-offset-4',
        alignClass,
        sizeClass,
        colorClass,
        font.weight[weight],
        font.spacing[spacing],
        wordBreakOptions[wordBreak],
        whiteSpaceOptions[whiteSpace],
        font.textWrap[textWrap],
        display,
        {
          ...(textOpacity ? { [opacity[textOpacity]]: true } : {}),
          ...(tracking ? { [font.tracking[tracking]]: true } : {}),
          'w-full': fullWidth,
          capitalize: capitalize,
          uppercase: uppercase,
          truncate: ellipsis,
          italic: isItalic,
          'select-none': !userSelect,
          'whitespace-nowrap': noWrap,
          underline: underline,
          'hover:underline': underlineHover,
          'line-through': lineThrough,
          [font.family.mono]: monospace,
          [font.family.sans]: !monospace,
          'text-center': centered,
          'line-clamp-1': lineClamp === 1,
          'line-clamp-3': lineClamp === 3,
          'leading-5': lineClamp && size === 'h6',
        },
      )}
    >
      {Children.count(children) > 1 ? (
        <span className={cn(display, alignClass)}>{children}</span>
      ) : (
        children
      )}
    </Comp>
  )
}

type TextPropsWithRef = ComponentPropsWithRef<'span'> & Common
export type MonoProps = ComponentPropsWithRef<'span'> & {
  children: ReactNode
  color?: TextColor
  weight?: ExtendsUnion<FontWeight, 'normal' | 'semibold' | 'bold'>
  userSelect?: boolean
  overflow?: Overflow
  ellipsis?: boolean
  display?: Display
  underline?: boolean
  lineThrough?: boolean
  size?: FontSize
  textTransform?: 'none' | 'uppercase' | 'lowercase'
  whiteSpace?: WhiteSpace
  wordBreak?: WordBreak
}

const Text = {
  H1: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h1' {...props} />
  ),
  H1B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h1' weight='bold' {...props} />
  ),
  H2: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h2' {...props} />
  ),
  H2B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h2' weight='bold' {...props} />
  ),
  H3: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h3' {...props} />
  ),
  H3B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h3' weight='bold' {...props} />
  ),
  H4: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h4' {...props} />
  ),
  H4M: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h4' weight='medium' {...props} />
  ),
  H4B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h4' weight='semibold' {...props} />
  ),
  H5: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h5' {...props} />
  ),
  H5M: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h5' weight='medium' {...props} />
  ),
  H5B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h5' weight='semibold' {...props} />
  ),
  H6: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h6' {...props} />
  ),
  H6M: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h6' weight='medium' {...props} />
  ),
  H6B: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h6' weight='semibold' {...props} />
  ),
  H6C: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom
      ref={ref}
      size='h6'
      weight='bold'
      uppercase
      spacing='wide'
      {...props}
    />
  ),
  H7: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom ref={ref} size='h7' spacing='wide' weight='bold' {...props} />
  ),

  H7C: ({ ref, ...props }: TextPropsWithRef) => (
    <TextAtom
      ref={ref}
      uppercase
      size='h7'
      spacing='wide'
      weight='bold'
      {...props}
    />
  ),
  Mono: ({
    ref,
    children,
    color = 'foreground',
    overflow = 'auto',
    whiteSpace = 'pre',
    wordBreak = 'normal',
    underline = false,
    lineThrough = false,
    size = 'h6',
    textTransform = 'none',
    userSelect = true,
    weight = 'normal',
    ellipsis = false,
    display = 'inline',
  }: MonoProps) => {
    const sizeClass = font.size[size]

    return (
      <span
        ref={ref}
        className={cn(
          sizeClass,
          font.family.mono,
          font.weight[weight],
          colors.textColors[color],
          overflowOptions[overflow],
          wordBreakOptions[wordBreak],
          {
            [display]: !ellipsis,
            [whiteSpaceOptions[whiteSpace]]: !!whiteSpace,
            'block truncate': ellipsis,
            'select-none': !userSelect,
            'line-through': lineThrough,
            underline: underline,
            [textTransform]: textTransform !== 'none',
          },
        )}
      >
        {children}
      </span>
    )
  },
}

export { Text }
