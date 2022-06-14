import type { IAppointment } from "@/domain/IAppointment";
import type { IAvailableTimeSpan } from "@/domain/IAvailableTimeSpan";
import type { IService } from "@/domain/IService";
import type { IWorker } from "@/domain/IWorker";
import { defineStore } from "pinia";

export const useAppointmentBookingStore = defineStore({
    id: "appointmentBooking",
    state: () => ({
        salonServices: [] as IService[],
        salonMasters: [] as IWorker[],
        appointment: {} as IAppointment,
        availableTimes: [] as IAvailableTimeSpan[]
    }),
    getters: {
        getAppointmentPrice: (state) => typeof(state.appointment.price) != "undefined" ? state.appointment.price : "",
    },
});