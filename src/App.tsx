import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import ArtistView from './ArtistView';
import HomeView from './HomeView';
import Layout from "./Layout/Layout";

import './App.scss';

// TODO Children type
// TODO Sidebar width / styled components?

import { ApolloClient, InMemoryCache } from '@apollo/client';

const client: ApolloClient<unknown> = new ApolloClient({
  uri: 'https://graphbrainz.herokuapp.com',
  cache: new InMemoryCache()
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <Layout>
          <Switch>
            <Route path={'/artist/:mbid?'}>
              <ArtistView/>
            </Route>
            <Route path={'/'}>
              <HomeView/>
            </Route>
          </Switch>
        </Layout>
      </ApolloProvider>
    </Router>
  );
}

export default App;
