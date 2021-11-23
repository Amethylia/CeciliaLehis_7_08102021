<template>
    <v-app>
        <NavBar></NavBar>
        <v-container class="mb-5">
            <v-row>
                <v-col
                    cols="12"
                >
                    <h1>Mon profil</h1>
                    <p>Nom : {{ userProfile.lastName }}</p>
                    <p>Prénom : {{ userProfile.firstName }}</p>
                    <p>Email : {{ userProfile.email }}</p>
                    <div class="mt-6">
                        <v-btn @click="isActive = !isActive" class="mr-4">Modifier</v-btn>
                        <v-btn @click="deleteProfile" class="delete_button">Supprimer</v-btn>
                    </div>
                </v-col>    
            </v-row>
        </v-container>
        <v-form v-model="valid" :class="{ active: isActive }" class="form_userprofile">
            <v-container class="mb-8">
                <h2>Modifier mon profil</h2>
            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                <v-text-field
                    v-model="newProfile.lastName"
                    :rules="lastNameRules"
                    :counter="10"
                    label="Nom"
                    id="new_lastName"
                ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                <v-text-field
                    v-model="newProfile.firstName"
                    :rules="firstNameRules"
                    :counter="10"
                    label="Prénom"
                    id="new_firstName"
                ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                <v-text-field
                    v-model="newProfile.email"
                    :rules="emailRules"
                    label="Email"
                    id="new_email"
                ></v-text-field>
                </v-col>
                <v-col>
                    <v-btn @click="modifyProfile" class="mr-4">Valider</v-btn>
                    <v-btn @click="isActive = !isActive" class="cancel_button">Annuler</v-btn>
                </v-col>
            </v-row>
            </v-container>
        </v-form>
    </v-app>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
    name: 'UserProfile',
    components: {
        NavBar
    },
    props: {
        post: {
            type: Object
        }
    },
    data() {
        return {
            isActive: false,
            valid: false,
            userProfile: {
                userId: localStorage.getItem("userId"),
                lastName: "",
                firstName: "",
                email: ""
            },
            newProfile: {},
            lastNameRules: [
                v => v && v.length <= 10 || 'Le nom doit avoir moins de 10 caractères',
            ],
            firstNameRules: [
                v => v && v.length <= 10 || 'Le prénom doit avoir moins de 10 caractères',
            ],
            emailRules: [
                v => /.+@.+/.test(v) || "L'email n'est pas valide",
            ],
        }
    },
    methods: {
        getProfile() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            //Utilisation de fetch pour récupérer les données de l'utilisateur en fonction de son id
            fetch(`http://localhost:3000/api/auth/${ this.userProfile.userId }`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.userProfile.lastName = data.nom;
                    this.userProfile.firstName = data.prenom;
                    this.userProfile.email = data.email;
                })
                .catch(error => console.log(error))
        },
        modifyProfile() {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newProfile),
            };
            //Utilisation de fetch pour mettre à jour les données de l'utilisateur en fonction de son id
            fetch(`http://localhost:3000/api/auth/${ this.userProfile.userId }`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    //On place les nouvelles données dans newProfile
                    this.newProfile = {};
                    //On met à jour les anciennes données
                    this.userProfile.lastName = data.nom;
                    this.userProfile.firstName = data.prenom;
                    this.userProfile.email = data.email;
                    //On ferme le formulaire
                    this.isActive = false
                })
                .catch(error => console.log(error))
        },
        deleteProfile() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            //Utilisation de fetch pour supprimer les données de l'utilisateur en fonction de son id
            fetch(`http://localhost:3000/api/auth/${ this.userProfile.userId }`, requestOptions)
                .then(response => response.json())
                .then(
                    //On vide le userId et le token du localStorage
                    localStorage.userId = "",
                    localStorage.token = "",
                    //On va renvoyer l'utilisateur vers la page d'inscription
                    this.$router.push("/signup")
                )
                .catch(error => console.log(error))
        }
    },
    mounted() {
        //Modification du DOM en récupérant le profil
        this.getProfile();
    }
}
</script>

<style>
    .v-application .primary--text {
        color: #272b54 !important;
        caret-color: #272b54 !important;
    }

    .form_userprofile {
        display: none;
    }

    .form_userprofile.active {
        display: block;
    }
</style>