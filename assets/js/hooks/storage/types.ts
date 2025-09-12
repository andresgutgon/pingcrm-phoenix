import { FormDataConvertible, FormDataKeys } from '@inertiajs/core'
import { InertiaFormProps } from '@inertiajs/react'
import { RouteDefinition } from '@/wayfinder'

export type FormDataType = Record<string, FormDataConvertible>

type BaseProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
> = {
  form: InertiaFormProps<TForm>
  field: Field
  onUploadError?: (error: Error) => void
}

export type MultipartFormProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
> = BaseProps<TForm, Field> & {
  mode: 'multipart_form'
}

export type UploaderGeneric = string | number
export type UploaderArguments<Uploader extends UploaderGeneric> = {
  uploader: Uploader
  entity_id: string | number
}

export type DirectUploadProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends UploaderGeneric,
  TUploaderArgs extends UploaderArguments<TUploader>,
> = BaseProps<TForm, Field> & {
  mode: 'direct_upload'
  uploaderArgs: TUploaderArgs
  signUrlBuilder: (uploader: TUploaderArgs) => RouteDefinition<'post'>
  storeUrlBuilder: (uploader: TUploaderArgs) => RouteDefinition<'post'>
}

export type SignerResult = { url: string; key: string }

export type UploadStatus =
  | 'uploading'
  | 'storing'
  | 'completed'
  | 'canceled'
  | 'error'

type BaseUploadReturn = {
  handleUpload: (files: FileList | null) => void
  handleRemove: () => void
  preview: string | undefined
  setPreview: (preview: string | undefined) => void
}

export type MultipartUploadReturn = BaseUploadReturn
export type DirectUploadReturn = BaseUploadReturn & {
  progress: number
  uploadStatus: UploadStatus | null
  isPending: boolean
  cancelUpload: () => void
}

export type UseUploadProps<
  TForm extends FormDataType,
  Field extends FormDataKeys<TForm>,
  TUploader extends UploaderGeneric,
  TUploaderArgs extends UploaderArguments<TUploader>,
> =
  | MultipartFormProps<TForm, Field>
  | DirectUploadProps<TForm, Field, TUploader, TUploaderArgs>
