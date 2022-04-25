import React from "react";
import {useParams} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {useRoomQuery} from "../../ApiHooks/roomsApiHooks";
import Typography from "@mui/material/Typography";

export const RoomInnerPage: React.FC = () => {
    const {roomId} = useParams()
    const {data: room, isLoading} = useRoomQuery(roomId)

    return <div>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column'
            }}>
                <Typography variant={"h4"}>{room.name}</Typography>
                <Typography variant={"h5"}>{room.description}</Typography>


            </div>}
    </div>
}