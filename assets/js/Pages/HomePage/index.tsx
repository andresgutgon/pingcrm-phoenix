import { login } from '@/actions/Auth/SessionsController'
import { Button } from '@/components/ui/atoms/Button'
import { Text } from '@/components/ui/atoms/Text'
import { Link } from '@inertiajs/react'

function HomePage() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-y-4'>
      <div className='flex flex-col items-center'>
        <Text.H1>Welcome to the Home Page</Text.H1>
        <Text.H3 color='foregroundMuted'>Ugly as fuck page</Text.H3>
      </div>
      <Link href={login.url().path}>
        <Button variant='default'>Login</Button>
      </Link>
    </div>
  )
}

export default HomePage
