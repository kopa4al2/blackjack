import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLobbies } from 'reducers/game'
import useSocket from 'hooks/useSocket'

const GamePage = () => {
  const dispatch = useDispatch()
  const socket = useSocket()

  const { lobbies, currentLobby, askForBets, askToPlay } = useSelector(({ game, gameActions }) => ({
    lobbies: game.lobbies,
    currentLobby: game.currentLobby,
    askForBets: gameActions.askForBets,
    askToPlay: gameActions.askToPlay,
  }))

  useEffect(() => {
    dispatch(getLobbies())
  }, [dispatch])

  const joinLobby = lobby => {
    socket.send('joinLobby', lobby)
  }

  const leaveLobby = () => {
    socket.send('leaveLobby')
  }

  const renderLobbies = () => lobbies.map(lobby => (
    <button key={lobby._id}
            onClick={() => joinLobby(lobby._id)}>lobby._id</button>
  ))

  const renderLobby = () => {
    return (
      <>
        <button onClick={leaveLobby}>Leave</button>
      </>
    )
  }

  return (
    <div>
      {
        currentLobby
          ? renderLobby()
          : renderLobbies()
      }
      {askToPlay && <button onClick={() => socket.send('confirmPlay')}>Confirm</button>}
    </div>
  )
}

export default GamePage