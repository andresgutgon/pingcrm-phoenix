import { CircleGauge, Building, Users, Printer } from 'lucide-react'
import { MainMenuItem } from './Item'
import { usePage } from '@inertiajs/react'

import {
  contacts,
  home,
  organizations,
  reports,
} from '@/actions/DashboardController'

export default function MainMenu({ className }: { className?: string }) {
  const { url: currentPath } = usePage()
  return (
    <div className={className}>
      <MainMenuItem
        text='Dashboard'
        link={home.url({ currentPath, exactMatch: true })}
        icon={<CircleGauge size={20} />}
      />
      <MainMenuItem
        text='Organizations'
        link={organizations.url({ currentPath })}
        icon={<Building size={20} />}
      />
      <MainMenuItem
        text='Contacts'
        link={contacts.url({ currentPath })}
        icon={<Users size={20} />}
      />
      <MainMenuItem
        text='Reports'
        link={reports.url({ currentPath })}
        icon={<Printer size={20} />}
      />
    </div>
  )
}
