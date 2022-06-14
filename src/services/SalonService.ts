import type { ISalon } from "@/domain/ISalon";
import type { IService } from "@/domain/IService";
import type { IWorker } from "@/domain/IWorker";
import httpClient from "@/http-client";
import type { VueCookies } from "vue-cookies";
import { BaseService } from "./BaseService";

export default class SalonService extends BaseService<ISalon> {
    constructor(cookies: VueCookies) {
        super("salons", cookies);
    }

    async getServicesBySalonId(id: string): Promise<IService[]> {

        try {

            let response = await httpClient.get(`/${this.path}/${id}/salonServices`, {
            })
            let res = response.data as IService[]
            return res

        } catch (e) {

            console.log(e)
            return []

        }
    }

    async getWorkersBySalonIdAndServiceId(salonId: string, serviceId: string): Promise<IWorker[]> {
        try {

            let response = await httpClient.get(`/${this.path}/${salonId}/workers?serviceId=${serviceId}`, {
            })
            let res = response.data as IWorker[]
            console.log(res)
            return res

        } catch (e) {

            console.log(e)
            return []

        }
    }
}