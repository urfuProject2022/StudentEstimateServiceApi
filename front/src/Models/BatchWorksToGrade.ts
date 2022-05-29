import {Work} from "./Work";

export type BatchWorksToGrade = {
    needToGradeWorksCount: number
    gradedWorksCount: number
    availableWorksToGrade: Work[]
}