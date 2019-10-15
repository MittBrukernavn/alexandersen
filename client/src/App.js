import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Home from './components/home/Home.jsx';
import Bingo from './components/bingo/Bingo.jsx';


function App() {
  return (
    <Router>
      <Route path='/' exact component={Home} />
      <Route path='/bingo' component={Bingo} />
    </Router>
  );
}

export default App;
