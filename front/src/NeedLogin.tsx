import React, {ReactComponentElement, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Router, Routes, useNavigate} from "react-router-dom";
import {Checkbox, TextField} from "@mui/material";
import settings from "./settings.json";
import { getCookie, setCookie } from 'typescript-cookie'

const NeedLogin = () => {
    Inner().then(r => r);
    return (<div>
        <TextField title={"AUTHED"}>AUTHORIZED</TextField>
    </div>);
}

const Inner = async () =>{
    var cookie = getCookie("auth");

    if (cookie) {
        return ;
    }

    useNavigate()("/Login");

    return  fetch(settings.serverEndpoint + "/users/1", {
        method: "GET",
        headers: {
        },
        redirect: "follow"
    }).then(resp=>
    {
        if (resp.redirected)
        {
            alert("redirected")
        }
    });
}

export default NeedLogin;