import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from './components/home/Home';
import Bingo from './components/bingo/Bingo';
import BingoRequest from './components/bingo/BingoRequest';
import ChristmasTree from './components/christmas-binary-tree/ChristmasTree';
import Snake from './components/snake/Snake';
import Minesweeper from './components/minesweeper/Minesweeper';
import NeuralNets from './components/neural-nets/NeuralNets';
import Dotmocracy from './components/dotmocracy/Dotmocracy';
import Codenames from './components/codenames/Codenames';
import Pacdog from './components/pacdog/Pacdog';

import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import NewBingo from './components/admin/NewBingo';
import Prompts from './components/admin/Prompts';
import ReviewRequests from './components/admin/ReviewRequests';
import DotmocracyRooms from './components/admin/DotmocracyRooms';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/nn" component={NeuralNets} />
      <Route path="/bingo" exact component={Bingo} />
      <Route path="/bingo/request" component={BingoRequest} />
      <Route path="/christmastree" exact component={ChristmasTree} />
      <Route path="/minesweeper" component={Minesweeper} />
      <Route path="/snake" component={Snake} />
      <Route path="/dotmocracy" component={Dotmocracy} />
      <Route path="/codenames" component={Codenames} />
      <Route path="/pacdog" component={Pacdog} />
      <Route path="/admin" exact component={() => <Redirect to="/admin/login" />} />
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/main" component={AdminPanel} />
      <Route path="/admin/bingo" component={NewBingo} />
      <Route path="/admin/prompts" component={Prompts} />
      <Route path="/admin/review" component={ReviewRequests} />
      <Route path="/admin/dotmocracy" component={DotmocracyRooms} />
    </Router>
  );
}

export default App;
