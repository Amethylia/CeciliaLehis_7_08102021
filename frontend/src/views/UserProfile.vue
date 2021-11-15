<template>
    <div class="user_profile">
        <NavBar></NavBar>
        <h1>Mon profil</h1>
        <p>Nom : {{ userProfile.lastName }}</p>
        <p>Prénom : {{ userProfile.firstName }}</p>
        <p>Email : {{ userProfile.email }}</p>
        <button @click="isActive = !isActive">Modifier mon profil</button>
        <button @click="deleteProfile">Supprimer mon profil</button>
        <form :class="{ active: isActive }">
            <h1>Modifier mon profil</h1>
            <label for="new_lastName">
                <input v-model="newProfile.lastName" id="new_lastName" placeholder="Nom*" required/>
            </label>
            <label for="new_firstName">
                <input v-model="newProfile.firstName" id="new_firstName" placeholder="Prénom*" required/>
            </label>
            <label for="new_email">
                <input v-model="newProfile.email" id="new_email" placeholder="Email*" required/>
            </label>
            <p v-if="updateMessage.length >= 1" class="error_message">{{ updateMessage }}</p>
            <button @click="modifyProfile">Valider</button>
        </form>
    </div>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
    name: 'UserProfile',
    components: {
        NavBar
    },
    data() {
        return {
            isActive: false,
            userProfile: {
                userId: localStorage.getItem("userId"),
                lastName: "",
                firstName: "",
                email: ""
            },
            newProfile: {},
            updateMessage: ""
        }
    },
    methods: {
        getProfile() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch(`http://localhost:3000/api/auth/:${ this.userProfile.userId }`, requestOptions)
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
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newProfile),
            };
            fetch(`http://localhost:3000/api/auth/:${ this.userProfile.userId }`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.userProfile = data;
                    this.newProfile = {};
                    this.$router.push("/userprofile");
                })
                .catch(error => console.log(error))
        },
        deleteProfile() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch(`http://localhost:3000/api/auth/:${ this.userProfile.userId }`, requestOptions)
                .then(response => response.json())
                .then(
                    localStorage.userId = "",
                    localStorage.token = "",
                    this.$router.push("/signup")
                )
                .catch(error => console.log(error))
        },
    },
    mounted() {
        this.getProfile();
    }
}
</script>