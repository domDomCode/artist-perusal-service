import React, { FC, useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Typography
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import StoreContext, { StoreInterface } from "../StoreContext/index";
import { FavoriteArtistInterface, ArtistLookupResponseInterface, ReleaseInterface } from "../types/interfaces";
import { GET_ARTIST_DETAIL } from "./query";

import 'react-toastify/dist/ReactToastify.css';
import './ArtistView.scss';

enum ActionTypeEnum {
  REMOVE = 'removed',
  ADD = 'added'
}

interface ParamTypes {
  mbid: string
}

const ArtistView: FC = () => {
  // Initialization, data fetch
  const {mbid} = useParams<ParamTypes>();

  const {data, loading, error} = useQuery<ArtistLookupResponseInterface>(
    GET_ARTIST_DETAIL,
    {variables: {mbid: mbid}}
  );
  // ------------------

  // Favorite artist
  const store = useContext<StoreInterface>(StoreContext);
  const {favoriteList} = store;

  const isFavorite = favoriteList?.get.find((artist: FavoriteArtistInterface) => artist.mbid === mbid);

  const removeFavoriteArtist = () => {
    const {favoriteList} = store;

    favoriteList?.set(favoriteList.get.filter((favorite: FavoriteArtistInterface) => favorite.mbid !== mbid));
    favoriteChangeToast(ActionTypeEnum.REMOVE);
  }

  const addFavoriteArtist = () => {
    const newFavoriteArtist = {
      name: data?.lookup.artist.name,
      mbid: data?.lookup.artist.mbid
    } as FavoriteArtistInterface;

    favoriteList && favoriteList.set([
      ...favoriteList.get,
      newFavoriteArtist
    ]);
    favoriteChangeToast(ActionTypeEnum.ADD);
  }

  const addRemoveFavorite = () => {
    isFavorite ? removeFavoriteArtist() : addFavoriteArtist();
  }

  const favoriteChangeToast = (actionType: ActionTypeEnum) => toast(`
    ${data?.lookup.artist.name} has been ${actionType} 
    ${actionType === ActionTypeEnum.ADD ? 'to' : 'from'} your favorite list
  `);
  // ------------------

  // Component modes
  const loadingMode = (
    <CardContent classes={{root: 'ArtistView__loading-container'}}>
      <CircularProgress color={'secondary'}/>
    </CardContent>
  );

  const errorMode = (
    <CardContent>
      Something went wrong!
    </CardContent>
  );
  // ------------------

  return (
    <Card classes={{root: 'ArtistView'}}>
      {loading && loadingMode}
      {error && errorMode}
      {data && (
        <>
          <CardHeader classes={{root: 'ArtistView__header'}} title={data.lookup.artist.name}/>
          <CardContent>
            <Button className={'ArtistView__back-btn'} variant={'contained'} color={'primary'}>
              <Link to={'/'}>Go back</Link>
            </Button>
            <IconButton
              className={'ArtistView__favorite-btn'}
              color={isFavorite ? 'secondary' : 'default'}
              aria-label="add to favorites"
              onClick={() => addRemoveFavorite()}
            >
              <FavoriteIcon/>
            </IconButton>
            <div>
              <Typography variant={"body1"} display={'inline'}>
                Country:{'  '}
              </Typography>
              <Typography variant={"body1"} display={'inline'}>
                {data.lookup.artist.country}
              </Typography>
            </div>
            <div>
              <Typography variant={"body1"} display={'inline'}>
                Type:{'  '}
              </Typography>
              <Typography variant={"body1"} display={'inline'}>
                {data.lookup.artist.type}
              </Typography>
            </div>
            <div>
              <Typography variant={"body1"} display={'inline'}>
                Rating:{'  '}
              </Typography>
              <Typography variant={"body1"} display={'inline'}>
                {data.lookup.artist.rating.value}
              </Typography>
            </div>
            {data.lookup.artist.releaseGroups.edges &&
            <List
              subheader={
                <ListSubheader>
                  Releases
                </ListSubheader>
              }
            >
              {data.lookup.artist.releaseGroups.edges.map((release: ReleaseInterface, index) => {
                return(
                  <React.Fragment key={uuid()}>
                    {index !== 0 ? <Divider/> : null}
                    <ListItem classes={{root: 'ArtistView__release-item'}}>
                      <Typography variant={"body1"} display={'inline'}>
                        {release.node.title}
                      </Typography>
                      <Typography variant={"body1"} display={'inline'}>
                        {release.node.firstReleaseDate}
                      </Typography>
                    </ListItem>
                  </React.Fragment>
                )
              })}
            </List>}
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default ArtistView;