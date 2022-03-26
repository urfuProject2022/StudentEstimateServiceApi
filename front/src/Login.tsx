import React, {ReactComponentElement, useState} from 'react';
import './App.css';
import {Button, Checkbox, TextField} from "@mui/material";
import {Auth} from "./Utils/Login";

const Login = () => {
    const [state, setState] = useState({login: String, password: String});
    return (<div>
        <div><TextField onChange={x=>OnChange(x, setState, state)} id={"login"}></TextField></div>
        <div><TextField onChange={x=>OnChange(x, setState, state)} id={"password"} ></TextField></div>
        <Button onClick={x=> LoginInner(state)} variant="contained">Войти</Button>
        <Button variant="outlined">Регистрация</Button>
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