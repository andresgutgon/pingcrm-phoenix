import { toast as sonnerToast } from 'sonner'
import { type ToastProps, Toast } from './Primitives'

export function showToast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      shadow
      id={id}
      variant={toast.variant}
      title={toast.title}
      width='normal'
      description={toast.description}
      button={toast.button}
    />
  ))
}
