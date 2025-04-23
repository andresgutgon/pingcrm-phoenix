import { ReactNode } from 'react'

export default function FieldGroup({
  label,
  name,
  error,
  children,
}: {
  name?: string
  label?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-gray-800 select-none' htmlFor={name}>
          {label}:
        </label>
      )}
      {children}
      {error && <div className='text-red-500 text-sm'>{error}</div>}
    </div>
  )
}
