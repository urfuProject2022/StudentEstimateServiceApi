import settings from "../settings.json";
import {RegistrationDto} from "../Components/Authorization/Registration";


export const LoginRequest = (login: string, password: string) => {
    return fetch(settings.serverEndpoint + "/auth/login", {
        method: "POST",
        headers: {
            'login': login,
            'password': password
        },
    });
}

export const RegistrationRequest = (registrationDto: RegistrationDto) => {
    return fetch(settings.serverEndpoint + "/auth/register", {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(registrationDto)
    })
}