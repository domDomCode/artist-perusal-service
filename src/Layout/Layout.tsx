import React, { FC, useState } from 'react';
import { Link } from "react-router-dom";
import { AppBar, Divider, Drawer, IconButton, Toolbar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FavoriteList from "../FavoriteList/FavoriteList";

const Layout: FC<any> = (props) => {
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);

  return (
    <div style={{width: '100%'}}>
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

          <Link to={'/'}>Home</Link>
          <span>ARTIST PERUSAL SERVICE</span>
        </Toolbar>
      </AppBar>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
      >
        <div>
          <IconButton onClick={() => setIsSidebarOpen(prevState => !prevState)}>
            <ChevronRightIcon/>
          </IconButton>
        </div>
        <Divider/>
        <FavoriteList/>
      </Drawer>
      <div style={{margin: '64px auto 0', paddingTop: '100px', width: '700px'}}>
        {props.children}
      </div>
    </div>
  )
}

export default Layout