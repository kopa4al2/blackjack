// Commands from main thread to worker
export enum WorkerCommandType {
    startLoop,
    playerCommand,
}

export class WorkerCommand {
    command: WorkerCommandType;
    data: any;

    constructor(command: WorkerCommandType, data: any) {
        this.command = command;
        this.data = data;
    }
}


// Messages from worker to main thread (not necessary a response)
export enum WorkerResponseType {
    flush, // Flush data to database
    tunnel, // Tunnel message to the player
}

export class WorkerResponse {
    header: WorkerResponseType;
    data: any;

    constructor(header: WorkerResponseType, data: any) {
        this.header = header;
        this.data = data;
    }
}