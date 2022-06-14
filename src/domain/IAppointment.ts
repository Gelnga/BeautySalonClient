import type { IBaseEntity } from "./IBaseEntity"

export interface IAppointment extends IBaseEntity {
    salonId: string
    serviceId: string
    workerId: string

    appointmentDate: string
    appointmentStart: string
    appointmentEnd: string

    price: string
}