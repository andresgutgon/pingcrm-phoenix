import cx from 'classnames'

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
}

export default function LoadingButton({
  loading,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className={cx(
        'flex items-center justify-center',
        'focus:outline-none',
        {
          'pointer-events-none bg-opacity-75 select-none': loading,
        },
        className,
      )}
      {...props}
    >
      {loading && <div className='mr-2 btn-spinner' />}
      {children}
    </button>
  )
}
