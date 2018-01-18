const express = require('express');
const app = express();
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
    require('babel-register')({
        ignore: /\/(build|node_modules)\//,
        presets: ['env', 'react-app']
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

require('./controllers/stock-controller')(app);

const server = app.listen(app.get('port'), () => {
    console.log(`Attention port ${app.get('port')}...you are go for takeoff!`);
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('component connected');

    //notify all but caller of new save
    socket.on('add-event', function(symbol) {
        console.log('Save called', symbol);
        socket.broadcast.emit('new-save', symbol);
    });

    //notify all but caller of delete
    socket.on('remove-event', function(symbol) {
        console.log('Remove called', symbol);
        socket.broadcast.emit('new-delete', symbol);
    });

    socket.on('disconnect', function() {
        console.log('component disconnected');
    });
});