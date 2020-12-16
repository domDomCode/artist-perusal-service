import React, { ChangeEvent, FC, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDebouncedCallback } from "use-debounce";
import { ZoomIn } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { CircularProgress, Divider, List, ListItem, ListSubheader, TextField, Typography } from '@material-ui/core';

import { ArtistInterface, ArtistsSearchResponseInterface } from "../types/interfaces";
import { GET_ARTISTS } from "./query";

import './HomeView.scss'

interface Props {
  searchValue: string;
  setSearchValue(value: string): void;
}

const HomeView: FC<Props> = ({searchValue, setSearchValue}) => {
  const [ getArtists, {loading, error, data} ] = useLazyQuery<ArtistsSearchResponseInterface>(GET_ARTISTS);

  const getArtistsDebounced = useDebouncedCallback(getArtists, 500);

  useEffect(() => {
    searchValue && getArtistsDebounced.callback({variables: {name: searchValue}})
  }, [getArtistsDebounced, searchValue])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
  }

  const loadingMode = <CircularProgress color={'secondary'}/>;

  const errorMode = (
    <Typography variant={'body1'}>
      Something went wrong! Try searching again, or reloading the page
    </Typography>
  );

  const noResultsMode = (
    <Typography variant={'body1'}>
      Could not find any artists :((
    </Typography>
  );

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
        {loading && loadingMode}
        {error && errorMode}
        {data &&
        <List
            subheader={
              <ListSubheader classes={{root: 'HomeView__list-subheader'}}>
                Artists
              </ListSubheader>
            }
        >
          {data.search.artists.nodes.length
            ? data.search.artists.nodes.map((artist: ArtistInterface) => (
              <React.Fragment key={artist.mbid}>
                <ListItem classes={{root: 'HomeView__list-item'}}>
                  <Typography>
                    <Link className={'HomeView__see-artist-link'} to={`/artist/${artist.mbid}`}><ZoomIn/></Link>
                  </Typography>
                  <Typography variant={"body1"}>{artist.name}</Typography>
                </ListItem>
                <Divider/>
              </React.Fragment>
            ))
            : noResultsMode}
        </List>}
      </div>
    </div>
  )
}

export default HomeView