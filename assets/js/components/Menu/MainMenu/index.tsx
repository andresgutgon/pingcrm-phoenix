import { CircleGauge } from 'lucide-react'
import MainMenuItem from './Item'

// TODO: Implement this:
// <MainMenuItem
//   text='Organizations'
//   link='organizations'
//   icon={<Building size={20} />}
// />
// <MainMenuItem
//   text='Contacts'
//   link='contacts'
//   icon={<Users size={20} />}
// />
// <MainMenuItem
//   text='Reports'
//   link='reports'
//   icon={<Printer size={20} />}
// />
export default function MainMenu({ className }: { className?: string }) {
  return (
    <div className={className}>
      <MainMenuItem
        text='Dashboard'
        link='/'
        icon={<CircleGauge size={20} />}
      />
    </div>
  )
}
