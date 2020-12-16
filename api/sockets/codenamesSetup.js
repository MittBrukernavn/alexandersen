const codenamesRooms = require('../states/codenames');

const names = {};

const generateBoard = (boardDimensions, reds, blues) => {
  const N = boardDimensions * boardDimensions;
  const allTiles = [];
  for (let i = 1; i <= 100; i++) {
    allTiles.push({
      text: `Entry ${i}`,
      visible: false,
      hovers: [],
    });
  }

  // randomize order and select the entries that we want
  for (let i = 0; i < N; i++) {
    const selectedIndex = i + Math.floor(Math.random() * (allTiles.length - i));
    const c = allTiles[selectedIndex];
    allTiles[selectedIndex] = allTiles[i];
    allTiles[i] = c;
  }
  const selectedTiles = allTiles.slice(0, N);

  // color the selected tiles
  for (let i = 0; i < reds; i++) {
    selectedTiles[i].color = 'red';
  }
  for (let i = reds; i < reds + blues; i++) {
    selectedTiles[i].color = 'blue';
  }
  selectedTiles[reds + blues].color = 'black';
  for (let i = reds + blues + 1; i < selectedTiles.length; i++) {
    selectedTiles[i].color = 'white';
  }

  // final shuffle to randomize colors too
  for (let i = selectedTiles.length - 1; i > 0; i--) {
    const indexToSwap = Math.floor(Math.random() * i);
    const c = selectedTiles[indexToSwap];
    selectedTiles[indexToSwap] = selectedTiles[i];
    selectedTiles[i] = c;
  }

  const board = [];
  for (let i = 0; i < boardDimensions * boardDimensions; i += boardDimensions) {
    board.push(selectedTiles.slice(i, i + boardDimensions));
  }

  return board;
};

const isUserInRoom = (userId, roomName) => codenamesRooms[roomName].players[userId] !== undefined;

const getRoom = (userId) => (
  Object.keys(codenamesRooms).find((roomName) => isUserInRoom(userId, roomName)));

const codenamesSetup = (io) => {
  const codenames = io.of('/codenames');

  codenames.on('connection', (socket) => {
    socket.on('name', (name) => {
      try {
        const trimmedName = name.trim();
        if (trimmedName) {
          names[socket.client.id] = trimmedName;
          socket.emit('self name', trimmedName);
          const room = getRoom(socket.client.id);
          if (room) {
            socket.to(room).emit('name change', socket.client.id, trimmedName);
          }
        }
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('create room', (roomName) => {
      const userId = socket.client.id;
      const userName = names[userId];
      if (!userName) {
        socket.emit('create room error', 'You need a name to create a room');
        return;
      }
      if (!roomName) {
        socket.emit('create room error', 'You need to name your new room');
        return;
      }
      if (codenamesRooms[roomName] !== undefined) {
        socket.emit('create room error', 'Room with that name already exists');
        return;
      }
      // reserve room name (generation may take some time)
      codenamesRooms[roomName] = {};
      const existingRoom = getRoom(userId);
      if (existingRoom) {
        socket.leave(existingRoom);
      }
      socket.join(roomName);
      // TODO: add room to state
      const players = {};
      players[userId] = {
        name: userName,
        team: null,
        spymaster: false,
      };
      codenamesRooms[roomName] = {
        board: generateBoard(5, 8, 9),
        players,
        turn: 'blue',
      };
      socket.emit('create room success', roomName);
    });


    socket.on('join room', (roomName) => {
      const userId = socket.client.id;
      const userName = names[userId];
      if (!userName) {
        socket.emit('join room error', 'You need a name to create a room');
        return;
      }
      if (codenamesRooms[roomName] === undefined) {
        socket.emit('join room error', 'Room with that name already exists');
        return;
      }
      const existingRoom = getRoom(userId);
      if (existingRoom) {
        socket.leave(existingRoom);
      }
      // TODO: update room in state
      codenamesRooms[roomName].players[userId] = {

      };
      socket.join(roomName);
      socket.emit('join room success', roomName);
    });

    socket.on('join team', (team) => {
      const userId = socket.client.id;
      if (team !== 'red' && team !== 'blue') {
        socket.emit('join team error', 'Invalid team name');
        return;
      }
      const room = getRoom(userId);
      if (!room) {
        socket.emit('join team error', 'No room joined');
        return;
      }
      codenamesRooms[room].players[userId].team = team;
      socket.emit('join team success', team);
      socket.to(room).emit('team change', socket.client.id, team);
    });
  });
};

module.exports = codenamesSetup;
