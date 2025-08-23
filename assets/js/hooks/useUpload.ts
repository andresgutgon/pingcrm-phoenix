import { useCallback, useMemo, useState, useRef, useTransition } from 'react'
import {
  FormDataConvertible,
  FormDataKeys,
  FormDataValues,
} from '@inertiajs/core'
import { InertiaFormProps } from '@inertiajs/react'
import { RouteDefinition } from '@/wayfinder'
import { AbortError, makeJsonRequest, makeRequest } from '@/lib/makeFetch'

type FormDataType = Record<string, FormDataConvertible>

type BaseProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
> = {
  form: InertiaFormProps<TForm>
  field: Field
  onRemoveAttachment?: () => void
  onError?: (error: Error) => void
}

type MultipartFormProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
> = BaseProps<TForm, Field> & {
  mode: 'multipart_form'
}

type DirectUploadProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends string,
> = BaseProps<TForm, Field> & {
  mode: 'direct_upload'
  uploader: TUploader
  signUrlBuilder: (uploader: TUploader) => RouteDefinition<'post'>
}

type SignerResult = { url: string; key: string }

type UploadStatus =
  | 'uploading'
  | 'validating'
  | 'completed'
  | 'canceled'
  | 'error'

type BaseUploadReturn = {
  handleUpload: (files: FileList | null) => void
  handleRemove: () => void
  preview: string | undefined
  setPreview: (preview: string | undefined) => void
}

type MultipartUploadReturn = BaseUploadReturn
type DirectUploadReturn = BaseUploadReturn & {
  progress: number
  uploadStatus: UploadStatus | null
  isPending: boolean
  cancelUpload: () => void
}

export type UseUploadProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends string,
> =
  | MultipartFormProps<TForm, Field>
  | DirectUploadProps<TForm, Field, TUploader>

// Function overloads for proper typing
export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
>(props: MultipartFormProps<TForm, Field>): MultipartUploadReturn

export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends string,
>(props: DirectUploadProps<TForm, Field, TUploader>): DirectUploadReturn

export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends string,
>(
  props: UseUploadProps<TForm, Field, TUploader>,
): MultipartUploadReturn | DirectUploadReturn {
  const { form, field, onRemoveAttachment, onError, mode } = props
  const [preview, setPreview] = useState<string | undefined>(
    (form.data[field] as string) ?? undefined,
  )
  const [progress, setProgress] = useState<number>(0)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null)
  const [isPending, startTransition] = useTransition()
  const abortControllerRef = useRef<AbortController | null>(null)

  const safeAssign = useCallback(
    (file: File | string | undefined) => {
      form.setData(field, file as unknown as FormDataValues<TForm, Field>)
    },
    [form, field],
  )

  const cancelUpload = useCallback(() => {
    if (!abortControllerRef.current) return

    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }, [])

  const handleUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      setPreview(URL.createObjectURL(file))

      setUploadStatus('uploading')
      setProgress(0)
      cancelUpload()

      startTransition(async () => {
        if (mode === 'multipart_form') {
          safeAssign(file)
          setPreview(URL.createObjectURL(file))
        } else {
          abortControllerRef.current = new AbortController()
          const signal = abortControllerRef.current.signal

          try {
            const signUrl = props.signUrlBuilder(props.uploader).url
            const signResult = await makeJsonRequest<SignerResult>({
              url: signUrl,
              options: {
                method: 'POST',
                body: JSON.stringify({
                  filename: file.name,
                  content_type: file.type,
                }),
              },
              signal,
            })

            if (!signResult.ok) {
              const error = signResult.error as Error
              setProgress(0)
              setUploadStatus('error')
              onError?.(error)
              setPreview(undefined)
              return
            }

            const { url, key } = signResult.unwrap()
            const uploadResult = await makeRequest({
              url,
              options: {
                method: 'PUT',
                headers: {
                  'Content-Type': file.type,
                },
                body: file,
              },
              signal,
              onUploadProgress: (uploadProgress) => {
                setProgress(uploadProgress)
              },
            })

            if (uploadResult.error) {
              if (uploadResult.error instanceof AbortError) {
                setUploadStatus('canceled')
                setPreview(undefined)
                safeAssign(undefined)
                return
              }

              const error = uploadResult.error as Error

              setUploadStatus('error')
              onError?.(error)
              setPreview(undefined)
              return
            } else {
              setUploadStatus('completed')
            }

            setUploadStatus('validating')
            /* console.log('SIGNER DATA', { url, key }) */

            // DO the backend abstraction here.
            // This can not be just like this
            // We need to really verify the backend validations
            // are enforced; Mimetype, size, etc.
            safeAssign(key)

            // TODO: After this, user should call form.submit() to validate and assign
            // The validation phase will be handled by the backend endpoint
            setProgress(100)
          } finally {
            // Always clean up the abort controller
            abortControllerRef.current = null
          }
        }
      })
    },
    [mode, props, safeAssign, onError, cancelUpload, startTransition],
  )

  const handleRemove = useCallback(() => {
    cancelUpload()
    setPreview(undefined)
    safeAssign(undefined)

    if (form.data[field] && onRemoveAttachment) {
      onRemoveAttachment()
    }
  }, [form, field, cancelUpload, safeAssign, onRemoveAttachment])

  return useMemo(() => {
    const baseReturn = {
      handleUpload,
      handleRemove,
      preview,
      setPreview,
    }

    // Only include progress, uploadStatus, isPending, and cancelUpload for direct_upload mode
    if (mode === 'direct_upload') {
      return {
        ...baseReturn,
        progress,
        uploadStatus,
        isPending,
        cancelUpload,
      }
    }

    return baseReturn
  }, [
    handleUpload,
    handleRemove,
    preview,
    setPreview,
    cancelUpload,
    isPending,
    mode,
    progress,
    uploadStatus,
  ])
}
