import React,{useState} from "react";
import {useNavigate} from 'react-router-dom'
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {authActions} from "../redux/store"
import toast from "react-hot-toast"
const Login = () => {
  const navigate= useNavigate();
  const dispatch = useDispatch();
  //state
  const [inputs,setInputs]= useState({
    email:'',
    password:''
  })
  //handle input change
  const handleChange= (e)=>{
      setInputs(prevState =>({
        ...prevState,
        [e.target.name]:e.target.value
      }))
  }

  /// form handle
  const handleSubmit = async(e)=>{
      e.preventDefault();
      try{
        const {data} = await axios.post('/api/v1/user/login',{email:inputs.email,password:inputs.password}) ;
        if(data.success){
          localStorage.setItem('userId',data?.user._id);
          dispatch(authActions.login())
          toast.success('user logged in successfully');
          navigate('/')
        }
      }
      catch(error){
          // console.log(error); 
      }
  } 
  return (
    <>
    <form onSubmit={handleSubmit}>
      <Box
        maxWidth={450}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"auto"}
        marginTop={5}
        boxShadow="10px 10px 20px #ccc"
        padding={3}
        borderRadius={5}
      >
        <Typography
          variant="h4"
          sx={{ textTransform: "uppercase" }}
          padding={3}
          textAlign="center"
        >
          Login
        </Typography>
        
        <TextField
          placeholder="email"
          name="email"
          margin="normal"
          type="text"
          value={inputs.email}
          onChange={handleChange}
          required
        />
        <TextField
          placeholder="password"
          name="password"
          margin="normal"
          type="password"
          value={inputs.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 3, marginTop: 3 }}
        >
          Submit
        </Button>
        <Button
          onClick={()=> navigate('/register')}
          type="submit"
          color="primary"
          sx={{ borderRadius: 3, marginTop: 3 }}
        >
          Not a user ? Please Register
        </Button>
      </Box>
      </form>
    </>
  );
}

export default Login