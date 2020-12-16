import React, { FC, useContext } from 'react';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";

import StoreContext, {} from "../StoreContext/index";
import { StoreInterface } from '../StoreContext/StoreContext' //FIXME not working from index

import { FavoriteArtistInterface } from "../FavoriteList/index";

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
  releaseGroups: ArtistReleaseGroupsInterface[]
  mbid: string
}

interface ArtistReleaseGroupsInterface {
  nodes: {
    title: string;
    firstReleaseDate: string;
  }
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

const ArtistView: FC = (props) => {
  const {mbid} = useParams<ParamTypes>();

  const {data, loading, error} = useQuery<ArtistLookupResponseInterface>(GET_ARTIST_DETAIL, {variables: {mbid: mbid}})

  const store = useContext<StoreInterface>(StoreContext);
  const {favoriteList} = store;

  const removeFavoriteArtist = () => {
    const {favoriteList} = store;

    favoriteList?.set(favoriteList.get.filter((favorite: FavoriteArtistInterface) => favorite.mbid !== mbid))
  }

  const addFavoriteArtist = () => {
    const newFavoriteArtist = {
      name: data?.lookup.artist.name,
      mbid: data?.lookup.artist.mbid
    } as FavoriteArtistInterface;

    favoriteList && favoriteList.set([
      ...favoriteList.get,
      newFavoriteArtist
    ])
  }

  const isFavorite = favoriteList?.get.find((artist: FavoriteArtistInterface) => artist.mbid === mbid);

  const addRemoveFavorite = () => {
    isFavorite ? removeFavoriteArtist() : addFavoriteArtist();
  }

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

  return (
    <Card>
      {loading && loadingMode}
      {error && errorMode}
      {data && (
        <>
          <CardHeader title={data.lookup.artist.name}/>
          <CardContent>
            <div>{data.lookup.artist.country}</div>
            <div>{data.lookup.artist.type}</div>
            <div>
              <span>{data.lookup.artist.rating.value}</span>
              <span>{data.lookup.artist.rating.voteCount}</span>
            </div>
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
    </Card>
  )
}

export default ArtistView;