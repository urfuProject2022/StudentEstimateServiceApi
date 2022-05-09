import React, {useMemo} from "react";
import {Card} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Typography from "@mui/material/Typography";
import {Assignment} from "../../Models/Assignment";
import {format} from 'date-fns-tz'
import {parseISO} from "date-fns";

export const AssignmentItem: React.FC<{
    assignment: Assignment;
}> = ({assignment}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const utcDate = useMemo(() => format(parseISO(assignment.expirationTime), 'dd.MM.yyyy HH:mm'), [assignment])

    return <Card
        onClick={() => {
            navigate(`${location.pathname}/assignments/${assignment.id}`)
        }}
        sx={{
            m: 0,
            px: 2,
            py: 2,
            bgcolor: '#fcfcfc',
            color: 'grey.900',
            boxShadow: 0,
            border: 'solid 2px #ECEFF1',
            borderRadius: 2,
            ":hover": {
                cursor: 'pointer',
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                boxShadow: 1
            },
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

                <Typography variant={"body1"} color={"#616161"}>
                    Дедлайн: {utcDate}
                </Typography>
            </div>
            <ArrowForwardRoundedIcon sx={{
                width: '36px',
                height: '36px',
            }}/>
        </div>
    </Card>
}
