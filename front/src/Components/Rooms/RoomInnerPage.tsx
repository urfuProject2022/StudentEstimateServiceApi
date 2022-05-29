import React from "react";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {useRoomQuery} from "../../QueryFetches/ApiHooks";
import Typography from "@mui/material/Typography";
import {UserList} from "../Users/UserList";
import {AssignmentList} from "../Assignments/AssignmentList";
import {RoomOwnerCard} from "./RoomOwnerCard";
import {ErrorPage} from "../Error/ErrorPage";

export const RoomInnerPage: React.FC = () => {
    const {roomId} = useParams()
    const {data: room, isLoading, isError} = useRoomQuery(roomId)

    if (isError) {
        return <ErrorPage/>
    }

    return <div>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <Stack spacing={2}>
                <Typography variant={"h3"}>{room.name}</Typography>
                <Typography variant={"h5"}>{room.description}</Typography>
                <AssignmentList roomId={roomId}/>
                <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
                    <UserList roomId={roomId} inviteLink={room.inviteLink.replace("/api", "")}/>
                    <RoomOwnerCard ownerName={room.ownerName}/>
                </Stack>
            </Stack>}
    </div>
}