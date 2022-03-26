import React, {ReactComponentElement, useState} from 'react';
import './App.css';
import {Button, Checkbox, FormControl, InputLabel, TextField} from "@mui/material";
import {Auth} from "./Utils/Login";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [state, setState] = useState({login: String, password: String});
    const navigate = useNavigate();
    return (<div>
        <FormControl fullWidth sx={{ m: 1 }} >
        <div><TextField label={"login"} onChange={x=>OnChange(x, setState, state)} id={"login"}></TextField></div>
        <div><TextField label={"password"} onChange={x=>OnChange(x, setState, state)} id={"password"} ></TextField></div>
        <div><Button onClick={x=> LoginInner(state)} variant="contained">Войти</Button></div>
        <div><Button onClick={x=>navigate("/Registration")}>Регистрация</Button></div>
        </FormControl>
    </div>);
}

const LoginInner = (state: any) => {
  const loginResponse = Auth(state.login, state.password);

  return loginResponse.then(resp=>{
      if (resp.status >= 400) {
          alert("Fail")
      }
      return resp;
  })

}

const OnChange = (target: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setstate: any, state: any) => {
    const newState = {...state};
    newState[target.currentTarget.id] = target.target.value.toString();
    setstate(newState);
}

export default Login;