import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { getUserFromToken } from 'routes/users';
import Player, { IPlayer } from 'models/Player';
import Message, { ClientHeader, ServerHeader } from './Message';
import { handleMessage } from './handlers';

// Do not import from here, import from server.ts
class GameSocket {

    private wss: WebSocket.Server;
    private connectedUsers: Map<String, WebSocket>; // username - socket

    constructor(server) {
        this.connectedUsers = new Map<String, WebSocket>();
        this.wss = new WebSocket.Server({ server });
        this.bindEventListeners();

    }

    private bindEventListeners() {
        this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
                const token = req.url.replace('/?t=', '');
                const user = await getUserFromToken(token);
                if (!user) {
                    this.sendMessage(ServerHeader.connectionRefused, 'Wrong token, or token expired', ws);
                    return
                }

                this.sendMessage(ServerHeader.connectionEstablished, 'Connection established', ws);
                const { login, balance } = user;
                let player: IPlayer = await Player.findOne({ name: login });
                if (!player) {
                    player = new Player({ name: login, balance });
                    await player.save()
                }
                this.sendMessage(ServerHeader.playerInfo, player, ws);
                this.connectedUsers.set(login, ws);

                ws.on('message', message => {
                    this.handleMessage(JSON.parse(message), login)
                });

                ws.on('close', async (code: Number, reason: String) => {
                    console.log(`${login} has closed the connection`);
                    this.connectedUsers.delete(login);
                })
            }
        )

    }

    /**
     * Send a message to user (via username or websocket)
     * Return true if successful false if user is not connected
     */
    public sendMessage(header: ServerHeader | ClientHeader, payload: any, receiver: WebSocket | string): boolean {
        const message = { header, payload };
        console.log(`Sending message ${header}`);
        try {
            let receiverSocket = receiver;
            if (typeof receiver === 'string')
                receiverSocket = this.connectedUsers.get(receiver);

            if (!receiverSocket) return false;
            receiverSocket.send(JSON.stringify(message))
            return true;
        } catch (e) {
            console.log('Error sending message');
            console.log(e);
            return false;
        }

    }

    public sendFullMessage(message: Message, receiver: WebSocket | string) {
        return this.sendMessage(message.header, message.payload, receiver);
    }

    private handleMessage(message: Message, sender: String) {
        console.log('Received message from ' + sender);
        console.log(message);

        message.sender = sender;
        // This is not the same as `this.handleMessage`
        handleMessage(message);
    }
}

export default GameSocket