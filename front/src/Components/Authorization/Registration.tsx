import React, {useState} from 'react';
import '../../App.css';
import {Button, Card, FormControlLabel, FormGroup, Radio, RadioGroup, TextField} from "@mui/material";
import {RegistrationRequest} from "../../Utils/Requests";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";

export type RegistrationDto = {
    Role: string,
    Login: string,
    Password: string,
    FullName: string
}

export const Registration = () => {
    const [dto, setDto] = useState<RegistrationDto>(
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
        setDto({...dto, [prop]: event.target.value});
    };

    const onRegister = (dto: RegistrationDto) => {
        RegistrationRequest(dto)
            .then(async resp => {
            if (!resp.ok){
                let errorMessage = await resp.text()
                setErrorMessage(errorMessage)
            }
            else {
                auth.setCookieState(true)
                navigate("/")
            }
        })
    }

    return <div className="auth-container">
        <Card variant={"outlined"} className="auth-card" sx={{background: "#FAFAFA"}}>
            <FormGroup  className="auth">
                <TextField label="ФИО" onChange={handleChange("FullName")} id={"FullName"}/>
                <TextField label="Логин" onChange={handleChange("Login")} id={"Login"}/>
                <TextField label="Пароль" onChange={handleChange("Password")} type="password" id={"Password"}/>
                <RadioGroup
                    className="radio"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={dto.Role}
                    onChange={handleChange("Role")}
                >
                    <FormControlLabel value="Admin" control={<Radio/>} label="Admin"/>
                    <FormControlLabel value="User" control={<Radio/>} label="User"/>
                </RadioGroup>
                <Button onClick={() => onRegister(dto)}
                        variant="contained"
                        disabled={!(dto.Password && dto.Login && dto.FullName)}>Зарегистрироваться</Button>
            </FormGroup>
            <div className="error">{errorMessage}</div>
        </Card>
    </div>
}