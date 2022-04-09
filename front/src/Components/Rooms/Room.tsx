import React from "react";
import {Room} from "../../Models/Room";
import {Box, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const RoomItem: React.FC<{
    room: Room;
}> = ({room}) => {
    const navigate = useNavigate()
    return <Box
        onClick={() => {
            navigate("/rooms/" + room.id)
        }}
        sx={{
            m: 1,
            bgcolor: '#FAFAFA',
            color: 'grey.800',
            minWidth: "300px",
            boxShadow: '1',
            borderRadius: 2,
            ":hover": {
                cursor: 'pointer',
                boxShadow: '3'
            }
        }}>
        <div style={{
            flexDirection: 'column',
            minWidth: '200px',
        }}>
            <h2 style={{
                margin: 0,
                padding: '10px',
                textAlign: 'left'
            }}>{room.name}</h2>
            <Divider/>
            <p style={{
                margin: 0,
                padding: '10px',
                textAlign: 'left'
            }}>Преподаватель: {room.ownerName}</p>
        </div>
    </Box>
}
