import React from "react";
import {useAssignmentQuery} from "../../ApiHooks/roomsApiHooks";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack, Typography} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";

import {WorkUploadCard} from "../Works/WorkUploadCard";


export const AssignmentPage: React.FC = () => {
    const {roomId, assignmentId} = useParams()
    const {data: assignment, isLoading} = useAssignmentQuery(assignmentId)

    return <>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <>
                <Stack spacing={2}>
                    <Typography variant={"h3"}>{assignment.title}</Typography>
                    <Typography variant={"h5"}>{assignment.description}</Typography>
                    <WorkUploadCard assignmentId={assignmentId} roomId={roomId}/>
                </Stack>
            </>}
    </>
}