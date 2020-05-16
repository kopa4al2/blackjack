import GameAPI from 'api/GameAPI'

export const UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO'
export const UPDATE_CURRENT_LOBBY = 'UPDATE_CURRENT_LOBBY'
export const GAME_ERROR = 'GAME_ERROR'

const GET_SOCKET_HEADERS = 'GET_SOCKET_HEADERS'
const GET_LOBBIES = 'GET_LOBBIES'

export const getHeaders = () => dispatch => {
  const gameApi = new GameAPI()
  gameApi.getHeaders().then(headers => {
    dispatch({ type: GET_SOCKET_HEADERS, payload: headers })
  })
}

export const getLobbies = () => dispatch => {
  const gameApi = new GameAPI()
  gameApi.getLobbies().then(lobbies => {
    dispatch({ type: GET_LOBBIES, payload: lobbies })
  })
}

const initialState = {
  headers: {},
  lobbies: [],
  player: {},
  currentLobby: null,
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_SOCKET_HEADERS:
      return {
        ...state,
        headers: payload,
      }
    case GET_LOBBIES:
      return {
        ...state,
        lobbies: Object.values(payload),
      }
    case UPDATE_PLAYER_INFO:
      return {
        ...state,
        player: payload,
      }
    case UPDATE_CURRENT_LOBBY:
      return {
        ...state,
        currentLobby: payload,
      }
    case GAME_ERROR:
      return {
        ...state,
        error: payload,
      }
    default: return state
  }
}