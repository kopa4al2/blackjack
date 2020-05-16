const ATTEMPT_CONNECTION = 'ATTEMPT_CONNECTION'
const SET_SOCKET = 'SET_SOCKET'
const STOP_CONNECTION = 'STOP_CONNECTION'
const CONNECTION_ERROR = 'CONNECTION_ERROR'
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED'

export const openSocket = {
  type: ATTEMPT_CONNECTION,
}

export const setSocket = socket => ({
  type: SET_SOCKET,
  payload: socket,
})

export const receivedMessage = message => ({
  type: MESSAGE_RECEIVED,
    payload:message,
})

export const connectionError = error => ({
  type: CONNECTION_ERROR,
  payload: error,
})

export const closeSocket = {
  type: STOP_CONNECTION,
}

const initialState = {
  instance: null,
  isConnecting: false,
  messages: [],
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ATTEMPT_CONNECTION:
      return {
        ...state,
        isConnecting: true,
      }
    case STOP_CONNECTION:
      return {
        ...state,
        instance: null,
      }
    case SET_SOCKET: {
      return {
        ...state,
        isConnecting: false,
        instance: payload,
      }
    }
    case MESSAGE_RECEIVED:
      return {
        ...state,
        messages: state.messages.concat(payload)
      }
    case CONNECTION_ERROR:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}