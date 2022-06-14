import React from "react";
import {RoomItem} from "./RoomItem";
import {Room} from "../../Models/Room";
import {CircularProgress, Stack} from "@mui/material";
import {useRoomsQuery} from "../../QueryFetches/ApiHooks";
import {AddRoomButton} from "./AddRoomButton";
import {CircularProgressStyle, LargeSizeIcon} from "../../Styles/SxStyles";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import Typography from "@mui/material/Typography";
import {GroupsRounded} from "@mui/icons-material";

export const RoomList: React.FC = () => {
    const {data: rooms, isLoading} = useRoomsQuery()
    const auth = useAuth()

    if (isLoading) {
        return <CircularProgress sx={CircularProgressStyle}/>
    }

    return <>
        {auth.user.role === "Admin" ?
            <> {rooms.length > 0 ?
                <Stack spacing={3} padding={2} m={0}>
                    {rooms!.map((room: Room) =>
                        <RoomItem key={room.id} room={room}/>)}
                    <AddRoomButton variant={"box"} key={"add-button-key"}/>
                </Stack> :
                <Stack direction={"column"} spacing={1} sx={{mt: 17}} alignItems={"center"}
                       justifyContent={"center"}>
                    <GroupsRounded sx={LargeSizeIcon}/>
                    <Typography variant={"h4"} textAlign={"center"} pb={1}>Вы пока не создали
                        комнат</Typography>
                    <AddRoomButton key={"add-button-key"} variant={"button"}/>
                </Stack>
            }
            </> :
            <>
                {rooms.length > 0 ?
                    <Stack spacing={3} padding={2} m={0}>
                        {rooms!.map((room: Room) =>
                            <RoomItem key={room.id} room={room}/>)}
                    </Stack> :
                    <Stack direction={"column"} spacing={2} sx={{mt: 17}} alignItems={"center"}
                           justifyContent={"center"}>
                        <GroupsRounded sx={LargeSizeIcon}/>

                        <Typography variant={"h4"} textAlign={"center"}>Вы пока не
                            состоите ни в одной комнате</Typography>
                        <Typography variant={"h5"} textAlign={"center"}>Получите у преподавателя ссылку
                            для подключения</Typography>
                    </Stack>
                }
            </>}
    </>
}
