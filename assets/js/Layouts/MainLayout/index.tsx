import { Head } from '@inertiajs/react'
import MainMenu from '@/components/Menu/MainMenu'
import FlashMessages from '@/components/Messages/FlashMessages'
import { TopHeader } from '@/components/Header/TopHeader'
import { SubHeader } from '@/components/Header/SubHeader'

interface MainLayoutProps {
  title?: string
  children: React.ReactNode
}

export default function MainLayout({ title, children }: MainLayoutProps) {
  return (
    <>
      <Head title={title} />
      <div className='flex flex-col'>
        <div className='flex flex-col h-screen'>
          <div className='md:flex'>
            <TopHeader />
            <SubHeader />
          </div>
          <div className='flex flex-grow overflow-hidden'>
            <MainMenu className='flex-shrink-0 hidden w-56 overflow-y-auto bg-indigo-800 md:block' />
            {/**
             * We need to scroll the content of the page, not the whole page.
             * So we need to add `scroll-region="true"` to the div below.
             *
             * [Read more](https://inertiajs.com/pages#scroll-regions)
             */}
            <div
              className='w-full px-4 py-8 overflow-hidden overflow-y-auto md:p-12 flex flex-col gap-y-8'
              scroll-region='true'
            >
              <FlashMessages />
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
