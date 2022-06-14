import React, {useMemo, useState} from "react";
import {Button, Modal, TextField, Typography} from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/material/Box";
import {Room} from "../../Models/Room";
import {useSaveRoomMutation} from "../../QueryFetches/ApiHooks";
import "../../Styles/Modal.css"
import {
    BackgroundTintStyle,
    dashedStyleWithColor,
    ModalStyle,
    RoundedStyle
} from "../../Styles/SxStyles";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsVariantOverrides} from "@mui/material/Button/Button";
import {useSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";

export const AddRoomButton: React.FC<{
    variant?: OverridableStringUnion<'box' | 'button', ButtonPropsVariantOverrides>
}> = ({variant}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [roomDesc, setRoomDesc] = useState("")

    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme()
    const dashedStyle = useMemo(() => dashedStyleWithColor(theme), [theme])

    const saveMutation = useSaveRoomMutation(() => enqueueSnackbar("Комната успешно создана!", {variant: "success"}))

    const onSubmit = async (roomName: string, roomDescription: string) => {
        let room: Room = {name: roomName, description: roomDescription}
        await saveMutation.mutateAsync(room)
        setModalVisible(false)
    }

    return <>
        {variant === "box" &&
            <Box
                onClick={() => setModalVisible(true)}
                sx={{
                    m: 0,
                    minHeight: '20vh',
                    ...BackgroundTintStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: '0.5',
                    ...dashedStyle,
                    ...RoundedStyle,
                    boxShadow: 0,
                    ":hover": {
                        cursor: 'pointer',
                        opacity: '1',
                        boxShadow: 1
                    }
                }}>
                <AddRoundedIcon sx={{
                    width: '48px',
                    height: '48px',
                }}/>
            </Box>
        }
        {variant === "button" &&
            <Button onClick={() => setModalVisible(true)}
                    size="large" variant="contained">Создать комнату</Button>}
        <Modal
            disableAutoFocus
            open={modalVisible}
            onClose={() => setModalVisible(false)}>
            <Box className="modal" sx={ModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Создание комнаты
                </Typography>
                <TextField
                    label={"Название"}
                    onChange={x => setRoomName(x.target.value)}
                    id={"login"}
                    autoFocus={true}/>
                <TextField
                    multiline
                    maxRows={5}
                    label={"Описание"}
                    onChange={x => setRoomDesc(x.target.value)}
                    id={"desc"}/>

                <Button variant={"contained"}
                        disabled={!roomName}
                        onClick={async () => await onSubmit(roomName, roomDesc)}
                        type="submit">
                    Создать
                </Button>
            </Box>
        </Modal>
    </>
}