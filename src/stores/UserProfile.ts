import type { IAppointmentCachce } from "@/domain/IAppointmentCache";
import { defineStore } from "pinia";

export const useUserProfileStore = defineStore({
    id: "userprofile",
    state: () => ({
        appointments: [] as IAppointmentCachce[],
    }),
});