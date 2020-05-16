import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User from 'models/User';
import { TOKEN_EXPIRATION_TIME } from 'middleware/auth';
import * as config from 'config/jwtConfig.json';

const userRouter = express.Router();
const STARTING_BALANCE = 1000

export const getUserFromToken = async token => {
    try {
        const data = jwt.verify(token, config['private-key']);
        if (data) {
            const { _id, iat } = data;
            const nowInSeconds = new Date().getTime() / 1000;
            const user = await User.findOne({ _id });

            if (nowInSeconds - iat > TOKEN_EXPIRATION_TIME) {
                user.tokens = user.tokens.filter(t => t.token !== token);
                user.save();
                return null
            }
            return user
        }
    } catch (err) {
        console.log('error in getUserFromToken')
        console.log(err)
        return null
    }
}

userRouter.post('/register', async (req, res) => {
    try {
        const { login, pass } = req.body;
        const balance = STARTING_BALANCE;

        let user = await User.findOne({ login });
        if (user) {
            return res.status(409).send({ error: 'Such user is already registered' })
        }

        user = new User({ login, pass, balance });
        await user.save()
        const token = await user.generateAuthToken();

        user.pass = undefined
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const { login, pass } = req.body;
        const user = await User.findByCredentials(login, pass);
        if (!user) {
            return res.status(401).json({ error: 'Login failed! Wrong credentials.' });
        }
        const token = await user.generateAuthToken();
        user.pass = undefined;
        res.json({ user, token })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

userRouter.post('/logout', async (req, res) => {
    const { token } = req.body;
    try {
        const data = jwt.verify(token, config['private-key']);
        if (data) {
            const { _id } = data;
            const user = await User.findOne({ _id });
            if (user) {
                user.tokens = user.tokens.filter(t => token !== t.token)
                user.save()
            }
        }
    } catch (err) {
        console.log('err.message#LOGOUT')
        console.log(err.message)
    } finally {
        res.status(200).json({ status: 'SUCCESS' })
    }

})

userRouter.get('/checkToken', async(req, res) => {
    const token = req.query.t;
    const user = await getUserFromToken(token);
    res.status(200).json({ user });
})


export default userRouter
