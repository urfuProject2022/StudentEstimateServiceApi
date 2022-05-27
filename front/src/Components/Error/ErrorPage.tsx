import React from "react";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import {LargeSizeIcon} from "../../Styles/SxStyles";

export const ErrorPage: React.FC = () => {
    return <Stack spacing={2} alignItems={"center"} justifyContent={"center"} height={"70%"}>
        <ErrorOutlineRoundedIcon sx={LargeSizeIcon}/>
        <Typography variant={"h4"}>Что-то пошло не так, или страница не найдена</Typography>
    </Stack>
}