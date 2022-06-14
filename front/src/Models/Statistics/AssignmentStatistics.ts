import {AssignmentUserStat} from "./AssignmentUserStat";

export type AssignmentStatistics = {
    title:string,
    description:string,
    expirationTime: string,
    users: AssignmentUserStat[]
}