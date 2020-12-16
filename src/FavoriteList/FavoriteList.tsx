import React, { useContext, useEffect, useMemo } from 'react';
import StoreContext from "../StoreContext/StoreContext";
import { useHistory } from 'react-router-dom';
import { List, ListItem, Typography } from "@material-ui/core";

import { FavoriteArtistInterface } from "../types/interfaces";

import './FavoriteList.scss'

const FavoriteList = () => {
  const store = useContext(StoreContext);

  const history = useHistory();


  const favoriteList = useMemo( // avoids running useEffect and setting localStorage on each render
    () => store.favoriteList ? store.favoriteList.get : [],
    [store.favoriteList]
  )

  // synchronise changes with localStorage
  useEffect(() => {
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
  }, [favoriteList])

  const emptyListMode = (
    <Typography variant={"body1"}>
      You don't have any favorite artists... yet! Look one up using the search on the right.
    </Typography>
  );

  return (
    <div className={'FavoriteList'}>
      {favoriteList.length
        ? <List>
          {favoriteList.map((favorite: FavoriteArtistInterface) => (
            <ListItem
              button
              key={favorite.mbid}
              onClick={() => history.push(`/artist/${favorite.mbid}`)}
            >
                <Typography variant={"body1"}>{favorite.name}</Typography>
            </ListItem>
          ))}
        </List>
        : emptyListMode}
    </div>
  )
}

export default FavoriteList;