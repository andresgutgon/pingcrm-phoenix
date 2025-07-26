import { ReactNode } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import ChangePassword from '@/Pages/ProfilePage/components/ChangePassword'
import ChangeEmail from '@/Pages/ProfilePage/components/ChangeEmail'
import EditProfile from '@/Pages/ProfilePage/components/EditProfile'
import { Tabs } from '@/components/ui/atoms/Tabs'

const TABS = {
  editProfile: 'editProfile',
  changeEmail: 'changeEmail',
  changePassword: 'changePassword',
}

const SECTIONS = [
  {
    label: 'Edit Profile',
    value: TABS.editProfile,
  },
  {
    label: 'Change Email',
    value: TABS.changeEmail,
  },
  {
    label: 'Change Password',
    value: TABS.changePassword,
  },
]

type TabValue = (typeof TABS)[keyof typeof TABS]

function ProfilePage() {
  return (
    <div className='xl:max-w-1/2'>
      <h1 className='mb-8 text-3xl font-bold'>My profile</h1>
      <div className='flex flex-col gap-y-4'>
        <Tabs<TabValue> options={SECTIONS} defaultValue='editProfile'>
          <Tabs.Content value={TABS.editProfile}>
            <EditProfile />
          </Tabs.Content>
          <Tabs.Content value={TABS.changeEmail}>
            <ChangeEmail />
          </Tabs.Content>
          <Tabs.Content value={TABS.changePassword}>
            <ChangePassword />
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  )
}

/**
 * Persistent Layout (Inertia.js)
 *
 * [Learn more](https://inertiajs.com/pages#persistent-layouts)
 */
ProfilePage.layout = (page: ReactNode) => (
  <MainLayout title='My Profile' children={page} />
)

export default ProfilePage
