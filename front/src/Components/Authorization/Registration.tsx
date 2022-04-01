import React, {useState} from 'react';
import '../../App.css';
import {Button, Checkbox, TextField} from "@mui/material";
import {RegistrationRequest} from "../../Utils/Login";

export interface RegistrationDto {
    IsAdmin: number,
    Login: string,
    Password: string,
    FullName: string
}

const Login = () => {
    const dto: RegistrationDto = {
        FullName: "Vasya",
        IsAdmin: 0,
        Login: "",
        Password: "",
    }
    const [state, setState] = useState(dto);

    return (<div>
        <div><TextField label={"login"} onChange={x => OnChange(x, setState, state)} id={"Login"}/></div>
        <div><TextField label={"password"} onChange={x => OnChange(x, setState, state)} id={"Password"}/></div>
        <div><Checkbox id={"IsAdmin"} onChange={x => OnChange(x, setState, state)}/></div>
        <div><Button onClick={() => Registration(state)} variant="contained">Регситрация</Button></div>
    </div>);
}

const OnChange = (target: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setstate: any, state: any) => {
    const newState = {...state};
    newState[target.currentTarget.id] = target.target.value.toString();
    setstate(newState);
}

const Registration = (dto: RegistrationDto) => {
    RegistrationRequest(dto).then(r => {
        if (r.IsError)
            alert(r.Message)
        return r;
    })
}

export default Login;