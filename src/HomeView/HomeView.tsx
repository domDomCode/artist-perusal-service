import React, { ChangeEvent, FC, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useDebouncedCallback } from "use-debounce";
import { ZoomIn } from "@material-ui/icons";
import {
  CircularProgress, Divider, List, ListItem, ListSubheader,
  TextField, Typography
} from '@material-ui/core';


import './HomeView.scss'
import { Link } from "react-router-dom";

interface ArtistsSearchResponseInterface {
  search: {
    artists: {
      nodes: ArtistInterface[]
    }
  }
}

interface ArtistInterface {
  name: string
  mbid: string
}

const GET_ARTISTS = gql`
query GetArtists($name: String!) {
  search {
    artists(query: $name) {
      nodes {
        mbid
        name
      }
    }
  }
}
`;

const HomeView: FC = () => {
  const [ searchValue, setSearchValue ] = useState('');
  const [ getArtists, {loading, error, data}] = useLazyQuery<ArtistsSearchResponseInterface>(GET_ARTISTS);

  const getArtistsDebounced = useDebouncedCallback(getArtists, 500);

  let artistsList: ArtistInterface[] | null; //TODO fixme, make data more readable

  // useEffect(() => artistsList = data?.search.artists.nodes, [data])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchValue(value);
    getArtistsDebounced.callback({variables: {name: searchValue}});
  }

  return (
    <div style={{width: '100%'}} className={'HomeView'}>
      <div className={'HomeView__search'}>
        <TextField
          label={'Search artists'}
          variant={'outlined'}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className={'HomeView__list-container'}>
        {loading && <CircularProgress color={'secondary'}/>}
        {error &&
        <Typography variant={'body1'}>
          Something went wrong! Try searching again, or reloading the page
        </Typography>}
        {data &&
        <List
            subheader={
              <ListSubheader classes={{root: 'HomeView__list-subheader'}}>
                Artists
              </ListSubheader>
            }
        >
          {data.search.artists.nodes.map((artist: ArtistInterface) => (
            <React.Fragment key={artist.mbid}>
              <ListItem classes={{root: 'HomeView__list-item'}}>
                <Typography>
                  <Link className={'HomeView__see-artist-link'} to={`/artist/${artist.mbid}`}><ZoomIn/></Link>
                </Typography>
                <Typography variant={"body1"}>{artist.name}</Typography>
              </ListItem>
              <Divider/>
            </React.Fragment>
          ))}
        </List>}
      </div>
    </div>
  )
}

export default HomeView