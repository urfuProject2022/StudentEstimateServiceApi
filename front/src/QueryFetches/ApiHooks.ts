import {useMutation, useQuery, useQueryClient} from "react-query"
import axios, {AxiosError} from "axios";
import {Room} from "../Models/Room";
import delay from "delay"
import {Assignment} from "../Models/Assignment";
import {User} from "../Models/User";
import {Work} from "../Models/Work";
import {BatchWorksToGrade} from "../Models/BatchWorksToGrade";
import {RoomInfo} from "../Models/RoomInfo";

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
    }, {retry: false})
}

export const useRoomInfoQuery = (roomId: string) => {
    return useQuery<RoomInfo, AxiosError>(["invite", {roomId}], async () => {
        await delay(500)
        const res = await axios.get(`rooms/${roomId}/info`)
        return res.data
    }, {retry: false})
}

export const useSaveRoomMutation = (onSuccess?: () => void) => {
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
            if (onSuccess) onSuccess()
        }
    })
}

export const useAssignmentsQuery = (roomId: string) => {
    return useQuery<Assignment[], AxiosError>(["assignments", {roomId}], async () => {
        await delay(500)
        const res = await axios.get(`/assignments?roomId=${roomId}`)
        return res.data
    }, {retry: false})
}

export const useAssignmentQuery = (assignmentId: string) => {
    return useQuery<Assignment, AxiosError>(["assignment", assignmentId], async () => {
        await delay(500)
        const res = await axios.get(`/assignments/${assignmentId}`)
        return res.data
    }, {retry: false})
}

export const useSaveAssignmentMutation = (roomId: string, onSuccess: () => void) => {
    const queryClient = useQueryClient()

    return useMutation<Assignment, AxiosError, Assignment>(async (assignment) => {
        const dto = {
            ...assignment,
            minGradeCountForWork: assignment.gradeCount,
            maxGradeCountForWork: assignment.gradeCount
        }
        const res = await axios.post(`/assignments?roomId=${roomId}`, dto)
        return res.data
    }, {
        onSuccess(data) {
            queryClient.setQueryData<Assignment[]>(["assignments", {roomId}], assignments => {
                assignments.push(data)
                return [...assignments]
            })
            if (onSuccess) onSuccess()
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

export const useSubmittedWorkQuery = (assignmentId: string) => {
    return useQuery<Work, AxiosError>(["work", {assignmentId}], async () => {
        await delay(500)
        const res = await axios.get(`works/userWork?assignment=${assignmentId}`)
        return res.data
    }, {retry: false})
}

export const useWorksToGradeQuery = (assignmentId: string, roomId: string) => {
    return useQuery<BatchWorksToGrade, AxiosError>(["works", {assignmentId}], async () => {
        await delay(500)
        const res = await axios.get(`works/to-grade?assignment=${assignmentId}&room=${roomId}`)
        return res.data
    }, {retry: false})
}

export const useDeleteRoomMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()

    return useMutation<Room, AxiosError, string>(async (roomId) => {
        const res = await axios.delete(`/rooms?roomId=${roomId}`)
        return res.data
    }, {
        onSuccess(data) {
            queryClient.setQueryData<Room[]>('rooms', rooms => {
                return rooms.filter(room => room.id != data.id)
            })
            if (onSuccess) onSuccess()
        }
    })
}

export const useChangeRoomDescMutation = (roomId: string, onSuccess?: () => void) => {
    const queryClient = useQueryClient()

    return useMutation<Room, AxiosError, string>(async (description) => {
        const res = await axios.get(`/rooms/descChange?roomId=${roomId}&description=${description}`)
        return res.data
    }, {
        onSuccess(data) {
            queryClient.setQueryData<Room>(["rooms", {roomId}], room => {
                return data;
            })
            if (onSuccess) onSuccess()
        }
    })
}