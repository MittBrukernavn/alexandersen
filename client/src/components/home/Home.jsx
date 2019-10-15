import React from 'react';
import styled from 'styled-components';

import Body from './Body.jsx';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: lightgrey;
`;

const H1 = styled.h1`
  margin: 0px;
  text-align: center;
`;

const Home = props => (
  <Wrapper>
    <H1>Welcome to my humble site</H1>
    <Body />
  </Wrapper>
);

export default Home;
