import React, {useState} from "react";
import {Button, Modal, TextField, Typography} from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/material/Box";
import {useSaveAssignmentMutation} from "../../ApiHooks/roomsApiHooks";
import "../../Styles/Modal.css"
import {Assignment} from "../../Models/Assignment";
import {DateTimePicker} from "@mui/x-date-pickers";
import {ModalStyle} from "../../Styles/SxStyles";
import {addMinutes} from "date-fns";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsVariantOverrides} from "@mui/material/Button/Button";
import {useTheme} from "@mui/material/styles";

export const AddAssignmentButton: React.FC<{
    roomId: string,
    variant?: OverridableStringUnion<'box' | 'button', ButtonPropsVariantOverrides>
}> = ({roomId, variant}) => {
    const theme = useTheme()

    const [modalVisible, setModalVisible] = useState(false)
    const [assignment, setAssignment] = useState<Assignment>({
        title: "",
        description: "",
        expirationTime: "",
    })
    const [date, setDate] = React.useState<Date | null>(
        addMinutes(new Date(), 10)
    );

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAssignment({...assignment, [prop]: event.target.value});
    };

    const saveMutation = useSaveAssignmentMutation(roomId)

    const onSubmit = async (assignmentName: string, assignmentDescription: string, expirationTime: string) => {
        let assignment: Assignment = {
            title: assignmentName,
            description: assignmentDescription,
            expirationTime: expirationTime
        }
        await saveMutation.mutateAsync(assignment)
        setModalVisible(false)
    }

    return <>
        {variant === "box" &&
            <Box
                onClick={() => setModalVisible(true)}
                sx={{
                    m: 0,
                    p: 4,
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
        }
        {variant === "button" &&
            <Button onClick={() => setModalVisible(true)}
                    size="large" variant="contained">Добавить задание</Button>
        }
        <Modal
            disableAutoFocus
            open={modalVisible}
            onClose={() => setModalVisible(false)}>
            <Box className="modal" sx={ModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Создание задания
                </Typography>
                <TextField
                    label={"Название"}
                    onChange={handleChange("title")}
                    id={"login"}
                    autoFocus={true}/>
                <TextField
                    label={"Описание"}
                    onChange={handleChange("description")}
                    id={"desc"}/>


                <DateTimePicker
                    label={"Срок сдачи"}
                    renderInput={(params) => <TextField {...params} />}
                    value={date}
                    minDateTime={new Date()}
                    inputFormat="dd.MM.yyyy HH:mm"
                    onChange={(newValue) => {
                        setDate(newValue);
                    }}
                />

                <Button variant={"contained"}
                        disabled={!assignment.title}
                        onClick={async () => await onSubmit(assignment.title, assignment.description, date.toISOString())}
                        type="submit">
                    Создать
                </Button>
            </Box>
        </Modal>
    </>
}