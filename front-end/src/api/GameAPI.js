import BaseAPI from './BaseAPI'

class GameAPI extends BaseAPI {

  getHeaders = () => this.get('game/headers')

  getLobbies = () => this.get('game/lobbies')

  getLobby = lobbyId => this.get('/game/lobby/?l=' + lobbyId)
}

export default GameAPI