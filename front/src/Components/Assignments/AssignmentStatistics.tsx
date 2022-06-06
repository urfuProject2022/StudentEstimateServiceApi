import React from "react";
import {Card, CardContent, LinearProgress, Stack} from "@mui/material";
import {RoundedStyle} from "../../Styles/SxStyles";
import Typography from "@mui/material/Typography";
import {useAssignmentStatistics} from "../../QueryFetches/ApiHooks";
import {AssignmentUserStat} from "../../Models/Statistics/AssignmentStatUserRecord";
import {UserStatItem} from "./UserStatItem";

export const AssignmentStatistics: React.FC<{
    assignmentId: string
}> = ({assignmentId}) => {
    const {data: assignmentStat, isLoading} = useAssignmentStatistics(assignmentId)

    return <>
        <Card variant={"outlined"} sx={RoundedStyle}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">Статистика задания</Typography>

                    {isLoading ? <LinearProgress/> :
                        assignmentStat.users.map((assignmentStat: AssignmentUserStat) =>
                            <UserStatItem assignmentUserStat={assignmentStat} key={assignmentStat.userId}
                                          assignmentId={assignmentId}/>)
                    }
                </Stack>
            </CardContent>
        </Card>
    </>
}