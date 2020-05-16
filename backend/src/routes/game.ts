import * as express from 'express';
import auth from 'middleware/auth';
import Lobby from 'models/Lobby';
import { ClientHeader, ServerHeader } from 'socket/Message';

const gameRouter = express.Router();

gameRouter.get('/headers', auth, async (req, res) => {
    // TODO: maybe split logic into server and client
    res.status(200).json({ ...ServerHeader, ...ClientHeader })
});

gameRouter.get('/lobbies', auth, async (req, res) => {
    const lobbies = await Lobby.find({});
    res.status(200).json(lobbies)
});

gameRouter.get('/lobby', auth, async (req, res) => {
    const lobbyId = req.query.l;
    const lobby = await Lobby.findById(lobbyId)
        .populate('players')
        .populate('observers')
        .exec();
    if (lobby)
        res.status(200).json(lobby);
    else
        res.status(404).json({ error: `No such lobby ${ lobbyId }` })
});


export default gameRouter
