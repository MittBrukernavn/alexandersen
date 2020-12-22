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

const getSanitizedRoom = (roomName) => {
  const room = codenamesRooms[roomName];
  const sanitizedRoom = { ...room };
  sanitizedRoom.board = room.board.map((row) => row.map((tile) => {
    const sanitizedTile = { ...tile };
    if (!sanitizedTile.visible) {
      sanitizedTile.color = undefined;
    }
    return sanitizedTile;
  }));
  return sanitizedRoom;
};

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
      // avoid people choosing a player's ID as room name, in case we want to use direct messages
      // (more of a future-proofing measure than anything)
      if (codenamesRooms[roomName] !== undefined || names[roomName] !== undefined) {
        socket.emit('create room error', 'Room name is not available');
        return;
      }
      const existingRoom = getRoom(userId);
      if (existingRoom) {
        socket.leave(existingRoom);
      }
      // reserve room name (generation may take some time)
      codenamesRooms[roomName] = {};
      socket.join(roomName);
      const players = {};
      players[userId] = {
        name: userName,
        team: null,
        spymaster: false,
      };
      codenamesRooms[roomName] = {
        board: generateBoard(5, 8, 9),
        players,
        turn: 'blue', // blue's turn
        phase: 'hint', // spymaster is up to give a hint
      };
      socket.emit('create room success', roomName, getSanitizedRoom(roomName), userId);
    });


    socket.on('join room', (roomName) => {
      const userId = socket.client.id;
      const userName = names[userId];
      if (!userName) {
        socket.emit('join room error', 'You need a name to create a room');
        return;
      }
      if (codenamesRooms[roomName] === undefined) {
        socket.emit('join room error', 'No room with this name exists');
        return;
      }
      const existingRoom = getRoom(userId);
      if (existingRoom) {
        socket.leave(existingRoom);
        // TODO: remove user from other game rooms, and inform players
      }
      codenamesRooms[roomName].players[userId] = {
        name: userName,
        team: null,
        spymaster: false,
      };
      socket.join(roomName);
      socket.emit('join room success', roomName, getSanitizedRoom(roomName), userId);
      socket.to(roomName).emit('new player', userId, codenamesRooms[roomName].players[userId]);
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
      socket.to(room).emit('team change', userId, team);
    });

    socket.on('become spymaster', () => {
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('become spymaster error', 'No room joined');
        return;
      }

      const room = codenamesRooms[roomName];
      if (room.players[userId].team === null) {
        socket.emit('become spymaster error', 'No team selected');
        return;
      }

      room.players[userId].spymaster = true;
      socket.emit('become spymaster success', room);
      socket.to(roomName).emit('new spymaster', userId);
    });

    // TODO: add possibility to quit being spymaster

    socket.on('give hint', (hint, count) => {
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('give hint error', 'No room joined');
        return;
      }

      const room = codenamesRooms[roomName];
      const { turn, phase, players } = room;
      if (phase !== 'hint') {
        socket.emit('give hint error', 'It is the operatives\' turn to guess');
        return;
      }
      const { team, spymaster } = players[userId];
      if (team !== turn) {
        socket.emit('give hint error', 'It is not your turn');
        return;
      }
      if (!spymaster) {
        socket.emit('give hint error', 'You are not a spymaster');
        return;
      }
      room.phase = 'guess';
      socket.emit('new hint', userId, hint, count);
      socket.to(roomName).emit('new hint', userId, hint, count);
    });

    socket.on('hover card', (row, col) => {
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('hover card error', '');
        return;
      }

      const room = codenamesRooms[roomName];
      const {
        phase, turn, players, board,
      } = room;
      const player = players[userId];
      const { team, spymaster } = player;

      if (spymaster) {
        socket.emit('hover card error', 'You are a spymaster');
        return;
      }
      if (phase !== 'guess') {
        socket.emit('hover card error', 'Wait for the spymaster to give a hint');
        return;
      }
      if (turn !== team) {
        socket.emit('hover card error', 'It is the opposing team\'s turn');
        return;
      }
      try {
        const tile = board[row][col];
        const index = tile.hovers.indexOf(userId);
        if (index !== -1) {
          tile.hovers.splice(index, 1);
          socket.emit('remove hover', row, col, userId);
          socket.to(roomName).emit('remove hover', row, col, userId);
        } else {
          tile.hovers.push(userId);
          socket.emit('add hover', row, col, userId);
          socket.to(roomName).emit('add hover', row, col, userId);
        }
      } catch (err) {
        socket.emit('hover card error', 'An unexpected error occurred');
      }
    });

    socket.on('choose card', (row, col) => {
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('choose card error', 'No room joined');
        return;
      }
      const room = codenamesRooms[roomName];
      const {
        phase, turn, players, board,
      } = room;
      const player = players[userId];
      const { team, spymaster } = player;
      if (phase !== 'guess') {
        socket.emit('choose card error', 'Wait for the spymaster to give a hint');
        return;
      }
      if (turn !== team.turn) {
        socket.emit('choose card error', 'It is not your team\'s turn');
        return;
      }
      if (spymaster) {
        socket.emit('choose card error', 'Please let your operatives choose');
        return;
      }
      try {
        const tile = board[row][col];
        const otherTeam = team === 'red' ? 'blue' : 'red';
        socket.emit('reveal', row, col, tile.color);
        socket.to(roomName).emit('reveal', row, col, tile.color);
        tile.visible = true;
        if (tile.color === 'black') {
          socket.emit('game over', otherTeam);
          socket.to(roomName).emit('game over', otherTeam);
          room.turn = 'game over';
          return;
        }
        if (tile.color === team) {
          // TODO: add guess limit
          const remainingTiles = board.find((rowInBoard) => rowInBoard
            .find(({ color, visible }) => !visible && color === team));
          if (!remainingTiles) {
            socket.emit('game over', team);
            socket.to(roomName).emit('game over', team);
            room.turn = 'game over';
          }
        } else {
          const remainingTiles = board.find((rowInBoard) => rowInBoard
            .find(({ color, visible }) => !visible && color === otherTeam));
          if (!remainingTiles) {
            socket.emit('game over', otherTeam);
            socket.to(roomName).emit('game over', otherTeam);
            room.turn = 'game over';
          } else {
            room.turn = otherTeam;
            room.phase = 'hint';
            socket.emit('begin turn', otherTeam);
            socket.to(roomName).emit('begin turn', otherTeam);
          }
        }
      } catch (err) {
        socket.emit('choose card error', 'An unexpected error occurred');
      }
    });

    socket.on('end guessing', () => {
      // check that the player is on the right team, not spymaster, and it is the guessing round
      // emit a "begin turn" message
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('end guessing error', 'No room joined');
        return;
      }
      const room = codenamesRooms[roomName];
      const {
        phase, turn, players,
      } = room;
      const player = players[userId];
      const { team, spymaster } = player;
      if (phase !== 'guess') {
        socket.emit('end guessing error', 'Wait for the spymaster to give a hint');
        return;
      }
      if (turn !== team.turn) {
        socket.emit('end guessing error', 'It is not your team\'s turn');
        return;
      }
      if (spymaster) {
        socket.emit('end guessing error', 'Kindly allow your operatives to choose when to stop.');
        return;
      }
      const otherTeam = team === 'red' ? 'blue' : 'red';
      room.turn = otherTeam;
      room.phase = 'hint';
      socket.emit('begin turn', otherTeam);
      socket.to(roomName).emit('begin turn', otherTeam);
    });

    socket.on('new game', () => {
      // only allow beginning new games if the old game is over
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (!roomName) {
        socket.emit('new game error', 'No room joined');
        return;
      }
      const room = codenamesRooms[roomName];
      if (room.turn !== 'game over') {
        socket.emit('new game error', 'A game is in progress');
        return;
      }
      Object.keys(room.players).forEach((playerId) => {
        room.players[playerId].spymaster = false;
      });
      room.board = generateBoard(5, 8, 9);
      room.turn = 'blue';
      socket.emit('new game', getSanitizedRoom(roomName));
      socket.to(roomName).emit('new game', getSanitizedRoom(roomName));
    });

    socket.on('disconnect', () => {
      // TODO: remove players when they disconnect.
      // TODO: if their room is now empty, delete it
      const userId = socket.client.id;
      const roomName = getRoom(userId);
      if (roomName) {
        const room = codenamesRooms[roomName];
        delete room.players[userId];
        socket.to(roomName).emit('remove player', userId);
        if (Object.keys(room.players).length === 0) {
          delete codenamesRooms[roomName];
        }
      }
      delete names[userId];
    });
  });
};

module.exports = codenamesSetup;
