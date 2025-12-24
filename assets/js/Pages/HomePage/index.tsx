import { login } from '@/actions/Auth/SessionsController'
import { Button } from '@/components/ui/atoms/Button'
import { Text } from '@/components/ui/atoms/Text'
import { useHost } from '@/hooks/useHost'

function HomePage() {
  const { buildAppUrl } = useHost()
  const loginUrl = buildAppUrl({ path: login.url().path })
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-y-4'>
      <div className='flex flex-col items-center'>
        <Text.H1>Welcome to the Home Page</Text.H1>
        <Text.H3 color='foregroundMuted'>Ugly as fuck page</Text.H3>
      </div>
      <a href={loginUrl}>
        <Button variant='default'>Login</Button>
      </a>
    </div>
  )
}

export default HomePage
