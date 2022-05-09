import React from "react";
import {Avatar, Card, ListItem, ListItemAvatar, ListItemText, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import TelegramIcon from '@mui/icons-material/Telegram';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import {useTheme} from '@mui/material/styles';


export const RoomOwnerCard: React.FC<{
    ownerName: string
}> = ({ownerName}) => {
    const theme = useTheme();

    return <>
        <Card variant="outlined" sx={{
            flexBasis: "50%",
            borderRadius: 2,
        }}>
            <Typography gutterBottom variant="h5" component="div" padding={2}
                        paddingBottom={0}>Преподаватель</Typography>
            <Stack>
                <div style={{
                    paddingLeft: '8px'
                }}>
                    <ListItem key={ownerName}>
                        <ListItemAvatar>
                            <Avatar sx={{backgroundColor: theme.palette.primary.main}}>
                                <AccountCircleIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={ownerName}
                        />
                    </ListItem>
                </div>

                <Typography gutterBottom variant="h6" component="div" padding={2}
                            paddingBottom={0}>Контакты</Typography>

                <Stack sx={{
                    paddingLeft: 1,
                }}>
                    <ListItem key={"phone"}>
                        <ListItemAvatar>
                            <Avatar sx={{backgroundColor: theme.palette.primary.light}}>
                                <PhoneRoundedIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={"+7(999)6665544"}
                        />
                    </ListItem>
                    <ListItem key={"telegram"}>
                        <ListItemAvatar>
                            <Avatar sx={{backgroundColor: theme.palette.primary.light}}>
                                <TelegramIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={"@sobaka"}
                        />
                    </ListItem>
                    <ListItem key={"email"}>
                        <ListItemAvatar>
                            <Avatar sx={{backgroundColor: theme.palette.primary.light}}>
                                <MailRoundedIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={"sobaka@mail.ru"}
                        />
                    </ListItem>
                </Stack>
            </Stack>
        </Card>
    </>
}