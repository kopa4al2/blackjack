
export default class SocketMessage {
  #header
  #payload
  #lobbyId

  // If there is no lobbyId, payload is the lobbyId
  constructor (header, payload, lobbyId) {
    if (!header)
      throw new Error('Must specify header')
    this.header = header
    this.payload = payload
    this.lobbyId = lobbyId
  }
}
