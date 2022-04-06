import React, {useState} from "react";
import {getCookie} from "typescript-cookie";

interface AuthContextType {
    cookieState: boolean
    setCookieState: React.Dispatch<React.SetStateAction<boolean>>
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({children}: { children: React.ReactNode }) {
    let cookie = getCookie("auth");
    let [cookieState, setCookieState] = useState(cookie !== undefined);

    let value: AuthContextType = {cookieState: cookieState, setCookieState: setCookieState};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}