/**
 * Reducer for managing the current API call state
 * (is there an error, is another request in progress)
 */

export const API_CALL_FAILED_RESPONSE = 'API_CALL_FAILED_RESPONSE'
export const API_CALL_TIMEOUT = 'API_CALL_TIMEOUT'
export const API_CALL_UNKNOWN_ERROR = 'API_CALL_UNKNOWN_ERROR'
export const API_CALL_SUCCESS = 'API_CALL_SUCCESS'
export const API_CALL_STARTED = 'API_CALL_STARTED'

const initialState = {}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case API_CALL_STARTED:
      return {
        ...state,
        isLoading: true,
      }

    //TODO:
    case API_CALL_UNKNOWN_ERROR:
    case API_CALL_TIMEOUT:
    case API_CALL_FAILED_RESPONSE:
    case API_CALL_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
      }
    default:
      return state
  }
}