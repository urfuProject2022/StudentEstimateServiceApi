import React from "react";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {useRoomQuery} from "../../ApiHooks/roomsApiHooks";
import Typography from "@mui/material/Typography";
import {UserList} from "../Users/UserList";
import {AssignmentList} from "../Assignments/AssignmentList";
import {RoomOwnerCard} from "./RoomOwnerCard";

export const RoomInnerPage: React.FC = () => {
    const {roomId} = useParams()
    const {data: room, isLoading} = useRoomQuery(roomId)

    return <div>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <Stack spacing={2}>
                <Typography variant={"h3"}>{room.name}</Typography>
                <Typography variant={"h5"}>{room.description}</Typography>
                <AssignmentList roomId={roomId}/>
                <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
                    <UserList roomId={roomId} inviteLink={room.inviteLink}/>
                    <RoomOwnerCard ownerName={room.ownerName}/>
                </Stack>
            </Stack>}
    </div>
}