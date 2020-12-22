import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Body from '../general/Body';
import Background from '../general/Background';
import Setup from './Setup';

const socket = io('/codenames');

const Codenames = () => {
  const [roomName, setRoomName] = useState('');
  const [myId, setMyId] = useState('');
  const [game, setGame] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    socket.on('self name', (newName) => setName(newName));
    socket.on('name change', () => null); // TODO: handle other user changing name
    socket.on('create room success', (newRoomName, room, id) => {
      setGame(room);
      setRoomName(newRoomName);
      setMyId(id);
    });
    socket.on('join room success', (newRoomName, room, id) => {
      setGame(room);
      setRoomName(newRoomName);
      setMyId(id);
    });
    socket.on('new player', (/* userId, user */) => {
      // TODO: essentially just add game.players[userId] = user;
    });
    socket.on('join team error', console.log);
    socket.on('join team success', (/* team */) => {
      // TODO: game.players[myId].team = team;
    });
    socket.on('team change', (/* userId, team */) => {
      // TODO: game.players[userId].team = team;
    });
    socket.on('become spymaster success', (room) => {
      setGame(room);
    });
    socket.on('new spymaster', (/* userId */) => {
      // TODO: game.players[userId].spymaster = true;
    });
    socket.on('new hint', (/* userId, hint, count */) => {
      // set game phase to 'guess'
      // display hint
    });
    socket.on('add hover', (/* row, col, userId */) => {
      // game.board[row][col].hovers.push(userId);
    });
    socket.on('remove hover', (/* row, col, userId */) => {
      // TODO: game.board[row][col].hovers = game.board[row][col].hovers
      //   .filter((id) => id !== userId);
    });
    socket.on('reveal', (/* row, col, color */) => {
      // TODO: set game.board[row][col].color = color;
    });
    socket.on('begin turn', (/* team */) => {
      // TODO: set phase to hint and turn to team
    });
    socket.on('game over', (/* teamname */) => {
      // TODO: set game.turn to game over
      // make some display of who won
    });
    socket.on('new game', (room) => {
      setGame(room);
    });
  }, []);

  if (!game) {
    return <Setup socket={socket} />;
  }

  return (
    <Background>
      <Body>
        Codenames :)
      </Body>
    </Background>
  );
};

export default Codenames;
