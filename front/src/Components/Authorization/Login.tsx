import React, {useState} from 'react';
import '../../App.css';
import {Button, FormControl, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";

const Login = () => {
    const [state, setState] = useState({login: "", password: ""});
    const auth = useAuth();
    const navigate = useNavigate();
    return (<div>
        <FormControl fullWidth sx={{m: 1}}>
            <div><TextField label={"login"} onChange={x => OnChange(x, setState, state)} id={"login"}/></div>
            <div><TextField label={"password"} onChange={x => OnChange(x, setState, state)} id={"password"}/></div>
            <div><Button onClick={() => auth.signIn(state.login, state.password)} variant="contained">Войти</Button>
            </div>
            <div><Button onClick={() => navigate("/Registration")}>Регистрация</Button></div>
        </FormControl>
    </div>);
}

const LoginInner = (state: any) => {
    //authState.signIn(state.login, state.password);
}

const OnChange = (target: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setstate: any, state: any) => {
    const newState = {...state};
    newState[target.currentTarget.id] = target.target.value.toString();
    setstate(newState);
}

export default Login;