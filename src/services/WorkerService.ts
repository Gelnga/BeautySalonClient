import type { IAppointment } from "@/domain/IAppointment";
import type { IAvailableTimeSpan } from "@/domain/IAvailableTimeSpan";
import type { IWorker } from "@/domain/IWorker";
import httpClient from "@/http-client";
import type { VueCookies } from "vue-cookies";
import { BaseService } from "./BaseService";

export default class workerService extends BaseService<IWorker> {
    constructor(cookies: VueCookies) {
        super("workers", cookies);
    }

    async getWorkerAvailableTimes(workerId: String, appointmentDate: string, serviceDuration: string): Promise<IAvailableTimeSpan[]> {
        try {
            this.refreshIdentity()
            let response = await httpClient.get(`/${this.path}/${workerId}/GetWorkerAvailableTimes?date=${encodeURIComponent(appointmentDate)}
            &serviceDuration=${encodeURIComponent(serviceDuration)}`, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
            let res = response.data as IAvailableTimeSpan[]
            console.log(res)
            return res

        } catch (e) {

            console.log(e)
            return []

        }
    }

    async getWokerAppointments(workerId: string): Promise<IAppointment[]> {
        try {
            this.refreshIdentity()
            let response = await httpClient.get(`/${this.path}/${workerId}/appointments`, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
            let res = response.data as IAppointment[]
            console.log(res)
            return res

        } catch (e) {

            console.log(e)
            return []

        }
    }
}