export type { LucideProps } from 'lucide-react'
export const LUCIDE_IMPORTS = {
  x: () => import('lucide-react').then((m) => ({ default: m.XIcon })),
  info: () => import('lucide-react').then((m) => ({ default: m.InfoIcon })),
  xCircle: () =>
    import('lucide-react').then((m) => ({ default: m.XCircleIcon })),
  circle: () => import('lucide-react').then((m) => ({ default: m.CircleIcon })),
  circleGauge: () =>
    import('lucide-react').then((m) => ({ default: m.CircleGaugeIcon })),
  building: () =>
    import('lucide-react').then((m) => ({ default: m.BuildingIcon })),
  check: () => import('lucide-react').then((m) => ({ default: m.CheckIcon })),
  chevronRight: () =>
    import('lucide-react').then((m) => ({ default: m.ChevronRightIcon })),
  chevronsUpDown: () =>
    import('lucide-react').then((m) => ({ default: m.ChevronsUpDownIcon })),
  minus: () => import('lucide-react').then((m) => ({ default: m.MinusIcon })),
  checkCircle: () =>
    import('lucide-react').then((m) => ({ default: m.CheckCircle2Icon })),
  alertCircle: () =>
    import('lucide-react').then((m) => ({ default: m.AlertCircleIcon })),
  loader: () =>
    import('lucide-react').then((m) => ({ default: m.Loader2Icon })),
  sun: () => import('lucide-react').then((m) => ({ default: m.SunIcon })),
  moon: () => import('lucide-react').then((m) => ({ default: m.MoonIcon })),
  monitor: () =>
    import('lucide-react').then((m) => ({ default: m.MonitorIcon })),
  ellipsis: () =>
    import('lucide-react').then((m) => ({ default: m.MoreHorizontalIcon })),
  creditCard: () =>
    import('lucide-react').then((m) => ({ default: m.CreditCardIcon })),
  logOut: () => import('lucide-react').then((m) => ({ default: m.LogOutIcon })),
  sparkles: () =>
    import('lucide-react').then((m) => ({ default: m.SparklesIcon })),
  panelLeftIcon: () =>
    import('lucide-react').then((m) => ({ default: m.PanelLeftIcon })),
  users: () => import('lucide-react').then((m) => ({ default: m.UsersIcon })),
  printer: () =>
    import('lucide-react').then((m) => ({ default: m.PrinterIcon })),
  plus: () => import('lucide-react').then((m) => ({ default: m.PlusIcon })),
  settings: () =>
    import('lucide-react').then((m) => ({ default: m.Settings2Icon })),
  fileUp: () => import('lucide-react').then((m) => ({ default: m.FileUpIcon })),
}

export type LucideIconName = keyof typeof LUCIDE_IMPORTS
