import React, { useState } from 'react';
import styled from 'styled-components';

import useWindowDimensions from '../../utils/windowDimensions';

const Row = styled.div`
display: flex;
flex-flow: row nowrap;
`;

const Column = styled.div`
display: flex;
flex-flow: column nowrap;
`;

const Game = () => {
  const { width, height } = useWindowDimensions();
  const [direction, setDirection] = useState(null);

  if (width < height) {
    return (
      <Column>
        Column
      </Column>
    );
  }
  return (
    <Row>
      Row
    </Row>
  );
};

export default Game;
