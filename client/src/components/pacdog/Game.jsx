import React, { useState, useEffect } from 'react';
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

  // TODO: make a board (and graphics for it)
  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const tick = (prevBoard) => {
    // choose ghost direction (BFS?) and move them
    // move pacman
    // if pacman collides with a ghost: game over (or send ghost to spawn with "timeout" period)
    // if any dots are picked up: remove it, update score/state
    //   if no dots remain, level complete (reset or consider it a win?)
    // return board
  };

  useEffect(() => {
    // TODO: handle inactive game states (e.g. before game starts or a paused game)
    const a = setInterval(() => setBoard(tick), 50);
    return () => clearInterval(a);
  }, []);

  // TODO: add controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // eslint-disable-next-line no-unused-vars
      const { keycode } = e;
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // TODO: button controls for touch screens
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
