<template>
    <v-form v-on:submit.prevent="postComment" v-model="valid">
        <v-text-field
            v-model="newComment.comment"
            :rules="commentRules"
            :counter="150"
            label="Ajouter un commentaire"
            id="comment"
            required
        ></v-text-field>
        <v-btn type="submit" class="mt-2 mb-2" :disabled="!valid">Envoyer</v-btn>
    </v-form>
</template>

<script>
export default {
    name: "NewComment",
    props: {
        post: {
            type: Object
        }
    },
    data: () => {
        return {
            valid: true,
            newComment: {
                comment: ""
            },
            commentRules: [
                v => !!v || "Le commentaire est requis",
                v => v && v.length <= 150 || 'Le commentaire ne doit pas dépasser 150 caractères',
            ]
        }
    },
    methods: {
        postComment() {
            const requestOptions = {
                method: "POST",
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId: this.post.id,
                    comment: this.newComment.comment
                }),
            }
            //Utilisation de fetch pour envoyer les données de la création d'un commentaire
            fetch("http://localhost:3000/api/comments", requestOptions)
            .then(response => response.json())
            .then((data) => {
                //On envoie les nouvelles données dans newComment
                this.newComment = data.resSelectComment[0];
                //On informe le composant parent "Post" d'effectuer le changement
                //(récupérer la liste des commentaires en fonction de l'id de la publication) 
                this.$emit("getNewComment");
                //On vide le champs
                this.newComment.comment = "";
            })
            .catch(error => console.log(error))
        }
    }
}
</script>

<style>
</style>