import * as mongoose from 'mongoose';
import DatabaseModel from './DatabaseModel';
import { AvailableStates, GameState } from 'blackjack/state-machine/GameStateContext';
import { IPlayer } from './Player';

const Schema = mongoose.Schema;

export interface ILobby extends Lobby {
    players: IPlayer[];
    observers: IPlayer[]
}

interface Lobby extends mongoose.Document, DatabaseModel {
    _id: String,
    minBet: Number,
    maxPlayers: Number,
    description: String,
    name: String,
    currentState: String
}

const LobbySchema = new Schema({
    name: String,
    description: String,
    minBet: {
        type: Number,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
    },
    players: [ {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    } ],
    observers: [ {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    } ],
    currentState: {
        type: String,
        enum: Object.values(AvailableStates),
        required: true,
    }
});

const Lobby = mongoose.model<ILobby>('Lobby', LobbySchema);

export default Lobby