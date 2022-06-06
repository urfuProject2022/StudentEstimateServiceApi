import React, {useMemo} from "react";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {useRoomQuery} from "../../QueryFetches/ApiHooks";
import {UserList} from "../Users/UserList";
import {AssignmentList} from "../Assignments/AssignmentList";
import {RoomOwnerCard} from "./RoomOwnerCard";
import {ErrorPage} from "../Error/ErrorPage";
import {HeaderCard} from "../Common/HeaderCard";
import {useAuth} from "../ProtectedRoutes/AuthProvider";

export const RoomInnerPage: React.FC = () => {
    const {roomId} = useParams()
    const auth = useAuth()
    const {data: room, isLoading, isError} = useRoomQuery(roomId)

    if (isError) {
        return <ErrorPage/>
    }

    if (isLoading) {
        return <CircularProgress sx={CircularProgressStyle}/>
    }

    return <Stack spacing={2}>
        <HeaderCard title={room.name} description={room.description} isEditAvailable={auth.user.role == "Admin"}/>
        <AssignmentList roomId={roomId}/>
        <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
            <UserList roomId={roomId} inviteLink={room.inviteLink.replace("/api", "")}/>
            <RoomOwnerCard ownerName={room.ownerName}/>
        </Stack>
    </Stack>
}