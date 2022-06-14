import type { IAppUser } from "@/domain/IAppUser";
import { defineStore } from "pinia";

export const useAppUserStore = defineStore({
    id: "appUser",
    state: () => ({
        appUser: {} as IAppUser
    }),
});