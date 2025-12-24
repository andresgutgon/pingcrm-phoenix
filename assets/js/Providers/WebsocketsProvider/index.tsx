import { ReactNode, useMemo, useRef } from 'react'
import { Channel } from 'phoenix'
import { showToast } from '@/components/ui/atoms/Toast'
import { initSocket } from './socket'
import { SocketContext, SocketContextValue } from './WebsocketsContext'

export function WebsocketsProvider({
  authToken,
  children,
}: {
  authToken: string
  children: ReactNode
}) {
  const channelsRef = useRef<
    Map<string, { channel: Channel; refCount: number }>
  >(new Map())
  const socket = useMemo(() => initSocket({ authToken }), [authToken])

  const value = useMemo<SocketContextValue>(
    () => ({
      socket,
      getChannel: (topic: string) => {
        const existing = channelsRef.current.get(topic)
        if (existing) {
          existing.refCount++
          return existing.channel
        }

        const channel = socket.channel(topic, {})
        channel.join()
        channel.onError((err) => {
          showToast({
            variant: 'destructive',
            title: 'WebSocket Error',
            description: `Channel error on ${topic}: ${JSON.stringify(err)}`,
          })
        })

        channelsRef.current.set(topic, { channel, refCount: 1 })
        return channel
      },
      releaseChannel: (topic: string) => {
        const entry = channelsRef.current.get(topic)
        if (!entry) return

        entry.refCount--
        if (entry.refCount <= 0) {
          entry.channel.leave()
          channelsRef.current.delete(topic)
        }
      },
    }),
    [socket],
  )

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
