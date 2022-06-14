import type { IBaseEntity } from "./IBaseEntity"

export interface IAppUser extends IBaseEntity {
    firstName: string
    lastName: string
    email: string
    workerId?: string
    roles?: string[]
}