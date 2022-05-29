import React, {useEffect, useState} from "react";
import {getCookie, removeCookie} from "typescript-cookie";
import {loginRequest, registrationRequest, signedInUserRequest} from "../../Utils/Requests";
import {User} from "../../Models/User";
import {RegistrationModel} from "../../Models/RegistrationModel";
import {useQueryClient} from "react-query";

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
    let queryClient = useQueryClient()
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
        let response = await signedInUserRequest()
        let user: User = await response.json()
        return user
    }

    let signIn = (login: string, password: string) => {
        return loginRequest(login, password)
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
        queryClient.removeQueries()
    }

    let register = (dto: RegistrationModel) => {
        return registrationRequest(dto)
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