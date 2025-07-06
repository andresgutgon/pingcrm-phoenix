import { ReactNode } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import ChangePassword from '@/Pages/ProfilePage/components/ChangePassword'

function ProfilePage() {
  return (
    <div className='xl:max-w-1/2'>
      <h1 className='mb-8 text-3xl font-bold'>My profile</h1>
      <ChangePassword />
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
