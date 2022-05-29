import settings from "../settings.json";
import {RegistrationModel} from "../Models/RegistrationModel";
import {SubmitWork} from "../Models/SubmitWork";
import axios from "axios";

export const loginRequest = (login: string, password: string) => {
    return fetch(settings.serverEndpoint + "/auth/login", {
        method: "POST",
        headers: {
            'login': login,
            'password': password
        },
    });
}

export const registrationRequest = (registrationDto: RegistrationModel) => {
    return fetch(settings.serverEndpoint + "/auth/register", {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(registrationDto)
    })
}

export const signedInUserRequest = () => {
    return fetch(settings.serverEndpoint + "/users/me", {
        method: 'GET'
    })
}

export const submitWorkRequest = (work: SubmitWork) => {
    let formData = new FormData();
    formData.append("AssignmentId", work.assignmentId)
    formData.append("RoomId", work.roomId)
    formData.append("TextAnswer", work.textAnswer)
    work.fileAnswers.forEach(file => formData.append("FileAnswers", file))
    return axios.post('works/submit', formData, {
        headers: {"Content-Type": "multipart/form-data"}
    })
}

export const acceptInviteRequest = (roomId: string) => {
    return axios.get(`invites/accept?roomId=${roomId}`)
}

export const setGradeRequest = (score: number, gradedWorkId: string, assignmentId: string) => {
    return axios.post('grade/set', {score, gradedWorkId, assignmentId})
}