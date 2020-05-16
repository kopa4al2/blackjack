import { Worker } from 'worker_threads';
import * as path from 'path';
import Lobby, { ILobby } from 'models/Lobby';
import Player, { IPlayer } from 'models/Player';
import Message, { ClientHeader, ServerHeader } from 'socket/Message';
import { WorkerCommand, WorkerCommandType } from './workers/WorkerMessageTypes';
import LobbySerializable from './game-models/LobbySerializable';
import { parseMessage } from './workers/workerMessageHandler';
import PlayerSerializable from './game-models/PlayerSerializable';


export default class LobbyManager {
    lobbiesWorker = new Map<String, Worker>();

    /**
     * Initializes lobbies from the database into the memory, assigns a worker for each of them and maps them
     * by id
     */
    loadLobbiesIntoMemory = async () => {
        const allLobbies: ILobby[] = await Lobby.find({})
            .populate('players')
            .populate('observers')
            .exec();

        for (const lobby of allLobbies) {
            // Init the Worker
            const lobbyWorker: Worker = new Worker(path.join(__dirname, './workers/gameLoopWorker.js'), {});
            lobbyWorker.on('message', parseMessage);

            // When worker is up and running, tell it to start looping the lobby
            lobbyWorker.on('online', () => {
                lobbyWorker.postMessage(new WorkerCommand(WorkerCommandType.startLoop, new LobbySerializable(lobby)));
            });

            lobbyWorker.on('exit', code => {
                this.lobbiesWorker.delete(lobby._id);
                console.log(`Worker ${ lobby.name } exit with code: ${ code }`);
            });
            this.lobbiesWorker.set(lobby._id.toString(), lobbyWorker);
        }
    };

    /**
     * Update the lobby from the database to give users immediate feedback
     * and send message to the worker thread to sync the new player
     * @param user the username of the player who wants to join lobby
     * @param lobbyId the id of the lobby
     */
    joinLobby = (user: String, lobbyId: String) => new Promise(async resolve => {
        const lobby: ILobby = await Lobby.findOne({ _id: lobbyId });
        const blackjackPlayer: IPlayer = await Player.findOne({ name: user });

        if (blackjackPlayer.currentLobby) {
            console.warn('Player already in another lobby');
            resolve({ header: ServerHeader.failure, payload: 'You are already in another game' });
            return
        }

        this.lobbiesWorker.get(lobbyId).postMessage(
            new WorkerCommand(
                WorkerCommandType.playerCommand,
                { header: ClientHeader.joinLobby, payload: new PlayerSerializable(blackjackPlayer) }
            ));

        blackjackPlayer.currentLobby = lobby._id;
        lobby.observers.push(blackjackPlayer);

        await blackjackPlayer.save();
        await lobby.save();

        resolve({
            header: ServerHeader.playerInfo,
            payload: blackjackPlayer,
        })
    });

    /**
     * Remove the player from his current lobby (if present) and tell the worker thread to sync
     * @param user the username(login) of the user
     * @param lobbyId the id of the lobby
     */
    leaveLobby = async (user: String, lobbyId: String) => new Promise(async resolve => {
        // Tell the game loop worker to sync its players after the game is over
        this.lobbiesWorker.get(lobbyId).postMessage(
            new WorkerCommand(
                WorkerCommandType.playerCommand,
                { header: ClientHeader.leaveLobby, payload: user }
            ));

        const player: IPlayer = await Player.findOne({ name: user });

        if (player && player.currentLobby) {
            Lobby.updateOne(
                { _id: player.currentLobby },
                { $pull: { players: player._id } }
            ).exec();

            player.currentLobby = undefined;
            player.save();
        }
        resolve({ header: ServerHeader.playerInfo, payload: player })
    });

    tunnelToLobby = async (message: Message) => {
        const { sender: name, header, payload, lobbyId } = message;
        const player: IPlayer = await Player.findOne({ name });
        const playerSerializable = new PlayerSerializable(player);

        const data = {
            sender: playerSerializable,
            header,
            payload,
        };

        this.lobbiesWorker
            .get(lobbyId)
            .postMessage(new WorkerCommand(
                WorkerCommandType.playerCommand,
                data
            ));
    }
}
