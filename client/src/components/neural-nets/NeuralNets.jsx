import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import SplashPage from './SplashPage';
import MNIST from './mnist/MNIST';
import Yelp from './yelp/Yelp';

const NeuralNets = () => (
  <BrowserRouter>
    <Route path="/nn" exact component={SplashPage} />
    <Route path="/nn/mnist" exact component={MNIST} />
    <Route path="/nn/yelp" component={Yelp} />
  </BrowserRouter>
);

export default NeuralNets;
