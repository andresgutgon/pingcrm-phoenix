import { toast as sonnerToast } from 'sonner'
import { type ToastProps, Toast } from './Primitives'

export function showToast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={toast.button}
    />
  ))
}

