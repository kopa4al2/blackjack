import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const errorQueue = []
const Notifier = () => {
  const [currentError, setCurrentError] = useState(null)
  const { gameError, apiError } = useSelector(({ game, api }) => ({
    gameError: game.error,
    apiError: api.error,
  }))

  useEffect(() => {
    if (apiError) {
      setCurrentError('API ERROR\n' + apiError)
    }
    if (gameError) {
      setCurrentError('GAME ERROR\n' + gameError)
    }

    setTimeout(() => setCurrentError(null), 2000)
  }, [gameError, apiError])

  if (!currentError) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      background: 'red',
    }}>
      {currentError}
    </div>
  )
}

export default Notifier