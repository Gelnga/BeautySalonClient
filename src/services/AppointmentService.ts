import type { IAppointment } from "@/domain/IAppointment";
import type { VueCookies } from "vue-cookies";
import { BaseService } from "./BaseService";

export default class appointmentService extends BaseService<IAppointment> {
    constructor(cookies: VueCookies) {
        super("appointments", cookies);
    }
}