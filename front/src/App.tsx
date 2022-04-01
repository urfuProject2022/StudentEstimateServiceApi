import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./Components/Authorization/Login";
import NeedLogin from "./Components/Authorization/NeedLogin";
import {RequireAuth} from "./Components/ProtectedRoutes/RequiredAuth";
import {AuthProvider} from "./Components/ProtectedRoutes/AuthProvider";
import Registration from "./Components/Authorization/Registration";


function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Routes>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/Registration" element={<Registration/>}/>
                    <Route path="/" element={<RequireAuth><NeedLogin/></RequireAuth>}/>
                </Routes>
            </AuthProvider>

        </div>
    );
}

export default App;
