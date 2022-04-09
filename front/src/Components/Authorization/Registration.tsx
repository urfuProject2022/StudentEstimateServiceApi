import React, {useState} from 'react';
import '../../App.css';
import {Button, Card, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";

export type RegistrationModel = {
    Role: string,
    Login: string,
    Password: string,
    FullName: string
}

export const Registration = () => {
    const [model, setModel] = useState<RegistrationModel>(
        {
            FullName: "",
            Role: "Admin",
            Login: "",
            Password: "",
        }
    )

    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const auth = useAuth()

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModel({...model, [prop]: event.target.value});
    };

    const onRegister = (model: RegistrationModel) => {
        auth.register(model)
            .then(async resp => {
                if (!resp.ok){
                    let errorMessage = await resp.text()
                    setErrorMessage(errorMessage)
                }
                else {
                    navigate("/rooms")
                }
        })
    }

    return <div className="auth-container">
        <Card variant={"outlined"} className="auth-card" sx={{background: "#FAFAFA"}}>
            <div className="auth">
                <TextField label="ФИО" onChange={handleChange("FullName")} id={"FullName"}/>
                <TextField label="Логин" onChange={handleChange("Login")} id={"Login"}/>
                <TextField label="Пароль" onChange={handleChange("Password")} type="password" id={"Password"}/>
                <RadioGroup
                    className="radio"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={model.Role}
                    onChange={handleChange("Role")}
                >
                    <FormControlLabel value="Admin" control={<Radio/>} label="Admin"/>
                    <FormControlLabel value="User" control={<Radio/>} label="User"/>
                </RadioGroup>
                <Button onClick={() => onRegister(model)}
                        variant="contained"
                        disabled={!(model.Password && model.Login && model.FullName)}>Зарегистрироваться</Button>
            </div>
            <div className="error">{errorMessage}</div>
        </Card>
    </div>
}