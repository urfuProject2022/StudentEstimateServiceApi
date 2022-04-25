import {useMutation, useQuery, useQueryClient} from "react-query"
import axios, {AxiosError} from "axios";
import {Room} from "../Models/Room";
import delay from "delay"

export const useRoomsQuery = () => {
    return useQuery<Room[], AxiosError>('rooms', async () => {
        await delay(1500)
        const res = await axios.get('/rooms')
        return res.data
    })
}

export const useRoomQuery = (roomId: string) => {
    return useQuery<Room, AxiosError>(["rooms", {roomId}], async () => {
        await delay(1500)
        const res = await axios.get(`/rooms/${roomId}`)
        return res.data
    })
}

export const useSaveRoomMutation = () =>{
    const queryClient = useQueryClient()

    return useMutation<Room, AxiosError, Room>(async (room) => {
        const res = await axios.post('/rooms', room)
        return res.data
    }, {
        onSuccess(data) {
            queryClient.setQueryData<Room[]>('rooms', rooms => {
                rooms.push(data)
                return [...rooms]
            })
        }
    })
}
