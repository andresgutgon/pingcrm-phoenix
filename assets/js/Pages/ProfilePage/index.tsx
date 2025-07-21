import { ReactNode } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import ChangePassword from '@/Pages/ProfilePage/components/ChangePassword'
import ChangeEmail from '@/Pages/ProfilePage/components/ChangeEmail'
import EditProfile from '@/Pages/ProfilePage/components/EditProfile'

function ProfilePage() {
  return (
    <div className='xl:max-w-1/2'>
      <h1 className='mb-8 text-3xl font-bold'>My profile</h1>
      <div className='flex flex-col gap-y-4'>
        <EditProfile />
        <ChangeEmail />
        <ChangePassword />
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
