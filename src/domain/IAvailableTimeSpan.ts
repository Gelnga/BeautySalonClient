import type { IBaseEntity } from "./IBaseEntity"

export interface IAvailableTimeSpan extends IBaseEntity {
    availableStartTime: string
    availableEndTime: string
}