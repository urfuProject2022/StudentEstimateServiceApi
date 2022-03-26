
import settings from "../settings.json";
import {RegistrationDto} from "../Registration";


export const Auth = (login: string, password:string) => {
    return  fetch(settings.serverEndpoint + "/auth/Login", {
        method: "POST",
        headers: {
            'login': login,
            'password': password
        },
    });
}

export const RegistrationRequest = async (registrationDto: RegistrationDto) => {
    return  await fetch(settings.serverEndpoint + "/Auth/register", {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(registrationDto)
    }).then(resp=>resp.json())
}