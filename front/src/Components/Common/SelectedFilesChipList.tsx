import React from "react";
import {Chip, Stack, Typography} from "@mui/material";

export const SelectedFilesChipList: React.FC<{
    files: File[]
    onClick: (file: File) => void
    onDelete?: (file: File) => void
    isDeletable: boolean
}> = ({files, onClick, onDelete, isDeletable}) => {

    return <Stack direction={"row"} flexWrap={"wrap"} columnGap={2} rowGap={2}>
        {files.map((file: File) => <Chip
            onClick={() => onClick(file)}
            label={<Typography noWrap>{file.name}</Typography>}
            key={file.name + file.size}
            onDelete={isDeletable ? () => onDelete(file) : null}/>)}
    </Stack>
}
