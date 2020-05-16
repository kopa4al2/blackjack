import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getHeaders } from 'reducers/game'
import { AUTH_TOKEN } from 'reducers/auth'
import {
  connectionError,
  openSocket,
  receivedMessage,
  setSocket,
} from '../reducers/socket'
import SocketMessage from '../socket/SocketMessage'

const token = localStorage.getItem(AUTH_TOKEN)
const query = '/?t=' + token
const SOCKET_SERVER_PORT = process.env.SOCKET_PORT || 5858
const SOCKET_SERVER = 'ws://localhost:' + SOCKET_SERVER_PORT + query

const INITIAL_RETRY_INTERVAL = 256
let timeout
let retryInterval = INITIAL_RETRY_INTERVAL
const useSocket = () => {
  const dispatch = useDispatch()

  const {
    headers,
    socket,
    isConnecting,
    messages,
    currentLobby,
  } = useSelector(({ game, socket }) => ({
    headers: game.headers,
    socket: socket.instance,
    isConnection: socket.isConnecting,
    messages: socket.messages,
    currentLobby: game.currentLobby,
  }))

  useEffect(() => {
    if (!isOpen() && !isConnecting) {
      connect()
    }
    dispatch(getHeaders())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function connect () {
    dispatch(openSocket)
    const websocket = new WebSocket(SOCKET_SERVER)

    if (websocket.readyState === WebSocket.CLOSED) {
      dispatch(connectionError('Connection refused, server is down'))
      return
    }

    websocket.onopen = () => {
      console.log('Socket opened')
      dispatch(setSocket(websocket))
      retryInterval = INITIAL_RETRY_INTERVAL
    }

    websocket.onclose = e => {
      console.log('Socket closed, attempting reconnect in %s ms.',
        retryInterval)
      if (timeout) clearInterval(timeout)
      setTimeout(connect, retryInterval)
      retryInterval = retryInterval * 2
    }

    websocket.onmessage = message => {
      const { data } = message
      dispatch(receivedMessage(data))
    }

    websocket.onerror = e => {
      dispatch(connectionError(e))
    }
  }

  function send (header, data) {
    if (isOpen()) {
      if (headers[header]) {
        let message = new SocketMessage(header, data)
        if (currentLobby)
          message = new SocketMessage(header, data, currentLobby._id)

        socket.send(JSON.stringify(message))
      } else
        console.warn('Invalid header provided', header)
    }
  }

  const isOpen = () => socket && socket.readyState === WebSocket.OPEN

  return {
    send,
    messages,
  }
}

export default useSocket