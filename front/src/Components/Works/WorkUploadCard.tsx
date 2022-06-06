import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import Dropzone from "react-dropzone";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import {SubmitWork} from "../../Models/SubmitWork";
import delay from "delay";
import {Work} from "../../Models/Work";
import {_base64ToArrayBuffer} from "../../Utils/Common";
import {saveAs} from "file-saver";
import {submitWorkRequest} from "../../Utils/Requests";
import {SelectedFilesChipList} from "../Common/SelectedFilesChipList";
import {AnimatedSizeStyle, RoundedStyle} from "../../Styles/SxStyles";
import {useSnackbar} from "notistack";
import {differenceInMinutes, parseISO} from "date-fns";
import {Assignment} from "../../Models/Assignment";

export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 8px;
  }
`;

export const WorkUploadCard: React.FC<{
    assignment: Assignment
    roomId: string
    work?: Work
    isLoading: boolean
    isError: boolean
    onSubmitted: () => void
}> = ({assignment, roomId, work, isLoading, isError, onSubmitted}) => {
    //TODO: ЮЗЕР ДОЛЖЕН ВИДЕТЬ СВОЮ ОЦЕНКУ

    useEffect(() => {
        if (isLoading || isError || !work) return

        const selectedFiles = work.fileAnswers.map(work => {
            const decoded = _base64ToArrayBuffer(work.content)
            return new File([decoded], work.name, {type: work.type})
        })
        setSelectedFiles(selectedFiles)
        setIsEnabled(false)
        setWorkText(work.textAnswer || "")

    }, [isLoading])


    const [workText, setWorkText] = useState("");
    const [isUploading, setIsUploading] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const assignmentDate = useMemo(() => parseISO(assignment.expirationTime), [assignment])
    const diffInMinutes = useMemo(() => differenceInMinutes(assignmentDate, new Date()),[assignmentDate])

    const {enqueueSnackbar} = useSnackbar()

    const onFileDrop = (acceptedFiles: File[]) => {
        const uniqueFiles = selectedFiles.concat(acceptedFiles).filter((f1, pos, arr) =>
            arr.findIndex((f2) => f2.name === f1.name) === pos)
        setSelectedFiles(uniqueFiles)
    }

    const onDelete = (selectedFile: File) => {
        setSelectedFiles(selectedFiles.filter((file) => selectedFile !== file))
    }

    const onSave = (file: File) => {
        saveAs(file, file.name)
    }

    const onSubmit = async () => {
        const work: SubmitWork = {
            assignmentId: assignment.id,
            roomId: roomId,
            textAnswer: workText,
            fileAnswers: selectedFiles
        }
        setIsUploading(true)
        await delay(2500)
        submitWorkRequest(work).then(_ => {
            setIsEnabled(false)
            setIsUploading(false)
            onSubmitted()
            enqueueSnackbar("Работа успешно отправлена!", {variant: "success"})
        })
            .catch(_ => {
                setIsUploading(false)
                enqueueSnackbar("Что-то пошло не так", {variant: "error"})
            })
    }

    return <>
        <Card variant={"outlined"} sx={RoundedStyle}>
            <CardContent>
                {isLoading ? <LinearProgress/> :
                    <Stack spacing={2}>

                        <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>

                            <Typography variant="h5" component="div">Ваша работа</Typography>
                            <LoadingButton
                                onClick={() => onSubmit()}
                                endIcon={<SendIcon/>}
                                loading={isUploading}
                                disabled={!isEnabled || diffInMinutes <= 0}
                                loadingPosition="end"
                                variant="contained"
                                sx={{alignSelf: "center"}}
                            >
                                Отправить
                            </LoadingButton>
                        </Stack>

                        <Stack direction={"row"} spacing={2}>
                            <TextFieldWrapper label={"Текст работы"} multiline autoFocus value={workText}
                                              InputProps={{readOnly: !isEnabled}}
                                              rows={15}
                                              onChange={x => setWorkText(x.target.value)}
                                              sx={{flexBasis: "42%"}}/>

                            <Stack maxWidth={"58%"} spacing={2} sx={{flexBasis: "58%"}}>
                                <Dropzone disabled={!isEnabled} onDrop={acceptedFiles => onFileDrop(acceptedFiles)}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Card variant={"outlined"} sx={
                                                    [RoundedStyle,
                                                        AnimatedSizeStyle]
                                                }>
                                                    <Stack alignItems="center" justifyContent="center"
                                                           spacing={2}
                                                           sx={{
                                                               px: 4,
                                                               py: 4,
                                                           }}>
                                                        <DriveFolderUploadRoundedIcon sx={{
                                                            width: '42px',
                                                            height: '42px',
                                                        }}/>
                                                        <Typography variant={"body1"} textAlign={"center"}>
                                                            Перетащите сюда файлы или нажмите для
                                                            выбора</Typography>

                                                        <Button disabled={!isEnabled} variant={"outlined"}>Выбрать
                                                            файлы</Button>
                                                    </Stack>
                                                </Card>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>

                                <SelectedFilesChipList files={selectedFiles} onClick={onSave}
                                                       onDelete={onDelete} isDeletable={isEnabled}/>
                            </Stack>
                        </Stack>

                    </Stack>
                }
            </CardContent>
        </Card>
    </>
}
