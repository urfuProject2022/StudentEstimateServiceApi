import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./Components/Authorization/Login";
import {RequireAuth} from "./Components/ProtectedRoutes/RequiredAuth";
import {AuthProvider} from "./Components/ProtectedRoutes/AuthProvider";
import {Registration} from "./Components/Authorization/Registration";
import {Home} from "./Components/ProtectedRoutes/Home";


function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/" element={<RequireAuth><Home/></RequireAuth>}/>
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
