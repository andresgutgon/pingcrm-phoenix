import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className='p-3 bg-pink-500 h-screen w-full'>
      <header>HEADER</header>
      <article>{children}</article>
    </main>
  )
}
