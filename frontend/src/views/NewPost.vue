<template>
	<v-app>
		<NavBar></NavBar>
        <v-form ref="entryFormNewPost" v-on:submit.prevent="publishPost" v-model="valid">
            <v-container>
                <h1>Ajouter une publication</h1>
                <v-row>
                    <v-col
                        cols="12"
                        md="4"
                    >
                    <v-text-field
                        v-model="postInfo.title"
                        :rules="titleRules"
                        :counter="40"
                        label="Titre*"
                        id="title_post"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                    <v-file-input
                        v-on:change="uploadImagePost"
                        accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
                        label="Télécharger une image*"
                        id="image_post"
                        required
                    ></v-file-input>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                    <v-text-field
                        v-model="postInfo.description"
                        :rules="descriptionRules"
                        :counter="250"
                        label="Description*"
                        id="description_post"
                        required
                    ></v-text-field>
                    </v-col>
                        <v-col>
                           <p v-if="errorNewPost.length >= 1" class="error_message"> {{ errorNewPost }} </p>
                            <div class="d-flex align-center">
                                <v-btn type="submit" class="mr-4">Publier</v-btn>
                                <v-btn @click="goToPosts" class="cancel_button">Annuler</v-btn>
                            </div> 
                        </v-col>
                </v-row>
            </v-container>
        </v-form>
	</v-app>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
    name: 'NewPost',
    components: {
        NavBar
    },
    data: () => {
        return {
            valid: true,
            postInfo: {
                title: "",
                imageUrl: "",
                description: "",
                userId: localStorage.getItem("userId")
            },
            errorNewPost: "",
            titleRules: [
                v => !!v || 'Le titre est requis',
                v => v && v.length <= 40 || 'Le titre doit avoir moins de 40 caractères'
            ],
            descriptionRules: [
                v => !!v || 'La description est requise',
                v => v && v.length <= 250 || 'La description doit avoir moins de 250 caractères'
            ],
        }
    },
    methods: {
        goToPosts() {
            this.$router.push("posts");
        },
        uploadImagePost(file) {
            this.postInfo.imageUrl = file;
        },
        publishPost() {
            //Vérification de la validité du formulaire et si présence d'une image
            if(this.$refs.entryFormNewPost.validate() && this.postInfo.imageUrl)
            {
                //On ajoute l'image, le titre, la description ainsi que l'id du user à l'objet formData
                const formData = new FormData();
                formData.append('image', this.postInfo.imageUrl);
                formData.append('title', this.postInfo.title);
                formData.append('description', this.postInfo.description);
                formData.append('userId', this.postInfo.userId);
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        //On intègre le token récupéré du localStorage dans l'authentification
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: formData
                }
                //Utilisation de fetch pour envoyer les données de la création d'une publication
                fetch("http://localhost:3000/api/posts", requestOptions)
                    .then(response => response.json())
                    .then(() => {
                        //On envoie les nouvelles données dans newPostInfo
                        this.postInfo = {};
                        //On va renvoyer l'utilisateur vers la page de toutes les publications
                        this.$router.push("posts");
                    })
                .catch(error => console.log(error))
            }
            else {
                this.errorNewPost = "Veuillez remplir les champs !";
            }
        }
    }
}
</script>

<style>
    .v-application .primary--text {
        color: #272b54 !important;
        caret-color: #272b54 !important;
    }
</style>