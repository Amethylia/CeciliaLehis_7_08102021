<template>
    <form v-on:submit.prevent="postComment">
        <textarea v-model="newComment.comment" placeholder="Ecrivez un commentaire..." required></textarea>
        <button type="submit">Envoyer</button>
    </form>
</template>

<script>
export default {
    name: "NewComment",
    data: () => {
        return {
            newComment : {
                comment: ""
            }
        }
    },
    methods: {
        postComment() {
            const requestOptions = {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newComment)
            }
            fetch("http://localhost:3000/api/comments", requestOptions)
                .then(response => response.json())
                .then(() => {
                    this.newComment.comment = "";
                })
                .catch(error => console.log(error))
        }
    }
}
</script>