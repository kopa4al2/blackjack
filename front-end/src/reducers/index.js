import { combineReducers } from 'redux'
import api from './api'
import auth from './auth'
import game from './game'
import gameActions from './gameActions'
import socket from './socket'

const reducers = combineReducers({
  api,
  auth,
  game,
  gameActions,
  socket,
})

export default reducers
