<template>
    <div>
        <div class="modal fade" id="logInModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Log into existing account</h5>
                        <button type="button" id="loginFormButtonClose" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <form class="logIn-form" novalidate>
                            <label for="InputEmailLogin" class="form-label">Email address</label>
                            <input v-model="email" type="email" class="form-control" id="InputEmailLogin"
                                placeholder="name@example.com" required>
                            <div class="valid-feedback">
                                Looks good!
                            </div>

                            <label for="PasswordLogin" class="form-label">Password</label>
                            <input v-model="password" type="password" id="PasswordLogin" class="form-control" required>

                            <button type="submit" class="button-highlighted mt-2">Log In</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import LogIn from "@/componentsResources/LogIn";
import { IdentityService } from "@/services/IdentityService";
import { useAppUserStore } from "@/stores/AppUser";
import { useIdentityStore } from "@/stores/Identity";
import jwtDecode from "jwt-decode";
import { Options, Vue } from "vue-class-component"

@Options({
    emits: ['renderParent']
})

export default class LogInForm extends Vue {
    // Logic
    email: string = ''
    password: string = ''
    errorMsg: string | null = null
    logIn = new LogIn()

    // UI Look stuff
        setUplogInForm(): void {
            let logInForm = document.querySelector<HTMLFormElement>('.logIn-form')!

            // Bootstrap form custom validation
            logInForm.addEventListener('submit', async (event: Event) => {
                event.preventDefault()
                event.stopPropagation()

                if (logInForm.checkValidity()) {
                    let answer = await this.logIn.login(this.email, this.password)

                    this.$cookies.set('JWT', answer!.jwt)
                    this.$cookies.set('refreshToken', answer!.refreshToken)

                    logInForm.reset()
                    this.closeModal()
                    this.$emit("renderParent")
                    return
                }
                logInForm.classList.add('was-validated')
            }, false)
        }

    closeModal(): void {
        let closeButton = document.querySelector<HTMLButtonElement>('#loginFormButtonClose')
        closeButton?.dispatchEvent(new Event('click'))
    }

    async mounted() {
        this.setUplogInForm()
    }
}
</script>