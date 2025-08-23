import { Dropdown, DropdownMenuTrigger } from '@/components/ui/atoms/Dropdown'
import { useForm, usePage } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/molecules/Sidebar'
import { Icon } from '@/components/ui/atoms/Icon'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar } from '@/components/ui/atoms/Avatar'
import { Text } from '@/components/ui/atoms/Text'
import { PageProps } from '@/types'
import { useCallback, useMemo } from 'react'
import { MenuOption } from '@/components/ui/atoms/Dropdown/types'
import {
  changeAccount,
  setDefaultAccount,
} from '@/actions/Profile/ProfileController'
import { SwitchInput } from '@/components/ui/atoms/Switch/index'
import { useSidebar } from '@/components/ui/molecules/Sidebar/useSidebar'

function AccountProfile({
  account,
}: {
  account: PageProps['auth']['account']
}) {
  return (
    <>
      {/* Ideally add logo to workspaces so it can be put here. */}
      <Avatar
        fallback={{
          text: account.initials,
          bgColor: 'sidebarPrimary',
          color: 'white',
        }}
        altText={account.name}
      />
      <div className='min-w-0 flex flex-col'>
        <Text.H5M noWrap ellipsis>
          {account.name}
        </Text.H5M>
        {account.is_default ? (
          <Text.H6 color='foregroundMuted' noWrap ellipsis>
            Default account
          </Text.H6>
        ) : null}
      </div>
    </>
  )
}

export function OrganizationSwitcher() {
  const isMobile = useIsMobile()
  const sidebar = useSidebar()
  const form = useForm()
  const {
    auth: { account, accounts },
  } = usePage<PageProps>().props
  const onChangeAccount = useCallback(
    (accountId: number) => () => {
      form.submit(changeAccount(accountId))
    },
    [form],
  )
  const onToggleDefault = useCallback(
    (checked: boolean) => {
      if (!checked) return
      form.submit(setDefaultAccount(account.id), {
        preserveScroll: true,
      })
    },
    [form, account],
  )
  const options = useMemo<MenuOption[]>(
    () => [
      {
        type: 'label',
        children: (
          <div className='flex flex-row items-center gap-x-2'>
            <AccountProfile account={account} />
          </div>
        ),
      },
      { type: 'separator' },
      {
        type: 'label',
        children: (
          <SwitchInput
            checked={account.is_default}
            disabled={account.is_default}
            onCheckedChange={onToggleDefault}
            name='default_account'
            label='Default account'
            info='The default accont is the one loaded when you open the app on a new browser or device.'
          />
        ),
      },
      { type: 'separator' },
      { type: 'label', children: 'Other accounts' },
      ...accounts
        .filter((a) => a.id !== account.id)
        .map<MenuOption>((account) => ({
          type: 'item',
          value: account.id,
          label: account.name,
          onClick: onChangeAccount(account.id),
        })),
    ],
    [accounts, onChangeAccount, account, onToggleDefault],
  )

  if (accounts.length <= 1) {
    return (
      <div
        className={cn('flex flex-row items-center gap-x-2', {
          'p-2': sidebar.state === 'expanded',
        })}
      >
        <AccountProfile account={account} />
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown
          trigger={
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className={cn(
                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                )}
              >
                <AccountProfile account={account} />
                <Icon name='chevronsUpDown' className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          }
          side={isMobile ? 'bottom' : 'right'}
          sideOffset={4}
          align='start'
          width='auto'
          options={options}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
