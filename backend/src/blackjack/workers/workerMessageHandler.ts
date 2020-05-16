import { WorkerResponse, WorkerResponseType } from './WorkerMessageTypes';
import { gameSocket } from 'server';

export function parseMessage(message: WorkerResponse) {
    const { header, data } = message;
    switch (header) {
        case WorkerResponseType.tunnel: {
            const { to, message } = data;
            gameSocket.sendFullMessage(message, to);
        }
    }
}