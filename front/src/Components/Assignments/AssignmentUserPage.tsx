import React, {useState} from "react";
import {useSubmittedWorkQuery} from "../../QueryFetches/ApiHooks";
import {Stack} from "@mui/material";
import {WorkUploadCard} from "../Works/WorkUploadCard";
import {WorksToGradeList} from "../Works/WorksToGradeList";
import {Assignment} from "../../Models/Assignment";

export const AssignmentUserPage: React.FC<{
    assignment: Assignment
    roomId: string
}> = ({assignment, roomId}) => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const {data: work, isLoading: isLoadingWork, isError: isErrorWork} = useSubmittedWorkQuery(assignment.id)


    return <Stack spacing={2}>
        <WorkUploadCard assignment={assignment} roomId={roomId} work={work}
                        isLoading={isLoadingWork}
                        isError={isErrorWork}
                        onSubmitted={() => setIsSubmitted(true)}/>
        {(isSubmitted || (!isLoadingWork && !isErrorWork && work)) ?
            <WorksToGradeList assignmentId={assignment.id} roomId={roomId}/> : <></>}
    </Stack>
}