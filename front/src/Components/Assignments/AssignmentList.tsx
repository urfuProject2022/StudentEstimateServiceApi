import React from "react";
import {Card, CardContent, LinearProgress, Stack} from "@mui/material";
import {useAssignmentsQuery} from "../../ApiHooks/roomsApiHooks";
import {Assignment} from "../../Models/Assignment";
import {AssignmentItem} from "./AssignmentItem";
import Typography from "@mui/material/Typography";
import {AddAssignmentButton} from "./AddAssignmentButton";

export const AssignmentList: React.FC<{
    roomId: string
}> = ({roomId}) => {
    const {data: assignments, isLoading} = useAssignmentsQuery(roomId)

    return <>
        <Card variant="outlined" sx={{
            borderRadius: 2
        }}>
            <CardContent>
                {isLoading ? <LinearProgress/> :
                    <>
                        {assignments.length !== 0 ?
                            <Stack spacing={2}>
                                <Typography variant="h5" component="div">Задания</Typography>
                                {assignments.map((assignment: Assignment) =>
                                    <AssignmentItem key={assignment.id} assignment={assignment}/>
                                )}
                                <AddAssignmentButton roomId={roomId} variant={"box"}/>
                            </Stack> :
                            <Stack alignItems="center" justifyContent="center" spacing={2} sx={{
                                py: 4
                            }}>
                                <Typography variant="h4">В комнате ещё нет заданий</Typography>
                                <AddAssignmentButton variant="button" roomId={roomId}>Добавить задание</AddAssignmentButton>
                            </Stack>
                        }
                    </>
                }
            </CardContent>
        </Card>
    </>
}