import React from "react";
import {RoomItem} from "./Room";
import {Room} from "../../Models/Room";
import {Box} from "@mui/material";

export const RoomList: React.FC = () => {
    const room: Room = {name: "Тестовая комната", id: "123", ownerName: "Иван Иванович"}
    return <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            p: 1,
            m: 1,
            bgcolor: '#f0f2f5',
            borderRadius: 1,
        }}>
        <RoomItem room={room}/>
        <RoomItem room={room}/>
        <RoomItem room={room}/>
        <RoomItem room={room}/>
        <RoomItem room={room}/>
        <RoomItem room={room}/>
    </Box>
}