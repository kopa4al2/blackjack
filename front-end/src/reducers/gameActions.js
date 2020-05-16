export const ASK_TO_PLAY = 'ASK_TO_PLAY'
export const ASK_TO_PLAY_FINISHED = 'ASK_TO_PLAY_FINISHEd'
export const ASK_FOR_BETS = 'ASK_FOR_BETS'
export const ASK_FOR_BETS_FINISHED = 'ASK_FOR_BETS'

const initialState = {
  askForBets: false,
  askToPlay: false,
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case ASK_TO_PLAY:
      return {
       ...state,
       askToPlay: true,
      }
    case ASK_TO_PLAY_FINISHED:
      return {
        ...state,
        askToPlay: false,
      }
    case ASK_FOR_BETS:
      return {
        ...state,
        askForBets: true,
      }
    case ASK_FOR_BETS_FINISHED:
      return {
        ...state,
        askForBets: false,
      }
    default: return state
  }
}