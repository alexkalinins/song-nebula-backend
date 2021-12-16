import mongoose from 'mongoose';

let connected = false

export const mongooseConnect = async () => {
    if (connected) {
        return;
    }

    // await mongoose.connect(process.env.URI, {
    //     useNewUrlParser: true,
    //     useFindAndModify: false, // I changed this to false!!!
    //     useUnifiedTopology: true,
    //     useCreateIndex: true,
    // });

    await mongoose.connect(process.env.MONGODB_URI, )
    connected = true;

    const db = mongoose.connection;
    db.once('open', ()=>{
        console.log('Connected to mongoose; good to go!');
    })

    db.on('error', ()=>{
        console.error("Mongoose uh oh")
    })
}

export const mongooseDisconnect = () => {
    if (!connected) {
        return;
    }

    mongoose.disconnect().then(() => connected = false);
}