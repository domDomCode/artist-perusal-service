import React, { ChangeEvent, FC, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useDebouncedCallback } from "use-debounce";
import { FavoriteBorder, ZoomIn } from "@material-ui/icons";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';


import './HomeView.scss'
import { Link } from "react-router-dom";

interface artistSearchResponse {
  search: {
    artists: {
      nodes: Artist[]
    }
  }
}

interface Artist {
  name: string
  id: number
}

const GET_ARTISTS = gql`
query GetArtists($name: String!) {
  search {
    artists(query: $name) {
      nodes {
        id
        name
      }
    }
  }
}
`;

const HomeView: FC = () => {
  const [ searchValue, setSearchValue ] = useState('');
  const [ getArtists, {loading, error, data}] = useLazyQuery<artistSearchResponse>(GET_ARTISTS);

  const getArtistsDebounced = useDebouncedCallback(getArtists, 500);

  let artistsList: Artist[] | null; //TODO fixme, make data more readable

  // useEffect(() => artistsList = data?.search.artists.nodes, [data])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchValue(value);
    getArtistsDebounced.callback({variables: {name: searchValue}});
  }

  return (
    <div style={{width: '100%'}} className={'HomeView'}>
      <div>
        <TextField
          label={'Search artists'}
          variant={'outlined'}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div>
        {loading && <CircularProgress color={'secondary'}/>}
        {error && 'Something went wrong! Try searching again, or reloading the page'}
        {data
          ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Artist name</TableCell>
                    <TableCell>Dunno yet</TableCell>
                    <TableCell>See more</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.search.artists.nodes.map((artist: Artist) => (
                    <TableRow key={artist.id}>
                      <TableCell>{artist.name}</TableCell>
                      <TableCell>{artist.name}</TableCell>
                      <TableCell><Link to={'/artist'}><ZoomIn/></Link></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
          : (
            <div>Try typing in a search above to look up artists!</div>
          )}
      </div>
    </div>
  )
}

export default HomeView