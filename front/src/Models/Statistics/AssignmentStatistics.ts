import {AssignmentUserStat} from "./AssignmentStatUserRecord";

export type AssignmentStatistics = {
    title:string,
    description:string,
    expirationTime: string,
    users: AssignmentUserStat[]
}