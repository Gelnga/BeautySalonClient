import type { IBaseEntity } from "./IBaseEntity"

export interface ISalon extends IBaseEntity {
    workScheduleId: string 
    name: string,
    description: string | null
    address: string
    googleMapsLink: string | null
    email: string | null
    phoneNumber: string | null
}