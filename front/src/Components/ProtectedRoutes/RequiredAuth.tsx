import {useAuth} from "./AuthProvider";
import {Navigate, useLocation} from "react-router-dom";


export function RequireAuth({children}: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.isAuthorized) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    return children;
}