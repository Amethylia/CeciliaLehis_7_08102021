<template>
    <v-app>
        <v-form ref="entryFormLogin" @submit.prevent="login" v-model="valid">
            <v-container class="login_container">
                <v-img
                    max-height="180px"
                    :src="logoVertical"
                    alt="logo_groupomania"
                    class="logo_logsign"
                ></v-img>
                <h1 class="logSign_title">Connectez-vous</h1>
                <v-row  class="justify-md-center">
                    <v-col
                        cols="12"
                        md="4"
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
                        md="4"
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
                        <p v-if="errorLogin.length >= 1" class="error_message text-center"> {{ errorLogin }} </p>
                        <v-row>
                            <v-col
                                cols="12"
                                class="d-flex align-center justify-md-center"
                            >
                            <v-btn type="submit" class="mr-4">Connexion</v-btn>
                            <span>Vous n'avez pas encore de compte ? <a href="/#/signup" class="link">Inscrivez-vous</a></span>
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
        name: "Login",
        data() {
            return {
                logoVertical: require('../assets/logo/logo_vertical.svg'),
                valid: true,
                email: 'cecilia.lehis@gmail.com',
                password: 'Test20KL20',
                // email: '',
                // password: '',
                errorLogin: '',
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
            login(){
                if (this.$refs.entryFormLogin.validate()) {
                    const user = {
                        "email": this.email,
                        "password": this.password
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    }
                    fetch("http://localhost:3000/api/auth/login", requestOptions)
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
                            localStorage.setItem("userId", data.userId)
                            localStorage.setItem("admin", data.admin)
                            localStorage.setItem("token", data.token)
                            this.$router.push("/posts");
                        }
                    })
                    .catch((error) => {
                        this.errorLogin = error.message;
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