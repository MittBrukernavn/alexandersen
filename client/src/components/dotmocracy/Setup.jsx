import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Background from '../general/Background';
import Body from '../general/Body';

const Setup = ({ socket, onFinish }) => {
  const [phase, setPhase] = useState('choose name');
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');

  // creates a callback for setting the phase if the parameter is set to true
  const setPhaseOnSuccess = (newPhase) => (success) => {
    if (success) {
      setPhase(newPhase);
    }
  };

  useEffect(() => {
    if (phase === 'done') {
      onFinish();
    }
  }, [phase, onFinish]);

  if (phase === 'choose name') {
    return (
      <Background>
        <Body>
          <h2>What is your name?</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('name', name, setPhaseOnSuccess('choose room'))}>
            Register
          </button>
        </Body>
      </Background>
    );
  }

  return (
    <Background>
      <Body>
        <h2>Enter a room to join</h2>
        <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <button type="button" onClick={() => socket.emit('room', roomName, setPhaseOnSuccess('done'))}>
          Join room
        </button>
      </Body>
    </Background>
  );
};

Setup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default Setup;
