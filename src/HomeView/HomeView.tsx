import React, { ChangeEvent, FC, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';

import './HomeView.scss'
import { useDebounce } from "use-debounce";

interface artistSearchResponse {
  search: {
    artists: {
      nodes: Artist[]
    }
  }
}

interface Artist {
  name: string
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
  const [ debouncedValue ] = useDebounce(searchValue, 2000)

  const {loading, error, data} = useQuery<artistSearchResponse>(
    GET_ARTISTS, {variables: {name: debouncedValue}}
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchValue(value);
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Artist name</TableCell>
                <TableCell>Dunno yet</TableCell>
                <TableCell>Add to favorites</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default HomeView