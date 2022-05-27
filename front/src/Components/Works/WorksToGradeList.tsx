import React, {useEffect, useState} from "react";
import {Card, CardContent, LinearProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {WorkToGradeItem} from "./WorkToGradeItem";
import {useWorksToGradeQuery} from "../../QueryFetches/ApiHooks";
import {RoundedStyle} from "../../Styles/SxStyles";

export const WorksToGradeList: React.FC<{
    assignmentId: string
    roomId: string
}> = ({assignmentId, roomId}) => {
    const {data: batchWorks, isLoading} = useWorksToGradeQuery(assignmentId, roomId)
    const [gradedWorksCount, setGradedWorksCount] = useState(0)

    useEffect(() => {
        if (isLoading) return
        setGradedWorksCount(batchWorks.gradedWorksCount)
    }, [isLoading])

    return <>
        <Card variant={"outlined"} sx={RoundedStyle}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction={"row"}>
                        <Typography variant="h5" component="div" flexGrow={1}>Работы на проверку</Typography>
                        <Typography variant="h6"
                                    component="div">Проверено: {isLoading ? "" : `${gradedWorksCount}/${batchWorks.needToGradeWorksCount}`}</Typography>
                    </Stack>
                    {isLoading ? <LinearProgress/> : <>
                        {batchWorks.availableWorksToGrade.length > 0 ?
                            batchWorks.availableWorksToGrade.map((work, index) =>
                                <WorkToGradeItem onSubmit={() => setGradedWorksCount(gradedWorksCount + 1)}
                                                 key={work.workId} index={index + 1}
                                                 work={work} assignmentId={assignmentId}/>)
                            : <>
                                {batchWorks.gradedWorksCount == batchWorks.needToGradeWorksCount ?
                                    <Typography textAlign={"center"} variant={"h5"}>Все работы проверены!</Typography>
                                    : <Typography variant={"h6"}>Пока нет работ, готовых к проверке</Typography>
                                }
                            </>
                        }
                    </>
                    }
                </Stack>
            </CardContent>
        </Card>
    </>
}