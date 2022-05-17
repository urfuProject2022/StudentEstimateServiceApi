import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Card, CircularProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useRoomQuery} from "../../ApiHooks/roomsApiHooks";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import Divider from "@mui/material/Divider";
import {acceptInviteRequest} from "../../Utils/Requests";

export const InviteAcceptPage: React.FC = () => {
    const {search} = useLocation()
    const queryParams = new URLSearchParams(search);
    const roomId = queryParams.get("roomId");

    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const {data: room, isLoading} = useRoomQuery(roomId)

    const onClick = () => {
        acceptInviteRequest(roomId)
            .then(_ => {
                navigate(`../../rooms/${roomId}`, { replace: true })
            })
            .catch(error => {
                setErrorMessage(error.response.data)
            })
    }

    return <>
        {isLoading ? <CircularProgress sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'}}
            /> :
            <Card variant={"outlined"} sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: 2,
                maxWidth: 500,
                minWidth: 450
            }}>

                <Stack spacing={2} sx={{
                    p: 4
                }}>
                    <Typography variant={"h4"}>Приглашение</Typography>
                    <Divider/>
                    <Typography variant={"h5"}>Комната: {room.name}</Typography>
                    <Typography variant={"h6"} sx={{pb: 1}}>Преподаватель: {room.ownerName}</Typography>

                    <Button size={"large"} variant={"contained"} onClick={onClick}>Вступить</Button>
                    {errorMessage.length > 0 && <Typography variant={"body1"} align={"center"} color={"red"}>{errorMessage}</Typography>}
                </Stack>
            </Card>
        }
    </>
}