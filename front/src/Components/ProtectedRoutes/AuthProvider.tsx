import React from "react";
import {Auth} from "../../Utils/Login";
import {getCookie} from "typescript-cookie";
import {OperationResult} from "../../Utils/OperationResult";

interface IUserCookieState {
    HasCookie?: boolean,
}

interface AuthContextType {
    userCookieState: IUserCookieState;
    signIn: (login: string, password: string) => void;
    signOut: () => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({children}: { children: React.ReactNode }) {
    let cookie = getCookie("auth");
    let [user, setUser] = React.useState<IUserCookieState>({HasCookie: cookie !== undefined});

    let signInFunc = (login: string, password: string) => {
        return SetUserByAuth(login, password, setUser);
    };

    let signOutFunc = () => {
        return;
    };

    let value: AuthContextType = {userCookieState: user, signIn: signInFunc, signOut: signOutFunc};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const SetUserByAuth = (login: string, password: string, setUser: React.Dispatch<React.SetStateAction<IUserCookieState>>): Promise<OperationResult> => {
    let cookie = getCookie("auth");

    if (!cookie)
        return SetCookie(login, password);

    const success: OperationResult = {IsSuccess: true};
    return new Promise<OperationResult>(_ => success);

}

function SetCookie(login: string, password: string) {
    return Auth(login, password)
        .then(resp => resp.json())
        .then(resp => {
            if (resp.IsFail) {
                const result: OperationResult = {IsSuccess: false, Message: resp.ErrorMessage};
                return result;
            }

            const result: OperationResult = {IsSuccess: true, Message: undefined};
            return result;
        });
}

export function useAuth() {
    return React.useContext(AuthContext);
}