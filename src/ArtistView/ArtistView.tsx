import React, { FC, useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress, Divider,
  IconButton,
  List, ListItem,
  ListSubheader
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import StoreContext, {} from "../StoreContext/index";
import { StoreInterface } from '../StoreContext/StoreContext' //FIXME not working from index
import { FavoriteArtistInterface } from "../FavoriteList/index";

import 'react-toastify/dist/ReactToastify.css';
import './ArtistView.scss';

interface ArtistLookupResponseInterface {
  lookup: {
    artist: ArtistDetailInterface
  }
}

interface ArtistDetailInterface {
  name: string;
  country: string;
  type: string;
  rating: {
    value: string;
    voteCount: number;
  }
  releaseGroups: ReleaseGroupsInterface
  mbid: string
}

interface ReleaseGroupsInterface {
  edges: ReleaseInterface[]
}

interface ReleaseInterface {
  node: {
    title: string;
    firstReleaseDate: string;
  }
}

enum ActionTypeEnum {
  REMOVE = 'removed',
  ADD = 'added'
}

const GET_ARTIST_DETAIL = gql`
query GetArtistDetail($mbid: MBID!) {
  lookup {
    artist(mbid: $mbid) {
      name
      country
      type
      mbid
      rating {
        value
        voteCount
      }
      releaseGroups(type: ALBUM) {
        edges {
          node {
            title
            firstReleaseDate
          }
        }
      }
    }
  }
}
`;

interface ParamTypes {
  mbid: string
}

const ArtistView: FC = () => {
  // Initialization, data fetch
  const {mbid} = useParams<ParamTypes>();

  const {data, loading, error} = useQuery<ArtistLookupResponseInterface>(GET_ARTIST_DETAIL, {variables: {mbid: mbid}})
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
  `)
  // ------------------

  // Component modes
  const loadingMode = (
    <CardContent>
      <CircularProgress color={'secondary'}/>
    </CardContent>
  )

  const errorMode = (
    <CardContent>
      Something went wrong!
    </CardContent>
  )
  // ------------------

  return (
    <Card classes={{root: 'ArtistView'}}>
      {loading && loadingMode}
      {error && errorMode}
      {data && (
        <>
          <CardHeader title={data.lookup.artist.name}/>
          <CardContent>
            <Button className={'ArtistView__back-btn'} variant={'contained'} color={'primary'}>
              <Link to={'/'}>Go back</Link>
            </Button>
            <div>{data.lookup.artist.country}</div>
            <div>{data.lookup.artist.type}</div>
            <div>
              <span>{data.lookup.artist.rating.value}</span>
              <span>{data.lookup.artist.rating.voteCount}</span>
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
                    <ListItem>
                      <span>{release.node.title}</span>
                      <span>{release.node.firstReleaseDate}</span>
                    </ListItem>
                  </React.Fragment>
                )
              })}
            </List>}
          </CardContent>
          <CardActions>
            <IconButton
              color={isFavorite ? 'secondary' : 'default'}
              aria-label="add to favorites"
              onClick={() => addRemoveFavorite()}
            >
              <FavoriteIcon/>
            </IconButton>
          </CardActions>
        </>
      )}
      <ToastContainer />
    </Card>
  )
}

export default ArtistView;