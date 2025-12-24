type UploadStatus = 'ready' | 'processing' | 'failed'

type Payload<T extends UploadStatus> = T extends 'ready'
  ? {
      field: string
      entity_id: string
      entity_type: string
      entity_data: Record<string, unknown>
    }
  : T extends 'processing'
    ? { progress: number }
    : T extends 'failed'
      ? { error: string }
      : never

export type UploaderEvents<T extends UploadStatus = UploadStatus> = {
  uploader_status_changed: {
    entity_id: string
    entity_type: string
    status: T
    payload: Payload<T>
  }
}

export type StorageUploadChannel = {
  'storage:direct_upload': UploaderEvents
}
