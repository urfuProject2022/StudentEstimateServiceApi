import React, {useState} from "react";
import {useAssignmentQuery} from "../../ApiHooks/roomsApiHooks";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack, TextField, Typography} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";

export const AssignmentPage: React.FC = () => {
    const {assignmentId} = useParams()
    const {data: assignment, isLoading} = useAssignmentQuery(assignmentId)
    const [workText, setWorkText] = useState("");

    return <>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <>
                <Stack spacing={2}>
                    <Typography variant={"h3"}>{assignment.title}</Typography>
                    <Typography variant={"h5"}>{assignment.description}</Typography>
                    <TextField label={"Ваша работа"} multiline autoFocus value={workText} minRows={4} maxRows={10}
                               onChange={x => setWorkText(x.target.value)}/>
                </Stack>
            </>}
    </>
}