import React, {useMemo} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import {AssignmentUserPage} from "./AssignmentUserPage";
import {AssignmentStatistics} from "./AssignmentStatistics";
import {useAssignmentQuery} from "../../QueryFetches/ApiHooks";
import {ErrorPage} from "../Error/ErrorPage";
import {CircularProgress, Stack} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {HeaderCard} from "../Common/HeaderCard";


export const AssignmentPage: React.FC = () => {
    const auth = useAuth()
    const {roomId, assignmentId} = useParams()
    const {data: assignment, isLoading, isError} = useAssignmentQuery(assignmentId)

    if (isError) {
        return <ErrorPage/>
    }

    if (isLoading) {
        return <CircularProgress sx={CircularProgressStyle}/>
    }

    return <>
        <Stack spacing={2}>
            <HeaderCard title={assignment.title} description={assignment.description} isEditAvailable={auth.user.role == "Admin"}/>
        {auth.user.role == "Admin" ? <AssignmentStatistics assignmentId={assignmentId}/> :
            <AssignmentUserPage assignment={assignment} roomId={roomId}/>
        }
        </Stack>
    </>
}