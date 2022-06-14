<template>
    <div class="appointmentFormContainer">
        <h1 class="h1 mt-4">Book a new appointment</h1>
        <form class="appointmentForm">
            <input class="form-control form-control-lg disabledInput" type="text" v-model="salonName" disabled readonly>

            <select v-model="serviceId" class="form-select form-select-lg mt-4" id="serviceSelect"
                @change="onServiceSelect()">
                <option :value="''" disabled>Choose a service</option>
                <option v-for="salonService of appointmentBookingStore.salonServices" :key="salonService.id!"
                    :value="salonService.id">{{ salonService.name }}</option>
            </select>

            <select v-model="masterId" class="form-select form-select-lg mt-4 disabledInput" id="masterSelect"
                @change="onMasterSelect()">
                <option :value="''" selected disabled>Choose a master</option>
                <option v-for="salonMaster of appointmentBookingStore.salonMasters" :key="salonMaster.id!"
                    :value="salonMaster.id" :data-masterprice="salonMaster.price + ' ' + salonMaster.unitName"
                    :data-serviceduration="salonMaster.serviceDuration">{{
                            salonMaster.firstName
                    }} {{ salonMaster.lastName }}</option>
            </select>

            <select v-model="appointmentDate" class="form-select form-select-lg mt-4 disabledInput" id="dateSelect"
                @change="onDateSelect()">
                <option :value="''" selected disabled>Choose appointment date</option>
                <option v-for="date of getAppointmentDates()" :value="encodeURIComponent(date.toUTCString())">{{
                        date.toDateString()
                }}
                </option>
            </select>

            <select v-model="appointmentTime" class="form-select form-select-lg mt-4" id="timeSelect">
                <option :value="newTimeSpan()" selected disabled>Choose appointment time</option>
                <option :value="time" v-for="time of appointmentBookingStore.availableTimes">{{
                        time["availableStartTime"]
                }}-{{ time["availableEndTime"] }}</option>
            </select>

            <textarea v-model="commentary" class="form-control form-control-lg mt-4" id="appointmentCommentary" rows="3"
                placeholder="Commentary field"></textarea>

            <div class="d-flex justify-content-between w-100 mt-4">
                <div class="d-flex justify-content-center align-items-center">
                    <h2 class="h2 price m-0">
                        Service price: {{ appointmentBookingStore.getAppointmentPrice }}
                    </h2>
                </div>
                <button class="button-highlighted registerAppointmentButton">Register
                    appointment</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
@import "@/style/views/appointmentview.css";
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useAppointmentBookingStore } from "@/stores/Appointment-booking";
import AppointmentService from "@/services/AppointmentService";
import SalonService from "@/services/SalonService";
import type { IAppointment } from "@/domain/IAppointment";
import type { IAvailableTimeSpan } from "@/domain/IAvailableTimeSpan";
import WorkerService from "@/services/WorkerService";

@Options({
    props: {
        salonName: String,
        salonId: String
    },
})
export default class AppointmentView extends Vue {
    salonName!: string
    salonId!: string
    masterId: String = ""
    serviceId: string = ""
    serviceDuration: string = ""
    appointmentDate: string = ""
    appointmentTime: IAvailableTimeSpan = this.newTimeSpan()
    commentary: string = ""

    appointmentBookingStore = useAppointmentBookingStore()

    appointmentService = new AppointmentService(this.$cookies)
    workerService = new WorkerService(this.$cookies)
    salonService = new SalonService(this.$cookies)

    setUpAppointmentBookingForm(): void {
        let appointmentForm = document.querySelector<HTMLFormElement>('.appointmentForm')!

        // Bootstrap form custom validation
        appointmentForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            if (appointmentForm.checkValidity()) {
                let res = await this.appointmentService.add({
                    salonId: this.salonId,
                    serviceId: this.serviceId,
                    workerId: this.masterId as string,
                    appointmentDate: decodeURIComponent(this.appointmentDate),
                    appointmentStart: this.appointmentTime["availableStartTime"],
                    appointmentEnd: this.appointmentTime["availableEndTime"],
                    price: this.appointmentBookingStore.appointment.price,
                    commentary: this.commentary
                })
                appointmentForm.reset()
                this.$router.push("/profile")
                return
            }
            appointmentForm.classList.add('was-validated')
        }, false)
    }

    async mounted(): Promise<void> {
        this.appointmentService = new AppointmentService(this.$cookies)
        this.workerService = new WorkerService(this.$cookies)
        this.salonService = new SalonService(this.$cookies)

        this.appointmentBookingStore.salonServices = await this.salonService.getServicesBySalonId(this.salonId)
        this.appointmentBookingStore.appointment = { "price": "" } as IAppointment

        // Set up select fields
        this.disableSelect("masterSelect")
        this.disableSelect("dateSelect")
        this.disableSelect("timeSelect")

        this.setUpAppointmentBookingForm()
    }

    async onServiceSelect() {
        this.disableSelect("dateSelect")
        this.disableSelect("timeSelect")
        this.reloadSelect("masterSelect")
        this.masterId = ""
        this.appointmentDate = ""
        this.appointmentTime = this.newTimeSpan()
        this.appointmentBookingStore.appointment.price = ""

        let serviceSelect = document.querySelector<HTMLSelectElement>('#serviceSelect')
        let serviceId = serviceSelect?.value

        this.appointmentBookingStore.salonMasters = await this.salonService.getWorkersBySalonIdAndServiceId(this.salonId, serviceId!)
    }

    onMasterSelect() {
        this.disableSelect("timeSelect")
        this.reloadSelect("dateSelect")
        this.appointmentDate = ""
        this.appointmentTime = this.newTimeSpan()

        let selected = this.getSelectedElement("masterSelect")
        this.appointmentBookingStore.appointment.price = selected?.dataset.masterprice as string
        this.serviceDuration = selected?.dataset.serviceduration as string
    }

    async onDateSelect() {
        this.enableSelect("timeSelect")

        this.appointmentTime = this.newTimeSpan()
        this.appointmentBookingStore.availableTimes = await this.workerService.getWorkerAvailableTimes(this.masterId, this.appointmentDate, this.serviceDuration)
    }

    getAppointmentDates(): Date[] {
        let dates = []

        for (let i = 1; i < 14; i++) {
            let date = new Date()
            date.setDate(date.getUTCDate() + i)
            date.setHours(0, 0, 0, 0)
            dates.push(date)
        }

        return dates
    }

    disableSelect(elementId: string): void {
        let select = document.querySelector<HTMLSelectElement>(`#${elementId}`)
        select?.classList.add("disabledInput")
        select!.disabled = true
    }

    enableSelect(elementId: string): void {
        let select = document.querySelector<HTMLSelectElement>(`#${elementId}`)
        select?.classList.remove("disabledInput")
        select!.disabled = false
    }

    reloadSelect(elementId: string): void {
        this.disableSelect(elementId)
        this.enableSelect(elementId)
    }

    getSelectedElement(elementId: string): HTMLOptionElement {
        let select = document.querySelector<HTMLSelectElement>(`#${elementId}`)
        return select?.options[select.selectedIndex]!
    }

    newTimeSpan(): IAvailableTimeSpan {
        return {
            availableStartTime: "",
            availableEndTime: "",
            commentary: null
        }
    }
}

</script>