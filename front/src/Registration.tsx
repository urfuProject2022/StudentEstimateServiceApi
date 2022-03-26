import React, {ReactComponentElement, useState} from 'react';
import './App.css';
import {Button, Checkbox, FormControl, InputLabel, TextField} from "@mui/material";
import {Auth, RegistrationRequest} from "./Utils/Login";
import {useNavigate} from "react-router-dom";

export interface RegistrationDto {
    IsAdmin: boolean,
    Login: string,
    Password: string,
    FullName: string
}

const Login = () => {
    const dto: RegistrationDto = {
         FullName: "Vasya",
         IsAdmin: false,
         Login: "",
         Password: "",
    }
    const [state, setState] = useState(dto);

    return (<div>
            <div><TextField label={"login"} onChange={x=>OnChange(x, setState, state)} id={"Login"}></TextField></div>
            <div><TextField label={"password"} onChange={x=>OnChange(x, setState, state)} id={"Password"} ></TextField></div>
            <div><Checkbox id={"IsAdmin"} onChange={x=>OnChange(x, setState, state)}/></div>
            <div><Button onClick={x=> Registration(state)} variant="contained">Регситрация</Button></div>
    </div>);
}

const OnChange = (target: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setstate: any, state: any) => {
    const newState = {...state};
    console.log(target.target.value.toString())
    newState[target.currentTarget.id] = target.target.value.toString();
    setstate(newState);
    console.log(state);
}

const Registration = (dto: RegistrationDto) => {
    RegistrationRequest(dto).then(r => {
        if (r.IsError)
            alert(r.Message)
        return r;
    })
}

export default Login;