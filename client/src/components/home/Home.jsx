import React from 'react';
import styled from 'styled-components';

import Background from '../general/Background';
import Body from './Body';


const H1 = styled.h1`
  font-size: 2em;
  margin: 0px;
`;

const CVPlug = styled.h2`
  font-size: 1.2em;
  margin: 0px;
`;

const A = styled.a`
  color: #2dd;
  text-decoration: none;
`;

const Home = () => (
  <Background>
    <H1>Welcome to my humble site</H1>
    <CVPlug><A href="/cv.pdf" target="_blank">(Wait, who is this?)</A></CVPlug>
    <Body />
  </Background>
);

export default Home;
