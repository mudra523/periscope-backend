require('dotenv').config();
const express = require('express');
const router = require('./routes');
const morgan = require('morgan');
const DBConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ACTIONS = require('./actions');

const app = express();
// here we are passing whole express as a listener to the new server which we are creating hence when we want to start the server we have to use server.listen in stead of app.listen.
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    oringin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// corsOption is to handle multiple router request as we are making post requests to server 5500 where other requests are handled by react on frontend on port 3000.
const corsOption = {
  credentials: true,
  origin: ['http://localhost:3000']
}

const PORT = process.env.PORT || 5500;
DBConnect();

// We are storing users profile pictures in this folder.
app.use('/storage', express.static('storage'));
// cookie parser is required to attach cookie on response.
app.use(cookieParser());
app.use(cors(corsOption));
// Here we are increasing the limit of data that can be received in req body.
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: '8mb' }));

app.use(router);
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send("Server is working");
})

// Sockets

const socketUserMap = {};

io.on('connection', (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMap[socket.id] = user;

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      });
    });

    

    // Join the room
    socket.join(roomId);
  });

  // Handle Relay Ice event
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // Handle Relay SDP
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  const leaveRoom = () => {
    const { rooms } = socket;
    // console.log('leaving', rooms);
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(
        io.sockets.adapter.rooms.get(roomId) || []
      );
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMap[socket.id]?.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMap[clientId]?.id,
        });

        socket.leave(roomId);
      });
    });

    delete socketUserMap[socket.id];
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);

  socket.on('disconnecting', leaveRoom);
});

// Starting server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

