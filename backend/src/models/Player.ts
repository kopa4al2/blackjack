import { Document, Schema, model } from 'mongoose';
import Card from 'blackjack/game-models/Card';
import DatabaseModel from './DatabaseModel';
import Lobby from './Lobby';

/**
 * When an User connects to the gameSocket it becomes a player
 */
export interface IPlayer extends Document, DatabaseModel {
    _id: String,
    name: String,
    cards: Card[],
    bet: Number,
    balance: Number,
    currentLobby: String;
}

const PlayerSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    cards: [{ suit: String, value: String }],
    bet: {
        type: Number,
        required: false,
    },
    balance: {
        type: Number,
        required: true,
    },
    currentLobby: {
        type: Schema.Types.ObjectId,
        ref: 'Lobby',
        required: false,
    }
});

PlayerSchema.pre('remove', function(next) {
    Lobby.updateOne(
        { _id: this.currentLobby },
        { $pull: { players: this._id } })
        .exec();
    next();
})

const Player = model<IPlayer>('Player', PlayerSchema);

export default Player