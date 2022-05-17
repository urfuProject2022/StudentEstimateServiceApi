import React, {useState} from "react";
import {Button, Card, CardContent, Chip, Stack, styled, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import Dropzone from "react-dropzone";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import {Work} from "../../Models/Work";
import {submitWorkRequest} from "../../Utils/Requests";
import delay from "delay";

export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 8px;
  }
`;

export const WorkUploadCard: React.FC<{
    assignmentId: string
    roomId: string
}> = ({assignmentId, roomId}) => {
    const [workText, setWorkText] = useState("");
    const [isUploading, setIsUploading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    const onFileDrop = (acceptedFiles: File[]) => {
        const uniqueFiles = selectedFiles.concat(acceptedFiles).filter((f1, pos, arr) =>
            arr.findIndex((f2) => f2.name === f1.name) === pos)
        setSelectedFiles(uniqueFiles)
    }

    const onDelete = (selectedFile: File) => {
        setSelectedFiles(selectedFiles.filter((file) => selectedFile !== file))
    }

    const onSubmit = async () => {
        const work: Work = {
            assignmentId: assignmentId,
            roomId: roomId,
            textAnswer: workText,
            fileAnswers: selectedFiles
        }
        setIsUploading(true)
        await delay(2500)
        submitWorkRequest(work).then(_ => {
            setIsDisabled(true)
            setIsUploading(false)
        })
    }

    return <Card variant={"outlined"} sx={{borderRadius: 2}}>
        <CardContent>
            <Stack spacing={2}>

                <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>

                    <Typography variant="h5" component="div">Ваша работа</Typography>
                    <LoadingButton
                        onClick={() => onSubmit()}
                        endIcon={<SendIcon/>}
                        loading={isUploading}
                        disabled={isDisabled}
                        loadingPosition="end"
                        variant="contained"
                        sx={{alignSelf: "center"}}
                    >
                        Отправить
                    </LoadingButton>
                </Stack>

                <Stack direction={"row"} spacing={2}>
                    <TextFieldWrapper label={"Текст работы"} multiline autoFocus value={workText}
                                      InputProps={{readOnly: isDisabled}}
                                      rows={15}
                                      onChange={x => setWorkText(x.target.value)}
                                      sx={{flexBasis: "42%"}}/>

                    <Stack maxWidth={"58%"} spacing={2} sx={{flexBasis: "58%"}}>
                        <Dropzone disabled={isDisabled} onDrop={acceptedFiles => onFileDrop(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <Card variant={"outlined"} sx={{
                                            borderRadius: 2,
                                            ":hover": {
                                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                cursor: 'pointer'
                                            }
                                        }}>
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

                                                <Button disabled={isDisabled} variant={"outlined"}>Выбрать
                                                    файлы</Button>
                                            </Stack>
                                        </Card>
                                    </div>
                                </section>
                            )}
                        </Dropzone>

                        <Stack direction={"row"} flexWrap={"wrap"} columnGap={2} rowGap={2}>
                            {selectedFiles.map((file: File) => <Chip label={<Typography noWrap>{file.name}</Typography>}
                                                                     key={file.name + file.size}
                                                                     onDelete={() => onDelete(file)}/>)}
                        </Stack>

                    </Stack>
                </Stack>

            </Stack>
        </CardContent>
    </Card>
}