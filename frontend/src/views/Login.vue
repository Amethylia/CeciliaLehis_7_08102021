<template>
    <main>
        <div class="logo_container">
            <img  src="../assets/logo.svg" alt="logo_groupomania"/>
        </div>
        <div id="login_container" class="container">
            <div class="form_container">
                <h1>Connectez-vous</h1>
                <form @submit.prevent="login" class="form">
                    <div class="input_container">
                        <input v-model="email" type="email" name="email" placeholder="Email*" aria-label="Email" required/>
                        <input v-model="password" type="password" name="password" placeholder="Mot de passe*" aria-label="Mot de passe" required/>  
                    </div>
                    <p v-if="error.length >= 1" class="error_message">{{error}}</p>
                    <div class="send_container">
                        <button class="button" type="submit">Connexion</button>
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
            email: 'cecilia.lehis30@gmail.com',
            password: 'Test20KL20',
            error: '',
            }
        },
        methods: {
            login(){
                const user = {
                    "email": this.email,
                    "password": this.password
                }
                if (user.email && user.password) {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    }
                    fetch("http://localhost:3000/api/auth/login", requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                            if (data.userId && data.token) {
                                localStorage.setItem("userId", data.userId)
                                localStorage.setItem("token", data.token)
                                this.$router.push("/posts");
                            } else {
                                this.error = data.message
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