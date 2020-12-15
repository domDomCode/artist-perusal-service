import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './App.scss';
import ArtistView from './ArtistView';
import HomeView from './HomeView';
import Layout from "./Layout/Layout";

// TODO Children type
// TODO Sidebar width / styled components?

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path={'/artist'}>
            <ArtistView/>
          </Route>
          <Route path={'/'}>
            <HomeView/>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
