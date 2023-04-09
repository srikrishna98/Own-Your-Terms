import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar() {

  function resetUserData(){
    localStorage.removeItem('userid');
  }  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Own Your Terms
          </Typography>
          
          <Button color="inherit" href='/chat'>Chat</Button>
          <Button color="inherit" href='/mydocs'>My Docs</Button>
          <Button color="inherit" href='/signin' onClick={resetUserData}>Sign out</Button>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}