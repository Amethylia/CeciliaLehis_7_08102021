<template>
    <div class="comment">
        <p class="mb-0">" {{ comment.comment }} "</p>
        <p class="comment_user font-italic">Publier par {{ comment.first_name }} {{ comment.last_name }} le {{ comment.date }}</p>
        <v-btn @click="deleteComment" v-if="comment.user_id == visitorId || admin == 1" type="submit" class="delete_button mb-4">Supprimer</v-btn>
    </div>
</template> 

<script>
export default {
    name: "Comment",
    props: {
        comment: {
            type: Object
        },
        post: {
            type: Object
        }
    },
    data: () => {
        return {
            visitorId: localStorage.getItem("userId"),
            admin: localStorage.getItem("admin")
        }
    },
    methods: {
        deleteComment() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    //On intègre le token récupéré du localStorage dans l'authentification
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            //Utilisation de fetch pour supprimer les données d'un commentaire en fonction de son id et de celui de la publication
            fetch(`http://localhost:3000/api/comments/${ this.post.id }/${ this.comment.id }`, requestOptions)
                .then(response => response.json())
                .then(() => {
                    //On informe le composant parent "Post" d'effectuer le changement
                    //(récupérer la liste des commentaires en fonction de l'id de la publication) 
                    this.$emit("deleteComment")
                })
                .catch(error => console.log(error))
        },
    }
}
</script>

<style>
    .comment_user {
        font-size: 14px;
    }
</style>