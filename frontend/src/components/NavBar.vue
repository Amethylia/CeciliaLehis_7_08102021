<template>
    <header>
        <nav>
            <router-link to="/posts" aria-label="page d'actualités" aria-labelledby="lien">
                <img src="../assets/logo_horizontal.svg" class="logo" alt="logo_groupomania"/>
            </router-link>
            <div class="nav_links">
                <router-link to="/newpost" aria-label="page de création d'une publication" aria-labelledby="lien">
                    <p>publier</p>
                </router-link> 
                <router-link to="/userprofile" aria-label="page du profil utilisateur" aria-labelledby="lien">
                    <p>profil</p>
                </router-link>
                <p @click="logout">se déconnecter</p>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: "NavBar",
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push("/");
        }
    }
}
</script>