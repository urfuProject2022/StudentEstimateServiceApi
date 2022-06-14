import React, {useMemo, useState} from "react";
import {Button, Modal, TextField, Typography} from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/material/Box";
import {useSaveAssignmentMutation} from "../../QueryFetches/ApiHooks";
import "../../Styles/Modal.css"
import {Assignment} from "../../Models/Assignment";
import {DateTimePicker} from "@mui/x-date-pickers";
import {
    BackgroundTintStyle,
    dashedStyleWithColor,
    ModalStyle,
    RoundedStyle
} from "../../Styles/SxStyles";
import {addMinutes} from "date-fns";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsVariantOverrides} from "@mui/material/Button/Button";
import {useSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";

export const AddAssignmentButton: React.FC<{
    roomId: string,
    variant?: OverridableStringUnion<'box' | 'button', ButtonPropsVariantOverrides>
}> = ({roomId, variant}) => {

    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme()
    const dashedStyle = useMemo(() => dashedStyleWithColor(theme), [theme])

    const [modalVisible, setModalVisible] = useState(false)
    const [assignment, setAssignment] = useState<Assignment>({
        title: "",
        description: "",
        expirationTime: "",
        gradeCount: 4
    })

    const [date, setDate] = useState<Date | null>(
        addMinutes(new Date(), 10)
    );

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAssignment({...assignment, [prop]: event.target.value});
    };

    const saveMutation = useSaveAssignmentMutation(roomId, ()=> enqueueSnackbar("Задание успешно создано!", {variant: "success"}))

    const onSubmit = async (assignmentName: string, assignmentDescription: string, expirationTime: string, gradeCount: number) => {
        let assignment: Assignment = {
            title: assignmentName,
            description: assignmentDescription,
            expirationTime: expirationTime,
            gradeCount: gradeCount
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
                    multiline
                    maxRows={5}
                    label={"Описание"}
                    onChange={handleChange("description")}
                    id={"desc"}/>

                <TextField
                    type={"number"}
                    label={"Количество оценок"}
                    value={assignment.gradeCount}
                    onChange={handleChange("gradeCount")}
                    inputProps={{
                        step: 1,
                        min: 1,
                        max: 30,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                />

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
                        onClick={async () => await onSubmit(assignment.title, assignment.description, date.toISOString(), assignment.gradeCount)}
                        type="submit">
                    Создать
                </Button>
            </Box>
        </Modal>
    </>
}