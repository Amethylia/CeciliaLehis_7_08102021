<template>
    <v-form ref="entryFormNewComment" v-on:submit.prevent="postComment" v-model="valid">
        <v-text-field
            v-model="newComment.comment"
            :rules="commentRules"
            :counter="150"
            label="Ajouter un commentaire"
            id="comment"
            required
        ></v-text-field>
        <v-btn type="submit" class="mt-2 mb-2">Envoyer</v-btn>
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
                v => v.length <= 150 || 'Le commentaire ne doit pas dépasser 150 caractères',
            ]
        }
    },
    methods: {
        postComment() {
            if(this.$refs.entryFormNewComment.validate()) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token"),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        postId: this.post.id,
                        comment: this.newComment.comment
                    }),
                }
                fetch("http://localhost:3000/api/comments", requestOptions)
                .then(response => response.json())
                .then((data) => {
                    this.newComment = data.resSelectComment[0];
                    this.$emit("getNewComment");
                    this.newComment.comment = "";
                })
                .catch(error => console.log(error))
            }
        }
    }
}
</script>

<style>
</style>