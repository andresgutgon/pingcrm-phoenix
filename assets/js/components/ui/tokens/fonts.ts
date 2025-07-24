const leading = {
  none: 'leading-none',
  h1: 'leading-[48px]',
  h2: 'leading-10', // 40px
  h3: 'leading-8', // 32px
  h4: 'leading-6', // 24px
  h5: 'leading-5', // 20px
  h6: 'leading-4', // 16px
  h7: 'leading-4', // 16px
}
const textSize = {
  h1: 'text-4xl', // 36px
  h2: 'text-[26px]', // 26px
  h3: 'text-xl', // 20px
  h4: 'text-base', // 16px
  h5: 'text-sm', // 14px
  h6: 'text-xs', // 12px
  h7: 'text-[10px]', // 10px
}

export const font = {
  leading,
  textSize,
  size: {
    h1: `${textSize.h1} ${leading.h1}`,
    h2: `${textSize.h2} ${leading.h2}`,
    h3: `${textSize.h3} ${leading.h3}`,
    h4: `${textSize.h4} ${leading.h4}`,
    h5: `${textSize.h5} ${leading.h5}`,
    h6: `${textSize.h6} ${leading.h6}`,
    h7: `${textSize.h7} ${leading.h7}`,
  },
  family: {
    sans: 'font-sans',
    mono: 'font-mono',
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  spacing: {
    normal: 'tracking-normal',
    wide: 'tracking-wide',
  },
  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  },
  textWrap: {
    wrap: 'text-wrap',
    nowrap: 'text-nowrap',
    balance: 'text-balance',
    pretty: 'text-pretty',
  },
  tracking: {
    normal: 'tracking-normal',
    tight: 'tracking-tight',
    tighter: 'tracking-tighter',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest',
    negativeNormal: '-tracking-normal',
    negativeTight: '-tracking-tight',
    negativeTighter: '-tracking-tighter',
    negativeWide: '-tracking-wide',
    negativeWider: '-tracking-wider',
    negativeWidest: '-tracking-widest',
  },
} as const

export type FontFamily = keyof typeof font.family
export type FontSize = keyof typeof font.size
export type LineHeight = keyof typeof font.leading
export type TextAlign = keyof typeof font.align
export type FontWeight = keyof typeof font.weight
export type FontSpacing = keyof typeof font.spacing
export type TextWrap = keyof typeof font.textWrap
export type Tracking = keyof typeof font.tracking
