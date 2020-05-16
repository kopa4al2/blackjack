import { ClientHeader, ServerHeader } from 'socket/Message';
import Card, { Suits, Values } from 'blackjack/game-models/Card';
import { WorkerResponse, WorkerResponseType } from './WorkerMessageTypes';

export interface IUserCommunicator {
    /**
     * Ask the player to place his bet
     * @param playerName the name of the player to ask
     */
    askForBets(playerName: String): void;

    /**
     * Ask the player if he wants to play in the next round
     * @param playerName the player to ask
     */
    askToPlay(playerName: String): void;

    /**
     * Tell the player its his turn to play, ask the player to make a decision
     * @param player the player whose turn it is
     * @param availableDecisions array with available options (hit,split,double, etc...)
     */
    askToMakeDecision(player: String, availableDecisions: ClientHeader[]): void;

    /**
     * Tell all players to make decision
     * @param playersToAsk array with all players to ask
     * @param availableDecisions array of available decisions
     */
    askAllToMakeDecision(playersToAsk: String[], availableDecisions: ClientHeader[]): void;


    /**
     * Card was dealt to the dealer, notify the players about it
     * @param dealerCard the card that the dealer received
     * @param playersToNotify the players that need to be notified
     * @param isFaceUp is the card face up
     */
    dealerReceivedCard(dealerCard: Card, playersToNotify: String[], isFaceUp: boolean): void;

    /**
     * Card dealt to a player, notify the player about the card and others that the card was dealt
     * @param playerCard the card that the player received
     * @param player the player that received the card
     * @param playersToNotify other players from the game
     * @param isFaceUp is the card face up or not
     */
    playerReceivedCard(playerCard: Card, player: String, playersToNotify: String[], isFaceUp: boolean): void;

}

export default class UserCommunicator implements IUserCommunicator {
    parentPort;

    constructor(parentPort) {
        this.parentPort = parentPort;
    }

    tunnelToPlayer(data) {
        const response = new WorkerResponse(WorkerResponseType.tunnel, data);
        this.parentPort.postMessage(response)
    }

    askForBets(playerName): void {
        this.tunnelToPlayer(
            {
                message: { header: ServerHeader.takeBet, payload: '' },
                to: playerName,
            })
    }

    askToPlay(playerName): void {
        this.tunnelToPlayer({
            message: { header: ServerHeader.askToPlay, payload: '' },
            to: playerName,
        })
    }

    askToMakeDecision(player: String, availableDecisions: ClientHeader[]): void {
        this.tunnelToPlayer({
            message: { header: ServerHeader.makeDecision, payload: availableDecisions },
            to: player,
        })
    }

    askAllToMakeDecision(playersToAsk: String[], availableDecisions: ClientHeader[]): void {
        playersToAsk.forEach((player: String) => {
            this.askToMakeDecision(player, availableDecisions)
        })
    }


    dealerReceivedCard(dealerCard: Card, playersToNotify: String[], isFaceUp: boolean): void {
        playersToNotify.forEach((player: String) => {
            this.tunnelToPlayer({
                to: player,
                message: {
                    header: ServerHeader.dealerCard,
                    payload: isFaceUp ? dealerCard : new Card(Values.FACE_DOWN, Suits.FACE_DOWN)
                }
            })
        });
    }

    playerReceivedCard(playerCard: Card, player: String, playersToNotify: String[], isFaceUp: boolean): void {
        this.tunnelToPlayer({
            to: player,
            message: {
                header: ServerHeader.playerCard,
                payload: playerCard,
            }
        });
        playersToNotify.forEach((player: String) => {
            this.tunnelToPlayer({
                to: player,
                message: {
                    header: ServerHeader.playerCard,
                    payload: isFaceUp ? playerCard : new Card(Values.FACE_DOWN, Suits.FACE_DOWN)
                }
            })
        });
    }
}
