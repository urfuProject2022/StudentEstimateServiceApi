import React from "react";
import {AssignmentGradeSetterInfo} from "../../Models/Statistics/AssignmentGradeSetterInfo";
import {RoundedStyle, SmallSizeIcon} from "../../Styles/SxStyles";
import {Card, CardContent, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {WorkScore} from "../Common/WorkScore";
import {TextFieldWrapper} from "../Works/WorkUploadCard";

export const GradesList: React.FC<{
    gradeSettersInfo: AssignmentGradeSetterInfo[]
}> = ({gradeSettersInfo}) => {

    return <Card variant={"outlined"} sx={{
        flexBasis: "50%",
        maxHeight: "90%",
        overflowY: "auto",
        ...RoundedStyle
    }}>
        <CardContent>
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={1} justifyContent={"space-between"}>
                    <Typography variant={"h5"}>Оценки проверяющих</Typography>
                    <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
                        <PersonRoundedIcon sx={SmallSizeIcon}/>
                        <Typography variant={"body1"} fontWeight={"550"}>
                            {gradeSettersInfo.length}
                        </Typography>
                    </Stack>
                </Stack>

                {gradeSettersInfo.map(gradeSetter => {
                    return <>
                        <Card variant={"outlined"} sx={RoundedStyle}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <Typography
                                            variant={"h6"}>{gradeSetter.gradeSetterFullName}</Typography>
                                        <WorkScore variant={"small"} score={gradeSetter.grade}/>
                                    </Stack>

                                    <TextFieldWrapper label={"Комментарий"} multiline
                                                      value={gradeSetter.comment}
                                                      InputProps={{readOnly: true}}
                                                      rows={3}/>
                                </Stack>
                            </CardContent>
                        </Card>
                    </>
                })}
            </Stack>

        </CardContent>
    </Card>
}