import type { IBaseEntity } from "./IBaseEntity"

export interface IWorker extends IBaseEntity {
    jobPositionId: string | null
    workScheduleId: string | null
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    price: number | null
    unitName: string | null
    serviceDuration: string | null
}