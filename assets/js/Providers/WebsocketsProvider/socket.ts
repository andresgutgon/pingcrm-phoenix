import { Socket } from 'phoenix'

let socket: Socket | null = null
let currentToken: string | null = null

export function initSocket({ authToken }: { authToken: string }) {
  if (socket && currentToken === authToken) {
    return socket
  }

  socket = new Socket('/socket', { params: { token: authToken } })

  socket.connect()
  currentToken = authToken
  return socket
}
