import React, {useEffect, useMemo, useState} from 'react';
import '../../App.css';
import {Button, Card, createTheme, FormControlLabel, Radio, RadioGroup, TextField, ThemeProvider} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import {RegistrationModel} from "../../Models/RegistrationModel";
import {BackgroundTintStyle} from "../../Styles/SxStyles";
import {blue, red} from "@mui/material/colors";


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

    const [color, setColor] = useState(blue[700].toString())
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    primary: {main: color},
                },
            }),
        [color],
    );

    useEffect(() => {
        setColor(model.role == "Admin" ? red[500] : blue[700])
    }, [model.role])


    const location = useLocation();
    // @ts-ignore
    const from = location.state?.from || "/rooms";

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModel({...model, [prop]: event.target.value});
    };

    const onRegister = (model: RegistrationModel) => {
        auth.register(model)
            .then(async resp => {
                if (!resp.ok) {
                    let errorMessage = await resp.text()
                    setErrorMessage(errorMessage)
                } else {
                    navigate("/rooms")
                }
            })
    }

    return <div className="auth-container">
        <ThemeProvider theme={theme}>
            <Card variant={"outlined"} className="auth-card" sx={BackgroundTintStyle}>
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
                        <FormControlLabel value="Admin" control={<Radio/>} label="Преподаватель"/>
                        <FormControlLabel value="User" control={<Radio/>} label="Студент"/>
                    </RadioGroup>
                    <Button onClick={() => onRegister(model)}
                            variant="contained"
                            disabled={!(model.password && model.login && model.fullName)}>Зарегистрироваться</Button>
                    <Button variant="outlined"
                            onClick={() => navigate("/login", {state: from})}
                            type="submit">Войти</Button>
                </div>
                <div className="error">{errorMessage}</div>
            </Card>
        </ThemeProvider>
    </div>
}