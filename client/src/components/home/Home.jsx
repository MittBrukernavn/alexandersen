import React from 'react';
import styled from 'styled-components';

import Body from './Body.jsx';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #dadada;
`;

const H1 = styled.h1`
  font-size: 2em;
  margin: 0px;
  text-align: center;
`;

const CVPlug = styled.h2`
  font-size: 1.2em;
  margin: 0px;
  text-align: center;
`;

const A = styled.a`
  color: #2dd;
  text-decoration: none;
`;

const Home = props => (
  <Wrapper>
    <H1>Welcome to my humble site</H1>
    <CVPlug><A href='/cv.pdf' target='_blank'>(Wait, who is this?)</A></CVPlug>
    <Body />
  </Wrapper>
);

export default Home;
