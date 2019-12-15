import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


import Home from './components/home/Home.jsx';
import Bingo from './components/bingo/Bingo.jsx';
import BingoRequest from './components/bingo/BingoRequest.jsx';
import ChristmasTree from './components/christmas-binary-tree/ChristmasTree.jsx';
import Snake from './components/snake/Snake.jsx';
import Minesweeper from './components/minesweeper/Minesweeper.jsx';

import Login from './components/admin/Login.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import NewBingo from './components/admin/NewBingo.jsx';
import Prompts from './components/admin/Prompts.jsx';
import ReviewRequests from './components/admin/ReviewRequests.jsx';


function App() {
  return (
    <Router>
      <Route path='/' exact component={Home} />
      <Route path='/bingo' exact component={Bingo} />
      <Route path='/bingo/request' component={BingoRequest} />
      <Route path='/christmastree' exact component={ChristmasTree} />
      <Route path='/minesweeper' component={Minesweeper} />
      <Route path='/snake' component={Snake} />
      <Route path='/admin' exact component={()=><Redirect to='/admin/login' />} />
      <Route path='/admin/login' component={Login} />
      <Route path='/admin/main' component={AdminPanel} />
      <Route path='/admin/bingo' component={NewBingo} />
      <Route path='/admin/prompts' component={Prompts} />
      <Route path='/admin/review' component={ReviewRequests} />
    </Router>
  );
}

export default App;
