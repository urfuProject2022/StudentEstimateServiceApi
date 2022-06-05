import React from "react";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack, Button} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {useRoomQuery} from "../../QueryFetches/ApiHooks";
import Typography from "@mui/material/Typography";
import {UserList} from "../Users/UserList";
import {AssignmentList} from "../Assignments/AssignmentList";
import {RoomOwnerCard} from "./RoomOwnerCard";
import {ErrorPage} from "../Error/ErrorPage";
import {RoomEditButton} from "./RoomEditButton";

export const RoomInnerPage: React.FC = () => {
    const {roomId} = useParams()
    const {data: room, isLoading, isError} = useRoomQuery(roomId)

    if (isError) {
        return <ErrorPage/>
    }

    return <div>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <Stack spacing={2}>

                <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
                    <Typography variant={"h3"}>{room.name}</Typography>
                    <RoomEditButton roomId={room.id} desc={room.description}/>
                </Stack>
                <Typography variant={"h5"}>{room.description}</Typography>

                <AssignmentList roomId={roomId}/>
                <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
                    <UserList roomId={roomId} inviteLink={room.inviteLink.replace("/api", "")}/>
                    <RoomOwnerCard ownerName={room.ownerName}/>
                </Stack>
            </Stack>}
    </div>
}