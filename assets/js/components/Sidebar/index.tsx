import { ComponentProps } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/molecules/Sidebar'
import { OrganizationSwitcher } from './OrganizationSwitcher'
import { Sections } from '@/components/Sidebar/Sections'
import { SidebarSettings } from '@/components/Sidebar/Settings'

export function AppSidebar({
  variant,
}: {
  variant: ComponentProps<typeof Sidebar>['variant']
}) {
  return (
    <Sidebar collapsible='icon' variant={variant}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <Sections />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSettings />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
