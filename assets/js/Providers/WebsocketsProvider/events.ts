import { StorageUploadChannel } from '@/hooks/storage/websocketEvents'

type CamelCase<S extends string> = S extends `${infer Head}_${infer Rest}`
  ? `${Capitalize<Head>}${CamelCase<Rest>}`
  : Capitalize<S>

export type WebsocketEvents<T> = {
  [P in keyof T & string as `on${CamelCase<P>}`]?: (detail: T[P]) => void
}

export type Channels = StorageUploadChannel

export type UseChannelArgs<TChannel extends keyof Channels> = {
  channel: TChannel
  topic: string
} & WebsocketEvents<Channels[TChannel]>
