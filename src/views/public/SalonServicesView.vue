<template>
    <div class="salonServicesContainer h-100 mx-5 p-2 pt-4">
        <div class="salonServicesHeadContainer">
            <div class="d-flex justify-content-center w-50">
                <img class="img-fluid"
                    src="https://salondechelle.com/wp-content/uploads/2021/01/Salon-Exterior-1-1080x675-1.jpeg"
                    alt="...">
            </div>
            <div class="salonNameContainer w-50 mx-3">
                <h1 class="salonName">{{ salonStore.salon.name }} Services</h1>
            </div>
        </div>
        <div v-for="salonService of salonStore.salonServices" :key="salonService.id!"
            class="salonServicesMainContainer pt-3 h-50">
            <div class="salonServiceBarContainer">

                <div class="serviceContainer my-1">

                    <!-- Service bar left part -->
                    <div class="serviceInnerContainer">
                        <h2 class="m-0 p-1">{{ salonService.name }}</h2>
                        <button type="button" class="transparent-button chevron-button px-2" data-bs-toggle="collapse"
                            :data-bs-target="getCollapseId(salonService.id!, true)">
                            <img src="../../../node_modules/bootstrap-icons/icons/chevron-down.svg">
                        </button>
                    </div>

                    <!-- Service bar right part -->
                    <div class="serviceInnerContainer">
                        <div class="service-price">
                            <p class="m-0">
                                <b>Price: {{ salonService.price }} {{ salonService.unitName }}</b>
                            </p>
                        </div>
                        <RouterLink
                            :to="{ name: 'appointments', params: { salonName: salonStore.salon.name, salonId: salonStore.salon.id, serviceId: salonService.id, serviceName: salonService.name } }"
                            class="transparent-button noselect d-flex justify-content-center align-items-center px-2 mx-2">
                            <b>Book an appointment</b>
                        </RouterLink>
                    </div>

                </div>

                <div class="collapse" :id="getCollapseId(salonService.id!)">
                    <div class="serviceDescriptionContainer">
                        <p class="serviceDescription m-0 pb-3 px-3">{{ salonService.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
@import "@/style/views/salonservicesview.css";
</style>

<script lang="ts">
import { RouterLink } from "vue-router";
import SalonService from "@/services/SalonService";
import { Vue, Options } from "vue-class-component";
import { useSalonStore } from "@/stores/Salon";


@Options({
    props: {
        id: String
    },
    components: {
        RouterLink
    }
})
export default class SalonServicesView extends Vue {
    salonService = new SalonService(this.$cookies)
    salonStore = useSalonStore()
    id!: string

    async mounted(): Promise<void> {
        this.salonStore.salonServices = await this.salonService.getServicesBySalonId(this.id)
        this.salonStore.salon = await this.salonService.get(this.id)
    }

    getCollapseId(id: string, withSelector = false): string {
        let idStr = "collapseService" + id
        if (withSelector) idStr = "#" + idStr
        return idStr
    }
}
</script>