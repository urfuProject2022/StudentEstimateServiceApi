import {useNavigate} from "react-router-dom";

export const postRequest = async (url: string, body?: any) => {
    console.log("post request with body ", body)

    const curBody = body == undefined ? "" : JSON.stringify(body);
    console.log(curBody);
    const respData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: "no-cors",
        body: curBody
    }).then(response =>
    {
        if (response.status == 401) {
            useNavigate()("Login");
        }

        return response;
    }).then(response => response.json())
        .catch(err => console.log("an error occured whilte getting from " + url + ": " + err))

    return respData;
}

export const getRequest = async (url: string, headers: any) => {
    const respData = await fetch(url, {
        method: 'GET',
        mode: "no-cors",
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
    }).then(response=>
    {
        if (response.status ==401)
            useNavigate()("Login");
        return response;
    }).then(response =>response.json())
        .catch(err => console.log("an error occured whilte getting from " + url + ": " + err))

    return respData;
}