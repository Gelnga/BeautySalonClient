import httpClient from "@/http-client";
import { useIdentityStore } from "@/stores/Identity";
import type { AxiosError } from "axios";
import type { VueCookies } from "vue-cookies";
import { IdentityService } from "./IdentityService";
import type { IErrorMsg, IServiceResult } from "./ServiceResult";

export class BaseService<TEntity> {
    identityStore = useIdentityStore()
    identityService = new IdentityService()

    constructor(public path: string, private cookies: VueCookies | null) {
    }

    async refreshIdentity() {
        try {
            if (typeof (this.cookies) == "undefined") return
            if (this.cookies == null) return

            this.identityStore.jwt = {
                "jwt": "",
                "refreshToken": ""
            }

            this.identityStore.jwt!.jwt = this.cookies.get("JWT")
            this.identityStore.jwt.refreshToken = this.cookies.get("refreshToken")

            let refreshResponse = await this.identityService.refreshIdentity()
            this.identityStore.$state.jwt = refreshResponse.data!

            console.log(refreshResponse.data)

            this.cookies.set("JWT", this.identityStore.jwt?.jwt)
            this.cookies.set('refreshToken', this.identityStore.jwt?.refreshToken)
        } catch (e) {
            return
        }

    }

    async getAllAuthorize(): Promise<TEntity[]> {

        await this.refreshIdentity()
        return await this.getAll()
    }

    async getAll(): Promise<TEntity[]> {
        try {
            let response = await httpClient.get(`/${this.path}`, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
            let res = response.data as TEntity[]
            console.log(res)
            return res

        } catch (e) {
            console.log(e)
            return []
        }
    }

    async get(id: String): Promise<TEntity> {
        await this.refreshIdentity()
        let response = await httpClient.get(`/${this.path}/${id}`, {
            headers: {
                "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
            }
        })
        let res = response.data as TEntity
        console.log(res)
        return res
    }

    async add(entity: TEntity): Promise<IServiceResult<void>> {
        let response
        try {
            await this.refreshIdentity()
            response = await httpClient.post(`/${this.path}`, entity, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error
            }
            console.log((e as AxiosError).response);
            return res
        }

        return { status: response.status }
    }

    async delete(id: string): Promise<IServiceResult<void>> {
        let response
        try {
            await this.refreshIdentity()
            response = await httpClient.delete(`/${this.path}/${id}`, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error
            }
            console.log((e as AxiosError).response);
            return res
        }

        return { status: response.status }
    }

    async put(id: String, entity: TEntity): Promise<IServiceResult<void>> {
        let response
        try {
            await this.refreshIdentity()
            response = await httpClient.put(`/${this.path}/${id}`, entity, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error
            }
            console.log((e as AxiosError).response);
            return res
        }

        return { status: response.status }
    }
}