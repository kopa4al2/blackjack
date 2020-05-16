import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import seedDB from 'utils/seedDB';
import { dbConnect } from 'config/mongooseConfig';
import userRouter from 'routes/users';
import gameRouter from 'routes/game';
import GameSocket from 'socket/GameSocket';
import LobbyManager from './blackjack/LobbyManager';

const PORT = process.env.PORT || 5858;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth', userRouter);
app.use('/game', gameRouter);

dbConnect.then(() => {
    seedDB();
    console.log('Successfully connected to the database')
}).catch(err => {
    console.log(`Error connecting to db ${ err.message }`)
});

//TODO: need trusted certificate when deploy
// const server = https.createServer({
//     key: fs.readFileSync(__dirname + '/key.pem'),
//     cert: fs.readFileSync(__dirname + '/cert.pem'),
//     passphrase: '111111'
// }, app);
const server = http.createServer(app);

// For client-server communication (used for the game only)
export const gameSocket = new GameSocket(server);
// Used as a buffer between the worker threads and the client
export const lobbiesManager = new LobbyManager();

server.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${ PORT }`);
    // noinspection JSIgnoredPromiseFromCall
    lobbiesManager.loadLobbiesIntoMemory();
});



