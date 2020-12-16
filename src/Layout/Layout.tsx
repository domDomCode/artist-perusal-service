import React, { FC, useState } from 'react';
import { AppBar, Divider, Drawer, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import FavoriteList from "../FavoriteList/FavoriteList";

import './Layout.scss';

/** Dumb component, common for the whole app. Renders different routes as children */
const Layout: FC<any> = (props) => {
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);

  return (
    <div className={'Layout'}>
      <AppBar position={'fixed'} className={'Header'}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setIsSidebarOpen(prevState => !prevState)}
            edge="start"
          >
            <MenuIcon/>
          </IconButton>
          <div className={'Layout__title'}>
            <Typography variant={'h4'} component={'h1'}>
              ARTIST PERUSAL SERVICE
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
        classes={{paper: 'Layout__drawer'}}
      >
        <div className={'Layout__close-btn'}>
          <IconButton
            onClick={() => setIsSidebarOpen(prevState => !prevState)}
          >
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <Divider/>
        <FavoriteList/>
      </Drawer>
      <div className={'Layout__main'}>
        {props.children}
      </div>
    </div>
  )
}

export default Layout