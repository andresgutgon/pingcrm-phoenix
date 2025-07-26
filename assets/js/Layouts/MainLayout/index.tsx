import { ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import { ThemeProvider } from 'next-themes'
import MainMenu from '@/components/Menu/MainMenu'
import { TopHeader } from '@/components/Header/TopHeader'
import { SubHeader } from '@/components/Header/SubHeader'
import { Button } from '@/components/ui/atoms/Button'
import { showToast } from '@/components/ui/atoms/Toast'
import { Toaster } from '@/components/ui/atoms/Toast/Primitives'

export default function MainLayout({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
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
              <Button
                onClick={() => {
                  showToast({
                    title: 'This is a headless toast',
                    description:
                      'You have full control of styles and jsx, while still having the animations.',
                    button: {
                      label: 'Action',
                      onClick: () => {
                        console.log('CLICK on Toast Action')
                      },
                    },
                  })
                }}
              >
                Render toast
              </Button>
              {children}
              <Toaster position='bottom-right' />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
