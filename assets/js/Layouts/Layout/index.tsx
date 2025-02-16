import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main style={{ height: '100vh', width: '100%' }} className='bg-yellow-400'>
      <header>HEADER</header>
      <article>{children}</article>
    </main>
  )
}
