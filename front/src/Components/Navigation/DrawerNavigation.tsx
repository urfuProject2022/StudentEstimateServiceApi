import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {RequireAuth} from "../ProtectedRoutes/RequiredAuth";
import {RoomList} from "../Rooms/RoomList";
import {AccountBox} from "@mui/icons-material";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import {Button, ListItemButton} from "@mui/material";
import {RoomInnerPage} from "../Rooms/RoomInnerPage";

const drawerWidth = 240;

export const DrawerNavigation: React.FC = () => {
    const auth = useAuth()
    const listItemStyle = {px: 3};

    const [selectedPage, setSelectedPage] = useState(getCurrentLocation())

    return <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <AppBar
            color="inherit"
            elevation={0}
            position="fixed"
            sx={{
                width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,
                bgcolor: '#FFF'
            }}
        >
            <Toolbar sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
            }}>
                <Typography variant="h6" noWrap flexGrow={1}>{selectedPage}</Typography>
                <Typography variant="body1" noWrap>
                    {auth.user ? auth.user.fullName : null}
                </Typography>
                <Button variant="outlined" onClick={() => auth.signOut()}>
                    Выйти
                </Button>
            </Toolbar>
            <Divider/>
        </AppBar>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">Сервис оценки</Typography>
            </Toolbar>
            <Divider/>
            <List>
                <ListItemButton selected={selectedPage === "Комнаты"} component={Link} to={"/rooms"}
                                key={'Комнаты'} sx={listItemStyle}
                                onClick={() => setSelectedPage("Комнаты")}>
                    <ListItemIcon>
                        <GroupIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Комнаты'}/>
                </ListItemButton>

                <ListItemButton selected={selectedPage === "Задания"} component={Link} to={"/assignments"}
                                key={'Задания'} sx={listItemStyle}
                                onClick={() => setSelectedPage("Задания")}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Задания'}/>
                </ListItemButton>

                <ListItemButton selected={selectedPage === "Профиль"} component={Link} to={"/profile"} key={'Профиль'}
                                sx={listItemStyle}
                                onClick={() => setSelectedPage("Профиль")}>
                    <ListItemIcon>
                        <AccountBox/>
                    </ListItemIcon>
                    <ListItemText primary={'Профиль'}/>
                </ListItemButton>
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
        >
            <Toolbar/>

            <Routes>
                <Route path="profile" element={<div>Profile page</div>}/>
                <Route path="assignments" element={<div>Assignment page</div>}/>
                <Route path="rooms" element={<RequireAuth><RoomList/></RequireAuth>}/>
                <Route path="rooms/:roomId" element={<RoomInnerPage/>}/>
                <Route path="/" element={<Navigate to="/rooms" replace/>}/>
            </Routes>

        </Box>
    </Box>;
}

const getCurrentLocation = () => {
    const path = window.location.pathname.split("/")[1]
    switch (path) {
        case "rooms":
            return "Комнаты"
        case "assignments":
            return "Задания"
        case "profile":
            return "Профиль"
    }

    return null
}