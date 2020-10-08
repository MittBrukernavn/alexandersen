import React from 'react';
import styled from 'styled-components';

import Background from '../general/Background';
import PageIndex from '../general/PageIndex';

const pages = [
  {
    title: 'Dotmocracy',
    href: '/dotmocracy',
    description: 'Inspired by the course TMM4220 (Innovation by Design Thinking), I made a web application for "dotmocracy".',
  },
  {
    title: 'Neural Network Playground',
    href: '/nn',
    description: 'I try to get better at deep learning. Consider this a start.',
  },
  {
    title: 'Minesweeper',
    href: '/minesweeper',
    description: 'Another game I made, this one after my final exam.',
  },
  {
    title: 'Snake',
    href: '/snake',
    description: 'In order to effectively procrastinate for my exams, I wanted to program a simple game, like snake. So I did.',
  },
  {
    title: 'Binary christmas tree',
    href: '/christmastree',
    description: `For Online's christmas workshop, someone had the bright idea of making a christmas binary tree (i.e. a christmas tree and a binary tree).
      I thought it sounded fun, and decided to make it a reality. Enjoy.`,
  },
  {
    title: 'Bingo',
    href: '/bingo',
    description: `My first project published on the website was an old bingo project, from a debate earlier this year.
      It has been expanded on slightly, allowing for some level of user generated content and with more bingo sets to play with.`,
  },
];


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
    <PageIndex pages={pages} />
  </Background>
);

export default Home;
