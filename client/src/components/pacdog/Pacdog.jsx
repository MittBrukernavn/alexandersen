import React from 'react';

import Background from '../general/Background';
import Body from '../general/Body';

import Game from './Game';

const Pacdog = () => (
  <Background>
    <Body maxWidth="90%">
      <Game />
    </Body>
  </Background>
);

export default Pacdog;
