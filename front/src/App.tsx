import React, {ReactComponentElement} from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Router, Routes} from "react-router-dom";
import Login from "./Login";
import {useNavigate} from 'react-router-dom'
import NeedAuthComponent from "./NeedLogin";
import NeedLogin from "./NeedLogin";
import {RequireAuth} from "./Components/ProtectedRoutes/RequiredAuth";
import {AuthProvider} from "./Components/ProtectedRoutes/AuthProvider";
import Registration from "./Registration";


function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Routes>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path = "/Registration" element={<Registration/>}/>
                    <Route path="/" element={<RequireAuth><NeedLogin/></RequireAuth>}/>
                </Routes>
            </AuthProvider>

        </div>
    );
}

export default App;
