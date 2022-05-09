import {useMutation, useQuery, useQueryClient} from "react-query"
import axios, {AxiosError} from "axios";
import {Room} from "../Models/Room";
import delay from "delay"
import {Assignment} from "../Models/Assignment";
import {User} from "../Models/User";

export const useRoomsQuery = () => {
    return useQuery<Room[], AxiosError>('rooms', async () => {
        await delay(500)
        const res = await axios.get('/rooms')
        return res.data
    })
}

export const useRoomQuery = (roomId: string) => {
    return useQuery<Room, AxiosError>(["rooms", {roomId}], async () => {
        await delay(500)
        const res = await axios.get(`/rooms/${roomId}`)
        return res.data
    })
}

export const useSaveRoomMutation = () => {
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

export const useAssignmentsQuery = (roomId: string) => {
    return useQuery<Assignment[], AxiosError>(["assignments", {roomId}], async () => {
        await delay(500)
        const res = await axios.get(`/assignments?roomId=${roomId}`)
        return res.data
    })
}

export const useAssignmentQuery = (assignmentId: string) => {
    return useQuery<Assignment, AxiosError>(["assignment", assignmentId], async () => {
        await delay(500)
        const res = await axios.get(`/assignments/${assignmentId}`)
        return res.data
    })
}

export const useSaveAssignmentMutation = (roomId: string) => {
    const queryClient = useQueryClient()

    return useMutation<Assignment, AxiosError, Assignment>(async (assignment) => {
        const res = await axios.post(`/assignments?roomId=${roomId}`, assignment)
        return res.data
    },{
        onSuccess(data) {
            queryClient.setQueryData<Assignment[]>(["assignments", {roomId}], assignments => {
                assignments.push(data)
                return [...assignments]
            })
        }
    })
}

export const useUsersQuery = (roomId: string) => {
    return useQuery<User[], AxiosError>(["users", {roomId}], async () => {
        await delay(500)
        const res = await axios.get(`/users?roomId=${roomId}`)
        return res.data
    })
}
