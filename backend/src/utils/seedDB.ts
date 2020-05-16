import Lobby from 'models/Lobby'
import { AvailableStates } from '../blackjack/state-machine/GameStateContext';

export default () => {
    Lobby.find({}).then(lobbies => {
        if (lobbies.length === 0) {
            createLobbies()
        }
    })
}

function createLobbies() {
    const lobbyOne = new Lobby({
        minBet: 10,
        maxPlayers: 9,
        players: [],
        description: 'Low bet high players lobby',
        name: 'Lobby One',
        currentState: AvailableStates.Paused
    });
    const lobbyTwo = new Lobby({
        minBet: 100,
        maxPlayers: 2,
        players: [],
        description: 'High bet low players lobby',
        name: 'Lobby Two',
        currentState: AvailableStates.Paused
    });

    lobbyOne.save();
    lobbyTwo.save();
}