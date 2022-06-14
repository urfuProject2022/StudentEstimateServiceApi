import {useMutation, useQuery, useQueryClient} from "react-query"
import axios, {AxiosError} from "axios";
import {Room} from "../Models/Room";
import delay from "delay"
import {Assignment} from "../Models/Assignment";
import {User} from "../Models/User";
import {Work} from "../Models/Work";
import {BatchWorksToGrade} from "../Models/BatchWorksToGrade";
import {RoomInfo} from "../Models/RoomInfo";
import {AssignmentStatistics} from "../Models/Statistics/AssignmentStatistics";
import {WorkStatistics} from "../Models/Statistics/WorkStatistics";

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

export const useGradedUserWorkQuery = (assignmentId: string, userId: string) => {
    return useQuery<Work, AxiosError>(["graded_work", `${assignmentId}${userId}`], async () => {
        await delay(500)
        const res = await axios.get(`works/userWork/${userId}?assignment=${assignmentId}`)
        return res.data
    }, {retry: false, enabled: false})
}

export const useWorksToGradeQuery = (assignmentId: string, roomId: string) => {
    return useQuery<BatchWorksToGrade, AxiosError>(["works", {assignmentId}], async () => {
        await delay(500)
        const res = await axios.get(`works/to-grade?assignment=${assignmentId}&room=${roomId}`)
        return res.data
    }, {retry: false})
}

export const useAssignmentStatistics = (assignmentId: string) => {
    return useQuery<AssignmentStatistics, AxiosError>(["assignment_stat", {assignmentId}], async () => {
        await delay(500)
        const res = await axios.get(`statistics/by-assignment?assignmentId=${assignmentId}`)
        return res.data
    }, {retry: false})
}

export const useWorkStatistics = (workId: string) => {
    return useQuery<WorkStatistics, AxiosError>(["work_stat", {workId}], async () => {
        await delay(500)
        const res = await axios.get(`statistics/by-work?workId=${workId}`)
        return res.data
    }, {retry: false})
}