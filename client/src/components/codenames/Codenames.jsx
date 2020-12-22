import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Body from '../general/Body';
import Background from '../general/Background';
import Setup from './Setup';
import Board from './Board';
import copyToClipboard from '../../utils/copyToClipboard';

const socket = io('/codenames');

const Codenames = () => {
  const [roomName, setRoomName] = useState('');
  const [myId, setMyId] = useState('');
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState({});
  const [turn, setTurn] = useState('');
  const [phase, setPhase] = useState('');
  // const [hints, setHints] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    socket.on('self name', (newName) => setName(newName));
    socket.on('name change', () => null); // TODO: handle other user changing name (userId, newName)
    socket.on('create room success', (newRoomName, room, id) => {
      const {
        board: b, players: p, turn: t, phase: ph,
      } = room;
      setBoard(b);
      setPlayers(p);
      setTurn(t);
      setPhase(ph);
      setRoomName(newRoomName);
      setMyId(id);
      console.log(room);
    });
    socket.on('join room success', (newRoomName, room, id) => {
      const {
        board: b, players: p, turn: t, phase: ph,
      } = room;
      setBoard(b);
      setPlayers(p);
      setTurn(t);
      setPhase(ph);
      setRoomName(newRoomName);
      setMyId(id);
    });
    socket.on('new player', (/* userId, user */) => {
      // TODO: essentially just add game.players[userId] = user;
    });
    socket.on('join team error', console.log);
    socket.on('join team success', (team) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        copy[myId].team = team;
        return copy;
      });
    });
    socket.on('team change', (/* userId, team */) => {
      // TODO: game.players[userId].team = team;
    });
    socket.on('become spymaster success', (room) => {
      const {
        board: b,
      } = room;
      setBoard(b);
      setPlayers((prev) => {
        const copy = { ...prev };
        copy[myId].spymaster = true;
        return copy;
      });
    });
    socket.on('new spymaster', (userId) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        copy[userId].spymaster = true;
        return copy;
      });
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
      const {
        board: b, players: p, turn: t, phase: ph,
      } = room;
      setBoard(b);
      setPlayers(p);
      setTurn(t);
      setPhase(ph);
    });
  }, [socket]);

  if (!board.length) {
    return <Setup socket={socket} />;
  }

  return (
    <Background>
      <Body>
        <p>
          {`Welcome to Codenames, ${name}`}
        </p>
        <p>
          {`It is ${turn}'s turn to ${phase}`}
        </p>
        <button type="button" onClick={() => copyToClipboard(`https://${document.domain}/codenames?room=${roomName}`)}>Copy invite link</button>
        <Board board={board} players={players} />
      </Body>
    </Background>
  );
};

export default Codenames;
