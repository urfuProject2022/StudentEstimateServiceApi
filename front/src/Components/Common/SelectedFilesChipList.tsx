import React from "react";
import {Chip, Stack, Typography} from "@mui/material";
import {saveAs} from "file-saver";

export const SelectedFilesChipList: React.FC<{
    files: File[]
    onDelete?: (file: File) => void
    isDeletable: boolean
}> = ({files, onDelete, isDeletable}) => {

    const onSave = (file: File) => {
        saveAs(file, file.name)
    }

    return <Stack direction={"row"} flexWrap={"wrap"} columnGap={2} rowGap={2}>
        {files.map((file: File) => <Chip
            onClick={() => onSave(file)}
            label={<Typography noWrap>{file.name}</Typography>}
            key={file.name + file.size}
            onDelete={isDeletable ? () => onDelete(file) : null}/>)}
    </Stack>
}
