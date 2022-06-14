<template>
    <LogInForm @renderParent="renderHeader()" />
    <RegistrationForm @renderParent="renderHeader()" />
    <div class="overlay"></div>
    <header class="header">
        <nav class="navbar">
            <div class="logo-container">
                <div class="logo">L</div>
                <button type="button" class="nav-menu-button">
                    <img src="../../node_modules/bootstrap-icons/icons/three-dots.svg">
                </button>
            </div>
            <div class="navbar-items">
                <ul>
                    <li>
                        <RouterLink to="/" class="noselect transparent-button">Home</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/blogs" class="noselect transparent-button">Blogs</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/salons" class="noselect transparent-button"><b>Book an appointment</b>
                        </RouterLink>
                    </li>

                    <template v-if="cookies.get('refreshToken') == null">
                        <li><a class="noselect transparent-button" data-bs-toggle="modal"
                                data-bs-target="#logInModal"><b>Log in</b></a></li>
                        <li><a class="noselect button-highlighted" data-bs-toggle="modal"
                                data-bs-target="#registerModal">Register</a></li>
                    </template>

                    <template v-else>
                        <template
                            v-if="isWorkerId()">
                            <li>
                                <RouterLink to="/workerblogs" class="noselect transparent-button"><b>My blog posts</b></RouterLink>
                            </li>
                        </template>
                        <li>
                            <RouterLink to="/profile" class="noselect transparent-button"><b>My profile</b></RouterLink>
                        </li>
                        <li><a class="noselect button-highlighted" @click="logOut()">Log out</a></li>
                    </template>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import type { VueCookies } from "vue-cookies";
import RegistrationForm from "./RegistrationForm.vue";
import LogInForm from "./LogInForm.vue";
import { RouterLink, RouterView } from "vue-router";
import { useAppUserStore } from "@/stores/AppUser";
import jwtDecode from "jwt-decode";

@Options({
    components: { RegistrationForm, LogInForm, RouterView, RouterLink }
})
export default class Header extends Vue {
    cookies!: VueCookies;
    appUserStore = useAppUserStore()

    async mounted(): Promise<void> {
        let navButton = document.querySelector(".nav-menu-button") as HTMLElement
        let navLinks = document.querySelector(".navbar-items") as HTMLElement
        navButton?.addEventListener('click', () => {
            getComputedStyle(navLinks).display == "none" ? navLinks.style.display = "flex" : navLinks.style.display = "none"
        })

        let mediaQuery = window.matchMedia("(max-width: 1000px)")
        mediaQuery.addEventListener('change', () => {
            if (!mediaQuery.matches) {
                navLinks.style.display = "flex"
                return
            }

            navLinks.style.display = "none"
        })
    }

    async created() {
        this.cookies = this.$cookies
        await this.setUpNeededUserData()
    }

    logOut(): void {
        this.$cookies.remove('JWT')
        this.$cookies.remove('refreshToken')
        this.renderHeader()
        this.$router.push("/")
    }

    renderHeader(): void {
        this.$forceUpdate()
        this.setUpNeededUserData()
    }

    async setUpNeededUserData(): Promise<void> {
        let jwt = this.$cookies.get("JWT")
        if (jwt == "" || jwt == null) return
        let decoded = await jwtDecode(jwt) as any;

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

    isWorkerId(): boolean {
        if (this.appUserStore.appUser.workerId != '' && typeof(this.appUserStore.appUser.workerId) != "undefined") {
            return true
        }

        return false
    }
}
</script>

<style>
@import "@/style/components/header.css";
</style>