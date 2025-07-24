import { ReactNode } from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { account } from '@/actions/Account/SettingsController'

function TeamPage() {
  return (
    <>
      <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
        <div className='bg-muted/50 aspect-video rounded-xl' />
        <div className='bg-muted/50 aspect-video rounded-xl' />
        <div className='bg-muted/50 aspect-video rounded-xl' />
      </div>
      <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
    </>
  )
}

TeamPage.layout = (children: ReactNode) => (
  <AppLayout
    title='Team'
    children={children}
    breadcrumbs={[
      {
        label: 'Account',
        href: account.url().path,
      },
      { label: 'Team' },
    ]}
  />
)

export default TeamPage
