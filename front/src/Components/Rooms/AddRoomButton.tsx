import React, {useState} from "react";
import {Button, Modal, TextField, Typography} from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/material/Box";
import {Room} from "../../Models/Room";
import {useSaveRoomMutation} from "../../ApiHooks/roomsApiHooks";
import "../../Styles/Modal.css"

export const AddRoomButton: React.FC = () => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        borderRadius: '8px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        padding: '32px',
    };

    const [modalVisible, setModalVisible] = useState(false)
    const [roomName, setRoomName] = useState("")

    const saveMutation = useSaveRoomMutation()

    const onSubmit = async (roomName: string) => {
        let room: Room = {name: roomName}
        await saveMutation.mutateAsync(room)
        setModalVisible(false)
    }

    return <>
        <Box
            onClick={() => {
                setModalVisible(true);
            }}
            sx={{
                m: 1,
                minHeight: '20vh',
                bgcolor: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'grey.800',
                boxShadow: '1',
                borderRadius: 2,
                ":hover": {
                    cursor: 'pointer',
                    boxShadow: '3'
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
            onClose={() => {
                setModalVisible(false)
            }}>
            <Box className="modal" sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Введите название комнаты
                </Typography>
                <TextField
                    label={"Название"}
                    onChange={x => setRoomName(x.target.value)}
                    id={"login"}
                    autoFocus={true}/>
                <Button variant={"contained"}
                        disabled={!roomName}
                        onClick={async () => await onSubmit(roomName)}
                        type="submit">
                    Создать
                </Button>
            </Box>
        </Modal>
    </>
}