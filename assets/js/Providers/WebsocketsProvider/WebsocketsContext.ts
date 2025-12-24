import { createContext } from 'react'
import { Socket, Channel } from 'phoenix'

export type SocketContextValue = {
  socket: Socket | null
  getChannel: (topic: string) => Channel
  releaseChannel: (topic: string) => void
}

export const SocketContext = createContext<SocketContextValue | null>(null)
