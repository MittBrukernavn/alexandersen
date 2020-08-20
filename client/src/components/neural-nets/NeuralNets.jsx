import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import SplashPage from './SplashPage';
import MNIST from './mnist/MNIST';

const NeuralNets = () => (
  <BrowserRouter>
    <Route path="/nn" exact component={SplashPage} />
    <Route path="/nn/mnist" exact component={MNIST} />
  </BrowserRouter>
);

export default NeuralNets;
