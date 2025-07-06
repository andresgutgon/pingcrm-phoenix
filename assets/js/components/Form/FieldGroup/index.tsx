import { ReactNode } from 'react'

export default function FieldGroup({
  label,
  name,
  description,
  error,
  children,
}: {
  name?: string
  label?: string
  error?: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-gray-800 select-none' htmlFor={name}>
          {label}
        </label>
      )}
      {children}
      {description && (
        <div className='text-gray-600 text-sm'>{description}</div>
      )}
      {error && <div className='text-red-500 text-sm'>{error}</div>}
    </div>
  )
}
