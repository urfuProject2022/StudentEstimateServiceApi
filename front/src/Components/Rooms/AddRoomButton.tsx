import React, {useState} from "react";
import {Button, Modal, TextField, Typography} from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/material/Box";
import {Room} from "../../Models/Room";
import {useSaveRoomMutation} from "../../ApiHooks/roomsApiHooks";
import "../../Styles/Modal.css"
import {ModalStyle} from "../../Styles/SxStyles";
import {useTheme} from "@mui/material/styles";

export const AddRoomButton: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [roomDesc, setRoomDesc] = useState("")

    const saveMutation = useSaveRoomMutation()
    const theme = useTheme()

    const onSubmit = async (roomName: string, roomDescription: string) => {
        let room: Room = {name: roomName, description: roomDescription} 
        await saveMutation.mutateAsync(room)
        setModalVisible(false)
    }

    return <>
        <Box
            onClick={() => setModalVisible(true)}
            sx={{
                m: 0,
                minHeight: '20vh',
                bgcolor: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'dashed',
                borderColor: theme.palette.primary.light,
                opacity: '0.5',
                borderRadius: 2,
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
                    label={"Описание"}
                    onChange={x => setRoomDesc(x.target.value)}
                    id={"desc"} />

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