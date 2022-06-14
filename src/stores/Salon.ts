import type { ISalon } from "@/domain/ISalon";
import type { IService } from "@/domain/IService";
import { defineStore } from "pinia";

export const useSalonStore = defineStore({
    id: "salon",
    state: () => ({
        salon: {} as ISalon,
        salonServices: [] as IService[]
    }),
});