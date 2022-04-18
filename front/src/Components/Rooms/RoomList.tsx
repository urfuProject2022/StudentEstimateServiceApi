import React from "react";
import {RoomItem} from "./Room";
import {Room} from "../../Models/Room";
import {CircularProgress, Grid} from "@mui/material";
import {useRoomsQuery} from "../../ApiHooks/roomsApiHooks";
import {AddRoomButton} from "./AddRoomButton";


export const RoomList: React.FC = () => {
    const {data: rooms, isLoading} = useRoomsQuery()

    return <Grid container
                 rowSpacing={'10'}
                 columns={{xs: 4, sm: 8, md: 12, lg:16}}
                 sx={{
                     p: 1,
                     m: 1,
                     bgcolor: '#f0f2f5',
                     borderRadius: 1,
                 }}>

        {isLoading ? <CircularProgress sx={{
            m: 5
        }}/> : rooms!.map((room: Room) =>
            <Grid item xs={2} sm={4} md={4} lg={4} key={room.id}>
                <RoomItem room={room}/>
            </Grid>)
        }
        {isLoading ? "" : <Grid item xs={2} sm={4} md={4} key={"add-button-key"}>
            <AddRoomButton />
        </Grid>
        }

    </Grid>
}