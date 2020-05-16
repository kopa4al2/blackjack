import Card from './Card';
import { IPlayer } from 'models/Player';

class PlayerSerializable {
    cards: Card[];
    name: String;
    bet: Number;
    balance: Number;

    constructor(player: IPlayer) {
        const { name, balance, bet, cards } = player;
        this.name = name;
        this.balance = balance;
        this.bet = bet;
        this.cards = cards;
    }
}

export default PlayerSerializable