import Message, { ClientHeader } from './Message';
import { gameSocket, lobbiesManager } from 'server';

export function handleMessage(message: Message) {
    const { header, payload, sender, lobbyId } = message;
    switch (header) {
        case ClientHeader.joinLobby: {
            lobbiesManager.joinLobby(sender, payload).then((res: Message) => {
                gameSocket.sendMessage(res.header, res.payload, sender)
            });
        }
            break;
        case ClientHeader.leaveLobby: {
            lobbiesManager.leaveLobby(sender, lobbyId).then((res: Message) => {
                gameSocket.sendMessage(res.header, res.payload, sender)
            })
        } break;
        default:
            lobbiesManager.tunnelToLobby(message);
    }
}