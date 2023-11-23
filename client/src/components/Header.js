import React, { useState } from "react";
import {navigate, useNavigate} from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast"

const Header = () => {
  //global state
  let isLogin = useSelector((state) => state.isLogin);
  isLogin = isLogin || localStorage.getItem('userId')
  const dispatch =useDispatch();
  const navigate = useNavigate();
  // console.log(isLogin);
  //state
  const [value, setValue] = useState();
  //logout
  const handleLogout =() =>{
    try{
     dispatch(authActions.logout());
     toast.success("logout successfully")
     navigate('/login')
     localStorage.clear();
    }
    catch(error){
      // console.log(error)
    }
  }
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>MERN Blog App</Typography>
          {isLogin && (
            <Box display={"flex"} marginLeft="auto">
              <Tabs
                textColor="inherit"
                value={value}
                onChange={(e, val) => setValue(val)}
              >
                <Tab label="Blogs" LinkComponent={Link} to="/blogs" />
                <Tab label="My Blogs" LinkComponent={Link} to="/my-blogs" />
                <Tab label="Create Blog" LinkComponent={Link} to="/create-blog" />
              </Tabs>
            </Box>
          )}
          <Box display={"flex"} marginLeft="auto">
            {!isLogin && (
              <>
                <Button
                  style={{ margin: 1, color: "white" }}
                  LinkComponent={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  sx={{ margin: 1, color: "white" }}
                  LinkComponent={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
            {isLogin && (
              <Button onClick={handleLogout} sx={{ margin: 1, color: "white" }}>Logout</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
