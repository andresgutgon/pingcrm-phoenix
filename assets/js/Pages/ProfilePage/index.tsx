import { ReactNode } from 'react'
import MainLayout from '@/Layouts/MainLayout'

function ProfilePage() {
  return (
    <>
      <h1 className='mb-8 text-3xl font-bold'>My profile</h1>
    </>
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
