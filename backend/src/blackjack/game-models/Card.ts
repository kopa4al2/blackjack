export enum Suits {
    SPADES = 'spades',
    HEARTS = 'hearts',
    DIAMONDS = 'diamonds',
    CLUBS = 'clubs',
    FACE_DOWN = 'faceDown'
}

export enum Values {
    ACE = 'a',
    KING = 'k',
    QUEEN = 'q',
    JACK = 'j',
    TEN = '10',
    NINE = '9',
    EIGHT = '8',
    SEVEN = '7',
    SIX = '6',
    FIVE = '5',
    FOUR = '4',
    THREE = '3',
    TWO = '2',
    FACE_DOWN = 'faceDown',
}

export default class Card {
    suit: Suits;
    value: Values;

    constructor(value: Values, suit: Suits) {
        this.suit = suit;
        this.value = value;
    }


}