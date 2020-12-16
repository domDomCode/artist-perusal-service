import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import ArtistView from './ArtistView/index';
import HomeView from './HomeView/index';
import Layout from "./Layout/index";
import StoreContext from "./StoreContext/index";

import './App.scss';

// TODO Children type
// TODO Sidebar width / styled components?

const client: ApolloClient<unknown> = new ApolloClient({
  uri: 'https://graphbrainz.herokuapp.com',
  cache: new InMemoryCache()
});

function App() {
  //TODO replace default with localStorage
  const [favoriteList, setFavoriteList ] = useState([])

  const store = {
    favoriteList: {get: favoriteList, set: setFavoriteList}
  }

  return (
    <Router>
      <ApolloProvider client={client}>
        <StoreContext.Provider value={store}>
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
        </StoreContext.Provider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
