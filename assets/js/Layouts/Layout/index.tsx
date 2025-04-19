import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className='min-h-screen text-gray-800'>
      <article className='max-w-6xl mx-auto px-6 py-8'>{children}</article>
    </main>
  )
}
