import React from 'react';
import styled from 'styled-components';

import DrawingCanvas from './DrawingCanvas'

const Wrapper = styled.div`
  margin: 0 0.5em;
`;

const MNIST = () => {
  return (
    <Wrapper>
      <h1>MNIST-project</h1>
      <p>
        Under construction.
        The idea is basically to allow people to write a number, and the neural net will attempt to read it.
        Sounds simple enough, right?
        Let's hope it is.
      </p>
      <DrawingCanvas updatePixels={console.log} />
    </Wrapper>
  );
};

export default MNIST;
