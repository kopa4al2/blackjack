import React, { useState } from 'react'
import AuthAPI from 'api/AuthAPI'

const RegisterPage = () => {
  const [loginInput, changeLoginInput] = useState('')
  const [passInput, changePassInput] = useState('')

  function register () {
    const json = JSON.stringify({
      login: loginInput,
      pass: passInput,
    })

    // TODO: Go through store with reducer
    new AuthAPI().register(json).then(() => {

    })
  }

  return (
    <div>
      <input
        type='text'
        placeholder='login'
        value={loginInput}
        onChange={e => changeLoginInput(e.target.value)}
      />
      <input
        type='text'
        placeholder='password'
        value={passInput}
        onChange={e => changePassInput(e.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  )
}

export default RegisterPage
