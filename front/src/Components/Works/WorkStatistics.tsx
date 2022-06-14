import {RoundedStyle, SmallSizeIcon} from "../../Styles/SxStyles";
import {Card, LinearProgress, Stack, Typography} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import React from "react";
import {useWorkStatistics} from "../../QueryFetches/ApiHooks";
import {WorkScore} from "../Common/WorkScore";

export const WorkStatistics: React.FC<{
    workId: string
}> = ({workId}) => {
    const {data: workStat, isLoading} = useWorkStatistics(workId)


    return <Card variant={"outlined"} sx={RoundedStyle}>
        <Stack spacing={2} p={2} direction={"row"} justifyContent={"space-between"}>
            <Stack spacing={2}>
                <Typography variant="h5" component="div">Средняя оценка</Typography>

                {isLoading ? <LinearProgress/> : <>

                    <Stack spacing={1} direction={"row"} alignItems={"center"}>
                        <Typography variant="h6">Вас оценили</Typography>

                        <Stack spacing={"2px"} direction={"row"}
                               justifyContent={"space-between"}>
                            <PersonRoundedIcon sx={SmallSizeIcon}/>
                            <Typography variant={"body1"}
                                        fontWeight={"550"}>{workStat.gradedByCount}</Typography>
                        </Stack>
                    </Stack>

                </>
                }
            </Stack>
            {!isLoading &&
                <Stack justifyContent={"center"}>
                    <WorkScore score={workStat.grade} variant={"standard"}/>
                </Stack>}
        </Stack>
    </Card>
}