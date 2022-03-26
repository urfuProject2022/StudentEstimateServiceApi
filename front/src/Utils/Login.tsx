
import settings from "../settings.json";


export const Auth = (login: string, password:string) => {
    return  fetch(settings.serverEndpoint + "/Auth/Login", {
        method: "POST",
        headers: {
            'login': login,
            'password': password
        },
    });
}

export const Auth2 = async (login: string, password:string) => {
    var r = new FormData;
    r.append('login', login);
    r.append('password', password);
    console.log(login + " "+ password)
    const respData = await fetch(settings.serverEndpoint + "/Auth/token", {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-My-Custom-Header': login,
            'X-password': password,
            'Access-Control-Allow-Origin': '*',
        }), mode: "no-cors"
    }).then(resp=>resp.json())
    return respData;
}