import React, { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";

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
  id: string
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
  const {mbid} = useParams<ParamTypes>()

  const {data, loading, error} = useQuery<ArtistLookupResponseInterface>(GET_ARTIST_DETAIL, {variables: {mbid: mbid}})

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
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </>
      )}
    </Card>
  )
}

export default ArtistView;