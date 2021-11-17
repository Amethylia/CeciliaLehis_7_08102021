<template>
	<div>
		<NavBar></NavBar>
		<h1>Ajouter une publication</h1>
		<form v-on:submit.prevent="publishPost">
				<label for="title">Titre*
					<input id="title" v-model="postInfo.title" type="text" name="title" aria-label="Email" required/>
				</label>
				<label for="image_url">Image*
					<input v-on:change="uploadImagePost" id="image_url" type="file" accept="image/jpg, image/jpeg, image/png, image/gif, image/webp" name="image" required/>
				</label>
				<label for="description">Description*
					<textarea id="description" v-model="postInfo.description" name="description" aria-label="Description" required></textarea>
				</label>
			<button  type="submit">Publier</button>
           <a href="/#/posts" class="link">Annuler</a>
		</form>
	</div>
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
            postInfo : {
                title: "",
                imageUrl: "",
                description: "",
                userId: localStorage.getItem("userId")
            },
        }
    },
    methods: {
        uploadImagePost(event) {
            this.postInfo.imageUrl = event.target.files[0];
        },
        publishPost() {
            const formData = new FormData();
            formData.append('image', this.postInfo.imageUrl);
            formData.append('title', this.postInfo.title);
            formData.append('description', this.postInfo.description);
            formData.append('userId', this.postInfo.userId);
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                body: formData
            }
            fetch("http://localhost:3000/api/posts", requestOptions)
                .then(response => response.json())
                .then(() => {
                    this.postInfo = {};
                    this.$router.push("posts");
                })
            .catch(error => {
                this.errorMessage = error
            })
        }
    }
}
</script>