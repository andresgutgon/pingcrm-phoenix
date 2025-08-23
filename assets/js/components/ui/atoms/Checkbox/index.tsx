import { FormField, FormFieldProps } from '@/components/ui/atoms/FormField'
import { CheckboxAtom, CheckedState, type CheckboxAtomProps } from './Primitive'

export type CheckboxProps = CheckboxAtomProps & Omit<FormFieldProps, 'children'>

export function Checkbox({
  label,
  info,
  description,
  compactDescription,
  error,
  fullWidth,
  ...props
}: CheckboxProps) {
  return (
    <FormField
      inline
      label={label}
      info={info}
      description={description}
      compactDescription={compactDescription}
      error={error}
      fullWidth={fullWidth}
    >
      <CheckboxAtom {...props} />
    </FormField>
  )
}

export { type CheckedState }
