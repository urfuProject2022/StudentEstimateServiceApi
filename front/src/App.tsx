import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./Components/Authorization/Login";
import {RequireAuth} from "./Components/ProtectedRoutes/RequiredAuth";
import {AuthProvider} from "./Components/ProtectedRoutes/AuthProvider";
import {Registration} from "./Components/Authorization/Registration";
import {QueryClient, QueryClientProvider} from "react-query";
import {DrawerLeft} from "./Components/Navigation/DrawerLeft";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="login" element={<Login/>}/>
                    <Route path="registration" element={<Registration/>}/>
                    <Route path="/*" element={<RequireAuth><DrawerLeft/></RequireAuth>}/>
                </Routes>
            </QueryClientProvider>
        </AuthProvider>
    );
}

export default App;
