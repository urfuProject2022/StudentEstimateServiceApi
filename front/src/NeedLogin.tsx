import React, {ReactComponentElement, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Router, Routes, useNavigate} from "react-router-dom";
import {Checkbox, TextField} from "@mui/material";
import settings from "./settings.json";
import { getCookie, setCookie } from 'typescript-cookie'

const NeedLogin = () => {

    return (<div>
        <TextField label={"AUTHED"}>AUTHORIZED</TextField>
    </div>);
}
export default NeedLogin;