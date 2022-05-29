import React, {useState} from "react";
import {useAssignmentQuery, useSubmittedWorkQuery} from "../../QueryFetches/ApiHooks";
import {useParams} from "react-router-dom";
import {CircularProgress, Stack, Typography} from "@mui/material";
import {CircularProgressStyle} from "../../Styles/SxStyles";
import {WorkUploadCard} from "../Works/WorkUploadCard";
import {WorksToGradeList} from "../Works/WorksToGradeList";
import {useAuth} from "../ProtectedRoutes/AuthProvider";
import {ErrorPage} from "../Error/ErrorPage";


export const AssignmentPage: React.FC = () => {
    const auth = useAuth()
    const {roomId, assignmentId} = useParams()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const {data: assignment, isLoading, isError} = useAssignmentQuery(assignmentId)
    const {data: work, isLoading: isLoadingWork, isError: isErrorWork} = useSubmittedWorkQuery(assignmentId)

    if (isError) {
        return <ErrorPage/>
    }

    return <>
        {isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
            <>
                <Stack spacing={2}>
                    <Typography variant={"h3"}>{assignment.title}</Typography>
                    <Typography variant={"h5"}>{assignment.description}</Typography>
                    {auth.user.role == "Admin" ? <>
                            <div>Затычка для админа, тут будет список с работами всех юзеров</div>
                        </> :
                        <>
                            <WorkUploadCard assignmentId={assignmentId} roomId={roomId} work={work}
                                            isLoading={isLoadingWork}
                                            isError={isErrorWork}
                                            onSubmitted={() => setIsSubmitted(true)}/>
                            { (isSubmitted || (!isLoadingWork && !isErrorWork && work)) ?
                                <WorksToGradeList assignmentId={assignmentId} roomId={roomId}/>: <></>}
                        </>
                    }
                </Stack>
            </>}
    </>
}