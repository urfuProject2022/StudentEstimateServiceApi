import React, {useMemo} from "react";
import {Card} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Typography from "@mui/material/Typography";
import {Assignment} from "../../Models/Assignment";
import {format} from 'date-fns-tz'
import {parseISO, differenceInDays} from "date-fns";
import { red } from '@mui/material/colors';
import {
    animatedStyleWithColor, borderStyleWithColor,
    MediumSizeIcon,
    RoundedStyle
} from "../../Styles/SxStyles";
import {useTheme} from "@mui/material/styles";

export const AssignmentItem: React.FC<{
    assignment: Assignment;
}> = ({assignment}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const colorStyle = useMemo(() => animatedStyleWithColor(theme), [theme])
    const borderStyle = useMemo(() => borderStyleWithColor(theme), [theme])

    const assignmentDate = useMemo(() => parseISO(assignment.expirationTime), [assignment])
    const utcDate = useMemo(() => format(assignmentDate, 'dd.MM.yyyy HH:mm'), [assignmentDate])
    const diffInDays = useMemo(() => differenceInDays(assignmentDate, new Date()),[])

    return <Card
        onClick={() => {
            navigate(`${location.pathname}/assignments/${assignment.id}`)
        }}
        sx={{
            m: 0,
            px: 2,
            py: 2,
            bgcolor: '#fefefe',
            color: 'grey.900',
            ...RoundedStyle,
            ...borderStyle,
            ...colorStyle
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
                }}>{assignment.title}</Typography>

                <Typography variant={"body1"} color={diffInDays >= 1 ? "#616161" : red["500"]}>
                    Дедлайн: {utcDate}
                </Typography>
            </div>
            <ArrowForwardRoundedIcon sx={MediumSizeIcon}/>
        </div>
    </Card>
}
