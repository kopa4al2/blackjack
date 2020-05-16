import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Loading } from 'components'
import { login } from 'reducers/auth'

const AuthPage = ({ location: { search }, history: { push } }) => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(({ auth }) => ({
    isLoading: auth.isLoading,
  }))

  const [loginInput, changeLoginInput] = useState('')
  const [passInput, changePassInput] = useState('')

  function attemptLogin () {
    const json = JSON.stringify({
      login: loginInput,
      pass: passInput,
    })

    dispatch(login(json)).then(() => {
      if (search && search.includes('redirect')) {
        const redirectedFrom = search.replace('?redirect=', '')
        push(redirectedFrom)
      }
    })
  }

  return (
    <div>
      {isLoading && <Loading/>}
      <input
        type='text'
        placeholder='login'
        value={loginInput}
        onChange={e => changeLoginInput(e.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={passInput}
        onChange={e => changePassInput(e.target.value)}
      />
      <button
        onClick={attemptLogin}>Login
      </button>
    </div>
  )
}

export default withRouter(AuthPage)
