const dotmocracies = require('../states/dotmocracies');

const dotmocracySetup = (io) => {
  const dotmocracy = io.of('/dotmocracy');

  // in-memory cause I don't need these to persist (that will be a project for another day)
  const names = {};

  const getroom = (userid) => (
    Object.keys(dotmocracies).find((roomname) => (
      dotmocracies[roomname].members.find(({ userId }) => userId === userid)))
  );

  dotmocracy.on('connection', (socket) => {
    socket.on('name', (name, ack) => {
      try {
        const hasName = names[socket.client.id] !== undefined;
        const trimmedName = name.trim();
        if (!hasName && trimmedName) {
          names[socket.client.id] = trimmedName;
          ack(true);
        } else {
          ack(false);
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('create room', (room, normalVotes, deciderVotes, allowDeciderAfterVoting, ack) => {
      try {
        const userId = socket.client.id;
        const nameOfUser = names[userId];
        if (!nameOfUser) {
          socket.emit('msg', 'No name found for your user id');
          ack(false);
          return;
        }
        if (!room) {
          socket.emit('msg', 'Room name cannot be empty');
          ack(false);
          return;
        }
        if (dotmocracies[room] !== undefined) {
          socket.emit('msg', `Room ${room} already exists`);
          ack(false);
          return;
        }
        const existingRoom = getroom(userId);
        if (existingRoom) {
          socket.emit('msg', 'You are already in another room');
          ack(false);
          return;
        }
        socket.join(room);
        const userData = {
          userId,
          name: nameOfUser,
          votesCast: 0,
          isDecider: false,
        };
        dotmocracies[room] = {
          name: room,
          postits: [],
          members: [userData],
          normalVotes: normalVotes > 0 ? normalVotes : 5,
          deciderVotes: deciderVotes > 0 ? deciderVotes : 1,
          allowDeciderAfterVoting,
          deciderVotesCast: 0,
          decider: null,
        };
        socket.join(room);
        socket.emit('msg', `Room ${room} created`);
        socket.emit('init room', dotmocracies[room]);
        ack(true);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('join room', (room, ack) => {
      try {
        const userId = socket.client.id;
        const nameOfUser = names[userId];
        if (!nameOfUser) {
          socket.emit('msg', 'No name found for your user id');
          ack(false);
          return;
        }
        const existingRoom = getroom(userId);
        if (existingRoom) {
          ack(false);
          return;
        }
        if (dotmocracies[room] === undefined) {
          ack(false);
          return;
        }
        socket.join(room);
        ack(true);
        const userData = {
          userId,
          name: nameOfUser,
          votesCast: 0,
          isDecider: false,
        };
        dotmocracies[room].members.push(userData);
        socket.emit('msg', `Welcome to room ${room}.`);
        socket.emit('init room', dotmocracies[room]);
        socket.in(room).emit('msg', `${nameOfUser} joined the room!`);
        socket.in(room).emit('new user', userData);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('make postit', (text, ack) => {
      try {
        const room = getroom(socket.client.id);
        if (!room) {
          ack(false);
          return;
        }
        const existingPostits = dotmocracies[room].postits;
        if (existingPostits.find((existingPostit) => existingPostit.text === text)) {
          ack(false);
          return;
        }
        const newPostit = {
          text,
          dots: [],
        };
        dotmocracies[room].postits.push(newPostit);
        socket.emit('new postit', newPostit);
        socket.in(room).emit('new postit', newPostit);
        ack(true);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('decider signup', () => {
      try {
        const room = getroom(socket.client.id);
        if (!room) {
          socket.emit('msg', 'You are not a member of any rooms');
        }
        if (dotmocracies[room].decider) {
          socket.emit('msg', 'Room already has a decider');
          return;
        }
        const user = dotmocracies[room].members
          .find(({ userId }) => userId === socket.client.id);
        if (!user) {
          socket.emit('msg', 'Unknown error');
          return;
        }
        if (user.votesCast && !dotmocracies[room].allowDeciderAfterVoting) {
          socket.emit('msg', 'You have already begun voting');
          return;
        }

        dotmocracies[room].decider = socket.client.id;
        user.isDecider = true;
        socket.emit('set decider', socket.client.id);
        socket.in(room).emit('set decider', socket.client.id);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('vote', (postit, coordinates) => {
      try {
        const room = getroom(socket.client.id);
        if (!room) {
          return;
        }
        const postitObj = dotmocracies[room].postits
          .find(({ text }) => text === postit);
        if (!postitObj) {
          return;
        }
        const user = dotmocracies[room].members
          .find(({ userId }) => userId === socket.client.id);
        if (user.isDecider) {
          const vote = { coordinates, decider: true };
          // compare votesCast to deciderVotes
          // add a decider vote rather than regular vote
          if (dotmocracies[room].deciderVotesCast >= dotmocracies[room].deciderVotes) {
            socket.emit('msg', 'You have used your votes');
            return;
          }
          dotmocracies[room].deciderVotesCast += 1;
          postitObj.dots.push(vote);
          socket.emit('new vote', postit, vote);
          socket.in(room).emit('new vote', postit, vote);
          return;
        }
        if (user.votesCast >= dotmocracies[room].normalVotes) {
          socket.emit('msg', 'You have used your votes');
          return;
        }
        const vote = { coordinates, decider: false };
        user.votesCast += 1;
        postitObj.dots.push(vote);
        socket.emit('new vote', postit, vote);
        socket.in(room).emit('new vote', postit, vote);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('disconnect', () => {
      /* const descriptions = {
        'server namespace disconnect': 'Disconnected by server',
        'client namespace disconnect': 'User left',
        'ping timeout': 'Client was not responding to pings',
        'transport close': 'Client stopped sending data',
      };
      const desc = descriptions[reason] || reason; // fall back on reason "code" */
      const room = getroom(socket.client.id);
      if (room) {
        dotmocracies[room].members = dotmocracies[room].members
          .filter(({ userId }) => userId !== socket.client.id);
        socket.in(room).emit('remove user', socket.client.id);

        if (dotmocracies[room].decider === socket.client.id) {
          dotmocracies[room].decider = null;
          socket.in(room).emit('set decider', null);
        }

        if (dotmocracies[room].members.length === 0) {
          delete dotmocracies[room];
        }
      }
      delete names[socket.client.id];
    });
  });
};

module.exports = dotmocracySetup;
