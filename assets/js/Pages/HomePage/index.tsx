import { Link } from '@/components/Link'
import { Nomination, PageProps } from '@/types'

type Props = PageProps & {
  nominations: Nomination[]
}

export default function HomePage({ nominations }: Props) {
  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-4xl mx-auto bg-white shadow-sm rounded-2xl p-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-pink-100 text-xs text-pink-800 font-semibold uppercase tracking-wider shadow-xs rounded-t-xl'>
                <th className='px-4 py-3 text-left rounded-tl-xl'>#</th>
                <th className='px-4 py-3 text-left'>Name</th>
                <th className='px-4 py-3 text-left'>Age</th>
                <th className='px-4 py-3 text-left'>Gender</th>
                <th className='px-4 py-3 text-left'>Movie</th>
                <th className='px-4 py-3 text-left'>Year</th>
                <th className='px-4 py-3 text-left rounded-tr-xl'>Won</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {nominations.map((nom) => (
                <tr key={nom.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-3 text-gray-600'>
                    <Link to='/nominations/:id' params={{ id: nom.id }}>
                      {nom.id}
                    </Link>
                  </td>
                  <td className='px-4 py-3 font-medium text-gray-900'>
                    {nom.name}
                  </td>
                  <td className='px-4 py-3 text-gray-600'>{nom.age}</td>
                  <td className='px-4 py-3 text-gray-600'>{nom.gender}</td>
                  <td className='px-4 py-3 text-gray-600'>{nom.movie}</td>
                  <td className='px-4 py-3 text-gray-600'>{nom.year}</td>
                  <td className='px-4 py-3 text-gray-900'>
                    {nom.won ? '🏆' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
