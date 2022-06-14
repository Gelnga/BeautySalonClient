<template>
    <div>
        <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create new account</h5>
                        <button type="button" id="registrationFormButtonClose" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">

                        <form class="registration-form" novalidate>
                            <label for="InputEmail" class="form-label">Email address</label>
                            <input v-model="email" type="email" class="form-control" id="InputEmail"
                                placeholder="name@example.com" required>
                            <div class="valid-feedback">
                                Looks good!
                            </div>

                            <label for="PasswordRegister" class="form-label">Password</label>
                            <input v-model="password" type="password" id="PasswordRegister" class="form-control"
                                required>

                            <label for="PasswordRepeatRegister" class="form-label">Repeat password</label>
                            <input type="password" id="PasswordRepeatRegister" class="form-control" required>

                            <label for="firstName" class="form-label">First name</label>
                            <input v-model="firstName" type="text" id="firstName" class="form-control"
                                required>

                                <label for="LastName" class="form-label">Last name</label>
                            <input v-model="lastName" type="text" id="LastName" class="form-control"
                                required>

                            <button type="submit" class="button-highlighted mt-2">Register</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Register from "@/componentsResources/Register"
import type { IJWTResponse } from "@/domain/IJWTResponse";
import { Options, Vue } from "vue-class-component"

@Options ({
    emits: ['renderParent']
})

export default class RegistrationForm extends Vue {
    // Logic
    email: string = ''
    password: string = ''
    firstName: string = ''
    lastName: string = ''
    errorMsg: string | null = null
    register = new Register()

    // UI Look stuff
    setUpRegistrationForm(): void {
        let registerForm = document.querySelector<HTMLFormElement>('.registration-form')!

        // Bootstrap form custom validation
        registerForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            if (registerForm.checkValidity()) {
                let answer = await this.register.register(this.email, this.password, this.firstName, this.lastName)

                this.$cookies.set('JWT', answer!.jwt)
                this.$cookies.set('refreshToken', answer!.refreshToken)

                registerForm.reset()
                this.closeModal()
                this.$emit("renderParent")
                return
            }
            registerForm.classList.add('was-validated')
        }, false)

        let registerPassword = document.querySelector<HTMLInputElement>('#PasswordRegister')!
        let registerPasswordRepeat = document.querySelector<HTMLInputElement>('#PasswordRepeatRegister')!

        registerPassword?.addEventListener('input', (event: Event) => {
            registerPasswordRepeat.dispatchEvent(new InputEvent('input'))
        })

        registerPasswordRepeat?.addEventListener('input', (event: Event) => {

            event.preventDefault()
            if (registerPasswordRepeat.value != registerPassword.value) {
                registerPasswordRepeat.setCustomValidity("Passwords must match")
                return
            }

            registerPasswordRepeat.setCustomValidity("")
        })
    }

    closeModal(): void {
        let closeButton = document.querySelector<HTMLButtonElement>('#registrationFormButtonClose')
        closeButton?.dispatchEvent(new Event('click'))
    }

    async mounted() {
        this.setUpRegistrationForm()
    }
}
</script>