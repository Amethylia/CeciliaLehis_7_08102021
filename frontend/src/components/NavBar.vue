<template>
    <v-app-bar
        fixed
        color="white"
    >
        <router-link to="/posts" aria-label="page d'actualités" aria-labelledby="lien">
            <v-img
                max-height="45"
                max-width="45"
                :src="logoResponsive"
                alt="logo_groupomania"
                class="logo_responsive"
            ></v-img>
            <v-img
                max-height="45"
                :src="logoHorizontal"
                alt="logo_groupomania"
                class="logo"
            ></v-img>
        </router-link>

        <v-spacer></v-spacer>

        <router-link to="/newpost" aria-label="page de création d'une publication" aria-labelledby="lien" class="publish_link mr-8">
            <v-icon>fas fa-paper-plane</v-icon>
        </router-link>

        <router-link to="/userprofile" aria-label="page du profil utilisateur" aria-labelledby="lien" class="mr-3">
            <v-icon>fas fa-user</v-icon>
        </router-link>
        
        <v-icon @click="logout">fas fa-sign-out-alt</v-icon>
    </v-app-bar>
</template>

<script>
export default {
    name: "NavBar",
    data() {
        return {
            logoResponsive: require('../assets/logo/logo.svg'),
            logoHorizontal: require('../assets/logo/logo_horizontal.svg')
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push("/");
        }
    }
}
</script>

<style>
    .logo {
        display: none;
    }

    @media screen and (min-width: 600px) {
        .logo {
            display: flex;
        }

        .logo_responsive {
            display: none;
        }
    }

    .v-application a.publish_link{
        color: #272b54;
        text-decoration: none;
    }

    .v-application a.publish_link .v-toolbar__title{
        font-size: 18px;
    }
</style>