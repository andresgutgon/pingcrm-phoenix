import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Channel } from 'phoenix'
import { Channels, UseChannelArgs } from './events'
import { SocketContext } from '@/Providers/WebsocketsProvider/WebsocketsContext'

type OnMessageHandler<Payload> = (payload: Payload) => void

/**
 * This convert a handler prop name (e.g. onNewMessage)
 * to an event name (e.g. new_message)
 */
function convertHandlerPropToEvent(handler: string) {
  return handler
    .slice(2) // drop "on"
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .slice(1)
}

export function useChannel<TChannel extends keyof Channels>(
  args: UseChannelArgs<TChannel>,
) {
  const websockets = use(SocketContext)
  const { channel, topic, ...handlers } = args
  const channelRef = useRef<Channel | null>(null)
  const [joined, setJoined] = useState(false)
  const handlersMap = useMemo(() => {
    const hanldersKeys = Object.keys(handlers) as Array<keyof typeof handlers>
    return hanldersKeys.reduce((acc, key) => {
      const maybeHandler = handlers[key]
      if (maybeHandler && typeof maybeHandler !== 'function') return acc

      const handler = maybeHandler as (...args: unknown[]) => void
      const event = convertHandlerPropToEvent(key as string)

      acc.set(event, handler)
      return acc
    }, new Map<string, OnMessageHandler<unknown>>())
  }, [handlers])

  const onJoined = useCallback(() => {
    setJoined(true)
  }, [])
  useEffect(() => {
    // Mounted on provider. Never null but TS...
    if (!websockets) return

    const fullTopic = `${channel}:${topic}`
    const socketChannel = websockets.getChannel(fullTopic)
    const eventHandlers = new Map<string, (payload: unknown) => void>()
    handlersMap.forEach((handler, event) => {
      const wrappedHandler = (payload: unknown) => {
        handler(payload)
      }
      eventHandlers.set(event, wrappedHandler)
      socketChannel.on(event, wrappedHandler)
    })

    if (socketChannel.state === 'joined') {
      onJoined()
    }

    return () => {
      websockets.releaseChannel(fullTopic)
    }
  }, [channel, topic, handlersMap, onJoined, websockets])

  return useMemo(() => ({ joined, channel: channelRef.current }), [joined])
}
