import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Background from '../general/Background';
import Body from '../general/Body';

const Setup = ({ socket, onFinish, initialRoomName }) => {
  const [phase, setPhase] = useState('choose name');
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState(initialRoomName);
  const [normalPersonVotes, setNormalPersonVotes] = useState(5);
  const [deciderVotes, setDeciderVotes] = useState(1);

  // creates a callback for setting the phase if the success parameter is set to true
  const setPhaseOnSuccess = (newPhase) => (success) => {
    if (success) {
      setPhase(newPhase);
    }
  };

  useEffect(() => {
    if (phase === 'done') {
      onFinish();
    }
    if (initialRoomName && phase === 'choose create or join room') {
      socket.emit('join room', initialRoomName, setPhaseOnSuccess('done'));
    }
  }, [phase, initialRoomName, onFinish]);

  if (phase === 'choose name') {
    return (
      <Background>
        <Body>
          <h2>What is your name?</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('name', name, setPhaseOnSuccess('choose create or join room'))}>
            Register
          </button>
        </Body>
      </Background>
    );
  }

  if (phase === 'choose create or join room') {
    return (
      <Background>
        <Body>
          <h2>Would you like to create a new room or join an existing one?</h2>
          <button type="button" onClick={() => setPhase('create room')}>
            Create room
          </button>
          <button type="button" onClick={() => setPhase('join room')}>
            Join room
          </button>
        </Body>
      </Background>
    );
  }

  if (phase === 'create room') {
    return (
      <Background>
        <Body>
          <h2>Create room</h2>
          <input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <label htmlFor="normalPersonVotes">
            Votes per person:
            <input type="number" id="normalPersonVotes" value={normalPersonVotes} onChange={(e) => setNormalPersonVotes(e.target.value)} />
          </label>
          <label htmlFor="deciderVotes">
            Votes for the decider:
            <input type="number" id="deciderVotes" value={deciderVotes} onChange={(e) => setDeciderVotes(e.target.value)} />
          </label>
          <button type="button" onClick={() => socket.emit('create room', roomName, normalPersonVotes, deciderVotes, setPhaseOnSuccess('done'))}>
            Create
          </button>
        </Body>
      </Background>
    );
  }

  if (phase === 'join room') {
    return (
      <Background>
        <Body>
          <h2>Enter a room to join</h2>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('join room', roomName, setPhaseOnSuccess('done'))}>
            Join room
          </button>
        </Body>
      </Background>
    );
  }

  return null;
};

Setup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  initialRoomName: PropTypes.string,
};

Setup.defaultProps = {
  initialRoomName: '',
}

export default Setup;
