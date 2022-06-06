import React from "react";
import {RoundedStyle} from "../../Styles/SxStyles";
import {Button, Card, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Divider from "@mui/material/Divider";

export const HeaderCard: React.FC<{
    title:string
    description: string
    isEditAvailable: boolean
    onEditClick?: () => void
}> = ({title, description, isEditAvailable, onEditClick}) => {

    return <Card sx={{...RoundedStyle, width: "100%"}} variant={"outlined"}>
        <Stack spacing={2} p={4}>
            <Stack justifyContent={"space-between"} direction={"row"} sx={{maxWidth: "100%"}}>
                <Typography variant={"h3"}>{title}</Typography>
                {isEditAvailable &&
                    <Button onClick={onEditClick} variant={"outlined"}
                            startIcon={<EditRoundedIcon/>}>Редактировать</Button>
                }
            </Stack>
            <Divider/>
            <Typography variant={"h5"}>{description}</Typography>
        </Stack>
    </Card>
}