import { ReactNode } from 'react'
import { Tabs } from '@/components/ui/atoms/Tabs'
import AppLayout from '@/Layouts/AppLayout'
import ChangePassword from './components/ChangePassword'
import ChangeEmail from './components/ChangeEmail'
import EditProfile from './components/EditProfile'

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
    <div className='mx-auto pt-16 w-full @xl/appLayout:w-2/3'>
      <div className='flex flex-col gap-y-4'>
        <Tabs<TabValue> options={SECTIONS} defaultValue='editProfile'>
          <Tabs.Content value='editProfile'>
            <EditProfile />
          </Tabs.Content>
          <Tabs.Content value='changeEmail'>
            <ChangeEmail />
          </Tabs.Content>
          <Tabs.Content value='changePassword'>
            <ChangePassword />
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  )
}

ProfilePage.layout = (page: ReactNode) => (
  <AppLayout
    title='Profile Settings'
    children={page}
    breadcrumbs={[{ label: 'Profile Settings' }]}
  />
)

export default ProfilePage
