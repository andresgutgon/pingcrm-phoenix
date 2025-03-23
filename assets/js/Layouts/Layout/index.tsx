import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className='min-h-screen bg-pink-50 text-gray-800'>
      <header className='bg-pink-600 text-white px-6 py-4 shadow-md'>
        <div className='max-w-6xl mx-auto flex items-center justify-between'>
          <h1 className='text-xl font-bold'>🎬 Oscar Dashboard</h1>
        </div>
      </header>

      <article className='max-w-6xl mx-auto px-6 py-8'>{children}</article>
    </main>
  )
}
