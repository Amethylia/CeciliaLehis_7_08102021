<template>
    <div>
        <NavBar></NavBar>
        <h1>Actualité</h1>
        <p v-if="errorPost.length >= 1" class="error_message">{{ errorPost }}</p>
        <div>
            <Post v-for="post in postList.slice().reverse()" v-bind:key="post.id" :post="post" @deletePost="getPostsList"></Post>
        </div>
    </div>
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
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            };
            fetch("http://localhost:3000/api/posts", requestOptions)
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
                    this.postList = data.resGetAllPostsFunction;
                }
            })
            .catch((error) => {
                this.errorPost = error.message;
            })
        }
    },
    mounted() {
        this.getPostsList();
    }
}
</script>