import { Avatar } from '@/components/ui/atoms/Avatar'
import { Dropdown, DropdownMenuTrigger } from '@/components/ui/atoms/Dropdown'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/molecules/Sidebar'
import { useSidebar } from '@/components/ui/molecules/Sidebar/useSidebar'
import { useMemo } from 'react'
import { PageProps, User } from '@/types'
import { router, usePage } from '@inertiajs/react'
import { Icon } from '@/components/ui/atoms/Icon'
import { Text } from '@/components/ui/atoms/Text'
import { MenuOption } from '@/components/ui/atoms/Dropdown/types'
import { deleteMethod } from '@/actions/Auth/SessionsController'
import { myProfile } from '@/actions/Profile/ProfileController'

function UserProfile({
  user: { name, email, initials, avatar_thumb: avatar },
}: {
  user: User
}) {
  return (
    <>
      <Avatar
        src={avatar}
        altText={name}
        fallback={{
          text: initials,
          bgColor: 'sidebarPrimary',
          color: 'white',
        }}
      />
      <div className='grid'>
        <Text.H5 ellipsis noWrap overrideLineHeight='none'>
          {name}
        </Text.H5>
        <Text.H6 color='foregroundMuted' ellipsis noWrap>
          {email}
        </Text.H6>
      </div>
    </>
  )
}

export function SidebarSettings() {
  const { isMobile } = useSidebar()
  const {
    auth: { user },
  } = usePage<PageProps>().props
  const options = useMemo<MenuOption[]>(() => {
    return [
      {
        type: 'label',
        padding: 'none',
        children: (
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <UserProfile user={user} />
          </div>
        ),
      },
      { type: 'separator' },
      {
        type: 'group',
        items: [
          {
            type: 'item',
            inset: true,
            label: 'My Profile',
            onClick: () => {
              router.get(myProfile.url().path)
            },
          },
          {
            type: 'item',
            icon: { name: 'logOut' },
            variant: 'destructive',
            label: 'Log out',
            onClick: () => {
              router.delete(deleteMethod().url)
            },
          },
        ],
      },
    ]
  }, [user])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown
          side={isMobile ? 'bottom' : 'right'}
          align='end'
          width='auto'
          sideOffset={4}
          options={options}
          trigger={
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <UserProfile user={user} />
                <Icon name='chevronsUpDown' className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
