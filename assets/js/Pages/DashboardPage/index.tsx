import MainLayout from '@/Layouts/MainLayout'

function DashboardPage() {
  return (
    <>
      <h1 className='mb-8 text-3xl font-bold'>Dashboard</h1>
      <p className='mb-12 leading-normal'>
        Hey there! Welcome to Ping CRM, a demo app designed to help illustrate
        how
        <a
          className='mx-1 text-indigo-600 underline hover:text-orange-500'
          href='https://inertiajs.com'
          target='_blank'
        >
          Inertia.js
        </a>
        works with
        <a
          className='ml-1 text-indigo-600 underline hover:text-orange-500'
          target='_blank'
          href='https://react.dev/'
        >
          React
        </a>
        .
      </p>
    </>
  )
}

/**
 * Persistent Layout (Inertia.js)
 *
 * [Learn more](https://inertiajs.com/pages#persistent-layouts)
 */
DashboardPage.layout = (page: React.ReactNode) => (
  <MainLayout title='Dashboard' children={page} />
)

export default DashboardPage
