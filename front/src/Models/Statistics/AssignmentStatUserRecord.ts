import {AssignmentGradeSetterInfo} from "./AssignmentGradeSetterInfo";

export type AssignmentUserStat = {
    fullName: string,
    userId: string,
    isWorkSubmit: boolean,
    averageGrade: number,
    gradeSettersInfo: AssignmentGradeSetterInfo[]
}