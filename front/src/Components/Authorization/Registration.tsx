import React, {useState} from 'react';
import '../../App.css';
import {Button, Card, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import {RegistrationModel} from "../../Models/RegistrationModel";


export const Registration = () => {
    const [model, setModel] = useState<RegistrationModel>(
        {
            fullName: "",
            role: "Admin",
            login: "",
            password: "",
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
                <TextField label="ФИО" onChange={handleChange("fullName")} id={"fullName"}/>
                <TextField label="Логин" onChange={handleChange("login")} id={"login"}/>
                <TextField label="Пароль" onChange={handleChange("password")} type="password" id={"password"}/>
                <RadioGroup
                    className="radio"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={model.role}
                    onChange={handleChange("role")}
                >
                    <FormControlLabel value="Admin" control={<Radio/>} label="Admin"/>
                    <FormControlLabel value="User" control={<Radio/>} label="User"/>
                </RadioGroup>
                <Button onClick={() => onRegister(model)}
                        variant="contained"
                        disabled={!(model.password && model.login && model.fullName)}>Зарегистрироваться</Button>
            </div>
            <div className="error">{errorMessage}</div>
        </Card>
    </div>
}