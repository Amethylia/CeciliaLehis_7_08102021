<template>
    <main>
        <div class="logo_container">
            <img  src="../assets/logo.svg" alt="logo_groupomania"/>
        </div>
        <div id="login_container" class="container">
            <div class="form_container">
                <h1>Connectez-vous</h1>
                <form class="form">
                    <div class="input_container">
                        <input id="email" v-model="email" type="email" name="email" placeholder="Email" aria-label="Email" required/>
                        <input id="password" v-model="password" type="password" name="password" placeholder="Mot de passe" aria-label="Mot de passe" required/>  
                    </div>
                    <p v-if="error.length > 0" class="error_message">{{error}}</p>
                    <div class="send_container">
                        <button class="button" @click="submit()">Connexion</button>
                        <p>Vous n'avez pas encore de compte ? <a href="/#/signup" class="link">Inscrivez-vous</a></p>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
            email: '',
            password: '',
            error: '',
            }
        },
        methods: {
            submit(){
                if (this.email && this.password) {
                    const url = "http://localhost:3000/api/user/login";
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify( this.email, this.password )
                    }
                    fetch(url, requestOptions)
                    .then(res => res.json())
                    .then((res) => {
                            if (res.userId && res.token) {
                                localStorage.setItem("userId", res.userId)
                                localStorage.setItem("token", res.token)
                                this.$router.push("posts");
                            } else {
                                this.error = res.message
                            }
                        })
                    .catch(error => console.log(error))
                }
            }
        },
        mounted() {
            localStorage.clear();
        }
    };

    //Adapter l'élement à la hauteur de la page de l'utilisateur
    function adaptToWindowSize(){
        var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
    
        var source = document.getElementById('login_container');
        source.style.height = height+'px';
        source.style.width = width+'px';
    }

    // Une fonction de compatibilité pour gérer les évènements
    function addEvent(element, type, listener){
    if(element.addEventListener){
        element.addEventListener(type, listener, false);
    }else if(element.attachEvent){
        element.attachEvent("on"+type, listener);
    }
    }
 
    // On exécute la fonction une première fois au chargement de la page
    addEvent(window, "load", adaptToWindowSize);
    // Puis à chaque fois que la fenêtre est redimensionnée
    addEvent(window, "resize", adaptToWindowSize);
</script>

<style src="../assets/css/style.css"></style>