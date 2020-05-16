import { MESSAGE_RECEIVED } from 'reducers/socket'
import GameAPI from '../api/GameAPI'
import {
  GAME_ERROR,
  UPDATE_CURRENT_LOBBY,
  UPDATE_PLAYER_INFO,
} from 'reducers/game'
import {
  ASK_FOR_BETS,
  ASK_FOR_BETS_FINISHED,
  ASK_TO_PLAY, ASK_TO_PLAY_FINISHED,
} from 'reducers/gameActions'

export default store => next => async action => {
  const { type, payload } = action
  const { getState, dispatch } = store
  const { game: { headers } } = getState()
  if (type === MESSAGE_RECEIVED) {
    const gameApi = new GameAPI()
    const { header, payload: message } = JSON.parse(payload)
    console.group('Received message')
    console.log(header)
    console.log(message)
    console.groupEnd()
    if (headers && headers[header]) {
      switch (header) {
        case 'playerInfo':
          if (message.currentLobby) {
            const currentLobby = await gameApi.getLobby(message.currentLobby)
            dispatch({ type: UPDATE_CURRENT_LOBBY, payload: currentLobby })
          } else {
            dispatch({ type: UPDATE_CURRENT_LOBBY, payload: null })
          }
          dispatch({ type: UPDATE_PLAYER_INFO, payload: message })
          break
        case 'failure':
          dispatch({ type: GAME_ERROR, payload: message })
          break
        case 'askToPlay':
          dispatch({ type: ASK_TO_PLAY })
          // TODO: maybe not this kind of logic
          setTimeout(() => {
            dispatch({ type: ASK_TO_PLAY_FINISHED })
          }, 10000)
          break
        case 'askForBets':
          dispatch({ type: ASK_FOR_BETS })
          // TODO: maybe not this kind of logic
          setTimeout(() => {
            dispatch({ type: ASK_FOR_BETS_FINISHED })
          }, 10000)
          break
        default:
          next(action)
      }
      action.payload = message
    } else {
      console.warn('Invalid header received: %s', type)
    }
  }

  next(action)
}