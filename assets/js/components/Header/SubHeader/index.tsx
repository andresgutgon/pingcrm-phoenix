import { useState } from 'react'
import { PageProps } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import { deleteMethod } from '@/actions/UserSessionController'

export function SubHeader() {
  const { auth } = usePage<PageProps>().props
  const [menuOpened, setMenuOpened] = useState(false)
  return (
    <div className='flex items-center justify-between w-full p-4 text-sm bg-white border-b md:py-0 md:px-12 d:text-md'>
      <div className='mt-1 mr-4 text-xl font-medium'>
        {auth.user.account.name}
      </div>
      <div className='relative'>
        <div
          className='flex items-center cursor-pointer select-none group'
          onClick={() => setMenuOpened(true)}
        >
          <div className='mr-1 text-gray-800 whitespace-nowrap group-hover:text-indigo-600 focus:text-indigo-600'>
            <span>{auth.user.firstName}</span>
            <span className='hidden ml-1 md:inline'>{auth.user.lastName}</span>
          </div>
          <ChevronDown
            size={20}
            className='text-gray-800 group-hover:text-indigo-600'
          />
        </div>
        <div className={menuOpened ? '' : 'hidden'}>
          <div className='absolute top-0 right-0 left-auto z-20 py-2 mt-8 text-sm whitespace-nowrap bg-white rounded shadow-xl'>
            <Link
              href='#todo-implement-edit-profile'
              className='block px-6 py-2 hover:bg-indigo-600 hover:text-white'
              onClick={() => setMenuOpened(false)}
            >
              My Profile
            </Link>
            <Link
              href='#todo-implement-manage-users'
              className='block px-6 py-2 hover:bg-indigo-600 hover:text-white'
              onClick={() => setMenuOpened(false)}
            >
              Manage Users
            </Link>
            <Link
              as='button'
              href={deleteMethod().url}
              method='delete'
              className='block w-full px-6 py-2 text-left focus:outline-none hover:bg-indigo-600 hover:text-white'
            >
              Logout
            </Link>
          </div>
          <div
            onClick={() => {
              setMenuOpened(false)
            }}
            className='fixed inset-0 z-10 bg-black opacity-25'
          ></div>
        </div>
      </div>
    </div>
  )
}
