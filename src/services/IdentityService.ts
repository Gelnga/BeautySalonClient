import type { IJWTResponse } from "@/domain/IJWTResponse";
import httpClient from "@/http-client";
import { useIdentityStore } from "@/stores/Identity";
import type { AxiosError } from "axios";
import type { IErrorMsg, IServiceResult } from "./ServiceResult";

export class IdentityService {
    identityStore = useIdentityStore()

    async Register(email: string, password: string, firstName: string, lastName: string) :Promise<IServiceResult<IJWTResponse>> {
        try {
            let registerInfo = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            }
            let response = await httpClient.post(`/identity/account/register`, registerInfo)
            return { 
                status: response.status,
                data: response.data as IJWTResponse
            }
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error 
            }

            console.log((e as AxiosError).response);
            
            return res
        }
    }

    async Login(email: string, password: string): Promise<IServiceResult<IJWTResponse>> {
        try {
            let logInInfo = {
                email, password
            }
            let response = await httpClient.post(`/identity/account/login`, logInInfo)
            return { 
                status: response.status,
                data: response.data as IJWTResponse
            }
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error 
            }

            console.log((e as AxiosError).response);
            
            return res
        }

    }

    async refreshIdentity(): Promise<IServiceResult<IJWTResponse>> {
        try {
            let response = await httpClient.post(`/identity/account/refreshtoken`, {
                jwt: this.identityStore.$state.jwt?.jwt,
                refreshToken: this.identityStore.$state.jwt?.refreshToken
            })
            console.log(response)
            return { 
                status: response.status,
                data: response.data as IJWTResponse
            }
        } catch (e) {
            let res = {
                status: (e as AxiosError).response!.status,
                errorMsg: ((e as AxiosError).response!.data as IErrorMsg).error 
            }

            console.log((e as AxiosError).response);
            
            return res
        }
    }
}