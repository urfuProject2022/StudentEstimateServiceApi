import React, {useEffect, useState} from "react";
import {Button, Card, IconButton, Modal, Stack, Slider, Input, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Work} from "../../Models/Work";
import {FullScreenStyle, GrayBorderStyle, MediumSizeIcon, ModalStyle, SmallSizeIcon} from "../../Styles/SxStyles";
import Box from "@mui/material/Box";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {TextFieldWrapper} from "./WorkUploadCard";
import {SelectedFilesChipList} from "../Common/SelectedFilesChipList";
import {_base64ToArrayBuffer} from "../../Utils/Common";
import {saveAs} from "file-saver";
import {OnHoverColoredWithShadowStyle, RoundedStyle} from "../../Styles/SxStyles";
import {setGradeRequest} from "../../Utils/Requests";
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import {useSnackbar} from "notistack";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";


export const WorkToGradeItem: React.FC<{
    work: Work,
    index: number,
    assignmentId: string
    onSubmit: () => void
}> = ({work, index, assignmentId, onSubmit}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [comment, setComment] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [grade, setGrade] = useState<number | string | Array<number | string>>(30);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        if (!modalVisible || selectedFiles.length > 0) return

        const decodedFiles = work.fileAnswers.map(work => {
            const decoded = _base64ToArrayBuffer(work.content)
            return new File([decoded], work.name, {type: work.type})
        })

        setSelectedFiles(decodedFiles)
    }, [modalVisible])

    const onSave = (file: File) => {
        saveAs(file, file.name)
    }

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setGrade(newValue);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGrade(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (grade < 0) {
            setGrade(0);
        } else if (grade > 100) {
            setGrade(100);
        }
    }

    const onSubmitGrade = () => {
        onSubmit()
        setGradeRequest((grade as number), work.workId, assignmentId, comment)
            .then(r => {
                setIsSubmitted(true)
                setModalVisible(false)
                enqueueSnackbar("Работа оценена!", {variant: "success"})
            })
            .catch(() => enqueueSnackbar("Что-то пошло не так", {variant: "error"}))
    }

    return <>
        <Card onClick={() => setModalVisible(true)}
              sx={{
                  m: 0,
                  px: 2,
                  py: 2,
                  bgcolor: '#fcfcfc',
                  color: 'grey.900',
                  boxShadow: 0,
                  ...GrayBorderStyle,
                  ...RoundedStyle,
                  ...OnHoverColoredWithShadowStyle
              }}>
            <div style={{
                display: "flex",
                width: '100%',
                padding: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <div style={{
                    padding: 0,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Typography variant={"h5"} sx={{
                        flex: 1,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}>Работа №{index}</Typography>

                </div>
                {isSubmitted ?
                    <DoneRoundedIcon sx={MediumSizeIcon}/>
                    : <RateReviewRoundedIcon sx={MediumSizeIcon}/>
                }
            </div>
        </Card>

        <Modal
            disableAutoFocus
            open={modalVisible}
            onClose={() => setModalVisible(false)}>
            <Box className="modal" sx={[ModalStyle, FullScreenStyle]}>
                <Stack spacing={4}>
                    <Stack spacing={2} direction={"row"}>

                        <Typography id="modal-modal-title" flexGrow={1} variant="h4" alignSelf={"center"}>
                            Работа №{index}
                        </Typography>

                        <IconButton onClick={() => setModalVisible(false)}>
                            <CloseRoundedIcon sx={MediumSizeIcon}/>
                        </IconButton>

                    </Stack>

                    <Stack spacing={4} direction={"row"}>
                        <Stack spacing={2} flexBasis={"50%"}>
                            <TextFieldWrapper label={"Текст работы"} multiline value={work.textAnswer}
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

                        <Stack spacing={2} flexBasis={"50%"}>

                            <Typography variant={"h5"}>Ваша оценка</Typography>
                            <Stack direction={"row"} spacing={4}>
                                <Slider
                                    value={typeof grade === 'number' ? grade : 0}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                />

                                <Input
                                    value={grade}
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Stack>

                            <TextFieldWrapper label={"Комментарий"} multiline value={comment}
                                              onChange={x => setComment(x.target.value)}
                                              rows={5} autoFocus/>

                            <Button variant={"contained"} size={"large"} disabled={isSubmitted}
                                    onClick={() => onSubmitGrade()}>Отправить
                                оценку</Button>

                        </Stack>
                    </Stack>

                </Stack>
            </Box>
        </Modal>
    </>
}