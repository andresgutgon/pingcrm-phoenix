import { ReactNode } from 'react'
import { Breadcrumb, IBreadcrumbItem } from '@/components/ui/atoms/Breadcrumb'
import { SidebarProvider } from '@/components/ui/molecules/Sidebar/SidebarProvider'
import { SidebarInset, SidebarTrigger } from '@/components/ui/molecules/Sidebar'
import { Separator } from '@/components/ui/atoms/Separator'
import { AppSidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'
import MainLayout from '@/Layouts/MainLayout'
import { TripleThemeToggle } from '@/components/ui/molecules/TrippleThemeToggle'

const APP_HORIZONTAL_PADDING = 'px-4'
export default function AppLayout({
  title,
  children,
  breadcrumbs,
}: {
  title?: string
  breadcrumbs: IBreadcrumbItem[]
  children: ReactNode
}) {
  return (
    <MainLayout title={title}>
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <header
            className={cn(
              'flex h-16 shrink-0 items-center justify-between gap-2',
              'transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
              APP_HORIZONTAL_PADDING,
            )}
          >
            <div className='flex items-center gap-2'>
              <SidebarTrigger
                className='-ml-1'
                keyboardShortcut='cmd+b'
                tooltip='Toggle the sidebar'
              />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              <Breadcrumb items={breadcrumbs} />
            </div>
            <TripleThemeToggle />
          </header>
          {/**
           * We need to scroll the content of the page, not the whole page.
           * So we need to add `scroll-region="true"` to the div below.
           *
           * [Read more](https://inertiajs.com/pages#scroll-regions)
           */}
          <div
            scroll-region='true'
            className={cn(
              '@container/appLayout flex flex-1 flex-col py-4 pt-0 gap-y-4',
              APP_HORIZONTAL_PADDING,
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MainLayout>
  )
}
