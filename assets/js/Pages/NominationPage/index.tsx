import { Link } from '@/components/Link'
import { PageProps, Nomination } from '../../types'

type Props = PageProps & {
  nomination: Nomination
}
export default function NominationPage({ nomination }: Props) {
  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-2xl mx-auto bg-white shadow rounded-2xl p-8'>
        <Link to='/' className='text-pink-500 hover:text-pink-700 mb-4 block'>
          &larr; Back to Nominations
        </Link>
        <h1 className='text-2xl font-bold mb-4 text-pink-700'>
          🏆 {nomination.name}
        </h1>
        <ul className='text-gray-700 space-y-2'>
          <li>
            <strong>Age:</strong> {nomination.age}
          </li>
          <li>
            <strong>Gender:</strong> {nomination.gender}
          </li>
          <li>
            <strong>Movie:</strong> {nomination.movie}
          </li>
          <li>
            <strong>Year:</strong> {nomination.year}
          </li>
          <li>
            <strong>Won:</strong>{' '}
            {nomination.won ? <span className='text-yellow-500'>🏆</span> : '—'}
          </li>
        </ul>
      </div>
    </div>
  )
}
