<template>
    <div>
        <div class="post">
            <div class="post_content">
                <h2>{{ post.title }}</h2>
                <img class="post_content_image" :src="post.picture_url" alt="Image"/>
                <p class="post_content_text">{{ post.description }}</p>
                <p class="post_info_name">posté par {{ post.last_name }} {{ post.first_name }}</p>
                <button @click="isActive = !isActive" v-if="post.user_id == visitorId" type="submit">Modifier</button>
                <button @click="deletePost" v-if="post.user_id == visitorId" type="submit">Supprimer</button>
                <form :class="{ active: isActive }">
                    <h3>Modifier la publication</h3>
                    <label for="new_title">Titre*
                        <input id="new_title" v-model="newPost.title" type="text" name="title" aria-label="Email" required/>
                    </label>
                    <label for="new_image_url">Image*
                        <input v-on:change="uploadNewImagePost" id="new_image_url" type="file" accept="image/jpg, image/jpeg, image/png, image/gif, image/webp" name="image" required/>
                    </label>
                    <label for="new_description">Description*
                        <textarea id="new_description" v-model="newPost.description" name="description" aria-label="Description" required></textarea>
                    </label>
                    <button @click="modifyPost">Valider</button>
                </form>
            </div>
            <div class="commments_content">
                <h2>Commentaires</h2>
                <p v-if="errorComment.length >= 1" class="error_message"> {{ errorComment }} </p>
                <Comment v-for="comment in commentList.slice().reverse()" v-bind:key="comment.id" :comment="comment" @deleteComment="getCommentsList"></Comment>
                <NewComment></NewComment>
            </div>
        </div>
    </div>
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
            type: Object
        }
    },
    data: () => {
        return {
            isActive: false,
            newPost: {},
            commentList: [],
            errorComment: "",
            visitorId: localStorage.getItem("userId")
        }
    },
    methods: {
        uploadNewImagePost(event) {
            this.newPost.imageUrl = event.target.files[0];
        },
        modifyPost() {
            const formData = new FormData();
            formData.append('image', this.newPost.imageUrl);
            formData.append('title', this.newPost.title);
            formData.append('description', this.newPost.description);
            formData.append('userId', this.newPost.userId);
            console.log(this.post);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: formData,
            };
            fetch(`http://localhost:3000/api/posts/:${ this.post.id }`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.newPost = {};
                    this.post = data;
                })
                .catch(error => console.log(error))
        },
        deletePost() {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch(`http://localhost:3000/api/posts/:${ this.post.id }`, requestOptions)
                .then(response => response.json())
                .then(() => {
                    this.$emit("deletePost");
                })
                .catch(error => console.log(error))
        },
        getCommentsList() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch(`http://localhost:3000/api/comments/:${ this.post.id }`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then((body) => {
                    throw new Error(body.error)
                })
            })
            .then((data) => {
                if (data) {
                    this.commentList = data.resGetAllCommentsFunction;
                }
            })
            .catch((error) => {
                this.errorComment = error.message;
            })
        }
    },
    mounted() {
        this.getCommentsList();
    }
}
</script>