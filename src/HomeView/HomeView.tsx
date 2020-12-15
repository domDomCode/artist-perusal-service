import React, { ChangeEvent, FC, useState } from 'react';
import { TextField } from '@material-ui/core';

import './HomeView.scss'



const HomeView: FC = () => {
  const [ searchValue, setSearchValue ] = useState('');

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

    </div>
  )
}

export default HomeView