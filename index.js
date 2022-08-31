const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const players = [];

// SETTINGS
app.use(express.static(path.join(__dirname, '/public')));

// START
const server = app.listen(process.env.PORT || 888, () => {
    console.log(`Server running on port ${process.env.PORT || 888}`);
});

//ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/select-skin', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/choose-skin.html'));
});

//WEBSOCKET
const io = socketIO(server);

io.on('connection', (socket) => {
    io.sockets.emit('create:id', socket.id);
    players.push({id: socket.id});
    io.sockets.emit('history:players', players);
    console.log("conect: " + socket.id);

    socket.on('change:moves', (data) => {
        io.sockets.emit('change:moves', data);
        for (const player of players) {
            if (data.id === player.id) {
                player.img = data.img
                player.posX = data.posX;
                player.posY = data.posY;
                player.spritePos = data.spritePos;
                player.sprite = data.sprite;
                player.move = data.move;
            }
        }
    });

    socket.on('create:bomb', (data) => {
        io.sockets.emit('create:bomb', data)
    })

    socket.on('death:bomber', (id) => {
        io.sockets.emit('death:bomber', id)
    })

    socket.on('disconnect', () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === socket.id) {
                io.sockets.emit('disconnect:players', socket.id);
                players.splice(i, 1);
            }
        }
        console.log('disconnect: ' + socket.id)
    });
})