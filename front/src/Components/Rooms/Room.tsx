import React from "react";
import {Room} from "../../Models/Room";
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Typography from "@mui/material/Typography";

export const RoomItem: React.FC<{
    room: Room;
}> = ({room}) => {
    const navigate = useNavigate()
    return <Box
        onClick={() => {
            navigate("/rooms/" + room.id)
        }}
        sx={{
            m: 0,
            px: 3,
            py: 2,
            bgcolor: '#fcfcfc',
            color: 'grey.900',
            boxShadow: 0,
            border: 'solid 2px #ECEFF1',
            borderRadius: 2,
            ":hover": {
                cursor: 'pointer',
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                boxShadow: 1
            },
        }}>
        <div style={{
            display: "flex",
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <div style={{
                margin: '16px',
                padding: 0,
                flexGrow: 1,
                display: "flex",
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Typography variant={"body1"} color={"#9E9E9E"}>Преподаватель: {room.ownerName}</Typography>
                <Typography variant={"h4"} sx={{
                    flex: 1,
                    my: 2,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}>{room.name}</Typography>

                <Typography variant={"body1"} color={"#616161"}>
                    Количество заданий: {room.assignments.length}
                </Typography>
            </div>
            <ArrowForwardRoundedIcon sx={{
                width: '36px',
                height: '36px',
            }}/>
        </div>
    </Box>
}
