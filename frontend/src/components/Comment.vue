<template>
    <div class="comment">
        <p class="comment_content">" {{ comment.comment }} "</p>
        <p class="comment_user">Publier par {{ comment.first_name }} {{ comment.last_name }} le {{ comment.date }}</p>
        <button @click="deleteComment" v-if="comment.user_id == visitorId" type="submit">Supprimer</button>
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
            visitorId: localStorage.getItem("userId")
        }
    },
    methods: {
        deleteComment() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch(`http://localhost:3000/api/comments/:${ this.post.id }/:${ this.comment.id }`, requestOptions)
                .then(response => response.json())
                .then(() => {
                    this.$emit("deleteComment");
                })
                .catch(error => console.log(error))
        },
    }
}
</script>
