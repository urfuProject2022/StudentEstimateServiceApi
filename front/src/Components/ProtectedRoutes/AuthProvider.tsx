import React from "react";
import {Auth} from "../../Utils/Login";
import {getCookie, getCookies, setCookie} from "typescript-cookie";
import {OperationResult} from "../../Utils/OperationResult";

interface UserIdentity {
    Id?: string,
    Login?: string,
    HasCookie?: boolean,
}

interface AuthContextType {
    user: UserIdentity;
    signin: (login: string, password: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({children}: { children: React.ReactNode }) {
    let cookie = getCookie("auth");
    const hasCookie = cookie !=undefined && cookie !=null;
    let [user, setUser] = React.useState<UserIdentity>({HasCookie: hasCookie});

    let signin = (login: string, password: string, callback: VoidFunction) => {
        return SetUserByAuth(login, password, setUser);
    };

    let signout = (callback: VoidFunction) => {
        return;
    };

    let value = {user, signin, signout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const SetUserByAuth = (login: string, password: string, setUser: React.Dispatch<React.SetStateAction<UserIdentity>>): Promise<OperationResult> => {
    let cookie = getCookie("auth");

    if(!cookie)
        return SetCookie(login, password);

    const success: OperationResult = { IsSuccess:true};
    return new Promise<OperationResult>(_=>success);

}

function SetCookie(login: string, password: string) {
    return Auth(login, password)
        .then(resp=>resp.json())
        .then(resp=>{
        if (resp.IsFail)
        {
            const result: OperationResult = { IsSuccess:false, Message: resp.Message};
            return result;
        }

        const result: OperationResult = { IsSuccess:true, Message: undefined};
        return result;
    });
}

export function useAuth() {
    return React.useContext(AuthContext);
}