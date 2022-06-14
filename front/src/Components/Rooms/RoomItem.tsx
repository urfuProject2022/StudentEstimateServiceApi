import React, {useMemo} from "react";
import {Room} from "../../Models/Room";
import {Card} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Typography from "@mui/material/Typography";
import "../../Styles/Auth.css"
import {
    MediumSizeIcon,
    RoundedStyle,
    animatedStyleWithColor, borderStyleWithColor
} from "../../Styles/SxStyles";
import {useTheme} from "@mui/material/styles";

export const RoomItem: React.FC<{
    room: Room;
}> = ({room}) => {
    const navigate = useNavigate()
    const theme = useTheme()
    const colorStyle = useMemo(() => animatedStyleWithColor(theme), [theme])
    const borderStyle = useMemo(() => borderStyleWithColor(theme), [theme])

    return <Card
        onClick={() => {
            navigate(`/rooms/${room.id}`)
        }}
        sx={{
            m: 0,
            px: 3,
            py: 2,
            bgcolor: '#fefefe',
            color: 'grey.900',
            ...borderStyle,
            ...RoundedStyle,
            ...colorStyle,
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
            <ArrowForwardRoundedIcon sx={MediumSizeIcon}/>
        </div>
    </Card>
}
