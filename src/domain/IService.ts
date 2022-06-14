import type { IBaseEntity } from "./IBaseEntity"

export interface IService extends IBaseEntity {
    name: string
    description: string | null
    price: number | null
    unitName: string | null
}