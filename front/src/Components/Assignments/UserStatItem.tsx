import React, {useEffect, useState} from "react";
import {Card, CardContent, CircularProgress, IconButton, Modal, Stack} from "@mui/material";
import {
    CircularProgressStyle,
    FullScreenStyle,
    GrayBorderStyle, MediumSizeIcon,
    ModalStyle,
    OnHoverColoredWithShadowStyle,
    RoundedStyle, SmallSizeIcon
} from "../../Styles/SxStyles";
import Typography from "@mui/material/Typography";
import {AssignmentUserStat} from "../../Models/Statistics/AssignmentStatUserRecord";
import {WorkScore} from "../Common/WorkScore";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Box from "@mui/material/Box";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {TextFieldWrapper} from "../Works/WorkUploadCard";
import {SelectedFilesChipList} from "../Common/SelectedFilesChipList";
import {_base64ToArrayBuffer} from "../../Utils/Common";
import {saveAs} from "file-saver";
import {useGradedUserWorkQuery} from "../../QueryFetches/ApiHooks";
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import {GradesList} from "../Grades/GradesList";

export const UserStatItem: React.FC<{
    assignmentId: string
    assignmentUserStat: AssignmentUserStat
}> = ({assignmentId, assignmentUserStat}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const {data: work, refetch, isLoading} = useGradedUserWorkQuery(assignmentId, assignmentUserStat.userId)

    useEffect(() => {
        if (!modalVisible) return

        refetch().then(r => {
                const decodedFiles = r.data.fileAnswers.map(work => {
                    const decoded = _base64ToArrayBuffer(work.content)
                    return new File([decoded], work.name, {type: work.type})
                })

                setSelectedFiles(decodedFiles)
            }
        )


    }, [modalVisible])


    const onSave = (file: File) => {
        saveAs(file, file.name)
    }

    return <>
        <Card
            onClick={() => {
                if (!assignmentUserStat.isWorkSubmit) return null
                setModalVisible(true)
            }}
            sx={{
                m: 0,
                px: 2,
                py: 2,
                bgcolor: '#fcfcfc',
                color: 'grey.900',
                ...GrayBorderStyle,
                ...RoundedStyle,
                ...OnHoverColoredWithShadowStyle
            }}>
            <div style={{
                display: "flex",
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <div style={{
                    margin: '16px',
                    padding: 0,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Typography gutterBottom variant={"h5"} sx={{
                        flex: 1,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}>{assignmentUserStat.fullName}</Typography>


                    {assignmentUserStat.isWorkSubmit ?
                        <Stack direction={"row"} alignItems={"center"} spacing={"2px"}>
                            <Typography variant={"body1"} pr={0.5}>Работу оценили</Typography>
                            <PersonRoundedIcon sx={SmallSizeIcon}/>
                            <Typography variant={"body1"}
                                        fontWeight={"550"}>{assignmentUserStat.gradeSettersInfo.length}</Typography>
                        </Stack>
                        : <Typography variant={"body1"}>Работа не сдана</Typography>
                    }
                </div>
                <WorkScore score={assignmentUserStat.averageGrade}/>
            </div>
        </Card>

        <Modal
            disableAutoFocus
            open={modalVisible}
            onClose={() => setModalVisible(false)}>
            <Box className="modal" sx={[ModalStyle, FullScreenStyle]}>
                {!work || isLoading ? <CircularProgress sx={CircularProgressStyle}/> :
                    <Stack spacing={4} sx={{height: "100%"}}>
                        <Stack spacing={2} direction={"row"}>

                            <Typography id="modal-modal-title" flexGrow={1} variant="h4" alignSelf={"center"}>
                                {assignmentUserStat.fullName}
                            </Typography>

                            <IconButton onClick={() => setModalVisible(false)}>
                                <CloseRoundedIcon sx={MediumSizeIcon}/>
                            </IconButton>

                        </Stack>

                        <Stack spacing={4} direction={"row"} alignItems={"flex-start"} sx={{height: "100%"}}>
                            <Stack spacing={2} flexBasis={"50%"}>
                                <TextFieldWrapper label={"Текст работы"} focused multiline value={work.textAnswer}
                                                  InputProps={{readOnly: true}}
                                                  rows={15}/>

                                <Card variant={"outlined"} sx={RoundedStyle}>
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Stack direction={"row"} spacing={1} justifyContent={"space-between"}>
                                                <Typography variant={"h5"}>Прикрепленные файлы</Typography>

                                                <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
                                                    <AttachFileRoundedIcon sx={SmallSizeIcon}/>
                                                    <Typography variant={"body1"} fontWeight={"550"}>
                                                        {selectedFiles.length}
                                                    </Typography>

                                                </Stack>
                                            </Stack>
                                            <SelectedFilesChipList files={selectedFiles} onClick={onSave} isDeletable={false}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                            <GradesList gradeSettersInfo={assignmentUserStat.gradeSettersInfo}/>
                        </Stack>
                    </Stack>
                }
            </Box>
        </Modal>
    </>
}