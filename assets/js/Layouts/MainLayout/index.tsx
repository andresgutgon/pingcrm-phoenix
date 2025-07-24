import { ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/atoms/Toast/Primitives'
import { FlashMessage } from '@/components/ui/molecules/FlashMessage'
import { TooltipProvider } from '@/components/ui/atoms/Tooltip'

const TOAST_DURATION = 4000
export default function MainLayout({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Head title={title} />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position='bottom-right' duration={TOAST_DURATION} />
      <FlashMessage durationMs={TOAST_DURATION} />
    </ThemeProvider>
  )
}
