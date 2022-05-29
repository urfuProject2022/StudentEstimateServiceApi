import {FileDto} from "./FileDto";

export type Work = {
    workId: string,
    textAnswer: string,
    fileAnswers: FileDto[]
}