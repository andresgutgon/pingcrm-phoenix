export type { LucideProps } from 'lucide-react'
export const LUCIDE_IMPORTS = {
  x: () => import('lucide-react').then((m) => ({ default: m.XIcon })),
}

export type LucideIconName = keyof typeof LUCIDE_IMPORTS
