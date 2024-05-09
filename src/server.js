const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const routes = require('./routes/index.js');
const authMiddleware = require('./middlewares/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
let server;
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( ()=> console.log('Connected to MongoDb'))
.catch( err => console.log(err));

app.use(express.json());

app.use(cors());
app.options('*', cors());
app.use(authMiddleware);
app.use('/', routes);
server = app.listen( PORT, ()=> {
    console.log(`Server is Listening on ${PORT}`);
});
const io = socketIo(server);
app.set('io',io);