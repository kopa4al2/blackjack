import * as jwt from 'jsonwebtoken';
import * as config from 'config/jwtConfig.json';
import User from 'models/User';

// Seconds
export const TOKEN_EXPIRATION_TIME = 24 * 60 * 3600; //24 hours

const sendNotAuthorized = (res, msg) => res.status(401).send(JSON.stringify({ error: msg || 'Not authorized' }));

export default (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
        res.status(401).send({ error: 'Not authorized' })
    }

    const token = authHeader.replace('Bearer ', '')
    jwt.verify(token, config['private-key'], async (err, decoded) => {
        if (err) {
            sendNotAuthorized(res, 'Malformed JWT token');
        } else if (decoded) {
            const { _id, iat } = decoded;
            const nowInSeconds = new Date().getTime() / 1000;
            const user = await User.findOne({ _id });

            if (!user) {
                sendNotAuthorized(res, 'Wrong JWT Token');
                return
            }

            if (nowInSeconds - iat > TOKEN_EXPIRATION_TIME) {
                user.tokens = user.tokens.filter(t => t.token !== token);
                user.save();
                sendNotAuthorized(res, 'Token expired');
                return
            }

            req.header['user'] = user;
            req.header['token'] = token;
            next()
        }
    });
}