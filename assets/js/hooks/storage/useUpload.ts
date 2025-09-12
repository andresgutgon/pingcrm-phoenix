import {
  useCallback,
  useMemo,
  useState,
  useRef,
  useTransition,
  useEffect,
} from 'react'
import { FormDataKeys, FormDataValues } from '@inertiajs/core'
import { AbortError, makeJsonRequest, makeRequest } from '@/lib/makeFetch'
import {
  FormDataType,
  MultipartFormProps,
  MultipartUploadReturn,
  UploaderGeneric,
  UploaderArguments,
  DirectUploadProps,
  DirectUploadReturn,
  UseUploadProps,
  UploadStatus,
  SignerResult,
} from './types'

// Function overloads for proper typing
export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
>(props: MultipartFormProps<TForm, Field>): MultipartUploadReturn

export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends UploaderGeneric,
  TUploaderArgs extends
  UploaderArguments<TUploader> = UploaderArguments<TUploader>,
>(
  props: DirectUploadProps<TForm, Field, TUploader, TUploaderArgs>,
): DirectUploadReturn

/**
 * FIXME: Inertia.js form should not be part of this hook
 * We should let the user manage this and expose callbacks
 */
export function useUpload<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends UploaderGeneric,
  TUploaderArgs extends
  UploaderArguments<TUploader> = UploaderArguments<TUploader>,
>(
  props: UseUploadProps<TForm, Field, TUploader, TUploaderArgs>,
): MultipartUploadReturn | DirectUploadReturn {
  const { form, field, onUploadError, mode } = props
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

      // TODO: Implement multi file handling
      const file = files[0]

      // TODO:: Implement uploadType: 'image' | 'video' | 'audio' | 'file'
      // Not all needs a preview
      setPreview(URL.createObjectURL(file))
      if (mode === 'multipart_form') return

      setUploadStatus('uploading')
      setProgress(0)
      cancelUpload()

      startTransition(async () => {
        safeAssign(file)
        setPreview(URL.createObjectURL(file))
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        try {
          const signUrl = props.signUrlBuilder(props.uploaderArgs).url
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
            onUploadError?.(error)
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
            onUploadError?.(error)
            setPreview(undefined)
            return
          } else {
            setUploadStatus('completed')
          }

          setProgress(0) // Reset progress to reset animation
          setUploadStatus('storing')
          const storeUrl = props.storeUrlBuilder(props.uploaderArgs).url
          await makeJsonRequest({
            url: storeUrl,
            options: {
              method: 'POST',
              body: JSON.stringify({ key }),
            },
          })
        } finally {
          // Always clean up the abort controller
          abortControllerRef.current = null
        }
      })
    },
    [mode, props, safeAssign, onUploadError, cancelUpload, startTransition],
  )

  const handleRemove = useCallback(() => {
    cancelUpload()
    setPreview(undefined)
  }, [cancelUpload])

  useEffect(() => {
    return () => {
      // On unmount, cancel any ongoing upload
      cancelUpload()
    }
  }, [cancelUpload])

  return useMemo(() => {
    const baseReturn = {
      handleUpload,
      handleRemove,
      preview,
      setPreview,
    }

    if (mode === 'multipart_form') return baseReturn

    return {
      ...baseReturn,
      progress,
      uploadStatus,
      isPending,
      cancelUpload,
    }
  }, [
    handleUpload,
    // FIXME: Move this out of here
    // Removing the attachment is not uploader responsability
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
