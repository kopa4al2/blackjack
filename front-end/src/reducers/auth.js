import AuthAPI from 'api/AuthAPI'

export const AUTH_TOKEN = 'auth_token'
const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAIL = 'LOGIN_FAIL'

const LOGOUT = 'LOGOUT'

// const TOKEN_EXPIRED = 'TOKEN_EXPIRED'

export const login = credentials => dispatch => {
  const API = new AuthAPI()

  dispatch({ type: ATTEMPT_LOGIN })
  return new Promise((resolve, reject) => {
    API.login(credentials).then(res => {
      const { user, token } = res
      localStorage.setItem(AUTH_TOKEN, token)
      dispatch({ type: LOGIN_SUCCESS, payload: user })
      resolve()
    }).catch(err => {
      dispatch({ type: LOGIN_FAIL, payload: err })
      reject()
    })
  })
}

// Since there is an interceptor, that adds the token
// to header if needed, no need to pass it to request
export const isLoggedIn = () => dispatch => {
  const API = new AuthAPI()

  const token = localStorage.getItem(AUTH_TOKEN)
  if (!token) {
    return dispatch({ type: LOGIN_FAIL })
  }

  dispatch({ type: ATTEMPT_LOGIN })

  API.checkToken(token).then(res => {
    const { user } = res
    if (user)
      return dispatch({ type: LOGIN_SUCCESS, payload: { ...user } })
    else {
      localStorage.removeItem(AUTH_TOKEN)
      return dispatch({ type: LOGIN_FAIL })
    }
  })
}

export const logout = () => {
  const API = new AuthAPI()

  const token = localStorage.getItem(AUTH_TOKEN)
  // noinspection JSIgnoredPromiseFromCall
  API.logout({ token }).then(() => {
    localStorage.removeItem(AUTH_TOKEN)
  })
  return { type: LOGOUT }
}

const initialState = {}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case ATTEMPT_LOGIN:
      return {
        ...state,
        isLoading: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        ...payload,
        isLoading: false,
      }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}