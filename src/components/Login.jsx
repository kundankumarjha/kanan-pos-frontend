import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useEffect } from "react";
import { login } from "../authContext/apiCalls";
import { AuthContext } from "../authContext/AuthContext";
import Navbar from "./Navbar"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    login({ username, password }, dispatch);
  };
  useEffect(() => {
    const validate = async() => {
      setDisabled(username.trim().length === 0 || password.trim().length === 0)
    };
    validate();
  },[username, password]);

  return (
    <Box>
      <Navbar />
        <Box p={2}  marginLeft={75} marginTop={35} marginRight={75}>
          <h1 align="center">Sign In</h1>
          <TextField 
              type="text"
              label="Username"
              margin="normal" 
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
          />
          <TextField 
              type="password"
              label="Password"
              margin="normal" 
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
          />
          <Button margin="normal" onClick={handleLogin} variant="contained" size="large" fullWidth disabled={disabled}>
            Sign In
          </Button>  
        </Box>
    </Box>
  );
}
