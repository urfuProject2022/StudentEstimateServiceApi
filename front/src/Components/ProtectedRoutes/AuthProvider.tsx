import React, {useEffect, useState} from "react";
import {getCookie, removeCookie} from "typescript-cookie";
import {LoginRequest, RegistrationRequest, SignedInUserRequest} from "../../Utils/Requests";
import {RegistrationModel} from "../Authorization/Registration";
import {User} from "../../Models/User";

interface AuthContextType {
    isAuthorized: boolean
    signIn: (login: string, password: string) => Promise<Response>
    signOut: () => void
    register: (dto: RegistrationModel) => Promise<Response>
    user: User
}

let AuthContext = React.createContext<AuthContextType>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    let cookie = getCookie("auth")
    let [cookieState, setCookieState] = useState(cookie !== undefined)
    let [user, setUser] = useState<User>(null)

    useEffect( () => {
        const fetchUser = async () => {
            if (cookieState){
                let user = await getSignedInUser()
                setUser(user)
            }
        }

        fetchUser()
    }, [cookieState])

    let getSignedInUser = async () => {
        let response = await SignedInUserRequest()
        let user: User = await response.json()
        return user
    }

    let signIn = (login: string, password: string) => {
        return LoginRequest(login, password)
            .then(resp => {
                if (resp.ok) {
                    setCookieState(true)
                }
                return resp
            })
    }

    let signOut = () => {
        removeCookie("auth")
        setCookieState(false)
    }

    let register = (dto: RegistrationModel) => {
        return RegistrationRequest(dto)
            .then(resp => {
                if (resp.ok) {
                    setCookieState(true)
                }
                return resp
            })
    }

    let value: AuthContextType = {
        isAuthorized: cookieState,
        signIn: signIn,
        signOut: signOut,
        register: register,
        user: user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}