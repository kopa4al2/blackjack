import { sleep } from 'utils/TimeoutUtils';
import { PLAYERS_BET_TIME, PLAYERS_JOIN_TIME } from 'utils/GameConstants';
import LobbySerializable from '../game-models/LobbySerializable';
import PlayerSerializable from '../game-models/PlayerSerializable';
import { IUserCommunicator } from '../workers/UserCommunicator';
import { ClientHeader } from '../../socket/Message';
import { Values } from '../game-models/Card';


export enum AvailableStates {
    AskToPlay = 'AskToPlay',
    TakeBets = 'TakeBets',
    DealCards = 'DealCards',
    Paused = 'Paused',
    PlayersTurn = 'PlayersTurn',
}

export abstract class GameState {

    abstract playState(): void;

    protected stateContext: GameStateContext;

    public constructor(stateContext: GameStateContext) {
        this.stateContext = stateContext
    }
}

/**
 * Ask every player from the observers if they want to start playing
 */
class AskToPlay extends GameState {
    async playState() {
        this.stateContext.lobby.observers.forEach((p: PlayerSerializable) => {
            this.stateContext.userCommunicator.askToPlay(p.name);
        });
        await sleep(PLAYERS_JOIN_TIME);
        console.log(this.stateContext.lobby.name);
        console.log('Changing state to take bets');
        this.stateContext.currentState = this.stateContext.takeBets;
        this.stateContext.currentState.playState();
    }
}

/**
 * Ask every player for their bet
 */
class TakeBets extends GameState {
    async playState() {
        this.stateContext.lobby.players.forEach((p: PlayerSerializable) => {
            console.log(`Asking bets from: ${ p }`);
            console.log(p);
            console.log('---------------------')
            this.stateContext.userCommunicator.askForBets(p.name);
        });

        await sleep(PLAYERS_BET_TIME);
        console.log(this.stateContext.lobby.name);
        console.log('Changing state to deal cards');
        this.stateContext.currentState = this.stateContext.dealCards;
        this.stateContext.currentState.playState();
    }
}

/**
 * Initial state of the lobby, and also the state if there are no players
 */
class Paused extends GameState {
    playState(): void {
        this.stateContext.currentState = this.stateContext.askToPlay;
        this.stateContext.currentState.playState();
        console.log(this.stateContext.lobby.name);
        console.log('Changing state to ask to play');
    }
}

/**
 * Dealing the cards, asking for insurances and handling Natural (dealer blackjack)
 */
class DealCards extends GameState {
    playState(): void {
        const { lobby, userCommunicator } = this.stateContext;
        const { dealer, players } = lobby;

        // Deal two cards to every player
        for (let i = 0; i < 2; i++) {
            const dealerCard = lobby.drawRandomCard();
            userCommunicator.dealerReceivedCard(dealerCard, lobby.getAllNames(), i % 2 === 0);
            dealer.cards.push(dealerCard);
            players.forEach((p: PlayerSerializable) => {
                const playerCard = lobby.drawRandomCard();
                const otherPlayers = lobby.getAllNames().filter((name: String) => name !== p.name);
                userCommunicator.playerReceivedCard(playerCard, p.name, otherPlayers, i % 2 === 0);
                p.cards.push(playerCard);
            })
        }

        // The second card
        if (dealer.cards[1].value === Values.ACE) {
            userCommunicator.askAllToMakeDecision(lobby.getPlayerNames(), [ClientHeader.insurance])
        }

        this.stateContext.currentState = this.stateContext.playersTurn;
    }
}

/**
 * Each player get to hit/split/double/surrender
 */
class PlayersTurn extends GameState {
    playState(): void {
        const { lobby, userCommunicator } = this.stateContext;

        // TODO:
        lobby.players.forEach((p: PlayerSerializable) => {
            userCommunicator.askToMakeDecision(p.name, [ ClientHeader.hit, ClientHeader.double, ClientHeader.surrender ]);
        })
    }
}


export default class GameStateContext {
    lobby: LobbySerializable;
    currentState: GameState;
    userCommunicator: IUserCommunicator;

    askToPlay: AskToPlay;
    takeBets: TakeBets;
    dealCards: DealCards;
    paused: Paused;
    playersTurn: PlayersTurn;

    constructor(lobby: LobbySerializable, userCommunicator: IUserCommunicator) {
        this.userCommunicator = userCommunicator;
        this.lobby = lobby;
        this.askToPlay = new AskToPlay(this);
        this.takeBets = new TakeBets(this);
        this.dealCards = new DealCards(this);
        this.paused = new Paused(this);
        this.playersTurn = new PlayersTurn(this);
        this.getStateFromString(lobby.currentState);
    }

    start() {
        this.currentState.playState();
    }

    getStateFromString(stateName: String): void {
        switch (stateName) {
            case AvailableStates.Paused:
                this.currentState = this.paused;
                break;
            case AvailableStates.AskToPlay:
                this.currentState = this.askToPlay;
                break;
            case AvailableStates.DealCards:
                this.currentState = this.dealCards;
                break;
            case AvailableStates.TakeBets:
                this.currentState = this.takeBets;
                break;
            case AvailableStates.PlayersTurn:
                this.currentState = this.playersTurn;
                break;
            default:
                throw new Error(`Invalid state provided ${ stateName }`)
        }
    }
}
