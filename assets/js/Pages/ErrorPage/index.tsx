import { PageProps } from '@/types'
import { Head } from '@inertiajs/react'

type ErrorPageProps = PageProps<{
  status: number
  title: string
  description: string
}>

/**
 * Alternative way to get the status code using the `usePage` hook.
 *
 * `const { status } = usePage().props;`
 *
 * [Read more](https://inertiajs.com/error-handling)
 */
export default function ErrorPage({
  title,
  description,
  status: _s,
}: ErrorPageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen p-5 text-indigo-100 bg-indigo-800'>
      <Head title={title}>
        <meta name='robots' content='noindex' />
        <meta name='description' content={description} />
      </Head>
      <div className='w-full max-w-md'>
        <h1 className='text-3xl'>{title}</h1>
        <p className='mt-3 text-lg leading-tight'>{description}</p>
      </div>
    </div>
  )
}
