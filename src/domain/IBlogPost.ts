import type { IBaseEntity } from "./IBaseEntity"

export interface IBlogPost extends IBaseEntity {
    workerId: string
    workerName?: string
    name: string | null
    content: string | null
}