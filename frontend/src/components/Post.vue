<template>
    <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
    >
    <v-card class="rounded-xl mb-8">
        <div class="post_container">
            <v-img :src="postData.picture_url" aria-label="Image" class="rounded-t-xl"></v-img>

            <v-card-title class="post_title" v-model="titleValue" >{{ postData.title }}</v-card-title>

            <v-card-text>
                <div>
                    <p class="post_content_text">{{ postData.description }}</p>
                    <p class="post_info_name font-italic">posté par {{ postData.last_name }} {{ postData.first_name }}</p>
                    <v-btn @click="isActive = !isActive" v-if="postData.user_id == visitorId" type="submit" class="mr-4">Modifier</v-btn>
                    <v-btn @click="deletePost" v-if="postData.user_id == visitorId || admin == 1" type="submit" class="delete_button">Supprimer</v-btn> 
                </div>
            </v-card-text>

            <v-form ref="entryFormPost" :class="{ active: isActive }" v-model="valid" class="form_post">
                <v-card-title class="update_title">Modifier la publication</v-card-title>
                <v-col
                    cols="12"
                >
                <v-text-field
                    v-model="newPost.title"
                    label="Titre*"
                    :rules="titleRules"
                    :counter="40"
                    id="new_title"
                    required
                ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                <v-file-input
                    v-on:change="uploadNewImagePost"
                    accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
                    label="Télécharger une image*"
                    id="new_image_url"
                    required
                ></v-file-input>
                </v-col>
                <v-col
                    cols="12"
                >
                <v-text-field
                    v-model="newPost.description"
                    label="Description*"
                    :rules="descriptionRules"
                    :counter="250"
                    id="new_description"
                    required
                ></v-text-field>
                </v-col>
                <v-col>
                    <p v-if="error.title.length >= 1" class="error_message"> {{ error.title }} </p>
                    <p v-if="error.img.length >= 1" class="error_message"> {{ error.img }} </p>
                    <p v-if="error.description.length >= 1" class="error_message"> {{ error.description }} </p>
                    <div class="d-flex align-center">
                        <v-btn @click="modifyPost()" class="mr-4">Valider</v-btn>
                        <v-btn @click="isActive = !isActive" class="cancel_button">Annuler</v-btn>
                    </div> 
                </v-col>
            </v-form>

            <div class="d-flex">
                <v-card-title class="comment_title">Commentaires</v-card-title>
                <v-icon @click="isShow = !isShow">fas fa-chevron-down</v-icon>
            </div>

            <v-col :class="{ show: isShow }" class="comments_container">
                <Comment v-for="comment in commentList.slice().reverse()" v-bind:key="comment.id" :post="post" :comment="comment" @deleteComment="getCommentsList"></Comment>
                <NewComment :post="post" @getNewComment="getCommentsList"></NewComment>
            </v-col>
        </div>
    </v-card>
    </v-col>
</template>

<script>
import Comment from '../components/Comment'
import NewComment from '../components/NewComment'

export default {
    name: "Post",
    components: {
        Comment,
        NewComment
    },
    props: {
        post: {
            type: Object,
        }
    },
    data: () => {
        return {
            postData: Array,
            titleValue: "",
            valid: true,
            isActive: false,
            isShow: false,
            newPost: {
                title: "",
                imageUrl: "",
                description: "",
                userId: localStorage.getItem("userId")
            },
            commentList: [],
            visitorId: localStorage.getItem("userId"),
            admin: localStorage.getItem("admin"),
            error: {
                title: "",
                img: "",
                description: ""
            },
            titleRules: [
                v => !!v || "Le titre est requis",
                v => v && v.length <= 40 || 'Le titre doit avoir moins de 40 caractères',
            ],
            descriptionRules: [
                v => !!v || "La description est requise",
                v => v && v.length <= 250 || 'La description doit avoir moins de 250 caractères',
            ],
        }
    },
    methods: {
        uploadNewImagePost(file) {
            this.newPost.imageUrl = file;
        },
        modifyPost() {
            //On vide les datas erreurs
            this.error.title = "";
            this.error.img = "";
            this.error.description = "";
            //Vérification de la validité du formulaire et si présence d'une image
            if(this.$refs.entryFormPost.validate() && this.newPost.imageUrl)
            {
                //On ajoute l'image, le titre, la description ainsi que l'id du user à l'objet formData
                const formData = new FormData();
                formData.append('image', this.newPost.imageUrl);
                formData.append('title', this.newPost.title);
                formData.append('description', this.newPost.description);
                formData.append('userId', this.newPost.userId);
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        //On intègre le token récupéré du localStorage dans l'authentification
                        'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    },
                    body: formData
                };
                //Utilisation de fetch pour mettre à jour les données d'une publication en fonction de son id
                fetch(`http://localhost:3000/api/posts/${ this.postData.id }`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        //On place les nouvelles données dans newPost
                        this.newPost = {};
                        //On met à jour les anciennes données
                        this.postData = data.resSelectPost[0];
                        //On ferme le formulaire
                        this.isActive = false
                    })
                    .catch(error => console.log(error))
            } else {
                //On vide les datas erreurs
                this.error.title = "";
                this.error.img = "";
                this.error.description = "";
                //Affichage d'un message d'erreur si la vérification échoue
                if(!this.newPost.title)
                {
                    this.error.title = "Veuillez ajouter un titre ";
                }
                if(!this.newPost.imageUrl)
                {
                    this.error.img = "Veuillez télécharger une image";
                }
                if(!this.newPost.description)
                {
                    this.error.description = "Veuillez ajouter une description";
                }
            }
        },
        deletePost() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            //Utilisation de fetch pour supprimer les données d'une publication en fonction de son id
            fetch(`http://localhost:3000/api/posts/${ this.postData.id }`, requestOptions)
                .then(response => response.json())
                .then(() => {
                    //On informe le composant parent "Posts" d'effectuer le changement
                    //(récupérer la liste de toutes les publications)
                    this.$emit("deletePost");
                })
                .catch(error => console.log(error))
        },
        getCommentsList() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
            };
            //Utilisation de fetch pour supprimer les données d'une publication en fonction de son id
            fetch(`http://localhost:3000/api/comments/${ this.post.id }`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.commentList = data.resGetAllCommentsFunction;
            })
            .catch(error => console.log(error))   
        }
    },
    mounted() {
        //Modification du DOM en récupérant la liste de tous les commentaires
        this.getCommentsList();
        //Modification du DOM en changeant la valeur de la prop post évitant l'override
        this.postData = this.post;
    }
}
</script>

<style>
    .v-application .primary--text {
        color: #272b54 !important;
        caret-color: #272b54 !important;
    }

    .form_post {
        display: none;
        margin-top: 20px;
    }

    .form_post.active {
        display: block;
    }

    .v-card__title.post_title {
        font-size: 22px;
    }

    .v-card__title.comment_title {
        font-size: 18px;
    }

    .v-application p.post_content_text {
        margin-bottom: 0;
        font-weight: 500;
    }

    .post_info_name {
        font-size: 14px;
    }

    .update_title.v-card__title {
        padding: 0 16px;
    }

    .comments_container {
        display: none;
    }

    .comments_container.show {
        display: block;
    }
</style>