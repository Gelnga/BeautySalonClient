<template>
    <div class="salonsCatalog mx-5 mt-4 p-2">
        <div  v-for="salon of salonStore.salons" :key="salon.id!"  class="card m-3" style="width: 25rem;">
            <img src="https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">{{ salon.name }}</h5>
                <p class="card-text">{{ salon.description }}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li><RouterLink :to="{ name: 'salonServices', params: { id: salon.id } }" class="button-highlighted noselect">View services</RouterLink></li>
                <li><RouterLink :to="{ name: 'appointments', params: { salonId: salon.id, salonName: salon.name } }" class="transparent-button noselect">Book an appointment</RouterLink></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@import "@/style/views/salonsview.css";
</style>

<script lang="ts">
import SalonService from "@/services/SalonService";
import { useSalonsStore } from "@/stores/Salons";
import { Vue, Options } from "vue-class-component";
import { RouterLink } from "vue-router";

@Options ({
    components: {RouterLink}
})
export default class SalonsView extends Vue {
    salonsService = new SalonService(this.$cookies)
    salonStore = useSalonsStore()

    async mounted(): Promise<void> {
        this.salonStore.salons = await this.salonsService.getAllAuthorize()
    }
}
</script>