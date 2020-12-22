import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Background from '../general/Background';
import Body from '../general/Body';

const Setup = ({ socket }) => {
  const [phase, setPhase] = useState('name');
  const [roomSelectionMode, setRoomSelectionMode] = useState('');
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    socket.on('self name', () => setPhase('room'));
  }, [socket]);

  if (phase === 'name') {
    return (
      <Background>
        <Body maxWidth="80em">
          <h1>Choose a name</h1>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('name', name)}>Choose</button>
        </Body>
      </Background>
    );
  }

  if (roomSelectionMode === 'create') {
    return (
      <Background>
        <Body maxWidth="80em">
          <h1>Choose a room name</h1>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('create room', roomName)}>Create</button>
        </Body>
      </Background>
    );
  }

  if (roomSelectionMode === 'join') {
    return (
      <Background>
        <Body maxWidth="80em">
          <h1>Enter a room to join</h1>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('join room', roomName)}>Join</button>
        </Body>
      </Background>
    );
  }

  return (
    <Background>
      <Body maxWidth="80em">
        <h1>Would you like to create a new room or join an existing one?</h1>
        <button type="button" onClick={() => setRoomSelectionMode('create')}>Create room</button>
        <button type="button" onClick={() => setRoomSelectionMode('join')}>Join room</button>
      </Body>
    </Background>
  );
};

Setup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default Setup;
