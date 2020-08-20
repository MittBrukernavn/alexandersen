import React from 'react';


import Background from '../general/Background';
import PageIndex from '../general/PageIndex';

const pages = [
  {
    title: 'MNIST',
    href: '/nn/mnist',
    description: `A neural network for recognizing handwritten digits,
      trained on the MNIST dataset`,
  },
];

const SplashPage = () => (
  <Background>
    <h1>Did anyone say neural nets?</h1>
    <p>
      I play with some on this page.
    </p>
    <PageIndex pages={pages} />
  </Background>
);

export default SplashPage;
