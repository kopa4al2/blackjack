import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as config from 'config/jwtConfig.json'

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    } ],
});

UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('pass')) {
        user.pass = await bcrypt.hash(user.pass, 8)
    }
    next()
});

UserSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const { _id } = user
    const token = jwt.sign({ _id }, config['private-key'])
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
};

UserSchema.statics.findByCredentials = async (login, password) => {
    const user = await User.findOne({ login })
    if (!user) {
        throw new Error('Invalid login credentials')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.pass)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials')
    }

    return user
};

const User = mongoose.model('User', UserSchema)

export default User