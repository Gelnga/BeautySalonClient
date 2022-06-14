import type { IAppointment } from "./IAppointment";

export interface IAppointmentCachce extends IAppointment {
    serviceName: string
    masterName: string
    salonAddress: string
    salonName: string
}