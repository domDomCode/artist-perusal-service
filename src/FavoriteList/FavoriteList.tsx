import React, { useContext } from 'react';
import StoreContext from "../StoreContext/StoreContext";
import { List, ListItem } from "@material-ui/core";
import { Link } from "react-router-dom";

export interface FavoriteArtistInterface {
  name: string,
  mbid: string;
}

const FavoriteList = () => {
  const store = useContext(StoreContext);


  const favoriteList: FavoriteArtistInterface[] | [] = store.favoriteList ? store.favoriteList.get : [];
  console.log('favoriteList', favoriteList);

  return (
    <>
      {favoriteList.length
        ? <List>
          {favoriteList.map((favorite: FavoriteArtistInterface) => (
            <ListItem key={favorite.mbid}>
              <Link to={`/artist/${favorite.mbid}`}>
                {favorite.name}
              </Link>
            </ListItem>
          ))}
        </List>
        : <div>You do not have any favorite artists... yet! Look one up using the search on the right</div>}
    </>
  )
}

export default FavoriteList;