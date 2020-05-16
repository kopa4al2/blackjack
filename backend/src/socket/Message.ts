export enum ServerHeader {
    success = 'success',
    failure = 'failure',
    connectionRefused = 'connectionRefused',
    connectionEstablished = 'connectionEstablished',
    playerInfo = 'playerInfo',
    lobbyInfo = 'lobbyInfo',
    askToPlay = 'askToPlay',
    takeBet = 'takeBet',
    makeDecision = 'makeDecision',
    dealerCard = 'dealerCard',
    playerCard = 'playerCard',
}

export enum ClientHeader {
    confirmPlay = 'confirmPlay',
    joinLobby = 'joinLobby',
    leaveLobby = 'leaveLobby',
    hit = 'hit',
    stand = 'stand',
    double = 'double',
    split = 'split',
    surrender = 'surrender',
    bet = 'bet',
    insurance = 'insurance',
}

interface Message {
    header: ServerHeader | ClientHeader,
    payload: String,
    lobbyId?: String, // the id of the lobby to which the message is directed
    sender?: String, // the username of the sender (login) or null if from the server
}

export default Message