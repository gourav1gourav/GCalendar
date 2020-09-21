const mongoose = require('mongoose');
//const uri = 'mongodb+srv://demouser:demopass@cluster0.v0jtc.mongodb.net/test?retryWrites=true&w=majority';
const uri='mongodb://demouser:demopass@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true'
// mongoose.connect(uri, { useNewUrlParser: true });

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => console.log(error));
    
const db = mongoose.connection;


const connectDB = async () => {
    await mongoose.connect(uri);
    db.once('open', () => console.log('Successfully connected to MongoDB'));
    db.on('error', (e) => console.log(e));

    console.log('DB connected!');
}
var connections= {
    'connectDB':connectDB,
    'db':db
}

module.exports = connections;