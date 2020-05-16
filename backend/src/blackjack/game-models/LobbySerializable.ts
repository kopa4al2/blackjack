import { ILobby } from 'models/Lobby';
import { IPlayer } from 'models/Player';
import { NUMBER_OF_DECKS_PER_LOBBY } from 'utils/GameConstants';
import PlayerSerializable from './PlayerSerializable';
import Deck from './Deck';
import Card from './Card';
import Dealer from './Dealer';

export default class LobbySerializable {

    players: PlayerSerializable[];
    observers: PlayerSerializable[];
    currentPlayer: PlayerSerializable;
    minBet: Number;
    name: String;
    currentState: String;
    dealer: Dealer;
    decks: Card[] = [];

    constructor(lobby: ILobby) {
        const { players, observers, minBet, name, currentState } = lobby;

        this.players = players.map((p: IPlayer) => new PlayerSerializable(p));
        this.observers = observers.map((p: IPlayer) => new PlayerSerializable(p));
        this.minBet = minBet;
        this.name = name;
        this.currentState = currentState;

        this.dealer = new Dealer();

        for (let i = 0; i < NUMBER_OF_DECKS_PER_LOBBY; i++) {
            this.decks.push(...new Deck().cards);
        }
    }

    drawRandomCard(): Card {
        return this.decks[Math.floor(Math.random() * (this.decks.length + 1))];
    }

    /**
     * Get the names of all players and observers
     */
    getAllNames(): String[] {
        return [ ...this.getPlayerNames(), ...this.getObserverNames() ];
    }

    /**
     * Get the names of all players who play
     */
    getPlayerNames(): String[] {
        return this.players.map((p: PlayerSerializable) => p.name);
    }

    /**
     * Get the names of all observers
     */
    getObserverNames(): String[] {
        return this.observers.map((p: PlayerSerializable) => p.name);
    }
}