import { useMemo, useState } from 'react'
import { WayfinderUrl } from '@/wayfinder'
import { Link } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/molecules/Sidebar'
import {
  contacts,
  organizations,
  reports,
} from '@/actions/Dashboard/DashboardIndexController'
import { Icon, type IconName } from '@/components/ui/atoms/Icon'
import { Text } from '@/components/ui/atoms/Text'
import { useSidebar } from '@/components/ui/molecules/Sidebar/useSidebar'
import { Collapsible } from '@/components/ui/atoms/Collapsible'
import { account } from '@/actions/Account/SettingsController'
import { dashboard } from '@/actions/Dashboard/DashboardIndexController'
import { teamPage } from '@/actions/Account/TeamController'
import { billingPage } from '@/actions/Account/BillingController'
import { PageProps } from '@/types'

function SectionLabel({ label, icon }: { label: string; icon?: IconName }) {
  return (
    <>
      {icon ? <Icon name={icon} size='normal' color='sidebar' /> : null}
      <Text.H5 color='sidebar'>{label}</Text.H5>
    </>
  )
}

type Section = {
  name: string
  url: WayfinderUrl
  iconName?: IconName
}
export function Sections() {
  const sidebar = useSidebar()
  const isCollapsed = sidebar.state === 'collapsed'
  const {
    url: currentPath,
    props: {
      auth: { role },
    },
  } = usePage<PageProps>()
  const isAdmin = role === 'admin'
  const sections = useMemo<Section[]>(
    () => [
      {
        name: 'Dashboard',
        url: dashboard.url({ currentPath, exactMatch: true }),
        iconName: 'circleGauge',
      },
      {
        name: 'Organizations',
        url: organizations.url({ currentPath }),
        iconName: 'building',
      },
      {
        name: 'Contacts',
        url: contacts.url({ currentPath }),
        iconName: 'users',
      },
      {
        name: 'Reports',
        url: reports.url({ currentPath }),
        iconName: 'printer',
      },
    ],
    [currentPath],
  )
  const settings = useMemo<Section[]>(
    () => [
      ...(isAdmin
        ? [
            {
              name: 'General',
              url: account.url({ currentPath, exactMatch: true }),
            },
          ]
        : []),
      {
        name: 'Team',
        url: teamPage.url({ currentPath }),
      },
      ...(isAdmin
        ? [
            {
              name: 'Billing',
              url: billingPage.url({ currentPath }),
            },
          ]
        : []),
    ],
    [currentPath, isAdmin],
  )

  const insideAccount = account.url({ currentPath })
  const [accountOpen, setAccountOpen] = useState<boolean>(
    insideAccount.isCurrent,
  )

  return (
    <SidebarGroup>
      <SidebarGroupLabel label='Your account' />
      <SidebarMenu>
        {sections.map((section) => (
          <SidebarMenuItem key={section.name}>
            <SidebarMenuButton
              asChild
              isActive={section.url.isCurrent}
              tooltip={isCollapsed ? section.name : undefined}
            >
              <Link href={section.url.path}>
                <SectionLabel label={section.name} icon={section.iconName} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <Collapsible
            asChild
            open={accountOpen}
            onOpenChange={setAccountOpen}
            trigger={
              <SidebarMenuButton tooltip={isCollapsed ? 'Settings' : undefined}>
                <SectionLabel label='Settings' icon='settings' />
                <Icon
                  name='chevronRight'
                  className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
                />
              </SidebarMenuButton>
            }
          >
            <SidebarMenuSub>
              {settings.map((setting) => (
                <SidebarMenuSubItem key={setting.name}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={setting.url.isCurrent}
                  >
                    <Link href={setting.url.path}>
                      <SectionLabel label={setting.name} />
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </Collapsible>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
