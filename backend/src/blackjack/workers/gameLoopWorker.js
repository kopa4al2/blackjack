const { parentPort } = require('worker_threads')
const LobbySerializable = require('blackjack/game-models/LobbySerializable').default;
const GameStateContext = require('blackjack/state-machine/GameStateContext').default
const { ClientHeader } = require('socket/Message')
const { sleep } = require('utils/TimeoutUtils')
const UserCommunicator = require('./UserCommunicator').default
const {
  WorkerResponse,
  WorkerResponseType,
  WorkerCommandType,
} = require('./WorkerMessageTypes')

parentPort.onmessage = function (evt) {
  const { data } = evt
  parseMessage(data)
}

// Worker variables
let userCommunicator // transfers messages to the user :UserCommunicator
let lobbyStateContext // manages the game state :GameStateContext
let workerID // id of the worker (usually the name of the lobby) :String

function parsePlayerCommand (data) {
  const { header, payload, sender } = data
  console.log('Player command')
  console.log(payload)
  switch (header) {
    case ClientHeader.joinLobby: {
      lobbyStateContext.lobby.observers.push(payload)
    }
      break
    case ClientHeader.leaveLobby: {
      // TODO: Remove player and handle edge cases (it is the player's turn now)
      lobbyStateContext.lobby.players.forEach(p => {
      })
    }
      break
    case ClientHeader.confirmPlay: {
      lobbyStateContext.lobby.observers =
        lobbyStateContext.lobby.observers.filter(p => p.name !== sender.name)
      lobbyStateContext.lobby.players.push(sender)
    }
      break
    default:
      console.log('Unknown command ' + header)
  }
}

function parseMessage (message) {
  const { command, data } = message
  try {
    switch (+command) {
      case WorkerCommandType.startLoop: {
        const lobby = data
        Object.setPrototypeOf(lobby, LobbySerializable.prototype)
        workerID = lobby.name
        userCommunicator = new UserCommunicator(parentPort)
        lobbyStateContext = new GameStateContext(lobby, userCommunicator)
        lobbyStateContext.start()
      }
        break
      case WorkerCommandType.playerCommand:
        parsePlayerCommand(data)
        break
      default :
        console.log(`Unrecognized command sent to worker: ${command}`)
    }
  } catch (err) {
    console.log(err)
  }
}