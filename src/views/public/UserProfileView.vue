<template>
    <div class="userProfileContentContainer">

        <div class="userData w-50 pt-5 justify-content-center flex-column">
            <div class="d-flex justify-content-between gap-3">
                <h2 class="h2">Email: </h2>
                <h2 class="h2">{{ appUserStore.appUser.email }}</h2>
            </div>
            <div class="d-flex justify-content-between gap-3">
                <h2 class="h2">First name: </h2>
                <h2 class="h2">{{ appUserStore.appUser.firstName }}</h2>
            </div>
            <div class="d-flex justify-content-between gap-3">
                <h2 class="h2">Last name: </h2>
                <h2 class="h2">{{ appUserStore.appUser.lastName }}</h2>
            </div>
        </div>

        <h1 class="h1 py-4">
            My appointments
        </h1>
        <h2 class="h2" v-if="userProfileStore.appointments.length == 0">You don't have any appointments</h2>
        <div class="appointmentsContainer pt-3 w-75">
            <div v-for="appointment of userProfileStore.appointments" :key="appointment.id"
                class="appointmentContainer w-100 m-2">

                <div class="appointmentBarContainer my-1 w-100">

                    <!-- Service bar left part -->
                    <div class="appointmentBarInnerContainer">
                        <h2 class="m-0 p-1">{{ appointment.serviceName }}</h2>
                        <button type="button" class="transparent-button chevron-button px-2" data-bs-toggle="collapse"
                            :data-bs-target="`#descriptionCollapse${appointment.id}`">
                            <img src="../../../node_modules/bootstrap-icons/icons/chevron-down.svg">
                        </button>
                    </div>

                    <!-- Service bar right part -->
                    <div class="appointmentBarInnerContainer">
                        <div class="appointmentPrice">
                            <p class="m-0">
                                <b>Price: {{ appointment.price }}</b>
                            </p>
                        </div>
                        <button
                        v-if="appUserStore.appUser.workerId == null || appUserStore.appUser.workerId == ''"
                            class="transparent-button noselect d-flex justify-content-center align-items-center px-2 mx-2"
                            @click="cancelAppointment(appointment.id!)">
                            <b>Cancel appointment</b>
                        </button>
                    </div>

                </div>

                <div class="collapse" :id="`descriptionCollapse${appointment.id}`">
                    <div class="appointmentDescriptionContainer d-flex flex-column align-items-start">
                        <p class="appointmentDescription m-0 py-2 px-3"><b>Salon name:</b> {{ appointment.salonName }}
                        </p>
                        <p class="appointmentDescription m-0 py-2 px-3"><b>Salon address:</b> {{
                                appointment.salonAddress
                        }}</p>
                        <p class="appointmentDescription m-0 py-2 px-3"><b>Master name:</b> {{ appointment.masterName }}
                        </p>

                        <p class="appointmentDescription m-0 py-2 px-3"><b>Appointment date:</b> {{
                                appointment.appointmentDate
                        }}</p>
                        <p class="appointmentDescription m-0 py-2 px-3"><b>Appointment beggining time:</b> {{
                                appointment.appointmentStart
                        }}</p>
                        <p class="appointmentDescription m-0 py-2 px-3"><b>Appointment ending time:</b> {{
                                appointment.appointmentEnd
                        }}</p>

                        <p class="appointmentDescription m-0 pt-2 pb-3 px-3"><b>Commentary:</b> {{
                                appointment.commentary
                        }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "@/style/views/userprofileview.css";
</style>

<script lang="ts">
import type { IAppointmentCachce } from "@/domain/IAppointmentCache";
import AppointmentService from "@/services/AppointmentService";
import SalonService from "@/services/SalonService";
import ServiceService from "@/services/ServiceService";
import WorkerService from "@/services/WorkerService";
import { useUserProfileStore } from "@/stores/UserProfile";
import { Options, Vue } from "vue-class-component";
import jwtDecode from "jwt-decode";
import type { JwtPayload } from "jwt-decode"
import { IdentityService } from "@/services/IdentityService";
import { useIdentityStore } from "@/stores/Identity";
import { useAppUserStore } from "@/stores/AppUser";

@Options({
    props: {
        id: String
    }
})

export default class UserProfileView extends Vue {
    id!: string

    appointmentService = new AppointmentService(this.$cookies)
    serviceService = new ServiceService(this.$cookies)
    salonService = new SalonService(this.$cookies)
    workerService = new WorkerService(this.$cookies)
    identityService = new IdentityService()

    appUserStore = useAppUserStore()
    userProfileStore = useUserProfileStore()
    identityStore = useIdentityStore()

    async mounted() {
        this.appointmentService = new AppointmentService(this.$cookies)
        this.serviceService = new ServiceService(this.$cookies)
        this.salonService = new SalonService(this.$cookies)
        this.workerService = new WorkerService(this.$cookies)

        await this.identityService.refreshIdentity()
        await this.getUserFromClaims()

        if (this.appUserStore.appUser.roles?.includes("worker")) {
            this.userProfileStore.appointments = await this.workerService.getWokerAppointments(this.appUserStore.appUser.workerId!) as IAppointmentCachce[]
        } else {
            this.userProfileStore.appointments = await this.appointmentService.getAllAuthorize() as IAppointmentCachce[]
        }

        this.userProfileStore.appointments.forEach(async (appointment: IAppointmentCachce) => {
            appointment.serviceName = (await this.serviceService.get(appointment.serviceId)).name

            let salon = await this.salonService.get(appointment.salonId)
            appointment.salonName = salon.name
            appointment.salonAddress = salon.address

            let worker = await this.workerService.get(appointment.workerId)
            appointment.masterName = worker.firstName + " " + worker.lastName
        })

    }

    async cancelAppointment(id: string) {
        this.userProfileStore.appointments = this.userProfileStore.appointments.filter((appointment) => { return appointment.id != id })

        await this.appointmentService.delete(id)
    }

    async getUserFromClaims(): Promise<void> {
        let decoded = await jwtDecode(this.identityStore.jwt?.jwt!) as any;

        console.log(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
        let user = {
            firstName: decoded["FirstName"],
            lastName: decoded["LastName"],
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            workerId: decoded["WorkerID"],
            roles: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string[],
            commentary: null
        }

        this.appUserStore.appUser = user
    }
}

</script>