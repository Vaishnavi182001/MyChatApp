// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const mongoose = require('mongoose');
const { dbConfig } = require('./config/secret.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4200', // Allow requests from this origin
      methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'], // Allow these HTTP methods
      credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
  });

const bodyParser = require('body-parser');
const auth = require('./routes/authRoutes');
const post = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes.js')
const {User} = require('./Helpers/UserClass.js')

require('./socket/streams')(io, User, _);
require('./socket/private')(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to parse JSON and URL-encoded request bodies
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Authorization' // Expose the Authorization header
  }));

app.use(express.json());
app.use(express.urlencoded({  extended: true }));
app.use(cookieParser());

mongoose.Promise = global.Promise;

const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    mongoose.connect(dbConfig.url).then(() => {
        console.log('MongoDB is connected');
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', err);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbConfig.url);
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Middleware to use routes
app.use('/api/chatapp', auth);
app.use('/api/chatapp/post', post);
app.use('/api/chatapp/user', users);
app.use('/api/chatapp/friends', friends);
app.use('/api/chatapp/message', message);
app.use('/api/chatapp', image);


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});