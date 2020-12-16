import React, { useContext } from 'react';
import StoreContext from "../StoreContext/StoreContext";
import { useHistory } from 'react-router-dom';
import { List, ListItem, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import './FavoriteList.scss'

export interface FavoriteArtistInterface {
  name: string,
  mbid: string;
}

const FavoriteList = () => {
  const store = useContext(StoreContext);

  const history = useHistory();


  const favoriteList: FavoriteArtistInterface[] | [] = store.favoriteList ? store.favoriteList.get : [];

  return (
    <div className={'FavoriteList'}>
      {favoriteList.length
        ? <List>
          {favoriteList.map((favorite: FavoriteArtistInterface) => (
            <ListItem button key={favorite.mbid} onClick={() => history.push(`/artist/${favorite.mbid}`)}>
                <Typography variant={"body1"}>{favorite.name}</Typography>
            </ListItem>
          ))}
        </List>
        : <Typography variant={"body1"}>
          You don't have any favorite artists... yet! Look one up using the search on the right.
        </Typography>}
    </div>
  )
}

export default FavoriteList;