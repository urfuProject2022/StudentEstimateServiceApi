import React, {useState} from "react";
import {Modal, Button, TextField} from "@mui/material";
import {ModalStyle} from "../../Styles/SxStyles";
import {useChangeRoomDescMutation, useDeleteRoomMutation} from "../../QueryFetches/ApiHooks";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";


export const RoomEditButton: React.FC<{
    roomId: string
    desc: string
}> = ({roomId, desc}) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [description, setDescription] = useState(desc)

    const navigate = useNavigate()
    const {enqueueSnackbar} = useSnackbar();
    const deleteMutation = useDeleteRoomMutation(() => enqueueSnackbar("Комната удалена!", {variant: "info"}))
    const changeDescMutation = useChangeRoomDescMutation(roomId)

    const onChange = async () => {
        await changeDescMutation.mutateAsync(description)
        setModalVisible(false)
    }

    const onDelete = async () => {
        await deleteMutation.mutateAsync(roomId)
        setModalVisible(false)
        navigate('/rooms')
    }

    return <>
        <Button onClick={() => setModalVisible(true)}
                variant="contained">Изменить комнату</Button>

        <Modal
            disableAutoFocus
            open={modalVisible}
            onClose={() => setModalVisible(false)}>
            <Box className="modal" sx={ModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Изменить комнату
                </Typography>

                <TextField
                    multiline
                    maxRows={5}
                    label={"Описание"}
                    onChange={(p) => setDescription(p.target.value)}
                    id={"desc"}/>

                <Button variant={"contained"}
                        onClick={async () => await onChange()}
                        type="submit">
                    Изменить описание
                </Button>

                <Button variant={"outlined"}
                        color={"error"}
                        onClick={async () => await onDelete()}>
                    Удалить комнату
                </Button>
            </Box>
        </Modal>
    </>
}