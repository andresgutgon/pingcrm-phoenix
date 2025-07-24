export type { LucideProps } from 'lucide-react'
export const LUCIDE_IMPORTS = {
  x: () => import('lucide-react').then((m) => ({ default: m.XIcon })),
  checkCircle: () =>
    import('lucide-react').then((m) => ({ default: m.CheckCircle2Icon })),
  alertCircle: () =>
    import('lucide-react').then((m) => ({ default: m.AlertCircleIcon })),
  loader: () =>
    import('lucide-react').then((m) => ({ default: m.Loader2Icon })),
}

export type LucideIconName = keyof typeof LUCIDE_IMPORTS
