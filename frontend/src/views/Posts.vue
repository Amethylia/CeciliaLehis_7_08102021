<template>
    <v-app>
        <NavBar></NavBar>
        <v-container>
            <v-row>
                <v-col
                    cols="12"
                >
                    <h1>Publications</h1>
                    <p v-if="errorPost.length >= 1" class="error_message text-center">{{ errorPost }}</p>
                    <v-row>
                        <Post v-for="post in postList.slice().reverse()" v-bind:key="post.id" :post="post" @deletePost="getPostsList"></Post>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import NavBar from '../components/NavBar'
import Post from '../components/Post'

export default {
    name: 'Posts',
    components: {
        NavBar,
        Post,
    },
    data() {
        return {
            errorPost: "",
            postList: [],
        }
    },
    methods: {
        getPostsList() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            //Utilisation de fetch pour récupérer les données de de toutes les publications
            fetch("http://localhost:3000/api/posts", requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (data) {
                    this.postList = data.resGetAllPostsFunction;
                }
                //Envoie d'une erreur lorsqu'il n'y a pas de publications
                if (!data.resGetAllPostsFunction.length > 0) {
                    this.errorPost = "Aucune publications : Voyez cliquer sur l'avion en papier pour être le premier à publier !";
                }
            })
            .catch(error => console.log(error))
        }
    },
    mounted() {
        //Modification du DOM en récupérant la liste de toutes les publications
        this.getPostsList();
    }
}
</script>

<style>
</style>