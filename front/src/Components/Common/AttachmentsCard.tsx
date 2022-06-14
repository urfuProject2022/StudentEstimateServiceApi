import React from "react";
import {Card, CardContent, Stack} from "@mui/material";
import {RoundedStyle, SmallSizeIcon} from "../../Styles/SxStyles";
import Typography from "@mui/material/Typography";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import {SelectedFilesChipList} from "./SelectedFilesChipList";

export const AttachmentsCard: React.FC<{
    onDelete?: (file: File) => void,
    selectedFiles: File[],
    isDeletable: boolean
}> = ({selectedFiles, onDelete, isDeletable}) => {

    return <Card variant={"outlined"} sx={RoundedStyle}>
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
                <SelectedFilesChipList files={selectedFiles} isDeletable={isDeletable} onDelete={onDelete}/>
            </Stack>
        </CardContent>
    </Card>
}
