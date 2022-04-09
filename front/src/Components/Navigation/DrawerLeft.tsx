import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import {Link, Route, Routes} from "react-router-dom";
import {RequireAuth} from "../ProtectedRoutes/RequiredAuth";
import {RoomList} from "../Rooms/RoomList";
import {AccountBox} from "@mui/icons-material";

const drawerWidth = 240;

export const DrawerLeft: React.FC = () => {
    return <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <AppBar
            position="fixed"
            sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Permanent drawer
                </Typography>
            </Toolbar>
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
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem button component={Link} to={"/rooms"} key={'Комнаты'}>
                    <ListItemIcon>
                        <GroupIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Комнаты'}/>
                </ListItem>

                <ListItem button component={Link} to={"/assignments"} key={'Задания'}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Задания'}/>
                </ListItem>

                <ListItem button component={Link} to={"/profile"} key={'Профиль'}>
                    <ListItemIcon>
                        <AccountBox/>
                    </ListItemIcon>
                    <ListItemText primary={'Профиль'}/>
                </ListItem>
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
        >
            <Toolbar/>

            <Routes>
                <Route path="profile" element={<div>Profile page</div>} />
                <Route path="assignments" element={<div>Assignment page</div>} />
                <Route path="rooms" element={<RequireAuth><RoomList/></RequireAuth>}/>
                <Route path="rooms/:roomId" element={<div>Room inner page</div>}/>
            </Routes>

        </Box>
    </Box>;
}
