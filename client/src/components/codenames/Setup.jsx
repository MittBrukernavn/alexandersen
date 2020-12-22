import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Background from '../general/Background';
import Body from '../general/Body';

const Setup = ({ socket }) => {
  const [phase, setPhase] = useState('name');
  const [name, setName] = useState('');

  useEffect(() => {
    socket.on('self name', () => setPhase('room'));
  }, []);

  if (phase === 'name') {
    return (
      <Background>
        <Body maxWidth="80em">
          <h1>Choose a name</h1>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Body>
      </Background>
    );
  }
  return (
    <Background>
      <Body maxWidth="80em">
        SETUP ENGAGED
      </Body>
    </Background>
  );
};

Setup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default Setup;
