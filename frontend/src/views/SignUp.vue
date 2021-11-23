<template>
    <v-app>
        <v-form ref="entryForm" @submit.prevent="signup" v-model="valid">
            <v-container class="signup_container">
                <v-img
                    max-height="180px"
                    :src="logoVertical"
                    alt="logo_groupomania"
                    class="logo_logsign"
                ></v-img>
                <h1 class="logSign_title">Inscrivez-vous</h1>
                <v-row>
                    <v-col
                        cols="12"
                        md="3"
                    >
                    <v-text-field
                        v-model="lastName"
                        :rules="lastNameRules"
                        :counter="10"
                        label="Nom*"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="3"
                    >
                    <v-text-field
                        v-model="firstName"
                        :rules="firstNameRules"
                        :counter="10"
                        label="Prénom*"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="3"
                    >
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="Email*"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="3"
                    >
                    <v-text-field
                        v-model="password"
                        type="password"
                        label="Mot de passe*"
                        :rules="passwordRules"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-container>
                        <p v-if="errorSignup.length >= 1" class="error_message text-center"> {{ errorSignup }} </p>
                        <v-row>
                            <v-col
                                cols="12"
                                class="d-flex align-center justify-md-center"
                            >
                            <v-btn type="submit" class="mr-4">Inscription</v-btn>
                            <span>Vous avez déjà un compte ? <a href="/#/" class="link">Connectez-vous</a></span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-row>
            </v-container>
        </v-form>
    </v-app>
</template>

<script>
    export default {
        name: "SignUp",
        data() {
            return {
                logoVertical: require('../assets/logo/logo_vertical.svg'),
                valid: true,
                lastName: '',    
                firstName: '',
                email: '',
                password: '',
                errorSignup: '',
                lastNameRules: [
                    v => !!v || "Le nom est requis",
                    v => v.length <= 10 || 'Le nom doit avoir moins de 10 caractères',
                ],
                firstNameRules: [
                    v => !!v || "Le prénom est requis",
                    v => v.length <= 10 || 'Le prénom doit avoir moins de 10 caractères',
                ],
                emailRules: [
                    v => !!v || "L'email est requis",
                    v => /.+@.+/.test(v) || "L'email n'est pas valide",
                ],
                passwordRules: [
                    v => !!v || 'Le mot de passe est requis'
                ],
            }
        },
        methods: {
            signup(){
                if (this.$refs.entryForm.validate()) {
                    const user = {
                        "lastName": this.lastName,
                        "firstName": this.firstName,
                        "email": this.email,
                        "password": this.password
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    }
                    fetch("http://localhost:3000/api/auth/signup", requestOptions)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        return response.json().then((body) => {
                            throw new Error(body.error)
                        })
                    })
                    .then((data) => {
                            if (data.userId && data.token) {
                                localStorage.setItem("userId", data.userId);
                                localStorage.setItem("admin", data.admin);
                                localStorage.setItem("token", data.token);
                                this.$router.push("/posts");
                            }
                        })
                    .catch((error) => {
                        this.errorSignup = error.message;
                    })
                }
            }
        },
        mounted() {
            localStorage.clear();
        }
    };
</script>

<style>
    .v-application a{
        color: #FD2D01;
    }

    .v-application .primary--text {
        color: #272b54 !important;
        caret-color: #272b54 !important;
    }
</style>