import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Bingo from './components/bingo/Bingo.jsx';


function App() {
  return (
    <Router>
      <Route path='/' exact component={() => <h1>Homepage</h1>} />
      <Route path='/bingo' component={Bingo} />
    </Router>
  );
}

export default App;
