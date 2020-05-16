import * as mongoose from 'mongoose';

const dbConnect = mongoose.connect('mongodb+srv://sdi:87hspq2@cluster0-ectqi.mongodb.net/blackjack?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

export {
    dbConnect
}
