import axios from 'axios'
import { AUTH_TOKEN } from 'reducers/auth'
import {
  API_CALL_FAILED_RESPONSE,
  API_CALL_SUCCESS,
  API_CALL_TIMEOUT,
  API_CALL_UNKNOWN_ERROR,
  API_CALL_STARTED,
} from 'reducers/api'

const API_SERVER = 'http://localhost'
const API_PORT = '5858'
const API_URL = `${API_SERVER}:${API_PORT}/`

class BaseAPI {

  constructor () {
    this.initialize()
  }

  initialize = () => {
    const store = require('reduxStore').default
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

    this.api.interceptors.request.use(req => {
      const token = localStorage.getItem(AUTH_TOKEN)
      if (token) {
        req.headers['Authorization'] = 'Bearer ' + token
      }
      store.dispatch({ type: API_CALL_STARTED })
      return req
    })

    this.api.interceptors.response.use(success => {
      const { data, status, statusText } = success
      store.dispatch({
        type: API_CALL_SUCCESS,
        payload: { result: { ...data }, status, statusText },
      })
      return Promise.resolve({ ...data })
    }, error => {
      const { response, request } = error
      if (response) {
        const { data, status, statusText } = response
        store.dispatch({
          type: API_CALL_FAILED_RESPONSE,
          payload: { ...data, status, statusText },
        })
        return Promise.reject({ ...data })
      } else if (request) {
        store.dispatch({ type: API_CALL_TIMEOUT, payload: { error: 'Request timeout!'} })
        return Promise.reject({ error: 'Request timeout!' })
      } else {
        store.dispatch({ type: API_CALL_UNKNOWN_ERROR, error })
        return Promise.reject(error)
      }
    })
  }

  get = (url, options) => this.api.get(url, options)

  post = (url, data, options) => this.api.post(url, data, options)
}

export default BaseAPI