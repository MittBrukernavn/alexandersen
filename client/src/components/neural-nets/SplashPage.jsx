import React from 'react';


import Background from '../general/Background';
import PageIndex from '../general/PageIndex';

const pages = [
  {
    title: 'Yelp',
    href: '/nn/yelp',
    description: `A neural network trying to classify positive and negative reviews, trained on
      yelp reviews. Based on an assignment in TDT4171 - Artificial Intelligence Methods, spring 2020. I am currently working on parsing the full yelp dataset in order to (ideally)
      make the model even more robust`,
  },
  {
    title: 'MNIST',
    href: '/nn/mnist',
    description: `A neural network for recognizing handwritten digits,
      trained on the MNIST dataset.`,
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
