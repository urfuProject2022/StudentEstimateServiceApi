import React, {useState} from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./Components/Authorization/Login";
import {RequireAuth} from "./Components/ProtectedRoutes/RequiredAuth";
import {AuthProvider, useAuth} from "./Components/ProtectedRoutes/AuthProvider";
import {Registration} from "./Components/Authorization/Registration";
import {QueryClient, QueryClientProvider} from "react-query";
import {DrawerNavigation} from "./Components/Navigation/DrawerNavigation";
import axios from "axios";
import {
    LocalizationProvider,
} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {InviteAcceptPage} from "./Components/Invites/InviteAcceptPage";
import {SnackbarProvider} from "notistack";
import {Grow} from "@mui/material";

axios.defaults.baseURL = 'https://localhost:5001/api'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                    <SnackbarProvider anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }} TransitionComponent={Grow}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Routes>
                                <Route path="login" element={<Login/>}/>
                                <Route path="registration" element={<Registration/>}/>
                                <Route path="/*" element={<RequireAuth><DrawerNavigation/></RequireAuth>}/>
                                <Route path="invites/accept" element={<RequireAuth><InviteAcceptPage/></RequireAuth>}/>
                            </Routes>
                        </LocalizationProvider>
                    </SnackbarProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
