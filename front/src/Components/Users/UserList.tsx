import React, {useState} from "react";
import List from "@mui/material/List";
import {
    Avatar,
    Card,
    Chip,
    LinearProgress,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Tooltip
} from "@mui/material";
import {useUsersQuery} from "../../QueryFetches/ApiHooks";
import {User} from "../../Models/User";
import Typography from "@mui/material/Typography";
import LinkIcon from '@mui/icons-material/Link';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import {RoundedStyle} from "../../Styles/SxStyles";

export const UserList: React.FC<{
    roomId: string
    inviteLink: string
}> = ({roomId, inviteLink}) => {
    const {data: users, isLoading} = useUsersQuery(roomId)
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const copyTextToClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }


    return <>
        <Card variant="outlined" sx={{
            flexBasis: "50%",
            ...RoundedStyle,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{display: "flex", justifyContent: "space-between", margin: 16, marginBottom: 0, gap: 16}}>
                <Typography gutterBottom variant="h5" component="div">Участники</Typography>
                <Tooltip title={"Ссылка скопирована!"} arrow
                         onClose={handleTooltipClose}
                         open={open}
                         disableHoverListener
                         disableTouchListener>
                    <Chip icon={<LinkIcon/>} onClick={() => copyTextToClipboard(inviteLink).then(handleTooltipOpen)}
                          label={"Пригласить студентов"} sx={{px: 1}}/>
                </Tooltip>
            </div>

            {isLoading ? <LinearProgress/> :
                <>
                    {users.length !== 0 ?
                        <List sx={{
                            paddingLeft: 1,
                            overflow: "auto",
                            maxHeight: "270px",
                            scrollbarWidth: 1
                        }}>
                            {users.map((user: User) =>
                                <ListItem key={user.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PermIdentityRoundedIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.fullName}
                                    />
                                </ListItem>
                            )}
                        </List> :
                        <Stack alignItems="center" justifyContent="center" spacing={2} direction={"row"} flexGrow={1}
                               sx={{
                                   py: 4
                               }}>
                            <GroupAddRoundedIcon sx={{width: "48px", height: "48px"}}/>
                            <Typography variant={"h5"} textAlign={"center"}>Поделитесь ссылкой, чтобы пригласить студентов</Typography>
                        </Stack>}
                </>
            }
        </Card>
    </>
}