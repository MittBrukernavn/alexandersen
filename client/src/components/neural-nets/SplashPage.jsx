import React from 'react';


import Background from '../general/Background';
import PageIndex from '../general/PageIndex';

const pages = [
  {
    title: 'MNIST',
    href: '/nn/mnist',
    description: `A neural network for recognizing handwritten digits,
      trained on the MNIST dataset.`,
  },
  {
    title: 'Yelp',
    href: '/nn/yelp',
    description: `A neural network trying to classify positive and negative reviews, trained on
      yelp reviews.`,
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
