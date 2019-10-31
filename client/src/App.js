import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


import Home from './components/home/Home.jsx';
import Bingo from './components/bingo/Bingo.jsx';
import Login from './components/admin/Login.jsx';
import NewBingo from './components/admin/NewBingo.jsx';


function App() {
  return (
    <Router>
      <Route path='/' exact component={Home} />
      <Route path='/bingo' component={Bingo} />
      <Route path='/admin' exact component={()=><Redirect to='/admin/login' />} />
      <Route path='/admin/login' component={Login} />
      <Route path='/admin/bingo' component={NewBingo} />
    </Router>
  );
}

export default App;
