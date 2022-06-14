    import type { IAvailableTimeSpan } from "@/domain/IAvailableTimeSpan";
    import type { IService } from "@/domain/IService";
    import type { IWorker } from "@/domain/IWorker";
    import httpClient from "@/http-client";
    import type { VueCookies } from "vue-cookies";
    import { BaseService } from "./BaseService";

    export default class serviceService extends BaseService<IService> {
        constructor(cookies: VueCookies) {
            super("services", cookies);
        }
    }