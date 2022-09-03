import { AppBar, Avatar, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import React, { useContext, useState } from 'react'
import { AuthContext } from "../authContext/AuthContext";
import { logout } from "../authContext/AuthActions";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between"
});

const Icons = styled(Box)(({theme}) => ({
  display: "flex",
  gap: "20px",
  align: "center"
}));

const Navbar = ({ login }) => {
  const [open, setOpen] = useState(false)
  const { dispatch } = useContext(AuthContext);
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6">POS</Typography>
        {login && <Icons>
          <Avatar sx={{width:30, height:30}} src="https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg" onClick={e=>setOpen(true)}/>
        </Icons>}
      </StyledToolbar>
      {login && <Menu id="user-menu" sx={{marginTop: "45px"}} open={open} anchorOrigin={{vertical: "top", horizontal: "right"}} transformOrigin={{vertical: "top", horizontal: "right"}} onClose={e=>setOpen(false)}>
        <MenuItem>My Account</MenuItem>
        <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
      </Menu>}
    </AppBar>
  )
}

export default Navbar
