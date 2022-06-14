import type { ISalon } from "@/domain/ISalon";
import { defineStore } from "pinia";

export const useSalonsStore = defineStore({
    id: "salons",
    state: () => ({
        salons: [] as ISalon[],
    }),
});